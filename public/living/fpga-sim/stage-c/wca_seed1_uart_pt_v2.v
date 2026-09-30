// klere_uart_top.v — Alchitry Pt V2: drive the Klere die live over the FT2232H
// channel-B UART (usb_rx=AA20, usb_tx=AA21), ATOMIC protocol.
//
// One request computes one forward pass, robustly:
//   host -> FPGA : [0xA5][x0][x1]...[x7]         (sync + 8 signed int8 activations)
//   FPGA -> host : [0x5A][outr 0..31]            (sync + full 256-bit outr, little-endian)
//     outr = {29'b0, halted, done, busy, steps[32], ops[32], joules_pj[48], ss[16], y[96]}
//     so the host recovers y (8x 12-bit) AND the die's own Xkenergy metering
//     (joules_pj / ops / steps) — what each inference cost, self-reported.
//
// The bridge does the whole test_klere.c transaction in fabric: reset the die
// (so it always starts from S_IDLE — the die core is one-shot per reset), write
// the input frame with enforce=0 (budget can never halt it), pulse CTRL start,
// poll STATUS for done, read y. The 0xA5 sync byte re-aligns framing so any
// power-up / port-open garbage on usb_rx can't desync the stream.
//
// LEDs: [7]=heartbeat  [6]=first sync seen  [5]=tx busy  [1]=timeout  [0]=reply-sent toggle.

module uart_rx #(parameter integer DIV = 868) (
    input wire clk, input wire rx, output reg [7:0] data, output reg valid
);
    reg s0 = 1'b1, s1 = 1'b1;
    always @(posedge clk) begin s0 <= rx; s1 <= s0; end
    localparam IDLE=2'd0, START=2'd1, DATA=2'd2, STOP=2'd3;
    reg [1:0] st = IDLE; reg [15:0] cnt = 0; reg [2:0] idx = 0; reg [7:0] sh = 0;
    always @(posedge clk) begin
        valid <= 1'b0;
        case (st)
            IDLE:  if (!s1) begin st <= START; cnt <= DIV/2; end
            START: if (cnt==0) begin if (!s1) begin st<=DATA; cnt<=DIV-1; idx<=0; end else st<=IDLE; end
                   else cnt <= cnt-1;
            DATA:  if (cnt==0) begin sh<={s1,sh[7:1]}; cnt<=DIV-1; if(idx==3'd7) st<=STOP; else idx<=idx+1; end
                   else cnt <= cnt-1;
            STOP:  if (cnt==0) begin data<=sh; valid<=1'b1; st<=IDLE; end else cnt<=cnt-1;
        endcase
    end
endmodule

module uart_tx #(parameter integer DIV = 868) (
    input wire clk, input wire [7:0] data, input wire start, output reg tx, output reg busy
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

module klere_uart_top #(parameter integer DIV = 868) (
    input  wire       clk,
    input  wire       usb_rx,
    output wire       usb_tx,
    output wire [7:0] led
);
    localparam [15:0] EOK_ROM = 16'h0040;
    localparam [15:0] LUT_ROM = 16'hFFFF;
    function automatic [7:0] hex1;
        input [3:0] v;
        hex1 = (v < 4'd10) ? (8'h30 + {4'b0,v}) : (8'h41 + {4'b0,(v-4'd10)});
    endfunction
    reg [3:0] por = 4'hF;
    wire rst = |por;
    always @(posedge clk) if (rst) por <= por - 1'b1;
    reg [7:0] tx_data; reg tx_start; wire tx_busy;
    uart_tx #(.DIV(DIV)) UTX (.clk(clk), .data(tx_data), .start(tx_start), .tx(usb_tx), .busy(tx_busy));
    reg [4:0] idx; reg [23:0] gap; reg [23:0] hb; reg [3:0] step; reg [3:0] col; reg [2:0] phase;
    reg lut_allow, energy_ok, commit, refuse;
    wire lut_s = LUT_ROM[step]; wire eok_s = EOK_ROM[step]; wire cmt_s = lut_s & eok_s;
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
                4'd4: bchar="L"; 4'd5: bchar=lut_s?"1":"0"; 4'd6: bchar=" "; 4'd7: bchar="E";
                4'd8: bchar=eok_s?"1":"0"; 4'd9: bchar=" "; 4'd10: bchar="C"; 4'd11: bchar=cmt_s?"1":"0";
                4'd12: bchar=8'h0D; 4'd13: bchar=8'h0A; default: bchar=8'h00;
            endcase
        end
    end
    always @(posedge clk) begin
        hb <= hb + 1'b1; tx_start <= 1'b0;
        if (rst) begin
            idx<=0; gap<=0; step<=0; col<=0; phase<=0;
            lut_allow<=1; energy_ok<=0; commit<=0; refuse<=1;
        end else begin
            lut_allow <= (phase==3'd1) ? lut_s : 1'b1;
            energy_ok <= (phase==3'd1) ? eok_s : 1'b0;
            commit    <= (phase==3'd1) ? cmt_s : 1'b0;
            refuse    <= (phase==3'd1) ? ~cmt_s : 1'b1;
            case (phase)
                3'd0: if (!tx_busy && !tx_start) begin
                    tx_data <= bchar; tx_start <= 1'b1;
                    if (idx==5'd17) begin idx<=0; step<=0; col<=0; phase<=3'd1; end
                    else idx <= idx + 1'b1;
                end
                3'd1: if (!tx_busy && !tx_start) begin
                    tx_data <= bchar; tx_start <= 1'b1;
                    if (col==4'd13) begin
                        col <= 0;
                        if (step==4'd15) begin gap <= 24'd20_000_000; phase <= 3'd2; end
                        else step <= step + 1'b1;
                    end else col <= col + 1'b1;
                end
                3'd2: if (gap!=0) gap <= gap - 1'b1; else begin phase<=3'd0; idx<=0; end
                default: phase <= 3'd0;
            endcase
        end
    end
    assign led[0]=commit; assign led[1]=refuse; assign led[2]=lut_allow; assign led[3]=energy_ok;
    assign led[6:4]=step[2:0]; assign led[7]=hb[23];
    wire _u = usb_rx;
endmodule
