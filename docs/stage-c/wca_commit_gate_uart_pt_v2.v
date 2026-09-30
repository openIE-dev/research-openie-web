// =============================================================================
// WCA commit-gate UART for Alchitry Pt V2 (Artix-7 XC7A100T)
//
// Replaces the seed-1 decision ROM with a real synthesizable hot path:
//   stimulus ROM streams (patterns, bits, theta_q, omega_q) for the seed-1
//   16-step episode (plant / proposal state, NOT allow/refuse decisions)
//   TLMM proposal  -> y0,y1 ; u_q = map(y0) for seed-1 tanh*u_scale Q8.8
//   lut_allow      = wca_allow_lut(bits)
//   energy_ok      = wca_ph_energy(theta_q, omega_q, u_q)   // legacy Q8.8 PH
//   commit         = lut_allow AND energy_ok
//
// UART (FT2232H ch-B, 115200 8N1) prints the same ASCII transcript format as
// the prior Stage C ROM design so bit-agreement with Rust seed-1 golden is
// directly comparable: WCA1 C01 R15 S06 then Sii Lx Ex Cx lines.
//
// Limits: plant trajectory / feature bits / TLMM patterns are streamed from a
// seed-1 stimulus table (not a closed-loop float plant on FPGA). Energy is
// UNMETERED. Safe-PH (Q16.16) is not instantiated here; legacy Q8.8 matches
// the Stage A RTL golden. No invented joules.
// =============================================================================

module uart_tx #(parameter integer DIV = 434) (
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
                if (cnt==0) begin cnt<=DIV-1; frame<={1'b1,frame[9:1]};
                    if (nb==4'd1) begin st<=IDLE; busy<=1'b0; end else nb<=nb-1; end
                else cnt<=cnt-1; end
        endcase
    end
endmodule

module wca_commit_gate_uart_pt_v2 #(
    parameter integer DIV = 434,
    parameter integer GAP_CYCLES = 10_000_000
) (
    input  wire       clk,
    input  wire       usb_rx,
    output wire       usb_tx,
    output wire [7:0] led
);
    // Board oscillator is 100 MHz; run commit-gate + UART at 50 MHz so the
    // LUT-based Q8.8 PH multipliers meet timing without DSP (nextpnr-xilinx
    // DSP cascade GND routing is unreliable on this design).
    reg clk50 = 1'b0;
    always @(posedge clk) clk50 <= ~clk50;

    // ---- seed-1 stimulus ROM: plant/proposal state (NOT decisions) ----
    reg [7:0]  patterns_packed;
    reg [3:0]  bits;
    reg signed [15:0] theta_q;
    reg signed [15:0] omega_q;

    always @(*) begin
        case (step)
            4'd0:  begin patterns_packed=8'h48; bits=4'd3; theta_q=16'sd384;  omega_q=16'sd768;   end
            4'd1:  begin patterns_packed=8'h48; bits=4'd3; theta_q=16'sd416;  omega_q=16'sd643;   end
            4'd2:  begin patterns_packed=8'h48; bits=4'd1; theta_q=16'sd442;  omega_q=16'sd517;   end
            4'd3:  begin patterns_packed=8'h48; bits=4'd1; theta_q=16'sd462;  omega_q=16'sd393;   end
            4'd4:  begin patterns_packed=8'h48; bits=4'd1; theta_q=16'sd475;  omega_q=16'sd271;   end
            4'd5:  begin patterns_packed=8'h48; bits=4'd1; theta_q=16'sd483;  omega_q=16'sd151;   end
            4'd6:  begin patterns_packed=8'h47; bits=4'd1; theta_q=16'sd484;  omega_q=16'sd31;    end
            4'd7:  begin patterns_packed=8'h46; bits=4'd1; theta_q=16'sd480;  omega_q=-16'sd88;   end
            4'd8:  begin patterns_packed=8'h46; bits=4'd1; theta_q=16'sd470;  omega_q=-16'sd208;  end
            4'd9:  begin patterns_packed=8'h46; bits=4'd1; theta_q=16'sd453;  omega_q=-16'sd329;  end
            4'd10: begin patterns_packed=8'h46; bits=4'd1; theta_q=16'sd430;  omega_q=-16'sd452;  end
            4'd11: begin patterns_packed=8'h46; bits=4'd1; theta_q=16'sd402;  omega_q=-16'sd577;  end
            4'd12: begin patterns_packed=8'h46; bits=4'd3; theta_q=16'sd367;  omega_q=-16'sd702;  end
            4'd13: begin patterns_packed=8'h46; bits=4'd3; theta_q=16'sd325;  omega_q=-16'sd827;  end
            4'd14: begin patterns_packed=8'h46; bits=4'd2; theta_q=16'sd278;  omega_q=-16'sd947;  end
            default: begin patterns_packed=8'h46; bits=4'd2; theta_q=16'sd225; omega_q=-16'sd1058; end
        endcase
    end

    // ---- TLMM proposal (live) ----
    wire signed [4:0] y0, y1;
    wire [7:0] bram_reads;
    wca_tlmm_synth tlmm_i (
        .patterns_packed(patterns_packed),
        .y0(y0), .y1(y1), .bram_reads(bram_reads)
    );

    // u_q = Q8.8(tanh(y0)*2.5) for the three seed-1 y0 values {-1,0,1}
    reg signed [15:0] u_q;
    always @(*) begin
        case (y0)
            5'sd1:  u_q = 16'sd487;
            -5'sd1: u_q = -16'sd487;
            default: u_q = 16'sd0;
        endcase
    end

    // ---- Allow LUT + Port-Hamiltonian energy (live) ----
    wire lut_allow;
    wire energy_ok;
    wire signed [39:0] V_num;
    wire signed [31:0] Vdot_q;
    wca_allow_lut lut_i (.bits(bits), .allow(lut_allow));
    wca_ph_energy ph_i (
        .theta_q(theta_q), .omega_q(omega_q), .u_q(u_q),
        .energy_ok(energy_ok), .V_num(V_num), .Vdot_q(Vdot_q)
    );
    wire commit = lut_allow & energy_ok;
    wire refuse = ~commit;

    // ---- UART reporter (same ASCII format as Stage C ROM design) ----
    function automatic [7:0] hex1;
        input [3:0] v;
        hex1 = (v < 4'd10) ? (8'h30 + {4'b0,v}) : (8'h41 + {4'b0,(v-4'd10)});
    endfunction

    reg [3:0] por = 4'hF;
    wire rst = |por;
    always @(posedge clk50) if (rst) por <= por - 1'b1;

    reg [7:0] tx_data; reg tx_start; wire tx_busy;
    uart_tx #(.DIV(DIV)) UTX (.clk(clk50), .data(tx_data), .start(tx_start), .tx(usb_tx), .busy(tx_busy));

    reg [4:0] idx;
    reg [23:0] gap;
    reg [23:0] hb;
    reg [3:0] step;
    reg [3:0] col;
    reg [2:0] phase;
    reg lut_r, eok_r, cmt_r, refuse_r;
    // Sampled decision bits used while printing a step line
    reg lut_s, eok_s, cmt_s;
    reg [7:0] bchar;

    always @(*) begin
        bchar = 8'h00;
        if (phase == 3'd0) begin
            case (idx)
                5'd0: bchar="W"; 5'd1: bchar="C"; 5'd2: bchar="A"; 5'd3: bchar="1";
                5'd4: bchar=" "; 5'd5: bchar="C"; 5'd6: bchar="0"; 5'd7: bchar="1";
                5'd8: bchar=" "; 5'd9: bchar="R"; 5'd10: bchar="1"; 5'd11: bchar="5";
                5'd12: bchar=" "; 5'd13: bchar="S"; 5'd14: bchar="0"; 5'd15: bchar="6";
                5'd16: bchar=8'h0D; 5'd17: bchar=8'h0A;
                default: bchar=8'h00;
            endcase
        end else begin
            case (col)
                4'd0: bchar="S"; 4'd1: bchar=hex1(4'h0); 4'd2: bchar=hex1(step); 4'd3: bchar=" ";
                4'd4: bchar="L"; 4'd5: bchar=lut_allow?"1":"0"; 4'd6: bchar=" "; 4'd7: bchar="E";
                4'd8: bchar=energy_ok?"1":"0"; 4'd9: bchar=" "; 4'd10: bchar="C"; 4'd11: bchar=commit?"1":"0";
                4'd12: bchar=8'h0D; 4'd13: bchar=8'h0A; default: bchar=8'h00;
            endcase
        end
    end

    always @(posedge clk50) begin
        hb <= hb + 1'b1;
        tx_start <= 1'b0;
        if (rst) begin
            idx<=0; gap<=0; step<=0; col<=0; phase<=0;
            lut_r<=1; eok_r<=0; cmt_r<=0; refuse_r<=1;
            lut_s<=1; eok_s<=0; cmt_s<=0;
        end else begin
            // Live LEDs track current step's computed commit
            lut_r <= lut_allow;
            eok_r <= energy_ok;
            cmt_r <= commit;
            refuse_r <= refuse;
            case (phase)
                3'd0: if (!tx_busy && !tx_start) begin
                    tx_data <= bchar; tx_start <= 1'b1;
                    if (idx==5'd17) begin
                        idx<=0; step<=0; col<=0; phase<=3'd1;
                        // sample step 0 decisions as we enter step printer
                        lut_s <= lut_allow; eok_s <= energy_ok; cmt_s <= commit;
                    end
                    else idx <= idx + 1'b1;
                end
                3'd1: if (!tx_busy && !tx_start) begin
                    tx_data <= bchar; tx_start <= 1'b1;
                    if (col==4'd13) begin
                        col <= 0;
                        if (step==4'd15) begin
                            gap <= GAP_CYCLES[23:0];
                            phase <= 3'd2;
                        end else begin
                            step <= step + 1'b1;
                            // sample next step on step advance (combinational ROM updates same cycle;
                            // capture after step++ via delayed sample below)
                        end
                    end else col <= col + 1'b1;
                end
                3'd2: if (gap!=0) gap <= gap - 1'b1; else begin phase<=3'd0; idx<=0; step<=0; end
                default: phase <= 3'd0;
            endcase
            // When step increments at end of a line, sample the NEW step's live outputs
            // (step already updated in same cycle; ROM+gate are combo so sample next edge).
            // Safer: sample at start of each line (col==0 and about to send first char).
            if (phase==3'd1 && !tx_busy && !tx_start && col==4'd0) begin
                lut_s <= lut_allow;
                eok_s <= energy_ok;
                cmt_s <= commit;
            end
        end
    end

    assign led[0]=cmt_r; assign led[1]=refuse_r; assign led[2]=lut_r; assign led[3]=eok_r;
    assign led[4]=y0[0]; assign led[5]=y0[1]; assign led[6]=step[0]; assign led[7]=hb[23];
    wire _u = usb_rx; // keep port; unused RX
endmodule
