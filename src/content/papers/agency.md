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
- **Mixture of Limits:** the OpenIE philosophy. Use the cheapest gear that is sufficient.
- **Notational Intelligence:** the OpenIE receipt study. Every act carries its prediction, its outcome and its joules.
- **Metabolic Intelligence:** the OpenIE product. It runs on any fabric.
- **Klere:** the hardware.

## 2. Formal sketch

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

At $T = 300$ K, $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J, computed from the SI constants. That is about $3.5 \times 10^{20}$ bits per joule.

**K2. Classical speed limit.** Shiraishi, Funo and Saito proved this bound for a Markov jump process with local detailed balance [8]:

$$
\tau \;\ge\; \frac{L\big(p(0),p(\tau)\big)^2}{2\,\Sigma_{\mathrm{tot}}\,\langle A\rangle_\tau}
$$

- $L(p,p') = \sum_i |p_i - p'_i|$ is the full $L_1$ distance between two probability distributions. There is no factor of 1/2. With total variation distance $d_{TV} = L/2$, the same bound reads $\tau \ge 2 d_{TV}^2/(\Sigma_{\mathrm{tot}}\langle A\rangle_\tau)$.
- $\Sigma_{\mathrm{tot}} = \int_0^\tau \dot\Sigma\,dt$ is total entropy production, system plus baths, in units of $k_B$.
- $A(t) = \sum_{i\ne j} W_{ij}(t)\,p_j(t)$ is the dynamical activity, with $W_{ij}$ the jump rate from state $j$ to state $i$. $\langle A\rangle_\tau = \frac{1}{\tau}\int_0^\tau A(t)\,dt$ is its time average.

Rearranged, $\Sigma_{\mathrm{tot}} \ge L^2/(2\tau\langle A\rangle_\tau)$. Moving a distribution far, fast, with few jumps, costs entropy.

**Joule form.** For one bath, $k_B T\,\Sigma_{\mathrm{tot}} = W - \Delta F_{\mathrm{neq}}$, with $F_{\mathrm{neq}}$ the nonequilibrium free energy [9]. So the dissipated work obeys

$$
W_{\mathrm{diss}} \;\ge\; \frac{k_B T\, L^2}{2\,\tau\,\langle A\rangle_\tau}.
$$

**Stationary currents.** The same paper gives $\tau \ge c^* L^2 / (2\,\Sigma_{HS}\,\langle A\rangle_\tau)$, with $c^* = 0.896\ldots$ and $\Sigma_{HS}$ the Hatano-Sasa, or excess, entropy production [8].

**K3. Precision costs dissipation.** For a time-antisymmetric current $Y$ in a steady state, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma_{\mathrm{tot}}$ [10, 11]. Agents use feedback, and feedback beats this bound in experiment [12]. The law for agents is the feedback form, in which mutual information enters the bound [13].

**K4. Finite-time cost.** Erasing a bit in finite time $\tau$ costs more than $k_B T \ln 2$. The excess grows as $\tau$ shrinks [14]. Near equilibrium, the excess work along a protocol is bounded below by the squared thermodynamic length over the duration [15].

**K5. Quantum ceiling on rate.** A system with mean energy $\langle E\rangle$ above its ground state makes at most $2\langle E\rangle/(\pi\hbar)$ orthogonal transitions per second [16]. That is about $6.04 \times 10^{33}$ transitions per second per joule, computed from the constants. A figure of about $3 \times 10^{33}$ matches $2E/h$, not $2E/(\pi\hbar)$.

### 2.3 Layer 3. Calculus: intelligence as a derivative, read in hindsight

A run produces a receipt: the ordered record $\{(J_k, X_k)\}_{k=0}^{n}$ of metered joules and confirmed displacement. Each $m_k$ is known only after act $k$ closes. So the path $X(J)$ exists only once the run is complete.

- **Intelligence, marginal:** $\iota(J) = \dfrac{dX}{dJ}$, estimated from the receipt as $\iota_k = \Delta X_k/\Delta J_k$.
- **Run integral:** $X(B) = \int_0^B \iota(J)\,dJ$.
- **Joules to close a requirement:** $J^*(X_{\mathrm{req}}) = \int_0^{X_{\mathrm{req}}} \frac{dX}{\iota}$.
- **Optimum:** $\pi^* = \arg\min_\pi J_\pi$ subject to $X_\pi \ge X_{\mathrm{req}}$, $E_k = 1$ for every $k$, and $J_\pi \le B$. If no policy is feasible, refuse with a receipt.
- **Ranking:** $S_1 \succ_q S_2 \iff J^*_{S_1}(q) < J^*_{S_2}(q)$.

$X_{\mathrm{req}}$ is set by the task's completeness predicate $C(z)$. It is a gate, not a score. Parameters, tokens and benchmarks enter only through $J^*$. All other factors collapse to zero.

Hindsight is literal here. Velocity is read off a recorded path. Intelligence is read off a recorded run. The receipt is the path.

### 2.4 Where the studies sit

- **Mixture of Limits** is the optimum operator. The cheapest sufficient gear is the argmin over joules.
- **Notational Intelligence** is the receipt. It carries $R^*$, $R$, $m$ and $J$ for every act.
- **Metabolic Intelligence** computes $\iota$ on any fabric.
- **Klere** is the hardware that meters $J$.

## 3. Layer 1. The Universal Law of Agency

The law has four clauses: prediction fixed before the act, coupling to the world through intervention, consequence borne by the system, and a physical floor in joules with refusal on a receipt.

### 3.1 Proven

**Information has a price.** Landauer showed that a logically irreversible operation dissipates at least $k_B T \ln 2$ per bit [6]. This is the floor under clause 4. Bennett built a reversible Turing machine and showed that only erasure must cost [17]. The unavoidable cost of agency sits at the reset of the acceptor, not at the thinking. Bennett then resolved Maxwell's demon by the cost of erasing the demon's memory [7]. The demon is a minimal agent. Its accounts close only when its memory is reset. That is clause 3 plus clause 4.

**Feedback is priced by information.** Sagawa and Ueda proved that with feedback, extractable work is bounded by $-\Delta F + k_B T I$ [3]. The value of acting on a measurement is capped by the information the measurement carries. They proved that measurement work plus erasure work is at least $k_B T I$ [5]. The full cycle of predict, compare and reset is priced in joules. They derived an exact Jarzynski equality under feedback [4] and a fluctuation theorem with information exchange between subsystems [18]. Coupling is a correlation that enters the second law.

**Entropy converts to joules.** Esposito and Van den Broeck derived $k_B T \Sigma = W - \Delta F_{\mathrm{neq}}$ for an isothermal driven system [9]. Every kinematic bound in Layer 2 becomes a joule bound through this identity. Horodecki and Oppenheim proved work costs for single shots at small scale [19]. Agency acts are single shots. The standard reviews state the settled account: information is a thermodynamic resource with a price [20, 21].

**Control needs coupling.** Conant and Ashby proved that a good regulator must be a model of the system it regulates [22]. A system that regulates well already carries a prediction. Touchette and Lloyd proved that the entropy a controller removes is bounded by its mutual information with the system [23, 24]. Coupling is the currency of control. Closed loop control, acting on a comparison, is what the law requires. Pearl's do-calculus gives the intervention operator and the conditions under which its effects are identifiable [1]. Clause 2 is written in this operator. Everitt and colleagues classified how an agent can tamper with its own reward or inputs [2]. Coupling must be to the world, not to the agent's own sensor.

**Information flows inside the agent.** Horowitz and Esposito showed that information flow between subsystems enters each subsystem's second law [25]. Coupling becomes a rate. Ito and Sagawa proved a second law for arbitrary causal networks with transfer entropy [26]. Prediction, act and outcome are nodes on such a network. Hartich, Barato and Seifert linked transfer entropy, learning rate and dissipation [27]. Allahverdyan, Janzing and Mahler bounded the efficiency of information flow between coupled systems [28]. Esposito and Schaller showed that feedback that changes only barriers still enters the entropy balance [29]. A purely informational act is in the joule ledger.

**Autonomous demons.** Mandal and Jarzynski solved a demon that lifts a mass by writing bits to a tape [30]. It has no outside operator, and memory pays for its work. Boyd, Mandal and Crutchfield bounded the work of such ratchets by the entropy rates of their input and output tapes [31]. They showed that modular designs pay dissipation above Landauer [32]. How an agent is built changes its floor.

**Prediction quality has a joule price.** Kolchinsky and Wolpert proved that a process tuned for one input distribution dissipates extra on any other, by a relative entropy term [33]. Still, Sivak, Bell and Crooks showed that memory that does not predict costs dissipation [34]. Keeping only what predicts is the cheap design. Kolchinsky and Wolpert defined semantic information as information that is causally necessary for a system to keep itself out of equilibrium, with a thermodynamic value [35]. It is the closest existing law with joules. It stops before kinematics and before an intelligence operator. Ortega and Braun derived bounded-rational decisions from a free-energy principle with an information cost [36]. Kolchinsky and Wolpert bounded the heat of universal computation by program complexity [37].

### 3.2 Demonstrated

**Landauer's floor, measured.** A colloidal bead in an optical double well approached $k_B T \ln 2$ of mean heat as erasure slowed [38]. A feedback trap measured the same approach with high precision and extra cost at short cycle times [39]. The floor rises when the act is fast. That is a Layer 2 effect seen in a Layer 1 experiment. An adiabatic electronic circuit showed the Landauer cost for irreversible operation and dissipation below $k_B T$ for reversible operation [40]. The floor binds the reset, not the logic. Nanomagnetic memory bits showed the floor in memory hardware [41]. Erasure with near-zero work appears when the free-energy accounting is complete [42]. The floor is on total entropy, so the receipt must carry the full account. The entropy that enters the bound was measured to have the Gibbs-Shannon form [43]. A single trapped ion showed the quantum floor [44]. The floor holds on every substrate tested. An underdamped micromechanical oscillator reached the floor at high speed [45]. A quantum dot erased bits at minimal dissipation for a given duration, with protocols designed from thermodynamic length [46].

**Feedback agents turn information into work.** A colloid on a spiral staircase potential gained free energy above the work done, paid by information, and confirmed the generalized Jarzynski equality [47]. This is the first direct observation of an act whose value is set by a measurement made before it. A single-electron box extracted work near $k_B T \ln 2$ per bit [48] and measured the fluctuation theorem with mutual information [49]. An autonomous on-chip demon cooled a system with information while its own heating was measured [50]. The agent's cost was measured beside its effect.

Quantum agents obey the same law. NMR on molecular spins reduced entropy production by feedback, within the information bound [51], and converted information to energy at the floor [52]. Superconducting circuits tracked a demon's memory during feedback [53], verified the generalized integral fluctuation theorem [54], and measured information gained and lost during feedback [55]. Coupling decays, so the receipt must record it at the time of the act. Cold atoms in a three-dimensional optical lattice were sorted by measurement [56].

Classical engines measured the price at full scale. An optical tweezer engine converted information to work at the theoretical limit [57]. A colloidal engine extracted work that depends on temporal correlations in its input [58]. A DNA hairpin under continuous monitoring yielded more than $k_B T \ln 2$ per cycle when many measurements happened per cycle, consistent with the information content [59]. A levitated microparticle with delayed feedback obeyed a generalized second law across two decades of delay, and feedback failed at large delay [60]. A late act is a weaker act. Feedback trap engines maximized power and velocity [61], exploited noisy measurements optimally [62], and harvested a nonequilibrium bath [63]. A quantum dot linked work fluctuations to dissipation during information-to-work conversion [64]. A trapped ion verified fluctuation theorems that include the demon's own dissipation [65], following theory by Zeng and Wang [66].

**Functional-system agents built and run.** A simulated nematode with an acceptor of action results learned locomotion and chemotaxis [67]. A physical mobile robot ran the same functional-system controller [68]. Clauses 1 and 3 run in software and on a body. Neither meters joules.

### 3.3 Opinion

**Purposive systems and anticipation.** Rosenblueth, Wiener and Bigelow defined purposeful behavior through negative feedback toward a goal [69]. It has no energy term. Anokhin's functional system has afferent synthesis, decision, an acceptor of action results fixed before the act, action, and comparison [70, 71]. This is clauses 1 and 3 in their first systematic form, built on animal experiments. Sudakov stated the result as the system-forming factor [72]. The prediction clause is the organizing principle. Shvyrkov showed from single-neuron recordings that the goal organizes neural activity [73]. Rosen defined an anticipatory system as one that contains a predictive model of itself and its world and acts on the prediction [74]. None of these sets a joule floor.

**Autonomy and organization.** Maturana and Varela defined the living by self-production [75]. Kauffman put a thermodynamic work cycle inside the definition of an autonomous agent [76]. It has no prediction clause. Di Paolo made adaptivity, the regulation of one's own viability, a condition for sense-making [77]. That is clause 3. Barandiaran and Moreno proposed a minimal criterion for cognitive organization and grounded adaptive regulation in metabolism [78, 79]. Barandiaran, Di Paolo and Rohde defined agency by individuality, interactional asymmetry and normativity [80]. Ruiz-Mirazo, Moreno and Mossio framed autonomy as a self-maintaining metabolic organization [81, 82]. Montévil and Mossio described organisms as closures of constraints on thermodynamic flows [83]. It is the closest of this school to joules. Aguilera and Barandiaran built a minimal model of autonomous agency in stochastic thermodynamics [84]. The autonomy tradition is moving toward the joule.

**Free energy and the physics of agency.** Friston proposes that agents minimize variational free energy [85, 86]. That free energy is informational, not joules, and every bounded system qualifies, so it sets no floor. Rovelli explains agency through the entropy gradient [87]. Agency is thermodynamic at root. Jaeger argues that agency requires self-manufacture and that current artificial intelligence lacks it [88]. That is a demand for a gate before any intelligence claim. Azadi ties agency to computational irreducibility [89]. Wissner-Gross and Freer propose a force toward future path diversity [90]. Its causal temperature is not a bath temperature, so its units are not joules. Kappen's comment critiques it [91].

## 4. Layer 2. The kinematic laws of agency

Once an act is eligible, physics bounds how fast agency moves per second and per joule, and what precision and speed cost. The bounds come in four families: speed limits, the TUR, finite-time costs and rate ceilings.

### 4.1 Proven

**Speed limits.** Shiraishi, Funo and Saito proved the classical speed limit in Section 2.2 [8]. Moving the agent's state distribution a distance $L$ in time $\tau$ costs entropy, and so joules. The bound extends to open quantum systems [92] and to strong coupling with general environments [93]. Vo, Van Vu and Hasegawa derived the speed limit and the TUR from one inequality [94]. Falasco and Esposito bounded the time to complete a transition by the dissipation spent [95]. Ito bounded the information-geometric speed of a distribution by entropy production [96]. Ito and Dechant bounded the rate of change of any observable by Fisher information and dissipation [97]. Nakazato and Ito bounded entropy production by the Wasserstein distance traveled [98]. Dechant, Sasa and Ito split entropy production into the part that moves the system and the part that keeps it running [99]. Van Vu and Saito unified the TUR, minimum dissipation and speed limits through optimal transport [100]. Nagayama, Yoshimura and Ito derived a family of speed limits indexed by generalized means of activity [101]. Yoshimura and Ito proved the TUR and the speed limit in deterministic chemical reaction networks [102]. Aurell, Mejía-Monasterio and Muratore-Ginanneschi solved minimal finite-time dissipation as an optimal transport problem [103]. The kinematic laws form one family. The cheapest way to move an agent's state is a transport map.

**Precision costs dissipation.** Barato and Seifert stated the TUR, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma$ [10]. A reliable agent pays for its reliability. From $2/\epsilon^2$ at $\epsilon = 0.01$, precision of 1% costs at least 20,000 $k_B T$ [104]. Gingrich, Horowitz, Perunov and England proved the TUR for all steady-state currents [11]. Horowitz and Gingrich proved it for finite observation times [105], which is what agents have. Further results bound the full distribution of fluctuations [106], cover discrete time steps [107], extend the TUR wherever a fluctuation theorem holds [108], and cover Langevin dynamics, underdamped motion and velocity feedback [109, 110, 111]. Correlations between currents tighten the bounds [112]. Potts and Samuelsson showed that any fluctuation relation implies a TUR, including with measurement and feedback [13]. This is the precision law for agents. A review states the field [113]. Barato and Seifert priced the precision of a clock [114]. Salazar bounded entropy production by information from the detailed fluctuation theorem [115]. Landi and Paternostro reviewed entropy production from classical to quantum [116].

**Finite-time costs.** Schmiedl and Seifert found optimal finite-time protocols, with jumps at the ends [117]. The optimal act at finite speed is not the slow act. Sivak and Crooks bounded excess work by the squared thermodynamic length over the duration [15]. Proesmans, Ehrich and Bechhoefer found the minimal cost of erasing a bit in time $\tau$ [14, 118]. The Layer 1 floor becomes a Layer 2 curve. Zhen and colleagues stated a universal finite-time bound on reset energy [119]. Speed and efficiency trade against each other by theorem: efficiency at maximum power [120, 121], finite power forbidding Carnot efficiency [122], a three-way trade among power, efficiency and constancy [123], and a universal constraint for low-dissipation engines [124]. Tsirlin and colleagues found minimal dissipation at a fixed rate [125].

**Rate ceilings.** Margolus and Levitin bounded orthogonal transitions per second by energy [16]. Lloyd applied the limit to a whole computer [126]. Deffner and Campbell reviewed the family of quantum speed limits [127].

**Living sensors.** Energy dissipation, adaptation speed and accuracy are bound together in bacterial chemotaxis [128]. Learning about the environment requires energy [129], and inference accuracy is tied to dissipation [130]. Sensing precision is limited by receptors, time and energy, with an optimal allocation among them [131]. No resource can be skipped. That fits Mixture of Limits. Erasure inside adaptation has a cost [132]. Information acquired per energy dissipated is the nearest existing quantity to $v_J$ in living sensors [133, 134]. Copying information costs energy [135]. Writing the receipt has a price. Accurate and synchronized biochemical clocks cost free energy [136, 137], and so does reducing noise at high sensitivity [138]. Holding a system away from equilibrium has a minimum power [139]. That is the standing cost of an agent ready to act.

**Information rates without joules.** Schreiber defined transfer entropy, directed information flow per step [140]. It is per time, not per joule, and it has no eligibility gate. Tishby and Polani charged information per step in a Bellman recursion [141]. Landauer converts those bits to joules. Stratonovich bounded the maximal gain from a given amount of information [142]. That is a ceiling on value per coupled bit.

### 4.2 Demonstrated

**The TUR tested.** A two-qubit NMR experiment obeyed generalized TURs and violated the specialized TUR where theory predicts [143]. An optical tweezer information engine violated the original TUR near maximal efficiency and obeyed generalized bounds with mutual information [12]. Agents need the feedback form. A quantum dot Szilard engine confirmed it independently [144]. Atomic-scale conductors examined the TUR with measured current noise, the physics of every chip [145]. Molecular motors were scored by precision per unit dissipation [146]. Observed current fluctuations bound dissipation from below [147]. A receipt of fluctuations is a lower-bound meter for joules.

**Speed limits and finite-time costs tested.** Single atoms in an optical lattice showed the Mandelstam-Tamm and Margolus-Levitin bounds and the crossover between them [148]. The rate ceiling is measured. A trapped colloid measured time and entropy trade-offs for fast thermal transitions [149]. Brownian particles driven by optimal transport protocols saturated the minimal finite-time dissipation bound [150]. The kinematic optimum is reachable. A feedback trap measured a two-force Brownian machine against linear response bounds [151]. A photonic experiment tested geometric bounds on entropy production [152].

**Heat engines at finite speed.** A single colloid ran a micrometer Stirling engine [153]. A trapped bead ran a Brownian Carnot cycle with efficiency at maximum power measured [154]. The energy cost of choosing one of two options was measured [155]. That is the smallest act. A colloidal engine ran on an active bacterial bath [156], and engineered noise gave near-Carnot efficiency at finite power by shortening relaxation [157]. Engineering activity moves the bound. An information engine flipped from refrigerator to heater with noise [158]. The receipt must record the regime, not only means.

**Empowerment in simulation.** Klyubin, Polani and Nehaniv defined empowerment, the channel capacity from actions to future sensors [159]. It was computed for continuous control [160] and reviewed [161]. It measures how much an agent can move the world, in bits. It is not a rate per joule.

### 4.3 Opinion

Kinematics is mostly theorem and experiment. The opinions here concern which variable is right. Seifert holds that inference from fluctuations is the route to hidden costs [104]. Rovelli and Wissner-Gross and Freer both propose entropic kinematics [87, 90]. Kolchinsky shows that dissipation alone does not bound how fast replicators grow or decay [162]. Rates are bounded by dissipation together with activity. That is the form of the speed limit, where $\langle A\rangle$ sits beside $\Sigma$.

## 5. Layer 3. Intelligence as the calculus of agency

Intelligence is the derivative of gated agency in joules, read off a completed run. This layer needs three things from the literature: theory that ties learning and decision to joules, measurement of joules per unit of useful work, and positions on what intelligence is.

### 5.1 Proven

**Learning and prediction priced in joules.** Goldt and Seifert bounded the information a learning network acquires by the entropy it produces [163]. Learning efficiency is at most one. This is $\iota$ for the learning part of an act, with a ceiling. Still showed that optimal memory keeps only predictive information [164]. The marginal joule spent on memory must buy prediction. Boyd, Crutchfield and Gu proved that the agent that extracts the most work from data has the maximum-likelihood model of that data [165]. Better models yield more work per joule. Boyd, Crutchfield, Gu and Binder stated overfitting and generalization as energetics [166]. Generalization appears as joules. Ehrich, Still and Sivak priced the controller itself, beyond the information it uses [167]. So $J$ must be metered at the wall of the whole system. Ehrich and Sivak gave the ledger of energy and information flows in autonomous machines [168]. Wolpert reviewed computation costs beyond Landauer [169]. Levy and Baxter showed that neural codes that maximize bits per unit energy differ from codes that maximize bits [170]. The right objective for a brain is information per joule.

**Decisions and bounded optimality.** Russell and Subramanian defined bounded optimality: the best program for a given machine and environment [171]. Here the resource is joules, and the optimum is $\arg\min J$ subject to $X \ge X_{\mathrm{req}}$. Genewein and colleagues derived abstraction and hierarchy from utility minus information cost [172]. Mixture of Limits gears are such a hierarchy. Legg and Hutter defined intelligence as complexity-weighted expected reward over all computable environments [173]. It is an integral, but over reward, without energy, and uncomputable. The derivative in joules replaces reward with confirmed coupled bits and the measure with metered joules. Takahashi and Hayashi define empowerment per joule from stochastic thermodynamics [174]. It is the closest existing calculus in joules. It has no law gate in front of it.

### 5.2 Demonstrated

**Brains.** Laughlin, de Ruyter van Steveninck and Anderson measured the energy cost per bit in blowfly photoreceptors and interneurons [175]. Higher information rates cost more per bit. That is a measured $\iota$ in a living agent and a measured diminishing return, $\alpha_J < 0$ in sensing. Attwell and Laughlin built the energy budget of grey matter by process [176]. Lennie showed that energy limits how many cortical neurons can be active at once [177]. Energy is the constraint, and the rest adapts. Energy per action potential differs widely across neuron types [178]. Same function, different joules. Neural design follows energy efficiency [179].

**Machines.** Memory access costs far more energy than arithmetic [180]. Parameter count matters only through the joules it makes you move. Intelligence per watt measures task accuracy per unit power on local accelerators [181]. Its numerator is benchmark accuracy, not gated agency. MLPerf Power standardizes power measurement from microwatts to megawatts [182]. ML.ENERGY measures inference energy automatically [183]. TokenPowerBench benchmarks the power of large language model (LLM) inference [184]. Jin, Wei and Brooks analyze the energy of test-time compute [185]. General-purpose models cost much more energy per task than task-specific ones [186]. The cheapest sufficient model wins in joules. That is Mixture of Limits, measured.

**Meters.** RAPL (Running Average Power Limit) is the set of on-die energy counters in Intel and AMD processors. Its readings were validated against external measurement [187]. DRAM (dynamic random-access memory) readings were validated separately [188]. Meter quality depends on the processor generation [189]. Apple's powermetrics manual states that its average power values "are estimated and may be inaccurate" and should not be used to compare devices [190]. On Apple silicon, powermetrics readings are reported values. Measured joules for that machine come from an external wall meter.

**Compression scored.** The Hutter Prize scores lossless compression of the first gigabyte of an English Wikipedia dump, with a prize fund of 500,000 euros and limits on runtime and memory [191]. It bounds time and memory, never joules. A joule cap would make it a calculus-of-agency benchmark for one task class.

**Estimates.** These sources are valuable, and their joule figures are modeled, extrapolated or computed. They sit beside measured joules, never in their place. Estimates are never `measured_j`. Strubell, Ganesh and McCallum sampled power for short runs and extrapolated to full training of natural language processing models [192]. Patterson and colleagues computed training energy from reported hardware, runtime and data-center data [193]. Lacoste and colleagues built a calculator from hardware type, runtime and region [194]. The BLOOM footprint mixes metered and modeled inputs [195]. Carbontracker reads on-device counters and predicts full-run totals [196]. Its predictions are estimates.

### 5.3 Opinion

Each position is placed against the definition: intelligence is the derivative of gated agency in joules, read off a completed run.

- Schmidhuber treats intrinsic reward as compression progress, a first derivative of how well an agent compresses its history [197]. It is the closest precedent for intelligence as a derivative read from a run. Its variable is compression, not joules.
- Chollet defines intelligence as skill-acquisition efficiency over priors and experience, with the ARC (Abstraction and Reasoning Corpus) benchmark [198]. It is a ratio. Its denominator is information and data, not joules.
- Hernández-Orallo builds universal psychometrics across species and machines [199]. It evaluates by tasks. This track evaluates by joules to close tasks.
- Gershman, Horvitz and Tenenbaum define intelligence as expected utility net of computation cost [200]. This track makes the cost joules.
- Lieder and Griffiths treat cognition as optimal use of limited resources [201]. It is close to Mixture of Limits. The resource is left abstract.
- Balasubramanian reads the brain's design through its energy limits [202].
- Silver, Singh, Precup and Sutton hold that reward is enough [203]. Reward is chosen by a designer. Joules are read off a meter. Vamplew and colleagues reply that scalar reward cannot express multi-objective goals [204]. This track keeps one variable, joules, and moves multiplicity into the gate $X \ge X_{\mathrm{req}}$.
- Hafez and colleagues define agency and intelligence together [205]. It is not joule-native.
- Karagoz makes energy self-sustainment the objective [206]. It has no prediction gate, no kinematics and no joule ranking across systems.

### 5.4 Where the calculus stands

- **Proven:** learning, memory, prediction and control each have a joule price with a ceiling.
- **Demonstrated:** joules per bit are measured in brains. Joules per task are measured in machines. Meters can be validated.
- **Missing everywhere:** no source reads intelligence as $dX/dJ$ off a gated, completed run. That is David's contribution and the work of this track.

## 6. Global findings, by method

The search ran in Russian, Chinese, Japanese, German, French, Spanish, Portuguese, Korean, Italian, Polish, Hindi and Arabic, with English follow-ups. Results are organized by method and class of result. Language is metadata only. No entry is ranked by where it came from.

### 6.1 Theorems and reviews: information has a thermodynamic price

- Poplavskii gave an early systematic treatment of the energy cost of acquiring and processing information [207]. Written in Russian, with an English translation. Layer: law.
- Stratonovich proved value-of-information theorems [142]. English edition of a Russian monograph. Layer: kinematics.
- Ito and Sagawa applied information thermodynamics on networks to E. coli chemotaxis. Transfer entropy bounds robustness, and information-thermodynamic efficiency is high where ordinary thermodynamic efficiency is low [208]. Written in Japanese. Layers: law and kinematics.
- Sun and Quan reviewed Maxwell's demon and the physical floor on dissipation in information processing [209]. Written in Chinese. Layer: law.
- Quan, Dong and Sun reviewed mesoscopic thermodynamics: the demon is consistent with the second law once erasure is counted, and power-efficiency constraints were tested [210]. Written in Chinese with an English abstract. Layers: law and kinematics.
- Parrondo's encyclopedic review gives the current account of information as a thermodynamic resource [211]. Layer: law.
- Strasberg's doctoral thesis tests common assumptions in information thermodynamics with physical models [212]. Written in English with a German abstract. Layer: law.
- Further theorems surfaced through searches in Japanese, Russian, Chinese, Korean, Portuguese, Italian and Polish: speed limits and TURs in chemical networks [102, 97, 101], finite-time thermodynamics [125, 124, 121], Langevin TURs [110, 111], information bounds on entropy production [115, 116], and single-shot work costs [19].

### 6.2 Experiments: the price measured

- Dago's doctoral thesis reports 1-bit erasure and writing near the minimal energy at high speed on an underdamped micro-cantilever [213]. Written in French. Layer: the law's floor reached at kinematic speed.
- Lagoin's doctoral thesis builds macroscopic Maxwell's demons, including a Szilard engine, from a vane in a granular gas [214]. Written in French. Layer: law. The demon's accounting holds outside the microscopic regime.
- Ciampini and colleagues used extractable work to witness quantum correlations in a photonic experiment [215]. Layer: law.
- Experiments surfaced through searches in Korean, Portuguese, Hindi, Italian, Spanish, Chinese and Japanese: information engines [57, 12], NMR demons [51, 52], the TUR on qubits [143], active-bath engines [156, 157], geometric bounds [152], symmetry breaking and Carnot cycles [155, 154], trapped-ion demons [44, 65], and feedback conversion and optimal transport [47, 54, 150].

### 6.3 Theory of functional systems: prediction before the act

The Anokhin school states clauses 1 and 3 in physiological terms. A result template, the acceptor of action results, is formed before the act, compared after it, and the comparison reorganizes behavior. These works were found through Russian-language searches.

- Anokhin's functional system [70, 71].
- Sudakov on the result as the system-forming factor and on probabilistic prediction of behavior [72, 216, 217, 218].
- Shvyrkov on goals organizing neuronal activity and on learning as selection of neuronal systems [73, 219].
- K. V. Anokhin on the brain's cognitive structure as a hypernetwork of functional-system elements [220].
- Saltykov and Grachev on the system-forming factor as anticipation [221].
- Vityaev on purposefulness formalized as rule learning that predicts results [222].

**Implemented and run.** Cognitive architectures built on functional-system theory form result templates, compare, and learn subgoals, in simulation and on a physical robot [223, 67, 68, 224, 225]. None meters joules. Adding a meter to one of these agents would test the full order of law, kinematics and calculus on an existing implementation. Differentiable probabilistic logic networks are related calculus tooling, not built on functional systems, with no law gate and no joules [226].

### 6.4 Autonomy, organization and minimal agency

Found through Spanish, French and German searches. Agency is a self-maintaining organization that regulates its interactions [82, 81, 78, 79, 80, 77]. The organization is a closure of constraints on thermodynamic flows [83]. The autonomy school has stepped into stochastic thermodynamics [84]. Layer: law, as the organization that must exist before any act counts.

### 6.5 Measured joules for machine intelligence

Found through Chinese-language searches on inference energy: automated inference energy measurement [183], per-token power benchmarks [184], and the energy of test-time reasoning [185].

### 6.6 Philosophy of agency

Rovelli's physics of agency surfaced through German [87]. Jaeger and Azadi complete the set of position papers [88, 89].

### 6.7 Searches with no primary research

Hindi and Arabic searches returned no primary research in those languages. English follow-ups surfaced work from Indian institutions, listed above by method.

## 7. Open problems

### 7.1 What must be proven

**P1. The run path is well defined.** For any run with metered power $P(t) > 0$, $X$ is a function of cumulative joules $J$, and $\iota = dX/dJ$ exists almost everywhere. In hand: $E_k \in \{0,1\}$, $m_k \in \{0,\mu,1\}$ and $I \ge 0$, so $X$ never decreases. A monotone function is differentiable almost everywhere by Lebesgue's theorem. $P > 0$ makes $J(t)$ strictly increasing. Missing: convergence of $\iota_k = \Delta X_k/\Delta J_k$ to $\iota$ as meter sampling refines, with an error term set by meter resolution and sampling interval.

**P2. Agency-gated Landauer bound.** Under closed-cycle accounting, each confirmed coupled bit costs at least $k_B T \ln 2$, so $v_J \le 1/(k_B T \ln 2)$. In hand: measurement plus erasure work is at least $k_B T I$ [5], and erasure costs at least $k_B T \ln 2$ per bit [6, 7]. Missing: a data-processing step showing that the coupled bits credited in $X$ cannot exceed the bits recorded in the acceptor's memory during the comparison. Clause 3 already requires the confirmation $m$ to come from a physical record.

**P3. Agency speed limit.** The time and dissipated joules to close act $k$ are bounded below by a function of the coupled bits it confirms. In hand: the speed limit and its joule form [8], and Pinsker's inequality, $D_{\mathrm{KL}}(p\|q) \ge \tfrac12 \|p-q\|_1^2$ in nats, where $D_{\mathrm{KL}}$ is the Kullback-Leibler divergence. Missing: a lower bound on the $L_1$ displacement of the joint agent-world distribution in terms of $I(\mathrm{do}(a); W')$. That needs a reverse inequality under stated conditions, such as a floor on the smallest state probability.

**P4. Precision law for agents.** $\mathrm{Var}(X)/\langle X\rangle^2$ over a run is bounded below by a function of entropy production and the information used in feedback. In hand: the standard TUR fails for feedback agents in experiment [12], and the feedback form holds [13]. Missing: whether $X$ is a time-antisymmetric current, or which current it bounds, and the feedback TUR written in the receipt's variables.

**P5. Hindsight theorem.** $\iota$ is a function of the completed receipt only. No pre-run quantity fixes it. In hand: each $m_k$ compares an outcome to a prediction fixed before the act, so $m_k$ is unknown before act $k$ closes. Missing: a construction of two worlds that agree on everything a pre-run predictor sees and differ in some $m_k$. With P1, this makes "intelligence is read off the completed run" a theorem.

**P6. Ranking survives meter error.** If $J^*_{S_1}(q) < J^*_{S_2}(q)\,(1-\epsilon)/(1+\epsilon)$, with $\epsilon$ the meter's relative error bound, then $S_1 \succ_q S_2$ under any reading within that error. In hand: direct from the definition. Missing: validated $\epsilon$ for each meter [187].

**P7. Mixture of Limits optimality.** The cheapest-sufficient rule tries gears from cheapest up, stops at the first gear whose output passes $C(z)$, and refuses with a receipt if the next gear would break the budget. It achieves the joule minimum up to the cost of failed attempts. In hand: if sufficiency is monotone in gear order and gear costs rise with order, the first sufficient gear is the cheapest sufficient gear. Missing: a regret bound when sufficiency is not monotone, and the conditions under which this rule and the σ-law selector, $a^* = \arg\max[H(a) - \lambda J(a)]$ subject to $J \le B$, choose the same act.

**P8. When agency compounds.** Conditions under which $\alpha_J > 0$ over a run, so that earlier receipts lower the joules of later closures. In hand: an earlier OpenIE toy run found $\alpha_J \le 0$ on near-optimal tasks. Missing: a model of reuse in which stored receipts cut later $J$ by more than the storage and lookup joules. Still gives the memory cost side [164].

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

- **RAPL.** Read the counter before and after each act. Handle wraparound. Validate against M0 on a calibration workload [187, 188].
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

### 8.8 Reporting

Publish all receipts, raw meter traces, idle baselines and analysis code with the result. Report measured, reported and estimated joules in separate columns. Never sum across tiers. State which falsifiers fired, with the same prominence as those that passed.

### 8.9 Where the products sit

- **Klere** is the hardware that meters $J$. M0 and M1 stand in for it until Klere meters are on the bench.
- **Metabolic Intelligence** runs the arms on any fabric and computes $\iota$ from receipts.
- **Notational Intelligence** is the receipt format in Section 8.5.
- **Mixture of Limits** is the philosophy and the rival rule in arm 2.

## 9. Who else is working on this

This pass looked for the people, groups and programs working on any part of the order. That covers a law or formal definition of agency, the thermodynamics of agents, joules per decision, and intelligence as a rate. Results are organized by method and class of result. Language is metadata only. Each entry says what it gives the law, the kinematics or the calculus, and where it stops.

### 9.1 Formal definitions of agency

- Kenton, Kumar, Farquhar, Richens, MacDermott and Everitt gave a causal definition of agents: systems that would adapt their policy if their actions influenced the world in a different way. From it they derived an algorithm that discovers agents from interventional data [227]. Method: causal modeling, definition and algorithm. This is clauses 2 and 3 in causal form. It has no joule term and no receipt.
- Richens and Everitt proved that any agent that meets a regret bound under a large set of distributional shifts has learned an approximate causal model of the process that generates its data [228]. Richens, Abel, Bellot and Everitt proved that any agent that generalizes to multi-step goal-directed tasks has learned a predictive model of its environment, and that the model can be extracted from the policy [229]. Method: theorem. These are modern good-regulator results [22]. They support clause 1: a capable agent carries a prediction. They have no joules.
- MacDermott, Fox, Belardinelli and Everitt defined maximum entropy goal-directedness (MEG), a measure computed from causal models [230]. Method: definition with proofs. It scores how goal-directed a policy is. It does not gate an act or price it.
- Orseau, McGregor McGill and Legg define agent and device relative to an observer, by Bayesian comparison of two descriptions of the same behavior [231]. Method: formal definition. The label depends on the observer's priors. The law needs a test with no observer in it (Section 10, G1).
- Biehl and Virgo call a system an agent when it can be interpreted as solving a POMDP (partially observable Markov decision process): its states map to beliefs that update by Bayes' theorem, and its actions are optimal for those beliefs [232]. Virgo, Biehl and McGregor gave the consistency conditions for reading a system as a Bayesian reasoner [233]. Both build on McGregor's Bayesian stance [234]. Method: formal definition, with category theory. This is the closest formal account of clause 1. It has no physical floor.
- Barzegar, Margoni and Oriti give a minimalist, scalable account of agency in physics. It sits between strong accounts, such as Tononi's, and weak accounts, such as Rovelli's [235]. Method: philosophy of physics.
- Bartlett, Eckford, Egbert, Lingam, Kolchinsky, Frank and colleagues make goal-directed information processing, measured by semantic information, the distinctive feature of living systems [236]. Method: perspective built on Kolchinsky and Wolpert [35]. It points at the law. It stops before kinematics.
- Crutchfield and Jurgens built information theory for memoryful agents that interpret structured environments in real time [237]. Method: theorem. It describes the information series a receipt would carry. It has no joules.
- De Bari, Dixon, Kondepudi and Vaidya ground goal-directed behavior in thermodynamics, with experiments on driven dissipative systems [238]. Perunov, Marsland and England derived how driven matter adapts through dissipation [239]. Method: theory and experiment. Both tie purpose to energy flow. Neither has a prediction clause.
- Levin's TAME (Technological Approach to Mind Everywhere) treats agency as a graded property that experiments can test at every scale [240]. Lyon, Keijzer, Arendt and Levin set out the basal cognition program [241]. Method: framework with experiments in development and regeneration. It is the largest experimental program on minimal agency. It does not meter joules per act.
- Barandiaran and Almendros tested large language models against the individuality, normativity and interactional asymmetry conditions. They conclude that a model fails the first two and partly fails the third, so it is not an autonomous agent in that sense [242]. Method: philosophy. This is a gate applied before any agency claim, as clauses 1 to 4 are.

### 9.2 Who is the agent: boundaries and interpretation

- Bruineberg, Dołęga, Dewhurst and Baltieri separate two uses of the Markov blanket: a tool for Bayesian inference, and a claim about the physical boundary between an agent and its world. The second use needs assumptions the first does not [243]. Method: conceptual analysis.
- Aguilera, Millidge, Tschantz and Buckley tested the FEP (free energy principle) in the simplest case, weakly coupled linear stochastic systems. The Markov blanket condition and the restrictions the FEP needs hold only in a narrow range of parameters [244]. Method: derivation and computation.
- Biehl, Pollock and Kanai showed that the definitions of Markov blanket used across the FEP literature are not equivalent. They gave counterexamples to the original free energy lemma [245]. Method: proof by counterexample.
- The FEP side states its case in [246, 247, 248, 249]. Method: theory. Its boundary is statistical, and its free energy is not joules [85].
- Rosas, Mediano, Biehl, Chandaria and Polani defined causal blankets, which are found from data with no steady-state or Markov assumption. They proved that every bipartite stochastic process has one [250]. Method: theorem and algorithm. It is the most usable boundary tool for receipts.
- Krakauer, Bertschinger, Olbrich, Flack and Ay define individuals as aggregates that propagate information from their past into their future [251]. Bertschinger, Olbrich, Ay and Jost gave an information-theoretic account of autonomy [252]. Method: information theory on graphical models. The boundary is found, not drawn.
- IIT 4.0 (integrated information theory) takes as the system the set of elements with maximal integrated cause-effect power [253]. Hoel, Albantakis and Tononi showed that a macro description can carry more causal power than the micro one [254]. Method: theory. The boundary comes from a maximum. It has no joules.
- Adams and Aizawa argue that cognition stays inside the organism and does not extend into its tools [255]. Seth and Tsakiris ground selfhood in predictive regulation of the body [256]. Sterling defines allostasis as predictive regulation [257]. Method: philosophy and physiology. These place the boundary at the body. Clause 3 places it at the system that bears the consequence.

### 9.3 Coupling: causal and information measures

- Ay and Polani defined causal information flow through interventions [258]. For one act it is the mutual information between the intervened act and the outcome, which is $I(\mathrm{do}(a); W')$ in clause 2. Empowerment is its maximum over act distributions [159]. Method: definition with proofs.
- Janzing, Balduzzi, Grosse-Wentrup and Schölkopf derived a measure of causal strength from postulates [259]. Method: theorem.
- James, Barnett and Crutchfield showed by example that transfer entropy does not measure information flow [260]. Lizier and Prokopenko separated information transfer from causal effect [261]. Transfer entropy [140] is a rate of prediction, not of coupling. Clause 2 is written in the interventional measure.
- Albantakis, Marshall, Hoel and Tononi gave a quantitative account of actual causation for single transitions [262]. Juel, Comolatti, Tononi and Albantakis traced how much of an agent's action is caused from within [263]. Albantakis compared measures of autonomy [264]. Marshall and colleagues used causal analysis to find autonomy in biological network models [265]. Albantakis and colleagues analyzed a macro agent and its actions [266]. Method: theory and simulation. Actual causation is computed per act. So is the receipt.

### 9.4 Thermodynamics of agents, feedback and learning

- Fiderer, Barth, Smith and Briegel defined the work capacity of an environment channel: the maximum rate at which any agent can expect to extract work in a percept-action loop. Work-efficient agents must balance prediction against forgetting [267]. Method: theorem. It is the closest existing result to a kinematic law of agency in a closed loop. Its numerator is extracted work, not confirmed coupled bits.
- Hartle, Wolpert, Stier, Kempes and Manzano priced feedback with noisy measurements, limited memory and a limited repertoire of protocols. The benefit of feedback over random action can exceed the information gain by orders of magnitude [268]. Method: theory.
- Kamijima, Funo and Sagawa derived the finite-time costs of information processing and the trade-offs between measurement and feedback, using Pareto optimization and the Wasserstein distance [269]. Method: theorem.
- Kolchinsky and Wolpert showed how constraints on the available protocols limit extractable work and the value of information [270]. Wolpert and colleagues set out a program for the energy costs of real computers [271]. Results cover stochastic halting times [272], uncertain thermodynamic parameters [273] and circuits [274]. Method: theorem. These price computation. They do not gate acts.
- Sandberg, Delvenne, Newton and Mitter bounded work extraction by nonequilibrium demons, implementation costs included [275]. Horowitz and Sandberg compared the second-law inequalities that carry information [276]. Still gave information theory for interactive learning [277] and for curiosity-driven learning [278]. Method: theorem.
- Fields, Goldstein and Sandved-Smith separated thermodynamic free energy, in joules, from variational free energy in active inference agents, and stated the trade-off between them [279]. Method: theory. This brings joules into active inference.
- Goerlich, Hoek, Chor, Rahav and Roichman reviewed information engine experiments and the next steps: active, many-body and inertial systems, and optimal control [280]. Cocconi and Chen analyzed an autonomous information engine on a single active particle [281]. Method: review and theory.
- Goldt and Seifert bounded the thermodynamic efficiency of learning a rule [282]. Tkachenko showed, for physical neural networks, that quasi-static inference needs no work and that finite-speed work is bounded below by a transport distance [283]. Method: theorem, preprint. Inference has no floor at zero speed and a floor at finite speed. That is the shape of Layer 2.
- Tatikonda and Mitter [284] and Nair and Evans [285] proved the data-rate theorem: holding an unstable linear system needs a channel rate above the sum of the base-2 logarithms of its unstable eigenvalue magnitudes. Nair, Fagnani, Zampieri and Evans reviewed the field [286]. Method: theorem. It is a floor in bits per step for holding a goal against an unstable world. With Landauer it becomes a candidate floor in joules (Section 10, G6).

### 9.5 Kinematics since the first pass

- **Feedback TUR.** Van Vu and Hasegawa derived TURs under arbitrary control protocols [287]. Tanogami, Van Vu and Saito extended the TUR to a subsystem, with information flow beside entropy production, and derived trade-offs between power and efficiency for information engines [288]. Honma and Van Vu derived a finite-time TUR for open quantum systems under continuous monitoring and Markovian feedback, in terms of entropy production and quantum mutual information [289]. Kumasaki, Tojo, Sagawa and Funo derived a TUR for feedback cooling [290]. Hasegawa gave a quantum TUR for continuous measurement [291]. Method: theorem. The feedback TUR now exists in classical and quantum form. Writing it in the receipt's variables is P4.
- **Speed limits.** Hasegawa unified the speed limit, the TUR and the Heisenberg principle [292]. Van Vu and Hasegawa bounded irreversibility by a modified Wasserstein distance [293]. Delvenne and Falasco bounded entropy production by kinetic statistics [294]. Method: theorem.
- **Finite-time Landauer.** Lee, Lee, Kwon and Park found a tight finite-time Landauer bound [295]. Van Vu and Saito added quantum coherence [296]. Rolandi and Perarnau-Llobet went beyond weak coupling [297]. Dago and Bellon measured the overhead of fast erasure and modeled where it comes from [298]. Fujimoto and Ito found the minimum entropy productions of interacting subsystems by a game-theoretic method [299]. Method: theorem and experiment.
- **First passage.** Gingrich and Horowitz [300] and Garrahan [301] bounded first-passage-time fluctuations by dissipation. Neri, Roldán and Jülicher gave the statistics of stopping times of entropy production [302]. Method: theorem. $J^*(X_{\mathrm{req}})$ is a first-passage quantity, so these bounds apply to it.

### 9.6 Collective agency

- Wolpert bounded the minimal entropy production rate of interacting subsystems by their network of dependencies [303]. He gave uncertainty relations and fluctuation theorems for Bayes nets [304]. Tasnim and Wolpert extended the theory to co-evolving systems [305]. Method: theorem.
- Rolandi, Abiuso and Perarnau-Llobet showed that collective protocols can sharply reduce the dissipated work of an N-body system [306]. Method: theorem. A collective act can cost less per member.
- Crosato and colleagues [307] and Chen and Prokopenko [308] found that thermodynamic efficiency, the predictability gained per unit of energy cost, peaks near criticality in models of collective behavior. Method: theory and simulation. This is the closest collective analog of $\iota$.

### 9.7 Quantum agents

- Adlam, McQueen and Waegell argue that a purely quantum system cannot be an agent. Building a world model and deliberating need copying, which the no-cloning theorem forbids, so agency needs classical resources [309]. Method: argument from theorems, preprint. Clause 3 already requires a classical record of $m$.
- Elliott, Gu, Garner and Thompson showed that quantum adaptive agents can need far less memory than classical ones [310]. Saggio and colleagues demonstrated a quantum speed-up for learning agents in a photonic experiment [311]. Method: theorem and experiment.
- Guryanova, Friis and Huber proved that ideal projective measurements need infinite resources [312]. Danageozian, Wilde and Buscemi gave a three-way thermodynamic trade-off for quantum information gain and error correction [313]. Jacobs [314] and Funo, Watanabe and Ueda [315] gave the second law and fluctuation theorems under quantum feedback. Linpeng and colleagues measured the energetic cost of measurement with quantum, coherent and thermal light [316]. Marín Guzmán and colleagues set criteria for useful autonomous quantum machines [317]. Lipka-Bartosik, Perarnau-Llobet and Brunner computed with autonomous quantum thermal machines [318]. Method: theorem and experiment.

### 9.8 Joules per decision in living systems

- Mattingly, Kamino, Machta and Emonet measured how fast E. coli acquires information during chemotaxis. Cells decide with much less than one bit, yet climb gradients within a factor of two of the bound set by their information rate [319]. Method: experiment and theory. This measures bits per decision.
- Tjalma and colleagues showed that the bits of the past that best predict the future are prohibitively costly for cellular networks [320]. Bryant and Machta bounded the energy of sending a bit through the physical channels of a cell, in $k_B T$ per bit [321]. Method: theorem.
- Padamsey, Katsanevaki, Dupuy and Rochefort found that food restriction cut synaptic ATP (adenosine triphosphate) use in mouse visual cortex by 29% and broadened orientation tuning by 32% [322]. Method: experiment. Fewer joules bought less precision, measured.
- Plaçais and Preat showed that starved flies disable costly aversive long-term memory. Forcing it back restored the memory and reduced survival [323]. Plaçais and colleagues found that long-term memory formation needs raised energy flux in the mushroom body [324]. Mery and Kawecki found that forming long-term memory lowered flies' resistance to desiccation [325]. Method: experiment. Learning has a measured metabolic price.
- Hechler, de Lange and Riedl measured cortical oxygen consumption during predictable and unpredictable visual input. Confident prediction saved up to 12% of cortical energy [326]. Method: metabolic imaging, preprint. Prediction saves joules.
- Levy and Calvert audited the energy of the human cortex: communication costs 35 times as much as computation [327]. Harris, Jolivet and Attwell budgeted synaptic energy [328]. In the visual pathway, synapse size maximizes information per unit energy, not information [329]. Niven and Laughlin [330], Balasubramanian, Kimber and Berry [331], and Sterling and Laughlin [332] set energy as the design constraint. Malkin and colleagues derived signatures of Bayesian inference from energy-efficient synapses [333]. Li and van Rossum showed that naive synaptic plasticity costs extreme energy and proposed synaptic caching [334]. Method: experiment and theory.
- Lynn and colleagues measured broken detailed balance in the human brain from neuroimaging. It rises with physical and cognitive exertion [335]. Lynn, Holmes, Bialek and Schwab decomposed the local arrow of time in interacting systems [336]. Method: inference from recordings. This entropy production is informational and coarse-grained. It is not a joule meter.

### 9.9 Joules per inference in machines

- NeuroBench is a common framework for benchmarking neuromorphic algorithms and systems [337]. Davies and colleagues surveyed results on the Loihi neuromorphic chip [338]. Method: benchmark and measurement.
- Samsi and colleagues benchmarked the energy of LLM inference [339]. Elsworth and colleagues report a median of 0.24 Wh per Gemini Apps text prompt, counting accelerators, hosts, idle capacity and data-center overhead [340]. Method: operator instrumentation. It is a figure the operator reported. It is not `measured_j` under this track's meter rules.
- Melanson and colleagues built a small thermodynamic computer of 8 coupled RLC (resistor, inductor, capacitor) cells for sampling and linear algebra [341]. Stern and Murugan reviewed learning in physical systems without neurons [342]. Dillavou and colleagues demonstrated decentralized physics-driven learning [343]. Stern and colleagues measured a trade-off between power and error in self-learning circuits [344]. Method: hardware experiment.

### 9.10 Intelligence as a rate or an efficiency

- Hernández-Orallo and Dowe proposed an anytime intelligence test that adapts to the time available [345]. Method: formal measure.
- Chollet and colleagues report the ARC Prize 2024 competition [346] and the ARC-AGI-2 benchmark [347]. The ARC Prize leaderboard plots cost per task against score and calls it a key measure of efficiency [348]. The cost is in dollars. A joule meter would make it a calculus-of-agency benchmark.
- Chaisson proposes energy rate density, power per unit mass, as a complexity metric across cosmic evolution [349]. It is a rate in watts per kilogram, not joules per confirmed bit.
- Sims applies rate-distortion theory to perception [350]. Gottwald and Braun separate the two kinds of free energy [351]. Zénon, Solopchuk and Pezzulo cast the cost of cognition as information [352]. Ortega, Braun, Dyer, Kim and Tishby set out information-theoretic bounded rationality [353]. Method: theory. Their currency is information. Landauer converts it to joules.

### 9.11 Programs and groups

- The John Templeton Foundation program Agency, Directionality, and Function: Foundations for a Science of Purpose ran from 2021 to 2024 with 24 teams [354, 355]. Its successor, the Consortium for Advancing a Science of Purpose, runs from April 2026 to March 2031 [356]. Method: funded research program on formal models of agency and measures of goal-directedness.
- Groups, by method. Causal definitions of agents: Everitt, Richens, MacDermott, Kenton. Interpretation maps and blankets: Biehl, Virgo, McGregor, Rosas, Polani. Thermodynamics of computation and constrained feedback: Wolpert, Kolchinsky, Manzano, Korbel, Tasnim, Hartle. Percept-action thermodynamics: Briegel, Fiderer, Barth. Actual causation and autonomy: Albantakis, Tononi, Marshall. Basal cognition: Levin. Feedback TUR and speed limits: Sagawa, Funo, Ito, Van Vu, Hasegawa, Saito. Finite-time erasure: Bechhoefer, Bellon, Perarnau-Llobet. Cellular information and energy: Machta, Emonet, ten Wolde. Neural energy: Attwell, Laughlin, Rochefort, Preat, Levy, Balasubramanian. Machine joules: the NeuroBench, MLPerf Power [182] and ML.ENERGY [183] efforts. Intelligence as efficiency: Chollet, Hernández-Orallo.

### 9.12 Where the field stops

Every group above holds a piece of the order. Formal definitions of agency have no joules. Thermodynamics of feedback has no eligibility gate. Joule metering has no confirmed coupled bits. Rate measures count dollars, time or information. No group reads intelligence as $dX/dJ$ off a gated, completed receipt. The order of law, kinematics and calculus is David's.

**Search note.** This pass searched in English, Japanese, Chinese, Russian, German, French, Spanish, Korean, Persian, Turkish and Hebrew. Japanese and Korean searches surfaced the finite-time and game-theoretic information thermodynamics [269, 299]. Russian and German searches surfaced the minimalist account and the thermodynamics of behavior [235, 238]. Spanish searches surfaced autonomous quantum machines [317, 318]. Persian, Turkish and Hebrew searches returned theses, reviews and work already listed, with no new primary research. Portuguese, Italian, Polish, Hindi and Arabic were covered in the first pass (Section 6).

## 10. Gaps in our understanding

Each gap is stated as a result the order needs. For each: what is known, who is closest, the result that closes it, and whether that result is a proof or an experiment. They are ranked by how much of the order rests on them. Links to the open problems in Section 7 are given as P and D numbers.

| ID | Gap | Closing result | Type |
|---|---|---|---|
| G1 | Where the agent ends | A boundary theorem in the law's own terms | Proof |
| G2 | Which coupling measure | A uniqueness theorem for causal information flow | Proof |
| G3 | When $dX/dJ$ exists | A crediting rule plus the Radon-Nikodym theorem | Proof |
| G4 | Precision law for agents | A feedback TUR for the act-counting current | Proof, then experiment |
| G5 | Finite-time cost of one act | A bound on the joules of a full predict, compare and reset cycle | Proof, then experiment |
| G6 | Standing power to hold a goal | The data-rate theorem converted to joules | Proof, then experiment |
| G7 | Measured $\iota$ in a living agent | Bits and joules per decision in one preparation | Experiment |
| G8 | Collective agency | A composition theorem for $X$ and $J$ | Proof |
| G9 | Quantum agents | The Landauer floor for an agent with finite-resource quantum measurement | Proof, then experiment |
| G10 | Joule cost of prediction first | A theorem pricing clause 1 | Proof |

### G1. Where the agent ends

**Known.** $X$ needs an agent and a world. The Markov blanket boundary holds only in narrow conditions [244]. Its definitions differ across papers [245]. The inference tool is not a physical boundary [243]. One definition makes agency relative to an observer [231]. Rules that find a boundary exist: maximal integrated cause-effect power [253], information propagated from past to future [251], causal blankets found from data [250], and causal discovery of agents from interventions [227].

**Closest.** Rosas and colleagues, and Krakauer and colleagues.

**Closing result.** A boundary theorem in the law's own terms. Take as the agent the partition that maximizes confirmed coupled bits per joule over a run, among partitions in which the confirmation $m$ is recorded inside the agent (clause 3). Prove that the maximizer exists and is unique up to a stated equivalence, or state which coarse-grainings leave $X$ unchanged. Then run the rule on receipts.

**Type.** Proof, then an algorithm.

### G2. Which coupling measure

**Known.** $I(\mathrm{do}(a); W')$ is the causal information flow of Ay and Polani [258]. Empowerment is its maximum over act distributions [159], so

$$
I(\mathrm{do}(a); W') \;\le\; \max_{p(a)} I(\mathrm{do}(a); W') = \mathfrak{E}
$$

where $\mathfrak{E}$ is empowerment. Transfer entropy does not measure flow [260, 261]. Causal strength from postulates [259], actual causation per transition [262] and semantic information by scrambling interventions [35] are the other candidates.

**Closest.** Ay and Polani, and Janzing and colleagues.

**Closing result.** A uniqueness theorem. Fix the axioms: the measure is interventional and nonnegative, adds over independent acts, obeys data processing, and is priced by the measurement and erasure bound [5]. Prove that causal information flow is the only measure that meets them, up to units. Add the single-act form that credits act $k$ alone, linked to actual causation.

**Type.** Proof.

### G3. When $dX/dJ$ exists

**Known.** $X$ never decreases, so it is differentiable almost everywhere (P1). Acts are discrete. If each act's bits are credited at one instant, $dX$ is a sum of point masses. Metered joules have no point masses when power is finite. Then $dX$ is singular with respect to $dJ$, and $\iota$ exists only as a long-run ratio. Stochastic halting times are priced [272]. First-passage bounds exist [300, 301, 302].

**Closest.** Manzano and colleagues, for computations that stop at random times.

**Closing result.** Fix the crediting rule. Spread each act's credited bits over the joules metered during that act. Then K1, applied act by act, gives for every interval $A$ of the run

$$
X(A) \;\le\; \frac{J(A)}{k_B T \ln 2}
$$

So the measure $dX$ is absolutely continuous with respect to $dJ$. The Radon-Nikodym theorem then gives $\iota = dX/dJ$ as a function defined for almost every joule, with $0 \le \iota \le 1/(k_B T \ln 2)$. What remains: K1 per act (P2), a joule attribution rule for acts that overlap in time, convergence of the sampled $\iota_k$ as the meter refines (P1), and first-passage bounds on the spread of $J^*$.

**Type.** Proof. This is the gap closest to closure.

### G4. Precision law for agents

**Known.** The standard TUR fails for feedback agents in experiment [12]. Feedback forms exist: with measurement and feedback [13], under arbitrary protocols [287], for subsystems with information flow [288], for feedback cooling [290], and for quantum feedback [289].

**Closest.** Tanogami, Van Vu and Saito, and Honma and Van Vu.

**Closing result.** Write $X$ as a counting current over confirmed acts. Prove a lower bound on $\mathrm{Var}(X)/\langle X\rangle^2$ in terms of entropy production and the information flow used by feedback (P4). Test it on a feedback-trap information engine that counts confirmed acts.

**Type.** Proof, then experiment.

### G5. Finite-time cost of one act

**Known.** Finite-time erasure has tight bounds [14, 118, 119, 295], with quantum coherence [296] and beyond weak coupling [297]. The overhead of fast erasure is measured [45, 298]. Measurement and feedback trade against each other in finite time [269].

**Closest.** Kamijima, Funo and Sagawa, and Lee and colleagues.

**Closing result.** A bound on the joules of one complete act of duration $\tau_k$ that confirms $b_k$ bits. The target form is

$$
J_k \;\ge\; b_k\, k_B T \ln 2 \;+\; \frac{\mathcal{L}_k^2}{\tau_k}
$$

with $\mathcal{L}_k$ the thermodynamic length of the act's predict, compare and reset protocol in the sense of [15]. This turns K1 into a curve $v_J(\tau)$ for whole acts (P2, P3). Measure it on a feedback trap or a micro-cantilever that runs full act cycles.

**Type.** Proof, then experiment.

### G6. Standing power to hold a goal

**Known.** Holding an unstable linear system needs a channel rate above $\sum_i \log_2|\lambda_i|$ bits per step, summed over the unstable eigenvalues [284, 285, 286]. The entropy a controller removes is bounded by its mutual information with the system [23, 24]. Demons pay implementation costs [275].

**Closest.** Sandberg, Delvenne, Newton and Mitter.

**Closing result.** Prove that under closed-cycle accounting each channel bit the controller uses is recorded and later erased in its memory. Then each control step costs at least

$$
E_{\mathrm{step}} \;\ge\; k_B T \ln 2 \sum_{i:\,|\lambda_i| \ge 1} \log_2 |\lambda_i|
$$

This would be a new kinematic law: the minimum standing joules for an agent to hold a goal against an unstable world. Demonstrate it on a metered controller holding an unstable system.

**Type.** Proof, then experiment.

### G7. Measured $\iota$ in a living agent

**Known.** Bits per decision are measured in E. coli [319]. Energy per bit is measured in fly photoreceptors [175]. ATP saved by lowered precision is measured in mouse cortex [322]. The metabolic price of memory is measured in flies [325, 323, 324]. Oxygen saved by prediction is measured in humans [326]. Entropy production is inferred from neuroimaging [335].

**Closest.** Mattingly and colleagues for bits, and Padamsey and colleagues for joules.

**Closing result.** Bits and joules per decision measured act by act in one preparation. Candidates: E. coli chemotaxis with information rate measured as in [319] and per-cell energy use measured alongside; mouse visual discrimination with ATP imaging as in [322] and information per trial; fly learning with energy flux imaging as in [324] per learned association. The output is a measured $\iota$ in a living agent.

**Type.** Experiment.

### G8. Collective agency

**Known.** Dependency networks set a floor on entropy production [303, 305]. Subsystems obey their own uncertainty relations [304] and trade minimum entropy productions [299]. Collective protocols reduce dissipation [306]. Efficiency peaks near criticality [307, 308]. Individuals can be found from information [251].

**Closest.** Wolpert and Tasnim, and Rolandi and colleagues.

**Closing result.** A composition theorem for $X$ and $J$. It states when the confirmed coupled bits of a group exceed the sum of its members', at what joule floor, and when the group meets clauses 1 to 4 as one agent (with G1).

**Type.** Proof, with simulation.

### G9. Quantum agents

**Known.** A purely quantum agent is argued impossible [309]. Quantum agents can need less memory [310] and learn faster [311]. Ideal measurement needs infinite resources [312]. Information gain, error correction and thermodynamic cost trade three ways [313]. The second law, fluctuation theorems and the TUR hold under quantum feedback [314, 315, 289]. The energy of measurement is measured [316]. Quantum demons have run on spins and circuits [51, 52, 53, 54, 55].

**Closest.** Guryanova, Friis and Huber, and Danageozian, Wilde and Buscemi.

**Closing result.** K1 for an agent whose comparison $m$ is written to a classical record by a quantum measurement with finite resources. The bound must count measurement cost in the joules per confirmed bit. Then demonstrate it in NMR or a superconducting circuit.

**Type.** Proof, then experiment.

### G10. Joule cost of prediction first

**Known.** Memory that does not predict costs dissipation [34]. Memory has a cost and a benefit [164]. In a percept-action loop, work-efficient agents balance prediction against forgetting [267]. Confident prediction saved cortical energy in humans [326]. The most predictive bits are costly in cells [320].

**Closest.** Fiderer, Barth, Smith and Briegel.

**Closing result.** A theorem that prices clause 1: the joules to hold $R^*(a)$ fixed from $t_0$ to the act, against the joules it saves at the act. It gives the condition under which prediction first raises $\iota$ (P5, P8). Then test it in the D-series runs of Section 7.2.

**Type.** Proof.

## References

Entries marked "preprint" are cited by their arXiv posting. Entries published in a language other than English say so.

1. Pearl, J. (1995). Causal diagrams for empirical research. *Biometrika* 82:669-688. https://doi.org/10.1093/biomet/82.4.669
2. Everitt, T., Hutter, M., Kumar, R. and Krakovna, V. (2019). Reward tampering problems and solutions in reinforcement learning: a causal influence diagram perspective. arXiv:1908.04734 (preprint).
3. Sagawa, T. and Ueda, M. (2008). Second law of thermodynamics with discrete quantum feedback control. *Physical Review Letters* 100:080403. https://doi.org/10.1103/PhysRevLett.100.080403
4. Sagawa, T. and Ueda, M. (2010). Generalized Jarzynski equality under nonequilibrium feedback control. *Physical Review Letters* 104:090602. https://doi.org/10.1103/PhysRevLett.104.090602
5. Sagawa, T. and Ueda, M. (2009). Minimal energy cost for thermodynamic information processing: measurement and information erasure. *Physical Review Letters* 102:250602. https://doi.org/10.1103/PhysRevLett.102.250602
6. Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5:183-191. https://doi.org/10.1147/rd.53.0183
7. Bennett, C. H. (1982). The thermodynamics of computation: a review. *International Journal of Theoretical Physics* 21:905-940. https://doi.org/10.1007/BF02084158
8. Shiraishi, N., Funo, K. and Saito, K. (2018). Speed limit for classical stochastic processes. *Physical Review Letters* 121:070601. https://doi.org/10.1103/PhysRevLett.121.070601
9. Esposito, M. and Van den Broeck, C. (2011). Second law and Landauer principle far from equilibrium. *EPL* 95:40004. https://doi.org/10.1209/0295-5075/95/40004
10. Barato, A. C. and Seifert, U. (2015). Thermodynamic uncertainty relation for biomolecular processes. *Physical Review Letters* 114:158101. https://doi.org/10.1103/PhysRevLett.114.158101
11. Gingrich, T. R., Horowitz, J. M., Perunov, N. and England, J. L. (2016). Dissipation bounds all steady-state current fluctuations. *Physical Review Letters* 116:120601. https://doi.org/10.1103/PhysRevLett.116.120601
12. Paneru, G., Dutta, S., Tlusty, T. and Pak, H. K. (2020). Reaching and violating thermodynamic uncertainty bounds in information engines. *Physical Review E* 102:032126. https://doi.org/10.1103/PhysRevE.102.032126
13. Potts, P. P. and Samuelsson, P. (2019). Thermodynamic uncertainty relations including measurement and feedback. *Physical Review E* 100:052137. https://doi.org/10.1103/PhysRevE.100.052137
14. Proesmans, K., Ehrich, J. and Bechhoefer, J. (2020). Finite-time Landauer principle. *Physical Review Letters* 125:100602. https://doi.org/10.1103/PhysRevLett.125.100602
15. Sivak, D. A. and Crooks, G. E. (2012). Thermodynamic metrics and optimal paths. *Physical Review Letters* 108:190602. https://doi.org/10.1103/PhysRevLett.108.190602
16. Margolus, N. and Levitin, L. B. (1998). The maximum speed of dynamical evolution. *Physica D* 120:188-195. https://doi.org/10.1016/S0167-2789(98)00054-2
17. Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17:525-532. https://doi.org/10.1147/rd.176.0525
18. Sagawa, T. and Ueda, M. (2012). Fluctuation theorem with information exchange: role of correlations in stochastic thermodynamics. *Physical Review Letters* 109:180602. https://doi.org/10.1103/PhysRevLett.109.180602
19. Horodecki, M. and Oppenheim, J. (2013). Fundamental limitations for quantum and nanoscale thermodynamics. *Nature Communications* 4:2059. https://doi.org/10.1038/ncomms3059
20. Parrondo, J. M. R., Horowitz, J. M. and Sagawa, T. (2015). Thermodynamics of information. *Nature Physics* 11:131-139. https://doi.org/10.1038/nphys3230
21. Seifert, U. (2012). Stochastic thermodynamics, fluctuation theorems and molecular machines. *Reports on Progress in Physics* 75:126001. https://doi.org/10.1088/0034-4885/75/12/126001
22. Conant, R. C. and Ashby, W. R. (1970). Every good regulator of a system must be a model of that system. *International Journal of Systems Science* 1:89-97. https://doi.org/10.1080/00207727008920220
23. Touchette, H. and Lloyd, S. (2000). Information-theoretic limits of control. *Physical Review Letters* 84:1156-1159. https://doi.org/10.1103/PhysRevLett.84.1156
24. Touchette, H. and Lloyd, S. (2004). Information-theoretic approach to the study of control systems. *Physica A* 331:140-172. https://doi.org/10.1016/j.physa.2003.09.007
25. Horowitz, J. M. and Esposito, M. (2014). Thermodynamics with continuous information flow. *Physical Review X* 4:031015. https://doi.org/10.1103/PhysRevX.4.031015
26. Ito, S. and Sagawa, T. (2013). Information thermodynamics on causal networks. *Physical Review Letters* 111:180603. https://doi.org/10.1103/PhysRevLett.111.180603
27. Hartich, D., Barato, A. C. and Seifert, U. (2014). Stochastic thermodynamics of bipartite systems: transfer entropy inequalities and a Maxwell's demon interpretation. *Journal of Statistical Mechanics* P02016. https://doi.org/10.1088/1742-5468/2014/02/P02016
28. Allahverdyan, A. E., Janzing, D. and Mahler, G. (2009). Thermodynamic efficiency of information and heat flow. *Journal of Statistical Mechanics* P09011. https://doi.org/10.1088/1742-5468/2009/09/P09011
29. Esposito, M. and Schaller, G. (2012). Stochastic thermodynamics for "Maxwell demon" feedbacks. *EPL* 99:30003. https://doi.org/10.1209/0295-5075/99/30003
30. Mandal, D. and Jarzynski, C. (2012). Work and information processing in a solvable model of Maxwell's demon. *PNAS* 109:11641-11645. https://doi.org/10.1073/pnas.1204263109
31. Boyd, A. B., Mandal, D. and Crutchfield, J. P. (2016). Identifying functional thermodynamics in autonomous Maxwellian ratchets. *New Journal of Physics* 18:023049. https://doi.org/10.1088/1367-2630/18/2/023049
32. Boyd, A. B., Mandal, D. and Crutchfield, J. P. (2018). Thermodynamics of modularity: structural costs beyond the Landauer bound. *Physical Review X* 8:031036. https://doi.org/10.1103/PhysRevX.8.031036
33. Kolchinsky, A. and Wolpert, D. H. (2017). Dependence of dissipation on the initial distribution over states. *Journal of Statistical Mechanics* 083202. https://doi.org/10.1088/1742-5468/aa7ee1
34. Still, S., Sivak, D. A., Bell, A. J. and Crooks, G. E. (2012). Thermodynamics of prediction. *Physical Review Letters* 109:120604. https://doi.org/10.1103/PhysRevLett.109.120604
35. Kolchinsky, A. and Wolpert, D. H. (2018). Semantic information, autonomous agency and non-equilibrium statistical physics. *Interface Focus* 8:20180041. https://doi.org/10.1098/rsfs.2018.0041
36. Ortega, P. A. and Braun, D. A. (2013). Thermodynamics as a theory of decision-making with information-processing costs. *Proceedings of the Royal Society A* 469:20120683. https://doi.org/10.1098/rspa.2012.0683
37. Kolchinsky, A. and Wolpert, D. H. (2020). Thermodynamic costs of Turing machines. *Physical Review Research* 2:033312. https://doi.org/10.1103/PhysRevResearch.2.033312
38. Bérut, A., Arakelyan, A., Petrosyan, A., Ciliberto, S., Dillenschneider, R. and Lutz, E. (2012). Experimental verification of Landauer's principle linking information and thermodynamics. *Nature* 483:187-189. https://doi.org/10.1038/nature10872
39. Jun, Y., Gavrilov, M. and Bechhoefer, J. (2014). High-precision test of Landauer's principle in a feedback trap. *Physical Review Letters* 113:190601. https://doi.org/10.1103/PhysRevLett.113.190601
40. Orlov, A. O., Lent, C. S., Thorpe, C. C., Boechler, G. P. and Snider, G. L. (2012). Experimental test of Landauer's principle at the sub-k_BT level. *Japanese Journal of Applied Physics* 51:06FE10. https://doi.org/10.1143/JJAP.51.06FE10
41. Hong, J., Lambson, B., Dhuey, S. and Bokor, J. (2016). Experimental test of Landauer's principle in single-bit operations on nanomagnetic memory bits. *Science Advances* 2:e1501492. https://doi.org/10.1126/sciadv.1501492
42. Gavrilov, M. and Bechhoefer, J. (2016). Erasure without work in an asymmetric double-well potential. *Physical Review Letters* 117:200601. https://doi.org/10.1103/PhysRevLett.117.200601
43. Gavrilov, M., Chétrite, R. and Bechhoefer, J. (2017). Direct measurement of weakly nonequilibrium system entropy is consistent with Gibbs-Shannon form. *PNAS* 114:11097-11102. https://doi.org/10.1073/pnas.1708689114
44. Yan, L. L., Xiong, T. P., Rehan, K., Zhou, F., Liang, D. F. et al. (2018). Single-atom demonstration of the quantum Landauer principle. *Physical Review Letters* 120:210601. https://doi.org/10.1103/PhysRevLett.120.210601
45. Dago, S., Pereda, J., Barros, N., Ciliberto, S. and Bellon, L. (2021). Information and thermodynamics: fast and precise approach to Landauer's bound in an underdamped micromechanical oscillator. *Physical Review Letters* 126:170601. https://doi.org/10.1103/PhysRevLett.126.170601
46. Scandi, M., Barker, D., Lehmann, S., Dick, K. A., Maisi, V. F. and Perarnau-Llobet, M. (2022). Minimally dissipative information erasure in a quantum dot via thermodynamic length. *Physical Review Letters* 129:270601. https://doi.org/10.1103/PhysRevLett.129.270601
47. Toyabe, S., Sagawa, T., Ueda, M., Muneyuki, E. and Sano, M. (2010). Experimental demonstration of information-to-energy conversion and validation of the generalized Jarzynski equality. *Nature Physics* 6:988-992. https://doi.org/10.1038/nphys1821
48. Koski, J. V., Maisi, V. F., Pekola, J. P. and Averin, D. V. (2014). Experimental realization of a Szilard engine with a single electron. *PNAS* 111:13786-13789. https://doi.org/10.1073/pnas.1406966111
49. Koski, J. V., Maisi, V. F., Sagawa, T. and Pekola, J. P. (2014). Experimental observation of the role of mutual information in the nonequilibrium dynamics of a Maxwell demon. *Physical Review Letters* 113:030601. https://doi.org/10.1103/PhysRevLett.113.030601
50. Koski, J. V., Kutvonen, A., Khaymovich, I. M., Ala-Nissila, T. and Pekola, J. P. (2015). On-chip Maxwell's demon as an information-powered refrigerator. *Physical Review Letters* 115:260602. https://doi.org/10.1103/PhysRevLett.115.260602
51. Camati, P. A., Peterson, J. P. S., Batalhão, T. B., Micadei, K., Souza, A. M. et al. (2016). Experimental rectification of entropy production by Maxwell's demon in a quantum system. *Physical Review Letters* 117:240502. https://doi.org/10.1103/PhysRevLett.117.240502
52. Peterson, J. P. S., Sarthour, R. S., Souza, A. M., Oliveira, I. S., Goold, J. et al. (2016). Experimental demonstration of information to energy conversion in a quantum system at the Landauer limit. *Proceedings of the Royal Society A* 472:20150813. https://doi.org/10.1098/rspa.2015.0813
53. Cottet, N., Jezouin, S., Bretheau, L., Campagne-Ibarcq, P., Ficheux, Q. et al. (2017). Observing a quantum Maxwell demon at work. *PNAS* 114:7561-7564. https://doi.org/10.1073/pnas.1704827114
54. Masuyama, Y., Funo, K., Murashita, Y., Noguchi, A., Kono, S. et al. (2018). Information-to-work conversion by Maxwell's demon in a superconducting circuit quantum electrodynamical system. *Nature Communications* 9:1291. https://doi.org/10.1038/s41467-018-03686-y
55. Naghiloo, M., Alonso, J. J., Romito, A., Lutz, E. and Murch, K. W. (2018). Information gain and loss for a quantum Maxwell's demon. *Physical Review Letters* 121:030604. https://doi.org/10.1103/PhysRevLett.121.030604
56. Kumar, A., Wu, T.-Y., Giraldo, F. and Weiss, D. S. (2018). Sorting ultracold atoms in a three-dimensional optical lattice in a realization of Maxwell's demon. *Nature* 561:83-87. https://doi.org/10.1038/s41586-018-0458-7
57. Paneru, G., Lee, D. Y., Tlusty, T. and Pak, H. K. (2018). Lossless Brownian information engine. *Physical Review Letters* 120:020601. https://doi.org/10.1103/PhysRevLett.120.020601
58. Admon, T., Rahav, S. and Roichman, Y. (2018). Experimental realization of an information machine with tunable temporal correlations. *Physical Review Letters* 121:180601. https://doi.org/10.1103/PhysRevLett.121.180601
59. Ribezzi-Crivellari, M. and Ritort, F. (2019). Large work extraction and the Landauer limit in a continuous Maxwell demon. *Nature Physics* 15:660-664. https://doi.org/10.1038/s41567-019-0481-0
60. Debiossac, M., Grass, D., Alonso, J. J., Lutz, E. and Kiesel, N. (2020). Thermodynamics of continuous non-Markovian feedback control. *Nature Communications* 11:1360. https://doi.org/10.1038/s41467-020-15148-5
61. Saha, T. K., Lucero, J. N. E., Ehrich, J., Sivak, D. A. and Bechhoefer, J. (2021). Maximizing power and velocity of an information engine. *PNAS* 118:e2023356118. https://doi.org/10.1073/pnas.2023356118
62. Saha, T. K., Lucero, J. N. E., Ehrich, J., Sivak, D. A. and Bechhoefer, J. (2022). Bayesian information engine that optimally exploits noisy measurements. *Physical Review Letters* 129:130601. https://doi.org/10.1103/PhysRevLett.129.130601
63. Saha, T. K., Ehrich, J., Gavrilov, M., Still, S., Sivak, D. A. and Bechhoefer, J. (2023). Information engine in a nonequilibrium bath. *Physical Review Letters* 131:057101. https://doi.org/10.1103/PhysRevLett.131.057101
64. Barker, D., Scandi, M., Lehmann, S., Thelander, C., Dick, K. A., Perarnau-Llobet, M. and Maisi, V. F. (2022). Experimental verification of the work fluctuation-dissipation relation for information-to-work conversion. *Physical Review Letters* 128:040602. https://doi.org/10.1103/PhysRevLett.128.040602
65. Yan, L.-L., Bu, J.-T., Zeng, Q., Zhang, K., Cui, K.-F. et al. (2024). Experimental verification of demon-involved fluctuation theorems. *Physical Review Letters* 133:090402. https://doi.org/10.1103/PhysRevLett.133.090402
66. Zeng, Q. and Wang, J. (2021). New fluctuation theorems on Maxwell's demon. *Science Advances* 7:eabf1807. https://doi.org/10.1126/sciadv.abf1807
67. Demin, A. V. and Vityaev, E. E. (2014). Learning in a virtual model of the C. elegans nematode for locomotion and chemotaxis. *Biologically Inspired Cognitive Architectures* 7:9-14. https://doi.org/10.1016/j.bica.2013.11.005
68. Putintsev, N. I., Isupov, O. V. and Vityaev, E. E. (2015). Adaptive control system for a mobile agent in a physical environment based on functional systems theory. *Russian Journal of Genetics: Applied Research* 5:601-608. https://doi.org/10.1134/S2079059715060131
69. Rosenblueth, A., Wiener, N. and Bigelow, J. (1943). Behavior, purpose and teleology. *Philosophy of Science* 10:18-24. https://doi.org/10.1086/286788
70. Anokhin, P. K. (1968). The functional system as a unit of organism integrative activity. In *Systems Theory and Biology*, Springer, pp. 376-403. https://doi.org/10.1007/978-3-642-88343-9_15
71. Anokhin, P. K. (1974). The biological roots of the conditioned reflex. In *Biology and Neurophysiology of the Conditioned Reflex and Its Role in Adaptive Behavior*, Pergamon, pp. 1-24. https://doi.org/10.1016/B978-0-08-021516-7.50008-2
72. Sudakov, K. V. (1997). The theory of functional systems: general postulates and principles of dynamic organization. *Integrative Physiological and Behavioral Science* 32:392-414. https://doi.org/10.1007/BF02688634
73. Shvyrkov, V. B. (1980). Goal as a system-forming factor in behavior and learning. In *Neural Mechanisms of Goal-directed Behavior and Learning*, Academic Press, pp. 199-219. https://doi.org/10.1016/B978-0-12-688980-2.50018-7
74. Rosen, R. (2012). *Anticipatory Systems: Philosophical, Mathematical, and Methodological Foundations*, 2nd ed. Springer. https://doi.org/10.1007/978-1-4614-1269-4
75. Maturana, H. R. and Varela, F. J. (1980). *Autopoiesis and Cognition: The Realization of the Living*. Reidel. https://doi.org/10.1007/978-94-009-8947-4
76. Kauffman, S. (2003). Molecular autonomous agents. *Philosophical Transactions of the Royal Society A* 361:1089-1099. https://doi.org/10.1098/rsta.2003.1186
77. Di Paolo, E. A. (2005). Autopoiesis, adaptivity, teleology, agency. *Phenomenology and the Cognitive Sciences* 4:429-452. https://doi.org/10.1007/s11097-005-9002-y
78. Barandiaran, X. and Moreno, A. (2006). On what makes certain dynamical systems cognitive: a minimally cognitive organization program. *Adaptive Behavior* 14:171-185. https://doi.org/10.1177/105971230601400208
79. Barandiaran, X. and Moreno, A. (2008). Adaptivity: from metabolism to behavior. *Adaptive Behavior* 16:325-344. https://doi.org/10.1177/1059712308093868
80. Barandiaran, X. E., Di Paolo, E. and Rohde, M. (2009). Defining agency: individuality, normativity, asymmetry, and spatio-temporality in action. *Adaptive Behavior* 17:367-386. https://doi.org/10.1177/1059712309343819
81. Ruiz-Mirazo, K. and Moreno, A. (2011). Autonomy in evolution: from minimal to complex life. *Synthese* 185:21-52. https://doi.org/10.1007/s11229-011-9874-z
82. Moreno, A. and Mossio, M. (2015). *Biological Autonomy: A Philosophical and Theoretical Enquiry*. Springer. https://doi.org/10.1007/978-94-017-9837-2
83. Montévil, M. and Mossio, M. (2015). Biological organisation as closure of constraints. *Journal of Theoretical Biology* 372:179-191. https://doi.org/10.1016/j.jtbi.2015.02.029
84. Aguilera, M. and Barandiaran, X. E. (2024). Thermina: a minimal model of autonomous agency from the lens of stochastic thermodynamics. *ALIFE 2024: Proceedings of the 2024 Artificial Life Conference*. https://doi.org/10.1162/isal_a_00826
85. Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience* 11:127-138. https://doi.org/10.1038/nrn2787
86. Friston, K. (2013). Life as we know it. *Journal of the Royal Society Interface* 10:20130475. https://doi.org/10.1098/rsif.2013.0475
87. Rovelli, C. (2020). Agency in physics. arXiv:2007.05300 (preprint).
88. Jaeger, J. (2023). Artificial intelligence is algorithmic mimicry: why artificial "agents" are not (and won't be) proper agents. arXiv:2307.07515 (preprint).
89. Azadi, P. (2025). Computational irreducibility as the foundation of agency. arXiv:2505.04646 (preprint).
90. Wissner-Gross, A. D. and Freer, C. E. (2013). Causal entropic forces. *Physical Review Letters* 110:168702. https://doi.org/10.1103/PhysRevLett.110.168702
91. Kappen, H. J. (2013). Comment: causal entropic forces. arXiv:1312.4185 (preprint).
92. Funo, K., Shiraishi, N. and Saito, K. (2019). Speed limit for open quantum systems. *New Journal of Physics* 21:013006. https://doi.org/10.1088/1367-2630/aaf9f5
93. Shiraishi, N. and Saito, K. (2021). Speed limit for open systems coupled to general environments. *Physical Review Research* 3:023074. https://doi.org/10.1103/PhysRevResearch.3.023074
94. Vo, V. T., Van Vu, T. and Hasegawa, Y. (2020). Unified approach to classical speed limit and thermodynamic uncertainty relation. *Physical Review E* 102:062132. https://doi.org/10.1103/PhysRevE.102.062132
95. Falasco, G. and Esposito, M. (2020). Dissipation-time uncertainty relation. *Physical Review Letters* 125:120604. https://doi.org/10.1103/PhysRevLett.125.120604
96. Ito, S. (2018). Stochastic thermodynamic interpretation of information geometry. *Physical Review Letters* 121:030605. https://doi.org/10.1103/PhysRevLett.121.030605
97. Ito, S. and Dechant, A. (2020). Stochastic time evolution, information geometry, and the Cramér-Rao bound. *Physical Review X* 10:021056. https://doi.org/10.1103/PhysRevX.10.021056
98. Nakazato, M. and Ito, S. (2021). Geometrical aspects of entropy production in stochastic thermodynamics based on Wasserstein distance. *Physical Review Research* 3:043093. https://doi.org/10.1103/PhysRevResearch.3.043093
99. Dechant, A., Sasa, S.-i. and Ito, S. (2022). Geometric decomposition of entropy production in out-of-equilibrium systems. *Physical Review Research* 4:L012034. https://doi.org/10.1103/PhysRevResearch.4.L012034
100. Van Vu, T. and Saito, K. (2023). Thermodynamic unification of optimal transport: thermodynamic uncertainty relation, minimum dissipation, and thermodynamic speed limits. *Physical Review X* 13:011013. https://doi.org/10.1103/PhysRevX.13.011013
101. Nagayama, R., Yoshimura, K. and Ito, S. (2025). Infinite variety of thermodynamic speed limits with general activities. *Physical Review Research* 7:013307. https://doi.org/10.1103/PhysRevResearch.7.013307
102. Yoshimura, K. and Ito, S. (2021). Thermodynamic uncertainty relation and thermodynamic speed limit in deterministic chemical reaction networks. *Physical Review Letters* 127:160601. https://doi.org/10.1103/PhysRevLett.127.160601
103. Aurell, E., Mejía-Monasterio, C. and Muratore-Ginanneschi, P. (2011). Optimal protocols and optimal transport in stochastic thermodynamics. *Physical Review Letters* 106:250601. https://doi.org/10.1103/PhysRevLett.106.250601
104. Seifert, U. (2017). Stochastic thermodynamics: from principles to the cost of precision. arXiv:1707.03759 (lecture notes).
105. Horowitz, J. M. and Gingrich, T. R. (2017). Proof of the finite-time thermodynamic uncertainty relation for steady-state currents. *Physical Review E* 96:020103. https://doi.org/10.1103/PhysRevE.96.020103
106. Pietzonka, P., Barato, A. C. and Seifert, U. (2016). Universal bounds on current fluctuations. *Physical Review E* 93:052145. https://doi.org/10.1103/PhysRevE.93.052145
107. Proesmans, K. and Van den Broeck, C. (2017). Discrete-time thermodynamic uncertainty relation. *EPL* 119:20001. https://doi.org/10.1209/0295-5075/119/20001
108. Hasegawa, Y. and Van Vu, T. (2019). Fluctuation theorem uncertainty relation. *Physical Review Letters* 123:110602. https://doi.org/10.1103/PhysRevLett.123.110602
109. Dechant, A. and Sasa, S.-i. (2018). Entropic bounds on currents in Langevin systems. *Physical Review E* 97:062101. https://doi.org/10.1103/PhysRevE.97.062101
110. Lee, J. S., Park, J.-M. and Park, H. (2019). Thermodynamic uncertainty relation for underdamped Langevin systems driven by a velocity-dependent force. *Physical Review E* 100:062132. https://doi.org/10.1103/PhysRevE.100.062132
111. Lee, J. S., Park, J.-M. and Park, H. (2021). Universal form of thermodynamic uncertainty relation for Langevin dynamics. *Physical Review E* 104:L052102. https://doi.org/10.1103/PhysRevE.104.L052102
112. Dechant, A. and Sasa, S.-i. (2021). Improving thermodynamic bounds using correlations. *Physical Review X* 11:041061. https://doi.org/10.1103/PhysRevX.11.041061
113. Horowitz, J. M. and Gingrich, T. R. (2020). Thermodynamic uncertainty relations constrain non-equilibrium fluctuations. *Nature Physics* 16:15-20. https://doi.org/10.1038/s41567-019-0702-6
114. Barato, A. C. and Seifert, U. (2016). Cost and precision of Brownian clocks. *Physical Review X* 6:041053. https://doi.org/10.1103/PhysRevX.6.041053
115. Salazar, D. S. P. (2021). Information bound for entropy production from the detailed fluctuation theorem. *Physical Review E* 103:022122. https://doi.org/10.1103/PhysRevE.103.022122
116. Landi, G. T. and Paternostro, M. (2021). Irreversible entropy production: from classical to quantum. *Reviews of Modern Physics* 93:035008. https://doi.org/10.1103/RevModPhys.93.035008
117. Schmiedl, T. and Seifert, U. (2007). Optimal finite-time processes in stochastic thermodynamics. *Physical Review Letters* 98:108301. https://doi.org/10.1103/PhysRevLett.98.108301
118. Proesmans, K., Ehrich, J. and Bechhoefer, J. (2020). Optimal finite-time bit erasure under full control. *Physical Review E* 102:032105. https://doi.org/10.1103/PhysRevE.102.032105
119. Zhen, Y.-Z., Egloff, D., Modi, K. and Dahlsten, O. (2021). Universal bound on energy cost of bit reset in finite time. *Physical Review Letters* 127:190602. https://doi.org/10.1103/PhysRevLett.127.190602
120. Esposito, M., Kawai, R., Lindenberg, K. and Van den Broeck, C. (2010). Efficiency at maximum power of low-dissipation Carnot engines. *Physical Review Letters* 105:150603. https://doi.org/10.1103/PhysRevLett.105.150603
121. Tu, Z. C. (2008). Efficiency at maximum power of Feynman's ratchet as a heat engine. *Journal of Physics A* 41:312003. https://doi.org/10.1088/1751-8113/41/31/312003
122. Shiraishi, N., Saito, K. and Tasaki, H. (2016). Universal trade-off relation between power and efficiency for heat engines. *Physical Review Letters* 117:190601. https://doi.org/10.1103/PhysRevLett.117.190601
123. Pietzonka, P. and Seifert, U. (2018). Universal trade-off between power, efficiency, and constancy in steady-state heat engines. *Physical Review Letters* 120:190602. https://doi.org/10.1103/PhysRevLett.120.190602
124. Ma, Y.-H., Xu, D., Dong, H. and Sun, C.-P. (2018). Universal constraint for efficiency and power of a low-dissipation heat engine. *Physical Review E* 98:042112. https://doi.org/10.1103/PhysRevE.98.042112
125. Tsirlin, A. M., Mironova, V. A., Amelkin, S. A. and Kazakov, V. (1998). Finite-time thermodynamics: conditions of minimal dissipation for thermodynamic processes with given rate. *Physical Review E* 58:215-223. https://doi.org/10.1103/PhysRevE.58.215
126. Lloyd, S. (2000). Ultimate physical limits to computation. *Nature* 406:1047-1054. https://doi.org/10.1038/35023282
127. Deffner, S. and Campbell, S. (2017). Quantum speed limits: from Heisenberg's uncertainty principle to optimal quantum control. *Journal of Physics A* 50:453001. https://doi.org/10.1088/1751-8121/aa86c6
128. Lan, G., Sartori, P., Neumann, S., Sourjik, V. and Tu, Y. (2012). The energy-speed-accuracy trade-off in sensory adaptation. *Nature Physics* 8:422-428. https://doi.org/10.1038/nphys2276
129. Mehta, P. and Schwab, D. J. (2012). Energetic costs of cellular computation. *PNAS* 109:17978-17982. https://doi.org/10.1073/pnas.1207814109
130. Lang, A. H., Fisher, C. K., Mora, T. and Mehta, P. (2014). Thermodynamics of statistical inference by cells. *Physical Review Letters* 113:148103. https://doi.org/10.1103/PhysRevLett.113.148103
131. Govern, C. C. and ten Wolde, P. R. (2014). Optimal resource allocation in cellular sensing systems. *PNAS* 111:17486-17491. https://doi.org/10.1073/pnas.1411524111
132. Sartori, P., Granger, L., Lee, C. F. and Horowitz, J. M. (2014). Thermodynamic costs of information processing in sensory adaptation. *PLoS Computational Biology* 10:e1003974. https://doi.org/10.1371/journal.pcbi.1003974
133. Barato, A. C., Hartich, D. and Seifert, U. (2013). Information-theoretic versus thermodynamic entropy production in autonomous sensory networks. *Physical Review E* 87:042104. https://doi.org/10.1103/PhysRevE.87.042104
134. Barato, A. C., Hartich, D. and Seifert, U. (2014). Efficiency of cellular information processing. *New Journal of Physics* 16:103024. https://doi.org/10.1088/1367-2630/16/10/103024
135. Ouldridge, T. E., Govern, C. C. and ten Wolde, P. R. (2017). Thermodynamics of computational copying in biochemical systems. *Physical Review X* 7:021004. https://doi.org/10.1103/PhysRevX.7.021004
136. Cao, Y., Wang, H., Ouyang, Q. and Tu, Y. (2015). The free-energy cost of accurate biochemical oscillations. *Nature Physics* 11:772-778. https://doi.org/10.1038/nphys3412
137. Zhang, D., Cao, Y., Ouyang, Q. and Tu, Y. (2019). The energy cost and optimal design for synchronization of coupled molecular oscillators. *Nature Physics* 16:95-100. https://doi.org/10.1038/s41567-019-0701-7
138. Sartori, P. and Tu, Y. (2015). Free energy cost of reducing noise while maintaining a high sensitivity. *Physical Review Letters* 115:118102. https://doi.org/10.1103/PhysRevLett.115.118102
139. Horowitz, J. M., Zhou, K. and England, J. L. (2017). Minimum energetic cost to maintain a target nonequilibrium state. *Physical Review E* 95:042102. https://doi.org/10.1103/PhysRevE.95.042102
140. Schreiber, T. (2000). Measuring information transfer. *Physical Review Letters* 85:461-464. https://doi.org/10.1103/PhysRevLett.85.461
141. Tishby, N. and Polani, D. (2011). Information theory of decisions and actions. In *Perception-Action Cycle*, Springer, pp. 601-636. https://doi.org/10.1007/978-1-4419-1452-1_19
142. Stratonovich, R. L. (2020). *Theory of Information and its Value* (English edition of the 1975 Russian monograph). Springer. https://doi.org/10.1007/978-3-030-22833-0
143. Pal, S., Saryal, S., Segal, D., Mahesh, T. S. and Agarwalla, B. K. (2020). Experimental study of the thermodynamic uncertainty relation. *Physical Review Research* 2:022044. https://doi.org/10.1103/PhysRevResearch.2.022044
144. Barker, D., Lehmann, S., Dick, K. A., Samuelsson, P. et al. (2025). Information thermodynamics in a quantum dot Szilard engine: experimentally investigating fluctuation theorems and thermodynamic uncertainty relations. arXiv:2511.08541 (preprint).
145. Friedman, H. M., Agarwalla, B. K., Shein-Lumbroso, O., Tal, O. and Segal, D. (2020). Thermodynamic uncertainty relation in atomic-scale quantum conductors. *Physical Review B* 101:195423. https://doi.org/10.1103/PhysRevB.101.195423
146. Hwang, W. and Hyeon, C. (2018). Energetic costs, precision, and transport efficiency of molecular motors. *Journal of Physical Chemistry Letters* 9:513-520. https://doi.org/10.1021/acs.jpclett.7b03197
147. Li, J., Horowitz, J. M., Gingrich, T. R. and Fakhri, N. (2019). Quantifying dissipation using fluctuating currents. *Nature Communications* 10:1666. https://doi.org/10.1038/s41467-019-09631-x
148. Ness, G., Lam, M. R., Alt, W., Meschede, D., Sagi, Y. and Alberti, A. (2021). Observing crossover between quantum speed limits. *Science Advances* 7:eabj9119. https://doi.org/10.1126/sciadv.abj9119
149. Pires, L. B., Goerlich, R., Luna da Fonseca, A., Debiossac, M., Hervieux, P.-A. et al. (2023). Optimal time-entropy bounds and speed limits for Brownian thermal shortcuts. *Physical Review Letters* 131:097101. https://doi.org/10.1103/PhysRevLett.131.097101
150. Oikawa, S., Nakayama, Y., Ito, S., Sagawa, T. and Toyabe, S. (2025). Experimentally achieving minimal dissipation via thermodynamically optimal transport. *Nature Communications* 16:10424. https://doi.org/10.1038/s41467-025-66519-9
151. Proesmans, K., Dreher, Y., Gavrilov, M., Bechhoefer, J. and Van den Broeck, C. (2016). Brownian duet: a novel tale of thermodynamic efficiency. *Physical Review X* 6:041010. https://doi.org/10.1103/PhysRevX.6.041010
152. Mancino, L., Cavina, V., De Pasquale, A., Sbroscia, M., Booth, R. I. et al. (2018). Geometrical bounds on irreversibility in open quantum systems. *Physical Review Letters* 121:160602. https://doi.org/10.1103/PhysRevLett.121.160602
153. Blickle, V. and Bechinger, C. (2012). Realization of a micrometre-sized stochastic heat engine. *Nature Physics* 8:143-146. https://doi.org/10.1038/nphys2163
154. Martínez, I. A., Roldán, É., Dinis, L., Petrov, D., Parrondo, J. M. R. and Rica, R. A. (2016). Brownian Carnot engine. *Nature Physics* 12:67-70. https://doi.org/10.1038/nphys3518
155. Roldán, É., Martínez, I. A., Parrondo, J. M. R. and Petrov, D. (2014). Universal features in the energetics of symmetry breaking. *Nature Physics* 10:457-461. https://doi.org/10.1038/nphys2940
156. Krishnamurthy, S., Ghosh, S., Chatterji, D., Ganapathy, R. and Sood, A. K. (2016). A micrometre-sized heat engine operating between bacterial reservoirs. *Nature Physics* 12:1134-1138. https://doi.org/10.1038/nphys3870
157. Krishnamurthy, S., Ganapathy, R. and Sood, A. K. (2023). Overcoming power-efficiency tradeoff in a micro heat engine by engineered system-bath interactions. *Nature Communications* 14:6842. https://doi.org/10.1038/s41467-023-42350-y
158. Paneru, G., Dutta, S., Sagawa, T., Tlusty, T. and Pak, H. K. (2020). Efficiency fluctuations and noise induced refrigerator-to-heater transition in information engines. *Nature Communications* 11:1012. https://doi.org/10.1038/s41467-020-14823-x
159. Klyubin, A. S., Polani, D. and Nehaniv, C. L. (2005). Empowerment: a universal agent-centric measure of control. *2005 IEEE Congress on Evolutionary Computation* 1:128-135. https://doi.org/10.1109/CEC.2005.1554676
160. Jung, T., Polani, D. and Stone, P. (2011). Empowerment for continuous agent-environment systems. *Adaptive Behavior* 19:16-39. https://doi.org/10.1177/1059712310392389
161. Salge, C., Glackin, C. and Polani, D. (2013). Empowerment: an introduction. arXiv:1310.1863 (preprint).
162. Kolchinsky, A. (2024). Thermodynamic dissipation does not bound replicator growth and decay rates. arXiv:2404.01130 (preprint).
163. Goldt, S. and Seifert, U. (2017). Stochastic thermodynamics of learning. *Physical Review Letters* 118:010601. https://doi.org/10.1103/PhysRevLett.118.010601
164. Still, S. (2020). Thermodynamic cost and benefit of memory. *Physical Review Letters* 124:050601. https://doi.org/10.1103/PhysRevLett.124.050601
165. Boyd, A. B., Crutchfield, J. P. and Gu, M. (2022). Thermodynamic machine learning through maximum work production. *New Journal of Physics* 24:083040. https://doi.org/10.1088/1367-2630/ac4309
166. Boyd, A. B., Crutchfield, J. P., Gu, M. and Binder, F. C. (2025). Thermodynamic overfitting and generalization: energetics of predictive intelligence. *New Journal of Physics* 27:063901. https://doi.org/10.1088/1367-2630/addf71
167. Ehrich, J., Still, S. and Sivak, D. A. (2023). Energetic cost of feedback control. *Physical Review Research* 5:023080. https://doi.org/10.1103/PhysRevResearch.5.023080
168. Ehrich, J. and Sivak, D. A. (2023). Energy and information flows in autonomous systems. *Frontiers in Physics* 11:1108357. https://doi.org/10.3389/fphy.2023.1108357
169. Wolpert, D. H. (2019). The stochastic thermodynamics of computation. *Journal of Physics A* 52:193001. https://doi.org/10.1088/1751-8121/ab0850
170. Levy, W. B. and Baxter, R. A. (1996). Energy efficient neural codes. *Neural Computation* 8:531-543. https://doi.org/10.1162/neco.1996.8.3.531
171. Russell, S. J. and Subramanian, D. (1995). Provably bounded-optimal agents. *Journal of Artificial Intelligence Research* 2:575-609. https://doi.org/10.1613/jair.133
172. Genewein, T., Leibfried, F., Grau-Moya, J. and Braun, D. A. (2015). Bounded rationality, abstraction, and hierarchical decision-making: an information-theoretic optimality principle. *Frontiers in Robotics and AI* 2:27. https://doi.org/10.3389/frobt.2015.00027
173. Legg, S. and Hutter, M. (2007). Universal intelligence: a definition of machine intelligence. *Minds and Machines* 17:391-444. https://doi.org/10.1007/s11023-007-9079-x
174. Takahashi, K. and Hayashi, Y. (2026). Thermodynamic limits of physical intelligence. arXiv:2602.05463 (preprint).
175. Laughlin, S. B., de Ruyter van Steveninck, R. R. and Anderson, J. C. (1998). The metabolic cost of neural information. *Nature Neuroscience* 1:36-41. https://doi.org/10.1038/236
176. Attwell, D. and Laughlin, S. B. (2001). An energy budget for signaling in the grey matter of the brain. *Journal of Cerebral Blood Flow and Metabolism* 21:1133-1145. https://doi.org/10.1097/00004647-200110000-00001
177. Lennie, P. (2003). The cost of cortical computation. *Current Biology* 13:493-497. https://doi.org/10.1016/S0960-9822(03)00135-0
178. Sengupta, B., Stemmler, M., Laughlin, S. B. and Niven, J. E. (2010). Action potential energy efficiency varies among neuron types in vertebrates and invertebrates. *PLoS Computational Biology* 6:e1000840. https://doi.org/10.1371/journal.pcbi.1000840
179. Sengupta, B., Stemmler, M. B. and Friston, K. J. (2013). Information and efficiency in the nervous system: a synthesis. *PLoS Computational Biology* 9:e1003157. https://doi.org/10.1371/journal.pcbi.1003157
180. Horowitz, M. (2014). Computing's energy problem (and what we can do about it). *2014 IEEE International Solid-State Circuits Conference*, pp. 10-14. https://doi.org/10.1109/ISSCC.2014.6757323
181. Saad-Falcon, J., Narayan, A., Akengin, H. O., Griffin, J. W. et al. (2025). Intelligence per watt: measuring intelligence efficiency of local AI. arXiv:2511.07885 (preprint).
182. Tschand, A., Rajan, A. T. R., Idgunji, S., Ghosh, A. et al. (2024). MLPerf Power: benchmarking the energy efficiency of machine learning systems from microwatts to megawatts. arXiv:2410.12032 (preprint).
183. Chung, J.-W., Ma, J. J., Wu, R., Liu, J. et al. (2025). The ML.ENERGY benchmark: toward automated inference energy measurement and optimization. arXiv:2505.06371 (preprint).
184. Niu, C., Zhang, W., Li, J., Zhao, Y. et al. (2025). TokenPowerBench: benchmarking the power consumption of LLM inference. arXiv:2512.03024 (preprint).
185. Jin, Y., Wei, G.-Y. and Brooks, D. (2025). The energy cost of reasoning: analyzing energy usage in LLMs with test-time compute. arXiv:2505.14733 (preprint).
186. Luccioni, S., Jernite, Y. and Strubell, E. (2024). Power hungry processing: watts driving the cost of AI deployment? *ACM FAccT 2024*, pp. 85-99. https://doi.org/10.1145/3630106.3658542
187. Khan, K. N., Hirki, M., Niemi, T., Nurminen, J. K. and Ou, Z. (2018). RAPL in action: experiences in using RAPL for power measurements. *ACM Transactions on Modeling and Performance Evaluation of Computing Systems* 3:1-26. https://doi.org/10.1145/3177754
188. Desrochers, S., Paradis, C. and Weaver, V. M. (2016). A validation of DRAM RAPL power measurements. *Proceedings of the Second International Symposium on Memory Systems*, pp. 455-470. https://doi.org/10.1145/2989081.2989088
189. Hackenberg, D., Schöne, R., Ilsche, T., Molka, D., Schuchart, J. and Geyer, R. (2015). An energy efficiency feature survey of the Intel Haswell processor. *2015 IEEE IPDPS Workshops*, pp. 896-904. https://doi.org/10.1109/IPDPSW.2015.70
190. Apple. powermetrics(1) manual page. macOS developer tools documentation.
191. Hutter Prize for Lossless Compression of Human Knowledge. http://prize.hutter1.net/
192. Strubell, E., Ganesh, A. and McCallum, A. (2019). Energy and policy considerations for deep learning in NLP. arXiv:1906.02243 (preprint).
193. Patterson, D., Gonzalez, J., Le, Q., Liang, C. et al. (2021). Carbon emissions and large neural network training. arXiv:2104.10350 (preprint).
194. Lacoste, A., Luccioni, A., Schmidt, V. and Dandres, T. (2019). Quantifying the carbon emissions of machine learning. arXiv:1910.09700 (preprint).
195. Luccioni, A. S., Viguier, S. and Ligozat, A.-L. (2022). Estimating the carbon footprint of BLOOM, a 176B parameter language model. arXiv:2211.02001 (preprint).
196. Anthony, L. F. W., Kanding, B. and Selvan, R. (2020). Carbontracker: tracking and predicting the carbon footprint of training deep learning models. arXiv:2007.03051 (preprint).
197. Schmidhuber, J. (2010). Formal theory of creativity, fun, and intrinsic motivation (1990-2010). *IEEE Transactions on Autonomous Mental Development* 2:230-247. https://doi.org/10.1109/TAMD.2010.2056368
198. Chollet, F. (2019). On the measure of intelligence. arXiv:1911.01547 (preprint).
199. Hernández-Orallo, J. (2017). *The Measure of All Minds: Evaluating Natural and Artificial Intelligence*. Cambridge University Press. https://doi.org/10.1017/9781316594179
200. Gershman, S. J., Horvitz, E. J. and Tenenbaum, J. B. (2015). Computational rationality: a converging paradigm for intelligence in brains, minds, and machines. *Science* 349:273-278. https://doi.org/10.1126/science.aac6076
201. Lieder, F. and Griffiths, T. L. (2020). Resource-rational analysis: understanding human cognition as the optimal use of limited computational resources. *Behavioral and Brain Sciences* 43:e1. https://doi.org/10.1017/S0140525X1900061X
202. Balasubramanian, V. (2021). Brain power. *PNAS* 118:e2107022118. https://doi.org/10.1073/pnas.2107022118
203. Silver, D., Singh, S., Precup, D. and Sutton, R. S. (2021). Reward is enough. *Artificial Intelligence* 299:103535. https://doi.org/10.1016/j.artint.2021.103535
204. Vamplew, P., Smith, B. J., Källström, J., Ramos, G., Rădulescu, R. et al. (2022). Scalar reward is not enough: a response to Silver, Singh, Precup and Sutton (2021). *Autonomous Agents and Multi-Agent Systems* 36:41. https://doi.org/10.1007/s10458-022-09575-5
205. Hafez, W., Wei, C., Pena, R., Nazeri, A. et al. (2026). A mathematical theory of agency and intelligence. arXiv:2602.22519 (preprint).
206. Karagoz, A. (2025). Energentic intelligence: from self-sustaining systems to enduring artificial life. arXiv:2506.04916 (preprint).
207. Poplavskii, R. P. (1975). Thermodynamic models of information processes. *Uspekhi Fizicheskikh Nauk* 115:465 (in Russian), https://doi.org/10.3367/UFNr.0115.197503d.0465. English translation: *Soviet Physics Uspekhi* 18:222-241, https://doi.org/10.1070/PU1975v018n03ABEH001955
208. Ito, S. and Sagawa, T. (2017). Information thermodynamics on networks and its application to biological information processing. *Butsuri* (日本物理学会誌) 72(9):658 (in Japanese). https://doi.org/10.11316/butsuri.72.9_658
209. Sun, C.-P. and Quan, H.-T. (2013). Maxwell's demon and the physical limits on information processing. *Wuli* (物理, Physics) 42(11) (in Chinese). doi:10.7693/wl20131101
210. Quan, H.-T., Dong, H. and Sun, C.-P. (2023). Theory and experiments of mesoscopic statistical thermodynamics. *Acta Physica Sinica* 72:230501 (in Chinese, with English abstract). https://doi.org/10.7498/aps.72.20231608
211. Parrondo, J. M. R. (2023). Thermodynamics of information. arXiv:2306.12447 (encyclopedia chapter preprint).
212. Strasberg, P. Thermodynamics and information processing at the nanoscale. Doctoral thesis, Technische Universität Berlin.
213. Dago, S. (2022). Thermodynamique stochastique: pilotage de micro-oscillateurs et applications à l'étude et l'optimisation du traitement de l'information. Doctoral thesis, École normale supérieure de Lyon (in French). https://theses.fr/2022LYSEN019
214. Lagoin, M. (2023). Thermodynamique dans les systèmes stationnaires hors équilibre macroscopiques: démons de Maxwell et machines thermiques aléatoires. Doctoral thesis, École normale supérieure de Lyon (in French).
215. Ciampini, M. A., Mancino, L., Orieux, A., Vigliar, C. et al. (2017). Experimental extractable work-based multipartite separability criteria. *npj Quantum Information* 3:10. https://doi.org/10.1038/s41534-017-0011-9
216. Sudakov, K. V. (2004). Functional systems theory and the probabilistic prediction of behavior. *Neuroscience and Behavioral Physiology* 34:505-507. https://doi.org/10.1023/B:NEAB.0000022638.96382.dd
217. Sudakov, K. V. (2015). Theory of functional systems: a keystone of integrative biology. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 153-173. https://doi.org/10.1007/978-3-319-19446-2_9
218. Sudakov, K. V. (2022). Cognitive activity from the perspective of functional systems theory. In *Russian Cognitive Neuroscience*, Brill, pp. 87-117. https://doi.org/10.1163/9789004505667_005
219. Shvyrkov, V. B. (1985). Toward a psychophysiological theory of behavior. *Advances in Psychology*, pp. 47-71. https://doi.org/10.1016/S0166-4115(08)61596-4
220. Anokhin, K. V. (2021). The cognitome: seeking the fundamental neuroscience of a theory of consciousness. *Neuroscience and Behavioral Physiology* 51:915-937. https://doi.org/10.1007/s11055-021-01149-4
221. Saltykov, A. and Grachev, S. (2015). Anticipation and the concept of system-forming factor in the theory of functional systems. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 507-520. https://doi.org/10.1007/978-3-319-19446-2_30
222. Vityaev, E. E. (2015). Purposefulness as a principle of brain activity. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 231-254. https://doi.org/10.1007/978-3-319-19446-2_13
223. Vityaev, E. E. and Demin, A. V. (2011). Recursive subgoals discovery based on the functional systems theory. *Frontiers in Artificial Intelligence and Applications* (BICA 2011), IOS Press. https://doi.org/10.3233/978-1-60750-959-2-425
224. Vityaev, E. E. and Demin, A. V. (2018). Cognitive architecture based on the functional systems theory. *Procedia Computer Science* 145:623-628. https://doi.org/10.1016/j.procs.2018.11.072
225. Vityaev, E., Kolonin, A., Kurpatov, A., Molchanov, A. et al. (2022). Brain principles programming. arXiv:2202.12710 (preprint).
226. Potapov, A., Belikov, A., Bogdanov, V., Scherbatiy, A. et al. (2019). Differentiable probabilistic logic networks. arXiv:1907.04592 (preprint).
227. Kenton, Z., Kumar, R., Farquhar, S., Richens, J. et al. (2023). Discovering agents. *Artificial Intelligence* 322:103963. https://doi.org/10.1016/j.artint.2023.103963
228. Richens, J. and Everitt, T. (2024). Robust agents learn causal world models. arXiv:2402.10877 (preprint).
229. Richens, J., Abel, D., Bellot, A. and Everitt, T. (2025). General agents contain world models. arXiv:2506.01622 (preprint).
230. MacDermott, M., Fox, J., Belardinelli, F. and Everitt, T. (2024). Measuring goal-directedness. arXiv:2412.04758 (preprint).
231. Orseau, L., McGregor McGill, S. and Legg, S. (2018). Agents and devices: a relative definition of agency. arXiv:1805.12387 (preprint).
232. Biehl, M. and Virgo, N. (2023). Interpreting systems as solving POMDPs: a step towards a formal understanding of agency. In *Active Inference: IWAI 2022*, Communications in Computer and Information Science 1721, Springer, pp. 16-31. https://doi.org/10.1007/978-3-031-28719-0_2
233. Virgo, N., Biehl, M. and McGregor, S. (2021). Interpreting dynamical systems as Bayesian reasoners. In *Machine Learning and Principles and Practice of Knowledge Discovery in Databases* (ECML PKDD 2021 workshops), Communications in Computer and Information Science, Springer, pp. 726-762. https://doi.org/10.1007/978-3-030-93736-2_52
234. McGregor, S. (2017). The Bayesian stance: equations for 'as-if' sensorimotor agency. *Adaptive Behavior* 25:72-82. https://doi.org/10.1177/1059712317700501
235. Barzegar, A., Margoni, E. and Oriti, D. (2025). A minimalist account of agency in physics. *Studies in History and Philosophy of Science* 112:112-122. https://doi.org/10.1016/j.shpsa.2025.06.004
236. Bartlett, S., Eckford, A. W., Egbert, M., Lingam, M. et al. (2025). Physics of life: exploring information as a distinctive feature of living systems. *PRX Life* 3:037003. https://doi.org/10.1103/rsx4-8x5f
237. Crutchfield, J. P. and Jurgens, A. (2025). Agentic information theory: ergodicity and intrinsic semantics of information processes. arXiv:2505.19275 (preprint).
238. De Bari, B., Dixon, J., Kondepudi, D. and Vaidya, A. (2023). Thermodynamics, organisms and behaviour. *Philosophical Transactions of the Royal Society A: Mathematical, Physical and Engineering Sciences* 381:20220278. https://doi.org/10.1098/rsta.2022.0278
239. Perunov, N., Marsland, R. A. and England, J. L. (2016). Statistical physics of adaptation. *Physical Review X* 6:021036. https://doi.org/10.1103/PhysRevX.6.021036
240. Levin, M. (2022). Technological approach to mind everywhere: an experimentally-grounded framework for understanding diverse bodies and minds. *Frontiers in Systems Neuroscience* 16:768201. https://doi.org/10.3389/fnsys.2022.768201
241. Lyon, P., Keijzer, F., Arendt, D. and Levin, M. (2021). Reframing cognition: getting down to biological basics. *Philosophical Transactions of the Royal Society B: Biological Sciences* 376:20190750. https://doi.org/10.1098/rstb.2019.0750
242. Barandiaran, X. E. and Almendros, L. S. (2024). Transforming agency: on the mode of existence of large language models. arXiv:2407.10735 (preprint).
243. Bruineberg, J., Dołęga, K., Dewhurst, J. and Baltieri, M. (2022). The emperor's new Markov blankets. *Behavioral and Brain Sciences* 45:e183. https://doi.org/10.1017/S0140525X21002351
244. Aguilera, M., Millidge, B., Tschantz, A. and Buckley, C. L. (2022). How particular is the physics of the free energy principle? *Physics of Life Reviews* 40:24-50. https://doi.org/10.1016/j.plrev.2021.11.001
245. Biehl, M., Pollock, F. A. and Kanai, R. (2021). A technical critique of some parts of the free energy principle. *Entropy* 23:293. https://doi.org/10.3390/e23030293
246. Kirchhoff, M., Parr, T., Palacios, E., Friston, K. and Kiverstein, J. (2018). The Markov blankets of life: autonomy, active inference and the free energy principle. *Journal of The Royal Society Interface* 15:20170792. https://doi.org/10.1098/rsif.2017.0792
247. Da Costa, L., Friston, K., Heins, C. and Pavliotis, G. A. (2021). Bayesian mechanics for stationary processes. *Proceedings of the Royal Society A: Mathematical, Physical and Engineering Sciences* 477:20210518. https://doi.org/10.1098/rspa.2021.0518
248. Ramstead, M. J. D., Sakthivadivel, D. A. R., Heins, C., Koudahl, M. et al. (2023). On Bayesian mechanics: a physics of and by beliefs. *Interface Focus* 13:20220029. https://doi.org/10.1098/rsfs.2022.0029
249. Friston, K., Da Costa, L., Sajid, N., Heins, C. et al. (2023). The free energy principle made simpler but not too simple. *Physics Reports* 1024:1-29. https://doi.org/10.1016/j.physrep.2023.07.001
250. Rosas, F. E., Mediano, P. A. M., Biehl, M., Chandaria, S. and Polani, D. (2020). Causal blankets: theory and algorithmic framework. In *Active Inference: IWAI 2020*, Communications in Computer and Information Science, Springer, pp. 187-198. https://doi.org/10.1007/978-3-030-64919-7_19
251. Krakauer, D., Bertschinger, N., Olbrich, E., Flack, J. C. and Ay, N. (2020). The information theory of individuality. *Theory in Biosciences* 139:209-223. https://doi.org/10.1007/s12064-020-00313-7
252. Bertschinger, N., Olbrich, E., Ay, N. and Jost, J. (2008). Autonomy: an information theoretic perspective. *Biosystems* 91:331-345. https://doi.org/10.1016/j.biosystems.2007.05.018
253. Albantakis, L., Barbosa, L., Findlay, G., Grasso, M. et al. (2023). Integrated information theory (IIT) 4.0: formulating the properties of phenomenal existence in physical terms. *PLOS Computational Biology* 19:e1011465. https://doi.org/10.1371/journal.pcbi.1011465
254. Hoel, E. P., Albantakis, L. and Tononi, G. (2013). Quantifying causal emergence shows that macro can beat micro. *Proceedings of the National Academy of Sciences* 110:19790-19795. https://doi.org/10.1073/pnas.1314922110
255. Adams, F. and Aizawa, K. (2010). *The Bounds of Cognition*. Wiley-Blackwell. https://doi.org/10.1002/9781444391718
256. Seth, A. K. and Tsakiris, M. (2018). Being a beast machine: the somatic basis of selfhood. *Trends in Cognitive Sciences* 22:969-981. https://doi.org/10.1016/j.tics.2018.08.008
257. Sterling, P. (2012). Allostasis: a model of predictive regulation. *Physiology & Behavior* 106:5-15. https://doi.org/10.1016/j.physbeh.2011.06.004
258. Ay, N. and Polani, D. (2008). Information flows in causal networks. *Advances in Complex Systems* 11:17-41. https://doi.org/10.1142/S0219525908001465
259. Janzing, D., Balduzzi, D., Grosse-Wentrup, M. and Schölkopf, B. (2013). Quantifying causal influences. *The Annals of Statistics* 41. https://doi.org/10.1214/13-AOS1145
260. James, R. G., Barnett, N. and Crutchfield, J. P. (2016). Information flows? A critique of transfer entropies. *Physical Review Letters* 116:238701. https://doi.org/10.1103/PhysRevLett.116.238701
261. Lizier, J. T. and Prokopenko, M. (2010). Differentiating information transfer and causal effect. *The European Physical Journal B* 73:605-615. https://doi.org/10.1140/epjb/e2010-00034-5
262. Albantakis, L., Marshall, W., Hoel, E. and Tononi, G. (2019). What caused what? A quantitative account of actual causation using dynamical causal networks. *Entropy* 21:459. https://doi.org/10.3390/e21050459
263. Juel, B. E., Comolatti, R., Tononi, G. and Albantakis, L. (2019). When is an action caused from within? Quantifying the causal chain leading to actions in simulated agents. arXiv:1904.02995 (preprint).
264. Albantakis, L. (2021). Quantifying the autonomy of structurally diverse automata: a comparison of candidate measures. *Entropy* 23:1415. https://doi.org/10.3390/e23111415
265. Marshall, W., Kim, H., Walker, S. I., Tononi, G. and Albantakis, L. (2017). How causal analysis can reveal autonomy in models of biological systems. *Philosophical Transactions of the Royal Society A: Mathematical, Physical and Engineering Sciences* 375:20160358. https://doi.org/10.1098/rsta.2016.0358
266. Albantakis, L., Massari, F., Beheler-Amass, M. and Tononi, G. (2021). A macro agent and its actions. In *Top-Down Causation and Emergence*, Synthese Library, Springer, pp. 135-155. https://doi.org/10.1007/978-3-030-71899-2_7
267. Fiderer, L. J., Barth, P. C., Smith, I. D. and Briegel, H. J. (2025). Information thermodynamics of agents: the work capacity of channels with memory. arXiv:2504.06209 (preprint).
268. Hartle, H., Wolpert, D., Stier, A., Kempes, C. P. and Manzano, G. (2024). Work extraction with feedback control using limited resources. arXiv:2407.05507 (preprint).
269. Kamijima, T., Funo, K. and Sagawa, T. (2024). Finite-time thermodynamic bounds and tradeoff relations for information processing. arXiv:2409.08606 (preprint).
270. Kolchinsky, A. and Wolpert, D. H. (2021). Work, entropy production, and thermodynamics of information under protocol constraints. *Physical Review X* 11:041024. https://doi.org/10.1103/PhysRevX.11.041024
271. Wolpert, D. H., Korbel, J., Lynn, C. W., Tasnim, F. et al. (2024). Is stochastic thermodynamics the key to understanding the energy costs of computation? *Proceedings of the National Academy of Sciences* 121:e2321112121. https://doi.org/10.1073/pnas.2321112121
272. Manzano, G., Kardeş, G., Roldán, É. and Wolpert, D. H. (2024). Thermodynamics of computations with absolute irreversibility, unidirectional transitions, and stochastic computation times. *Physical Review X* 14:021026. https://doi.org/10.1103/PhysRevX.14.021026
273. Korbel, J. and Wolpert, D. H. (2024). Nonequilibrium thermodynamics of uncertain stochastic processes. *Physical Review Research* 6:013021. https://doi.org/10.1103/PhysRevResearch.6.013021
274. Wolpert, D. H. and Kolchinsky, A. (2020). Thermodynamics of computing with circuits. *New Journal of Physics* 22:063047. https://doi.org/10.1088/1367-2630/ab82b8
275. Sandberg, H., Delvenne, J.-C., Newton, N. J. and Mitter, S. K. (2014). Maximum work extraction and implementation costs for nonequilibrium Maxwell's demons. *Physical Review E* 90:042119. https://doi.org/10.1103/PhysRevE.90.042119
276. Horowitz, J. M. and Sandberg, H. (2014). Second-law-like inequalities with information and their interpretations. *New Journal of Physics* 16:125007. https://doi.org/10.1088/1367-2630/16/12/125007
277. Still, S. (2009). Information-theoretic approach to interactive learning. *EPL* 85:28005. https://doi.org/10.1209/0295-5075/85/28005
278. Still, S. and Precup, D. (2012). An information-theoretic approach to curiosity-driven reinforcement learning. *Theory in Biosciences* 131:139-148. https://doi.org/10.1007/s12064-011-0142-z
279. Fields, C., Goldstein, A. and Sandved-Smith, L. (2024). Making the thermodynamic cost of active inference explicit. *Entropy* 26:622. https://doi.org/10.3390/e26080622
280. Goerlich, R., Hoek, L., Chor, O., Rahav, S. and Roichman, Y. (2025). Experimental realizations of information engines: beyond proof of concept. *Europhysics Letters* 149:61001. https://doi.org/10.1209/0295-5075/adbb17
281. Cocconi, L. and Chen, L. (2024). Efficiency of an autonomous, dynamic information engine operating on a single active particle. *Physical Review E* 110:014602. https://doi.org/10.1103/PhysRevE.110.014602
282. Goldt, S. and Seifert, U. (2017). Thermodynamic efficiency of learning a rule in neural networks. *New Journal of Physics* 19:113001. https://doi.org/10.1088/1367-2630/aa89ff
283. Tkachenko, A. V. (2025). Thermodynamic cost of inference and learning in physical neural networks. arXiv:2503.09980 (preprint). Title of the current arXiv version.
284. Tatikonda, S. and Mitter, S. (2004). Control under communication constraints. *IEEE Transactions on Automatic Control* 49:1056-1068. https://doi.org/10.1109/TAC.2004.831187
285. Nair, G. N. and Evans, R. J. (2004). Stabilizability of stochastic linear systems with finite feedback data rates. *SIAM Journal on Control and Optimization* 43:413-436. https://doi.org/10.1137/S0363012902402116
286. Nair, G. N., Fagnani, F., Zampieri, S. and Evans, R. J. (2007). Feedback control under data rate constraints: an overview. *Proceedings of the IEEE* 95:108-137. https://doi.org/10.1109/JPROC.2006.887294
287. Van Vu, T. and Hasegawa, Y. (2020). Thermodynamic uncertainty relations under arbitrary control protocols. *Physical Review Research* 2:013060. https://doi.org/10.1103/PhysRevResearch.2.013060
288. Tanogami, T., Van Vu, T. and Saito, K. (2023). Universal bounds on the performance of information-thermodynamic engine. *Physical Review Research* 5:043280. https://doi.org/10.1103/PhysRevResearch.5.043280
289. Honma, R. and Van Vu, T. (2026). Thermodynamic uncertainty relation with quantum feedback. *Physical Review Letters*. https://doi.org/10.1103/6d8l-94pv. Preprint: arXiv:2602.22651.
290. Kumasaki, K., Tojo, K., Sagawa, T. and Funo, K. (2026). Thermodynamic uncertainty relation for feedback cooling. *Physical Review E* 113:024134. https://doi.org/10.1103/4pq6-7djm
291. Hasegawa, Y. (2020). Quantum thermodynamic uncertainty relation for continuous measurement. *Physical Review Letters* 125:050601. https://doi.org/10.1103/PhysRevLett.125.050601
292. Hasegawa, Y. (2023). Unifying speed limit, thermodynamic uncertainty relation and Heisenberg principle via bulk-boundary correspondence. *Nature Communications* 14:2828. https://doi.org/10.1038/s41467-023-38074-8
293. Van Vu, T. and Hasegawa, Y. (2021). Geometrical bounds of the irreversibility in Markovian systems. *Physical Review Letters* 126:010601. https://doi.org/10.1103/PhysRevLett.126.010601
294. Delvenne, J.-C. and Falasco, G. (2024). Thermokinetic relations. *Physical Review E* 109:014109. https://doi.org/10.1103/PhysRevE.109.014109
295. Lee, J. S., Lee, S., Kwon, H. and Park, H. (2022). Speed limit for a highly irreversible process and tight finite-time Landauer's bound. *Physical Review Letters* 129:120603. https://doi.org/10.1103/PhysRevLett.129.120603
296. Van Vu, T. and Saito, K. (2022). Finite-time quantum Landauer principle and quantum coherence. *Physical Review Letters* 128:010602. https://doi.org/10.1103/PhysRevLett.128.010602
297. Rolandi, A. and Perarnau-Llobet, M. (2023). Finite-time Landauer principle beyond weak coupling. *Quantum* 7:1161. https://doi.org/10.22331/q-2023-11-03-1161
298. Dago, S. and Bellon, L. (2022). Dynamics of information erasure and extension of Landauer's bound to fast processes. *Physical Review Letters* 128:070604. https://doi.org/10.1103/PhysRevLett.128.070604
299. Fujimoto, Y. and Ito, S. (2024). Game-theoretical approach to minimum entropy productions in information thermodynamics. *Physical Review Research* 6:013023. https://doi.org/10.1103/PhysRevResearch.6.013023
300. Gingrich, T. R. and Horowitz, J. M. (2017). Fundamental bounds on first passage time fluctuations for currents. *Physical Review Letters* 119:170601. https://doi.org/10.1103/PhysRevLett.119.170601
301. Garrahan, J. P. (2017). Simple bounds on fluctuations and uncertainty relations for first-passage times of counting observables. *Physical Review E* 95:032134. https://doi.org/10.1103/PhysRevE.95.032134
302. Neri, I., Roldán, É. and Jülicher, F. (2017). Statistics of infima and stopping times of entropy production and applications to active molecular processes. *Physical Review X* 7:011019. https://doi.org/10.1103/PhysRevX.7.011019
303. Wolpert, D. H. (2020). Minimal entropy production rate of interacting systems. *New Journal of Physics* 22:113013. https://doi.org/10.1088/1367-2630/abc5c6
304. Wolpert, D. H. (2020). Uncertainty relations and fluctuation theorems for Bayes nets. *Physical Review Letters* 125:200602. https://doi.org/10.1103/PhysRevLett.125.200602
305. Tasnim, F. and Wolpert, D. H. (2023). Stochastic thermodynamics of multiple co-evolving systems: beyond multipartite processes. *Entropy* 25:1078. https://doi.org/10.3390/e25071078
306. Rolandi, A., Abiuso, P. and Perarnau-Llobet, M. (2023). Collective advantages in finite-time thermodynamics. *Physical Review Letters* 131:210401. https://doi.org/10.1103/PhysRevLett.131.210401
307. Crosato, E., Spinney, R. E., Nigmatullin, R., Lizier, J. T. and Prokopenko, M. (2018). Thermodynamics and computation during collective motion near criticality. *Physical Review E* 97:012120. https://doi.org/10.1103/PhysRevE.97.012120
308. Chen, Q. and Prokopenko, M. (2025). Why collective behaviours self-organize to criticality: a primer on information-theoretic and thermodynamic utility measures. *Royal Society Open Science* 12:241655. https://doi.org/10.1098/rsos.241655
309. Adlam, E. C., McQueen, K. J. and Waegell, M. (2025). Agency cannot be a purely quantum phenomenon. arXiv:2510.13247 (preprint).
310. Elliott, T. J., Gu, M., Garner, A. J. P. and Thompson, J. (2022). Quantum adaptive agents with efficient long-term memories. *Physical Review X* 12:011007. https://doi.org/10.1103/PhysRevX.12.011007
311. Saggio, V., Asenbeck, B. E., Hamann, A., Strömberg, T. et al. (2021). Experimental quantum speed-up in reinforcement learning agents. *Nature* 591:229-233. https://doi.org/10.1038/s41586-021-03242-7
312. Guryanova, Y., Friis, N. and Huber, M. (2020). Ideal projective measurements have infinite resource costs. *Quantum* 4:222. https://doi.org/10.22331/q-2020-01-13-222
313. Danageozian, A., Wilde, M. M. and Buscemi, F. (2022). Thermodynamic constraints on quantum information gain and error correction: a triple trade-off. *PRX Quantum* 3:020318. https://doi.org/10.1103/PRXQuantum.3.020318
314. Jacobs, K. (2009). Second law of thermodynamics and quantum feedback control: Maxwell's demon with weak measurements. *Physical Review A* 80:012322. https://doi.org/10.1103/PhysRevA.80.012322
315. Funo, K., Watanabe, Y. and Ueda, M. (2013). Integral quantum fluctuation theorems under measurement and feedback control. *Physical Review E* 88:052121. https://doi.org/10.1103/PhysRevE.88.052121
316. Linpeng, X., Bresque, L., Maffei, M., Jordan, A. N. et al. (2022). Energetic cost of measurements using quantum, coherent, and thermal light. *Physical Review Letters* 128:220506. https://doi.org/10.1103/PhysRevLett.128.220506
317. Marín Guzmán, J. A., Erker, P., Gasparinetti, S., Huber, M. and Yunger Halpern, N. (2024). Key issues review: useful autonomous quantum machines. *Reports on Progress in Physics* 87:122001. https://doi.org/10.1088/1361-6633/ad8803
318. Lipka-Bartosik, P., Perarnau-Llobet, M. and Brunner, N. (2024). Thermodynamic computing via autonomous quantum thermal machines. *Science Advances* 10:eadm8792. https://doi.org/10.1126/sciadv.adm8792
319. Mattingly, H. H., Kamino, K., Machta, B. B. and Emonet, T. (2021). *Escherichia coli* chemotaxis is information limited. *Nature Physics* 17:1426-1431. https://doi.org/10.1038/s41567-021-01380-3
320. Tjalma, A. J., Galstyan, V., Goedhart, J., Slim, L. et al. (2023). Trade-offs between cost and information in cellular prediction. *Proceedings of the National Academy of Sciences* 120:e2303078120. https://doi.org/10.1073/pnas.2303078120
321. Bryant, S. J. and Machta, B. B. (2023). Physical constraints in intracellular signaling: the cost of sending a bit. *Physical Review Letters* 131:068401. https://doi.org/10.1103/PhysRevLett.131.068401
322. Padamsey, Z., Katsanevaki, D., Dupuy, N. and Rochefort, N. L. (2022). Neocortex saves energy by reducing coding precision during food scarcity. *Neuron* 110:280-296.e10. https://doi.org/10.1016/j.neuron.2021.10.024
323. Plaçais, P.-Y. and Preat, T. (2013). To favor survival under food shortage, the brain disables costly memory. *Science* 339:440-442. https://doi.org/10.1126/science.1226018
324. Plaçais, P.-Y., de Tredern, É., Scheunemann, L., Trannoy, S. et al. (2017). Upregulated energy metabolism in the *Drosophila* mushroom body is the trigger for long-term memory. *Nature Communications* 8:15510. https://doi.org/10.1038/ncomms15510
325. Mery, F. and Kawecki, T. J. (2005). A cost of long-term memory in *Drosophila*. *Science* 308:1148. https://doi.org/10.1126/science.1111331
326. Hechler, A., de Lange, F. P. and Riedl, V. (2023). The energy metabolic footprint of predictive processing in the human brain. bioRxiv preprint, version 2 posted 2024. https://doi.org/10.1101/2023.12.08.570804
327. Levy, W. B. and Calvert, V. G. (2021). Communication consumes 35 times more energy than computation in the human cortex, but both costs are needed to predict synapse number. *Proceedings of the National Academy of Sciences* 118:e2008173118. https://doi.org/10.1073/pnas.2008173118
328. Harris, J. J., Jolivet, R. and Attwell, D. (2012). Synaptic energy use and supply. *Neuron* 75:762-777. https://doi.org/10.1016/j.neuron.2012.08.019
329. Harris, J. J., Jolivet, R., Engl, E. and Attwell, D. (2015). Energy-efficient information transfer by visual pathway synapses. *Current Biology* 25:3151-3160. https://doi.org/10.1016/j.cub.2015.10.063
330. Niven, J. E. and Laughlin, S. B. (2008). Energy limitation as a selective pressure on the evolution of sensory systems. *Journal of Experimental Biology* 211:1792-1804. https://doi.org/10.1242/jeb.017574
331. Balasubramanian, V., Kimber, D. and Berry, M. J., II (2001). Metabolically efficient information processing. *Neural Computation* 13:799-815. https://doi.org/10.1162/089976601300014358
332. Sterling, P. and Laughlin, S. (2015). *Principles of Neural Design*. MIT Press. https://doi.org/10.7551/mitpress/9780262028707.001.0001
333. Malkin, J., O'Donnell, C., Houghton, C. J. and Aitchison, L. (2024). Signatures of Bayesian inference emerge from energy-efficient synapses. *eLife* 12:RP92595. https://doi.org/10.7554/eLife.92595
334. Li, H. L. and van Rossum, M. C. W. (2020). Energy efficient synaptic plasticity. *eLife* 9:e50804. https://doi.org/10.7554/eLife.50804
335. Lynn, C. W., Cornblath, E. J., Papadopoulos, L., Bertolero, M. A. and Bassett, D. S. (2021). Broken detailed balance and entropy production in the human brain. *Proceedings of the National Academy of Sciences* 118:e2109889118. https://doi.org/10.1073/pnas.2109889118
336. Lynn, C. W., Holmes, C. M., Bialek, W. and Schwab, D. J. (2022). Decomposing the local arrow of time in interacting systems. *Physical Review Letters* 129:118101. https://doi.org/10.1103/PhysRevLett.129.118101
337. Yik, J., Van den Berghe, K., den Blanken, D., Bouhadjar, Y. et al. (2025). The NeuroBench framework for benchmarking neuromorphic computing algorithms and systems. *Nature Communications* 16:1545. https://doi.org/10.1038/s41467-025-56739-4
338. Davies, M., Wild, A., Orchard, G., Sandamirskaya, Y. et al. (2021). Advancing neuromorphic computing with Loihi: a survey of results and outlook. *Proceedings of the IEEE* 109:911-934. https://doi.org/10.1109/JPROC.2021.3067593
339. Samsi, S., Zhao, D., McDonald, J., Li, B. et al. (2023). From words to watts: benchmarking the energy costs of large language model inference. *2023 IEEE High Performance Extreme Computing Conference (HPEC)*, pp. 1-9. https://doi.org/10.1109/HPEC58863.2023.10363447
340. Elsworth, C., Huang, K., Patterson, D., Schneider, I. et al. (2025). Measuring the environmental impact of delivering AI at Google scale. arXiv:2508.15734 (preprint).
341. Melanson, D., Abu Khater, M., Aifer, M., Donatella, K. et al. (2025). Thermodynamic computing system for AI applications. *Nature Communications* 16:3757. https://doi.org/10.1038/s41467-025-59011-x
342. Stern, M. and Murugan, A. (2023). Learning without neurons in physical systems. *Annual Review of Condensed Matter Physics* 14:417-441. https://doi.org/10.1146/annurev-conmatphys-040821-113439
343. Dillavou, S., Stern, M., Liu, A. J. and Durian, D. J. (2022). Demonstration of decentralized physics-driven learning. *Physical Review Applied* 18:014040. https://doi.org/10.1103/PhysRevApplied.18.014040
344. Stern, M., Dillavou, S., Jayaraman, D., Durian, D. J. and Liu, A. J. (2024). Training self-learning circuits for power-efficient solutions. *APL Machine Learning* 2:016114. https://doi.org/10.1063/5.0181382
345. Hernández-Orallo, J. and Dowe, D. L. (2010). Measuring universal intelligence: towards an anytime intelligence test. *Artificial Intelligence* 174:1508-1539. https://doi.org/10.1016/j.artint.2010.09.006
346. Chollet, F., Knoop, M., Kamradt, G. and Landers, B. (2024). ARC Prize 2024: technical report. arXiv:2412.04604 (preprint).
347. Chollet, F., Knoop, M., Kamradt, G., Landers, B. and Pinkard, H. (2025). ARC-AGI-2: a new challenge for frontier AI reasoning systems. arXiv:2505.11831 (preprint).
348. ARC Prize Foundation. ARC-AGI leaderboard. https://arcprize.org/leaderboard (accessed 8 October 2026).
349. Chaisson, E. J. (2011). Energy rate density as a complexity metric and evolutionary driver. *Complexity* 16:27-40. https://doi.org/10.1002/cplx.20323
350. Sims, C. R. (2016). Rate-distortion theory and human perception. *Cognition* 152:181-198. https://doi.org/10.1016/j.cognition.2016.03.020
351. Gottwald, S. and Braun, D. A. (2020). The two kinds of free energy and the Bayesian revolution. *PLOS Computational Biology* 16:e1008420. https://doi.org/10.1371/journal.pcbi.1008420
352. Zénon, A., Solopchuk, O. and Pezzulo, G. (2019). An information-theoretic perspective on the costs of cognition. *Neuropsychologia* 123:5-18. https://doi.org/10.1016/j.neuropsychologia.2018.09.013
353. Ortega, P. A., Braun, D. A., Dyer, J., Kim, K.-E. and Tishby, N. (2015). Information-theoretic bounded rationality. arXiv:1512.06789 (preprint).
354. John Templeton Foundation. Agency, Directionality, and Function: Foundations for a Science of Purpose (grant page). https://www.templeton.org/grant/agency-directionality-and-function-foundations-for-a-science-of-purpose
355. Consortium for Advancing a Science of Purpose. History. https://www.biologicalpurpose.org/history
356. Minnesota Center for Philosophy of Science (2026). Announcing the Consortium for Advancing a Science of Purpose. https://cla.umn.edu/mcps/news-events/news/announcing-consortium-advancing-science-purpose
