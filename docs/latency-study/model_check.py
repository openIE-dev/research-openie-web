"""Numerical illustration for the cadence and forcing-function model. Model output, not data.
Run: python3 model_check.py   (standard library only)"""
import math, random
A, c0, s = 10.0, 4.0, 2.0          # demand intercept, incumbent cost, switching friction (price units per task)
r, T = 0.10, 0.25                  # discount rate per year, reporting period in years
phi, w = 1.0, 0.1                  # expensed share of adoption cost, tolerated earnings shortfall
lam = math.log(2)/(8/12)           # outside cost halves every 8 months (illustrative)
ce0 = c0
def g(c): return (c0-c)*(A-c-s)    # flow gain from releasing: (c0-c)(A-u), u=c+s
def ginv(G):                       # solve (c0-c)(A-s-c)=G for the root below c0 (g decreasing on c<c0)
    b=c0+A-s; d=c0*(A-s)-G
    return (b-math.sqrt(b*b-4*d))/2
def t_of(c): return math.log(ce0/c)/lam
def run(K, label):
    G_npv=r*K; G_gate=(phi*K-w)/T
    G_eff=max(G_npv,G_gate)
    c_npv=ginv(G_npv); c_eff=ginv(G_eff)
    c_forced=c0-s
    c_rel=max(c_eff,c_forced)
    d_npv=t_of(c_npv); d_rel=t_of(c_rel)
    print(f"{label}: K={K}: NPV threshold c={c_npv:.3f} at t={d_npv*365:.1f} days; gate threshold c={c_eff:.3f}; forced-exit c={c_forced:.3f}; release at c={c_rel:.3f}, t={d_rel*12:.2f} months; gate delay={(d_rel-d_npv)*12:.2f} months")
    return d_npv,d_rel
run(2.0,"before tool")
run(0.1,"after tool lowers adoption cost")
# price, margin and value of control after release
for ce in (4.0,3.0,2.0,1.0,0.5):
    u=ce+s; prof=s*(A-ce-s); dprof_ds=A-ce-2*s
    print(f"c_e={ce:.1f}: price={u:.2f}, price/cost={u/ce:.2f}, profit={prof:.2f}, d profit/ds={dprof_ds:.2f}")
# quantization: expected extra wait is T/2 when readiness is uniform over the period
random.seed(7); N=200000
waits=[]
for _ in range(N):
    ready=random.random()*10
    nxt=math.ceil(ready/T)*T
    waits.append(nxt-ready)
m=sum(waits)/N; v=sum((x-m)**2 for x in waits)/N
print(f"cadence T={T}: mean wait={m:.4f} (T/2={T/2}), variance={v:.5f} (T^2/12={T*T/12:.5f}), N={N}, seed=7")
