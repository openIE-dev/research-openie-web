// =============================================================================
// Safe Q16.16 Port-Hamiltonian energy certificate (never false-allow)
// energy_ok <=> 4*om*u + 2*(|om|+|u|) + 1 <= floor(4*eps*S^2)
// FRAC=16, S=65536, eps=0.05, RHS=858993459
// Fabric: no Vdot divider (was observability only).
// Energy UNMETERED.
// =============================================================================
module wca_ph_energy (
  input  wire signed [31:0] theta_q,
  input  wire signed [31:0] omega_q,
  input  wire signed [31:0] u_q,
  output wire                      energy_ok,
  output wire signed [79:0] V_num,
  output wire signed [63:0] Vdot_q
);
  localparam integer FRAC = 16;
  localparam signed [31:0] G_Q = 32'sd642908;
  localparam signed [127:0] RHS = 128'sd858993459;

  reg signed [127:0] t2, w2, g_t2, v_sum;
  reg signed [127:0] prod, abs_sum, lhs_r, abs_om, abs_u;
  reg signed [79:0] V_num_r;
  reg energy_ok_r;

  always @(*) begin
    t2   = $signed(theta_q) * $signed(theta_q);
    w2   = $signed(omega_q) * $signed(omega_q);
    g_t2 = $signed(G_Q) * t2;
    v_sum = (g_t2 >>> FRAC) + w2;
    V_num_r = v_sum >>> 1;

    prod = $signed(omega_q) * $signed(u_q);
    abs_om = (omega_q[31]) ? -$signed(omega_q) : $signed(omega_q);
    abs_u  = (u_q[31]) ? -$signed(u_q) : $signed(u_q);
    abs_sum = abs_om + abs_u;
    lhs_r = (prod * 128'sd4) + (abs_sum * 128'sd2) + 128'sd1;
    energy_ok_r = (lhs_r <= RHS);
  end

  assign V_num     = V_num_r;
  assign Vdot_q    = 64'sd0; // not computed on fabric (divider removed)
  assign energy_ok = energy_ok_r;
endmodule
