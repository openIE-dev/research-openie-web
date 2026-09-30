// =============================================================================
// Synthesizable TLMM for Alchitry Pt V2 (seed-1 demo tables).
// Unrolled n_out=2 n_groups=2; flat y0/y1 ports (no unpacked arrays).
// Same unique-table contents as artifacts/fpga/wca_tlmm.v.
// =============================================================================
module wca_tlmm_synth (
  input  wire [7:0] patterns_packed,
  output reg  signed [4:0] y0,
  output reg  signed [4:0] y1,
  output reg  [7:0] bram_reads
);
  function automatic signed [2:0] table_val;
    input [1:0] tid;
    input [3:0] pat;
    reg [5:0] addr;
    begin
      addr = tid * 6'd9 + {2'b0, pat};
      case (addr)
        6'd0:  table_val = -3'sd1;
        6'd1:  table_val = 3'sd0;
        6'd2:  table_val = 3'sd1;
        6'd3:  table_val = -3'sd1;
        6'd4:  table_val = 3'sd0;
        6'd5:  table_val = 3'sd1;
        6'd6:  table_val = -3'sd1;
        6'd7:  table_val = 3'sd0;
        6'd8:  table_val = 3'sd1;
        6'd9:  table_val = 3'sd0;
        6'd10: table_val = 3'sd1;
        6'd11: table_val = 3'sd2;
        6'd12: table_val = -3'sd1;
        6'd13: table_val = 3'sd0;
        6'd14: table_val = 3'sd1;
        6'd15: table_val = -3'sd2;
        6'd16: table_val = -3'sd1;
        6'd17: table_val = 3'sd0;
        6'd18: table_val = 3'sd1;
        6'd19: table_val = 3'sd1;
        6'd20: table_val = 3'sd1;
        6'd21: table_val = 3'sd0;
        6'd22: table_val = 3'sd0;
        6'd23: table_val = 3'sd0;
        6'd24: table_val = -3'sd1;
        6'd25: table_val = -3'sd1;
        6'd26: table_val = -3'sd1;
        6'd27: table_val = -3'sd1;
        6'd28: table_val = -3'sd1;
        6'd29: table_val = -3'sd1;
        6'd30: table_val = 3'sd0;
        6'd31: table_val = 3'sd0;
        6'd32: table_val = 3'sd0;
        6'd33: table_val = 3'sd1;
        6'd34: table_val = 3'sd1;
        6'd35: table_val = 3'sd1;
        default: table_val = 3'sd0;
      endcase
    end
  endfunction

  reg [3:0] pat0, pat1;
  reg signed [2:0] v00, v01, v10, v11;

  always @(*) begin
    pat0 = patterns_packed[3:0];
    pat1 = patterns_packed[7:4];
    v00 = table_val(2'd0, pat0);
    v01 = table_val(2'd1, pat1);
    v10 = table_val(2'd2, pat0);
    v11 = table_val(2'd3, pat1);
    y0 = v00 + v01;
    y1 = v10 + v11;
    bram_reads = 8'd4;
  end
endmodule
