---
title: "The Universal Law of Agency"
deck: "Law first, kinematics second. The Universal Law of Agency is required before anything counts as an agent. The kinematic laws bound how fast agency moves per second and per joule. Intelligence is the calculus of agency: a derivative read in hindsight off a completed run, ι = dX/dJ. Energy to run is the only true metric of computer intelligence. Estimates are never measured_j."
id: agency
status: "Research track"
author: "David Charlot, Open Interface Engineering"
figures: "/living/"
pdf: "/pdfs/agency.pdf"
board_synth_claimed: false
---
# The Universal Law of Agency

*Law first. Kinematics second. Intelligence is the calculus of agency, read in joules.*

## 1. Thesis

This is David Charlot's proposal. It has three layers, and the order is fixed.

1. **The Universal Law of Agency comes first, and it is required.** Nothing is an agent until the law is met. Nothing downstream is defined without it.
2. **The kinematic laws of agency follow from the law.** They say how fast agency can move, per second and per joule, and what it must pay to move.
3. **Intelligence is the calculus of agency.** Intelligence is a hindsight characteristic. It is read off a completed run, the way velocity is read off a recorded path. It is therefore a derivative of agency: $\iota = dX/dJ$, where $X$ is confirmed agency and $J$ is joules.

In David's words: energy to run is the only true metric of computer intelligence. All other factors collapse to zero.

The order matters. A derivative needs a path. A path needs something that moves. The law says what moves. The kinematics say how it can move. Intelligence is read off the path afterward.

This track tests that order against the literature. It sorts every source into three bins.

- **Proven:** theorems and derivations. The result follows from stated assumptions.
- **Demonstrated:** experiments, measurements and simulations. The result was observed.
- **Opinion:** position papers, frameworks, definitions and philosophy. The result is argued.

No source is excluded for its method. Each source is placed by what it gives the law, the kinematics or the calculus.

### Terms

- **SI:** the International System of Units.
- **Joule (J):** the SI unit of energy. One watt for one second.
- **$k_B$:** the Boltzmann constant, $1.380649 \times 10^{-23}$ J/K, exact by SI definition.
- **Entropy production ($\Sigma$):** the total entropy a process creates, in units of $k_B$. It is zero only for a reversible process.
- **Mutual information ($I$):** the number of bits one variable carries about another.
- **Dynamical activity ($A$):** the rate of jumps between states in a stochastic process. It measures how busy the dynamics are.
- **TUR (thermodynamic uncertainty relation):** a theorem that ties the precision of a current to its entropy production.
- **NMR (nuclear magnetic resonance):** a method that controls and reads molecular spins.
- **Counting observable:** a quantity of a trajectory that counts selected jumps. It never decreases.
- **Radon-Nikodym derivative:** the density of one measure with respect to another. It exists when the first measure gives zero mass to every set that the second gives zero mass to.
- **Mixture of Limits:** the OpenIE philosophy. Use the cheapest gear that is sufficient.
- **Notational Intelligence:** the OpenIE receipt study. Every act carries its prediction, its outcome and its joules.
- **Metabolic Intelligence:** the OpenIE product. It runs on any fabric.
- **Klere:** the hardware.

## 2. Formal framework

Definitions fix the terms. Propositions are proven from cited theorems, with their assumptions stated.

### 2.1 Layer 1. The law: eligibility

For a system $S$, an act $a$ and an episode budget $B$ in joules, eligibility $E(S,a) \in \{0,1\}$ equals 1 only when all four clauses hold.

1. **Prediction first.** A result template $R^*(a)$ is fixed at time $t_0$, before the act, and it discriminates: $D(R^*(a)) \ge \delta$.
2. **Coupling to the world.** $I(\mathrm{do}(a); W') > 0$. Here $W'$ is the world state downstream of the actuator, and $\mathrm{do}(a)$ is Pearl's intervention operator [1]. The coupling must survive changes to the system's own inputs. Editing your own sensors does not count [2].
3. **Consequence borne.** The comparison $m = M(R, R^*(a)) \in \{1, \mu, 0\}$ (match, partial, mismatch) changes the system: $s_{t+1} = f(s_t, m)$.
4. **Physical floor.** $J(a) \le B$. If no act meets clauses 1 to 4, the act is refusal, with a receipt.

Physics already prices clauses 1 to 3. The second law with feedback [3, 4] and the measurement and erasure bound [5] give, for one bath at temperature $T$:

$$
W_{\mathrm{ext}} \le -\Delta F + k_B T\, I, \qquad W_{\mathrm{meas}} + W_{\mathrm{erase}} \ge k_B T\, I
$$

Here $I$ is the mutual information the act's comparison acquires. An acceptor that compares and then resets pays at least $k_B T \ln 2$ per bit over a closed cycle [6, 7]. The law is physical from its first clause.

#### Definition 1. Coupling

Clause 2 is measured by causal information flow. Let act $a$ be drawn from the policy $p(a)$ and set by intervention, and let $W'$ be the world downstream of the actuator. Then

$$
I(\mathrm{do}(a); W') = \sum_{a} p(a) \sum_{w} p(w \mid \mathrm{do}(a)) \log_2 \frac{p(w \mid \mathrm{do}(a))}{\sum_{a'} p(a')\, p(w \mid \mathrm{do}(a'))}
$$

This is the information flow of Ay and Polani from the act node to $W'$ [8]. It equals the mutual information of the interventional joint distribution $p(a)\,p(w \mid \mathrm{do}(a))$. Its maximum over policies is the capacity of the channel from acts to the world:

$$
0 \;\le\; I(\mathrm{do}(a); W') \;\le\; \max_{p(a)} I(\mathrm{do}(a); W') \;\le\; \log_2 |\mathcal{A}|
$$

Here $\mathcal{A}$ is the set of available acts. Klyubin, Polani and Nehaniv defined empowerment as this capacity, with the agent's own future sensors in place of $W'$ [9]. Clause 2 takes the world side, so editing a sensor adds nothing [2].

Why this measure:

- **It is interventional.** Pearl's do-calculus gives the operator [1]. Kenton, Kumar, Farquhar, Richens, MacDermott and Everitt define agents as systems that would adapt their policy if their acts influenced the world in a different way, and they discover agents from interventional data [10]. A receipt is interventional by construction. The agent sets its acts, and the outcome is read from the world.
- **Observational measures fail.** James, Barnett and Crutchfield showed by example that transfer entropy does not measure information flow [11]. Lizier and Prokopenko separated information transfer from causal effect and assigned causal effect to causal information flow [12].
- **It is priced.** Under intervention the flow is a mutual information. Mutual information is the quantity that the feedback second law and the measurement and erasure bound price in joules [3, 5].
- **It needs no causal graph.** Janzing, Balduzzi, Grosse-Wentrup and Schölkopf derived a measure of causal influence from postulates, given the causal graph and the joint distribution [13]. A receipt carries acts and outcomes, not the agent's full graph. The flow is computed from them directly.
- **Credit goes to the act that caused it.** When several acts touch one outcome, the bits credited to act $k$ follow the account of actual causation for single transitions given by Albantakis, Marshall, Hoel and Tononi [14].

#### Definition 2. Agent boundary

Let the physical system be a finite set $V$ of components, each behind a metered wall. A candidate agent is a subset $S \subseteq V$, or a coarse-graining of one, that holds the record of every comparison $m_k$ (clause 3), with $W'$ outside $S$. For a completed run, let $X_S$ be the confirmed coupled bits credited with $S$ as the agent, and let $J_S$ be the joules metered at the wall of $S$.

**The agent is a candidate that maximizes $X_S / J_S$.**

$V$ is finite, so there are finitely many candidates. A maximizer exists whenever some candidate has $J_S > 0$. The receipt names the maximizer and records any tie.

Why this boundary:

- **The ratio, not $X_S$ alone.** Maximizing $X_S$ alone puts no price on components that add joules and no confirmed bits. The ratio removes them.
- **Not the Markov blanket.** Aguilera, Millidge, Tschantz and Buckley derived that the Markov blanket condition holds only in a narrow range of parameters, even for weakly coupled linear stochastic systems [15]. Biehl, Pollock and Kanai proved by counterexample that the definitions of the Markov blanket in use are not equivalent [16]. Bruineberg, Dołęga, Dewhurst and Baltieri separate the blanket as a tool of inference from the blanket as a physical boundary [17].
- **No observer.** Orseau, McGregor McGill and Legg define agent and device by a Bayesian comparison of two descriptions of the same behavior, so the label depends on the observer's priors [18]. $X_S$ and $J_S$ are read off receipts and meters.
- **A boundary found by a measure.** IIT 4.0 (integrated information theory) takes the system to be the set of elements with maximal integrated cause-effect power [19]. Krakauer, Bertschinger, Olbrich, Flack and Ay identify individuals as aggregates that propagate information from their past into their future [20]. Definition 2 keeps the form and uses the law's own currency: confirmed coupled bits per joule.
- **Coarse-grainings count.** Hoel, Albantakis and Tononi showed that a macro description can carry more causal power than the micro one [21].
- **Every candidate has an interface.** Rosas, Mediano, Biehl, Chandaria and Polani proved that every bipartite stochastic process has a causal blanket, and gave an algorithm that finds it from data with no steady-state or Markov assumption [22].

### 2.2 Layer 2. Kinematics

Cumulative joules are $J(t) = \int_0^t P(t')\,dt'$, with $P$ the metered power.

Agency displacement counts bits of confirmed, coupled change:

$$
X(t) = \sum_{k:\,t_k \le t} E_k\, m_k\, I(\mathrm{do}(a_k); W'_k)
$$

Velocity per second is $v_t = dX/dt$. Velocity per joule is $v_J = dX/dJ$. Acceleration per joule is $\alpha_J = d^2X/dJ^2$. The budget is $J(T) \le B$.

The kinematic laws are the bounds on these quantities.

**K1. Landauer floor, closed cycle.** Each confirmed bit is recorded and later erased to reset the acceptor. So

$$
v_J \le \frac{1}{k_B T \ln 2}.
$$

At $T = 300$ K, $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J, computed from the SI constants. That is about $3.5 \times 10^{20}$ bits per joule. Proposition 1 proves K1 act by act under stated assumptions on the record.

**K2. Classical speed limit.** Shiraishi, Funo and Saito proved this bound for a Markov jump process with local detailed balance [23]:

$$
\tau \;\ge\; \frac{L\big(p(0),p(\tau)\big)^2}{2\,\Sigma_{\mathrm{tot}}\,\langle A\rangle_\tau}
$$

- $L(p,p') = \sum_i |p_i - p'_i|$ is the full $L_1$ distance between two probability distributions. There is no factor of 1/2. With total variation distance $d_{TV} = L/2$, the same bound reads $\tau \ge 2 d_{TV}^2/(\Sigma_{\mathrm{tot}}\langle A\rangle_\tau)$.
- $\Sigma_{\mathrm{tot}} = \int_0^\tau \dot\Sigma\,dt$ is total entropy production, system plus baths, in units of $k_B$.
- $A(t) = \sum_{i\ne j} W_{ij}(t)\,p_j(t)$ is the dynamical activity, with $W_{ij}$ the jump rate from state $j$ to state $i$. $\langle A\rangle_\tau = \frac{1}{\tau}\int_0^\tau A(t)\,dt$ is its time average.

Rearranged, $\Sigma_{\mathrm{tot}} \ge L^2/(2\tau\langle A\rangle_\tau)$. Moving a distribution far, fast, with few jumps, costs entropy.

**Joule form.** For one bath, $k_B T\,\Sigma_{\mathrm{tot}} = W - \Delta F_{\mathrm{neq}}$, with $F_{\mathrm{neq}}$ the nonequilibrium free energy [24]. So the dissipated work obeys

$$
W_{\mathrm{diss}} \;\ge\; \frac{k_B T\, L^2}{2\,\tau\,\langle A\rangle_\tau}.
$$

**Stationary currents.** The same paper gives $\tau \ge c^* L^2 / (2\,\Sigma_{HS}\,\langle A\rangle_\tau)$, with $c^* = 0.896\ldots$ and $\Sigma_{HS}$ the Hatano-Sasa, or excess, entropy production [23].

**K3. Precision costs dissipation.** For a time-antisymmetric current $Y$ in a steady state, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma_{\mathrm{tot}}$ [25, 26]. Agents use feedback, and feedback beats this bound in experiment [27]. The law for agents is the feedback form, in which mutual information enters the bound [28]. Proposition 3 states it for confirmed agency.

**K4. Finite-time cost.** Erasing a bit in finite time $\tau$ costs more than $k_B T \ln 2$. The excess grows as $\tau$ shrinks [29]. Near equilibrium, the excess work along a protocol is bounded below by the squared thermodynamic length over the duration [30]. Proposition 1 gives the floor for a whole act.

**K5. Quantum ceiling on rate.** A system with mean energy $\langle E\rangle$ above its ground state makes at most $2\langle E\rangle/(\pi\hbar)$ orthogonal transitions per second [31]. That is about $6.04 \times 10^{33}$ transitions per second per joule, computed from the constants. A figure of about $3 \times 10^{33}$ matches $2E/h$, not $2E/(\pi\hbar)$.

#### Proposition 1. Joule floor of one act in finite time

**Setting.** Act $k$ writes its comparison to a record $M_k$ with $N$ states. The system that holds the record is a Markov jump process with local detailed balance, in contact with one bath at temperature $T$. At the end of the act the record is reset to a fixed state in time $\tau_k$. $\langle A\rangle_k$ is the time-averaged dynamical activity of the system during the reset.

**Assumptions.**

- (R1) The record's states have equal energy. During the reset only the record changes. At the start of the reset the record is independent of the rest of the system.
- (R2) The credited bits do not exceed the record's information about the outcome it compared: $b_k \le I(M_k; R_k)$, in bits. The record is unchanged between the comparison and the reset.
- (R3) The work of the reset passes through the meter: $J_k \ge W_k^{\mathrm{reset}}$.

**Statement.**

$$
J_k \;\ge\; b_k\, k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[\phi_N^{-1}(b_k)\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Here $h_2(x) = -x\log_2 x - (1-x)\log_2(1-x)$ is the binary entropy, and $\phi_N(x) = h_2(x) + x\log_2(N-1)$. On $[0, 1 - 1/N]$, $\phi_N$ increases from 0 to $\log_2 N$, so its inverse is defined on $[0, \log_2 N]$. For a one-bit record that confirms one bit, $\phi_2^{-1}(1) = 1/2$ and

$$
J_k \;\ge\; k_B T \ln 2 \;+\; \frac{k_B T}{2\, \tau_k\, \langle A\rangle_k}
$$

**Proof.**

1. For an isothermal Markov jump process, $W = \Delta F_{\mathrm{neq}} + k_B T\, \Sigma_{\mathrm{tot}}$, with $F_{\mathrm{neq}} = \langle E\rangle - k_B T\, S$ and $S$ the Shannon entropy of the system in nats [24].
2. By (R1), $\langle E\rangle$ does not change. The record starts independent of the rest, ends in a fixed state, and the rest does not change. So the system's Shannon entropy falls by exactly the record's entropy $H(M_k)$, and $\Delta F_{\mathrm{neq}} = k_B T \ln 2\, H(M_k)$, with $H$ in bits.
3. The classical speed limit gives $\Sigma_{\mathrm{tot}} \ge L^2/(2\tau_k\langle A\rangle_k)$, with $L$ the $L_1$ distance between the system's initial and final distributions [23]. Marginalizing never increases an $L_1$ distance. The record's marginal $q$ moves to a point mass on one state $s$. So $L \ge 2(1 - q_s) \ge 2(1 - q_{\max})$.
4. Fano's inequality, with the most likely state as the guess, gives $H(q) \le h_2(1-q_{\max}) + (1-q_{\max})\log_2(N-1) = \phi_N(1 - q_{\max})$. Since $1 - q_{\max} \le 1 - 1/N$ and $\phi_N$ increases there, $1 - q_{\max} \ge \phi_N^{-1}(H(q))$.
5. By (R2), $b_k \le I(M_k;R_k) \le H(M_k) = H(q)$. Since $\phi_N^{-1}$ increases, $L \ge 2\phi_N^{-1}(b_k)$, and $\Delta F_{\mathrm{neq}} \ge b_k\, k_B T \ln 2$.
6. Steps 1 to 5 and (R3) give $J_k \ge W_k^{\mathrm{reset}} \ge b_k\, k_B T\ln 2 + k_B T\,\big[2\phi_N^{-1}(b_k)\big]^2/(2\tau_k\langle A\rangle_k)$. $\blacksquare$

**Reading.** At finite $\tau_k$, every confirmed bit costs strictly more than $k_B T \ln 2$. K1 is reached only as $\tau_k \langle A\rangle_k \to \infty$. The finite-time term grows with the confirmed bits through $\phi_N^{-1}$. K1, K2 and K4 become one floor for a whole act, written in confirmed bits. Tighter erasure bounds for particular dynamics are also lower bounds on the same reset (Section 4.1). Per act, the velocity per joule is

$$
v_{J,k} = \frac{b_k}{J_k} \;\le\; \frac{b_k}{b_k\, k_B T \ln 2 + 2 k_B T\,\big[\phi_N^{-1}(b_k)\big]^2/(\tau_k\langle A\rangle_k)} \;<\; \frac{1}{k_B T \ln 2}
$$

for every $b_k > 0$ at finite $\tau_k\langle A\rangle_k$.

#### Proposition 2. Standing joules to hold a goal

**Setting.** The world is a linear plant $x_{t+1} = A x_t + B u_t + w_t$, with $x_t \in \mathbb{R}^n$. At step $t$ the agent writes a finite-valued record $c_t$ of the plant. Its memory is $z_t = (z_{t-1}, c_t)$, with $z_0$ finite-valued, and its act $u_t$ is a function of $z_t$. The goal is to hold the plant: $\sup_t \mathbb{E}\|x_t\|^2 < \infty$.

**Assumptions.**

- (C1) The noise $w_t$ is independent of $(x_t, z_t)$.
- (C2) $x_0$ has a density with finite differential entropy.
- (C3) Closed-cycle accounting per step. The joules $J_t$ metered to acquire the record $c_t$ and later erase it are at least $k_B T\, I(x_t; c_t \mid z_{t-1})$, with the information in nats. This is the measurement and erasure bound [5] applied at each value of the memory $z_{t-1}$.

**Statement.** Let $\lambda_1, \dots, \lambda_n$ be the eigenvalues of $A$. Then

$$
\liminf_{N\to\infty} \frac{1}{N}\sum_{t=1}^{N} J_t \;\ge\; k_B T \ln 2 \sum_{i:\,|\lambda_i| > 1} \log_2 |\lambda_i|
$$

**Proof.**

1. Choose real coordinates in which $A = \mathrm{diag}(A_u, A_s)$, with $A_u$ carrying exactly the eigenvalues of modulus above 1. Let $y_t$ be the unstable block of $x_t$. Then $y_{t+1} = A_u y_t + v_t + e_t$, where $v_t$ is a function of $z_t$ and $e_t$ is independent of $(y_t, z_t)$ by (C1).
2. Let $D_t = h(y_t \mid z_t)$, a conditional differential entropy in nats. Adding independent noise does not lower a conditional entropy. Shifting by a function of $z_t$ does not change it. The linear map $A_u$ adds $\ln|\det A_u|$. So $h(y_{t+1} \mid z_t) \ge D_t + \ln|\det A_u|$.
3. Writing the record $c_{t+1}$ lowers that entropy by the information the record carries: $D_{t+1} = h(y_{t+1}\mid z_t) - I(y_{t+1}; c_{t+1} \mid z_t)$. Since $y$ is a function of $x$, $I(y_{t+1}; c_{t+1}\mid z_t) \le I(x_{t+1}; c_{t+1}\mid z_t)$. This is the closed-loop inequality of Touchette and Lloyd [32, 33].
4. Steps 2 and 3 give $I(x_{t+1}; c_{t+1}\mid z_t) \ge \ln|\det A_u| - (D_{t+1} - D_t)$. Summing over $N$ steps, $\sum_{t=1}^{N} I(x_t; c_t\mid z_{t-1}) \ge N \ln|\det A_u| - (D_N - D_0)$.
5. Each record is finite-valued, so each information term is finite and each $D_t$ is finite, starting from (C2). $D_N \le h(y_N)$, and a Gaussian has the largest entropy for a given covariance, so the bounded second moment bounds $D_N$ above. Dividing by $N$, the average information per step is at least $\ln|\det A_u| = \sum_{|\lambda_i|>1}\ln|\lambda_i|$ in the limit.
6. (C3) prices each nat at $k_B T$, which is $k_B T\ln 2$ per bit. $\blacksquare$

**Reading.** An agent that holds a goal against an unstable world pays a standing power of at least $f\, k_B T\ln 2\sum_{|\lambda_i|>1}\log_2|\lambda_i|$ at $f$ control steps per second. One unstable mode with $|\lambda| = 2$ needs one bit per step, which is $k_B T\ln 2 \approx 2.87\times10^{-21}$ J per step at 300 K. The record's bits per step bound its information from above, so the proof also gives a non-strict, averaged form of the data-rate theorem (Section 4.1). This is a new kinematic law: the minimum standing joules to hold a goal.

#### Proposition 3. Precision of confirmed agency

**Setting.** The agent, its world and its feedback form one time-homogeneous Markov jump process in its stationary state. Each confirmed act is one jump of a marked kind. $N(t)$ counts confirmed acts in $[0,t]$. $\langle K\rangle$ is the mean number of jumps of all kinds in $[0,t]$, and $\langle k\rangle = \langle K\rangle/t$ is the mean jump rate.

**Statement.**

1. In the long-time limit, $\mathrm{Var}(N)/\langle N\rangle^2 \ge 1/\langle K\rangle$. If every confirmed act credits the same $b$ bits, then $X = bN$ and the same bound holds for $X$.
2. Let $T_n$ be the time at which the $n$-th confirmed act closes. For large $n$, $\mathrm{Var}(T_n)/\langle T_n\rangle^2 \ge 1/(\langle T_n\rangle\langle k\rangle)$.
3. Let $X$ instead be odd under the map to the backward experiment of a fluctuation relation that includes an information term, $P_B(-X,-\sigma_I)/P(X,\sigma_I) = e^{-\sigma_I}$. Then

$$
\frac{\mathrm{Var}(X) + \mathrm{Var}_B(X)}{\big(\langle X\rangle + \langle X\rangle_B\big)^2} \;\ge\; \frac{1}{\exp\!\big[(\langle\sigma_I\rangle + \langle\sigma_I\rangle_B)/2\big] - 1}
$$

When the backward experiment equals the forward one, this reads $\mathrm{Var}(X)/\langle X\rangle^2 \ge 2/\big(e^{\langle\sigma_I\rangle} - 1\big)$.

**Proof.** $N$ is a counting observable: it counts a subset of jumps and never decreases. Garrahan proved parts 1 and 2 for counting observables in stationary Markov jump processes [34]. Scaling by $b$ leaves a relative variance unchanged. Part 3 is the uncertainty relation that Potts and Samuelsson derived from any fluctuation relation, measurement and feedback included [28], applied with $X$ as the observable. $\blacksquare$

**Reading.** Part 1 needs no time-reversal property and no model of the feedback. The precision of confirmed agency is bought with activity. Part 3 is the dissipation price, and it holds under feedback because it rests on the feedback fluctuation relation. The standard TUR does not bind feedback engines in experiment [27]. That is why the agent form carries the information term.

#### Proposition 4. Quantum agents keep the floor

**Setting.** The comparison $m_k$ comes from a quantum measurement and is written to a classical register, the record of clause 3. The reset of that register meets the setting and assumptions (R1) to (R3) of Proposition 1.

**Statement.** The floor of Proposition 1 holds unchanged. In particular, $J_k \ge b_k\, k_B T\ln 2$ for every act.

**Proof.** The proof of Proposition 1 uses only the register's distribution, the jump dynamics of the reset and the meter. It does not use how the record was produced. $\blacksquare$

**Reading.** Quantum resources change what an agent can do per act. They do not lower the price of its record. The measurement that writes the record carries its own price, given in Section 4.1.

### 2.3 Layer 3. Calculus: intelligence as a derivative, read in hindsight

A run produces a receipt: the ordered record $\{(J_k, X_k)\}_{k=0}^{n}$ of metered joules and confirmed displacement. Each $m_k$ is known only after act $k$ closes. So the path $X(J)$ exists only once the run is complete.

- **Intelligence, marginal:** $\iota(J) = \dfrac{dX}{dJ}$, estimated from the receipt as $\iota_k = \Delta X_k/\Delta J_k$.
- **Run integral:** $X(B) = \int_0^B \iota(J)\,dJ$.
- **Joules to close a requirement:** $J^*(X_{\mathrm{req}}) = \int_0^{X_{\mathrm{req}}} \frac{dX}{\iota}$.
- **Optimum:** $\pi^* = \arg\min_\pi J_\pi$ subject to $X_\pi \ge X_{\mathrm{req}}$, $E_k = 1$ for every $k$, and $J_\pi \le B$. If no policy is feasible, refuse with a receipt.
- **Ranking:** $S_1 \succ_q S_2 \iff J^*_{S_1}(q) < J^*_{S_2}(q)$.

$X_{\mathrm{req}}$ is set by the task's completeness predicate $C(z)$. It is a gate, not a score. Parameters, tokens and benchmarks enter only through $J^*$. All other factors collapse to zero.

Hindsight is literal here. Velocity is read off a recorded path. Intelligence is read off a recorded run. The receipt is the path.

#### Proposition 5. Intelligence exists as a bounded density on the joule axis

**Setting.** A run on $[0, T]$ has metered power $P(t) \ge 0$, integrable, and joule measure $dJ = P\,dt$. Act $k$ occupies $[s_k, e_k]$ and credits $b_k = E_k\, m_k\, I(\mathrm{do}(a_k); W'_k) \ge 0$ bits. Acts may overlap. Each act has an attributed power $P_k \ge 0$, zero outside $[s_k, e_k]$, with $\sum_k P_k \le P$. Its joules are $J_k = \int P_k\,dt > 0$. For acts that do not overlap, $P_k = P$ on the act's interval.

**Crediting rule.** Each act's bits are spread over its own joules:

$$
dX = \sum_k \frac{b_k}{J_k}\, P_k\, dt
$$

**Assumption (K1 per act).** $b_k\, k_B T \ln 2 \le J_k$ for every $k$. Proposition 1 gives it under (R1) to (R3).

**Statement.**

1. For every measurable set $A \subseteq [0,T]$ of times, $0 \le X(A) \le J(A)/(k_B T\ln 2)$. So $dX$ is absolutely continuous with respect to $dJ$.
2. The Radon-Nikodym derivative $\iota = dX/dJ$ exists, is unique up to sets of zero joules, and satisfies

$$
0 \;\le\; \iota \;\le\; \frac{1}{k_B T \ln 2}
$$

Where $P > 0$, $\iota = \sum_k (b_k/J_k)(P_k/P)$. For acts that do not overlap, $\iota = b_k/J_k$ on act $k$, which is the receipt's $\iota_k$.

3. Confirmed agency is a function of cumulative joules: $X(t) = g(J(t))$, with $g$ nondecreasing and Lipschitz with constant $1/(k_B T\ln 2)$. So $g$ is differentiable at almost every joule, and $g'(J(t)) = \iota(t)$ for almost every joule.
4. If each act's bits are instead credited at the instant it closes, then $dX = \sum_k b_k\,\delta_{e_k}$ is singular with respect to $dJ$ whenever some $b_k > 0$. Then $g$ is a step function, $g' = 0$ at almost every joule, and all agency sits on a set of zero joules.

**Proof.**

1. $X(A) = \sum_k (b_k/J_k)\int_A P_k\,dt \le \frac{1}{k_BT\ln 2}\int_A \sum_k P_k\,dt \le \frac{J(A)}{k_BT\ln 2}$, by K1 per act and then $\sum_k P_k \le P$. If $J(A) = 0$, then $X(A) = 0$.
2. Both measures are finite, so the Radon-Nikodym theorem gives $\iota$. If $\iota > 1/(k_BT\ln 2)$ on a set $B$ with $J(B) > 0$, then $X(B) > J(B)/(k_BT\ln 2)$, against step 1. On $\{P > 0\}$, $dX = \sum_k (b_k/J_k)(P_k/P)\,dJ$, and $P_k = 0$ where $P = 0$. That gives the explicit form.
3. If $J(t_1) = J(t_2)$ with $t_1 < t_2$, step 1 gives $X((t_1,t_2]) = 0$, so $g$ is well defined. For $t_1 < t_2$, $g(J(t_2)) - g(J(t_1)) = X((t_1,t_2]) \le (J(t_2) - J(t_1))/(k_BT\ln 2)$. $J$ is continuous, so $g$ is Lipschitz on $[0, J(T)]$. A Lipschitz function is absolutely continuous and differentiable almost everywhere. A change of variables gives $\int_0^t g'(J(s))\,dJ(s) = g(J(t)) = X([0,t])$. So $g'\circ J$ is also a density of $X$ with respect to $J$, and it equals $\iota$ by uniqueness.
4. $X(\{e_k\}) = b_k > 0$ while $J(\{e_k\}) = 0$, because $J$ is continuous. So $dX$ is not absolutely continuous. It sits on finitely many points of zero joules, so it is singular. A function constant between finitely many jumps has zero derivative almost everywhere. $\blacksquare$

**Reading.** Hindsight intelligence is a well-defined density on the joule axis once each act's bits are spread over the joules that act used. The crediting rule is what makes $dX/dJ$ exist. Point crediting puts all agency on a set of zero joules. Overlapping acts are handled by any attribution that never assigns more joules than the meter read. Each $b_k$ is known only after act $k$ closes, so $\iota$ is read off the completed run.

#### Proposition 6. Sampled intelligence converges

**Setting.** The meter is read at cumulative joules $0 = j_0 < j_1 < \dots < j_M = J(T)$, with mesh $\delta = \max_i (j_{i+1} - j_i)$. On $[j_i, j_{i+1})$ the sampled intelligence is

$$
\hat\iota = \frac{g(j_{i+1}) - g(j_i)}{j_{i+1} - j_i}
$$

Time samples refine joule samples, because $J$ is continuous.

**Statement.** Under the setting of Proposition 5, $\hat\iota(j) \to g'(j)$ at almost every joule $j$ as $\delta \to 0$, and $0 \le \hat\iota \le 1/(k_BT\ln 2)$ at every mesh. If the meter's reading of each sampled interval has relative error at most $\epsilon < 1$, the reported ratio lies in $[\hat\iota/(1+\epsilon),\, \hat\iota/(1-\epsilon)]$.

**Proof.** $\hat\iota(j)$ is the average of $g'$ over a sampled interval $I \ni j$ of length $h \le \delta$. Since $I \subseteq [j - h, j + h]$,

$$
\big|\hat\iota(j) - g'(j)\big| \;\le\; \frac{1}{h}\int_{j-h}^{j+h}\big|g'(u) - g'(j)\big|\,du
$$

The right side tends to 0 at every Lebesgue point of $g'$, and almost every $j$ is a Lebesgue point by Lebesgue's differentiation theorem. The bounds on $\hat\iota$ are the monotonicity and the Lipschitz constant of $g$. A reading $\Delta\hat J \in [(1-\epsilon)\Delta J, (1+\epsilon)\Delta J]$ divides the same $\Delta X$. $\blacksquare$

#### Proposition 7. Composition of joules and coupled bits

**Setting.** A group $G$ of members $i = 1, \dots, n$ acts on one world $W'$. Each member sits behind its own metered wall. The walls are disjoint and inside the group's wall, and every member draws its energy from outside the group. Members choose acts $a_1, \dots, a_n$ by independent policies. Member $i$'s coupling is computed with the other members acting under their own policies.

**Statement.**

1. $J_G = \sum_i J_i + J_0$, where $J_0 \ge 0$ is the energy that enters the group's wall and no member's wall.
2. $I(\mathrm{do}(a_1,\dots,a_n); W') \ge \sum_i I(\mathrm{do}(a_i); W')$, with equality if and only if $a_i$ is independent of $(a_1, \dots, a_{i-1})$ given $W'$ for every $i$.
3. The inequality can be strict when every member alone is uncoupled. With $a_1, a_2$ independent uniform bits and $W' = a_1 \oplus a_2$, each member's coupling is 0 bits and the group's is 1 bit.
4. Under K1 per act at the group's wall, Proposition 5 applies to $G$: $\iota_G$ exists and $0 \le \iota_G \le 1/(k_BT\ln 2)$. By Definition 2, $G$ is the agent when $X_G/J_G$ exceeds $X_S/J_S$ for every other candidate, each member included.

**Proof.**

1. Every joule that enters a member's wall first enters the group's wall, and metered energy adds over disjoint walls.
2. Under intervention the acts have the product distribution $\prod_i p(a_i)$, and each coupling is a mutual information of the interventional joint distribution (Definition 1). Member $i$'s coupling is $I(a_i; W')$ in that joint, by marginalizing the other acts. By the chain rule, $I(a_{1:n}; W') = \sum_i I(a_i; W' \mid a_{<i})$. Independence gives $I(a_i; a_{<i}) = 0$, so $I(a_i; W' \mid a_{<i}) = I(a_i; W', a_{<i}) = I(a_i; W') + I(a_i; a_{<i} \mid W') \ge I(a_i; W')$. Equality holds for every term if and only if $I(a_i; a_{<i}\mid W') = 0$ for every $i$.
3. Given $a_1$ alone, $W'$ is still a uniform bit, so $I(a_1; W') = 0$, and likewise for $a_2$. Given both acts, $W'$ is fixed, so $I(a_1, a_2; W') = H(W') = 1$ bit.
4. Proposition 5 needs only the run, the meter and K1 per act. Apply it at the group's wall. $\blacksquare$

**Reading.** Joules add, with the group's links on top. Coupled bits from independent members add at least, and some exist only at the group level. A group raises $\iota_G$ when it gains more coupled bits than its members hold alone, or spends fewer joules acting together than its members spend acting apart. Section 4.1 gives the theorems that price both terms.

### 2.4 Where the studies sit

- **Mixture of Limits** is the optimum operator. The cheapest sufficient gear is the argmin over joules.
- **Notational Intelligence** is the receipt. It carries $R^*$, $R$, $m$ and $J$ for every act.
- **Metabolic Intelligence** computes $\iota$ on any fabric.
- **Klere** is the hardware that meters $J$.

## 3. Layer 1. The Universal Law of Agency

The law has four clauses: prediction fixed before the act, coupling to the world through intervention, consequence borne by the system, and a physical floor in joules with refusal on a receipt.

### 3.1 Proven

**Information has a price.** Landauer showed that a logically irreversible operation dissipates at least $k_B T \ln 2$ per bit [6]. This is the floor under clause 4. Bennett built a reversible Turing machine and showed that only erasure must cost [35]. The unavoidable cost of agency sits at the reset of the acceptor, not at the thinking. Bennett then resolved Maxwell's demon by the cost of erasing the demon's memory [7]. The demon is a minimal agent. Its accounts close only when its memory is reset. That is clause 3 plus clause 4.

**Feedback is priced by information.** Sagawa and Ueda proved that with feedback, extractable work is bounded by $-\Delta F + k_B T I$ [3]. The value of acting on a measurement is capped by the information the measurement carries. They proved that measurement work plus erasure work is at least $k_B T I$ [5]. The full cycle of predict, compare and reset is priced in joules. They derived an exact Jarzynski equality under feedback [4] and a fluctuation theorem with information exchange between subsystems [36]. Coupling is a correlation that enters the second law. Hartle, Wolpert, Stier, Kempes and Manzano priced feedback with noisy measurements, limited memory and a limited repertoire of protocols. Against random action as the baseline, the benefit of feedback can exceed the information gained by orders of magnitude [37]. The bits bound the work against free energy. The value against a baseline is read off the meter.

**Entropy converts to joules.** Esposito and Van den Broeck derived $k_B T \Sigma = W - \Delta F_{\mathrm{neq}}$ for an isothermal driven system [24]. Every kinematic bound in Layer 2 becomes a joule bound through this identity. Horodecki and Oppenheim proved work costs for single shots at small scale [38]. Agency acts are single shots. The standard reviews state the settled account: information is a thermodynamic resource with a price [39, 40].

**Control needs coupling.** Conant and Ashby proved that a good regulator must be a model of the system it regulates [41]. A system that regulates well already carries a prediction. Touchette and Lloyd proved that the entropy a controller removes is bounded by its mutual information with the system [32, 33]. Coupling is the currency of control. Closed loop control, acting on a comparison, is what the law requires. Pearl's do-calculus gives the intervention operator and the conditions under which its effects are identifiable [1]. Clause 2 is written in this operator. Everitt and colleagues classified how an agent can tamper with its own reward or inputs [2]. Coupling must be to the world, not to the agent's own sensor. Richens and Everitt proved that any agent that meets a regret bound under a large set of distributional shifts has learned an approximate causal model of the process that generates its data [42]. Richens, Abel, Bellot and Everitt proved that any agent that generalizes to multi-step goal-directed tasks has learned a predictive model of its environment, and that the model can be extracted from the policy [43]. A capable agent carries a prediction. That is clause 1, proven for modern agents.

**Information flows inside the agent.** Horowitz and Esposito showed that information flow between subsystems enters each subsystem's second law [44]. Coupling becomes a rate. Ito and Sagawa proved a second law for arbitrary causal networks with transfer entropy [45]. Prediction, act and outcome are nodes on such a network. Hartich, Barato and Seifert linked transfer entropy, learning rate and dissipation [46]. Allahverdyan, Janzing and Mahler bounded the efficiency of information flow between coupled systems [47]. Esposito and Schaller showed that feedback that changes only barriers still enters the entropy balance [48]. A purely informational act is in the joule ledger.

**Autonomous demons.** Mandal and Jarzynski solved a demon that lifts a mass by writing bits to a tape [49]. It has no outside operator, and memory pays for its work. Boyd, Mandal and Crutchfield bounded the work of such ratchets by the entropy rates of their input and output tapes [50]. They showed that modular designs pay dissipation above Landauer [51]. How an agent is built changes its floor. Wolpert and Kolchinsky computed the extra entropy production a gate pays inside a circuit, set by the circuit's topology [52]. Wiring is part of the floor.

**Prediction quality has a joule price.** Kolchinsky and Wolpert proved that a process tuned for one input distribution dissipates extra on any other, by a relative entropy term [53]. Still, Sivak, Bell and Crooks showed that memory that does not predict costs dissipation [54]. Keeping only what predicts is the cheap design. Kolchinsky and Wolpert defined semantic information as information that is causally necessary for a system to keep itself out of equilibrium, with a thermodynamic value [55]. It is the closest existing law with joules. It stops before kinematics and before an intelligence operator. Ortega and Braun derived bounded-rational decisions from a free-energy principle with an information cost [56]. Kolchinsky and Wolpert bounded the heat of universal computation by program complexity [57]. Kolchinsky and Wolpert showed that constraints on the available protocols limit extractable work and the value of information [58]. Manzano and colleagues derived fluctuation relations and second-law-like inequalities for computations that halt at random times [59]. A run that stops when its predicate passes is such a computation.

**Coupling and boundary rest on theorems.** Ay and Polani defined causal information flow through interventions [8]. Transfer entropy does not measure that flow, shown by example [11]. The Markov blanket condition holds only in a narrow range of parameters, by derivation [15], and its definitions in use differ, by counterexample [16]. Every bipartite stochastic process has a causal blanket, by theorem [22]. Definitions 1 and 2 stand on these results.

### 3.2 Demonstrated

**Landauer's floor, measured.** A colloidal bead in an optical double well approached $k_B T \ln 2$ of mean heat as erasure slowed [60]. A feedback trap measured the same approach with high precision and extra cost at short cycle times [61]. The floor rises when the act is fast. That is a Layer 2 effect seen in a Layer 1 experiment. An adiabatic electronic circuit showed the Landauer cost for irreversible operation and dissipation below $k_B T$ for reversible operation [62]. The floor binds the reset, not the logic. Nanomagnetic memory bits showed the floor in memory hardware [63]. Erasure with near-zero work appears when the free-energy accounting is complete [64]. The floor is on total entropy, so the receipt must carry the full account. The entropy that enters the bound was measured to have the Gibbs-Shannon form [65]. A single trapped ion showed the quantum floor [66]. The floor holds on every substrate tested. An underdamped micromechanical oscillator reached the floor at high speed [67]. A quantum dot erased bits at minimal dissipation for a given duration, with protocols designed from thermodynamic length [68].

**Feedback agents turn information into work.** A colloid on a spiral staircase potential gained free energy above the work done, paid by information, and confirmed the generalized Jarzynski equality [69]. This is the first direct observation of an act whose value is set by a measurement made before it. A single-electron box extracted work near $k_B T \ln 2$ per bit [70] and measured the fluctuation theorem with mutual information [71]. An autonomous on-chip demon cooled a system with information while its own heating was measured [72]. The agent's cost was measured beside its effect.

Quantum agents obey the same law. NMR on molecular spins reduced entropy production by feedback, within the information bound [73], and converted information to energy at the floor [74]. Superconducting circuits tracked a demon's memory during feedback [75], verified the generalized integral fluctuation theorem [76], and measured information gained and lost during feedback [77]. Coupling decays, so the receipt must record it at the time of the act. Cold atoms in a three-dimensional optical lattice were sorted by measurement [78]. Linpeng and colleagues measured the energetic cost of quantum measurement with quantum, coherent and thermal light in a circuit quantum electrodynamics setup. Single-photon light cost the least energy per unit of information gained [79]. The measurement that writes a record has a measured price.

Classical engines measured the price at full scale. An optical tweezer engine converted information to work at the theoretical limit [80]. A colloidal engine extracted work that depends on temporal correlations in its input [81]. A DNA hairpin under continuous monitoring yielded more than $k_B T \ln 2$ per cycle when many measurements happened per cycle, consistent with the information content [82]. A levitated microparticle with delayed feedback obeyed a generalized second law across two decades of delay, and feedback failed at large delay [83]. A late act is a weaker act. Feedback trap engines maximized power and velocity [84], exploited noisy measurements optimally [85], and harvested a nonequilibrium bath [86]. A quantum dot linked work fluctuations to dissipation during information-to-work conversion [87]. A trapped ion verified fluctuation theorems that include the demon's own dissipation [88], following theory by Zeng and Wang [89].

**Functional-system agents built and run.** A simulated nematode with an acceptor of action results learned locomotion and chemotaxis [90]. A physical mobile robot ran the same functional-system controller [91]. Clauses 1 and 3 run in software and on a body. Neither meters joules.

### 3.3 Opinion

**Purposive systems and anticipation.** Rosenblueth, Wiener and Bigelow defined purposeful behavior through negative feedback toward a goal [92]. It has no energy term. Anokhin's functional system has afferent synthesis, decision, an acceptor of action results fixed before the act, action, and comparison [93, 94]. This is clauses 1 and 3 in their first systematic form, built on animal experiments. Sudakov stated the result as the system-forming factor [95]. The prediction clause is the organizing principle. Shvyrkov showed from single-neuron recordings that the goal organizes neural activity [96]. Rosen defined an anticipatory system as one that contains a predictive model of itself and its world and acts on the prediction [97]. None of these sets a joule floor. Sterling defines allostasis as regulation by prediction [98]. Physiology puts the prediction before the act. Virgo, Biehl and McGregor gave conditions under which a system's states can be read as beliefs updated by Bayes' theorem [99]. Biehl and Virgo call a system an agent when it can be read as solving a POMDP (partially observable Markov decision process) [100]. Both are formal definitions. Clause 1 asks for less and fixes more: one template, fixed at $t_0$, hashed on the receipt.

**Autonomy and organization.** Maturana and Varela defined the living by self-production [101]. Kauffman put a thermodynamic work cycle inside the definition of an autonomous agent [102]. It has no prediction clause. Di Paolo made adaptivity, the regulation of one's own viability, a condition for sense-making [103]. That is clause 3. Barandiaran and Moreno proposed a minimal criterion for cognitive organization and grounded adaptive regulation in metabolism [104, 105]. Barandiaran, Di Paolo and Rohde defined agency by individuality, interactional asymmetry and normativity [106]. Ruiz-Mirazo, Moreno and Mossio framed autonomy as a self-maintaining metabolic organization [107, 108]. Montévil and Mossio described organisms as closures of constraints on thermodynamic flows [109]. It is the closest of this school to joules. Aguilera and Barandiaran built a minimal model of autonomous agency in stochastic thermodynamics [110]. The autonomy tradition is moving toward the joule. Barandiaran and Almendros applied individuality, normativity and interactional asymmetry to large language models. A model fails the first two and partly fails the third [111]. The law applies its gate per act: a model call is an act when its receipt carries $R^*$, $m$ and $J$. Levin's TAME (Technological Approach to Mind Everywhere) treats agency as graded and testable by experiment at every scale [112]. The law keeps the gate binary per act and puts the grading in $X$.

**Free energy and the physics of agency.** Friston proposes that agents minimize variational free energy [113, 114]. That free energy is informational, not joules, and every bounded system qualifies, so it sets no floor. Rovelli explains agency through the entropy gradient [115]. Agency is thermodynamic at root. Jaeger argues that agency requires self-manufacture and that current artificial intelligence lacks it [116]. That is a demand for a gate before any intelligence claim. Azadi ties agency to computational irreducibility [117]. Wissner-Gross and Freer propose a force toward future path diversity [118]. Its causal temperature is not a bath temperature, so its units are not joules. Kappen's comment critiques it [119]. Fields, Goldstein and Sandved-Smith separate thermodynamic free energy, in joules, from variational free energy in active inference agents, and relate the two [120]. Only the joule quantity enters K1. Bruineberg and colleagues separate the Markov blanket as a tool of inference from the blanket as a physical boundary [17]. Definition 2 takes the boundary from the law. Bartlett and colleagues make goal-directed information processing, measured by semantic information, the distinctive feature of living systems [121]. That is clauses 2 and 3 as a criterion for life.

## 4. Layer 2. The kinematic laws of agency

Once an act is eligible, physics bounds how fast agency moves per second and per joule, and what precision and speed cost. The bounds come in four families: speed limits, the TUR, finite-time costs and rate ceilings.

### 4.1 Proven

**Speed limits.** Shiraishi, Funo and Saito proved the classical speed limit in Section 2.2 [23]. Moving the agent's state distribution a distance $L$ in time $\tau$ costs entropy, and so joules. The bound extends to open quantum systems [122] and to strong coupling with general environments [123]. Vo, Van Vu and Hasegawa derived the speed limit and the TUR from one inequality [124]. Falasco and Esposito bounded the time to complete a transition by the dissipation spent [125]. Ito bounded the information-geometric speed of a distribution by entropy production [126]. Ito and Dechant bounded the rate of change of any observable by Fisher information and dissipation [127]. Nakazato and Ito bounded entropy production by the Wasserstein distance traveled [128]. Dechant, Sasa and Ito split entropy production into the part that moves the system and the part that keeps it running [129]. Van Vu and Saito unified the TUR, minimum dissipation and speed limits through optimal transport [130]. Nagayama, Yoshimura and Ito derived a family of speed limits indexed by generalized means of activity [131]. Yoshimura and Ito proved the TUR and the speed limit in deterministic chemical reaction networks [132]. Aurell, Mejía-Monasterio and Muratore-Ginanneschi solved minimal finite-time dissipation as an optimal transport problem [133]. The kinematic laws form one family. The cheapest way to move an agent's state is a transport map. Hasegawa derived the speed limit, the TUR and the Heisenberg principle from one bulk-boundary correspondence [134]. Van Vu and Hasegawa bounded irreversible entropy production by a modified Wasserstein distance in classical and quantum Markov systems [135]. Delvenne and Falasco bounded entropy production by the statistics of kinetic observables [136].

**Precision costs dissipation.** Barato and Seifert stated the TUR, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma$ [25]. A reliable agent pays for its reliability. From $2/\epsilon^2$ at $\epsilon = 0.01$, precision of 1% costs at least 20,000 $k_B T$ [137]. Gingrich, Horowitz, Perunov and England proved the TUR for all steady-state currents [26]. Horowitz and Gingrich proved it for finite observation times [138], which is what agents have. Further results bound the full distribution of fluctuations [139], cover discrete time steps [140], extend the TUR wherever a fluctuation theorem holds [141], and cover Langevin dynamics, underdamped motion and velocity feedback [142, 143, 144]. Correlations between currents tighten the bounds [145]. Potts and Samuelsson showed that any fluctuation relation implies a TUR, including with measurement and feedback [28]. This is the precision law for agents. A review states the field [146]. Barato and Seifert priced the precision of a clock [147]. Salazar bounded entropy production by information from the detailed fluctuation theorem [148]. Landi and Paternostro reviewed entropy production from classical to quantum [149]. Feedback forms now cover the cases agents meet. Van Vu and Hasegawa bounded fluctuations under arbitrary control protocols by entropy production and a kinetic term [150]. Tanogami, Van Vu and Saito bounded the current of a subsystem by its own entropy production and the information flow between it and its partner [151]. Kumasaki, Tojo, Sagawa and Funo derived a TUR for feedback cooling [152]. Honma and Van Vu derived a finite-time TUR for open quantum systems under continuous monitoring and Markovian feedback, with quantum mutual information beside entropy production [153]. For counting observables, Garrahan bounded fluctuations by dynamical activity and gave the matching bounds for first-passage times [34]. Gingrich and Horowitz derived the conjugate relation for the first passage time to accumulate a net current [154]. Proposition 3 applies these results to confirmed agency.

**Finite-time costs.** Schmiedl and Seifert found optimal finite-time protocols, with jumps at the ends [155]. The optimal act at finite speed is not the slow act. Sivak and Crooks bounded excess work by the squared thermodynamic length over the duration [30]. Proesmans, Ehrich and Bechhoefer found the minimal cost of erasing a bit in time $\tau$ [29, 156]. The Layer 1 floor becomes a Layer 2 curve. Zhen and colleagues stated a universal finite-time bound on reset energy [157]. Speed and efficiency trade against each other by theorem: efficiency at maximum power [158, 159], finite power forbidding Carnot efficiency [160], a three-way trade among power, efficiency and constancy [161], and a universal constraint for low-dissipation engines [162]. Tsirlin and colleagues found minimal dissipation at a fixed rate [163]. Lee, Lee, Kwon and Park tightened the speed limit for highly irreversible processes and obtained a tight finite-time Landauer bound [164]. Van Vu and Saito derived the finite-time quantum Landauer principle and the role of coherence in it [165]. Rolandi and Perarnau-Llobet derived the finite-time Landauer principle beyond weak coupling [166]. Kamijima, Funo and Sagawa derived the finite-time trade-offs between measurement and feedback [167]. Tkachenko showed for physical neural networks that quasi-static inference needs no work, while finite-speed inference costs at least a transport distance (preprint) [168]. Inference has no floor that survives slow operation. The reset does. Proposition 1 prices it.

**Holding a goal.** Tatikonda and Mitter [169] and Nair and Evans [170] proved the data-rate theorem: holding an unstable linear system needs a channel rate above the sum of the base-2 logarithms of its unstable eigenvalue magnitudes. Nair, Fagnani, Zampieri and Evans reviewed the field [171]. Sandberg, Delvenne, Newton and Mitter found the maximum work a continuously measuring demon extracts in finite time, and showed that any implementation needs an external power source [172]. Horowitz and Sandberg showed that the information terms in second-law inequalities form a hierarchy, each the minimum cost of acquiring that information by a distinct measurement [173]. Proposition 2 turns the bit count into a joule floor per step.

**Quantum feedback and measurement.** The feedback second law holds for quantum systems [3]. Jacobs extended it to weak measurements [174]. Funo, Watanabe and Ueda derived integral fluctuation theorems under quantum measurement and feedback [175]. Guryanova, Friis and Huber proved that ideal projective measurements need infinite resources, and gave the energy cost of a pointer that reproduces the system's statistics [176]. Danageozian, Wilde and Buscemi bounded the measurement heat of error identification by the Groenewold information gain [177]. These price the measurement that writes a record. Proposition 4 keeps the floor of the record itself.

**Groups.** Wolpert derived a strictly nonzero lower bound on the minimal entropy production rate of interacting subsystems from the constraints on which subsystems each one depends on [178]. Tasnim and Wolpert extended the theory to subsystems that change state together [179]. Wolpert related the entropy production of a whole Bayes net to the precision of currents in its parts [180]. Rolandi, Abiuso and Perarnau-Llobet showed that collective protocols can make dissipated work grow sublinearly with the number of members [181]. Fujimoto and Ito found by a game-theoretic method that the partial entropy productions of interacting subsystems trade against each other, and that the total is least when the subsystems share the penalty equally [182]. Proposition 7 composes these joules with the group's coupled bits.

**Rate ceilings.** Margolus and Levitin bounded orthogonal transitions per second by energy [31]. Lloyd applied the limit to a whole computer [183]. Deffner and Campbell reviewed the family of quantum speed limits [184].

**Living sensors.** Energy dissipation, adaptation speed and accuracy are bound together in bacterial chemotaxis [185]. Learning about the environment requires energy [186], and inference accuracy is tied to dissipation [187]. Sensing precision is limited by receptors, time and energy, with an optimal allocation among them [188]. No resource can be skipped. That fits Mixture of Limits. Erasure inside adaptation has a cost [189]. Information acquired per energy dissipated is the nearest existing quantity to $v_J$ in living sensors [190, 191]. Copying information costs energy [192]. Writing the receipt has a price. Accurate and synchronized biochemical clocks cost free energy [193, 194], and so does reducing noise at high sensitivity [195]. Holding a system away from equilibrium has a minimum power [196]. That is the standing cost of an agent ready to act. Bryant and Machta bounded the energy of sending a bit through a cell's physical channels, in $k_B T$ per bit, as a function of size, distance and latency, and found it many orders of magnitude above unity [197]. Tjalma and colleagues showed that the bits of the past that best predict the future are prohibitively costly for cellular networks [198].

**Information rates without joules.** Schreiber defined transfer entropy, directed information flow per step [199]. It is per time, not per joule, and it has no eligibility gate. Tishby and Polani charged information per step in a Bellman recursion [200]. Landauer converts those bits to joules. Stratonovich bounded the maximal gain from a given amount of information [201]. That is a ceiling on value per coupled bit.

### 4.2 Demonstrated

**The TUR tested.** A two-qubit NMR experiment obeyed generalized TURs and violated the specialized TUR where theory predicts [202]. An optical tweezer information engine violated the original TUR near maximal efficiency and obeyed generalized bounds with mutual information [27]. Agents need the feedback form. A quantum dot Szilard engine confirmed it independently [203]. Atomic-scale conductors examined the TUR with measured current noise, the physics of every chip [204]. Molecular motors were scored by precision per unit dissipation [205]. Observed current fluctuations bound dissipation from below [206]. A receipt of fluctuations is a lower-bound meter for joules.

**Speed limits and finite-time costs tested.** Single atoms in an optical lattice showed the Mandelstam-Tamm and Margolus-Levitin bounds and the crossover between them [207]. The rate ceiling is measured. A trapped colloid measured time and entropy trade-offs for fast thermal transitions [208]. Brownian particles driven by optimal transport protocols saturated the minimal finite-time dissipation bound [209]. The kinematic optimum is reachable. A feedback trap measured a two-force Brownian machine against linear response bounds [210]. A photonic experiment tested geometric bounds on entropy production [211]. Dago and Bellon measured erasure in a double-well memory at high speed and traced the overhead above Landauer's bound to its sources [212].

**Living sensors measured.** Mattingly, Kamino, Machta and Emonet measured the rate at which E. coli acquires information during chemotaxis, and showed that the cells climb gradients close to the limit that rate sets [213]. Information limits behavior, measured.

**Heat engines at finite speed.** A single colloid ran a micrometer Stirling engine [214]. A trapped bead ran a Brownian Carnot cycle with efficiency at maximum power measured [215]. The energy cost of choosing one of two options was measured [216]. That is the smallest act. A colloidal engine ran on an active bacterial bath [217], and engineered noise gave near-Carnot efficiency at finite power by shortening relaxation [218]. Engineering activity moves the bound. An information engine flipped from refrigerator to heater with noise [219]. The receipt must record the regime, not only means.

**Empowerment in simulation.** Klyubin, Polani and Nehaniv defined empowerment, the channel capacity from actions to future sensors [9]. It was computed for continuous control [220] and reviewed [221]. It measures how much an agent can move the world, in bits. It is not a rate per joule.

### 4.3 Opinion

Kinematics is mostly theorem and experiment. The opinions here concern which variable is right. Seifert holds that inference from fluctuations is the route to hidden costs [137]. Rovelli and Wissner-Gross and Freer both propose entropic kinematics [115, 118]. Kolchinsky shows that dissipation alone does not bound how fast replicators grow or decay [222]. Rates are bounded by dissipation together with activity. That is the form of the speed limit, where $\langle A\rangle$ sits beside $\Sigma$. Adlam, McQueen and Waegell argue that a purely quantum system cannot be an agent, because building a world model and deliberating need copying, which the no-cloning theorem forbids (preprint) [223]. Clause 3 already asks for a classical record of $m$.

## 5. Layer 3. Intelligence as the calculus of agency

Intelligence is the derivative of gated agency in joules, read off a completed run. This layer needs three things from the literature: theory that ties learning and decision to joules, measurement of joules per unit of useful work, and positions on what intelligence is.

### 5.1 Proven

**Learning and prediction priced in joules.** Goldt and Seifert bounded the information a learning network acquires by the entropy it produces [224]. Learning efficiency is at most one. This is $\iota$ for the learning part of an act, with a ceiling. Still showed that optimal memory keeps only predictive information [225]. The marginal joule spent on memory must buy prediction. Boyd, Crutchfield and Gu proved that the agent that extracts the most work from data has the maximum-likelihood model of that data [226]. Better models yield more work per joule. Boyd, Crutchfield, Gu and Binder stated overfitting and generalization as energetics [227]. Generalization appears as joules. Ehrich, Still and Sivak priced the controller itself, beyond the information it uses [228]. So $J$ must be metered at the wall of the whole system. Ehrich and Sivak gave the ledger of energy and information flows in autonomous machines [229]. Wolpert reviewed computation costs beyond Landauer [230]. Levy and Baxter showed that neural codes that maximize bits per unit energy differ from codes that maximize bits [231]. The right objective for a brain is information per joule. Balasubramanian, Kimber and Berry set the objective for an exploratory regime as transmission rate per unit power [232]. That is bits per joule. Goldt and Seifert bounded the information a network learns about a rule by the thermodynamic cost of learning, for batch and online learning [233]. Fiderer, Barth, Smith and Briegel defined the work capacity of an environment channel, the maximum rate at which any agent can expect to extract work in a percept-action loop. Work-efficient agents balance prediction against forgetting (preprint) [234]. Elliott, Gu, Garner and Thompson showed that quantum adaptive agents can need far less memory than memory-minimal classical agents [235]. Less memory to reset is a lower floor to pay.

**Decisions and bounded optimality.** Russell and Subramanian defined bounded optimality: the best program for a given machine and environment [236]. Here the resource is joules, and the optimum is $\arg\min J$ subject to $X \ge X_{\mathrm{req}}$. Genewein and colleagues derived abstraction and hierarchy from utility minus information cost [237]. Mixture of Limits gears are such a hierarchy. Legg and Hutter defined intelligence as complexity-weighted expected reward over all computable environments [238]. It is an integral, but over reward, without energy, and uncomputable. The derivative in joules replaces reward with confirmed coupled bits and the measure with metered joules. Takahashi and Hayashi define empowerment per joule from stochastic thermodynamics [239]. It is the closest existing calculus in joules. It has no law gate in front of it. Ortega, Braun, Dyer, Kim and Tishby set out information-theoretic bounded rationality [240]. Zénon, Solopchuk and Pezzulo cast the cost of cognition as information [241]. Sims applied rate-distortion theory to perception [242]. Their currency is bits. Landauer converts bits to joules at the reset.

### 5.2 Demonstrated

**Brains.** Laughlin, de Ruyter van Steveninck and Anderson measured the energy cost per bit in blowfly photoreceptors and interneurons [243]. Higher information rates cost more per bit. That is a measured $\iota$ in a living agent and a measured diminishing return, $\alpha_J < 0$ in sensing. Attwell and Laughlin built the energy budget of grey matter by process [244]. Lennie showed that energy limits how many cortical neurons can be active at once [245]. Energy is the constraint, and the rest adapts. Energy per action potential differs widely across neuron types [246]. Same function, different joules. Neural design follows energy efficiency [247]. Levy and Calvert audited the human cortex. Communication costs 35 times as much as computation, and a neuron's computation sits a factor of $10^8$ from the best possible bits per joule [248]. That is a distance to the floor. Harris and colleagues found that a visual pathway synapse is sized to maximize information per unit energy, not information [249]. The objective is bits per joule, measured at one synapse. Padamsey, Katsanevaki, Dupuy and Rochefort found that food restriction cut synaptic ATP (adenosine triphosphate) use in mouse visual cortex by 29% and broadened orientation tuning by 32% [250]. Fewer joules bought less precision. Plaçais and Preat showed that starved flies switch off costly aversive long-term memory, and forcing it back reduced survival [251]. Plaçais and colleagues found that raised energy flux in the mushroom body triggers long-term memory [252]. Mery and Kawecki found that forming long-term memory lowered flies' resistance to desiccation [253]. Learning has a measured metabolic price. Hechler, de Lange and Riedl measured lower cortical oxygen use during confident prediction, by up to 12% (preprint) [254]. Prediction first can save joules. Malkin and colleagues gave synapses an energy cost for reliability in trained networks and found signatures of Bayesian inference in the optimum [255]. Li and van Rossum showed that naive synaptic plasticity costs extreme energy and that caching changes before consolidation saves it [256]. Lynn and colleagues inferred broken detailed balance in the human brain from neuroimaging, rising with physical and cognitive exertion [257]. That entropy production is coarse-grained and informational. It is not a joule meter.

**Machines.** Memory access costs far more energy than arithmetic [258]. Parameter count matters only through the joules it makes you move. Intelligence per watt measures task accuracy per unit power on local accelerators [259]. Its numerator is benchmark accuracy, not gated agency. MLPerf Power standardizes power measurement from microwatts to megawatts [260]. ML.ENERGY measures inference energy automatically [261]. TokenPowerBench benchmarks the power of large language model (LLM) inference [262]. Jin, Wei and Brooks analyze the energy of test-time compute [263]. General-purpose models cost much more energy per task than task-specific ones [264]. The cheapest sufficient model wins in joules. That is Mixture of Limits, measured. Samsi and colleagues measured the energy of large language model inference on GPUs (graphics processing units) [265]. Dillavou and colleagues demonstrated decentralized learning in a physical circuit, with no processor [266]. Stern and colleagues trained self-learning circuits for power-efficient solutions and measured the trade between power and error [267]. Saggio and colleagues demonstrated a quantum speed-up for learning agents in a photonic experiment [268]. Fewer interactions to learn is fewer acts to close.

**Groups simulated.** Crosato and colleagues computed the thermodynamic quantities of simulated collective motion across its critical point [269]. Chen and Prokopenko compared thermodynamic efficiency with purely informational utilities as explanations of collective behavior near criticality [270]. $\iota_G$ in Proposition 7 is the gated, metered form of such a ratio.

**Meters.** RAPL (Running Average Power Limit) is the set of on-die energy counters in Intel and AMD processors. Its readings were validated against external measurement [271]. DRAM (dynamic random-access memory) readings were validated separately [272]. Meter quality depends on the processor generation [273]. Apple's powermetrics manual states that its average power values "are estimated and may be inaccurate" and should not be used to compare devices [274]. On Apple silicon, powermetrics readings are reported values. Measured joules for that machine come from an external wall meter.

**Compression scored.** The Hutter Prize scores lossless compression of the first gigabyte of an English Wikipedia dump, with a prize fund of 500,000 euros and limits on runtime and memory [275]. It bounds time and memory, never joules. A joule cap would make it a calculus-of-agency benchmark for one task class.

**Estimates.** These sources are valuable, and their joule figures are modeled, extrapolated or computed. They sit beside measured joules, never in their place. Estimates are never `measured_j`. Strubell, Ganesh and McCallum sampled power for short runs and extrapolated to full training of natural language processing models [276]. Patterson and colleagues computed training energy from reported hardware, runtime and data-center data [277]. Lacoste and colleagues built a calculator from hardware type, runtime and region [278]. The BLOOM footprint mixes metered and modeled inputs [279]. Carbontracker reads on-device counters and predicts full-run totals [280]. Its predictions are estimates. Elsworth and colleagues report a median of 0.24 Wh per Gemini Apps text prompt, counting accelerators, hosts, idle capacity and data-center overhead [281]. It is an operator-reported figure, filed as `reported_j`.

### 5.3 Opinion

Each position is placed against the definition: intelligence is the derivative of gated agency in joules, read off a completed run.

- Schmidhuber treats intrinsic reward as compression progress, a first derivative of how well an agent compresses its history [282]. It is the closest precedent for intelligence as a derivative read from a run. Its variable is compression, not joules.
- Chollet defines intelligence as skill-acquisition efficiency over priors and experience, with the ARC (Abstraction and Reasoning Corpus) benchmark [283]. It is a ratio. Its denominator is information and data, not joules. The ARC Prize leaderboard plots cost per task against score as a measure of efficiency [284]. The cost is in dollars. A joule meter turns it into $J^*$.
- Hernández-Orallo builds universal psychometrics across species and machines [285]. It evaluates by tasks. This track evaluates by joules to close tasks. Hernández-Orallo and Dowe's anytime test adapts to the time available [286]. The calculus adapts to the joules available.
- Gershman, Horvitz and Tenenbaum define intelligence as expected utility net of computation cost [287]. This track makes the cost joules.
- Lieder and Griffiths treat cognition as optimal use of limited resources [288]. It is close to Mixture of Limits. The resource is left abstract.
- Balasubramanian reads the brain's design through its energy limits [289].
- Silver, Singh, Precup and Sutton hold that reward is enough [290]. Reward is chosen by a designer. Joules are read off a meter. Vamplew and colleagues reply that scalar reward cannot express multi-objective goals [291]. This track keeps one variable, joules, and moves multiplicity into the gate $X \ge X_{\mathrm{req}}$.
- Hafez and colleagues define agency and intelligence together [292]. It is not joule-native.
- Karagoz makes energy self-sustainment the objective [293]. It has no prediction gate, no kinematics and no joule ranking across systems.
- Chaisson proposes energy rate density, power per unit mass, as a complexity metric across cosmic evolution [294]. It is a rate in watts per kilogram. The calculus divides confirmed bits by joules.

### 5.4 Where the calculus stands

- **Proven:** learning, memory, prediction and control each have a joule price with a ceiling.
- **Demonstrated:** joules per bit are measured in brains. Joules per task are measured in machines. Meters can be validated.
- **Proven here:** $\iota$ is a bounded density on the joule axis under joule-proportional crediting (Proposition 5). Sampled $\iota$ converges to it (Proposition 6). Groups compose by Proposition 7.
- **Missing everywhere:** no source reads intelligence as $dX/dJ$ off a gated, completed run. That is David's contribution and the work of this track.

## 6. Global findings, by method

The search ran in Russian, Chinese, Japanese, German, French, Spanish, Portuguese, Korean, Italian, Polish, Hindi and Arabic, with English follow-ups. A second pass searched Japanese, Chinese, Russian, German, French, Spanish and Korean again and added Persian, Turkish and Hebrew. Its results are folded into Sections 2 to 5 and 8 by what they prove, measure or define. Results are organized by method and class of result. Language is metadata only. No entry is ranked by where it came from.

### 6.1 Theorems and reviews: information has a thermodynamic price

- Poplavskii gave an early systematic treatment of the energy cost of acquiring and processing information [295]. Written in Russian, with an English translation. Layer: law.
- Stratonovich proved value-of-information theorems [201]. English edition of a Russian monograph. Layer: kinematics.
- Ito and Sagawa applied information thermodynamics on networks to E. coli chemotaxis. Transfer entropy bounds robustness, and information-thermodynamic efficiency is high where ordinary thermodynamic efficiency is low [296]. Written in Japanese. Layers: law and kinematics.
- Sun and Quan reviewed Maxwell's demon and the physical floor on dissipation in information processing [297]. Written in Chinese. Layer: law.
- Quan, Dong and Sun reviewed mesoscopic thermodynamics: the demon is consistent with the second law once erasure is counted, and power-efficiency constraints were tested [298]. Written in Chinese with an English abstract. Layers: law and kinematics.
- Parrondo's encyclopedic review gives the current account of information as a thermodynamic resource [299]. Layer: law.
- Strasberg's doctoral thesis tests common assumptions in information thermodynamics with physical models [300]. Written in English with a German abstract. Layer: law.
- Further theorems surfaced through searches in Japanese, Russian, Chinese, Korean, Portuguese, Italian and Polish: speed limits and TURs in chemical networks [127, 131, 132], finite-time thermodynamics [159, 162, 163], Langevin TURs [143, 144], information bounds on entropy production [148, 149], and single-shot work costs [38].

### 6.2 Experiments: the price measured

- Dago's doctoral thesis reports 1-bit erasure and writing near the minimal energy at high speed on an underdamped micro-cantilever [301]. Written in French. Layer: the law's floor reached at kinematic speed.
- Lagoin's doctoral thesis builds macroscopic Maxwell's demons, including a Szilard engine, from a vane in a granular gas [302]. Written in French. Layer: law. The demon's accounting holds outside the microscopic regime.
- Ciampini and colleagues used extractable work to witness quantum correlations in a photonic experiment [303]. Layer: law.
- Experiments surfaced through searches in Korean, Portuguese, Hindi, Italian, Spanish, Chinese and Japanese: information engines [27, 80], NMR demons [73, 74], the TUR on qubits [202], active-bath engines [217, 218], geometric bounds [211], symmetry breaking and Carnot cycles [215, 216], trapped-ion demons [66, 88], and feedback conversion and optimal transport [69, 76, 209].

### 6.3 Theory of functional systems: prediction before the act

The Anokhin school states clauses 1 and 3 in physiological terms. A result template, the acceptor of action results, is formed before the act, compared after it, and the comparison reorganizes behavior. These works were found through Russian-language searches.

- Anokhin's functional system [93, 94].
- Sudakov on the result as the system-forming factor and on probabilistic prediction of behavior [95, 304, 305, 306].
- Shvyrkov on goals organizing neuronal activity and on learning as selection of neuronal systems [96, 307].
- K. V. Anokhin on the brain's cognitive structure as a hypernetwork of functional-system elements [308].
- Saltykov and Grachev on the system-forming factor as anticipation [309].
- Vityaev on purposefulness formalized as rule learning that predicts results [310].

**Implemented and run.** Cognitive architectures built on functional-system theory form result templates, compare, and learn subgoals, in simulation and on a physical robot [90, 91, 311, 312, 313]. None meters joules. Adding a meter to one of these agents would test the full order of law, kinematics and calculus on an existing implementation. Differentiable probabilistic logic networks are related calculus tooling, not built on functional systems, with no law gate and no joules [314].

### 6.4 Autonomy, organization and minimal agency

Found through Spanish, French and German searches. Agency is a self-maintaining organization that regulates its interactions [103, 104, 105, 106, 107, 108]. The organization is a closure of constraints on thermodynamic flows [109]. The autonomy school has stepped into stochastic thermodynamics [110]. Layer: law, as the organization that must exist before any act counts.

### 6.5 Measured joules for machine intelligence

Found through Chinese-language searches on inference energy: automated inference energy measurement [261], per-token power benchmarks [262], and the energy of test-time reasoning [263].

### 6.6 Philosophy of agency

Rovelli's physics of agency surfaced through German [115]. Jaeger and Azadi complete the set of position papers [116, 117].

### 6.7 Searches with no primary research

Hindi and Arabic searches returned no primary research in those languages. English follow-ups surfaced work from Indian institutions, listed above by method. Persian, Turkish and Hebrew searches returned theses, reviews and work already cited, with no new primary research.

## 7. Open problems

### 7.1 What must be proven

**P1. The run path is well defined.** Proven. Proposition 5 gives $\iota = dX/dJ$ as a density on the joule axis with $0 \le \iota \le 1/(k_B T\ln 2)$, under joule-proportional crediting. Proposition 6 gives convergence of sampled $\iota$ as the meter's sampling refines, with the meter's relative error as the error term.

**P2. Agency-gated Landauer bound.** Under closed-cycle accounting, each confirmed coupled bit costs at least $k_B T \ln 2$, so $v_J \le 1/(k_B T \ln 2)$. In hand: measurement plus erasure work is at least $k_B T I$ [5], and erasure costs at least $k_B T \ln 2$ per bit [6, 7]. Missing: a data-processing step showing that the coupled bits credited in $X$ cannot exceed the bits recorded in the acceptor's memory during the comparison. Clause 3 already requires the confirmation $m$ to come from a physical record. Proposition 1 proves the per-act floor with this step taken as assumption (R2).

**P3. Agency speed limit.** Proven for acts whose record meets (R1) to (R3). Proposition 1 bounds the joules of act $k$ below by $b_k k_B T\ln 2$ plus a finite-time term in $\tau_k$, $\langle A\rangle_k$ and the confirmed bits, through Fano's inequality.

**P4. Precision law for agents.** Proven. Proposition 3 bounds the relative variance of confirmed agency by dynamical activity for the count of confirmed acts, and by entropy production with the information term under feedback.

**P5. Hindsight theorem.** $\iota$ is a function of the completed receipt only. No pre-run quantity fixes it. In hand: each $m_k$ compares an outcome to a prediction fixed before the act, so $m_k$ is unknown before act $k$ closes. Missing: a construction of two worlds that agree on everything a pre-run predictor sees and differ in some $m_k$. With P1, this makes "intelligence is read off the completed run" a theorem.

**P6. Ranking survives meter error.** If $J^*_{S_1}(q) < J^*_{S_2}(q)\,(1-\epsilon)/(1+\epsilon)$, with $\epsilon$ the meter's relative error bound, then $S_1 \succ_q S_2$ under any reading within that error. In hand: direct from the definition. Missing: validated $\epsilon$ for each meter [271].

**P7. Mixture of Limits optimality.** The cheapest-sufficient rule tries gears from cheapest up, stops at the first gear whose output passes $C(z)$, and refuses with a receipt if the next gear would break the budget. It achieves the joule minimum up to the cost of failed attempts. In hand: if sufficiency is monotone in gear order and gear costs rise with order, the first sufficient gear is the cheapest sufficient gear. Missing: a regret bound when sufficiency is not monotone, and the conditions under which this rule and the σ-law selector, $a^* = \arg\max[H(a) - \lambda J(a)]$ subject to $J \le B$, choose the same act.

**P8. When agency compounds.** Conditions under which $\alpha_J > 0$ over a run, so that earlier receipts lower the joules of later closures. In hand: an earlier OpenIE toy run found $\alpha_J \le 0$ on near-optimal tasks. Missing: a model of reuse in which stored receipts cut later $J$ by more than the storage and lookup joules. Still gives the memory cost side [225]. Section 8.10 measures the template's share of each act's joules.

### 7.2 What must be demonstrated

| ID | Claim | Evidence required |
|---|---|---|
| D1 | $J^*$ per task is measured, not estimated, on at least two fabrics | `measured_j` from RAPL on x86 Linux and an external wall meter on Apple silicon |
| D2 | The σ-law selector closes tasks in fewer measured joules than the Mixture of Limits rule under binding budgets | Paired runs with the same tasks, gears, predicates, budgets and meters |
| D3 | Refuse with a receipt works | Zero overspends, refusals on infeasible tasks, few refusals on feasible ones |
| D4 | $\iota$ is read off receipts and is stable across seeds | Per-run $\iota_k$ series with spread within a preset bound |
| D5 | Estimates do not substitute for measurement | Rank agreement between `est_j` and `measured_j`, reported, never merged |
| D6 | The physical floor is respected and the gap is known | Measured joules per confirmed bit divided by $k_B T \ln 2$ |

## 8. Experiment plan

Every table, receipt and figure in this plan follows one rule. Estimates are never `measured_j`. A modeled figure is labeled `est_j`. A metered figure is labeled `measured_j` and names its meter.

### 8.1 Meters

Acronyms: CPU (central processing unit), GPU (graphics processing unit), ANE (Apple Neural Engine), AC (alternating current), NVML (NVIDIA Management Library).

| Tier | Meter | What it reads | Label |
|---|---|---|---|
| M0 | External wall-plug power meter, logging at 1 Hz or faster | Whole-system AC power | `measured_j`, wall |
| M1 | RAPL through Linux powercap, package, core, uncore and DRAM domains where present | Cumulative on-die energy in microjoules | `measured_j`, rapl |
| M1g | NVML total energy counter on a discrete GPU | Cumulative GPU board energy | `measured_j`, nvml |
| M2 | Apple powermetrics, CPU and GPU samplers at 100 ms | CPU, GPU and ANE power as reported by the system | `reported_j`, powermetrics |

- **RAPL.** Read the counter before and after each act. Handle wraparound. Validate against M0 on a calibration workload [271, 272].
- **powermetrics.** Readings are filed as `reported_j`. Measured joules on Apple silicon come from M0. Within one machine, `reported_j` attributes joules to CPU, GPU and ANE.
- **Idle baseline.** Record 120 s of idle power on every meter before each block. Report gross and idle-subtracted joules side by side. Never report only the subtracted figure.
- **State control.** Fix the CPU frequency governor where the operating system allows. Log ambient temperature and thermal pressure. Close background jobs. Discard one warm-up run per arm.

### 8.2 Tasks

Each task has a machine-checkable completeness predicate $C(z)$: unit tests for code, exact match for arithmetic, schema validation for extraction, a verified final state for tool use. Two strata are fixed in advance. Near-optimal tasks are those the cheapest gear usually closes. Compounding tasks are sequences where earlier receipts can be reused. $X_{\mathrm{req}}$ is set by $C(z)$. Passing is a gate, not a score.

### 8.3 Arms

All arms share the gears, the predicate, the budget, the meters and a randomized interleaved run order.

1. **σ-law selector:** $a^* = \arg\max[H(a) - \lambda J(a)]$ subject to $J \le B$, with refusal on a receipt.
2. **Mixture of Limits cheapest-sufficient rule:** the fair rival. Same information, gears, budget and refusal right. Only the selection rule differs.
3. **Largest gear always:** reference ceiling.
4. **Smallest gear always:** reference floor, with refusal when it fails.

### 8.4 Budgets, seeds and statistics

- A pilot runs arm 2 without a budget and records the median measured joules per task, $\tilde J_q$.
- Budget levels are $B \in \{0.25, 0.5, 0.75, 1.0\} \times \tilde J_q$, plus unconstrained. A level binds only if at least 20% of tasks exceed it in the pilot. Levels that do not bind are reported and excluded from the D2 test.
- At least 10 seeds per arm, task and budget. More if the pilot shows 10 cannot resolve a 10% difference in median $J^*$ at 95% confidence.
- Report mean, median, standard deviation and a 95% bootstrap confidence interval of $J^*$ per task. Compare arms 1 and 2 with a Wilcoxon signed-rank test on per-task median $J^*$, with effect size.

### 8.5 Receipt schema

The receipt is the Notational Intelligence record of the run. One record per act:

```
act_id, run_id, task_id, arm, seed, budget_j, gear
prediction_hash, prediction_ts        # R*, fixed before the act
outcome_hash, outcome_ts              # R
m                                     # 1, mu, or 0
coupled_bits_est                      # estimate of I(do(a); W')
t_start, t_end
measured_j   {meter, domains, gross_j, idle_w, idle_subtracted_j}
reported_j   {meter, cpu_j, gpu_j, ane_j}    # powermetrics only
wall_j       {meter, gross_j, idle_w, idle_subtracted_j}
est_j        {model, inputs}                 # never merged with measured_j
cumulative_measured_j
refused, refuse_reason
passed_C
record_states, record_bits            # N and H of the act's record M_k
joule_share                           # P_k attribution when acts overlap
template_j   {meter, write_j, hold_j, reset_j}   # joules for R*
trajectory_j {tau, activity, work}    # physical runs only, Section 8.8
```

### 8.6 Metrics

- $J^*$ per task: measured joules to pass $C(z)$, from M0 where present, otherwise M1.
- Closure rate per arm and budget.
- Overspends: acts that exceeded $B$. The target is zero.
- Refusal quality: precision and recall of refusals against tasks shown infeasible within $B$ by any arm.
- Intelligence series: $\iota_k = \Delta X_k/\Delta J_k$ per run, and its spread across seeds.
- Acceleration sign: the sign of $\alpha_J$ from regressing $\iota_k$ on cumulative $J$, per stratum.
- Estimate check: Kendall's rank correlation between `est_j` and `measured_j`.
- Distance to floor: measured joules per confirmed coupled bit divided by $k_B T \ln 2$ at the logged temperature.
- Act intelligence: $\iota_k = b_k/J_k$ per act, which equals the density of Proposition 5 on that act.
- Template share: $J^{R^*}/J$ per act and the curve $\iota(w)$ (Section 8.10).

### 8.7 Falsifiers, fixed before any run

| ID | Observation | Claim defeated |
|---|---|---|
| F1 | The 95% interval for the paired difference in median $J^*$, σ-law minus Mixture of Limits, includes or exceeds zero at every binding budget | The σ-law selector beats its fair rival in joules |
| F2 | Any arm records an overspend | That arm's refusal implementation |
| F3 | Refusal recall on infeasible tasks is below 0.9, or more than 10% of refusals fall on tasks another arm closed within $B$ | Refusal correctness |
| F4 | Kendall's correlation between `est_j` and `measured_j` is below 0.8 | Use of that estimator for any ranking |
| F5 | The coefficient of variation of mean $\iota$ across seeds exceeds 0.25 on a task | Reading $\iota$ at that task's granularity |
| F6 | The fitted $\alpha_J$ is not positive with 95% confidence on the compounding stratum | Compounding on those tasks |
| F7 | Any act shows measured joules per confirmed bit below $k_B T \ln 2$ | The accounting itself: a meter or bookkeeping fault, fixed before any other result is reported |
| F8 | M1 and M0 disagree on a calibration workload by more than the error bound in P6 | That RAPL domain as a measured source on that machine |
| F9 | A physical act cycle shows work below the Proposition 1 floor at its logged $\tau$ and $\langle A\rangle$ | The accounting of that run: a missed jump channel, a miscalibrated potential or an unmetered work source |
| F10 | A stationary run shows $\mathrm{Var}(N)/\langle N\rangle^2$ below $1/\langle K\rangle$ beyond its confidence interval | The jump count of that run: some jumps went uncounted |
| F11 | A controller holds the plant with measured joules per step below $k_B T\ln 2 \log_2\lvert\lambda\rvert$ | The meter or the plant model of that run |

### 8.8 Physical act cycles

These runs test Propositions 1 to 4 at the physical floor. Work is computed from measured trajectories and the calibrated potential, as in [61, 67, 70]. It is filed as `trajectory_j` and never merged with `measured_j`, `reported_j` or `est_j`.

- **Act cycle on a charge register (Propositions 1 and 4).** A single-electron box or quantum dot holds a one-bit record, as in [68, 70, 71]. Each cycle writes the comparison, acts, and resets the record in time $\tau$. A charge detector counts every tunneling jump, so $\langle A\rangle$ is measured. Sweep $\tau$ over at least two decades. Result form: work per cycle against $k_B T\ln 2 + k_B T/(2\tau\langle A\rangle)$, the floor of Proposition 1 for $N = 2$ and $b = 1$.
- **Counting confirmed acts (Proposition 3).** On the same register, cycling in steady state, count confirmed acts $N$ and all jumps $K$ over repeated windows of equal length. Result form: $\mathrm{Var}(N)/\langle N\rangle^2$ against $1/\langle K\rangle$, and the spread of $T_n$ against $1/(\langle T_n\rangle\langle k\rangle)$. On a feedback-trap information engine as in [27], run the forward and the backward experiment, compute $\sigma_I$ from the measured trajectories, and test part 3.
- **Holding an unstable plant (Proposition 2).** A digital controller holds a plant with one unstable mode of fixed $|\lambda|$ per step, at $f$ steps per second. Meter the controller with M0 and M1. Log the record's bits per step. Result form: measured joules per step divided by $k_B T\ln 2\log_2|\lambda|$, reported as distance to floor. Sweep $|\lambda|$ and $f$.

### 8.9 Living agents: measured ι

Result form: $\iota$ in a living preparation, as bits per decision divided by joules per decision, both taken in the same preparation and reported with distance to floor. A living $\iota$ counts as measured only when both terms are measured. A joule figure computed from conductances or inferred from imaging is filed as `est_j`. Entropy production inferred from brain imaging is coarse-grained and informational, so it is not a joule meter [257].

- **Bacterial chemotaxis.** Information rate from single-cell behavior in a defined gradient, as Mattingly and colleagues measured it [213]. Joules from the oxygen consumption of the same culture, divided by cell number. The comparison floor is the cost of sending a bit through the cell's signaling channel, from Bryant and Machta [197], beside $k_B T\ln 2$.
- **Mouse visual cortex.** Orientation information per trial from two-photon imaging, and synaptic ATP use from whole-cell recordings, as Padamsey and colleagues obtained both [250]. Food restriction moves the joules. The measured response of information to joules is the sign and size of $dX/dJ$ in a cortex.
- **Fly memory.** Energy flux in the mushroom body during long-term memory formation, imaged as Plaçais and colleagues did [252], per learned association, with retention as the confirmation. Survival under starvation and desiccation is the outcome cost [251, 253].

### 8.10 The joule price of prediction first

Result form. Split each act's metered joules into the template's share and the rest, $J_k = J_k^{R^*} + J_k^{\mathrm{act}}$. $J_k^{R^*}$ covers writing, holding and resetting $R^*(a)$. Resetting a template with $H(R^*)$ bits of entropy costs at least $H(R^*)\,k_B T\ln 2$ [6, 24]. Memory that does not predict costs dissipation [54]. A template raises $\iota$ when the act joules it saves exceed its own joules. The measured result is the curve $\iota(w)$ over template width $w$, the bits of $R^*$, with its maximizer $w^*$ and the ratio $\Delta J^{\mathrm{act}}/\Delta J^{R^*}$ at each step.

Protocol. Fix tasks, gears, predicates and budgets. Vary $w$ over a preset grid. An act may stop as soon as its outcome is resolved against the template. Log `template_j` and the act's remaining joules for every act, on the same meters.

Evidence in hand: confident prediction lowered human cortical oxygen use by up to 12%, measured by metabolic imaging (preprint) [254]. In cellular networks, the bits of the past that best predict the future are prohibitively costly [198]. In percept-action loops, work-efficient agents balance prediction against forgetting [234].

### 8.11 Reporting

Publish all receipts, raw meter traces, idle baselines and analysis code with the result. Report measured, reported and estimated joules in separate columns. Never sum across tiers. State which falsifiers fired, with the same prominence as those that passed.

### 8.12 Where the products sit

- **Klere** is the hardware that meters $J$. M0 and M1 stand in for it until Klere meters are on the bench.
- **Metabolic Intelligence** runs the arms on any fabric and computes $\iota$ from receipts.
- **Notational Intelligence** is the receipt format in Section 8.5.
- **Mixture of Limits** is the philosophy and the rival rule in arm 2.

## References

Entries marked "preprint" are cited by their arXiv posting. Entries published in a language other than English say so.

1. Pearl, J. (1995). Causal diagrams for empirical research. *Biometrika* 82:669-688. https://doi.org/10.1093/biomet/82.4.669
2. Everitt, T., Hutter, M., Kumar, R. and Krakovna, V. (2019). Reward tampering problems and solutions in reinforcement learning: a causal influence diagram perspective. arXiv:1908.04734 (preprint).
3. Sagawa, T. and Ueda, M. (2008). Second law of thermodynamics with discrete quantum feedback control. *Physical Review Letters* 100:080403. https://doi.org/10.1103/PhysRevLett.100.080403
4. Sagawa, T. and Ueda, M. (2010). Generalized Jarzynski equality under nonequilibrium feedback control. *Physical Review Letters* 104:090602. https://doi.org/10.1103/PhysRevLett.104.090602
5. Sagawa, T. and Ueda, M. (2009). Minimal energy cost for thermodynamic information processing: measurement and information erasure. *Physical Review Letters* 102:250602. https://doi.org/10.1103/PhysRevLett.102.250602
6. Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5:183-191. https://doi.org/10.1147/rd.53.0183
7. Bennett, C. H. (1982). The thermodynamics of computation: a review. *International Journal of Theoretical Physics* 21:905-940. https://doi.org/10.1007/BF02084158
8. Ay, N. and Polani, D. (2008). Information flows in causal networks. *Advances in Complex Systems* 11:17-41. https://doi.org/10.1142/S0219525908001465
9. Klyubin, A. S., Polani, D. and Nehaniv, C. L. (2005). Empowerment: a universal agent-centric measure of control. *2005 IEEE Congress on Evolutionary Computation* 1:128-135. https://doi.org/10.1109/CEC.2005.1554676
10. Kenton, Z., Kumar, R., Farquhar, S., Richens, J. et al. (2023). Discovering agents. *Artificial Intelligence* 322:103963. https://doi.org/10.1016/j.artint.2023.103963
11. James, R. G., Barnett, N. and Crutchfield, J. P. (2016). Information flows? A critique of transfer entropies. *Physical Review Letters* 116:238701. https://doi.org/10.1103/PhysRevLett.116.238701
12. Lizier, J. T. and Prokopenko, M. (2010). Differentiating information transfer and causal effect. *The European Physical Journal B* 73:605-615. https://doi.org/10.1140/epjb/e2010-00034-5
13. Janzing, D., Balduzzi, D., Grosse-Wentrup, M. and Schölkopf, B. (2013). Quantifying causal influences. *The Annals of Statistics* 41. https://doi.org/10.1214/13-AOS1145
14. Albantakis, L., Marshall, W., Hoel, E. and Tononi, G. (2019). What caused what? A quantitative account of actual causation using dynamical causal networks. *Entropy* 21:459. https://doi.org/10.3390/e21050459
15. Aguilera, M., Millidge, B., Tschantz, A. and Buckley, C. L. (2022). How particular is the physics of the free energy principle? *Physics of Life Reviews* 40:24-50. https://doi.org/10.1016/j.plrev.2021.11.001
16. Biehl, M., Pollock, F. A. and Kanai, R. (2021). A technical critique of some parts of the free energy principle. *Entropy* 23:293. https://doi.org/10.3390/e23030293
17. Bruineberg, J., Dołęga, K., Dewhurst, J. and Baltieri, M. (2022). The emperor's new Markov blankets. *Behavioral and Brain Sciences* 45:e183. https://doi.org/10.1017/S0140525X21002351
18. Orseau, L., McGregor McGill, S. and Legg, S. (2018). Agents and devices: a relative definition of agency. arXiv:1805.12387 (preprint).
19. Albantakis, L., Barbosa, L., Findlay, G., Grasso, M. et al. (2023). Integrated information theory (IIT) 4.0: formulating the properties of phenomenal existence in physical terms. *PLOS Computational Biology* 19:e1011465. https://doi.org/10.1371/journal.pcbi.1011465
20. Krakauer, D., Bertschinger, N., Olbrich, E., Flack, J. C. and Ay, N. (2020). The information theory of individuality. *Theory in Biosciences* 139:209-223. https://doi.org/10.1007/s12064-020-00313-7
21. Hoel, E. P., Albantakis, L. and Tononi, G. (2013). Quantifying causal emergence shows that macro can beat micro. *Proceedings of the National Academy of Sciences* 110:19790-19795. https://doi.org/10.1073/pnas.1314922110
22. Rosas, F. E., Mediano, P. A. M., Biehl, M., Chandaria, S. and Polani, D. (2020). Causal blankets: theory and algorithmic framework. In *Active Inference: IWAI 2020*, Communications in Computer and Information Science, Springer, pp. 187-198. https://doi.org/10.1007/978-3-030-64919-7_19
23. Shiraishi, N., Funo, K. and Saito, K. (2018). Speed limit for classical stochastic processes. *Physical Review Letters* 121:070601. https://doi.org/10.1103/PhysRevLett.121.070601
24. Esposito, M. and Van den Broeck, C. (2011). Second law and Landauer principle far from equilibrium. *EPL* 95:40004. https://doi.org/10.1209/0295-5075/95/40004
25. Barato, A. C. and Seifert, U. (2015). Thermodynamic uncertainty relation for biomolecular processes. *Physical Review Letters* 114:158101. https://doi.org/10.1103/PhysRevLett.114.158101
26. Gingrich, T. R., Horowitz, J. M., Perunov, N. and England, J. L. (2016). Dissipation bounds all steady-state current fluctuations. *Physical Review Letters* 116:120601. https://doi.org/10.1103/PhysRevLett.116.120601
27. Paneru, G., Dutta, S., Tlusty, T. and Pak, H. K. (2020). Reaching and violating thermodynamic uncertainty bounds in information engines. *Physical Review E* 102:032126. https://doi.org/10.1103/PhysRevE.102.032126
28. Potts, P. P. and Samuelsson, P. (2019). Thermodynamic uncertainty relations including measurement and feedback. *Physical Review E* 100:052137. https://doi.org/10.1103/PhysRevE.100.052137
29. Proesmans, K., Ehrich, J. and Bechhoefer, J. (2020). Finite-time Landauer principle. *Physical Review Letters* 125:100602. https://doi.org/10.1103/PhysRevLett.125.100602
30. Sivak, D. A. and Crooks, G. E. (2012). Thermodynamic metrics and optimal paths. *Physical Review Letters* 108:190602. https://doi.org/10.1103/PhysRevLett.108.190602
31. Margolus, N. and Levitin, L. B. (1998). The maximum speed of dynamical evolution. *Physica D* 120:188-195. https://doi.org/10.1016/S0167-2789(98)00054-2
32. Touchette, H. and Lloyd, S. (2000). Information-theoretic limits of control. *Physical Review Letters* 84:1156-1159. https://doi.org/10.1103/PhysRevLett.84.1156
33. Touchette, H. and Lloyd, S. (2004). Information-theoretic approach to the study of control systems. *Physica A* 331:140-172. https://doi.org/10.1016/j.physa.2003.09.007
34. Garrahan, J. P. (2017). Simple bounds on fluctuations and uncertainty relations for first-passage times of counting observables. *Physical Review E* 95:032134. https://doi.org/10.1103/PhysRevE.95.032134
35. Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17:525-532. https://doi.org/10.1147/rd.176.0525
36. Sagawa, T. and Ueda, M. (2012). Fluctuation theorem with information exchange: role of correlations in stochastic thermodynamics. *Physical Review Letters* 109:180602. https://doi.org/10.1103/PhysRevLett.109.180602
37. Hartle, H., Wolpert, D., Stier, A., Kempes, C. P. and Manzano, G. (2024). Work extraction with feedback control using limited resources. arXiv:2407.05507 (preprint).
38. Horodecki, M. and Oppenheim, J. (2013). Fundamental limitations for quantum and nanoscale thermodynamics. *Nature Communications* 4:2059. https://doi.org/10.1038/ncomms3059
39. Parrondo, J. M. R., Horowitz, J. M. and Sagawa, T. (2015). Thermodynamics of information. *Nature Physics* 11:131-139. https://doi.org/10.1038/nphys3230
40. Seifert, U. (2012). Stochastic thermodynamics, fluctuation theorems and molecular machines. *Reports on Progress in Physics* 75:126001. https://doi.org/10.1088/0034-4885/75/12/126001
41. Conant, R. C. and Ashby, W. R. (1970). Every good regulator of a system must be a model of that system. *International Journal of Systems Science* 1:89-97. https://doi.org/10.1080/00207727008920220
42. Richens, J. and Everitt, T. (2024). Robust agents learn causal world models. arXiv:2402.10877 (preprint).
43. Richens, J., Abel, D., Bellot, A. and Everitt, T. (2025). General agents contain world models. arXiv:2506.01622 (preprint).
44. Horowitz, J. M. and Esposito, M. (2014). Thermodynamics with continuous information flow. *Physical Review X* 4:031015. https://doi.org/10.1103/PhysRevX.4.031015
45. Ito, S. and Sagawa, T. (2013). Information thermodynamics on causal networks. *Physical Review Letters* 111:180603. https://doi.org/10.1103/PhysRevLett.111.180603
46. Hartich, D., Barato, A. C. and Seifert, U. (2014). Stochastic thermodynamics of bipartite systems: transfer entropy inequalities and a Maxwell's demon interpretation. *Journal of Statistical Mechanics* P02016. https://doi.org/10.1088/1742-5468/2014/02/P02016
47. Allahverdyan, A. E., Janzing, D. and Mahler, G. (2009). Thermodynamic efficiency of information and heat flow. *Journal of Statistical Mechanics* P09011. https://doi.org/10.1088/1742-5468/2009/09/P09011
48. Esposito, M. and Schaller, G. (2012). Stochastic thermodynamics for "Maxwell demon" feedbacks. *EPL* 99:30003. https://doi.org/10.1209/0295-5075/99/30003
49. Mandal, D. and Jarzynski, C. (2012). Work and information processing in a solvable model of Maxwell's demon. *PNAS* 109:11641-11645. https://doi.org/10.1073/pnas.1204263109
50. Boyd, A. B., Mandal, D. and Crutchfield, J. P. (2016). Identifying functional thermodynamics in autonomous Maxwellian ratchets. *New Journal of Physics* 18:023049. https://doi.org/10.1088/1367-2630/18/2/023049
51. Boyd, A. B., Mandal, D. and Crutchfield, J. P. (2018). Thermodynamics of modularity: structural costs beyond the Landauer bound. *Physical Review X* 8:031036. https://doi.org/10.1103/PhysRevX.8.031036
52. Wolpert, D. H. and Kolchinsky, A. (2020). Thermodynamics of computing with circuits. *New Journal of Physics* 22:063047. https://doi.org/10.1088/1367-2630/ab82b8
53. Kolchinsky, A. and Wolpert, D. H. (2017). Dependence of dissipation on the initial distribution over states. *Journal of Statistical Mechanics* 083202. https://doi.org/10.1088/1742-5468/aa7ee1
54. Still, S., Sivak, D. A., Bell, A. J. and Crooks, G. E. (2012). Thermodynamics of prediction. *Physical Review Letters* 109:120604. https://doi.org/10.1103/PhysRevLett.109.120604
55. Kolchinsky, A. and Wolpert, D. H. (2018). Semantic information, autonomous agency and non-equilibrium statistical physics. *Interface Focus* 8:20180041. https://doi.org/10.1098/rsfs.2018.0041
56. Ortega, P. A. and Braun, D. A. (2013). Thermodynamics as a theory of decision-making with information-processing costs. *Proceedings of the Royal Society A* 469:20120683. https://doi.org/10.1098/rspa.2012.0683
57. Kolchinsky, A. and Wolpert, D. H. (2020). Thermodynamic costs of Turing machines. *Physical Review Research* 2:033312. https://doi.org/10.1103/PhysRevResearch.2.033312
58. Kolchinsky, A. and Wolpert, D. H. (2021). Work, entropy production, and thermodynamics of information under protocol constraints. *Physical Review X* 11:041024. https://doi.org/10.1103/PhysRevX.11.041024
59. Manzano, G., Kardeş, G., Roldán, É. and Wolpert, D. H. (2024). Thermodynamics of computations with absolute irreversibility, unidirectional transitions, and stochastic computation times. *Physical Review X* 14:021026. https://doi.org/10.1103/PhysRevX.14.021026
60. Bérut, A., Arakelyan, A., Petrosyan, A., Ciliberto, S., Dillenschneider, R. and Lutz, E. (2012). Experimental verification of Landauer's principle linking information and thermodynamics. *Nature* 483:187-189. https://doi.org/10.1038/nature10872
61. Jun, Y., Gavrilov, M. and Bechhoefer, J. (2014). High-precision test of Landauer's principle in a feedback trap. *Physical Review Letters* 113:190601. https://doi.org/10.1103/PhysRevLett.113.190601
62. Orlov, A. O., Lent, C. S., Thorpe, C. C., Boechler, G. P. and Snider, G. L. (2012). Experimental test of Landauer's principle at the sub-k_BT level. *Japanese Journal of Applied Physics* 51:06FE10. https://doi.org/10.1143/JJAP.51.06FE10
63. Hong, J., Lambson, B., Dhuey, S. and Bokor, J. (2016). Experimental test of Landauer's principle in single-bit operations on nanomagnetic memory bits. *Science Advances* 2:e1501492. https://doi.org/10.1126/sciadv.1501492
64. Gavrilov, M. and Bechhoefer, J. (2016). Erasure without work in an asymmetric double-well potential. *Physical Review Letters* 117:200601. https://doi.org/10.1103/PhysRevLett.117.200601
65. Gavrilov, M., Chétrite, R. and Bechhoefer, J. (2017). Direct measurement of weakly nonequilibrium system entropy is consistent with Gibbs-Shannon form. *PNAS* 114:11097-11102. https://doi.org/10.1073/pnas.1708689114
66. Yan, L. L., Xiong, T. P., Rehan, K., Zhou, F., Liang, D. F. et al. (2018). Single-atom demonstration of the quantum Landauer principle. *Physical Review Letters* 120:210601. https://doi.org/10.1103/PhysRevLett.120.210601
67. Dago, S., Pereda, J., Barros, N., Ciliberto, S. and Bellon, L. (2021). Information and thermodynamics: fast and precise approach to Landauer's bound in an underdamped micromechanical oscillator. *Physical Review Letters* 126:170601. https://doi.org/10.1103/PhysRevLett.126.170601
68. Scandi, M., Barker, D., Lehmann, S., Dick, K. A., Maisi, V. F. and Perarnau-Llobet, M. (2022). Minimally dissipative information erasure in a quantum dot via thermodynamic length. *Physical Review Letters* 129:270601. https://doi.org/10.1103/PhysRevLett.129.270601
69. Toyabe, S., Sagawa, T., Ueda, M., Muneyuki, E. and Sano, M. (2010). Experimental demonstration of information-to-energy conversion and validation of the generalized Jarzynski equality. *Nature Physics* 6:988-992. https://doi.org/10.1038/nphys1821
70. Koski, J. V., Maisi, V. F., Pekola, J. P. and Averin, D. V. (2014). Experimental realization of a Szilard engine with a single electron. *PNAS* 111:13786-13789. https://doi.org/10.1073/pnas.1406966111
71. Koski, J. V., Maisi, V. F., Sagawa, T. and Pekola, J. P. (2014). Experimental observation of the role of mutual information in the nonequilibrium dynamics of a Maxwell demon. *Physical Review Letters* 113:030601. https://doi.org/10.1103/PhysRevLett.113.030601
72. Koski, J. V., Kutvonen, A., Khaymovich, I. M., Ala-Nissila, T. and Pekola, J. P. (2015). On-chip Maxwell's demon as an information-powered refrigerator. *Physical Review Letters* 115:260602. https://doi.org/10.1103/PhysRevLett.115.260602
73. Camati, P. A., Peterson, J. P. S., Batalhão, T. B., Micadei, K., Souza, A. M. et al. (2016). Experimental rectification of entropy production by Maxwell's demon in a quantum system. *Physical Review Letters* 117:240502. https://doi.org/10.1103/PhysRevLett.117.240502
74. Peterson, J. P. S., Sarthour, R. S., Souza, A. M., Oliveira, I. S., Goold, J. et al. (2016). Experimental demonstration of information to energy conversion in a quantum system at the Landauer limit. *Proceedings of the Royal Society A* 472:20150813. https://doi.org/10.1098/rspa.2015.0813
75. Cottet, N., Jezouin, S., Bretheau, L., Campagne-Ibarcq, P., Ficheux, Q. et al. (2017). Observing a quantum Maxwell demon at work. *PNAS* 114:7561-7564. https://doi.org/10.1073/pnas.1704827114
76. Masuyama, Y., Funo, K., Murashita, Y., Noguchi, A., Kono, S. et al. (2018). Information-to-work conversion by Maxwell's demon in a superconducting circuit quantum electrodynamical system. *Nature Communications* 9:1291. https://doi.org/10.1038/s41467-018-03686-y
77. Naghiloo, M., Alonso, J. J., Romito, A., Lutz, E. and Murch, K. W. (2018). Information gain and loss for a quantum Maxwell's demon. *Physical Review Letters* 121:030604. https://doi.org/10.1103/PhysRevLett.121.030604
78. Kumar, A., Wu, T.-Y., Giraldo, F. and Weiss, D. S. (2018). Sorting ultracold atoms in a three-dimensional optical lattice in a realization of Maxwell's demon. *Nature* 561:83-87. https://doi.org/10.1038/s41586-018-0458-7
79. Linpeng, X., Bresque, L., Maffei, M., Jordan, A. N. et al. (2022). Energetic cost of measurements using quantum, coherent, and thermal light. *Physical Review Letters* 128:220506. https://doi.org/10.1103/PhysRevLett.128.220506
80. Paneru, G., Lee, D. Y., Tlusty, T. and Pak, H. K. (2018). Lossless Brownian information engine. *Physical Review Letters* 120:020601. https://doi.org/10.1103/PhysRevLett.120.020601
81. Admon, T., Rahav, S. and Roichman, Y. (2018). Experimental realization of an information machine with tunable temporal correlations. *Physical Review Letters* 121:180601. https://doi.org/10.1103/PhysRevLett.121.180601
82. Ribezzi-Crivellari, M. and Ritort, F. (2019). Large work extraction and the Landauer limit in a continuous Maxwell demon. *Nature Physics* 15:660-664. https://doi.org/10.1038/s41567-019-0481-0
83. Debiossac, M., Grass, D., Alonso, J. J., Lutz, E. and Kiesel, N. (2020). Thermodynamics of continuous non-Markovian feedback control. *Nature Communications* 11:1360. https://doi.org/10.1038/s41467-020-15148-5
84. Saha, T. K., Lucero, J. N. E., Ehrich, J., Sivak, D. A. and Bechhoefer, J. (2021). Maximizing power and velocity of an information engine. *PNAS* 118:e2023356118. https://doi.org/10.1073/pnas.2023356118
85. Saha, T. K., Lucero, J. N. E., Ehrich, J., Sivak, D. A. and Bechhoefer, J. (2022). Bayesian information engine that optimally exploits noisy measurements. *Physical Review Letters* 129:130601. https://doi.org/10.1103/PhysRevLett.129.130601
86. Saha, T. K., Ehrich, J., Gavrilov, M., Still, S., Sivak, D. A. and Bechhoefer, J. (2023). Information engine in a nonequilibrium bath. *Physical Review Letters* 131:057101. https://doi.org/10.1103/PhysRevLett.131.057101
87. Barker, D., Scandi, M., Lehmann, S., Thelander, C., Dick, K. A., Perarnau-Llobet, M. and Maisi, V. F. (2022). Experimental verification of the work fluctuation-dissipation relation for information-to-work conversion. *Physical Review Letters* 128:040602. https://doi.org/10.1103/PhysRevLett.128.040602
88. Yan, L.-L., Bu, J.-T., Zeng, Q., Zhang, K., Cui, K.-F. et al. (2024). Experimental verification of demon-involved fluctuation theorems. *Physical Review Letters* 133:090402. https://doi.org/10.1103/PhysRevLett.133.090402
89. Zeng, Q. and Wang, J. (2021). New fluctuation theorems on Maxwell's demon. *Science Advances* 7:eabf1807. https://doi.org/10.1126/sciadv.abf1807
90. Demin, A. V. and Vityaev, E. E. (2014). Learning in a virtual model of the C. elegans nematode for locomotion and chemotaxis. *Biologically Inspired Cognitive Architectures* 7:9-14. https://doi.org/10.1016/j.bica.2013.11.005
91. Putintsev, N. I., Isupov, O. V. and Vityaev, E. E. (2015). Adaptive control system for a mobile agent in a physical environment based on functional systems theory. *Russian Journal of Genetics: Applied Research* 5:601-608. https://doi.org/10.1134/S2079059715060131
92. Rosenblueth, A., Wiener, N. and Bigelow, J. (1943). Behavior, purpose and teleology. *Philosophy of Science* 10:18-24. https://doi.org/10.1086/286788
93. Anokhin, P. K. (1968). The functional system as a unit of organism integrative activity. In *Systems Theory and Biology*, Springer, pp. 376-403. https://doi.org/10.1007/978-3-642-88343-9_15
94. Anokhin, P. K. (1974). The biological roots of the conditioned reflex. In *Biology and Neurophysiology of the Conditioned Reflex and Its Role in Adaptive Behavior*, Pergamon, pp. 1-24. https://doi.org/10.1016/B978-0-08-021516-7.50008-2
95. Sudakov, K. V. (1997). The theory of functional systems: general postulates and principles of dynamic organization. *Integrative Physiological and Behavioral Science* 32:392-414. https://doi.org/10.1007/BF02688634
96. Shvyrkov, V. B. (1980). Goal as a system-forming factor in behavior and learning. In *Neural Mechanisms of Goal-directed Behavior and Learning*, Academic Press, pp. 199-219. https://doi.org/10.1016/B978-0-12-688980-2.50018-7
97. Rosen, R. (2012). *Anticipatory Systems: Philosophical, Mathematical, and Methodological Foundations*, 2nd ed. Springer. https://doi.org/10.1007/978-1-4614-1269-4
98. Sterling, P. (2012). Allostasis: a model of predictive regulation. *Physiology & Behavior* 106:5-15. https://doi.org/10.1016/j.physbeh.2011.06.004
99. Virgo, N., Biehl, M. and McGregor, S. (2021). Interpreting dynamical systems as Bayesian reasoners. In *Machine Learning and Principles and Practice of Knowledge Discovery in Databases* (ECML PKDD 2021 workshops), Communications in Computer and Information Science, Springer, pp. 726-762. https://doi.org/10.1007/978-3-030-93736-2_52
100. Biehl, M. and Virgo, N. (2023). Interpreting systems as solving POMDPs: a step towards a formal understanding of agency. In *Active Inference: IWAI 2022*, Communications in Computer and Information Science 1721, Springer, pp. 16-31. https://doi.org/10.1007/978-3-031-28719-0_2
101. Maturana, H. R. and Varela, F. J. (1980). *Autopoiesis and Cognition: The Realization of the Living*. Reidel. https://doi.org/10.1007/978-94-009-8947-4
102. Kauffman, S. (2003). Molecular autonomous agents. *Philosophical Transactions of the Royal Society A* 361:1089-1099. https://doi.org/10.1098/rsta.2003.1186
103. Di Paolo, E. A. (2005). Autopoiesis, adaptivity, teleology, agency. *Phenomenology and the Cognitive Sciences* 4:429-452. https://doi.org/10.1007/s11097-005-9002-y
104. Barandiaran, X. and Moreno, A. (2006). On what makes certain dynamical systems cognitive: a minimally cognitive organization program. *Adaptive Behavior* 14:171-185. https://doi.org/10.1177/105971230601400208
105. Barandiaran, X. and Moreno, A. (2008). Adaptivity: from metabolism to behavior. *Adaptive Behavior* 16:325-344. https://doi.org/10.1177/1059712308093868
106. Barandiaran, X. E., Di Paolo, E. and Rohde, M. (2009). Defining agency: individuality, normativity, asymmetry, and spatio-temporality in action. *Adaptive Behavior* 17:367-386. https://doi.org/10.1177/1059712309343819
107. Ruiz-Mirazo, K. and Moreno, A. (2011). Autonomy in evolution: from minimal to complex life. *Synthese* 185:21-52. https://doi.org/10.1007/s11229-011-9874-z
108. Moreno, A. and Mossio, M. (2015). *Biological Autonomy: A Philosophical and Theoretical Enquiry*. Springer. https://doi.org/10.1007/978-94-017-9837-2
109. Montévil, M. and Mossio, M. (2015). Biological organisation as closure of constraints. *Journal of Theoretical Biology* 372:179-191. https://doi.org/10.1016/j.jtbi.2015.02.029
110. Aguilera, M. and Barandiaran, X. E. (2024). Thermina: a minimal model of autonomous agency from the lens of stochastic thermodynamics. *ALIFE 2024: Proceedings of the 2024 Artificial Life Conference*. https://doi.org/10.1162/isal_a_00826
111. Barandiaran, X. E. and Almendros, L. S. (2024). Transforming agency: on the mode of existence of large language models. arXiv:2407.10735 (preprint).
112. Levin, M. (2022). Technological approach to mind everywhere: an experimentally-grounded framework for understanding diverse bodies and minds. *Frontiers in Systems Neuroscience* 16:768201. https://doi.org/10.3389/fnsys.2022.768201
113. Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience* 11:127-138. https://doi.org/10.1038/nrn2787
114. Friston, K. (2013). Life as we know it. *Journal of the Royal Society Interface* 10:20130475. https://doi.org/10.1098/rsif.2013.0475
115. Rovelli, C. (2020). Agency in physics. arXiv:2007.05300 (preprint).
116. Jaeger, J. (2023). Artificial intelligence is algorithmic mimicry: why artificial "agents" are not (and won't be) proper agents. arXiv:2307.07515 (preprint).
117. Azadi, P. (2025). Computational irreducibility as the foundation of agency. arXiv:2505.04646 (preprint).
118. Wissner-Gross, A. D. and Freer, C. E. (2013). Causal entropic forces. *Physical Review Letters* 110:168702. https://doi.org/10.1103/PhysRevLett.110.168702
119. Kappen, H. J. (2013). Comment: causal entropic forces. arXiv:1312.4185 (preprint).
120. Fields, C., Goldstein, A. and Sandved-Smith, L. (2024). Making the thermodynamic cost of active inference explicit. *Entropy* 26:622. https://doi.org/10.3390/e26080622
121. Bartlett, S., Eckford, A. W., Egbert, M., Lingam, M. et al. (2025). Physics of life: exploring information as a distinctive feature of living systems. *PRX Life* 3:037003. https://doi.org/10.1103/rsx4-8x5f
122. Funo, K., Shiraishi, N. and Saito, K. (2019). Speed limit for open quantum systems. *New Journal of Physics* 21:013006. https://doi.org/10.1088/1367-2630/aaf9f5
123. Shiraishi, N. and Saito, K. (2021). Speed limit for open systems coupled to general environments. *Physical Review Research* 3:023074. https://doi.org/10.1103/PhysRevResearch.3.023074
124. Vo, V. T., Van Vu, T. and Hasegawa, Y. (2020). Unified approach to classical speed limit and thermodynamic uncertainty relation. *Physical Review E* 102:062132. https://doi.org/10.1103/PhysRevE.102.062132
125. Falasco, G. and Esposito, M. (2020). Dissipation-time uncertainty relation. *Physical Review Letters* 125:120604. https://doi.org/10.1103/PhysRevLett.125.120604
126. Ito, S. (2018). Stochastic thermodynamic interpretation of information geometry. *Physical Review Letters* 121:030605. https://doi.org/10.1103/PhysRevLett.121.030605
127. Ito, S. and Dechant, A. (2020). Stochastic time evolution, information geometry, and the Cramér-Rao bound. *Physical Review X* 10:021056. https://doi.org/10.1103/PhysRevX.10.021056
128. Nakazato, M. and Ito, S. (2021). Geometrical aspects of entropy production in stochastic thermodynamics based on Wasserstein distance. *Physical Review Research* 3:043093. https://doi.org/10.1103/PhysRevResearch.3.043093
129. Dechant, A., Sasa, S.-i. and Ito, S. (2022). Geometric decomposition of entropy production in out-of-equilibrium systems. *Physical Review Research* 4:L012034. https://doi.org/10.1103/PhysRevResearch.4.L012034
130. Van Vu, T. and Saito, K. (2023). Thermodynamic unification of optimal transport: thermodynamic uncertainty relation, minimum dissipation, and thermodynamic speed limits. *Physical Review X* 13:011013. https://doi.org/10.1103/PhysRevX.13.011013
131. Nagayama, R., Yoshimura, K. and Ito, S. (2025). Infinite variety of thermodynamic speed limits with general activities. *Physical Review Research* 7:013307. https://doi.org/10.1103/PhysRevResearch.7.013307
132. Yoshimura, K. and Ito, S. (2021). Thermodynamic uncertainty relation and thermodynamic speed limit in deterministic chemical reaction networks. *Physical Review Letters* 127:160601. https://doi.org/10.1103/PhysRevLett.127.160601
133. Aurell, E., Mejía-Monasterio, C. and Muratore-Ginanneschi, P. (2011). Optimal protocols and optimal transport in stochastic thermodynamics. *Physical Review Letters* 106:250601. https://doi.org/10.1103/PhysRevLett.106.250601
134. Hasegawa, Y. (2023). Unifying speed limit, thermodynamic uncertainty relation and Heisenberg principle via bulk-boundary correspondence. *Nature Communications* 14:2828. https://doi.org/10.1038/s41467-023-38074-8
135. Van Vu, T. and Hasegawa, Y. (2021). Geometrical bounds of the irreversibility in Markovian systems. *Physical Review Letters* 126:010601. https://doi.org/10.1103/PhysRevLett.126.010601
136. Delvenne, J.-C. and Falasco, G. (2024). Thermokinetic relations. *Physical Review E* 109:014109. https://doi.org/10.1103/PhysRevE.109.014109
137. Seifert, U. (2017). Stochastic thermodynamics: from principles to the cost of precision. arXiv:1707.03759 (lecture notes).
138. Horowitz, J. M. and Gingrich, T. R. (2017). Proof of the finite-time thermodynamic uncertainty relation for steady-state currents. *Physical Review E* 96:020103. https://doi.org/10.1103/PhysRevE.96.020103
139. Pietzonka, P., Barato, A. C. and Seifert, U. (2016). Universal bounds on current fluctuations. *Physical Review E* 93:052145. https://doi.org/10.1103/PhysRevE.93.052145
140. Proesmans, K. and Van den Broeck, C. (2017). Discrete-time thermodynamic uncertainty relation. *EPL* 119:20001. https://doi.org/10.1209/0295-5075/119/20001
141. Hasegawa, Y. and Van Vu, T. (2019). Fluctuation theorem uncertainty relation. *Physical Review Letters* 123:110602. https://doi.org/10.1103/PhysRevLett.123.110602
142. Dechant, A. and Sasa, S.-i. (2018). Entropic bounds on currents in Langevin systems. *Physical Review E* 97:062101. https://doi.org/10.1103/PhysRevE.97.062101
143. Lee, J. S., Park, J.-M. and Park, H. (2019). Thermodynamic uncertainty relation for underdamped Langevin systems driven by a velocity-dependent force. *Physical Review E* 100:062132. https://doi.org/10.1103/PhysRevE.100.062132
144. Lee, J. S., Park, J.-M. and Park, H. (2021). Universal form of thermodynamic uncertainty relation for Langevin dynamics. *Physical Review E* 104:L052102. https://doi.org/10.1103/PhysRevE.104.L052102
145. Dechant, A. and Sasa, S.-i. (2021). Improving thermodynamic bounds using correlations. *Physical Review X* 11:041061. https://doi.org/10.1103/PhysRevX.11.041061
146. Horowitz, J. M. and Gingrich, T. R. (2020). Thermodynamic uncertainty relations constrain non-equilibrium fluctuations. *Nature Physics* 16:15-20. https://doi.org/10.1038/s41567-019-0702-6
147. Barato, A. C. and Seifert, U. (2016). Cost and precision of Brownian clocks. *Physical Review X* 6:041053. https://doi.org/10.1103/PhysRevX.6.041053
148. Salazar, D. S. P. (2021). Information bound for entropy production from the detailed fluctuation theorem. *Physical Review E* 103:022122. https://doi.org/10.1103/PhysRevE.103.022122
149. Landi, G. T. and Paternostro, M. (2021). Irreversible entropy production: from classical to quantum. *Reviews of Modern Physics* 93:035008. https://doi.org/10.1103/RevModPhys.93.035008
150. Van Vu, T. and Hasegawa, Y. (2020). Thermodynamic uncertainty relations under arbitrary control protocols. *Physical Review Research* 2:013060. https://doi.org/10.1103/PhysRevResearch.2.013060
151. Tanogami, T., Van Vu, T. and Saito, K. (2023). Universal bounds on the performance of information-thermodynamic engine. *Physical Review Research* 5:043280. https://doi.org/10.1103/PhysRevResearch.5.043280
152. Kumasaki, K., Tojo, K., Sagawa, T. and Funo, K. (2026). Thermodynamic uncertainty relation for feedback cooling. *Physical Review E* 113:024134. https://doi.org/10.1103/4pq6-7djm
153. Honma, R. and Van Vu, T. (2026). Thermodynamic uncertainty relation with quantum feedback. *Physical Review Letters*. https://doi.org/10.1103/6d8l-94pv. Preprint: arXiv:2602.22651.
154. Gingrich, T. R. and Horowitz, J. M. (2017). Fundamental bounds on first passage time fluctuations for currents. *Physical Review Letters* 119:170601. https://doi.org/10.1103/PhysRevLett.119.170601
155. Schmiedl, T. and Seifert, U. (2007). Optimal finite-time processes in stochastic thermodynamics. *Physical Review Letters* 98:108301. https://doi.org/10.1103/PhysRevLett.98.108301
156. Proesmans, K., Ehrich, J. and Bechhoefer, J. (2020). Optimal finite-time bit erasure under full control. *Physical Review E* 102:032105. https://doi.org/10.1103/PhysRevE.102.032105
157. Zhen, Y.-Z., Egloff, D., Modi, K. and Dahlsten, O. (2021). Universal bound on energy cost of bit reset in finite time. *Physical Review Letters* 127:190602. https://doi.org/10.1103/PhysRevLett.127.190602
158. Esposito, M., Kawai, R., Lindenberg, K. and Van den Broeck, C. (2010). Efficiency at maximum power of low-dissipation Carnot engines. *Physical Review Letters* 105:150603. https://doi.org/10.1103/PhysRevLett.105.150603
159. Tu, Z. C. (2008). Efficiency at maximum power of Feynman's ratchet as a heat engine. *Journal of Physics A* 41:312003. https://doi.org/10.1088/1751-8113/41/31/312003
160. Shiraishi, N., Saito, K. and Tasaki, H. (2016). Universal trade-off relation between power and efficiency for heat engines. *Physical Review Letters* 117:190601. https://doi.org/10.1103/PhysRevLett.117.190601
161. Pietzonka, P. and Seifert, U. (2018). Universal trade-off between power, efficiency, and constancy in steady-state heat engines. *Physical Review Letters* 120:190602. https://doi.org/10.1103/PhysRevLett.120.190602
162. Ma, Y.-H., Xu, D., Dong, H. and Sun, C.-P. (2018). Universal constraint for efficiency and power of a low-dissipation heat engine. *Physical Review E* 98:042112. https://doi.org/10.1103/PhysRevE.98.042112
163. Tsirlin, A. M., Mironova, V. A., Amelkin, S. A. and Kazakov, V. (1998). Finite-time thermodynamics: conditions of minimal dissipation for thermodynamic processes with given rate. *Physical Review E* 58:215-223. https://doi.org/10.1103/PhysRevE.58.215
164. Lee, J. S., Lee, S., Kwon, H. and Park, H. (2022). Speed limit for a highly irreversible process and tight finite-time Landauer's bound. *Physical Review Letters* 129:120603. https://doi.org/10.1103/PhysRevLett.129.120603
165. Van Vu, T. and Saito, K. (2022). Finite-time quantum Landauer principle and quantum coherence. *Physical Review Letters* 128:010602. https://doi.org/10.1103/PhysRevLett.128.010602
166. Rolandi, A. and Perarnau-Llobet, M. (2023). Finite-time Landauer principle beyond weak coupling. *Quantum* 7:1161. https://doi.org/10.22331/q-2023-11-03-1161
167. Kamijima, T., Funo, K. and Sagawa, T. (2024). Finite-time thermodynamic bounds and tradeoff relations for information processing. arXiv:2409.08606 (preprint).
168. Tkachenko, A. V. (2025). Thermodynamic cost of inference and learning in physical neural networks. arXiv:2503.09980 (preprint). Title of the current arXiv version.
169. Tatikonda, S. and Mitter, S. (2004). Control under communication constraints. *IEEE Transactions on Automatic Control* 49:1056-1068. https://doi.org/10.1109/TAC.2004.831187
170. Nair, G. N. and Evans, R. J. (2004). Stabilizability of stochastic linear systems with finite feedback data rates. *SIAM Journal on Control and Optimization* 43:413-436. https://doi.org/10.1137/S0363012902402116
171. Nair, G. N., Fagnani, F., Zampieri, S. and Evans, R. J. (2007). Feedback control under data rate constraints: an overview. *Proceedings of the IEEE* 95:108-137. https://doi.org/10.1109/JPROC.2006.887294
172. Sandberg, H., Delvenne, J.-C., Newton, N. J. and Mitter, S. K. (2014). Maximum work extraction and implementation costs for nonequilibrium Maxwell's demons. *Physical Review E* 90:042119. https://doi.org/10.1103/PhysRevE.90.042119
173. Horowitz, J. M. and Sandberg, H. (2014). Second-law-like inequalities with information and their interpretations. *New Journal of Physics* 16:125007. https://doi.org/10.1088/1367-2630/16/12/125007
174. Jacobs, K. (2009). Second law of thermodynamics and quantum feedback control: Maxwell's demon with weak measurements. *Physical Review A* 80:012322. https://doi.org/10.1103/PhysRevA.80.012322
175. Funo, K., Watanabe, Y. and Ueda, M. (2013). Integral quantum fluctuation theorems under measurement and feedback control. *Physical Review E* 88:052121. https://doi.org/10.1103/PhysRevE.88.052121
176. Guryanova, Y., Friis, N. and Huber, M. (2020). Ideal projective measurements have infinite resource costs. *Quantum* 4:222. https://doi.org/10.22331/q-2020-01-13-222
177. Danageozian, A., Wilde, M. M. and Buscemi, F. (2022). Thermodynamic constraints on quantum information gain and error correction: a triple trade-off. *PRX Quantum* 3:020318. https://doi.org/10.1103/PRXQuantum.3.020318
178. Wolpert, D. H. (2020). Minimal entropy production rate of interacting systems. *New Journal of Physics* 22:113013. https://doi.org/10.1088/1367-2630/abc5c6
179. Tasnim, F. and Wolpert, D. H. (2023). Stochastic thermodynamics of multiple co-evolving systems: beyond multipartite processes. *Entropy* 25:1078. https://doi.org/10.3390/e25071078
180. Wolpert, D. H. (2020). Uncertainty relations and fluctuation theorems for Bayes nets. *Physical Review Letters* 125:200602. https://doi.org/10.1103/PhysRevLett.125.200602
181. Rolandi, A., Abiuso, P. and Perarnau-Llobet, M. (2023). Collective advantages in finite-time thermodynamics. *Physical Review Letters* 131:210401. https://doi.org/10.1103/PhysRevLett.131.210401
182. Fujimoto, Y. and Ito, S. (2024). Game-theoretical approach to minimum entropy productions in information thermodynamics. *Physical Review Research* 6:013023. https://doi.org/10.1103/PhysRevResearch.6.013023
183. Lloyd, S. (2000). Ultimate physical limits to computation. *Nature* 406:1047-1054. https://doi.org/10.1038/35023282
184. Deffner, S. and Campbell, S. (2017). Quantum speed limits: from Heisenberg's uncertainty principle to optimal quantum control. *Journal of Physics A* 50:453001. https://doi.org/10.1088/1751-8121/aa86c6
185. Lan, G., Sartori, P., Neumann, S., Sourjik, V. and Tu, Y. (2012). The energy-speed-accuracy trade-off in sensory adaptation. *Nature Physics* 8:422-428. https://doi.org/10.1038/nphys2276
186. Mehta, P. and Schwab, D. J. (2012). Energetic costs of cellular computation. *PNAS* 109:17978-17982. https://doi.org/10.1073/pnas.1207814109
187. Lang, A. H., Fisher, C. K., Mora, T. and Mehta, P. (2014). Thermodynamics of statistical inference by cells. *Physical Review Letters* 113:148103. https://doi.org/10.1103/PhysRevLett.113.148103
188. Govern, C. C. and ten Wolde, P. R. (2014). Optimal resource allocation in cellular sensing systems. *PNAS* 111:17486-17491. https://doi.org/10.1073/pnas.1411524111
189. Sartori, P., Granger, L., Lee, C. F. and Horowitz, J. M. (2014). Thermodynamic costs of information processing in sensory adaptation. *PLoS Computational Biology* 10:e1003974. https://doi.org/10.1371/journal.pcbi.1003974
190. Barato, A. C., Hartich, D. and Seifert, U. (2013). Information-theoretic versus thermodynamic entropy production in autonomous sensory networks. *Physical Review E* 87:042104. https://doi.org/10.1103/PhysRevE.87.042104
191. Barato, A. C., Hartich, D. and Seifert, U. (2014). Efficiency of cellular information processing. *New Journal of Physics* 16:103024. https://doi.org/10.1088/1367-2630/16/10/103024
192. Ouldridge, T. E., Govern, C. C. and ten Wolde, P. R. (2017). Thermodynamics of computational copying in biochemical systems. *Physical Review X* 7:021004. https://doi.org/10.1103/PhysRevX.7.021004
193. Cao, Y., Wang, H., Ouyang, Q. and Tu, Y. (2015). The free-energy cost of accurate biochemical oscillations. *Nature Physics* 11:772-778. https://doi.org/10.1038/nphys3412
194. Zhang, D., Cao, Y., Ouyang, Q. and Tu, Y. (2019). The energy cost and optimal design for synchronization of coupled molecular oscillators. *Nature Physics* 16:95-100. https://doi.org/10.1038/s41567-019-0701-7
195. Sartori, P. and Tu, Y. (2015). Free energy cost of reducing noise while maintaining a high sensitivity. *Physical Review Letters* 115:118102. https://doi.org/10.1103/PhysRevLett.115.118102
196. Horowitz, J. M., Zhou, K. and England, J. L. (2017). Minimum energetic cost to maintain a target nonequilibrium state. *Physical Review E* 95:042102. https://doi.org/10.1103/PhysRevE.95.042102
197. Bryant, S. J. and Machta, B. B. (2023). Physical constraints in intracellular signaling: the cost of sending a bit. *Physical Review Letters* 131:068401. https://doi.org/10.1103/PhysRevLett.131.068401
198. Tjalma, A. J., Galstyan, V., Goedhart, J., Slim, L. et al. (2023). Trade-offs between cost and information in cellular prediction. *Proceedings of the National Academy of Sciences* 120:e2303078120. https://doi.org/10.1073/pnas.2303078120
199. Schreiber, T. (2000). Measuring information transfer. *Physical Review Letters* 85:461-464. https://doi.org/10.1103/PhysRevLett.85.461
200. Tishby, N. and Polani, D. (2011). Information theory of decisions and actions. In *Perception-Action Cycle*, Springer, pp. 601-636. https://doi.org/10.1007/978-1-4419-1452-1_19
201. Stratonovich, R. L. (2020). *Theory of Information and its Value* (English edition of the 1975 Russian monograph). Springer. https://doi.org/10.1007/978-3-030-22833-0
202. Pal, S., Saryal, S., Segal, D., Mahesh, T. S. and Agarwalla, B. K. (2020). Experimental study of the thermodynamic uncertainty relation. *Physical Review Research* 2:022044. https://doi.org/10.1103/PhysRevResearch.2.022044
203. Barker, D., Lehmann, S., Dick, K. A., Samuelsson, P. et al. (2025). Information thermodynamics in a quantum dot Szilard engine: experimentally investigating fluctuation theorems and thermodynamic uncertainty relations. arXiv:2511.08541 (preprint).
204. Friedman, H. M., Agarwalla, B. K., Shein-Lumbroso, O., Tal, O. and Segal, D. (2020). Thermodynamic uncertainty relation in atomic-scale quantum conductors. *Physical Review B* 101:195423. https://doi.org/10.1103/PhysRevB.101.195423
205. Hwang, W. and Hyeon, C. (2018). Energetic costs, precision, and transport efficiency of molecular motors. *Journal of Physical Chemistry Letters* 9:513-520. https://doi.org/10.1021/acs.jpclett.7b03197
206. Li, J., Horowitz, J. M., Gingrich, T. R. and Fakhri, N. (2019). Quantifying dissipation using fluctuating currents. *Nature Communications* 10:1666. https://doi.org/10.1038/s41467-019-09631-x
207. Ness, G., Lam, M. R., Alt, W., Meschede, D., Sagi, Y. and Alberti, A. (2021). Observing crossover between quantum speed limits. *Science Advances* 7:eabj9119. https://doi.org/10.1126/sciadv.abj9119
208. Pires, L. B., Goerlich, R., Luna da Fonseca, A., Debiossac, M., Hervieux, P.-A. et al. (2023). Optimal time-entropy bounds and speed limits for Brownian thermal shortcuts. *Physical Review Letters* 131:097101. https://doi.org/10.1103/PhysRevLett.131.097101
209. Oikawa, S., Nakayama, Y., Ito, S., Sagawa, T. and Toyabe, S. (2025). Experimentally achieving minimal dissipation via thermodynamically optimal transport. *Nature Communications* 16:10424. https://doi.org/10.1038/s41467-025-66519-9
210. Proesmans, K., Dreher, Y., Gavrilov, M., Bechhoefer, J. and Van den Broeck, C. (2016). Brownian duet: a novel tale of thermodynamic efficiency. *Physical Review X* 6:041010. https://doi.org/10.1103/PhysRevX.6.041010
211. Mancino, L., Cavina, V., De Pasquale, A., Sbroscia, M., Booth, R. I. et al. (2018). Geometrical bounds on irreversibility in open quantum systems. *Physical Review Letters* 121:160602. https://doi.org/10.1103/PhysRevLett.121.160602
212. Dago, S. and Bellon, L. (2022). Dynamics of information erasure and extension of Landauer's bound to fast processes. *Physical Review Letters* 128:070604. https://doi.org/10.1103/PhysRevLett.128.070604
213. Mattingly, H. H., Kamino, K., Machta, B. B. and Emonet, T. (2021). *Escherichia coli* chemotaxis is information limited. *Nature Physics* 17:1426-1431. https://doi.org/10.1038/s41567-021-01380-3
214. Blickle, V. and Bechinger, C. (2012). Realization of a micrometre-sized stochastic heat engine. *Nature Physics* 8:143-146. https://doi.org/10.1038/nphys2163
215. Martínez, I. A., Roldán, É., Dinis, L., Petrov, D., Parrondo, J. M. R. and Rica, R. A. (2016). Brownian Carnot engine. *Nature Physics* 12:67-70. https://doi.org/10.1038/nphys3518
216. Roldán, É., Martínez, I. A., Parrondo, J. M. R. and Petrov, D. (2014). Universal features in the energetics of symmetry breaking. *Nature Physics* 10:457-461. https://doi.org/10.1038/nphys2940
217. Krishnamurthy, S., Ghosh, S., Chatterji, D., Ganapathy, R. and Sood, A. K. (2016). A micrometre-sized heat engine operating between bacterial reservoirs. *Nature Physics* 12:1134-1138. https://doi.org/10.1038/nphys3870
218. Krishnamurthy, S., Ganapathy, R. and Sood, A. K. (2023). Overcoming power-efficiency tradeoff in a micro heat engine by engineered system-bath interactions. *Nature Communications* 14:6842. https://doi.org/10.1038/s41467-023-42350-y
219. Paneru, G., Dutta, S., Sagawa, T., Tlusty, T. and Pak, H. K. (2020). Efficiency fluctuations and noise induced refrigerator-to-heater transition in information engines. *Nature Communications* 11:1012. https://doi.org/10.1038/s41467-020-14823-x
220. Jung, T., Polani, D. and Stone, P. (2011). Empowerment for continuous agent-environment systems. *Adaptive Behavior* 19:16-39. https://doi.org/10.1177/1059712310392389
221. Salge, C., Glackin, C. and Polani, D. (2013). Empowerment: an introduction. arXiv:1310.1863 (preprint).
222. Kolchinsky, A. (2024). Thermodynamic dissipation does not bound replicator growth and decay rates. arXiv:2404.01130 (preprint).
223. Adlam, E. C., McQueen, K. J. and Waegell, M. (2025). Agency cannot be a purely quantum phenomenon. arXiv:2510.13247 (preprint).
224. Goldt, S. and Seifert, U. (2017). Stochastic thermodynamics of learning. *Physical Review Letters* 118:010601. https://doi.org/10.1103/PhysRevLett.118.010601
225. Still, S. (2020). Thermodynamic cost and benefit of memory. *Physical Review Letters* 124:050601. https://doi.org/10.1103/PhysRevLett.124.050601
226. Boyd, A. B., Crutchfield, J. P. and Gu, M. (2022). Thermodynamic machine learning through maximum work production. *New Journal of Physics* 24:083040. https://doi.org/10.1088/1367-2630/ac4309
227. Boyd, A. B., Crutchfield, J. P., Gu, M. and Binder, F. C. (2025). Thermodynamic overfitting and generalization: energetics of predictive intelligence. *New Journal of Physics* 27:063901. https://doi.org/10.1088/1367-2630/addf71
228. Ehrich, J., Still, S. and Sivak, D. A. (2023). Energetic cost of feedback control. *Physical Review Research* 5:023080. https://doi.org/10.1103/PhysRevResearch.5.023080
229. Ehrich, J. and Sivak, D. A. (2023). Energy and information flows in autonomous systems. *Frontiers in Physics* 11:1108357. https://doi.org/10.3389/fphy.2023.1108357
230. Wolpert, D. H. (2019). The stochastic thermodynamics of computation. *Journal of Physics A* 52:193001. https://doi.org/10.1088/1751-8121/ab0850
231. Levy, W. B. and Baxter, R. A. (1996). Energy efficient neural codes. *Neural Computation* 8:531-543. https://doi.org/10.1162/neco.1996.8.3.531
232. Balasubramanian, V., Kimber, D. and Berry, M. J., II (2001). Metabolically efficient information processing. *Neural Computation* 13:799-815. https://doi.org/10.1162/089976601300014358
233. Goldt, S. and Seifert, U. (2017). Thermodynamic efficiency of learning a rule in neural networks. *New Journal of Physics* 19:113001. https://doi.org/10.1088/1367-2630/aa89ff
234. Fiderer, L. J., Barth, P. C., Smith, I. D. and Briegel, H. J. (2025). Information thermodynamics of agents: the work capacity of channels with memory. arXiv:2504.06209 (preprint).
235. Elliott, T. J., Gu, M., Garner, A. J. P. and Thompson, J. (2022). Quantum adaptive agents with efficient long-term memories. *Physical Review X* 12:011007. https://doi.org/10.1103/PhysRevX.12.011007
236. Russell, S. J. and Subramanian, D. (1995). Provably bounded-optimal agents. *Journal of Artificial Intelligence Research* 2:575-609. https://doi.org/10.1613/jair.133
237. Genewein, T., Leibfried, F., Grau-Moya, J. and Braun, D. A. (2015). Bounded rationality, abstraction, and hierarchical decision-making: an information-theoretic optimality principle. *Frontiers in Robotics and AI* 2:27. https://doi.org/10.3389/frobt.2015.00027
238. Legg, S. and Hutter, M. (2007). Universal intelligence: a definition of machine intelligence. *Minds and Machines* 17:391-444. https://doi.org/10.1007/s11023-007-9079-x
239. Takahashi, K. and Hayashi, Y. (2026). Thermodynamic limits of physical intelligence. arXiv:2602.05463 (preprint).
240. Ortega, P. A., Braun, D. A., Dyer, J., Kim, K.-E. and Tishby, N. (2015). Information-theoretic bounded rationality. arXiv:1512.06789 (preprint).
241. Zénon, A., Solopchuk, O. and Pezzulo, G. (2019). An information-theoretic perspective on the costs of cognition. *Neuropsychologia* 123:5-18. https://doi.org/10.1016/j.neuropsychologia.2018.09.013
242. Sims, C. R. (2016). Rate-distortion theory and human perception. *Cognition* 152:181-198. https://doi.org/10.1016/j.cognition.2016.03.020
243. Laughlin, S. B., de Ruyter van Steveninck, R. R. and Anderson, J. C. (1998). The metabolic cost of neural information. *Nature Neuroscience* 1:36-41. https://doi.org/10.1038/236
244. Attwell, D. and Laughlin, S. B. (2001). An energy budget for signaling in the grey matter of the brain. *Journal of Cerebral Blood Flow and Metabolism* 21:1133-1145. https://doi.org/10.1097/00004647-200110000-00001
245. Lennie, P. (2003). The cost of cortical computation. *Current Biology* 13:493-497. https://doi.org/10.1016/S0960-9822(03)00135-0
246. Sengupta, B., Stemmler, M., Laughlin, S. B. and Niven, J. E. (2010). Action potential energy efficiency varies among neuron types in vertebrates and invertebrates. *PLoS Computational Biology* 6:e1000840. https://doi.org/10.1371/journal.pcbi.1000840
247. Sengupta, B., Stemmler, M. B. and Friston, K. J. (2013). Information and efficiency in the nervous system: a synthesis. *PLoS Computational Biology* 9:e1003157. https://doi.org/10.1371/journal.pcbi.1003157
248. Levy, W. B. and Calvert, V. G. (2021). Communication consumes 35 times more energy than computation in the human cortex, but both costs are needed to predict synapse number. *Proceedings of the National Academy of Sciences* 118:e2008173118. https://doi.org/10.1073/pnas.2008173118
249. Harris, J. J., Jolivet, R., Engl, E. and Attwell, D. (2015). Energy-efficient information transfer by visual pathway synapses. *Current Biology* 25:3151-3160. https://doi.org/10.1016/j.cub.2015.10.063
250. Padamsey, Z., Katsanevaki, D., Dupuy, N. and Rochefort, N. L. (2022). Neocortex saves energy by reducing coding precision during food scarcity. *Neuron* 110:280-296.e10. https://doi.org/10.1016/j.neuron.2021.10.024
251. Plaçais, P.-Y. and Preat, T. (2013). To favor survival under food shortage, the brain disables costly memory. *Science* 339:440-442. https://doi.org/10.1126/science.1226018
252. Plaçais, P.-Y., de Tredern, É., Scheunemann, L., Trannoy, S. et al. (2017). Upregulated energy metabolism in the *Drosophila* mushroom body is the trigger for long-term memory. *Nature Communications* 8:15510. https://doi.org/10.1038/ncomms15510
253. Mery, F. and Kawecki, T. J. (2005). A cost of long-term memory in *Drosophila*. *Science* 308:1148. https://doi.org/10.1126/science.1111331
254. Hechler, A., de Lange, F. P. and Riedl, V. (2023). The energy metabolic footprint of predictive processing in the human brain. bioRxiv preprint, version 2 posted 2024. https://doi.org/10.1101/2023.12.08.570804
255. Malkin, J., O'Donnell, C., Houghton, C. J. and Aitchison, L. (2024). Signatures of Bayesian inference emerge from energy-efficient synapses. *eLife* 12:RP92595. https://doi.org/10.7554/eLife.92595
256. Li, H. L. and van Rossum, M. C. W. (2020). Energy efficient synaptic plasticity. *eLife* 9:e50804. https://doi.org/10.7554/eLife.50804
257. Lynn, C. W., Cornblath, E. J., Papadopoulos, L., Bertolero, M. A. and Bassett, D. S. (2021). Broken detailed balance and entropy production in the human brain. *Proceedings of the National Academy of Sciences* 118:e2109889118. https://doi.org/10.1073/pnas.2109889118
258. Horowitz, M. (2014). Computing's energy problem (and what we can do about it). *2014 IEEE International Solid-State Circuits Conference*, pp. 10-14. https://doi.org/10.1109/ISSCC.2014.6757323
259. Saad-Falcon, J., Narayan, A., Akengin, H. O., Griffin, J. W. et al. (2025). Intelligence per watt: measuring intelligence efficiency of local AI. arXiv:2511.07885 (preprint).
260. Tschand, A., Rajan, A. T. R., Idgunji, S., Ghosh, A. et al. (2024). MLPerf Power: benchmarking the energy efficiency of machine learning systems from microwatts to megawatts. arXiv:2410.12032 (preprint).
261. Chung, J.-W., Ma, J. J., Wu, R., Liu, J. et al. (2025). The ML.ENERGY benchmark: toward automated inference energy measurement and optimization. arXiv:2505.06371 (preprint).
262. Niu, C., Zhang, W., Li, J., Zhao, Y. et al. (2025). TokenPowerBench: benchmarking the power consumption of LLM inference. arXiv:2512.03024 (preprint).
263. Jin, Y., Wei, G.-Y. and Brooks, D. (2025). The energy cost of reasoning: analyzing energy usage in LLMs with test-time compute. arXiv:2505.14733 (preprint).
264. Luccioni, S., Jernite, Y. and Strubell, E. (2024). Power hungry processing: watts driving the cost of AI deployment? *ACM FAccT 2024*, pp. 85-99. https://doi.org/10.1145/3630106.3658542
265. Samsi, S., Zhao, D., McDonald, J., Li, B. et al. (2023). From words to watts: benchmarking the energy costs of large language model inference. *2023 IEEE High Performance Extreme Computing Conference (HPEC)*, pp. 1-9. https://doi.org/10.1109/HPEC58863.2023.10363447
266. Dillavou, S., Stern, M., Liu, A. J. and Durian, D. J. (2022). Demonstration of decentralized physics-driven learning. *Physical Review Applied* 18:014040. https://doi.org/10.1103/PhysRevApplied.18.014040
267. Stern, M., Dillavou, S., Jayaraman, D., Durian, D. J. and Liu, A. J. (2024). Training self-learning circuits for power-efficient solutions. *APL Machine Learning* 2:016114. https://doi.org/10.1063/5.0181382
268. Saggio, V., Asenbeck, B. E., Hamann, A., Strömberg, T. et al. (2021). Experimental quantum speed-up in reinforcement learning agents. *Nature* 591:229-233. https://doi.org/10.1038/s41586-021-03242-7
269. Crosato, E., Spinney, R. E., Nigmatullin, R., Lizier, J. T. and Prokopenko, M. (2018). Thermodynamics and computation during collective motion near criticality. *Physical Review E* 97:012120. https://doi.org/10.1103/PhysRevE.97.012120
270. Chen, Q. and Prokopenko, M. (2025). Why collective behaviours self-organize to criticality: a primer on information-theoretic and thermodynamic utility measures. *Royal Society Open Science* 12:241655. https://doi.org/10.1098/rsos.241655
271. Khan, K. N., Hirki, M., Niemi, T., Nurminen, J. K. and Ou, Z. (2018). RAPL in action: experiences in using RAPL for power measurements. *ACM Transactions on Modeling and Performance Evaluation of Computing Systems* 3:1-26. https://doi.org/10.1145/3177754
272. Desrochers, S., Paradis, C. and Weaver, V. M. (2016). A validation of DRAM RAPL power measurements. *Proceedings of the Second International Symposium on Memory Systems*, pp. 455-470. https://doi.org/10.1145/2989081.2989088
273. Hackenberg, D., Schöne, R., Ilsche, T., Molka, D., Schuchart, J. and Geyer, R. (2015). An energy efficiency feature survey of the Intel Haswell processor. *2015 IEEE IPDPS Workshops*, pp. 896-904. https://doi.org/10.1109/IPDPSW.2015.70
274. Apple. powermetrics(1) manual page. macOS developer tools documentation.
275. Hutter Prize for Lossless Compression of Human Knowledge. http://prize.hutter1.net/
276. Strubell, E., Ganesh, A. and McCallum, A. (2019). Energy and policy considerations for deep learning in NLP. arXiv:1906.02243 (preprint).
277. Patterson, D., Gonzalez, J., Le, Q., Liang, C. et al. (2021). Carbon emissions and large neural network training. arXiv:2104.10350 (preprint).
278. Lacoste, A., Luccioni, A., Schmidt, V. and Dandres, T. (2019). Quantifying the carbon emissions of machine learning. arXiv:1910.09700 (preprint).
279. Luccioni, A. S., Viguier, S. and Ligozat, A.-L. (2022). Estimating the carbon footprint of BLOOM, a 176B parameter language model. arXiv:2211.02001 (preprint).
280. Anthony, L. F. W., Kanding, B. and Selvan, R. (2020). Carbontracker: tracking and predicting the carbon footprint of training deep learning models. arXiv:2007.03051 (preprint).
281. Elsworth, C., Huang, K., Patterson, D., Schneider, I. et al. (2025). Measuring the environmental impact of delivering AI at Google scale. arXiv:2508.15734 (preprint).
282. Schmidhuber, J. (2010). Formal theory of creativity, fun, and intrinsic motivation (1990-2010). *IEEE Transactions on Autonomous Mental Development* 2:230-247. https://doi.org/10.1109/TAMD.2010.2056368
283. Chollet, F. (2019). On the measure of intelligence. arXiv:1911.01547 (preprint).
284. ARC Prize Foundation. ARC-AGI leaderboard. https://arcprize.org/leaderboard (accessed 8 October 2026).
285. Hernández-Orallo, J. (2017). *The Measure of All Minds: Evaluating Natural and Artificial Intelligence*. Cambridge University Press. https://doi.org/10.1017/9781316594179
286. Hernández-Orallo, J. and Dowe, D. L. (2010). Measuring universal intelligence: towards an anytime intelligence test. *Artificial Intelligence* 174:1508-1539. https://doi.org/10.1016/j.artint.2010.09.006
287. Gershman, S. J., Horvitz, E. J. and Tenenbaum, J. B. (2015). Computational rationality: a converging paradigm for intelligence in brains, minds, and machines. *Science* 349:273-278. https://doi.org/10.1126/science.aac6076
288. Lieder, F. and Griffiths, T. L. (2020). Resource-rational analysis: understanding human cognition as the optimal use of limited computational resources. *Behavioral and Brain Sciences* 43:e1. https://doi.org/10.1017/S0140525X1900061X
289. Balasubramanian, V. (2021). Brain power. *PNAS* 118:e2107022118. https://doi.org/10.1073/pnas.2107022118
290. Silver, D., Singh, S., Precup, D. and Sutton, R. S. (2021). Reward is enough. *Artificial Intelligence* 299:103535. https://doi.org/10.1016/j.artint.2021.103535
291. Vamplew, P., Smith, B. J., Källström, J., Ramos, G., Rădulescu, R. et al. (2022). Scalar reward is not enough: a response to Silver, Singh, Precup and Sutton (2021). *Autonomous Agents and Multi-Agent Systems* 36:41. https://doi.org/10.1007/s10458-022-09575-5
292. Hafez, W., Wei, C., Pena, R., Nazeri, A. et al. (2026). A mathematical theory of agency and intelligence. arXiv:2602.22519 (preprint).
293. Karagoz, A. (2025). Energentic intelligence: from self-sustaining systems to enduring artificial life. arXiv:2506.04916 (preprint).
294. Chaisson, E. J. (2011). Energy rate density as a complexity metric and evolutionary driver. *Complexity* 16:27-40. https://doi.org/10.1002/cplx.20323
295. Poplavskii, R. P. (1975). Thermodynamic models of information processes. *Uspekhi Fizicheskikh Nauk* 115:465 (in Russian), https://doi.org/10.3367/UFNr.0115.197503d.0465. English translation: *Soviet Physics Uspekhi* 18:222-241, https://doi.org/10.1070/PU1975v018n03ABEH001955
296. Ito, S. and Sagawa, T. (2017). Information thermodynamics on networks and its application to biological information processing. *Butsuri* (日本物理学会誌) 72(9):658 (in Japanese). https://doi.org/10.11316/butsuri.72.9_658
297. Sun, C.-P. and Quan, H.-T. (2013). Maxwell's demon and the physical limits on information processing. *Wuli* (物理, Physics) 42(11) (in Chinese). doi:10.7693/wl20131101
298. Quan, H.-T., Dong, H. and Sun, C.-P. (2023). Theory and experiments of mesoscopic statistical thermodynamics. *Acta Physica Sinica* 72:230501 (in Chinese, with English abstract). https://doi.org/10.7498/aps.72.20231608
299. Parrondo, J. M. R. (2023). Thermodynamics of information. arXiv:2306.12447 (encyclopedia chapter preprint).
300. Strasberg, P. Thermodynamics and information processing at the nanoscale. Doctoral thesis, Technische Universität Berlin.
301. Dago, S. (2022). Thermodynamique stochastique: pilotage de micro-oscillateurs et applications à l'étude et l'optimisation du traitement de l'information. Doctoral thesis, École normale supérieure de Lyon (in French). https://theses.fr/2022LYSEN019
302. Lagoin, M. (2023). Thermodynamique dans les systèmes stationnaires hors équilibre macroscopiques: démons de Maxwell et machines thermiques aléatoires. Doctoral thesis, École normale supérieure de Lyon (in French).
303. Ciampini, M. A., Mancino, L., Orieux, A., Vigliar, C. et al. (2017). Experimental extractable work-based multipartite separability criteria. *npj Quantum Information* 3:10. https://doi.org/10.1038/s41534-017-0011-9
304. Sudakov, K. V. (2004). Functional systems theory and the probabilistic prediction of behavior. *Neuroscience and Behavioral Physiology* 34:505-507. https://doi.org/10.1023/B:NEAB.0000022638.96382.dd
305. Sudakov, K. V. (2015). Theory of functional systems: a keystone of integrative biology. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 153-173. https://doi.org/10.1007/978-3-319-19446-2_9
306. Sudakov, K. V. (2022). Cognitive activity from the perspective of functional systems theory. In *Russian Cognitive Neuroscience*, Brill, pp. 87-117. https://doi.org/10.1163/9789004505667_005
307. Shvyrkov, V. B. (1985). Toward a psychophysiological theory of behavior. *Advances in Psychology*, pp. 47-71. https://doi.org/10.1016/S0166-4115(08)61596-4
308. Anokhin, K. V. (2021). The cognitome: seeking the fundamental neuroscience of a theory of consciousness. *Neuroscience and Behavioral Physiology* 51:915-937. https://doi.org/10.1007/s11055-021-01149-4
309. Saltykov, A. and Grachev, S. (2015). Anticipation and the concept of system-forming factor in the theory of functional systems. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 507-520. https://doi.org/10.1007/978-3-319-19446-2_30
310. Vityaev, E. E. (2015). Purposefulness as a principle of brain activity. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 231-254. https://doi.org/10.1007/978-3-319-19446-2_13
311. Vityaev, E. E. and Demin, A. V. (2011). Recursive subgoals discovery based on the functional systems theory. *Frontiers in Artificial Intelligence and Applications* (BICA 2011), IOS Press. https://doi.org/10.3233/978-1-60750-959-2-425
312. Vityaev, E. E. and Demin, A. V. (2018). Cognitive architecture based on the functional systems theory. *Procedia Computer Science* 145:623-628. https://doi.org/10.1016/j.procs.2018.11.072
313. Vityaev, E., Kolonin, A., Kurpatov, A., Molchanov, A. et al. (2022). Brain principles programming. arXiv:2202.12710 (preprint).
314. Potapov, A., Belikov, A., Bogdanov, V., Scherbatiy, A. et al. (2019). Differentiable probabilistic logic networks. arXiv:1907.04592 (preprint).
