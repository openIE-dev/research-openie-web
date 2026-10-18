---
title: "The Gap Between Possible and Deployed: A Cadence Model of Computer Intelligence and the Forcing Function of Automation Tools"
deck: "Methods that lower the cost of computer intelligence appear in public years before most products use them. This article measures that gap from dated sources, models how reporting and funding calendars set part of it, and states what data would refute the model."
id: latency
status: "Research study"
author: "David Charlot, Open Interface Engineering"
figures: "/living/"
pdf: "/pdfs/latency.pdf"
board_metered: false
---

# The Gap Between Possible and Deployed: A Cadence Model of Computer Intelligence and the Forcing Function of Automation Tools

*18 October 2026. Sources are dated and sorted by evidence class in the References. The propositions are derived by hand and have not been checked by a proof assistant, and none of the numbers in Section 7 is data.*

## Abstract

New methods for running computer intelligence at lower cost are published openly and then reach most products after a delay. This article defines that delay as a measurable quantity, splits it into technical, calendar and incentive parts, and models how a tool that lowers the cost of automation changes what a seller can profitably charge for. It states six propositions with derivations, six predictions that data could refute, and an experiment protocol that has not been run.

**In plain words**

1. Many ways to make computer intelligence cheaper and faster are published years before most people can use them in a product.
2. Part of that wait is real engineering work. Part of it comes from calendars: companies decide in quarterly and yearly steps, and investors fund in cycles of several years.
3. When a tool makes the work cheap enough, waiting stops paying for the seller, and what is left to charge for is the cost of switching away, not the cost of computing.

## Notation

| Term | Meaning in this article |
|---|---|
| Task | One unit of useful work with a stated quality threshold $q$, for example one correct answer or one checked estimate. |
| Joules per task, $e$ | Measured energy in joules to complete one task at quality at least $q$. The unit of account for computer intelligence here. |
| Cost per task, $c$ | Money cost of one task: $c = \kappa e + h$, where $\kappa$ is the price of a joule and $h$ is the hardware and operations cost that does not fall with $e$. |
| Capability frontier, $C(t)$ | The lowest cost per task reachable by any method that is publicly documented by time $t$. |
| Deployed frontier, $D(t)$ | The lowest cost per task offered in a generally available product by time $t$. |
| Latency, $L$ | At a cost level $c$, the time between the capability frontier reaching $c$ and the deployed frontier reaching $c$. Defined in Section 0. |
| Reporting period, $T$ | The spacing of decision dates in a firm that reports earnings, about a quarter. |
| Switching friction, $s$ | The per-task cost a buyer bears to move to another seller: integration, data transfer, retraining, contract terms, default settings. |
| Adoption cost, $K$ | One-time cost to rebuild an offering around a new method. |
| Tolerated shortfall, $w$ | The largest fall in reported earnings in one period that a firm will accept, in the same units as $K$. |

## 0. Definitions and scope

Let $c_C(t)$ be the lowest cost per task reachable at time $t$ by any publicly documented method at quality $q$. It is non-increasing, because documentation is not retracted. Let $c_D(t)$ be the lowest cost per task offered in a generally available product at time $t$. It is non-increasing for the same reason when a seller does not withdraw an offer, and $c_D(t) \ge c_C(t)$ by construction. For a cost level $c$, write $t_C(c) = \inf\{t : c_C(t) \le c\}$ and $t_D(c) = \inf\{t : c_D(t) \le c\}$.

**Definition 1 (latency).** $L(c) = t_D(c) - t_C(c) \ge 0$. The question of the article is how large $L$ is, what sets it, and what moves it.

**Definition 2 (technical, calendar and incentive parts).** For a firm $i$ the latency is decomposed as $L_i = d + w^{cad}_i + w^{gate}_i$. Here $d$ is the technical readiness delay: the time engineers need to port, test and harden the method. The term $w^{cad}_i$ is calendar wait: time between readiness and the next date on which the firm makes release decisions. The term $w^{gate}_i$ is incentive delay: time during which release has positive long-run value but a reporting or funding rule blocks it. The **artificial latency** is $L_i - d$. The word is used in a narrow sense: it is the part not explained by engineering time, and it is not a claim about anyone's motive.

**Scope.** The article covers methods that change the cost of computer intelligence: model architectures, number formats, kernels, compilers, statistical inference procedures and energy measurement. It does not forecast any company, price or share. Energy per task in joules is the metric where a joule figure exists. Where a source reports only dollars or seconds, the dollar or second figure is used and labeled as such.

## 1. Kinds of evidence

Every source in this article is sorted into one of three classes, and the class is printed in the References.

- **Established by proof in the source.** The source contains a theorem or analytic derivation with its proof. A proof inside a paper is the author's proof, not a machine-checked one, and the article does not call it more. Court records and statistical releases are sorted as demonstrated, because they report dated facts and not derivations.
- **Demonstrated.** The source reports a measurement, survey, experiment or dated release with a stated method. The result holds for that setting and may not carry elsewhere.
- **Opinion.** The source is a forecast, a vendor statement without data, a practitioner narrative, or a review that summarizes other work. Reviews are sorted here because the article cannot tell from them what was measured.

Figures are quoted as the source states them, with the source's own setting and caveats, and are not recomputed. Every source was retrieved as full text and each cited figure was located in that text. Sources in German, French, Spanish, Portuguese, Korean, Japanese and Chinese were read in the original language, and their figures are restated in English without change.

## 2. What became possible, 2024 to 2026

The list below is organized by the lever each method pulls on cost per task. Each row gives the date of earliest public posting, the claim as the authors report it, and the class.

**Table 1. Methods that change what a task costs.**

| Lever | Method and claim | Posted | Class |
|---|---|---|---|
| Architecture | Selective state space models and attention variants are dual through structured semiseparable matrices, and the resulting layer is reported 2 to 8 times faster than the earlier scan [1]. | 31 May 2024 | established by proof in the source |
| Architecture | Hybrid state space and attention models were released with open weights by several groups across 2024 and 2025 [2]. | 2024 to 2025 | demonstrated |
| Number format | Ternary weights match 16-bit perplexity and end-task scores from about 3 billion parameters at lower latency, memory and energy, in the authors' experiments [3]. | 27 Feb 2024 | demonstrated |
| Number format | Stable 4-bit pretraining of a 12 billion parameter hybrid model on 10 trillion tokens, comparable to 8-bit results, reported by the hardware vendor [4]. | Sep 2025 | demonstrated |
| Kernels | An attention kernel reaches up to 75% of peak 16-bit throughput on one accelerator generation, against 35% for its predecessor [5]. | Jul 2024 | demonstrated |
| Sparsity | Hardware-aligned, natively trainable sparse attention with reported speedups at 64 thousand tokens of context [6]. | Feb 2025 | demonstrated |
| Decoding | Speculative decoding leaves the output distribution unchanged and was measured at 2 to 3 times faster on a large translation model [7]. | 30 Nov 2022 | established by proof in the source |
| Scaling | When lifetime inference demand is counted, the cost-optimal model is smaller and trained on more tokens than the training-only rule gives [8, 9]. | Jan 2024 | demonstrated |
| Training cost | A frontier-scale model reported at 2.788 million accelerator-hours for full training, using latent attention and 8-bit training [10]. | 26 Dec 2024 | demonstrated |
| Conformal inference | Finite-sample, distribution-free coverage for any predictor, with proofs collected in a book [11]; a survey first posted in October 2024 and published in 2025 covers structured, unstructured and dynamic data [12]. | 18 Nov 2024 | established by proof in the source |
| Inference with predictions | Valid intervals from a small labeled set and many machine predictions, for any predictor [13]. | 2023 | established by proof in the source |
| Sequential inference | E-processes and confidence sequences that stay valid when a test is stopped at any time [14]. | Nov 2023 | established by proof in the source |
| Causal estimation | Debiased machine learning gives valid inference on a target parameter with flexible nuisance models, extended to identifiable effects beyond back-door adjustment [15, 16]. | 2018; 2021 | established by proof in the source |
| Compilers | Compiler passes for higher-order automatic differentiation report up to 1.3 times on second-order operators, preliminary [17]; a 2026 methodology paper states that compiled JAX far exceeds Stan's efficiency on modern hardware, with no benchmark numbers in its abstract [18]. | 2025 | demonstrated |
| Probabilistic programming | A compiler that keeps probabilistic semantics reports a geometric-mean 6.4 times over Stan and 53 times over Turing on standard benchmarks [19]. | 2025 to 2026 | demonstrated |
| Energy measurement | An open benchmark measures inference energy across 40 architectures and reports time and energy Pareto configurations with savings above 40% in some cases [20]; one provider reports 0.24 watt-hours for a median text prompt in production [21]. | 2025 | demonstrated |

Two rates give the background. Compute needed to reach a fixed language-model score has halved about every 8 months, with a 95% interval of about 5 to 14 months [22]. The price of reaching a fixed benchmark level fell between 9 and 900 times a year across six benchmarks, median about 50, with the fastest rates resting on under a year of data [23]. Both are rates of change in the capability frontier $C(t)$ or a price, and neither measures the gap to deployment.

Two limits apply to the table. Several rows are speedups against a baseline chosen by the authors, so the numbers do not add or compare across rows. And "possible" in these rows means demonstrated by the authors in a stated setting, not available in a product.

## 3. What the gap looks like in data

**Long-run diffusion.** Across 15 technologies and 166 countries from 1820 to 2003, the average lag between invention and adoption in a country was about 45 years, and lags shrank over the period [24]. The same history carries a warning about what adoption means. Electric motors raised factory productivity only after plants were redesigned around one motor per machine, a change that took decades [25]. A later model attributes the dip and rise in measured productivity to unmeasured complementary investment in processes and skills [26]. In both accounts the delay is mostly the cost of reorganizing around the tool, which in the notation above is $K$.

**Open release to consumer hardware.** For models that fit one consumer graphics card, the average lag behind the best model overall was 6 to 12 months across four measures in 2025, with the largest lag, 12.4 months, on a preference score [27]. A broader analysis of open-weight models of any size found about one year, with a range of 5 to 22 months by benchmark, and a later index-based analysis put the average near 3 months [28]. These figures measure the distance between two public frontiers. They are lower bounds on a lag to products, because an open model on a card is not yet a product anyone is paid to support.

**From paper to product.** Speculative decoding was posted in November 2022. Its authors' employer reported applying it in products by December 2024 [29]. A practitioner account from the same month says that production use needed extra work on batching, quality and reliability and helps mostly at limited batch sizes [30]. This is one dated pair, not a distribution. The protocol in Section 9 specifies how to collect many. A longer-run measure of the paper-to-patent distance finds that patent citations to articles are on average 14.4 years older than the patent on the front page and 16.6 years when in-text citations are counted [31], and linked patents and papers are typically two to four citation steps apart [32]. Those figures are for science broadly and are not about machine learning in particular.

**Practice of 4-bit models.** Practitioner accounts date the point at which 4-bit local inference became workable on consumer machines to 2023 [33]. The accounts are narrative, so this is opinion-class evidence for a date and not a measurement.

**Firm adoption.** The United States Census Bureau's 2026 supplement found 18% of firms using AI in a business function in November 2025 to January 2026, 22% expecting to within six months, and 57% of users in three or fewer functions [34]. In the European Union, 20.0% of enterprises with 10 or more employees used at least one AI technology in 2025, up 6.5 points from 2024, with 55.0% of large, 30.4% of medium and 17.0% of small enterprises [35]. The OECD reports 13.9% adoption in 2024 and 39% of large firms against 12% of small firms [36]. Chinese hiring data show generative-AI hiring at 21% of listed firms against 0.2% of unlisted ones at the end of 2025 [37]. Survey wording and sampling frames differ by source, and the Census question was revised in November 2025, so rates are not comparable across rows.

**Official statistics in the original languages.** Germany's Statistisches Bundesamt reports that 20% of firms with 10 or more employees used AI in 2024, against 12% in 2023 and 11% in 2021, with 48% of large, 28% of medium and 17% of small firms, and names lack of knowledge and legal uncertainty as the most common reasons for not using it [38]. Its 2025 table gives 26% overall and 57% for firms with more than 250 employees, on a changed enterprise definition [39]. Insee reports 10% of firms in France using AI in 2024, four points above 2023, 33% of firms with 250 or more employees, and 42% in information and communication against 5% or less in transport, accommodation and food, and construction [40]. Spain's Instituto Nacional de Estadística reports 21.1% of firms with 10 or more employees using AI in the first quarter of 2025, 8.7 points higher than a year earlier [41]. Brazil's Cetic.br reports 13% of firms using AI in 2024, the same share as in 2023, concentrated in large firms and in information and communication [42]. Korean ministry statistics, as reported in the Korean press, give 32.9% of firms using AI technology or services in 2024 against 30.3% in 2023, and 66.9% for firms with 250 or more workers [43]. Japan's white paper surveyed workers in four countries and found any business use of generative AI at 55.2% in Japan, 90.6% in the United States, 90.3% in Germany and 95.8% in China. Among Japanese firms, 49.7% had an active or limited-use policy in 2024 against 42.7% a year earlier, and the most common Japanese concern, at 30.1%, was not knowing how to use it effectively, against 9.7% in the United States and 10.4% in China [44]. China's CNNIC counts 515 million generative-AI users in June 2025, 266 million more than in December 2024, a penetration of 36.5% [45]. These are measurements of use, not of release. Within each country the rate rises with firm size, which is consistent with a fixed adoption cost $K$ weighing less on a large budget, though the surveys cannot separate that from other causes.

**Use at the level of people and tasks.** Nearly 40% of United States adults aged 18 to 64 used generative AI in late 2024, and about 23% of workers had used it at work in the prior week [46]. A field study of 5,179 customer-support agents found 14% more resolutions per hour on average and 34% more for novice and low-skilled workers [47]. A randomized trial with 16 experienced developers and 246 tasks found tasks with AI allowed took 19% longer in that setting [48]. These results differ because tasks, people and tools differ. They show that deployment is not a single event, which is why $D(t)$ is defined from offers and not from use.

**What slows research itself.** Research effort has risen while research productivity has fallen in most sectors, and keeping chip density doubling needed more than 18 times the researchers of the early 1970s [49]. This bears on $C(t)$, not on $L$, and is noted so the article does not read the capability frontier as free.

## 4. Calendars: reporting and funding periods

Decision dates in listed firms follow the reporting calendar. In a survey of 401 financial executives, 78% would give up economic value to smooth reported earnings, and 55% would avoid starting a very positive net-present-value project if it meant missing the quarter's consensus [50]. Comparable public firms invest less, and respond less to investment opportunities, than private firms [51]. All of these are demonstrated for earlier technologies and periods, and none is a measurement of AI releases.

Attention follows the same calendar. The count of United States large-company earnings calls citing "AI" reached 306 in the third quarter of 2025, against a ten-year average of 86 [52]. Earnings-call language has been used as a measurement instrument for other topics, validated against manual reading [53], and the same instrument can be pointed at release topics.

Funding follows a longer calendar. A venture fund has a finite life, typically ten years, and firms raise new funds every three to five years [54]. Partnership agreements specify finite lifetimes, usually ten years [55]. The two calendars differ in length, about a quarter and three to five years, and both quantize when a commitment can be made. Proposition 1 below uses only that structure.

## 5. Control and incumbent response

Two older results frame the incentive to deploy. Arrow's analysis finds the incentive to invent smaller under monopoly, meaning barriers to entry, than under competition, and counts a temporary monopoly that does not bar entry as nearly competitive [56]. A later review of the competition and innovation literature notes that preemption incentives are a force missing from simple static models [57]. Incumbents also miss changes that rearrange known components, because their routines filter what they notice [58]. Neither is a statement about any firm now.

Control over distribution is documented in public court records. In September 2025 a United States district court barred exclusive distribution contracts for several search and assistant products, allowed non-exclusive default payments with terms generally limited to one year, and ordered data sharing and syndication remedies [59]. The article uses the record only as evidence that defaults and distribution terms are priced and regulated, which is what the parameter $s$ in Section 6 represents.

## 6. The model

**Setting.** One buyer population with demand $Q(p) = A - p$ per period for a task at price $p$. An incumbent serves it at cost $c_0$ with an existing method. A public method becomes available to anyone at cost $c_e(t)$, non-increasing in time. A buyer can switch to a seller using the public method at friction $s$ per task, so the incumbent's price ceiling is $u(t) = c_e(t) + s$. The incumbent may release an offering built on the public method at one-time cost $K$. Decisions are made only at dates $kT$.

**Assumptions.**

- A1. Linear demand $A - p$, with $c_0 < A - s$.
- A2. The public cost declines: $c_e$ is non-increasing and continuous with $c_e(0) = c_0$, and $c_e(t) \ge h \ge 0$.
- A3. The ceiling $u$ binds on the incumbent's price, that is $u < \tfrac12 (A + c)$ for the cost $c$ it faces. This holds for the numbers in Section 7.
- A4. The incumbent maximizes discounted profit at rate $r$ subject to a reporting rule: a share $\varphi \in [0,1]$ of $K$ is expensed in the release period, and the release period's reported earnings must not fall short of the pre-release level by more than $w$.
- A5. After release the incumbent's cost is $c_e(t)$, the cost of the public method.
- A6. Flow gains from release are treated as constant after the release date (steady-state approximation).

**Proposition 1 (calendar quantization).** If a method becomes ready at time $\rho$ and the firm releases at the first decision date at or after $\rho$ when release is worthwhile, the wait is $w^{cad} = \lceil \rho / T \rceil T - \rho$. If $\rho \bmod T$ is uniform on $[0, T)$, then $E[w^{cad}] = T/2$ and $\mathrm{Var}[w^{cad}] = T^2/12$.

*Derivation.* Write $\rho = mT + x$ with $x$ uniform on $[0,T)$. For $x > 0$ the next date is $(m+1)T$ and the wait is $T - x$, which is uniform on $(0, T]$. A uniform variable on an interval of length $T$ has mean $T/2$ and variance $T^2/12$. The case $x = 0$ has probability zero. $\square$

*Consequence.* A firm deciding on a quarterly calendar adds on average about 6 weeks, and one deciding on a funding cycle of 3 to 5 years adds 1.5 to 2.5 years, to the readiness delay $d$, with no engineering cause. The assumption that readiness is uniform within a period is the weak part, and Prediction 1 tests the converse.

**Proposition 2 (release threshold and forced release).** Define the flow gain $g(c) = (c_0 - c)(A - c - s)$ for the outside cost $c = c_e$. On $0 \le c < \min(c_0, A - s)$, $g$ is strictly decreasing in $c$. Without calendar or reporting constraints, release is optimal exactly when $g(c_e(t)) \ge rK$, that is when $c_e(t) \le c^\dagger$, where $c^\dagger$ is the unique solution of $g(c^\dagger) = rK$ if it exists. If $c_e \le c_0 - s$, holding earns no profit, and release is preferred to holding. A reporting rule can delay it but cannot make holding profitable.

*Derivation.* Under A3 the incumbent holding at cost $c_0$ prices at the ceiling, so its profit is $(u - c_0)(A - u)$. After release its cost is $c$ and its profit is $(u - c)(A - u)$. The difference is $(c_0 - c)(A - u) = (c_0 - c)(A - c - s) = g(c)$. Differentiating, $g'(c) = -(A - c - s) - (c_0 - c) < 0$ on the stated range, so $g$ is strictly decreasing. With A6 the value of release is $g/r - K$, which is non-negative exactly when $g \ge rK$. Holding yields profit $(u - c_0)(A - u)$, which is zero at $u = c_0$, that is at $c_e = c_0 - s$, and negative below. Release at that point yields profit $s(A - c - s) > 0$ by A1. $\square$

**Proposition 3 (reporting gate, delay and a never-release region).** Under A4 the release-period reported earnings change is $g \cdot T - \varphi K$. Release is allowed if this is at least $-w$, that is if $g \ge (\varphi K - w)/T$. Define $G_{eff} = \max\{rK, (\varphi K - w)/T\}$ and $c_{eff} = g^{-1}(G_{eff})$. Then $c_{eff} \le c^\dagger$, the release date moves from $t(c^\dagger)$ to $t(c_{eff})$ or to the forced-release point $c_0 - s$, whichever is earlier, and for $c_e(t) = c_e(0) e^{-\lambda t}$ the delay is $(1/\lambda)\ln(c^\dagger / c_{eff})$ when $c_{eff} \ge c_0 - s$. If $G_{eff} > g(h)$, where $h$ is the cost floor, release never occurs on the NPV and gate conditions, and only the forced release at $c_0 - s$ applies if $c_0 - s \ge h$.

*Derivation.* Reported earnings in the release period gain $gT$ of operating profit and lose the expensed part $\varphi K$ of the adoption cost. Requiring the net to be at least $-w$ gives the stated inequality. Since $g$ is strictly decreasing (Proposition 2), the larger of two required gains corresponds to the smaller cost threshold, so $c_{eff} \le c^\dagger$. With $c_e(t) = c_e(0) e^{-\lambda t}$ the time to reach $c$ is $t(c) = (1/\lambda)\ln(c_e(0)/c)$, and the difference of two such times is the stated delay. The attainable gain is at most $g(h)$ because $c_e \ge h$ by A2. $\square$

**Proposition 4 (forcing function).** Suppose an automation tool lowers the adoption cost from $K$ to $K'$. (a) The NPV threshold $c^\dagger$ rises, so release is optimal earlier. (b) If $\varphi K' \le w$, the reporting gate does not bind, $G_{eff} = rK'$, and $w^{gate} = 0$. (c) The total latency of the firm falls to $d' + w^{cad}$, where $d'$ is the technical readiness delay with the tool.

*Derivation.* (a) $g(c^\dagger) = rK$ and $g$ is strictly decreasing, so lowering $K$ lowers the required gain and raises $c^\dagger$. (b) The gate condition $g \ge (\varphi K' - w)/T$ is satisfied by every $g \ge 0$ when the right side is non-positive, which is $\varphi K' \le w$. Then $G_{eff} = rK'$. (c) Follows from Definition 2 and Proposition 3. $\square$

*Reading.* A tool acts as a forcing function in two separate ways. It lowers $K$ and so removes the gate delay once $K$ passes under $w/\varphi$. And it lowers $c_e$ for every seller, which forces release at $c_e \le c_0 - s$, where holding earns nothing. The first is a property of the adopting firm and the second a property of the market.

**Proposition 5 (market latency is set by the least constrained firm).** If $D(t) = \min_i c_i(t)$ over firms that can sell to the buyer population, then $L(c) = \min_i L_i(c)$.

*Derivation.* $t_D(c) = \inf\{t : \min_i c_i(t) \le c\} = \min_i t_i(c)$, and $t_C(c)$ does not depend on $i$. Subtracting gives the result. $\square$

*Consequence.* A calendar or gate that delays one firm does not delay the market when another firm can reach the same buyers without that delay. The latency observed in a market is then the latency of the fastest firm that has access. Where access is restricted, because buyers cannot reach other sellers, the minimum is taken over a smaller set. In the model this is the role of $s$.

**Proposition 6 (what remains to charge for).** After release, with the ceiling binding, price is $p = c_e + s$, profit is $\pi = s(A - c_e - s)$, and the margin per task is $s$, independent of $c_e$. Price changes one-for-one with cost, while the price to cost ratio $p/c_e = 1 + s/c_e$ rises as cost falls. The marginal value of friction is $\partial \pi / \partial s = A - c_e - 2s$, which is positive for $s < (A - c_e)/2$ and increases as $c_e$ falls.

*Derivation.* Under A3 the incumbent charges the ceiling $u = c_e + s$. With cost $c_e$, the margin is $u - c_e = s$ and volume is $A - u$, giving $\pi = s(A - c_e - s)$. The ratio follows from $p/c_e = (c_e + s)/c_e$. Differentiating $\pi$ in $s$ gives $A - c_e - 2s$, and $\partial^2\pi / \partial s\,\partial(-c_e) = 1 > 0$. $\square$

*Reading.* As the cost of computing falls, the part of price that reflects computing shrinks, and the remaining margin depends on how costly it is for a buyer to leave. Spending that raises $s$ becomes worth more. In the model this is a statement about incentives and not a judgment of any firm. Policies that lower $s$, such as limits on default terms or portable data formats, lower the margin by the same amount, and the model does not say whether that is desirable.

## 7. A numerical illustration, not a fit

The script `model_check.py` in the work folder reproduces these numbers with the standard library. Parameters: $A = 10$, $c_0 = 4$, $s = 2$, $r = 0.10$ per year, $T = 0.25$ year, $\varphi = 1$, $w = 0.1$, and outside cost halving every 8 months so $c_e(t) = 4 e^{-\lambda t}$. The 8-month rate echoes [22] and is a choice for illustration, not an estimate for cost.

**Table 2. Release date with and without an adoption-cost-lowering tool.**

| Case | $K$ | NPV threshold | Gate threshold | Release at | Gate delay |
|---|---|---|---|---|---|
| Before the tool | 2.0 | $c = 3.951$, day 4 | $c = 2.594$ | month 5.00 | 4.85 months |
| Tool lowers adoption cost | 0.1 | $c = 3.998$ | $c = 3.998$ | day 0.2 | 0 |

In the first row the gate requires a gain of $(\varphi K - w)/T = 7.6$, far above the NPV requirement $rK = 0.2$, so the incentive-delay part $w^{gate}$ is 4.85 months. That is longer than the calendar term of Proposition 1 for a quarterly firm, which is 1.5 months on average. In the second row $\varphi K' = 0.1 \le w = 0.1$, so the gate does not bind and only the NPV condition remains, as in Proposition 4(b).

**Table 3. After release, with $s = 2$.**

| $c_e$ | Price $p$ | $p / c_e$ | Profit | $\partial \pi / \partial s$ |
|---|---|---|---|---|
| 4.0 | 6.00 | 1.50 | 8.00 | 2.00 |
| 3.0 | 5.00 | 1.67 | 10.00 | 3.00 |
| 2.0 | 4.00 | 2.00 | 12.00 | 4.00 |
| 1.0 | 3.00 | 3.00 | 14.00 | 5.00 |
| 0.5 | 2.50 | 5.00 | 15.00 | 5.50 |

Profit rises as cost falls because linear demand lets volume expand. With satiated demand the profit column would flatten, and the claim about margin staying at $s$ would not change. A simulation of Proposition 1 with $T = 0.25$ and uniform readiness gives a mean wait of 0.1250 against $T/2 = 0.125$ and variance 0.00521 against $T^2/12 = 0.00521$ (200,000 draws, seed 7).

## 8. Predictions and what would refute them

Each prediction names the data, the test and the result that would count against the model. Predictions are stated before any of the data was collected.

**Prediction 1 (calendar clustering).** The dates on which firms with quarterly reporting make previously open methods generally available are not uniform within the quarter. *Test:* for a sample of at least 200 releases from listed firms, compute each date's phase within the firm's fiscal quarter and apply Rayleigh and Kuiper tests against uniformity. *Refuted if* the null of uniform phase is not rejected at 5% with 200 or more independent items.

**Prediction 2 (listed against unlisted).** For the same method and comparable difficulty, the median delay from open release to a generally available product is longer for listed firms than for firms funded outside a reporting calendar. *Test:* matched pairs by method, with firm type as the treatment and hazard ratios for time to release. *Refuted if* the 95% interval of the hazard ratio (listed over unlisted) lies entirely above 0.8.

**Prediction 3 (tools lower the gate).** After an automation tool that lowers porting cost becomes available for a hardware or software target, time from open release to general availability on that target falls. *Test:* difference in differences with targets served and not served by the tool, with release delay in days as outcome. *Refuted if* the 95% interval of the estimated change lies entirely above $-30$ days. The 30-day margin is a protocol choice made before data collection.

**Prediction 4 (price outruns cost).** Where joule and hardware costs per task are measured, the ratio of list price to cost per task rises as measured cost falls. *Test:* panel of services with a stated task, using open energy measurements and list prices. *Refuted if* the ratio is flat or falls in more than half of tasks over a period in which cost fell by a factor of 2 or more.

**Prediction 5 (spending moves to friction).** In a market where cost per task falls, the share of seller revenue spent on distribution, defaults and bundling rises. *Test:* disclosed distribution payments and bundling terms in filings and court records against revenue. *Refuted if* the share is flat or falls while cost per task falls by a factor of 2 or more.

**Prediction 6 (market latency follows the fastest firm).** In markets where buyers can reach more than one seller at low friction, market latency is close to the minimum firm latency, and in markets with high measured friction it is closer to the median. *Test:* regress market latency on measured switching friction. *Refuted if* the 95% interval of the slope on friction lies entirely at or below zero.

**What would refute the model itself.** A finding that release dates are uniform within the quarter for listed firms (Prediction 1), that listed and unlisted firms release at the same pace (Prediction 2) and that porting-tool arrival does not change delay (Prediction 3) would leave no role for calendars or reporting gates, and the artificial latency of Definition 2 would be zero in measurement. The model would then reduce to engineering delay $d$.

## 9. Experiment protocol (not executed)

**Purpose.** Measure $L$ and its three parts for a list of methods, using only public dates.

**Unit.** A method, such as a number format, a kernel, an inference procedure or a compiler pass, with a dated public description.

**Dates to collect for each method.** The earliest public posting (preprint or repository), the earliest open implementation, the earliest release in a widely used open library, and the earliest general-availability release in at least one commercial product, with the firm type (listed, private, public-sector, academic). Each date is recorded with its source link and an archive copy.

**Sampling.** All methods in a pre-registered list drawn from a fixed set of venues and repositories over 2022 to 2026, including non-English venues and repositories, with the selection rule written before any release date is looked up.

**Analysis.** Compute $L$ per method. Estimate $E[w^{cad}]$ by the phase tests of Prediction 1 and by comparing the mean delay with $T/2$. Estimate the gate part as the difference between listed and unlisted firms (Prediction 2). Report medians with bootstrap intervals, and report what share of methods never reach a product.

**Energy.** Where a method reports joules per task, record the measurement conditions, and where it does not, run it on an open energy harness such as the one cited in Table 1 and report the measured joules.

**Outputs.** One table of dates, one analysis script, and a log of exclusions. The scripts and data are to be released with the study under the same terms as this site.

## 10. Conclusion

Public methods that lower the cost of computer intelligence reach products after a delay with a technical part, a calendar part and an incentive part. The first is engineering time. The second is the structure of decision dates, which on a quarterly calendar adds about six weeks on average (Proposition 1). The third appears when a reporting rule blocks a release that is worth doing in the long run (Proposition 3). A tool that lowers the cost of adopting a method removes the third once the cost falls under a stated bound, and a tool that lowers the cost of the work itself forces release when holding earns nothing (Proposition 4). When the market has several sellers reachable at low friction, the fastest sets the latency (Proposition 5). As computing cost falls, the margin that remains depends on switching friction (Proposition 6). None of this is shown from data in the article. It is a model and six predictions, with the data that would refute each.

## References

Each entry ends with its evidence class (Section 1).

1. Dao and Gu, Transformers are SSMs (Mamba-2, state space duality). 2024-05-31. <https://arxiv.org/abs/2405.21060> (established by proof in the source)
2. Lieber et al. (Jamba); NVIDIA (Nemotron-H); TII (Falcon-H1); IBM (Granite 4.0). 2024 to 2025. <https://arxiv.org/abs/2504.03624> (demonstrated)
3. Ma et al., The Era of 1-bit LLMs (BitNet b1.58). 2024-02-27. <https://arxiv.org/abs/2402.17764> (demonstrated)
4. NVIDIA, Pretraining Large Language Models with NVFP4. 2025-09. <https://arxiv.org/abs/2509.25149> (demonstrated)
5. Shah et al., FlashAttention-3. 2024-07. <https://arxiv.org/abs/2407.08608> (demonstrated)
6. Yuan et al., Native Sparse Attention. 2025-02 (ACL 2025). <https://arxiv.org/abs/2502.11089> (demonstrated)
7. Leviathan, Kalman, Matias, Fast Inference from Transformers via Speculative Decoding. 2022-11-30 (ICML 2023). <https://arxiv.org/abs/2211.17192> (established by proof in the source)
8. Hoffmann et al., Training Compute-Optimal Large Language Models. 2022-03-29. <https://arxiv.org/abs/2203.15556> (demonstrated)
9. Sardana et al., Beyond Chinchilla-Optimal: Accounting for Inference in Language Model Scaling. 2024-01 (ICML 2024). <https://arxiv.org/abs/2401.00448> (demonstrated)
10. DeepSeek-AI, DeepSeek-V3 Technical Report. 2024-12-26. <https://arxiv.org/abs/2412.19437> (demonstrated)
11. Angelopoulos, Barber, Bates, Theoretical Foundations of Conformal Prediction. 2024-11-18 (v5 2026-03-06). <https://arxiv.org/abs/2411.11824> (established by proof in the source)
12. Zhou, Chen, Gui and Cheng, Conformal Prediction: A Data Perspective. 2024-10 (arXiv 2410.06494; ACM Computing Surveys 2025). <https://arxiv.org/abs/2410.06494> (opinion)
13. Angelopoulos et al., Prediction-powered inference. 2023 (Science). <https://www.science.org/doi/10.1126/science.adi6000> (established by proof in the source)
14. Ramdas, Grunwald, Vovk, Shafer, Game-Theoretic Statistics and Safe Anytime-Valid Inference. 2023-11 (Statistical Science 38(4)). <https://doi.org/10.1214/23-sts894> (established by proof in the source)
15. Chernozhukov et al., Double/debiased machine learning. 2018 (Econometrics Journal). <https://doi.org/10.1111/ectj.12097> (established by proof in the source)
16. Jung, Tian, Bareinboim, Estimating Identifiable Causal Effects through Double Machine Learning. 2021 (AAAI). <https://doi.org/10.1609/aaai.v35i13.17438> (established by proof in the source)
17. Sathia et al., Compiler Optimizations for Higher-Order Automatic Differentiation. 2025 (PPoPP workshop). <https://ece.is/assets/pdf/diffprog-ppopp25-paper90.pdf> (demonstrated)
18. Ward et al., JAX a la Stan. 2026-10-11. <https://bob-carpenter.github.io/dj-paper/template-computo-python.pdf> (opinion)
19. Qian et al., Impulse: probabilistic programming via compiler augmentation. 2026 (abstract). <https://ece.is/assets/pdf/impulse-pldi-src-abstract.pdf> (demonstrated)
20. Chung et al., The ML.ENERGY Benchmark. 2025 (NeurIPS Datasets and Benchmarks). <https://ml.energy/leaderboard/> (demonstrated)
21. Google, Measuring the environmental impact of delivering AI at Google Scale. 2025-08. <https://arxiv.org/abs/2508.15734> (demonstrated)
22. Ho et al. (Epoch AI), Algorithmic progress in language models. 2024-03 (NeurIPS 2024). <https://arxiv.org/abs/2403.05812> (demonstrated)
23. Epoch AI, LLM inference prices have fallen rapidly but unequally across tasks. 2025. <https://epoch.ai/data-insights/llm-inference-price-trends> (demonstrated)
24. Comin and Hobijn, An Exploration of Technology Diffusion. 2010 (AER 100(5)). <https://doi.org/10.1257/aer.100.5.2031> (demonstrated)
25. P. A. David, The Dynamo and the Computer. 1990 (AER 80(2)). <https://ideas.repec.org/a/aea/aecrev/v80y1990i2p355-61.html> (demonstrated)
26. Brynjolfsson, Rock, Syverson, The Productivity J-Curve. 2021 (AEJ Macro). <https://doi.org/10.1257/mac.20180386> (demonstrated)
27. Somala and Emberson (Epoch AI), Frontier AI performance becomes accessible on consumer hardware within a year. 2025-08-15. <https://epoch.ai/data-insights/consumer-gpu-model-gap> (demonstrated)
28. Epoch AI, Open vs. closed AI: how behind are open models?. 2025. <https://epoch.ai/publications/open-models-report> (demonstrated)
29. Google Research, Looking back at speculative decoding. 2024-12-06. <https://research.google/blog/looking-back-at-speculative-decoding/> (opinion)
30. Gupta and Kiely, Production-ready speculative decoding with TensorRT-LLM. 2024-12-19. <https://www.baseten.co/blog/how-we-built-production-ready-speculative-decoding-with-tensorrt-llm/> (opinion)
31. Marx and Fuegi, Reliance on Science: Worldwide Front-Page Patent Citations to Scientific Articles. 2020 (NBER 27987; JEMS 2022). <https://www.nber.org/system/files/working_papers/w27987/w27987.pdf> (demonstrated)
32. Ahmadpoor and Jones, The dual frontier. 2017 (Science). <https://doi.org/10.1126/science.aam9527> (demonstrated)
33. Willison, Stanford Alpaca, and the acceleration of on-device large language model development. 2023-03-13. <https://simonwillison.net/2023/Mar/13/alpaca/> (opinion)
34. Bonney et al., The Microstructure of AI Diffusion (Census CES-WP-26-25). 2026-04. <https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html> (demonstrated)
35. Eurostat, 20% of EU enterprises use AI technologies. 2025-12-11. <https://ec.europa.eu/eurostat/documents/7870049/23260410/KS-01-26-009-EN-N.pdf> (demonstrated)
36. OECD, Emerging divides in the transition to artificial intelligence. 2025-06. <https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/06/emerging-divides-in-the-transition-to-artificial-intelligence_eeb5e120/7376c776-en.pdf> (demonstrated)
37. Li et al., Now Hiring: Firm-Level Adoption of Generative AI in China (World Bank). 2025/2026. <https://thedocs.worldbank.org/en/doc/cbdef4ef57efdbb3c29aa4c07edf860b-0050062026/original/Now-hiring-Firm-Level-Li-etal.pdf> (demonstrated)
38. (German) Statistisches Bundesamt, Pressemitteilung Nr. 444: Jedes fünfte Unternehmen nutzt künstliche Intelligenz. 2024-11-25. <https://www.destatis.de/DE/Presse/Pressemitteilungen/2024/11/PD24_444_52911.html> (demonstrated)
39. (German) Statistisches Bundesamt, Unternehmen mit Nutzung von Technologien der künstlichen Intelligenz nach Beschäftigtengrößenklassen (table, 2025). 2025. <https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/IKT-in-Unternehmen-IKT-Branche/Tabellen/ikti-unternehmen-kuenstliche-intelligenz.html> (demonstrated)
40. (French) Insee, Les technologies de l'information et de la communication dans les entreprises en 2024, Insee Première n° 2061. 2025-07. <https://www.insee.fr/fr/statistiques/fichier/8604126/ip2061.pdf> (demonstrated)
41. (Spanish) Instituto Nacional de Estadística, Encuesta sobre el uso de TIC y del comercio electrónico en las empresas, nota de prensa. 2025-10-22. <https://ine.es/dyngs/Prensa/ETICCE20241T2025.pdf> (demonstrated)
42. (Portuguese) Cetic.br/NIC.br, Pesquisa TIC Empresas 2024, resumo executivo. 2025-05. <https://www.nic.br/media/docs/publicacoes/2/20250512121759/tic_empresas_2024_resumo_executivo.pdf> (demonstrated)
43. (Korean) Electronic Times, reporting the 2025 Enterprise Informatization Statistics of the Ministry of Science and ICT and NIA. 2026-01-20. <https://www.etnews.com/20260120000071> (demonstrated)
44. Japan Ministry of Internal Affairs and Communications, 令和7年版情報通信白書 (Information and Communications White Paper 2025), data tables, in Japanese. 2025. <https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r07/html/nd112220.html> (demonstrated)
45. (Chinese) China Internet Network Information Center, 生成式人工智能应用发展报告（2025）. 2025-10. <https://pdf.dfcfw.com/pdf/H301_AP202510241768289458_1.pdf> (demonstrated)
46. Bick, Blandin, Deming, The Rapid Adoption of Generative AI. 2024-09 (rev. 2025-02). <https://www.nber.org/papers/w32966> (demonstrated)
47. Brynjolfsson, Li, Raymond, Generative AI at Work (NBER Working Paper 31161; later published in QJE 2025). 2023 working paper, revised. <https://www.nber.org/papers/w31161> (demonstrated)
48. METR, Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity. 2025-07-10. <https://arxiv.org/abs/2507.09089> (demonstrated)
49. Bloom, Jones, Van Reenen, Webb, Are Ideas Getting Harder to Find?. 2020 (AER 110(4)). <https://doi.org/10.1257/aer.20180338> (demonstrated)
50. Graham, Harvey, Rajgopal, The Economic Implications of Corporate Financial Reporting. 2005 (JAE 40); NBER 2004-10. <https://www.nber.org/papers/w10550> (demonstrated)
51. Asker, Farre-Mensa, Ljungqvist, Corporate Investment and Stock Market Listing: A Puzzle?. 2015 (RFS 28(2)). <https://doi.org/10.1093/rfs/hhu077> (demonstrated)
52. FactSet, Highest number of S&P 500 earnings calls citing AI over the past 10 years. 2025-12. <https://insight.factset.com/highest-number-of-sp-500-earnings-calls-citing-ai-over-the-past-10-years-1> (demonstrated)
53. Hassan, Hollander, van Lent, Tahoun, Firm-Level Political Risk. 2019 (QJE 134(4)). <https://doi.org/10.1093/qje/qjz021> (demonstrated)
54. Metrick and Yasuda, Venture Capital and Other Private Equity: A Survey (NBER Working Paper 16652). 2010-10. <https://www.nber.org/system/files/working_papers/w16652/w16652.pdf> (opinion)
55. Gompers and Lerner, What Drives Venture Capital Fundraising? (Brookings Papers: Microeconomics). 1998. <https://www.brookings.edu/wp-content/uploads/1998/01/1998_bpeamicro_gompers.pdf> (demonstrated)
56. Arrow, Economic Welfare and the Allocation of Resources for Invention (NBER chapter). 1962. <https://www.nber.org/system/files/chapters/c2144/c2144.pdf> (established by proof in the source)
57. Shapiro, Competition and Innovation: Did Arrow Hit the Bull's Eye? (NBER conference draft). 2010. <https://conference.nber.org/confer/2010/RDIA10/Shapiro.pdf> (opinion)
58. Henderson and Clark, Architectural Innovation. 1990 (ASQ 35(1)). <https://doi.org/10.2307/2393549> (demonstrated)
59. US District Court for D.C., United States v. Google LLC, remedies memorandum. 2025-09-02. <https://www.courthousenews.com/wp-content/uploads/2025/09/judge-amit-mehta-google-search-monopoly-remedy-ruling.pdf> (demonstrated)
