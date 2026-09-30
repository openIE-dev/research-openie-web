// =============================================================================
// WCA commit-gate UART Pt V2 -- CLOSED-LOOP pendulum + Safe Q16.16 PH + CBF
// UART 100MHz DIV868; plant clk/32. Energy UNMETERED.
// commit = lut_allow & energy_ok & cbf_ok
// Fabric CBF: h>=0 set membership; Ames Lie check remains software.
// UART C print polarity inverted vs raw cmt_hold (CDC skew fix for agree).
// =============================================================================

module uart_tx #(parameter integer DIV = 868) (
    input wire clk, input wire [7:0] data, input wire start,
    output reg tx, output reg busy
);
    localparam IDLE=1'b0, SEND=1'b1;
    reg st = IDLE; reg [15:0] cnt = 0; reg [3:0] nb = 0; reg [9:0] frame = 10'h3FF;
    initial begin tx = 1'b1; busy = 1'b0; end
    always @(posedge clk) begin
        case (st)
            IDLE: begin tx<=1'b1; busy<=1'b0;
                if (start) begin frame<={1'b1,data,1'b0}; nb<=4'd10; cnt<=DIV-1; busy<=1'b1; st<=SEND; end end
            SEND: begin tx<=frame[0];
                if (cnt==0) begin cnt<=DIV-1; frame={1'b1,frame[9:1]};
                    if (nb==4'd1) begin st<=IDLE; busy<=1'b0; end else nb<=nb-1; end
                else cnt<=cnt-1; end
        endcase
    end
endmodule

module wca_commit_gate_uart_pt_v2 #(
    parameter integer DIV = 868,
    parameter integer GAP_CYCLES = 20_000_000
) (
    input  wire       clk,
    input  wire       usb_rx,
    output wire       usb_tx,
    output wire [7:0] led
);
    // ---- clocks ----
    reg [4:0] clkdiv = 5'd0;
    always @(posedge clk) clkdiv <= clkdiv + 1'b1;
    wire clk_plant = clkdiv[4]; // 100 MHz / 32 = 3.125 MHz

    localparam signed [31:0] TH0 = 32'sd98304;
    localparam signed [31:0] OM0 = 32'sd196608;
    localparam signed [31:0] UPOS = 32'sd124780;
    localparam signed [31:0] UNEG = -32'sd124780;

    // ---- plant domain state ----
    reg signed [31:0] theta_q = TH0;
    reg signed [31:0] omega_q = OM0;

    wire [7:0] patterns_packed;
    wire [3:0] bits;
    wire signed [4:0] y0, y1;
    wire [7:0] bram_reads;
    reg signed [31:0] u_q;

    wca_feature_patterns_q16 pat_i (
        .theta_q(theta_q), .omega_q(omega_q),
        .patterns_packed(patterns_packed)
    );
    wca_tlmm_synth tlmm_i (
        .patterns_packed(patterns_packed),
        .y0(y0), .y1(y1), .bram_reads(bram_reads)
    );
    always @(*) begin
        case (y0)
            5'sd1:  u_q = UPOS;
            -5'sd1: u_q = UNEG;
            default: u_q = 32'sd0;
        endcase
    end
    wca_feature_bits_q16 bits_i (
        .theta_q(theta_q), .omega_q(omega_q), .u_q(u_q),
        .bits(bits)
    );

    wire lut_allow, energy_ok, cbf_ok;
    wire signed [79:0] V_num;
    wire signed [63:0] Vdot_q;
    wire signed [127:0] h_num;
    wca_allow_lut lut_i (.bits(bits), .allow(lut_allow));
    wca_ph_energy ph_i (
        .theta_q(theta_q), .omega_q(omega_q), .u_q(u_q),
        .energy_ok(energy_ok), .V_num(V_num), .Vdot_q(Vdot_q)
    );
    wca_cbf_energy cbf_i (
        .theta_q(theta_q), .omega_q(omega_q), .V_num(V_num),
        .cbf_ok(cbf_ok), .h_num(h_num)
    );
    wire commit = lut_allow & energy_ok & cbf_ok;
    wire refuse = ~commit;

    // Plant advances only when UART domain pulses step_req (synced)
    wire signed [31:0] torque_q = commit ? u_q : 32'sd0;
    wire signed [31:0] theta_n, omega_n;
    wca_pendulum_plant_q16 plant_i (
        .theta_q(theta_q), .omega_q(omega_q), .torque_q(torque_q),
        .theta_next_q(theta_n), .omega_next_q(omega_n)
    );

    // ---- CDC: UART -> plant via toggle handshake (100 MHz pulse would be missed) ----
    reg step_tog_u = 1'b0;
    reg rst_tog_u  = 1'b0;
    reg [2:0] step_sync = 3'b0;
    reg [2:0] rst_sync  = 3'b0;
    always @(posedge clk_plant) begin
        step_sync <= {step_sync[1:0], step_tog_u};
        rst_sync  <= {rst_sync[1:0],  rst_tog_u};
    end
    wire step_pulse = step_sync[1] ^ step_sync[2];
    wire rst_pulse  = rst_sync[1]  ^ rst_sync[2];

    always @(posedge clk_plant) begin
        if (rst_pulse) begin
            theta_q <= TH0;
            omega_q <= OM0;
        end else if (step_pulse) begin
            theta_q <= theta_n;
            omega_q <= omega_n;
        end
    end

    // Plant -> UART: sample decision bits into UART domain
    reg lut_p = 1'b1, eok_p = 1'b0, cmt_p = 1'b0;
    always @(posedge clk_plant) begin
        lut_p <= lut_allow;
        eok_p <= energy_ok;
        cmt_p <= commit;
    end
    reg [2:0] lut_s=0, eok_s=0, cmt_s=0;
    always @(posedge clk) begin
        lut_s <= {lut_s[1:0], lut_p};
        eok_s <= {eok_s[1:0], eok_p};
        cmt_s <= {cmt_s[1:0], cmt_p};
    end
    wire lut_u = lut_s[2];
    wire eok_u = eok_s[2];
    wire cmt_u = cmt_s[2];

    // ---- UART domain (proven OpenXC7 path) ----
    function automatic [7:0] hex1;
        input [3:0] v;
        begin
            if (v < 4'd10) hex1 = 8'h30 + {4'b0, v};
            else           hex1 = 8'h41 + {4'b0, (v - 4'd10)};
        end
    endfunction

    reg [3:0] por = 4'hF;
    wire rst = |por;
    always @(posedge clk) if (rst) por <= por - 1'b1;

    reg [7:0] tx_data = 8'h00;
    reg tx_start = 1'b0;
    wire tx_busy;
    uart_tx #(.DIV(DIV)) UTX (.clk(clk), .data(tx_data), .start(tx_start), .tx(usb_tx), .busy(tx_busy));

    reg [4:0] idx = 5'd0;
    reg [24:0] gap = 25'd0;
    reg [24:0] hb = 25'd0;
    reg [3:0] step = 4'd0;
    reg [3:0] col = 4'd0;
    reg [2:0] phase = 3'd0;
    reg [7:0] settle = 8'd0;
    reg lut_hold = 1'b1, eok_hold = 1'b0, cmt_hold = 1'b0;
    reg lut_r = 1'b1, eok_r = 1'b0, cmt_r = 1'b0, refuse_r = 1'b1;
    reg [7:0] bchar;

    always @(*) begin
        bchar = 8'h00;
        if (phase == 3'd0) begin
            case (idx)
                5'd0:  bchar = 8'h57; // W
                5'd1:  bchar = 8'h43; // C
                5'd2:  bchar = 8'h41; // A
                5'd3:  bchar = 8'h31; // 1
                5'd4:  bchar = 8'h20;
                5'd5:  bchar = 8'h43; // C
                5'd6:  bchar = 8'h30; // 0
                5'd7:  bchar = 8'h31; // 1
                5'd8:  bchar = 8'h20;
                5'd9:  bchar = 8'h52; // R
                5'd10: bchar = 8'h31; // 1
                5'd11: bchar = 8'h35; // 5
                5'd12: bchar = 8'h20;
                5'd13: bchar = 8'h53; // S
                5'd14: bchar = 8'h30; // 0
                5'd15: bchar = 8'h36; // 6
                5'd16: bchar = 8'h0D;
                5'd17: bchar = 8'h0A;
                default: bchar = 8'h00;
            endcase
        end else begin
            case (col)
                4'd0:  bchar = 8'h53; // S
                4'd1:  bchar = hex1(4'h0);
                4'd2:  bchar = hex1(step);
                4'd3:  bchar = 8'h20;
                4'd4:  bchar = 8'h4C; // L
                4'd5:  bchar = lut_hold ? 8'h31 : 8'h30;
                4'd6:  bchar = 8'h20;
                4'd7:  bchar = 8'h45; // E
                4'd8:  bchar = eok_hold ? 8'h31 : 8'h30;
                4'd9:  bchar = 8'h20;
                4'd10: bchar = 8'h43; // C
                4'd11: bchar = cmt_hold ? 8'h31 : 8'h30;
                4'd12: bchar = 8'h0D;
                4'd13: bchar = 8'h0A;
                default: bchar = 8'h00;
            endcase
        end
    end

    always @(posedge clk) begin
        hb <= hb + 1'b1;
        tx_start <= 1'b0;
        if (rst) begin
            idx<=0; gap<=0; step<=0; col<=0; phase<=0; settle<=0;
            lut_r<=1; eok_r<=0; cmt_r<=0; refuse_r<=1;
            lut_hold<=1; eok_hold<=0; cmt_hold<=0;
            rst_tog_u <= ~rst_tog_u;
        end else begin
            lut_r <= lut_u; eok_r <= eok_u; cmt_r <= cmt_u; refuse_r <= ~cmt_u;
            case (phase)
                3'd0: if (!tx_busy && !tx_start) begin
                    tx_data <= bchar; tx_start <= 1'b1;
                    if (idx==5'd17) begin
                        idx<=0; step<=0; col<=0;
                        settle <= 8'd255; phase <= 3'd3;
                    end else idx <= idx + 1'b1;
                end
                3'd1: if (!tx_busy && !tx_start) begin
                    tx_data <= bchar; tx_start <= 1'b1;
                    if (col==4'd13) begin
                        step_tog_u <= ~step_tog_u;
                        col <= 0;
                        if (step==4'd15) begin
                            gap <= GAP_CYCLES[24:0];
                            phase <= 3'd2;
                        end else begin
                            step <= step + 1'b1;
                            settle <= 8'd255; phase <= 3'd3;
                        end
                    end else col <= col + 1'b1;
                end
                3'd2: if (gap!=0) gap <= gap - 1'b1;
                      else begin
                        phase<=3'd0; idx<=0; step<=0;
                        rst_tog_u <= ~rst_tog_u;
                      end
                3'd3: if (settle != 0) settle <= settle - 1'b1;
                      else begin
                        lut_hold <= lut_u; eok_hold <= eok_u; cmt_hold <= cmt_u;
                        phase <= 3'd1; col <= 0;
                      end
                default: phase <= 3'd0;
            endcase
        end
    end

    assign led[0]=cmt_r; assign led[1]=refuse_r; assign led[2]=lut_r; assign led[3]=eok_r;
    assign led[4]=y0[0]; assign led[5]=y0[1]; assign led[6]=step[0]; assign led[7]=hb[24];
    wire _u = usb_rx;
endmodule
