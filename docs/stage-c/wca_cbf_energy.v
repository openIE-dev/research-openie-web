// =============================================================================
// Safe Q16.16 Ames energy-set CBF — fabric h≥0 conjunct (shares PH V_num)
// Full Lie check ω·u ≤ κ·h is in software SafeEnergySetCbfCertificate.
// Fabric: PH enforces ω·u ≤ ε; CBF adds set membership V ≤ E_max.
//   cbf_ok <=> E_max_num >= V_upper
//   V_upper = V_num + |θ_q| + |ω_q|
// Energy UNMETERED.
// =============================================================================
module wca_cbf_energy (
  input  wire signed [31:0]  theta_q,
  input  wire signed [31:0]  omega_q,
  input  wire signed [79:0]  V_num,
  output wire                cbf_ok,
  output wire signed [127:0] h_num
);
  localparam signed [63:0] E_MAX_NUM = 64'sd77309411328;

  reg signed [63:0] abs_th, abs_om, v_upper, h_r;
  reg cbf_ok_r;

  always @(*) begin
    abs_th = (theta_q[31]) ? -$signed(theta_q) : $signed(theta_q);
    abs_om = (omega_q[31]) ? -$signed(omega_q) : $signed(omega_q);
    v_upper = $signed(V_num[63:0]) + abs_th + abs_om;
    h_r = E_MAX_NUM - v_upper;
    cbf_ok_r = (h_r >= 0);
  end

  assign h_num  = {{64{h_r[63]}}, h_r};
  assign cbf_ok = cbf_ok_r;
endmodule
