### 6.8 Convergence observations: information, energy and prediction

Nine recent sources relate information, energy and prediction. Four were read in full and are cited for what they state: Takahashi and Hayashi [239], Perrier [344], Xu and Li [345] and Still, Sivak, Bell and Crooks [54]. Five were read in part and are cited only for the passages named: Wolpert [230], Ortega and Braun [56], Zhang, Zhu, Zhang and Hu [348], Fagan [346] and Kumar [347]. This section records what each states and what it does not show. It is an observation of overlapping questions, not a comparison of results and not a claim about priority. Section and equation numbers are those of the versions named. Quotations were checked by script against the saved texts. Values marked "recomputed" are this paper's own arithmetic.

**In plain words**

1. Several authors write the same kind of quantity: information gained or acted on, divided by energy spent (bits per joule), or its inverse (watts per unit of intelligence).
2. The firm results are lower bounds on heat. They say how little energy is physically required, not how much any real machine uses.
3. No source read here measured energy on real hardware. Where energy figures appear, they are estimated from FLOP counts or from model assumptions.

**Units.** $k_B = 1.380649\times10^{-23}$ J/K. At $T = 300$ K, $k_B T\ln 2 = 2.871\times10^{-21}$ J per bit (recomputed), and its inverse is $3.483\times10^{20}$ bit/J (recomputed). With $\beta = 1/(k_B T)$, information in nats converts to joules by multiplying by $k_B T$, and in bits by $k_B T\ln 2$.

#### Sources read in full

**Takahashi and Hayashi, arXiv:2602.05463v2 (20 July 2026) [239].** The version read is the arXiv posting.

- Epiplexity per joule is $\eta_E = \Delta I / E_{\mathrm{cons}}$ in bit/J, with $\Delta I = I(W_{\mathrm{post}}; Z \mid W_{\mathrm{pre}})$ (Eqs 3 and 10, Sec 2.2). The energy balance is $E_{\mathrm{cons}} = Q_{\mathrm{diss}} + \Delta U_{\mathrm{sys}} + W_{\mathrm{out}} + \Delta E_{\mathrm{store}}$ (Eq 1).
- Empowerment per joule is $\eta_C^* = \sup_{p(a)} I(A_{0:\tau-1}; O_\tau) / \mathbb{E}[c(A)]$ in bit/J (Eq 18, Sec 3.2), with a cost-constrained curve (Eq 19). Empowerment is a channel capacity from actions to later observations (Eq 17, Sec 3.1).
- The closed-cycle bound is $Q_{\mathrm{diss}} \ge k_B T\ln 2\,\Delta I - T\,\Delta S_{\mathrm{sys}}$ (Eq 15), so $\Delta I / Q_{\mathrm{diss}} \le 1/(k_B T\ln 2)$ when $\Delta S_{\mathrm{sys}} = 0$ (Eq 16, Corollary 1). Eq 15 follows from Eq 14 by rearrangement (checked). Corollary 1 needs the bipartite-Markov and local-detailed-balance assumptions.
- The authors give a bits-per-joule metric for learning, another for control, and a reporting checklist: boundary, baseline energy, horizon, estimator (Sec 5.1). Their Proposition 1 is a decoupling construction showing the bound fails if the accounting boundary excludes the cost of preparing fresh memory.
- Scope as stated: "the resulting numbers are benchmark-relative rather than universal". On the ceiling: "Landauer-scale limits are conceptual yardsticks far beyond current hardware."
- The Sec 5 worked example uses published perplexities, $10^9$ tokens, and energy estimated from $6PD$ FLOPs at an assumed $2.5\times10^{11}$ FLOP/J. Recomputed: $\Delta G \approx 4.51\times10^{8}$ bit, $E$ (410M model) $\approx 2.95\times10^{9}$ J, marginal efficiency $\approx 0.106$ bit/J. The authors write: "This number is convention-dependent, but it exercises the checklist."
- Not verified here: Lemma 1 restates an inequality from work not read. Eq 17 uses $O_\tau$ while the Sec 3.2 text refers to $I(A;S_\tau)$. Eq 20 is flagged by the authors: "This is not claimed as a universal identity without assumptions".

**Perrier, arXiv:2504.05328v2 (16 June 2025) [344].** Definitions only are cited.

- Watts per intelligence is $\Phi(\Sigma) = P(\Sigma)/I(\Sigma) = E(\Sigma)/(\tau\, I(\Sigma))$ (Eq 7, Sec 3.3), where $I$ is a task-weighted performance sum (Eq 2) or the Legg and Hutter sum (Eq 1). The assumptions are $E = F N c$ with $c = k_B T\ln 2$ and overhead $F \ge 1$ (Eq 5), and $I \le \alpha N$ with $\alpha$ unspecified (Eq 6). Theorem 1 gives $\Phi \ge cF/(\alpha\tau)$ (Eq 8).
- The author states the premise openly: "Our work assumes a correlation between irreversible computation to intelligence." The paper contains no measurement; it says only that "In practice, one might measure the actual hardware usage".
- Errors found (my reading, not confirmed with the author): (1) Sec 3.1 defines $N$ per unit time, but Eqs 3 and 5 use $E$ over $[0,\tau]$, which needs $N$ as a total, and then $cF/(\alpha\tau)$ falls to zero as $\tau$ grows. (2) $\alpha$ is free, so Theorem 1 gives no numerical floor. (3) The Theorem 2 proof yields a bound of the form $\Delta i_K > -\log(1/\delta)$, which is negative for $\delta < 1$, yet the text treats $-\log(1/\delta)$ as positive. (4) Combining $I \le \alpha\,\Delta i_K$ with $P \ge \Delta i_K\, k_B T\ln 2/\tau$ gives $I/P \le \alpha\tau/(k_B T\ln 2)$, while Eq 14 has no $\alpha$, no $k_B T\ln 2$ and the opposite dependence on $\tau$. (5) $\Delta i_K = K(y) - K(x)$ can be negative, and the direction of the Landauer attachment in Eq 13 is not argued; Theorem 3 inherits this. (6) The hardware ordering $\Phi_{\mathrm{CPU}} > \Phi_{\mathrm{GPU}} > \Phi_{\mathrm{neuro}}$ is asserted with no values.

**Xu and Li, arXiv:2511.19156v4 (30 December 2025) [345].** Read in full for the saved text; figures were read by caption and printed values only. Definitions only are cited.

- Derivation depth $D_d$ (Eq 10) and derivation entropy $H_{\mathrm{derive}} = D_d\lambda$ with $\lambda = \ln 2$ nats in a stated classical regime (Eq 14, Assumption 3). Claimed bounds: $E_{\mathrm{compute}} \ge D_d k_B T\ln 2$ (Proposition 4, Eqs 98 and 99) and $E_{\mathrm{storage}} \ge |S|\,k_B T\ln 2\,(t/t_{\mathrm{refresh}})$ (Proposition 5, Eq 100). A break-even query frequency between recomputing and storing is given in abstract cost units (Theorem 5, Eq 32).
- The authors call their cost an "information-theoretic proxy for energy consumption". The numerical validation (Sec VI) uses a synthetic 100K-atom knowledge base and the paper's own abstract costs, so it tests the model against itself. Application figures (1000 kWh, 45 percent reduction) come without a measurement method and are not used here.
- The abstract says "Our findings suggest that the minimization of Derivation Entropy is a governing principle". The text elsewhere declines to claim a sharp result: "We deliberately refrain from formalizing" the last observation as a phase-transition theorem.
- Errors found (my reading, not confirmed with the authors): (1) Assumption 1 has $E\tau \ge \kappa$ with $\kappa$ an action in J s, while Corollary 1 sets $\kappa_T = k_B T\ln 2$, an energy, and drops $\tau$. (2) Eq 98 assumes every inference step erases a bit (Assumption 3), and Remark 15 of the same paper concedes reversible computation avoids this cost. (3) In Lemma 2 the contradiction argument negates the bound to $K = o(n\log m)$ and claims this contradicts $H \gg \log m$; it does not, since $n\log m \gg \log m$. The lower bound is therefore unproved, and Theorems 4 to 6 and Corollary 7 depend on it. (4) Theorem 6 case (b) uses $N = \Omega(L_S)$ where $N = O(L_S)$ is needed. (5) The Eq 135 critical storage with $H(Q) = 10^{12}$ recomputes to $1.25\times10^{10}$ (log base 2), $1.80\times10^{10}$ (ln) or $4.15\times10^{10}$ (log base 10), not the printed $2.5\times10^{11}$. The Table II text (tightness 0.50 to 0.93) disagrees with the table (0.50 to 0.81, and 0.89 at high frequency).

**Still, Sivak, Bell and Crooks, arXiv:1203.3271v3 (5 October 2012) [54].** The arXiv version was read; the journal version was not.

- With system state $s_t$ and driving signal $x_t$, $I_{\mathrm{mem}}(t) = I[s_t, x_t]$ and $I_{\mathrm{pred}}(t) = I[s_t, x_{t+1}]$, in nats. Per step, $\beta\langle W_{\mathrm{diss}}[x_t \to x_{t+1}]\rangle = I_{\mathrm{mem}}(t) - I_{\mathrm{pred}}(t)$ (Eq 14). In total, $I_{\mathrm{mem}} - I_{\mathrm{pred}} \le \beta\langle W_{\mathrm{diss}}\rangle \le \beta\langle W_{\mathrm{ex}}\rangle$ (Eq 18). The refined Landauer bound is $-\beta\langle Q\rangle \ge I_e + I_{\mathrm{mem}} - I_{\mathrm{pred}}$ (Eq 21).
- Memory of the signal that does not help predict its next value costs dissipated work, at $k_B T$ per nat. The authors' stated consequence: "any system constructed to keep memory about its environment and to operate with maximal energetic efficiency has to be predictive".
- This is a lower bound on dissipation for systems that keep memory of a driving signal. It does not show that any real system attains it, and it is not a statement about general agents. There is no experiment and no joule data.
- Checked: footnote 24 is correct; Eq 17 follows from Eqs 11, 14 and 15; Eq 18 follows from Eq 16; Eq 21 follows from Eqs 19 and 20. $k_B T = 25.9$ meV at 300 K (recomputed; the paper gives 25 meV). Not verified: non-negativity of the per-step term for arbitrary signal processes is stated but not proved in the text, and it is not proved here.

#### Sources read in part

Each entry is limited to the passage stated. No claim is made about the unread parts.

- **Wolpert, arXiv:1905.05669v3 [230].** Sec V (Eqs 29 to 44, Examples 1 to 6), Sec XVI, Appendix A and the opening of Appendix B were read. Sec V states $Q(p_0) = \sigma(p_0) + S(p_0) - S(\pi p_0)$ (Eq 29) and the Landauer cost $L(p,\pi) = S(p) - S(\pi p)$ (Eq 35), defined only for a fixed input distribution. About 70 percent of the 115 pages was not read, and Proposition 1 rests on a cited result not read.
- **Ortega and Braun, arXiv:1204.6481v2 [56].** The main text (Sec 1 to 8) was read. The proofs of Theorems 5 to 7 and the Supplementary Material were not available. Cited for Eq 9, $p(x) \propto p_0(x)\, e^{\beta U(x)}$, and for the one-molecule illustration of Sec 1.1 (cost $k_B T\ln(1/p)$). Printed errors were found in Eq 5 and Corollary 3. The stated optimum $M = 35$ in Fig 4 recomputes to 33 under my reading of the setup.
- **Zhang, Zhu, Zhang and Hu, arXiv:2607.24287v1 [348].** Sec 4.1 to 4.6 (proofs of T1 to T6) were read. Cited for the statement that Axiom 1 "is adopted as an empirical postulate rather than derived within the present framework" and that its energy is dimensionless (nats). The proofs of T7 to T10 and Sec 4.7 and 4.8 were not read. One discrepancy in the T5 Euler-Lagrange equation is unresolved.
- **Fagan, arXiv:2601.00021v2 [346].** Sec 5.3 to 14 and the references were read; Sec 1 to 5.2 were read earlier and not re-read. Cited for Eq 116, $\chi = \dot W_{\mathrm{causal}} / \dot I_{\mathrm{irr}}$, and the authors' statement that its proxies "need not coincide numerically across systems". The simulations (Sec 12) use proxies, not joules, and one curve in Sec 12.1 decreases with $\lambda$ by construction.
- **Kumar, Zenodo 18993403 [347].** Appendix A.1 to A.28 and the references were read; the main text was read earlier and not re-read. Superscripts are lost in the saved text, so printed exponents in A.26 and A.28 are not cited. Cited for $I \le P/(k_B T\ln 2)$ (Eq 125), whose premise the paper states as conditional ("If generating useful knowledge requires irreversible information processing"). Recomputed: $6.74\times10^{21}$ bit/s for 20 W at 310 K.

#### What the nine sources show together

| Source | What it shows | What it does not show | Read status |
|---|---|---|---|
| Takahashi and Hayashi | Two bit/J metrics (learning, control); a closed-cycle Landauer-scale ceiling under stated assumptions; a reporting checklist | A measured joule; an estimate of epiplexity or empowerment for a real system; a test of the bound | Full (16 pp, no appendices) |
| Perrier | A definition $\Phi = P/I$ and a bound that holds only given an assumed link $I \le \alpha N$ | Measured energy; a numerical floor; a correct Theorem 2 or 3 proof | Full (12 pp); definitions cited only |
| Xu and Li | Definitions of derivation depth and entropy; conditional Landauer-type bounds; a synthetic simulation | Measured energy; a correct proof of Lemma 2; independent validation | Full for the saved text; definitions cited only |
| Still, Sivak, Bell and Crooks | A dissipation lower bound equal to non-predictive memory, $\beta\langle W_{\mathrm{diss}}\rangle \ge I_{\mathrm{mem}} - I_{\mathrm{pred}}$ | Attainment by real systems; general agents; a measured joule | Full (5 pp); journal version not read |

Across all nine sources, no text read reports joules measured on real hardware. Energy figures that appear are estimated from FLOP counts, nominal power ratings or model assumptions. Where bounds appear, they are lower bounds on dissipation under stated assumptions, or definitions of ratios awaiting measurement.

**Limits of this section.** Quoted text was verified against PDF-converted text, and two-column conversion can interleave lines. The errors listed are from my reading and recomputation and have not been sent to the authors. Version differences (v1 to v2) were compared by structure and abstract only for Takahashi and Hayashi, Perrier and Xu and Li.

