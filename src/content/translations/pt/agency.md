---
title: "Limites termodinâmicos e um tempo ótimo para agentes que mantêm metas"
deck: "Uma definição de agente com um orçamento de energia, os limites físicos de quão rápido tal agente pode agir por segundo e por joule, e uma leitura da inteligência como progresso por joule numa execução concluída."
lang: "pt"
source: "agency"
complete: true
---

<div id="the-universal-law-of-agency" class="anchor-alias" aria-hidden="true"></div>


*Versão 1.1, 11 de outubro de 2026. Dados e código: [research.openie.dev/data/](/data/#agency). PDF em LaTeX: [/pdfs/latex/agency.pdf](/pdfs/latex/agency.pdf) ([fonte](/pdfs/latex/agency.tex)).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Este artigo define um agente como um sistema que mantém uma meta sob um orçamento de energia, deriva limites físicos para a rapidez com que ele pode agir por segundo e por joule, e mede a inteligência como progresso por joule depois que uma execução está concluída.

**Em palavras simples**

1. Para contar como agente, um sistema precisa visar uma meta, agir sobre o mundo e permanecer dentro de um orçamento de energia.
2. A física fixa um custo mínimo de energia para cada decisão, de modo que nenhum agente pode agir mais rápido ou mais barato do que esse limite.
3. Entre os sistemas que fazem o serviço corretamente, o mais inteligente é aquele que usou menos energia.

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. Tese

A proposta tem três camadas, e a ordem é fixa.

1. **A agência vem primeiro, e sua definição é obrigatória.** Esta linha de pesquisa a propõe como a Lei Universal da Agência. Na forma, ela é uma definição mais uma porta: quatro cláusulas dizem o que conta como agente, e a quarta cláusula recusa todo ato que rompa o orçamento de joules. Nada é um agente até que a definição seja satisfeita. Nada do que vem depois está definido sem ela.
2. **Os limites cinemáticos da agência decorrem da definição.** Eles dizem com que rapidez a agência pode se mover, por segundo e por joule, e o que ela precisa pagar para se mover.
3. **A inteligência é o cálculo da agência.** A inteligência é uma característica de retrospectiva. Ela é lida em uma execução concluída, do mesmo modo que a velocidade é lida em uma trajetória registrada. Ela é, portanto, uma derivada da agência: $\iota = dX/dJ$, em que $X$ é a agência confirmada e $J$ são os joules.

A tese: entre os sistemas que passam no teste de correção de uma tarefa, a classificação é pela energia até a conclusão, em joules.

A tese é lida através de sua porta. A capacidade não é descartada: ela é a porta. Burnell e colegas pedem que a avaliação relate os resultados por instância, e não por um único agregado [333], e Zhou e colegas e Laber e colegas constatam que a capacidade e a eficiência variam de forma independente entre modelos e orçamentos de inferência [334, 335]. Esses achados tratam de sistemas que não satisfazem todos o mesmo predicado. Uma vez fixados um predicado $C(z)$ e uma taxa de falha, todo fator que não seja os joules já foi gasto para passar pela porta, e esse é o sentido da segunda frase da tese. A classificação com porta também é prática corrente: o SPECpower classifica o trabalho de servidores por watt a uma carga declarada [338], o custo por aprovação classifica modelos pelo custo de uma resposta correta [336], e a inteligência por watt classifica modelos locais pela acurácia por unidade de potência [337]. A contribuição deste artigo é a forma em joules dessa classificação, com uma cláusula de recusa e uma derivada lida em retrospectiva, e não a ideia de classificar pelo custo sob correção.

A porta e a classificação separam duas coisas que muitas vezes são confundidas: capacidade e inteligência. Capacidade é simplesmente satisfazer $C(z)$. Inteligência é quão poucos joules essa aprovação exige. Krakauer, Mitchell e Krakauer traçam a mesma linha a partir da ciência da complexidade: capacidades impressionantes não são confundidas com inteligência, que fica reservada para resolver problemas "com rapidez e parcimônia, com um gasto mínimo de energia" [339]. Dois sistemas que entregam a mesma resposta correta, um diretamente e outro depois de um longo desvio, são igualmente capazes. Só o primeiro é o mais inteligente, e $J^*$ é a grandeza que os distingue. Um sistema pode ficar mais capaz gastando mais. Ele só fica mais inteligente gastando menos para a mesma aprovação.

A tese tem uma forma exata. A correção é uma porta. Os joules são a classificação. Para uma tarefa $q$ com predicado de completude $C(z)$, os joules até a conclusão correta do sistema $S$ são

$$
J^*_S(q) = \min_{\pi} \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta
$$

O mínimo percorre as políticas $\pi$ que $S$ pode executar, e $\delta$ é a taxa de falha que a tarefa admite. Um prazo, quando a tarefa tem um, é escrito dentro de $C(z)$: uma resposta depois do prazo não satisfaz o predicado. Assim, a correção, os prazos e o tamanho da tarefa aparecem nas fórmulas desta linha de pesquisa, e cada um aparece como uma restrição. Nenhum aparece como uma pontuação. Entre os sistemas que passam pela porta, só os joules os ordenam. Parâmetros, tokens, pontuações em benchmarks e preços têm peso zero nessa ordem. É isso que "colapsam a zero" significa. A correção se torna a restrição, e a energia se torna a única métrica. Essa é a tese. A energia até a solução na computação de alto desempenho e as medições condicionadas à acurácia do MLPerf Power têm a mesma forma [260]. Esta linha de pesquisa coloca uma definição de elegibilidade diante da porta e lê os joules como uma densidade medida. A Seção 2.3 enuncia a classificação. A Proposição 8 prova que ela é uma ordem total sobre os sistemas que sobrevive a um erro limitado do medidor, e que o $\iota$ integrado não é.

A ordem importa. Uma derivada precisa de uma trajetória. Uma trajetória precisa de algo que se mova. A definição diz o que se move. A cinemática diz como isso pode se mover. A inteligência é lida na trajetória depois.

Esta linha de pesquisa testa essa ordem contra a literatura. Ela classifica cada fonte em três categorias.

- **Provado:** teoremas e derivações. O resultado decorre de hipóteses declaradas.
- **Demonstrado:** experimentos, medições e simulações. O resultado foi observado.
- **Opinião:** artigos de posição, arcabouços, definições e filosofia. O resultado é argumentado.

Nenhuma fonte é excluída por seu método. Cada fonte é situada pelo que ela dá à definição, à cinemática ou ao cálculo.

<div id="terms" class="anchor-alias" aria-hidden="true"></div>

### Termos

- **SI:** o Sistema Internacional de Unidades.
- **Joule (J):** a unidade de energia do SI. Um watt durante um segundo.
- **$k_B$:** a constante de Boltzmann, $1.380649 \times 10^{-23}$ J/K, exata por definição do SI.
- **Produção de entropia ($\Sigma$):** a entropia total que um processo cria, em unidades de $k_B$. Ela é zero apenas para um processo reversível.
- **Informação mútua ($I$):** o número de bits que uma variável carrega sobre outra.
- **Atividade dinâmica ($A$):** a taxa de saltos entre estados em um processo estocástico. Ela mede quão agitada é a dinâmica.
- **TUR (relação de incerteza termodinâmica):** um teorema que liga a precisão de uma corrente à sua produção de entropia.
- **NMR (ressonância magnética nuclear):** um método que controla e lê spins moleculares.
- **Taxa de instabilidade ($\Lambda$):** a rapidez com que um mundo não controlado se afasta da meta, em nats por segundo. Para uma planta linear executada a $f$ passos por segundo, $\Lambda = f\sum_{|\lambda_i|>1}\ln|\lambda_i|$.
- **Erro de reinicialização ($\varepsilon$):** a probabilidade de que um registro de reinicialização não esteja em seu estado mais provável.
- **Observável de contagem:** uma grandeza de uma trajetória que conta saltos selecionados. Ela nunca diminui.
- **Derivada de Radon-Nikodym:** a densidade de uma medida em relação a outra. Ela existe quando a primeira medida dá massa zero a todo conjunto ao qual a segunda dá massa zero.
- **Mixture of Limits (mistura de limites):** a regra de usar o mecanismo (engrenagem) mais barato que seja suficiente. Existem pisos além dos quais tokens, parâmetros ou joules adicionais não compram progresso verificável. Gastar além do piso é desperdício. Esse piso é o platô (convergência de limiar). Mixture of Limits não é uma cascata fixa. Uma ordem de cascata fixa é uma instância dela. O seletor da lei σ é outra.
- **Recibo:** um registro anexado a cada ato, que guarda sua previsão, seu resultado e seus joules.

<div id="2-formal-framework" class="anchor-alias" aria-hidden="true"></div>

## 2. Arcabouço formal

As definições fixam os termos. As proposições são provadas a partir de teoremas citados, com suas hipóteses declaradas.

A Figura 1 mostra como as três camadas se empilham.

![Diagrama de três camadas empilhadas. Embaixo, camada 1: a definição e a porta, elegibilidade, com quatro cláusulas: previsão primeiro, acoplamento ao mundo, consequência assumida e o orçamento de joules. No meio, camada 2: cinemática, a rapidez com que a agência se move por segundo e por joule, limitada pelo piso de Landauer, pelos limites de velocidade, pela relação de incerteza termodinâmica e pelo teorema da taxa de dados. No topo, camada 3: cálculo, a inteligência iota é igual a dX sobre dJ, lida em retrospectiva.](/figures/agency/three-layers.svg)

*Figura 1. A agência em três camadas. Diagrama das Seções 2.1 a 2.3: a definição e a porta, os limites cinemáticos e a inteligência como o cálculo da agência. Uma [cópia em PNG](/figures/agency/three-layers.png) é fornecida.*

<div id="21-layer-1-the-law-eligibility" class="anchor-alias" aria-hidden="true"></div>

<div id="21-layer-1-the-definition-and-its-gate-eligibility" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Camada 1. A definição e sua porta: elegibilidade

Para um sistema $S$, um ato $a$ e um orçamento de episódio $B$ em joules, a elegibilidade $E(S,a) \in \{0,1\}$ é igual a 1 somente quando as quatro cláusulas valem.

1. **Previsão primeiro.** Um gabarito de resultado $R^*(a)$ é fixado no instante $t_0$, antes do ato, e ele discrimina: $D(R^*(a)) \ge d_0$. Aqui $D$ é a probabilidade de que o gabarito rejeite um resultado obtido sem o ato, e $d_0 > 0$ é fixado junto com o gabarito. Um gabarito que aceita todo resultado não prevê nada.
2. **Acoplamento ao mundo.** $I(\mathrm{do}(a); W') > 0$. Aqui $W'$ é o estado do mundo a jusante do atuador, e $\mathrm{do}(a)$ é o operador de intervenção de Pearl [1]. O acoplamento precisa sobreviver a mudanças nas próprias entradas do sistema. Editar os próprios sensores não conta [2].
3. **Consequência assumida.** A comparação $m = M(R, R^*(a)) \in \{1, \mu, 0\}$ (correspondência, parcial, não correspondência) muda o sistema: $s_{t+1} = f(s_t, m)$.
4. **Piso físico: o orçamento de joules.** $J(a) \le B$. Se nenhum ato satisfaz as cláusulas 1 a 4, o ato é a recusa, com um recibo.

A física já atribui preço às cláusulas 1 a 3. A segunda lei com realimentação [3, 4] e o limite de medição e apagamento [5] dão, para um único banho à temperatura $T$:

$$
W_{\mathrm{ext}} \le -\Delta F + k_B T\, I, \qquad W_{\mathrm{meas}} + W_{\mathrm{erase}} \ge k_B T\, I
$$

Aqui $I$ é a informação mútua que a comparação do ato adquire, em nats. Um bit equivale a $\ln 2$ nats, de modo que cada bit custa $k_B T\ln 2$. Um aceitador que compara e depois reinicializa paga pelo menos $k_B T \ln 2$ por bit ao longo de um ciclo fechado [6, 7]. A definição é física desde a sua primeira cláusula.

<div id="definition-1-coupling" class="anchor-alias" aria-hidden="true"></div>

#### Definição 1. Acoplamento

A cláusula 2 é medida pelo fluxo de informação causal. Seja o ato $a$ sorteado da política $p(a)$ e fixado por intervenção, e seja $W'$ o mundo a jusante do atuador. Então

$$
I(\mathrm{do}(a); W') = \sum_{a} p(a) \sum_{w} p(w \mid \mathrm{do}(a)) \log_2 \frac{p(w \mid \mathrm{do}(a))}{\sum_{a'} p(a')\, p(w \mid \mathrm{do}(a'))}
$$

Esse é o fluxo de informação de Ay e Polani do nó do ato até $W'$ [8]. Ele é igual à informação mútua da distribuição conjunta intervencional $p(a)\,p(w \mid \mathrm{do}(a))$. Seu máximo sobre as políticas é a capacidade do canal que vai dos atos ao mundo:

$$
0 \;\le\; I(\mathrm{do}(a); W') \;\le\; \max_{p(a)} I(\mathrm{do}(a); W') \;\le\; \log_2 |\mathcal{A}|
$$

Aqui $\mathcal{A}$ é o conjunto de atos disponíveis. Klyubin, Polani e Nehaniv definiram o empoderamento como essa capacidade, com os próprios sensores futuros do agente no lugar de $W'$ [9]. A cláusula 2 toma o lado do mundo, de modo que editar um sensor não acrescenta nada [2].

**Realizado, não capacidade.** A grandeza creditada a um ato é o fluxo realizado sob a política que o agente executou: $I(\mathrm{do}(a); W')$ naquela $p(a)$. A capacidade é um limite superior e nunca é creditada. Um sistema não recebe crédito pelo acoplamento que poderia ter feito e não fez.

**Estimação.** O fluxo é estimado a partir dos recibos. A política aleatorizada do agente atribui os atos, de modo que as contagens conjuntas de $(a, w)$ no recibo são amostras intervencionais. A informação mútua por substituição (plug-in) dessas contagens tem um viés para cima de cerca de $(|\mathcal{A}|-1)(|\mathcal{W}|-1)/(2n)$ nats para $n$ amostras, sendo $\mathcal{W}$ o conjunto de resultados do mundo distinguíveis. Esse termo de Miller-Madow é subtraído, e um intervalo bootstrap é relatado [315]. Com contagens na escala de recibos, essa correção não basta. O estimador bayesiano de Nemenman, Shafee e Bialek [325] é o substituto declarado para a próxima execução, e o esquema do recibo deve registrar qual estimador produziu cada número. Onde a política é determinística em um contexto, os atos não são aleatorizados ali, e o fluxo não é identificado a partir dessa execução. O recibo então registra o limite de capacidade em sua própria coluna, rotulado como limite, e o $X$ desse contexto é relatado como um limite superior. A execução da Seção 8.11 creditou o limite de capacidade $b = n_{\mathrm{empty}}\log_2 9$. Seu $X$ e seu $\iota$ são limites superiores do acoplamento realizado e da inteligência realizada. Sua classificação por $J^*$ não usa $X$, portanto se mantém.

Por que esta medida:

- **Ela é intervencional.** O do-cálculo de Pearl fornece o operador [1]. Kenton, Kumar, Farquhar, Richens, MacDermott e Everitt definem agentes como sistemas que adaptariam sua política se seus atos influenciassem o mundo de outra maneira, e eles descobrem agentes a partir de dados intervencionais [10]. Um recibo é intervencional por construção. O agente fixa seus atos, e o resultado é lido no mundo.
- **As medidas observacionais falham.** James, Barnett e Crutchfield mostraram por meio de exemplos que a entropia de transferência não mede o fluxo de informação [11]. Lizier e Prokopenko separaram a transferência de informação do efeito causal e atribuíram o efeito causal ao fluxo de informação causal [12].
- **Ela tem preço.** Sob intervenção, o fluxo é uma informação mútua. A informação mútua é a grandeza que a segunda lei com realimentação e o limite de medição e apagamento precificam em joules [3, 5].
- **Ela não precisa de grafo causal.** Janzing, Balduzzi, Grosse-Wentrup e Schölkopf derivaram uma medida de influência causal a partir de postulados, dados o grafo causal e a distribuição conjunta [13]. Um recibo carrega atos e resultados, não o grafo completo do agente. O fluxo é calculado diretamente a partir deles.
- **O crédito vai para o ato que o causou.** Quando vários atos tocam um mesmo resultado, os bits creditados ao ato $k$ seguem a explicação da causalidade efetiva para transições únicas dada por Albantakis, Marshall, Hoel e Tononi [14].

<div id="definition-2-agent-boundary" class="anchor-alias" aria-hidden="true"></div>

#### Definição 2. Fronteira do agente

Seja o sistema físico um conjunto finito $V$ de componentes, cada um atrás de uma parede medida. Um agente candidato é um subconjunto $S \subseteq V$, ou uma granulação grossa de um subconjunto, que guarda o registro de cada comparação $m_k$ (cláusula 3), com $W'$ fora de $S$. Para uma execução concluída, seja $X_S$ o número de bits acoplados confirmados creditados tomando $S$ como o agente, e seja $J_S$ o número de joules medidos na parede de $S$.

**O agente é um candidato que maximiza $X_S / J_S$.**

$V$ é finito, de modo que há finitos candidatos. Um maximizador existe sempre que algum candidato tem $J_S > 0$. O recibo nomeia o maximizador e registra qualquer empate.

**Medição fechada no ato.** A cláusula 4 cobra os joules de um ato do agente que age. Assim, um candidato creditado com o acoplamento de um ato é cobrado por todo joule que o realiza: os joules do atuador que executa o ato e do enlace que transporta o comando. O $J_S$ da Definição 2 é lido sob essa regra. Takahashi e Hayashi mostram por que a regra é necessária. Com uma fronteira aberta, o ganho de informação e a dissipação dentro da fronteira se desacoplam, e os bits por joule podem ser tornados tão grandes quanto se queira [239].

<div id="lemma-1-the-maximizing-boundary-contains-the-actuator" class="anchor-alias" aria-hidden="true"></div>

#### Lema 1. A fronteira maximizadora contém o atuador

**Configuração.** Um componente $\alpha \in V$, o atuador, é um corte entre o restante de $V$ e o mundo: todo caminho causal de um componente de $V \setminus \{\alpha\}$ até $W'$ passa pela saída $a$ de $\alpha$. Um candidato $S$ com $\alpha \notin S$ age sobre $W'$ apenas por meio de um comando $c$ que ele envia a $\alpha$. As paredes são disjuntas, como na Proposição 7, de modo que $J_{S \cup \{\alpha\}} = J_S + J_\alpha + J_0$, com joules de enlace $J_0 \ge 0$.

**Suposições.**

- (B1) Corte. Para um candidato sem $\alpha$, $c \to a \to W'$ é uma cadeia de Markov sob intervenção em $c$.
- (B2) Medição fechada no ato. Um candidato sem $\alpha$ ao qual se credita acoplamento por meio de $\alpha$ é cobrado por $J_S + J_\alpha + J_0$.
- (B3) Um empate entre candidatos fica com o maior por inclusão.

**Enunciado.** Para todo candidato $S$ com $\alpha \notin S$ e joules cobrados positivos, $X_S / (J_S + J_\alpha + J_0) \le X_{S\cup\{\alpha\}} / J_{S\cup\{\alpha\}}$. Assim, algum maximizador da Definição 2 contém $\alpha$, e sob (B3) o maximizador nomeado o contém. A desigualdade é estrita sempre que o atuador acrescenta acoplamento, $X_S < X_{S\cup\{\alpha\}}$.

**Prova.**

1. Fixe um ato. Os dois candidatos guardam os mesmos registros de comparação, porque $S$ guarda todo registro (Definição 2) e $S \cup \{\alpha\}$ contém $S$. Assim, $E_k$ e $m_k$ são os mesmos para ambos. Por (B1) e pela desigualdade de processamento de dados, aplicada à distribuição conjunta intervencional, $I(\mathrm{do}(c); W') \le I(\mathrm{do}(a); W')$. Somando sobre os atos, $X_S \le X_{S\cup\{\alpha\}}$.
2. Por (B2) e pela composição de paredes (Proposição 7, parte 1), os joules cobrados de $S$ são iguais a $J_{S\cup\{\alpha\}}$.
3. O passo 1 sobre o denominador comum do passo 2 dá a desigualdade. Ela é estrita quando $X_S < X_{S\cup\{\alpha\}}$.
4. $V$ é finito, de modo que um maximizador $S^*$ existe. Se $\alpha \notin S^*$, o passo 3 torna $S^* \cup \{\alpha\}$ também um maximizador, e (B3) o nomeia. $\blacksquare$

**Leitura.** Sem (B2), a Definição 2 é degenerada. Um subconjunto pequeno que guarda os registros e deixa o consumo do atuador fora de sua parede relata os mesmos bits acoplados com menos joules. A medição fechada no ato elimina isso, sem custo na prática, porque os joules do atuador já estão no recibo pela cláusula 4. Os componentes fora do caminho causal continuam sendo eliminados pela razão: retirar um deles deixa $X$ inalterado e reduz $J$. A busca não percorre todos os $2^{|V|}$ subconjuntos. Ela percorre os candidatos que guardam os registros e contêm o atuador. Em um host, eles são poucos: processador, acelerador, memória, atuador. Um único medidor basta quando seus domínios atribuem potência a esses componentes (Seção 8.1).

Por que esta fronteira:

- **A razão, não $X_S$ sozinho.** Maximizar apenas $X_S$ não põe preço nos componentes que acrescentam joules e nenhum bit confirmado. A razão os elimina.
- **Não o manto de Markov.** Aguilera, Millidge, Tschantz e Buckley derivaram que a condição de manto de Markov vale apenas em uma faixa estreita de parâmetros, mesmo para sistemas estocásticos lineares fracamente acoplados [15]. Biehl, Pollock e Kanai provaram por contraexemplo que as definições de manto de Markov em uso não são equivalentes [16]. Bruineberg, Dołęga, Dewhurst e Baltieri separam o manto como ferramenta de inferência do manto como fronteira física [17].
- **Nenhum observador.** Orseau, McGregor McGill e Legg definem agente e dispositivo por uma comparação bayesiana de duas descrições do mesmo comportamento, de modo que o rótulo depende das probabilidades a priori do observador [18]. $X_S$ e $J_S$ são lidos em recibos e medidores.
- **Uma fronteira encontrada por uma medida.** A IIT 4.0 (teoria da informação integrada) toma o sistema como o conjunto de elementos com poder de causa e efeito integrado máximo [19]. Krakauer, Bertschinger, Olbrich, Flack e Ay identificam indivíduos como agregados que propagam informação de seu passado para seu futuro [20]. A Definição 2 mantém a forma e usa a moeda da própria definição: bits acoplados confirmados por joule.
- **As granulações grossas contam.** Hoel, Albantakis e Tononi mostraram que uma descrição macro pode carregar mais poder causal do que a micro [21].
- **As ferramentas movem a fronteira.** Quando uma pessoa usa uma ferramenta, os candidatos incluem a pessoa sozinha, a ferramenta sozinha e o par. A Definição 2 credita o acoplamento a qualquer candidato que maximize $X_S/J_S$, com todo joule do ato cobrado dele. Krakauer modela a pessoa, a ferramenta e a tarefa como um único sistema dinâmico no qual a competência retida e a dependência coevoluem. Acima de uma disponibilidade crítica da ferramenta, a competência colapsa para um piso de dependência, e sob uma meta incerta a própria agência pode passar para a ferramenta [340]. Nesse modelo, uma ferramenta cujo funcionamento o usuário consegue reconstruir, como um ábaco, deixa a competência com a pessoa depois que a ferramenta é retirada, enquanto a navegação por satélite fica na região em que a competência diminui com o uso [340]. A razão da Definição 2 torna essa transferência mensurável: teste a pessoa sem a ferramenta, e os bits confirmados que restam são os que a pessoa detém.
- **Todo candidato tem uma interface.** Rosas, Mediano, Biehl, Chandaria e Polani provaram que todo processo estocástico bipartido tem um manto causal e deram um algoritmo que o encontra a partir de dados sem hipótese de estado estacionário nem de Markov [22].

<div id="22-layer-2-kinematics" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Camada 2. Cinemática

Os joules acumulados são $J(t) = \int_0^t P(t')\,dt'$, sendo $P$ a potência medida.

O deslocamento de agência conta bits de mudança confirmada e acoplada:

$$
X(t) = \sum_{k:\,t_k \le t} E_k\, m_k\, I(\mathrm{do}(a_k); W'_k)
$$

Por ato, $I(\mathrm{do}(a_k); W'_k)$ é o fluxo realizado da política que escolheu $a_k$, estimado sobre os atos da execução no mesmo contexto (Definição 1).

A velocidade por segundo é $v_t = dX/dt$. A velocidade por joule é $v_J = dX/dJ$. A aceleração por joule é $\alpha_J = d^2X/dJ^2$. O orçamento é $J(T) \le B$.

Os limites cinemáticos são os limites sobre essas grandezas.

**K1. Piso de Landauer, ciclo fechado.** Cada bit confirmado é registrado e depois apagado para reinicializar o aceitador. Assim

$$
v_J \le \frac{1}{k_B T \ln 2}.
$$

A $T = 300$ K, $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J, calculado a partir das constantes do SI. Isso dá cerca de $3.5 \times 10^{20}$ bits por joule. A Proposição 1 prova K1 ato por ato, para os joules médios de cada ato, sob hipóteses declaradas sobre o registro.

**K2. Limite de velocidade clássico.** Shiraishi, Funo e Saito provaram este limite para um processo de saltos de Markov com balanço detalhado local [23]:

$$
\tau \;\ge\; \frac{L\big(p(0),p(\tau)\big)^2}{2\,\Sigma_{\mathrm{tot}}\,\langle A\rangle_\tau}
$$

- $L(p,p') = \sum_i |p_i - p'_i|$ é a distância $L_1$ completa entre duas distribuições de probabilidade. Não há fator de 1/2. Com a distância de variação total $d_{TV} = L/2$, o mesmo limite se escreve $\tau \ge 2 d_{TV}^2/(\Sigma_{\mathrm{tot}}\langle A\rangle_\tau)$.
- $\Sigma_{\mathrm{tot}} = \int_0^\tau \dot\Sigma\,dt$ é a produção de entropia total, do sistema mais os banhos, em unidades de $k_B$.
- $A(t) = \sum_{i\ne j} W_{ij}(t)\,p_j(t)$ é a atividade dinâmica, sendo $W_{ij}$ a taxa de salto do estado $j$ para o estado $i$. $\langle A\rangle_\tau = \frac{1}{\tau}\int_0^\tau A(t)\,dt$ é sua média temporal.

Reorganizando, $\Sigma_{\mathrm{tot}} \ge L^2/(2\tau\langle A\rangle_\tau)$. Deslocar uma distribuição para longe, depressa e com poucos saltos custa entropia.

**Forma em joules.** Para um único banho, $k_B T\,\Sigma_{\mathrm{tot}} = W - \Delta F_{\mathrm{neq}}$, sendo $F_{\mathrm{neq}}$ a energia livre fora do equilíbrio [24]. Assim, o trabalho dissipado obedece a

$$
W_{\mathrm{diss}} \;\ge\; \frac{k_B T\, L^2}{2\,\tau\,\langle A\rangle_\tau}.
$$

**Correntes estacionárias.** O mesmo artigo dá $\tau \ge c^* L^2 / (2\,\Sigma_{HS}\,\langle A\rangle_\tau)$, com $c^* = 0.896\ldots$ e $\Sigma_{HS}$ a produção de entropia de Hatano-Sasa, ou em excesso [23].

**K3. A precisão custa dissipação.** Os atos são forçados e não estacionários, de modo que a forma que se aplica é a relação de incerteza de Koyuk e Seifert para forçamento dependente do tempo [323]; a forma de estado estacionário é enunciada aqui para referência. Para uma corrente $Y$ antissimétrica no tempo em estado estacionário, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma_{\mathrm{tot}}$ [25, 26]. Os agentes usam realimentação, e a realimentação supera esse limite em experimento [27]. O limite para agentes é a forma com realimentação, na qual a informação mútua entra no limite [28]. A Proposição 3 o enuncia para a agência confirmada.

**K4. Custo em tempo finito.** Apagar um bit em tempo finito $\tau$ custa mais do que $k_B T \ln 2$. O excesso cresce à medida que $\tau$ diminui [29]. Perto do equilíbrio, o trabalho em excesso ao longo de um protocolo é limitado inferiormente pelo quadrado do comprimento termodinâmico dividido pela duração [30]. A Proposição 1 dá o piso para um ato inteiro.

**K5. Teto quântico da taxa.** Um sistema com energia média $\langle E\rangle$ acima de seu estado fundamental faz no máximo $2\langle E\rangle/(\pi\hbar)$ transições ortogonais por segundo [31]. Isso dá cerca de $6.04 \times 10^{33}$ transições por segundo por joule, calculado a partir das constantes. O número de cerca de $3 \times 10^{33}$ às vezes citado é $2E/h$, metade da taxa de Margolus-Levitin, já que $2E/(\pi\hbar) = 4E/h$.

<div id="proposition-1-joule-floor-of-one-act-in-finite-time" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 1. Piso de joules de um ato em tempo finito

**Configuração.** O ato $k$ escreve sua comparação em um registro $M_k$ com $N$ estados e depois reinicializa o registro. O registro é um processo de saltos de Markov com balanço detalhado local, em contato com um único banho à temperatura $T$. Durante a escrita, o resultado comparado $R_k$ é mantido fixo, e as taxas de salto do registro podem depender dele. Durante a reinicialização, as taxas do registro não dependem de mais nada, de modo que o registro evolui sozinho. A reinicialização dura $\tau_k$. $\langle A\rangle_k$ é a atividade dinâmica média no tempo do registro durante a reinicialização. Joules e trabalhos são médias sobre o ensemble do ato $k$.

**Suposições.**

- (R1) Os estados do registro têm energia igual. O registro não compartilha energia de interação com $R_k$ no início nem no fim da escrita. No início do ato, o registro está em sua distribuição de prontidão $q^0$, independente de $R_k$.
- (R2) Os bits creditados não excedem a informação que a escrita deixa no registro: $b_k \le I(M_k; R_k)$, em bits, ao final da escrita. O registro fica inalterado entre a escrita e a reinicialização.
- (R3) A reinicialização devolve o registro a $q^0$. O erro de reinicialização é $\varepsilon = 1 - \max_s q^0_s$.
- (R4) O trabalho da escrita e da reinicialização passa pelo medidor: $J_k \ge W_k^{\mathrm{write}} + W_k^{\mathrm{reset}}$.

**Enunciado.**

$$
J_k \;\ge\; b_k\, k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Aqui $(x)_+ = \max(x, 0)$, $h_2(x) = -x\log_2 x - (1-x)\log_2(1-x)$ é a entropia binária e $\phi_N(x) = h_2(x) + x\log_2(N-1)$. Em $[0, 1 - 1/N]$, $\phi_N$ cresce de 0 a $\log_2 N$, de modo que sua inversa está definida em $[0, \log_2 N]$. Para um registro de um bit que confirma um bit, $\phi_2^{-1}(1) = 1/2$ e

$$
J_k \;\ge\; k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[(1/2 - \varepsilon)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Quando $\varepsilon \to 0$, isso tende a $k_B T\ln 2 + k_B T/(2\tau_k\langle A\rangle_k)$.

**Prova.**

1. Para um processo de saltos de Markov isotérmico com balanço detalhado local, $W = \Delta F_{\mathrm{neq}} + k_B T\, \Sigma_{\mathrm{tot}}$ com $\Sigma_{\mathrm{tot}} \ge 0$. Aqui $F_{\mathrm{neq}} = \langle E\rangle - k_B T\, S$, sendo $S$ a entropia de Shannon em nats [24].
2. A escrita. Aplique o passo 1 ao par $(M_k, R_k)$ com $R_k$ fixo. Por (R1), a energia média não muda e o par começa independente. A entropia de $R_k$ não muda. Assim, a entropia conjunta muda em $H(q') - I - H(q^0)$, em que $q'$ é a distribuição do registro depois da escrita e $I = I(M_k; R_k)$, tudo em nats. Assim, $W_k^{\mathrm{write}} \ge k_B T\,[\,I - H(q') + H(q^0)\,]$.
3. A reinicialização. O registro evolui sozinho, de modo que o passo 1 se aplica ao registro. Sua energia não muda. Por (R2) e (R3), sua entropia vai de $H(q')$ a $H(q^0)$. Assim, $W_k^{\mathrm{reset}} = k_B T\,[\,H(q') - H(q^0)\,] + k_B T\, \Sigma^{\mathrm{reset}}$.
4. Os passos 2 e 3 e (R4) dão $J_k \ge k_B T\, I + k_B T\, \Sigma^{\mathrm{reset}}$. As entropias do registro se cancelam ao longo do ciclo. Em bits, $k_B T\, I = k_B T\ln 2\; I(M_k;R_k) \ge b_k\, k_B T\ln 2$ por (R2). Esse é o limite de medição e apagamento de Sagawa e Ueda [5], aqui para qualquer distribuição de prontidão.
5. O limite de velocidade clássico dá $\Sigma^{\mathrm{reset}} \ge L^2/(2\tau_k\langle A\rangle_k)$, com $L = \sum_s \lvert q'_s - q^0_s\rvert$ [23]. Tome $s$ com $q^0_s = \max q^0 = 1 - \varepsilon$. Os demais estados carregam, no total, a mudança oposta, de modo que $L \ge 2(q^0_s - q'_s) \ge 2\,[(1 - q'_{\max}) - \varepsilon]$.
6. A desigualdade de Fano, sem informação lateral e com o estado mais provável como palpite, dá $H(q') \le h_2(1-q'_{\max}) + (1-q'_{\max})\log_2(N-1) = \phi_N(1 - q'_{\max})$, em bits. Como $1 - q'_{\max} \le 1 - 1/N$ e $\phi_N$ é crescente ali, $1 - q'_{\max} \ge \phi_N^{-1}(H(q'))$. Por (R2), $H(q') \ge I(M_k;R_k) \ge b_k$, e $\phi_N^{-1}$ é crescente. Assim, $L \ge 2\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+$.
7. Os passos 4 a 6 dão o enunciado. $\blacksquare$

**Leitura.** O piso é a soma de dois preços. O preço da informação é $k_B T\ln 2$ por bit confirmado, pago ao longo do ciclo fechado qualquer que seja o estado de prontidão. O preço da velocidade pertence à reinicialização. Uma reinicialização com taxas finitas nunca alcança um único estado em tempo finito, de modo que $\varepsilon > 0$ em todo $\tau_k$ finito, e o preço da velocidade carrega esse erro. K1 vale ato por ato em todo $\tau_k$. Limites de apagamento mais apertados para dinâmicas específicas também são limites inferiores da mesma reinicialização (Seção 4.1). Por ato, a velocidade por joule é

$$
v_{J,k} = \frac{b_k}{J_k} \;\le\; \frac{b_k}{b_k\, k_B T \ln 2 + 2 k_B T\,\big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2/(\tau_k\langle A\rangle_k)} \;\le\; \frac{1}{k_B T \ln 2}
$$

A última desigualdade é estrita sempre que $\phi_N^{-1}(b_k) > \varepsilon$ com $\tau_k\langle A\rangle_k$ finito.

<div id="proposition-2-standing-joules-to-hold-a-goal" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 2. Joules permanentes para manter uma meta

**Configuração.** O mundo é uma planta linear $x_{t+1} = A x_t + B u_t + w_t$, com $x_t \in \mathbb{R}^n$. No passo $t$, o agente escreve um registro de valores finitos $c_t$ da planta. Sua memória $s_t$ é uma função de valores finitos de $(s_{t-1}, c_t)$, com $s_0$ fixo, e seu ato $u_t$ é uma função de $s_t$. Guardar todos os registros, $s_t = (s_{t-1}, c_t)$, é uma memória desse tipo. A meta é manter a planta: $\sup_t \mathbb{E}\|x_t\|^2 < \infty$.

**Suposições.**

- (C1) O ruído $w_t$ é independente de $(x_t, s_t)$.
- (C2) $x_0$ tem uma densidade com entropia diferencial finita e segundo momento finito.
- (C3) Contabilidade de ciclo fechado por passo. $J_t$ é a média de joules atribuídos ao registro $c_t$: sua escrita e seu apagamento posterior, quando quer que sejam pagos. $J_t \ge k_B T\, I(x_t; c_t \mid s_{t-1})$, com a informação em nats. Isso é a Proposição 1, passos 1 a 4, em cada valor da memória $s_{t-1}$, com um registro novo em seu estado de prontidão e $x_t$ mantido fixo durante a escrita [5]. Uma memória de tamanho limitado apaga cada registro dentro de um número limitado de passos, de modo que os joules atribuídos caem dentro da execução, a menos de um termo de fronteira.

**Enunciado.** Este é um corolário com preço em joules do teorema da taxa de dados de Tatikonda e Mitter [169] e de Nair e Evans [170]. A desigualdade de malha fechada de Touchette e Lloyd [32, 33] leva a taxa até o registro, e o preço de apagamento de Landauer [6] converte cada bit em $k_B T\ln 2$ joules. Ele é novo apenas como essa composição. Sejam $\lambda_1, \dots, \lambda_n$ os autovalores de $A$. Então

$$
\liminf_{N\to\infty} \frac{1}{N}\sum_{t=1}^{N} J_t \;\ge\; k_B T \ln 2 \sum_{i:\,|\lambda_i| > 1} \log_2 |\lambda_i|
$$

**Prova.**

1. Escolha coordenadas reais nas quais $A = \mathrm{diag}(A_u, A_s)$, com $A_u$ carregando exatamente os autovalores de módulo maior que 1. Seja $y_t$ o bloco instável de $x_t$. Então $y_{t+1} = A_u y_t + v_t + e_t$, em que $v_t$ é uma função de $s_t$ e $e_t$ é independente de $(y_t, s_t)$ por (C1). Uma mudança linear de coordenadas desloca as entropias diferenciais por uma constante, de modo que a finitude não se altera.
2. Seja $D_t = h(y_t \mid s_t)$, uma entropia diferencial condicional em nats. Somar ruído independente não reduz uma entropia condicional. Deslocar por uma função de $s_t$ não a altera. A aplicação linear $A_u$ acrescenta $\ln|\det A_u|$. Assim, $h(y_{t+1} \mid s_t) \ge D_t + \ln|\det A_u|$.
3. $s_{t+1}$ é uma função de $(s_t, c_{t+1})$, e condicionar a menos nunca reduz a entropia. Assim, $D_{t+1} \ge h(y_{t+1}\mid s_t, c_{t+1}) = h(y_{t+1}\mid s_t) - I(y_{t+1}; c_{t+1} \mid s_t)$. Como $y$ é uma função de $x$, $I(y_{t+1}; c_{t+1}\mid s_t) \le I(x_{t+1}; c_{t+1}\mid s_t)$. Essa é a desigualdade de malha fechada de Touchette e Lloyd [32, 33].
4. Os passos 2 e 3 dão $I(x_{t+1}; c_{t+1}\mid s_t) \ge \ln|\det A_u| - (D_{t+1} - D_t)$. Somando sobre $N$ passos, $\sum_{t=1}^{N} I(x_t; c_t\mid s_{t-1}) \ge N \ln|\det A_u| - (D_N - D_0)$.
5. Cada registro tem valores finitos, de modo que cada termo de informação é finito. $D_0 = h(y_0)$ é finito: o segundo momento o limita por cima, e $h(x_0) \le h(y_0) + h(x^{\mathrm{s}}_0)$, sendo $x^{\mathrm{s}}_0$ o bloco estável, o limita por baixo, por (C2). $D_N \le h(y_N)$, e uma gaussiana tem a maior entropia para uma dada covariância, de modo que o segundo momento limitado limita $D_N$ por cima. Dividindo por $N$, a informação média por passo é pelo menos $\ln|\det A_u| = \sum_{|\lambda_i|>1}\ln|\lambda_i|$ no limite.
6. (C3) atribui a cada nat o preço $k_B T$, que equivale a $k_B T\ln 2$ por bit. $\blacksquare$

**Leitura.** Um agente que mantém uma meta contra um mundo instável paga uma potência permanente de pelo menos $f\, k_B T\ln 2\sum_{|\lambda_i|>1}\log_2|\lambda_i|$ a $f$ passos de controle por segundo. Um modo instável com $|\lambda| = 2$ precisa de um bit por passo, o que equivale a $k_B T\ln 2 \approx 2.87\times10^{-21}$ J por passo a 300 K. Os bits por passo do registro limitam por cima sua informação, de modo que a prova também dá uma forma não estrita e em média do teorema da taxa de dados (Seção 4.1). A composição é curta. Ela é o teorema da taxa de dados de Tatikonda e Mitter e de Nair e Evans [169, 170], com o preço de $k_B T\ln 2$ por bit por meio de Touchette e Lloyd [32, 33]. O que ela acrescenta é o preço em joules, que é o piso de que a Previsão 1 precisa.

<div id="proposition-3-precision-of-confirmed-agency" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 3. Precisão da agência confirmada

**Configuração.** O agente, seu mundo e sua realimentação formam um único processo de saltos de Markov homogêneo no tempo e irredutível sobre finitos estados, em seu estado estacionário. Cada ato confirmado é um salto de um tipo marcado. $N(t)$ conta os atos confirmados em $[0,t]$. $\langle K\rangle$ é o número médio de saltos de todos os tipos em $[0,t]$, e $\langle k\rangle = \langle K\rangle/t$ é a taxa média de saltos.

**Enunciado.**

1. No limite de tempo longo, $\mathrm{Var}(N)/\langle N\rangle^2 \ge 1/\langle K\rangle$. Se todo ato confirmado credita os mesmos $b$ bits, então $X = bN$ e o mesmo limite vale para $X$.
2. Seja $T_n$ o instante em que o $n$-ésimo ato confirmado se fecha. Para $n$ grande, $\mathrm{Var}(T_n)/\langle T_n\rangle^2 \ge 1/(\langle T_n\rangle\langle k\rangle)$.
3. Seja agora $X$ ímpar sob a aplicação para o experimento reverso de uma relação de flutuação que inclui um termo de informação, $P_B(-X,-\sigma_I)/P(X,\sigma_I) = e^{-\sigma_I}$. Então

$$
\frac{\mathrm{Var}(X) + \mathrm{Var}_B(X)}{\big(\langle X\rangle + \langle X\rangle_B\big)^2} \;\ge\; \frac{1}{\exp\!\big[(\langle\sigma_I\rangle + \langle\sigma_I\rangle_B)/2\big] - 1}
$$

Quando o experimento reverso é igual ao direto, isso se escreve $\mathrm{Var}(X)/\langle X\rangle^2 \ge 2/\big(e^{\langle\sigma_I\rangle} - 1\big)$.

**Prova.** $N$ é um observável de contagem: ele conta um subconjunto de saltos e nunca diminui. Garrahan provou as partes 1 e 2 para observáveis de contagem em processos de saltos de Markov estacionários [34]. A parte 1 é seu limite para a variância de um observável de contagem pela atividade média. A parte 2 é seu limite de primeira passagem, enunciado para contagens cujos pesos de salto são 0 ou 1, que vale aqui porque $N$ conta um único tipo marcado de salto. Escalar por $b$ deixa uma variância relativa inalterada. A parte 3 é a relação de incerteza que Potts e Samuelsson derivaram de qualquer relação de flutuação, incluídas medição e realimentação [28], aplicada com $X$ como o observável. $\blacksquare$

**Leitura.** A parte 1 não precisa de nenhuma propriedade de reversão temporal nem de modelo da realimentação. A precisão da agência confirmada é comprada com atividade. A parte 3 é o preço da dissipação, e ela vale sob realimentação porque se apoia na relação de flutuação com realimentação. A TUR padrão não restringe máquinas com realimentação em experimento [27]. É por isso que a forma para agentes carrega o termo de informação.

<div id="proposition-4-quantum-agents-keep-the-floor" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 4. Agentes quânticos mantêm o piso

**Configuração.** A comparação $m_k$ vem de uma medição quântica e é escrita em um registrador clássico, o registro da cláusula 3. A reinicialização do registrador satisfaz a configuração da Proposição 1 e (R2) e (R3), sendo $I(M_k;R_k)$ a informação mútua quântico-clássica da medição. O trabalho da reinicialização passa pelo medidor: $J_k \ge W_k^{\mathrm{reset}}$.

**Enunciado.**

$$
J_k \;\ge\; k_B T\ln 2\,\big[\,b_k - \phi_N(\varepsilon)\,\big] \;+\; \frac{2\, k_B T\, \big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Quando $\varepsilon \to 0$, esse é o piso da Proposição 1. Quando a escrita também é medida, o limite de medição e apagamento de Sagawa e Ueda dá $J_k \ge b_k\, k_B T\ln 2$ em todo $\varepsilon$, sob a hipótese adicional que eles enunciam para a medição quântica [5].

**Prova.** O passo 3 da Proposição 1 usa apenas o registrador e sua dinâmica de reinicialização. Ele dá $W_k^{\mathrm{reset}} = k_B T\ln 2\,[H(q') - H(q^0)] + k_B T\,\Sigma^{\mathrm{reset}}$, com entropias em bits. A informação mútua quântico-clássica é no máximo a entropia dos resultados [5], de modo que $H(q') \ge b_k$. A desigualdade de Fano dá $H(q^0) \le \phi_N(\varepsilon)$, já que $\varepsilon \le 1 - 1/N$. Os passos 5 e 6 da Proposição 1 limitam $\Sigma^{\mathrm{reset}}$. $\blacksquare$

**Leitura.** Os recursos quânticos mudam o que um agente pode fazer por ato. Eles não reduzem o preço de seu registro. O registro custa $k_B T\ln 2$ por bit, menos um resíduo $\phi_N(\varepsilon)$ que se anula à medida que a reinicialização se torna exata. A medição que escreve o registro tem seu próprio preço, dado na Seção 4.1.

<div id="23-layer-3-calculus-intelligence-as-a-derivative-read-in-hindsight" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Camada 3. Cálculo: a inteligência como derivada, lida em retrospectiva

Uma execução produz um recibo: o registro ordenado $\{(J_k, X_k)\}_{k=0}^{n}$ de joules medidos e deslocamento confirmado. Cada $m_k$ só é conhecido depois que o ato $k$ se fecha. Assim, a trajetória $X(J)$ só existe quando a execução está concluída.

- **Inteligência, marginal:** $\iota(J) = \dfrac{dX}{dJ}$, estimada a partir do recibo como $\iota_k = \Delta X_k/\Delta J_k$.
- **Integral da execução:** $X(B) = \int_0^B \iota(J)\,dJ$.
- **Joules para cumprir um requisito:** $J^*(X_{\mathrm{req}}) = \int_0^{X_{\mathrm{req}}} \frac{dX}{\iota}$.
- **Ótimo:** $\pi^* = \arg\min_\pi J_\pi$ sujeito a $X_\pi \ge X_{\mathrm{req}}$, $E_k = 1$ para todo $k$, e $J_\pi \le B$. Se nenhuma política for viável, recuse com um recibo.
- **Classificação:** $S_1 \succ_q S_2 \iff J^*_{S_1}(q) < J^*_{S_2}(q)$.

$X_{\mathrm{req}}$ é fixado pelo predicado de completude $C(z)$ da tarefa. Ele é uma porta, não uma pontuação. Parâmetros, tokens e benchmarks entram apenas por meio de $J^*$. Todos os demais fatores colapsam a zero.

Aqui a retrospectiva é literal. A velocidade é lida em uma trajetória registrada. A inteligência é lida em uma execução registrada. O recibo é a trajetória.

<div id="proposition-5-intelligence-exists-as-a-bounded-density-on-the-joule-axis" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 5. A inteligência existe como uma densidade limitada no eixo dos joules

**Configuração.** Uma execução em $[0, T]$ tem potência medida $P(t) \ge 0$, integrável, e medida de joules $dJ = P\,dt$. O ato $k$ ocupa $[s_k, e_k]$ e credita $b_k = E_k\, m_k\, I(\mathrm{do}(a_k); W'_k) \ge 0$ bits. Os atos podem se sobrepor. Cada ato tem uma potência atribuída $P_k \ge 0$, nula fora de $[s_k, e_k]$, com $\sum_k P_k \le P$. Seus joules são $J_k = \int P_k\,dt > 0$. Para atos que não se sobrepõem, $P_k = P$ no intervalo do ato.

**Regra de creditação.** Os bits de cada ato são distribuídos sobre seus próprios joules:

$$
dX = \sum_k \frac{b_k}{J_k}\, P_k\, dt
$$

**Suposição (K1 por ato).** $b_k\, k_B T \ln 2 \le J_k$ para todo $k$. A Proposição 1 a fornece sob (R1) a (R4) para os joules médios de cada ato, de modo que o enunciado vale para a execução média. Em uma única execução, ela vale sempre que cada ato consome mais de $b_k\, k_B T\ln 2$. Todo ato confirmado na execução da Seção 8.11 consumiu mais de $3 \times 10^{14}$ vezes esse valor.

**Enunciado.**

1. Para todo conjunto mensurável $A \subseteq [0,T]$ de instantes, $0 \le X(A) \le J(A)/(k_B T\ln 2)$. Assim, $dX$ é absolutamente contínua em relação a $dJ$.
2. A derivada de Radon-Nikodym $\iota = dX/dJ$ existe, é única a menos de conjuntos de zero joules e satisfaz

$$
0 \;\le\; \iota \;\le\; \frac{1}{k_B T \ln 2}
$$

Onde $P > 0$, $\iota = \sum_k (b_k/J_k)(P_k/P)$. Para atos que não se sobrepõem, $\iota = b_k/J_k$ no ato $k$, que é o $\iota_k$ do recibo.

3. A agência confirmada é uma função dos joules acumulados: $X(t) = g(J(t))$, com $g$ não decrescente e lipschitziana com constante $1/(k_B T\ln 2)$. Assim, $g$ é diferenciável em quase todo joule, e $g'(J(t)) = \iota(t)$ para quase todo joule.
4. Se, em vez disso, os bits de cada ato forem creditados no instante em que ele se fecha, então $dX = \sum_k b_k\,\delta_{e_k}$ é singular em relação a $dJ$ sempre que algum $b_k > 0$. Então $g$ é uma função escada, $g' = 0$ em quase todo joule, e toda a agência fica em um conjunto de zero joules.

**Prova.**

1. $X(A) = \sum_k (b_k/J_k)\int_A P_k\,dt \le \frac{1}{k_BT\ln 2}\int_A \sum_k P_k\,dt \le \frac{J(A)}{k_BT\ln 2}$, por K1 por ato e depois por $\sum_k P_k \le P$. Se $J(A) = 0$, então $X(A) = 0$.
2. As duas medidas são finitas, de modo que o teorema de Radon-Nikodym fornece $\iota$. Se $\iota > 1/(k_BT\ln 2)$ em um conjunto $B$ com $J(B) > 0$, então $X(B) > J(B)/(k_BT\ln 2)$, contra o passo 1. Em $\{P > 0\}$, $dX = \sum_k (b_k/J_k)(P_k/P)\,dJ$, e $P_k = 0$ onde $P = 0$. Isso dá a forma explícita.
3. Se $J(t_1) = J(t_2)$ com $t_1 < t_2$, o passo 1 dá $X((t_1,t_2]) = 0$, de modo que $g$ está bem definida. Para $t_1 < t_2$, $g(J(t_2)) - g(J(t_1)) = X((t_1,t_2]) \le (J(t_2) - J(t_1))/(k_BT\ln 2)$. $J$ é contínua, de modo que $g$ é lipschitziana em $[0, J(T)]$. Uma função lipschitziana é absolutamente contínua e diferenciável em quase todo ponto. Uma mudança de variáveis dá $\int_0^t g'(J(s))\,dJ(s) = g(J(t)) = X([0,t])$. Assim, $g'\circ J$ também é uma densidade de $X$ em relação a $J$, e ela é igual a $\iota$ pela unicidade.
4. $X(\{e_k\}) = b_k > 0$ enquanto $J(\{e_k\}) = 0$, porque $J$ é contínua. Assim, $dX$ não é absolutamente contínua. Ela fica concentrada em um número finito de pontos de zero joules, de modo que é singular. Uma função constante entre um número finito de saltos tem derivada nula em quase todo ponto. $\blacksquare$

**Leitura.** A inteligência em retrospectiva é uma densidade bem definida no eixo dos joules desde que os bits de cada ato sejam distribuídos sobre os joules que esse ato usou. A regra de creditação é o que faz $dX/dJ$ existir. A creditação pontual coloca toda a agência em um conjunto de zero joules. Atos sobrepostos são tratados por qualquer atribuição que nunca atribua mais joules do que o medidor leu. Cada $b_k$ só é conhecido depois que o ato $k$ se fecha, de modo que $\iota$ é lido na execução concluída.

A Proposição 5 vale por construção. A regra de creditação torna $X$ absolutamente contínua em relação a $J$, de modo que a densidade existe por definição. Seu conteúdo é a escolha da regra: a parte 4 mostra que a outra regra natural, a creditação pontual, não deixa densidade alguma.

<div id="proposition-6-sampled-intelligence-converges" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 6. A inteligência amostrada converge

**Configuração.** O medidor é lido nos joules acumulados $0 = j_0 < j_1 < \dots < j_M = J(T)$, com malha $\Delta = \max_i (j_{i+1} - j_i)$. Em $[j_i, j_{i+1})$, a inteligência amostrada é

$$
\hat\iota = \frac{g(j_{i+1}) - g(j_i)}{j_{i+1} - j_i}
$$

As amostras no tempo refinam as amostras em joules, porque $J$ é contínua.

**Enunciado.** Sob a configuração da Proposição 5, $\hat\iota(j) \to g'(j)$ em quase todo joule $j$ quando $\Delta \to 0$, e $0 \le \hat\iota \le 1/(k_BT\ln 2)$ em toda malha. Se a leitura do medidor de cada intervalo amostrado tem erro relativo de no máximo $\epsilon < 1$, a razão relatada fica em $[\hat\iota/(1+\epsilon),\, \hat\iota/(1-\epsilon)]$.

**Prova.** $\hat\iota(j)$ é a média de $g'$ sobre um intervalo amostrado $I \ni j$ de comprimento $h \le \Delta$. Como $I \subseteq [j - h, j + h]$,

$$
\big|\hat\iota(j) - g'(j)\big| \;\le\; \frac{1}{h}\int_{j-h}^{j+h}\big|g'(u) - g'(j)\big|\,du
$$

O lado direito tende a 0 em todo ponto de Lebesgue de $g'$, e quase todo $j$ é um ponto de Lebesgue pelo teorema de diferenciação de Lebesgue. Os limites de $\hat\iota$ são a monotonicidade e a constante de Lipschitz de $g$. Uma leitura $\Delta\hat J \in [(1-\epsilon)\Delta J, (1+\epsilon)\Delta J]$ divide o mesmo $\Delta X$. $\blacksquare$

<div id="proposition-7-composition-of-joules-and-coupled-bits" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 7. Composição de joules e de bits acoplados

**Configuração.** Um grupo $G$ de membros $i = 1, \dots, n$ age sobre um único mundo $W'$. Cada membro fica atrás de sua própria parede medida. As paredes são disjuntas e ficam dentro da parede do grupo, e todo membro retira sua energia de fora do grupo. Os membros escolhem atos $a_1, \dots, a_n$ por políticas independentes. O acoplamento do membro $i$ é calculado com os outros membros agindo sob suas próprias políticas.

**Enunciado.**

1. $J_G = \sum_i J_i + J_0$, em que $J_0 \ge 0$ é a energia que entra pela parede do grupo e por nenhuma parede de membro.
2. $I(\mathrm{do}(a_1,\dots,a_n); W') \ge \sum_i I(\mathrm{do}(a_i); W')$, com igualdade se e somente se $a_i$ é independente de $(a_1, \dots, a_{i-1})$ dado $W'$ para todo $i$.
3. A desigualdade pode ser estrita quando cada membro, sozinho, está desacoplado. Com $a_1, a_2$ bits uniformes independentes e $W' = a_1 \oplus a_2$, o acoplamento de cada membro é de 0 bits e o do grupo é de 1 bit.
4. Sob K1 por ato na parede do grupo, a Proposição 5 se aplica a $G$: $\iota_G$ existe e $0 \le \iota_G \le 1/(k_BT\ln 2)$. Pela Definição 2, $G$ é o agente quando $X_G/J_G$ excede $X_S/J_S$ para todo outro candidato, incluindo cada membro.

**Prova.**

1. Todo joule que entra pela parede de um membro entra primeiro pela parede do grupo, e a energia medida se soma sobre paredes disjuntas.
2. Sob intervenção, os atos têm a distribuição produto $\prod_i p(a_i)$, e cada acoplamento é uma informação mútua da distribuição conjunta intervencional (Definição 1). O acoplamento do membro $i$ é $I(a_i; W')$ nessa conjunta, marginalizando os outros atos. Pela regra da cadeia, $I(a_{1:n}; W') = \sum_i I(a_i; W' \mid a_{<i})$. A independência dá $I(a_i; a_{<i}) = 0$, de modo que $I(a_i; W' \mid a_{<i}) = I(a_i; W', a_{<i}) = I(a_i; W') + I(a_i; a_{<i} \mid W') \ge I(a_i; W')$. A igualdade vale para todo termo se e somente se $I(a_i; a_{<i}\mid W') = 0$ para todo $i$.
3. Dado apenas $a_1$, $W'$ ainda é um bit uniforme, de modo que $I(a_1; W') = 0$, e o mesmo vale para $a_2$. Dados os dois atos, $W'$ fica fixado, de modo que $I(a_1, a_2; W') = H(W') = 1$ bit.
4. A Proposição 5 precisa apenas da execução, do medidor e de K1 por ato. Aplique-a na parede do grupo. $\blacksquare$

**Leitura.** Os joules se somam, com os vínculos do grupo por cima. Os bits acoplados de membros independentes se somam no mínimo, e alguns existem apenas no nível do grupo. Um grupo eleva $\iota_G$ quando ganha mais bits acoplados do que seus membros detêm sozinhos, ou quando gasta menos joules agindo em conjunto do que seus membros gastam agindo separadamente. A Seção 4.1 apresenta os teoremas que dão preço aos dois termos.

<div id="prediction-1-the-optimal-act-time-of-an-agent-that-holds-a-goal" class="anchor-alias" aria-hidden="true"></div>

#### Previsão 1. O tempo ótimo de ato de um agente que mantém uma meta

**Configuração.** Um aceitador de ciclo fechado executa um ato após o outro. Cada ato escreve um registro com $N$ estados e credita $b$ bits quando confirmado. A comparação, feita antes da reinicialização, confirma com probabilidade $p$. Cada reinicialização satisfaz a Proposição 1, com duração $\tau$, atividade média $\langle A\rangle$ e erro de reinicialização $\varepsilon$. Durante todo o tempo, o agente mantém uma meta contra um mundo com taxa de instabilidade $\Lambda$, por meio de um registrador separado. Todo joule é medido na parede do agente (Definição 2).

**Derivação.** Cada ato dura pelo menos $\tau$. A Proposição 2 dá à manutenção o preço de $k_B T\,\Lambda$ por segundo, no longo prazo. A Proposição 1 dá o preço do ato. Os dois registradores são distintos, de modo que seus joules medidos se somam. Por ato, na média,

$$
J(\tau) \;\ge\; b\,k_B T\ln 2 \;+\; \frac{\kappa}{\tau} \;+\; k_B T\,\Lambda\,\tau, \qquad \kappa = \frac{2k_B T\,\big[\big(\phi_N^{-1}(b) - \varepsilon\big)_+\big]^2}{\langle A\rangle}
$$

Pela Proposição 5, a inteligência da execução é o número de bits confirmados por joule, $\iota(\tau) = p\,b/J(\tau)$. O lado direito do limite de $J$ é mínimo em $\tau^* = \sqrt{\kappa/(k_B T\Lambda)}$, onde vale $b\,k_B T\ln 2 + 2\sqrt{\kappa\,k_B T\Lambda}$. Para um registro de um bit e uma reinicialização exata, isso dá dois números:

$$
\tau^* = \frac{1}{\sqrt{2\,\langle A\rangle\,\Lambda}}, \qquad \iota(\tau) \;\le\; \frac{p}{k_B T\,\big[\ln 2 + \sqrt{2\Lambda/\langle A\rangle}\big]}
$$

**Previsão 1.**

1. **Teto.** Nenhum aceitador que mantém uma meta com taxa de instabilidade $\Lambda$ enquanto age atinge $\iota$ acima de $p/\big(k_B T[\ln 2 + \sqrt{2\Lambda/\langle A\rangle}]\big)$ para atos de um bit, em qualquer tempo de ato. O teto geral é $p\,b/\big(b\,k_B T\ln 2 + 2\sqrt{\kappa\,k_B T\Lambda}\big)$. Ele depende apenas de $T$, $p$, $b$, $N$, $\varepsilon$ e da razão $\Lambda/\langle A\rangle$.
2. **Tempo ótimo de ato.** Suponha que os joules medidos por ato de um aceitador sigam $J(\tau) = J_0 + a/\tau + s\,\tau$. Meça $a$ e $J_0$ a partir de uma varredura de $\tau$ sem meta mantida, e a potência permanente $s$ a partir da meta mantida sem atos. Então o $\iota(\tau)$ medido tem pico em $\tau^* = \sqrt{a/s}$, no valor $p\,b/(J_0 + 2\sqrt{a s})$, com $a \ge \kappa$ e $s \ge k_B T\Lambda$. A faixa de erro é

$$
\frac{\delta\tau^*}{\tau^*} = \frac{1}{2}\sqrt{\Big(\frac{\delta a}{a}\Big)^2 + \Big(\frac{\delta s}{s}\Big)^2}
$$

3. **Escala.** Ao longo de uma varredura da taxa de instabilidade, $\ln\tau^*$ cai em função de $\ln s$ com inclinação $-1/2$.

**Falseador.** O maximizador medido de $\iota(\tau)$ fica fora de $\tau^* \pm 2\,\delta\tau^*$, ou a inclinação ajustada de $\ln\tau^*$ em função de $\ln s$, ao longo de pelo menos uma década de $s$, se afasta de $-1/2$ por mais de dois erros padrão. Qualquer um dos dois derruba a afirmação de que os joules dos atos e os joules permanentes se somam em um único medidor, com $\iota$ lido como sua densidade. Um $\iota$ medido acima do teto derruba a contabilidade dessa execução (F12, Seção 8.7).

A Figura 2 traça a curva da Previsão 1.

![Ilustração de modelo da Previsão 1. A inteligência relativa iota de tau é traçada em função do tempo de ato tau em um eixo logarítmico para J de tau igual a J zero mais a sobre tau mais s tau. Com s igual a 1, o pico fica em tau estrela igual a 1; com s igual a 4, o pico se desloca para 0.5 e é mais baixo, mostrando a inclinação de menos um meio.](/figures/agency/act-time.svg)

*Figura 2. Um tempo ótimo de ato. Ilustração de modelo, não uma medição: $J(\tau) = J_0 + a/\tau + s\,\tau$ com $J_0 = a = 1$ e $s \in \{1, 4\}$ em unidades normalizadas. Quadruplicar o custo permanente reduz $\tau^*$ à metade, a inclinação de $-1/2$ que o falseador testa. Uma [cópia em PNG](/figures/agency/act-time.png) está disponível.*

**Frente ao trabalho mais próximo.** Um tempo de ciclo ótimo finito não é novo por si só. Paneru e colegas mediram um tempo de ciclo ótimo em potência em um motor de informação browniano [330]. Panizon deriva cronogramas ótimos de medição em função do custo de medição [331], e Rolandi e colegas limitam um compromisso entre energia, tempo e precisão na computação termodinâmica [332]. O que a Previsão 1 acrescenta é a origem do ótimo interior, um custo permanente de manter uma meta contra a deriva, e sua lei de escala: $\tau^*$ cai como $\Lambda^{-1/2}$. O teste da inclinação é o falseador distintivo.

**O que é novo.** O limite de Landauer em tempo finito dá preço apenas à memória e cai em direção a $k_B T\ln 2$ à medida que $\tau$ cresce [29]. Nele, a reinicialização mais lenta é a mais barata. O teorema da taxa de dados dá preço apenas à manutenção, por segundo (Seção 4.1). Nenhum dos dois fornece um ótimo interior. A definição mede o agente inteiro, conta apenas bits confirmados e lê $\iota$ como uma densidade no eixo dos joules. Então manter uma meta torna a lentidão cara, e o melhor tempo de ato é a média geométrica do tempo de salto $1/\langle A\rangle$ e do tempo de deriva $1/\Lambda$, a menos do fator $1/\sqrt{2}$. Os custos do próprio controlador entram nos joules da mesma maneira no trabalho de Ehrich, Still e Sivak (Seção 5.1).

**Onde testá-la.** Uma armadilha coloidal de realimentação impõe potenciais virtuais em software e calcula o trabalho a partir de trajetórias na escala de $k_B T$ (Seção 3.2). Uma coordenada executa um ciclo de ato de um bit em um poço duplo virtual com tempo de reinicialização $\tau$. A outra é mantida no topo de um poço invertido virtual de taxa $\Lambda$. Uma caixa de elétron único com um detector de carga executa o mesmo ciclo de ato com cada salto contado, de modo que $\langle A\rangle$ é medido (Seção 3.2). A Seção 8.8 apresenta o protocolo.

<div id="proposition-8-the-gated-ranking" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 8. A classificação com porta

**Configuração.** Fixe uma tarefa $q$, seu predicado $C(z)$ e sua taxa de falha permitida $\delta$. Para cada sistema $S$, $J^*_S(q) \in (0, \infty]$ são os joules até a conclusão correta da Seção 1, com $J^*_S(q) = \infty$ quando nenhuma política de $S$ passa pela porta. Defina $S_1 \preceq_q S_2$ quando $J^*_{S_1}(q) \le J^*_{S_2}(q)$.

**Enunciado.**

1. $\preceq_q$ é uma pré-ordem total sobre sistemas: reflexiva, transitiva e total. A classificação $\succ_q$ da Seção 2.3 é sua parte estrita.
2. Todo sistema que passa pela porta fica classificado acima de todo sistema que falha nela.
3. Suponha que toda leitura dos joules médios de uma política tenha erro relativo de no máximo $\epsilon < 1$. Se $(1+\epsilon)\,J^*_{S_1}(q) < (1-\epsilon)\,J^*_{S_2}(q)$, então $S_1$ fica classificado acima de $S_2$ sob toda leitura admissível.
4. O $\iota$ integrado não induz essa ordem. Existem sistemas com $\iota_{S_1} > \iota_{S_2}$ e $S_2 \succ_q S_1$.

**Prova.**

1. $\preceq_q$ é o pullback da ordem total $\le$ em $(0, \infty]$ pela aplicação $S \mapsto J^*_S(q)$. O pullback de uma ordem total é uma pré-ordem total. Sua parte estrita é $J^*_{S_1} < J^*_{S_2}$, que é a classificação da Seção 2.3.
2. Todo valor finito está abaixo de $\infty$.
3. A leitura de cada política fica em $[(1-\epsilon)J_\pi, (1+\epsilon)J_\pi]$, de modo que o mínimo das leituras sobre as políticas viáveis fica em $[(1-\epsilon)J^*, (1+\epsilon)J^*]$. Então $\hat J^*_{S_1} \le (1+\epsilon)J^*_{S_1} < (1-\epsilon)J^*_{S_2} \le \hat J^*_{S_2}$.
4. Suponha que $S_1$ faça uma tentativa por tarefa a 0.1 J, que passa com probabilidade 1/2, e nunca tente de novo. Suponha que $S_2$ faça uma tentativa a 1 J que sempre passa. Cada aprovação credita $b$ bits. Então $\iota_{S_1} = (b/2)/0.1 = 5b$ bits por joule e $\iota_{S_2} = b$ bits por joule. Para qualquer $\delta < 1/2$, $S_1$ nunca satisfaz a porta, de modo que $J^*_{S_1} = \infty$, enquanto $J^*_{S_2} = 1$ J. $\blacksquare$

**Leitura.** A parte 4 é o mecanismo de R-F6 na Seção 8.11: falhas baratas elevam o $\iota$ integrado e deixam $J^*$ inalterado ou infinito. É por isso que $\iota$ é lido como uma densidade dentro de uma execução e $J^*$ é a classificação entre sistemas. A parte 3 resolve P6 a menos de um $\epsilon$ validado para cada medidor.

<div id="proposition-9-when-cheapest-first-is-optimal" class="anchor-alias" aria-hidden="true"></div>

#### Proposição 9. Quando o mais barato primeiro é ótimo

**Configuração.** Uma tarefa tem engrenagens $g_1, \dots, g_n$. Uma tentativa com a engrenagem $g_i$ custa $c_i > 0$ joules, pagos integralmente, e passa em $C(z)$ com probabilidade $p_i$. Uma política tenta as engrenagens em alguma ordem, para na primeira aprovação e recusa depois da última. Duas estruturas são tratadas. Independente: as aprovações de engrenagens diferentes são eventos independentes. Aninhada: se $g_i$ passa, então toda engrenagem posterior passa, com probabilidades de aprovação $q_1 \le \dots \le q_n$.

**Enunciado.**

1. Engrenagens independentes. Os joules esperados de uma ordem são mínimos quando as engrenagens são tentadas em ordem decrescente de $p_i/c_i$. O mais barato primeiro é ótimo exatamente quando a ordem de custo crescente é também uma ordem de $p_i/c_i$ decrescente.
2. Engrenagens aninhadas, duas delas, com a engrenagem pesada suficiente ($q_H = 1$). Tentar primeiro a engrenagem leve reduz os joules esperados se e somente se $q_L\,c_H > c_L$.
3. Orçamento. Sob um orçamento rígido $B$ com $c_H \le B < c_L + c_H$, a leve primeiro fecha a tarefa com probabilidade $q_L$. A pesada sozinha a fecha com probabilidade 1.

**Prova.**

1. Os joules esperados de uma ordem $\sigma$ são $\sum_k c_{\sigma(k)} \prod_{j<k}(1 - p_{\sigma(j)})$. Troque duas engrenagens adjacentes, $i$ e depois $j$, que seguem um prefixo com probabilidade de sobrevivência $P$. A contribuição delas muda de $P[c_i + (1-p_i)c_j]$ para $P[c_j + (1-p_j)c_i]$, e nada mais muda. Assim, $i$ primeiro não é pior se e somente se $p_i c_j \ge p_j c_i$, isto é, $p_i/c_i \ge p_j/c_j$. Qualquer ordem não ordenada por essa razão tem um par adjacente fora de ordem, e trocá-lo não eleva os joules esperados. Um número finito de trocas ordena a sequência. Essa é a regra da razão de Simon e Kadane para busca com soluções do tipo tudo ou nada [318].
2. A leve primeiro custa $c_L + (1-q_L)\,c_H$, porque a engrenagem pesada só é executada quando a leve falha, e então passa. A pesada sozinha custa $c_H$. O primeiro valor é menor se e somente se $c_L < q_L\,c_H$.
3. Uma tentativa leve que falhou deixa $B - c_L < c_H$, de modo que a engrenagem pesada não pode ser executada. $\blacksquare$

**Leitura.** A cascata fixa, a suficiente mais barata primeiro em uma ordem fixa, é ótima quando as engrenagens baratas passam com frequência suficiente para pagar suas falhas: $q_L c_H > c_L$ em cada passo de uma cascata aninhada, ou custo crescente acompanhado de $p/c$ decrescente entre engrenagens independentes. Quando a condição falha, ir direto para a engrenagem mais pesada vence, e sob um orçamento restritivo essa pode ser a única maneira de fechar. Esse é o mecanismo do resultado do seletor na Seção 8.11. O seletor da lei σ estima a razão com probabilidades de aprovação calibradas. Ele é uma regra de valor da computação com os joules como custo, no sentido de Russell e Wefald e de Horvitz (Seção 5.1). Ele para quando o próximo ato já não paga seus joules. As duas regras param no piso além do qual mais joules não compram progresso verificável, de modo que ambas são instâncias de Mixture of Limits (mistura de limites). P7 (Seção 7.1) lista o que permanece em aberto: um limite de arrependimento quando as probabilidades de aprovação são estimadas ou a suficiência não é monotônica, e o caso aninhado com mais de duas engrenagens, que é um programa dinâmico sobre subsequências crescentes de engrenagens.

<div id="24-where-the-studies-sit" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Onde os estudos se situam

- **Mixture of Limits** é o operador de ótimo. A engrenagem suficiente mais barata é o argmin sobre os joules. É uma filosofia, não uma ordem fixa: o gasto para no platô, onde mais é desperdício.
- **O recibo** carrega $R^*$, $R$, $m$ e $J$ para cada ato.



<div id="3-layer-1-the-universal-law-of-agency" class="anchor-alias" aria-hidden="true"></div>

<div id="3-layer-1-the-proposed-universal-law-of-agency-a-definition-plus-a-gate" class="anchor-alias" aria-hidden="true"></div>

## 3. Camada 1. A proposta Lei Universal da Agência: uma definição mais uma porta

A definição tem quatro cláusulas: previsão fixada antes do ato, acoplamento ao mundo por meio de intervenção, consequência suportada pelo sistema e um piso físico em joules com recusa em um recibo.

<div id="30-objections-to-the-floor" class="anchor-alias" aria-hidden="true"></div>

### 3.0 Objeções ao piso

O piso usado aqui é contestado, e as suposições (R1) a (R4) da Proposição 1 são o ponto em que as objeções são respondidas. Norton argumenta que o princípio de Landauer vale apenas para protocolos com um passo termodinamicamente irreversível [326]. Maroney e Sagawa separam a irreversibilidade lógica da termodinâmica: $k_B T\ln 2$ dá preço à variação de entropia de uma memória, não a um bit como tal [327, 328]. López-Suárez, Neri e Gammaitoni operaram uma porta lógica irreversível abaixo de $k_B T$ [329]. Wolpert e colegas argumentam que os custos dos computadores reais são dominados por descasamento, modularidade e relógio, e não pelo apagamento [320]. Cada objeção estreita a afirmação em vez de revertê-la. A Proposição 1 é enunciada apenas para um registro que satisfaz (R1) a (R4), uma reinicialização para um estado fixo com estados de mesma energia e sem energia de interação compartilhada, que é o caso em que o limite vale; o piso é um limite inferior, e todo ato confirmado das execuções da Seção 8.11 que o medidor resolveu fica mais de 14 ordens de grandeza acima dele. K5 tem um escopo semelhante: Jordan mostra que o limite de Margolus-Levitin não limita a taxa de computação pela energia sem uma suposição sobre a densidade de informação [324], de modo que K5 é lido como um limite sobre mudanças de estado ortogonais, não sobre a velocidade do relógio.

<div id="31-proven" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Provado

**A informação tem um preço.** Landauer mostrou que uma operação logicamente irreversível dissipa pelo menos $k_B T \ln 2$ por bit [6]. Esse é o piso sob a cláusula 4. Bennett construiu uma máquina de Turing reversível e mostrou que apenas o apagamento precisa ter custo [35]. O custo inevitável da agência está na reinicialização do aceitador, não no pensamento. Bennett depois resolveu o demônio de Maxwell pelo custo de apagar a memória do demônio [7]. O demônio é um agente mínimo. Suas contas só se fecham quando sua memória é reinicializada. Isso é a cláusula 3 mais a cláusula 4.

**A realimentação tem preço dado pela informação.** Sagawa e Ueda provaram que, com realimentação, o trabalho extraível é limitado por $-\Delta F + k_B T I$ [3]. O valor de agir com base em uma medição é limitado pela informação que a medição carrega. Eles provaram que o trabalho de medição mais o trabalho de apagamento é pelo menos $k_B T I$ [5]. O ciclo completo de prever, comparar e reinicializar tem preço em joules. Eles derivaram uma igualdade de Jarzynski exata sob realimentação [4] e um teorema de flutuação com troca de informação entre subsistemas [36]. O acoplamento é uma correlação que entra na segunda lei. Hartle, Wolpert, Stier, Kempes e Manzano deram preço à realimentação com medições ruidosas, memória limitada e um repertório limitado de protocolos. Tendo a ação aleatória como linha de base, o benefício da realimentação pode exceder a informação obtida em ordens de grandeza [37]. Os bits limitam o trabalho em relação à energia livre. O valor em relação a uma linha de base é lido no medidor.

**A entropia se converte em joules.** Esposito e Van den Broeck derivaram $k_B T \Sigma = W - \Delta F_{\mathrm{neq}}$ para um sistema isotérmico forçado [24]. Todo limite cinemático na Camada 2 se torna um limite em joules por meio dessa identidade. Horodecki e Oppenheim provaram custos de trabalho para operações únicas em pequena escala [38]. Os atos de agência são operações únicas. As revisões de referência enunciam o entendimento estabelecido: a informação é um recurso termodinâmico com um preço [39, 40].

**O controle precisa de acoplamento.** Conant e Ashby provaram que um bom regulador precisa ser um modelo do sistema que regula [41]. Um sistema que regula bem já carrega uma previsão. Touchette e Lloyd provaram que a entropia que um controlador remove é limitada por sua informação mútua com o sistema [32, 33]. O acoplamento é a moeda do controle. O controle em malha fechada, que age com base em uma comparação, é o que a definição exige. O do-cálculo de Pearl fornece o operador de intervenção e as condições sob as quais seus efeitos são identificáveis [1]. A cláusula 2 é escrita nesse operador. Everitt e colegas classificaram as maneiras pelas quais um agente pode adulterar sua própria recompensa ou suas entradas [2]. O acoplamento precisa ser com o mundo, não com o próprio sensor do agente. Richens e Everitt provaram que todo agente que satisfaz um limite de arrependimento sob um grande conjunto de mudanças de distribuição aprendeu um modelo causal aproximado do processo que gera seus dados [42]. Richens, Abel, Bellot e Everitt provaram que todo agente que generaliza para tarefas de vários passos dirigidas a metas aprendeu um modelo preditivo de seu ambiente, e que o modelo pode ser extraído da política [43]. Um agente capaz carrega uma previsão. Isso é a cláusula 1, provada para agentes modernos.

**A informação flui dentro do agente.** Horowitz e Esposito mostraram que o fluxo de informação entre subsistemas entra na segunda lei de cada subsistema [44]. O acoplamento se torna uma taxa. Ito e Sagawa provaram uma segunda lei para redes causais arbitrárias com entropia de transferência [45]. Previsão, ato e resultado são nós de uma rede assim. Hartich, Barato e Seifert relacionaram entropia de transferência, taxa de aprendizado e dissipação [46]. Allahverdyan, Janzing e Mahler limitaram a eficiência do fluxo de informação entre sistemas acoplados [47]. Esposito e Schaller mostraram que a realimentação que altera apenas barreiras ainda entra no balanço de entropia [48]. Um ato puramente informacional está no livro-razão de joules.

**Demônios autônomos.** Mandal e Jarzynski resolveram um demônio que levanta uma massa escrevendo bits em uma fita [49]. Ele não tem operador externo, e a memória paga por seu trabalho. Boyd, Mandal e Crutchfield limitaram o trabalho dessas catracas pelas taxas de entropia de suas fitas de entrada e de saída [50]. Eles mostraram que projetos modulares pagam uma dissipação acima de Landauer [51]. A maneira como um agente é construído muda seu piso. Wolpert e Kolchinsky calcularam a produção de entropia extra que uma porta paga dentro de um circuito, determinada pela topologia do circuito [52]. A fiação faz parte do piso.

**A qualidade da previsão tem um preço em joules.** Kolchinsky e Wolpert provaram que um processo ajustado para uma distribuição de entrada dissipa a mais em qualquer outra, por um termo de entropia relativa [53]. Still, Sivak, Bell e Crooks mostraram que a memória que não prevê custa dissipação [54]. Guardar apenas o que prevê é o projeto barato. Kolchinsky e Wolpert definiram informação semântica como a informação causalmente necessária para que um sistema se mantenha fora do equilíbrio, com um valor termodinâmico [55]. É o relato existente mais próximo que usa joules. Ele para antes da cinemática e antes de um operador de inteligência. Ortega e Braun derivaram decisões de racionalidade limitada a partir de um princípio de energia livre com um custo de informação [56]. Kolchinsky e Wolpert limitaram o calor da computação universal pela complexidade do programa [57]. Kolchinsky e Wolpert mostraram que restrições sobre os protocolos disponíveis limitam o trabalho extraível e o valor da informação [58]. Manzano e colegas derivaram relações de flutuação e desigualdades semelhantes à segunda lei para computações que param em instantes aleatórios [59]. Uma execução que para quando seu predicado passa é uma computação desse tipo.

**Acoplamento e fronteira se apoiam em teoremas.** Ay e Polani definiram o fluxo de informação causal por meio de intervenções [8]. A entropia de transferência não mede esse fluxo, como mostrado por exemplo [11]. A condição de manto de Markov vale apenas em uma faixa estreita de parâmetros, por derivação [15], e suas definições em uso diferem, por contraexemplo [16]. Todo processo estocástico bipartido tem um manto causal, por teorema [22]. As Definições 1 e 2 se apoiam nesses resultados.

<div id="32-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Demonstrado

**O piso de Landauer, medido.** Uma esfera coloidal em um poço duplo óptico se aproximou de $k_B T \ln 2$ de calor médio à medida que o apagamento ficou mais lento [60]. Uma armadilha de realimentação mediu a mesma aproximação com alta precisão e um custo extra em tempos de ciclo curtos [61]. O piso sobe quando o ato é rápido. Esse é um efeito da Camada 2 visto em um experimento da Camada 1. Um circuito eletrônico adiabático mostrou o custo de Landauer para a operação irreversível e uma dissipação abaixo de $k_B T$ para a operação reversível [62]. O piso restringe a reinicialização, não a lógica. Bits de memória nanomagnéticos mostraram o piso em hardware de memória [63]. Um apagamento com trabalho quase nulo aparece quando a contabilidade da energia livre está completa [64]. O piso incide sobre a entropia total, de modo que o recibo precisa carregar a conta completa. A entropia que entra no limite foi medida e tem a forma de Gibbs-Shannon [65]. Um único íon aprisionado mostrou o piso quântico [66]. O piso vale em todo substrato testado. Um oscilador micromecânico subamortecido atingiu o piso em alta velocidade [67]. Um ponto quântico apagou bits com dissipação mínima para uma dada duração, com protocolos projetados a partir do comprimento termodinâmico [68].

**Agentes de realimentação transformam informação em trabalho.** Um coloide em um potencial em forma de escada em espiral ganhou energia livre acima do trabalho realizado, paga pela informação, e confirmou a igualdade de Jarzynski generalizada [69]. Essa é a primeira observação direta de um ato cujo valor é determinado por uma medição feita antes dele. Uma caixa de elétron único extraiu trabalho próximo de $k_B T \ln 2$ por bit [70] e mediu o teorema de flutuação com informação mútua [71]. Um demônio autônomo em chip resfriou um sistema com informação enquanto seu próprio aquecimento era medido [72]. O custo do agente foi medido ao lado de seu efeito.

Os agentes quânticos obedecem aos mesmos limites. A RMN em spins moleculares reduziu a produção de entropia por realimentação, dentro do limite de informação [73], e converteu informação em energia no piso [74]. Circuitos supercondutores acompanharam a memória de um demônio durante a realimentação [75], verificaram o teorema de flutuação integral generalizado [76] e mediram a informação ganha e perdida durante a realimentação [77]. O acoplamento decai, de modo que o recibo precisa registrá-lo no momento do ato. Átomos frios em uma rede óptica tridimensional foram ordenados por medição [78]. Linpeng e colegas mediram o custo energético da medição quântica com luz quântica, coerente e térmica em uma montagem de eletrodinâmica quântica de circuitos. A luz de fóton único custou a menor energia por unidade de informação obtida [79]. A medição que escreve um registro tem um preço medido.

Motores clássicos mediram o preço em escala completa. Um motor de pinça óptica converteu informação em trabalho no limite teórico [80]. Um motor coloidal extraiu trabalho que depende de correlações temporais em sua entrada [81]. Um grampo de DNA sob monitoramento contínuo rendeu mais de $k_B T \ln 2$ por ciclo quando muitas medições ocorriam por ciclo, de modo consistente com o conteúdo de informação [82]. Uma micropartícula levitada com realimentação atrasada obedeceu a uma segunda lei generalizada ao longo de duas décadas de atraso, e a realimentação falhou com atraso grande [83]. Um ato tardio é um ato mais fraco. Motores de armadilha de realimentação maximizaram potência e velocidade [84], exploraram de modo ótimo medições ruidosas [85] e extraíram energia de um banho fora do equilíbrio [86]. Um ponto quântico relacionou flutuações de trabalho à dissipação durante a conversão de informação em trabalho [87]. Um íon aprisionado verificou teoremas de flutuação que incluem a própria dissipação do demônio [88], seguindo a teoria de Zeng e Wang [89].

**Agentes de sistema funcional construídos e executados.** Um nematoide simulado com um aceitador de resultados de ação aprendeu locomoção e quimiotaxia [90]. Um robô móvel físico executou o mesmo controlador de sistema funcional [91]. As cláusulas 1 e 3 funcionam em software e em um corpo. Nenhum dos dois mede joules.

<div id="33-positions-in-the-literature" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Posições na literatura

**Sistemas propositais e antecipação.** Rosenblueth, Wiener e Bigelow definiram o comportamento proposital por meio de realimentação negativa em direção a uma meta [92]. Ele não tem termo de energia. O sistema funcional de Anokhin tem síntese aferente, decisão, um aceitador de resultados de ação fixado antes do ato, ação e comparação [93, 94]. Isso são as cláusulas 1 e 3 em sua primeira forma sistemática, construída sobre experimentos com animais. Sudakov enunciou o resultado como o fator formador do sistema [95]. A cláusula de previsão é o princípio organizador. Shvyrkov mostrou, a partir de registros de neurônios individuais, que a meta organiza a atividade neural [96]. Rosen definiu um sistema antecipatório como aquele que contém um modelo preditivo de si mesmo e de seu mundo e age com base na previsão [97]. Nenhum deles estabelece um piso em joules. Sterling define a alostase como regulação por previsão [98]. A fisiologia coloca a previsão antes do ato. Virgo, Biehl e McGregor deram condições sob as quais os estados de um sistema podem ser lidos como crenças atualizadas pelo teorema de Bayes [99]. Biehl e Virgo chamam um sistema de agente quando ele pode ser lido como resolvendo um POMDP (processo de decisão de Markov parcialmente observável) [100]. Ambas são definições formais. A cláusula 1 pede menos e fixa mais: um único gabarito, fixado em $t_0$, com hash no recibo.

**Autonomia e organização.** Maturana e Varela definiram o vivo pela autoprodução [101]. Kauffman colocou um ciclo de trabalho termodinâmico dentro da definição de um agente autônomo [102]. Ela não tem cláusula de previsão. Di Paolo fez da adaptatividade, a regulação da própria viabilidade, uma condição para a produção de sentido [103]. Isso é a cláusula 3. Barandiaran e Moreno propuseram um critério mínimo para a organização cognitiva e fundamentaram a regulação adaptativa no metabolismo [104, 105]. Barandiaran, Di Paolo e Rohde definiram a agência por individualidade, assimetria interacional e normatividade [106]. Ruiz-Mirazo, Moreno e Mossio enquadraram a autonomia como uma organização metabólica que se automantém [107, 108]. Montévil e Mossio descreveram os organismos como fechamentos de restrições sobre fluxos termodinâmicos [109]. É o trabalho dessa escola mais próximo dos joules. Aguilera e Barandiaran construíram um modelo mínimo de agência autônoma em termodinâmica estocástica [110]. A tradição da autonomia está se movendo em direção ao joule. Barandiaran e Almendros aplicaram individualidade, normatividade e assimetria interacional a grandes modelos de linguagem. Um modelo falha nas duas primeiras e falha em parte na terceira [111]. A definição aplica sua porta por ato: uma chamada a modelo é um ato quando seu recibo carrega $R^*$, $m$ e $J$. O TAME (Technological Approach to Mind Everywhere) de Levin trata a agência como graduada e testável por experimento em todas as escalas [112]. A definição mantém a porta binária por ato e coloca a graduação em $X$.

**Energia livre e a física da agência.** Friston propõe que os agentes minimizam a energia livre variacional [113, 114]. Essa energia livre é informacional, não joules, e todo sistema limitado se qualifica, de modo que ela não estabelece piso. Rovelli explica a agência pelo gradiente de entropia [115]. A agência é termodinâmica na raiz. Jaeger argumenta que a agência exige automanufatura e que a inteligência artificial atual não a tem [116]. Isso é uma exigência de uma porta antes de qualquer afirmação de inteligência. Azadi liga a agência à irredutibilidade computacional [117]. Wissner-Gross e Freer propõem uma força em direção à diversidade de trajetórias futuras [118]. Sua temperatura causal não é uma temperatura de banho, de modo que suas unidades não são joules. O comentário de Kappen a critica [119]. Fields, Goldstein e Sandved-Smith separam a energia livre termodinâmica, em joules, da energia livre variacional em agentes de inferência ativa, e relacionam as duas [120]. Apenas a grandeza em joules entra em K1. Bruineberg e colegas separam o manto de Markov como ferramenta de inferência do manto como fronteira física [17]. A Definição 2 toma a fronteira da definição. Bartlett e colegas fazem do processamento de informação dirigido a metas, medido pela informação semântica, a característica distintiva dos sistemas vivos [121]. Isso são as cláusulas 2 e 3 como critério de vida.

<div id="4-layer-2-the-kinematic-laws-of-agency" class="anchor-alias" aria-hidden="true"></div>

<div id="4-layer-2-the-kinematic-bounds-of-agency" class="anchor-alias" aria-hidden="true"></div>

## 4. Camada 2. Os limites cinemáticos da agência

Uma vez que um ato é elegível, a física limita a rapidez com que a agência se move por segundo e por joule, e quanto custam a precisão e a velocidade. Os limites formam quatro famílias: limites de velocidade, a TUR, custos em tempo finito e tetos de taxa.

<div id="41-proven" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Provado

**Limites de velocidade.** Shiraishi, Funo e Saito provaram o limite de velocidade clássico da Seção 2.2 [23]. Mover a distribuição de estados do agente por uma distância $L$ em um tempo $\tau$ custa entropia e, portanto, joules. O limite se estende aos sistemas quânticos abertos [122] e ao acoplamento forte com ambientes gerais [123]. Vo, Van Vu e Hasegawa derivaram o limite de velocidade e a TUR a partir de uma única desigualdade [124]. Falasco e Esposito limitaram o tempo para completar uma transição pela dissipação gasta [125]. Ito limitou a velocidade informacional geométrica de uma distribuição pela produção de entropia [126]. Ito e Dechant limitaram a taxa de variação de qualquer observável pela informação de Fisher e pela dissipação [127]. Nakazato e Ito limitaram a produção de entropia pela distância de Wasserstein percorrida [128]. Dechant, Sasa e Ito dividiram a produção de entropia na parte que move o sistema e na parte que o mantém em funcionamento [129]. Van Vu e Saito unificaram a TUR, a dissipação mínima e os limites de velocidade por meio do transporte ótimo [130]. Nagayama, Yoshimura e Ito derivaram uma família de limites de velocidade indexada por médias generalizadas da atividade [131]. Yoshimura e Ito provaram a TUR e o limite de velocidade em redes de reações químicas determinísticas [132]. Aurell, Mejía-Monasterio e Muratore-Ginanneschi resolveram a dissipação mínima em tempo finito como um problema de transporte ótimo [133]. Os limites cinemáticos formam uma única família. A maneira mais barata de mover o estado de um agente é um mapa de transporte. Hasegawa derivou o limite de velocidade, a TUR e o princípio de Heisenberg a partir de uma única correspondência entre volume e fronteira [134]. Van Vu e Hasegawa limitaram a produção de entropia irreversível por uma distância de Wasserstein modificada em sistemas de Markov clássicos e quânticos [135]. Delvenne e Falasco limitaram a produção de entropia pela estatística de observáveis cinéticos [136].

**A precisão custa dissipação.** Barato e Seifert enunciaram a TUR, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma$ [25]. Um agente confiável paga por sua confiabilidade. A partir de $2/\epsilon^2$ com $\epsilon = 0.01$, uma precisão de 1% custa pelo menos 20,000 $k_B T$ [137]. Gingrich, Horowitz, Perunov e England provaram a TUR para todas as correntes em estado estacionário [26]. Horowitz e Gingrich a provaram para tempos de observação finitos [138], que são os que os agentes têm. Outros resultados limitam a distribuição completa das flutuações [139], cobrem passos de tempo discretos [140], estendem a TUR onde quer que valha um teorema de flutuação [141] e cobrem a dinâmica de Langevin, o movimento subamortecido e a realimentação de velocidade [142, 143, 144]. As correlações entre correntes estreitam os limites [145]. Potts e Samuelsson mostraram que toda relação de flutuação implica uma TUR, inclusive com medição e realimentação [28]. Este é o limite de precisão para agentes. Uma revisão apresenta o campo [146]. Barato e Seifert puseram preço na precisão de um relógio [147]. Salazar limitou a produção de entropia pela informação a partir do teorema de flutuação detalhado [148]. Landi e Paternostro revisaram a produção de entropia do clássico ao quântico [149]. As formas com realimentação já cobrem os casos que os agentes encontram. Van Vu e Hasegawa limitaram as flutuações sob protocolos de controle arbitrários pela produção de entropia e por um termo cinético [150]. Tanogami, Van Vu e Saito limitaram a corrente de um subsistema por sua própria produção de entropia e pelo fluxo de informação entre ele e seu parceiro [151]. Kumasaki, Tojo, Sagawa e Funo derivaram uma TUR para o resfriamento por realimentação [152]. Honma e Van Vu derivaram uma TUR em tempo finito para sistemas quânticos abertos sob monitoramento contínuo e realimentação markoviana, com a informação mútua quântica ao lado da produção de entropia [153]. Para observáveis de contagem, Garrahan limitou as flutuações pela atividade dinâmica e deu os limites correspondentes para os tempos de primeira passagem [34]. Gingrich e Horowitz derivaram a relação conjugada para o tempo de primeira passagem até acumular uma corrente líquida [154]. A Proposição 3 aplica esses resultados à agência confirmada.

**Custos em tempo finito.** Schmiedl e Seifert encontraram protocolos ótimos em tempo finito, com saltos nas extremidades [155]. O ato ótimo em velocidade finita não é o ato lento. Sivak e Crooks limitaram o trabalho excedente pelo quadrado do comprimento termodinâmico dividido pela duração [30]. Proesmans, Ehrich e Bechhoefer encontraram o custo mínimo de apagar um bit em um tempo $\tau$ [29, 156]. O piso da Camada 1 se torna uma curva da Camada 2. Zhen e colegas enunciaram um limite universal em tempo finito para a energia de reinicialização [157]. Velocidade e eficiência se compensam por teorema: eficiência na potência máxima [158, 159], potência finita que proíbe a eficiência de Carnot [160], uma compensação tripla entre potência, eficiência e constância [161] e uma restrição universal para motores de baixa dissipação [162]. Tsirlin e colegas encontraram a dissipação mínima a uma taxa fixa [163]. Lee, Lee, Kwon e Park estreitaram o limite de velocidade para processos altamente irreversíveis e obtiveram um limite de Landauer justo em tempo finito [164]. Van Vu e Saito derivaram o princípio de Landauer quântico em tempo finito e o papel da coerência nele [165]. Rolandi e Perarnau-Llobet derivaram o princípio de Landauer em tempo finito além do acoplamento fraco [166]. Kamijima, Funo e Sagawa derivaram as compensações em tempo finito entre medição e realimentação [167]. Tkachenko mostrou, para redes neurais físicas, que a inferência quase estática não precisa de trabalho, enquanto a inferência em velocidade finita custa pelo menos uma distância de transporte (preprint) [168]. A inferência não tem piso que sobreviva à operação lenta. A reinicialização tem. A Proposição 1 põe preço nela.

**Manter uma meta.** Tatikonda e Mitter [169] e Nair e Evans [170] provaram o teorema da taxa de dados: manter um sistema linear instável exige uma taxa de canal acima da soma dos logaritmos na base 2 das magnitudes de seus autovalores instáveis. Nair, Fagnani, Zampieri e Evans revisaram o campo [171]. Sandberg, Delvenne, Newton e Mitter encontraram o trabalho máximo que um demônio que mede continuamente extrai em tempo finito e mostraram que qualquer implementação precisa de uma fonte externa de potência [172]. Horowitz e Sandberg mostraram que os termos de informação nas desigualdades da segunda lei formam uma hierarquia, cada um sendo o custo mínimo de adquirir essa informação por uma medição distinta [173]. A Proposição 2 converte a contagem de bits em um piso em joules por passo. Ela é um corolário do teorema da taxa de dados com preço em joules, não uma lei nova.

**Realimentação e medição quânticas.** A segunda lei com realimentação vale para sistemas quânticos [3]. Jacobs a estendeu às medições fracas [174]. Funo, Watanabe e Ueda derivaram teoremas de flutuação integrais sob medição e realimentação quânticas [175]. Guryanova, Friis e Huber provaram que medições projetivas ideais exigem recursos infinitos e deram o custo energético de um ponteiro que reproduz a estatística do sistema [176]. Danageozian, Wilde e Buscemi limitaram o calor de medição da identificação de erros pelo ganho de informação de Groenewold [177]. Esses resultados põem preço na medição que escreve um registro. A Proposição 4 mantém o piso do próprio registro.

**Grupos.** Wolpert derivou um limite inferior estritamente não nulo para a taxa mínima de produção de entropia de subsistemas que interagem, a partir das restrições sobre de quais subsistemas cada um depende [178]. Tasnim e Wolpert estenderam a teoria a subsistemas que mudam de estado em conjunto [179]. Wolpert relacionou a produção de entropia de uma rede bayesiana inteira à precisão das correntes em suas partes [180]. Rolandi, Abiuso e Perarnau-Llobet mostraram que protocolos coletivos podem fazer o trabalho dissipado crescer de forma sublinear com o número de membros [181]. Fujimoto e Ito constataram, por um método da teoria dos jogos, que as produções parciais de entropia de subsistemas que interagem se compensam entre si e que o total é mínimo quando os subsistemas dividem a penalidade igualmente [182]. A Proposição 7 compõe esses joules com os bits acoplados do grupo.

**Tetos de taxa.** Margolus e Levitin limitaram as transições ortogonais por segundo pela energia [31]. Lloyd aplicou o limite a um computador inteiro [183]. Deffner e Campbell revisaram a família dos limites de velocidade quânticos [184].

**Sensores vivos.** Dissipação de energia, velocidade de adaptação e acurácia estão ligadas entre si na quimiotaxia bacteriana [185]. Aprender sobre o ambiente exige energia [186], e a acurácia da inferência está atrelada à dissipação [187]. A precisão da detecção é limitada por receptores, tempo e energia, com uma alocação ótima entre eles [188]. Nenhum recurso pode ser dispensado. Isso se encaixa no Mixture of Limits (mistura de limites). O apagamento dentro da adaptação tem um custo [189]. A informação adquirida por energia dissipada é a grandeza existente mais próxima de $v_J$ em sensores vivos [190, 191]. Copiar informação custa energia [192]. Escrever o recibo tem um preço. Relógios bioquímicos precisos e sincronizados custam energia livre [193, 194], e o mesmo vale para reduzir o ruído com alta sensibilidade [195]. Manter um sistema longe do equilíbrio tem uma potência mínima [196]. Esse é o custo permanente de um agente pronto para agir. Bryant e Machta limitaram a energia de enviar um bit pelos canais físicos de uma célula, em $k_B T$ por bit, em função do tamanho, da distância e da latência, e constataram que ela está muitas ordens de grandeza acima da unidade [197]. Tjalma e colegas mostraram que os bits do passado que melhor predizem o futuro são proibitivamente caros para redes celulares [198].

**Informação ganha por seleção.** A seleção também escreve bits, e sua taxa é limitada. Kimura mediu a informação que a seleção natural acumula em um genoma pela carga substitucional e, com os valores de carga que tomou como representativos, estimou cerca de 0.29 bits por geração [341]. Worden limitou a taxa com que a seleção pode acrescentar informação a um genoma em termos da seleção aplicada por geração [342]. Hledík, Barton e Tkačik mostraram que, em populações estocásticas, a taxa é limitada pelo tamanho da população vezes o custo da seleção, nos modelos de Wright-Fisher, de Moran e de difusão [343]. Todo limite desse tipo é uma taxa por geração. Uma geração se alonga à medida que um organismo cresce, de modo que um portador que aprende apenas por seleção ganha bits acoplados cada vez mais devagar por segundo. Os sistemas nervosos escrevem bits dentro de uma vida, e os registros culturais os escrevem ao longo de várias vidas. A cinemática da Seção 2.2 se aplica a cada portador. O que muda de um portador para o seguinte é o tempo por bit escrito, e essa é a razão pela qual a agência passa dos genomas aos cérebros e às ferramentas quando o mundo muda mais depressa do que as gerações se renovam.

A Figura 3 ordena os três portadores.

![Diagrama qualitativo que situa três portadores de bits acoplados em um eixo de velocidade de escrita por segundo: o genoma, por seleção a cada geração, a cerca de 0.29 bits por geração segundo Kimura; o cérebro, por aprendizado dentro de uma vida; e as ferramentas e os registros, pela cultura ao longo de várias vidas.](/figures/agency/carriers.svg)

*Figura 3. Onde os bits acoplados são escritos. Diagrama qualitativo; o único número é a estimativa de Kimura [341]. Limites: Worden [342]; Hledík, Barton e Tkačik [343]. Uma [cópia em PNG](/figures/agency/carriers.png) está disponível.*

**Taxas de informação sem joules.** Schreiber definiu a entropia de transferência, o fluxo dirigido de informação por passo [199]. Ela é por tempo, não por joule, e não tem porta de elegibilidade. Tishby e Polani cobraram a informação por passo em uma recursão de Bellman [200]. Landauer converte esses bits em joules. Stratonovich limitou o ganho máximo obtido com uma dada quantidade de informação [201]. Isso é um teto para o valor por bit acoplado.

<div id="42-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Demonstrado

**A TUR testada.** Um experimento de RMN com dois qubits obedeceu às TURs generalizadas e violou a TUR especializada onde a teoria prevê [202]. Um motor de informação com pinça óptica violou a TUR original perto da eficiência máxima e obedeceu a limites generalizados com informação mútua [27]. Os agentes precisam da forma com realimentação. Um motor de Szilard com ponto quântico a confirmou de forma independente [203]. Condutores em escala atômica examinaram a TUR com ruído de corrente medido, a física de todo chip [204]. Motores moleculares foram avaliados pela precisão por unidade de dissipação [205]. As flutuações de corrente observadas limitam a dissipação por baixo [206]. Um recibo de flutuações é um medidor de limite inferior para joules.

**Limites de velocidade e custos em tempo finito testados.** Átomos isolados em uma rede óptica mostraram os limites de Mandelstam-Tamm e de Margolus-Levitin e a transição entre eles [207]. O teto de taxa é medido. Um coloide aprisionado mediu compensações entre tempo e entropia em transições térmicas rápidas [208]. Partículas brownianas conduzidas por protocolos de transporte ótimo saturaram o limite de dissipação mínima em tempo finito [209]. O ótimo cinemático é alcançável. Uma armadilha com realimentação mediu uma máquina browniana de duas forças contra limites de resposta linear [210]. Um experimento fotônico testou limites geométricos para a produção de entropia [211]. Dago e Bellon mediram o apagamento em uma memória de poço duplo em alta velocidade e rastrearam até suas fontes o excesso acima do limite de Landauer [212].

**Sensores vivos medidos.** Mattingly, Kamino, Machta e Emonet mediram a taxa com que a E. coli adquire informação durante a quimiotaxia e mostraram que as células sobem gradientes perto do limite que essa taxa impõe [213]. A informação limita o comportamento, e isso foi medido.

**Motores térmicos em velocidade finita.** Um único coloide operou um motor de Stirling micrométrico [214]. Uma esfera aprisionada operou um ciclo de Carnot browniano com a eficiência na potência máxima medida [215]. O custo energético de escolher uma entre duas opções foi medido [216]. Esse é o menor ato. Um motor coloidal funcionou em um banho bacteriano ativo [217], e um ruído projetado deu eficiência próxima à de Carnot com potência finita ao encurtar a relaxação [218]. Projetar a atividade desloca o limite. Um motor de informação passou de refrigerador a aquecedor com ruído [219]. O recibo deve registrar o regime, não apenas as médias.

**Empoderamento em simulação.** Klyubin, Polani e Nehaniv definiram o empoderamento, a capacidade do canal que vai das ações aos sensores futuros [9]. Ele foi calculado para controle contínuo [220] e revisado [221]. Mede quanto um agente pode mover o mundo, em bits. Não é uma taxa por joule.

<div id="43-positions-in-the-literature" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Posições na literatura

A cinemática é sobretudo teorema e experimento. As opiniões aqui dizem respeito a qual é a variável certa. Seifert sustenta que a inferência a partir de flutuações é o caminho para os custos ocultos [137]. Rovelli, de um lado, e Wissner-Gross e Freer, de outro, propõem cinemáticas entrópicas [115, 118]. Kolchinsky mostra que a dissipação sozinha não limita a rapidez com que replicadores crescem ou decaem [222]. As taxas são limitadas pela dissipação junto com a atividade. Essa é a forma do limite de velocidade, em que $\langle A\rangle$ fica ao lado de $\Sigma$. Adlam, McQueen e Waegell argumentam que um sistema puramente quântico não pode ser um agente, porque construir um modelo de mundo e deliberar exigem cópia, que o teorema da não clonagem proíbe (preprint) [223]. A cláusula 3 já exige um registro clássico de $m$.

<div id="5-layer-3-intelligence-as-the-calculus-of-agency" class="anchor-alias" aria-hidden="true"></div>

## 5. Camada 3. A inteligência como cálculo da agência

A inteligência é a derivada da agência com porta em joules, lida em uma execução concluída. Esta camada precisa de três coisas da literatura: teoria que ligue aprendizado e decisão a joules, medição de joules por unidade de trabalho útil e posições sobre o que é a inteligência.

<div id="51-proven" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Provado

**Aprendizado e predição com preço em joules.** Goldt e Seifert limitaram a informação que uma rede em aprendizado adquire pela entropia que ela produz [224]. A eficiência do aprendizado é no máximo um. Isso é $\iota$ para a parte de aprendizado de um ato, com um teto. Still mostrou que a memória ótima guarda apenas a informação preditiva [225]. O joule marginal gasto em memória deve comprar predição. Boyd, Crutchfield e Gu provaram que o agente que extrai mais trabalho dos dados tem o modelo de máxima verossimilhança desses dados [226]. Modelos melhores rendem mais trabalho por joule. Boyd, Crutchfield, Gu e Binder enunciaram o sobreajuste e a generalização como energética [227]. A generalização aparece como joules. Ehrich, Still e Sivak puseram preço no próprio controlador, além da informação que ele usa [228]. Assim, $J$ deve ser medido na tomada do sistema inteiro. Ehrich e Sivak deram o balanço dos fluxos de energia e de informação em máquinas autônomas [229]. Wolpert revisou os custos da computação além de Landauer [230]. Wolpert e colegas expuseram os problemas em aberto sobre os custos energéticos da computação na termodinâmica estocástica [320]. Levy e Baxter mostraram que os códigos neurais que maximizam bits por unidade de energia diferem dos códigos que maximizam bits [231]. O objetivo certo para um cérebro é informação por joule. Balasubramanian, Kimber e Berry fixaram o objetivo para um regime exploratório como taxa de transmissão por unidade de potência [232]. Isso é bits por joule. Goldt e Seifert limitaram a informação que uma rede aprende sobre uma regra pelo custo termodinâmico do aprendizado, para aprendizado em lote e online [233]. Fiderer, Barth, Smith e Briegel definiram a capacidade de trabalho de um canal de ambiente, a taxa máxima com que qualquer agente pode esperar extrair trabalho em um ciclo de percepção e ação. Agentes eficientes em trabalho equilibram predição e esquecimento (preprint) [234]. Elliott, Gu, Garner e Thompson mostraram que agentes adaptativos quânticos podem precisar de muito menos memória do que agentes clássicos de memória mínima [235]. Menos memória para reinicializar é um piso mais baixo a pagar.

**Decisões e otimalidade limitada.** Russell e Subramanian definiram a otimalidade limitada: o melhor programa para uma dada máquina e um dado ambiente [236]. Aqui o recurso são joules, e o ótimo é $\arg\min J$ sujeito a $X \ge X_{\mathrm{req}}$. Russell e Wefald puseram preço em cada computação por seu efeito esperado sobre a decisão, descontado seu custo, e interromperam a deliberação quando nenhuma computação tinha valor líquido positivo [316]. Horvitz formulou a mesma compensação para o raciocínio sob restrições de recursos [317]. O seletor da lei σ é essa regra com o custo em joules medidos. A Proposição 9 dá sua forma exata para uma cascata. Genewein e colegas derivaram a abstração e a hierarquia da utilidade menos o custo de informação [237]. As engrenagens do Mixture of Limits são uma hierarquia desse tipo. Legg e Hutter definiram a inteligência como a recompensa esperada ponderada pela complexidade sobre todos os ambientes computáveis [238]. É uma integral, mas sobre a recompensa, sem energia, e incomputável. A derivada em joules substitui a recompensa por bits acoplados confirmados e a medida por joules medidos. Takahashi e Hayashi dão o cálculo em joules existente mais próximo [239]. Eles definem duas razões sob convenções contábeis explícitas. A epiplexidade termodinâmica por joule é $I(W^{\mathrm{post}}; Z \mid W^{\mathrm{pre}})/E_{\mathrm{cons}}$: bits novos sobre uma variável de ambiente $Z$ retidos no estado do agente, por joule consumido dentro de uma fronteira declarada. O empoderamento por joule é a capacidade do canal que vai dos atos às observações por unidade de custo energético esperado, a capacidade por unidade de custo de Verdú. Eles provam uma referência de Landauer em ciclo fechado juntando uma desigualdade termodinâmica do aprendizado com o processamento de dados, e mostram, por uma construção de cópia reversível, que, com uma fronteira aberta e memória nova trazida de graça, o ganho de informação e a dissipação dentro da fronteira se desacoplam. Eles concluem com uma lista de verificação para relatórios: fronteira, balanço de energia, linha de base, granulação grossa, horizonte e reinicialização, vazão, estimador. Esta linha de pesquisa toma quatro coisas desse trabalho. Sua referência em ciclo fechado é K1 para o aprendizado. Sua construção de desacoplamento é a razão da medição fechada por ato na Definição 2 (Lema 1). Sua lista de verificação é adotada na Seção 8.12. Seu conselho de relatar bits por joule ao lado de bits por segundo é a variável que a Previsão 1 otimiza. A definição difere de suas métricas em quatro pontos exatos. O empoderamento por joule é uma capacidade, um supremo sobre as distribuições de atos; a definição credita o fluxo realizado da política que foi executada (Definição 1), com a capacidade como seu limite. Seus números são relatórios de eficiência relativos a uma referência, segundo eles próprios; esta linha de pesquisa classifica sistemas por $J^*$ atrás de uma porta de correção (Proposição 8). Eles não têm previsão fixada antes do ato, nem cláusula de consequência, nem recusa; a definição exige as três antes que qualquer bit conte. Eles não dão cinemática do tempo; a Previsão 1 deriva um tempo de ato ótimo e um teto a partir da mesma contabilidade de joules. Ortega, Braun, Dyer, Kim e Tishby expuseram a racionalidade limitada baseada na teoria da informação [240]. Zénon, Solopchuk e Pezzulo formularam o custo da cognição como informação [241]. Sims aplicou a teoria da taxa-distorção à percepção [242]. A moeda deles é o bit. Landauer converte bits em joules na reinicialização.

<div id="52-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Demonstrado

**Cérebros.** Laughlin, de Ruyter van Steveninck e Anderson mediram o custo energético por bit em fotorreceptores e interneurônios da mosca varejeira [243]. Taxas de informação mais altas custam mais por bit. Isso é um $\iota$ medido em um agente vivo e um retorno decrescente medido, $\alpha_J < 0$ na detecção. Attwell e Laughlin construíram o orçamento de energia da substância cinzenta por processo [244]. Lennie mostrou que a energia limita quantos neurônios corticais podem estar ativos ao mesmo tempo [245]. A energia é a restrição, e o resto se adapta. A energia por potencial de ação difere muito entre tipos de neurônios [246]. Mesma função, joules diferentes. O desenho neural segue a eficiência energética [247]. Levy e Calvert auditaram o córtex humano. A comunicação custa 35 vezes mais do que a computação, e a computação de um neurônio está a um fator de $10^8$ do melhor número possível de bits por joule [248]. Isso é uma distância até o piso. Harris e colegas constataram que uma sinapse da via visual é dimensionada para maximizar a informação por unidade de energia, não a informação [249]. O objetivo é bits por joule, medido em uma sinapse. Padamsey, Katsanevaki, Dupuy e Rochefort constataram que a restrição alimentar reduziu em 29% o uso sináptico de ATP (trifosfato de adenosina) no córtex visual de camundongos e alargou em 32% a sintonia de orientação [250]. Menos joules compraram menos precisão. Plaçais e Preat mostraram que moscas famintas desligam a custosa memória aversiva de longo prazo, e que forçá-la de volta reduziu a sobrevivência [251]. Plaçais e colegas constataram que o aumento do fluxo de energia no corpo cogumelar desencadeia a memória de longo prazo [252]. Mery e Kawecki constataram que formar memória de longo prazo diminuiu a resistência das moscas à dessecação [253]. O aprendizado tem um preço metabólico medido. Hechler, de Lange e Riedl mediram um uso menor de oxigênio cortical durante a predição confiante, de até 12% (preprint) [254]. A predição primeiro pode economizar joules. Malkin e colegas atribuíram às sinapses um custo energético pela confiabilidade em redes treinadas e encontraram assinaturas de inferência bayesiana no ótimo [255]. Li e van Rossum mostraram que a plasticidade sináptica ingênua custa uma energia extrema e que armazenar as mudanças temporariamente antes da consolidação a economiza [256]. Lynn e colegas inferiram, a partir de neuroimagem, a quebra do balanço detalhado no cérebro humano, crescente com o esforço físico e cognitivo [257]. Essa produção de entropia é de granulação grossa e informacional. Não é um medidor de joules.

**Máquinas.** O acesso à memória custa muito mais energia do que a aritmética [258]. A contagem de parâmetros importa apenas pelos joules que ela obriga a movimentar. A inteligência por watt mede a acurácia nas tarefas por unidade de potência em aceleradores locais [259]. Seu numerador é a acurácia em benchmarks, não a agência com porta. O MLPerf Power padroniza a medição de potência de microwatts a megawatts, com cada resultado sujeito a uma porta de meta de acurácia [260]. Essa porta é a forma de $J^*$. O FrugalGPT encadeia modelos de linguagem em cascata e para quando um avaliador aceita a resposta [321]. O RouteLLM aprende a enviar cada consulta a um modelo forte ou fraco sob uma meta de custo [322]. Seu custo é em dólares por consulta, e sua porta é um limiar de qualidade. Lidos com joules medidos e com $C(z)$ como porta, ambos são cascatas no sentido da Proposição 9. O ML.ENERGY mede a energia de inferência automaticamente [261]. O TokenPowerBench avalia a potência da inferência de grandes modelos de linguagem (LLM) [262]. Jin, Wei e Brooks analisam a energia da computação em tempo de teste [263]. Modelos de propósito geral custam muito mais energia por tarefa do que modelos específicos para a tarefa [264]. O modelo suficiente mais barato vence em joules. Isso é o Mixture of Limits, medido. Samsi e colegas mediram a energia da inferência de grandes modelos de linguagem em GPUs (unidades de processamento gráfico) [265]. Dillavou e colegas demonstraram o aprendizado descentralizado em um circuito físico, sem processador [266]. Stern e colegas treinaram circuitos autoaprendizes para soluções eficientes em potência e mediram a compensação entre potência e erro [267]. Saggio e colegas demonstraram uma aceleração quântica para agentes que aprendem em um experimento fotônico [268]. Menos interações para aprender são menos atos a fechar.

**Um aceitador com joules relatados pelo kernel.** A Seção 8.11 relata uma execução pré-registrada de um agente aceitador em um laptop, com predição primeiro, comparação, recusa e orçamentos de joules restritivos. Os falseadores foram fixados antes da execução, e vários dispararam: R-F1 (os joules dos seletores em tarefas compartilhadas não são distinguíveis), R-F2 (36 de 5,400 episódios gastaram além do orçamento: 9 no braço da lei σ e 7 na cascata fixa com $B = 1.0$, e 20 na linha de base cega à meta com $B = 0.5$), R-F3, R-F5 e R-F6 (Seção 8.11). $\iota$ foi lido em 4,940 recibos. O ato confirmado mediano deu $1.5 \times 10^5$ bits por joule relatado, cerca de $2 \times 10^{15}$ vezes os joules por bit do piso. Sob um orçamento restritivo, o seletor da lei σ fechou mais tarefas do que a cascata fixa, uma instância do Mixture of Limits. Essa comparação foi escolhida depois da execução, portanto é exploratória, e os joules por tarefa fechada foram iguais. A segunda execução pré-registrada e uma segunda máquina repetiram o ganho apenas no orçamento mais folgado (Seção 8.11.2). O $\iota$ integrado classificou um agente cego à meta em primeiro lugar com um orçamento folgado, enquanto $J^*$ o classificou em último.

**Grupos simulados.** Crosato e colegas calcularam as grandezas termodinâmicas do movimento coletivo simulado através de seu ponto crítico [269]. Chen e Prokopenko compararam a eficiência termodinâmica com utilidades puramente informacionais como explicações do comportamento coletivo perto da criticalidade [270]. $\iota_G$ na Proposição 7 é a forma com porta e medida de uma razão desse tipo.

**Medidores.** O RAPL (Running Average Power Limit) é o conjunto de contadores de energia no próprio chip dos processadores Intel e AMD. Suas leituras foram validadas contra medição externa [271]. As leituras de DRAM (memória dinâmica de acesso aleatório) foram validadas separadamente [272]. A qualidade do medidor depende da geração do processador [273]. O manual do powermetrics da Apple afirma que seus valores de potência média "são estimados e podem ser imprecisos" e não devem ser usados para comparar dispositivos [274]. No Apple silicon, as leituras do powermetrics são valores relatados. Os joules medidos para essa máquina vêm de um medidor de tomada externo.

**Compressão avaliada.** O Hutter Prize avalia a compressão sem perdas do primeiro gigabyte de um despejo da Wikipédia em inglês, com um fundo de prêmios de 500,000 euros e limites de tempo de execução e de memória [275]. Ele limita tempo e memória, nunca joules. Um teto de joules o tornaria um benchmark de cálculo da agência para uma classe de tarefas.

**Estimativas.** Essas fontes são valiosas, e seus números em joules são modelados, extrapolados ou calculados. Ficam ao lado dos joules medidos, nunca no lugar deles. Estimativas nunca são `measured_j`. Strubell, Ganesh e McCallum amostraram a potência em execuções curtas e extrapolaram para o treinamento completo de modelos de processamento de linguagem natural [276]. Patterson e colegas calcularam a energia de treinamento a partir de dados relatados de hardware, tempo de execução e centro de dados [277]. Lacoste e colegas construíram uma calculadora a partir do tipo de hardware, do tempo de execução e da região [278]. A pegada do BLOOM mistura entradas medidas e modeladas [279]. O Carbontracker lê contadores no dispositivo e prevê os totais da execução completa [280]. Suas previsões são estimativas. Elsworth e colegas relatam uma mediana de 0.24 Wh por prompt de texto do Gemini Apps, contando aceleradores, hosts, capacidade ociosa e sobrecarga do centro de dados [281]. É um número relatado pelo operador, registrado como `reported_j`.

<div id="53-positions-in-the-literature" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Posições na literatura

Cada posição é situada em relação à definição: a inteligência é a derivada da agência com porta em joules, lida em uma execução concluída.

- Schmidhuber trata a recompensa intrínseca como progresso de compressão, uma primeira derivada de quão bem um agente comprime seu histórico [282]. É o precedente mais próximo da inteligência como uma derivada lida em uma execução. Sua variável é a compressão, não os joules.
- Krakauer, Mitchell e Krakauer definem a inteligência como uma propriedade emergente expressa em usos cada vez mais baratos e rápidos de capacidades emergentes para resolver problemas, resumida como "menos é mais" [339]. Eles concluem que os grandes modelos de linguagem mostram, no máximo, capacidade emergente, não inteligência emergente. Sua definição é a mais próxima, em palavras, de $\iota = dX/dJ$. Ela nomeia a energia como denominador e não a mede. O cálculo fornece o medidor, a porta que separa capacidade de inteligência (Seção 1) e a derivada lida na execução.
- Chollet define a inteligência como eficiência na aquisição de habilidades em relação a conhecimentos prévios e experiência, com o benchmark ARC (Abstraction and Reasoning Corpus) [283]. É uma razão. Seu denominador é informação e dados, não joules. O placar do ARC Prize representa o custo por tarefa contra a pontuação como medida de eficiência [284]. O custo é em dólares. Um medidor de joules o transforma em $J^*$.
- Hernández-Orallo constrói uma psicometria universal entre espécies e máquinas [285]. Ela avalia por tarefas. Esta linha de pesquisa avalia pelos joules para fechar tarefas. O teste a qualquer momento de Hernández-Orallo e Dowe se adapta ao tempo disponível [286]. O cálculo se adapta aos joules disponíveis.
- Gershman, Horvitz e Tenenbaum definem a inteligência como utilidade esperada descontado o custo de computação [287]. Esta linha de pesquisa faz desse custo joules.
- Lieder e Griffiths tratam a cognição como uso ótimo de recursos limitados [288]. Isso é próximo do Mixture of Limits. O recurso fica abstrato.
- Balasubramanian lê o desenho do cérebro por meio de seus limites de energia [289].
- Silver, Singh, Precup e Sutton sustentam que a recompensa é suficiente [290]. A recompensa é escolhida por um projetista. Os joules são lidos em um medidor. Vamplew e colegas respondem que a recompensa escalar não consegue expressar metas multiobjetivo [291]. Esta linha de pesquisa mantém uma única variável, os joules, e transfere a multiplicidade para a porta $X \ge X_{\mathrm{req}}$.
- Hafez e colegas definem agência e inteligência em conjunto [292]. Não é nativo em joules.
- Karagoz faz da autossustentação energética o objetivo [293]. Não tem porta de predição, nem cinemática, nem classificação em joules entre sistemas.
- Chaisson propõe a densidade de taxa de energia, potência por unidade de massa, como métrica de complexidade ao longo da evolução cósmica [294]. É uma taxa em watts por quilograma. O cálculo divide bits confirmados por joules.

O alcance de $\iota$ decorre de seu numerador. $X$ conta o acoplamento confirmado com o mundo, de modo que $\iota$ mede quão barato um agente muda o mundo tal como previu. Não mede a compreensão. Krakauer, Mitchell e Krakauer ligam a inteligência a representações compactas e comunicáveis [339]. Uma representação compacta entra no cálculo por seu efeito: um agente que a possui fecha tarefas posteriores com menos joules. A compreensão que nunca muda um ato fica fora do que $\iota$ lê.

<div id="54-where-the-calculus-stands" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Onde está o cálculo

- **Provado:** aprendizado, memória, predição e controle têm, cada um, um preço em joules com um teto.
- **Demonstrado:** joules por bit são medidos em cérebros. Joules por tarefa são medidos em máquinas. Medidores podem ser validados.
- **Provado aqui:** $\iota$ é uma densidade limitada no eixo dos joules sob crédito proporcional aos joules (Proposição 5). O $\iota$ amostrado converge para ela (Proposição 6). Grupos se compõem pela Proposição 7. Manter uma meta fixa um tempo de ato ótimo e um teto para $\iota$ (Previsão 1).
- **Demonstrado aqui:** $\iota$ e $J^*$ lidos nos recibos de um aceitador com joules relatados pelo kernel, com falseadores fixados de antemão (Seção 8.11). $J^*$ classifica agentes. O $\iota$ integrado não.
- **Acrescentado por esta linha de pesquisa:** a inteligência lida como $dX/dJ$ em uma execução concluída e com porta, com $J^*$ como a classificação. Takahashi e Hayashi chegam mais perto, com razões de bits por joule sob contabilidade explícita [239]. Esta linha de pesquisa acrescenta a porta de elegibilidade, o fluxo realizado no lugar da capacidade, a classificação com porta e sua prova (Proposição 8) e o tempo de ato ótimo (Previsão 1).

<div id="6-global-findings-by-method" class="anchor-alias" aria-hidden="true"></div>

## 6. Achados globais, por método

A busca foi feita em russo, chinês, japonês, alemão, francês, espanhol, português, coreano, italiano, polonês, híndi e árabe, com buscas complementares em inglês. Uma segunda rodada buscou novamente em japonês, chinês, russo, alemão, francês, espanhol e coreano e acrescentou persa, turco e hebraico. Seus resultados estão incorporados às Seções 2 a 5 e 8 conforme o que provam, medem ou definem. Os resultados estão organizados por método e por classe de resultado. O idioma é apenas um metadado. Nenhuma entrada é classificada pela sua origem.

<div id="61-theorems-and-reviews-information-has-a-thermodynamic-price" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Teoremas e revisões: a informação tem um preço termodinâmico

- Poplavskii deu um tratamento sistemático pioneiro do custo energético de adquirir e processar informação [295]. Escrito em russo, com tradução para o inglês. Camada: definição.
- Stratonovich provou teoremas sobre o valor da informação [201]. Edição em inglês de uma monografia russa. Camada: cinemática.
- Ito e Sagawa aplicaram a termodinâmica da informação em redes à quimiotaxia da E. coli. A entropia de transferência limita a robustez, e a eficiência termodinâmica da informação é alta onde a eficiência termodinâmica comum é baixa [296]. Escrito em japonês. Camadas: definição e cinemática.
- Sun e Quan revisaram o demônio de Maxwell e o piso físico da dissipação no processamento de informação [297]. Escrito em chinês. Camada: definição.
- Quan, Dong e Sun revisaram a termodinâmica mesoscópica: o demônio é compatível com a segunda lei desde que o apagamento seja contabilizado, e restrições entre potência e eficiência foram testadas [298]. Escrito em chinês, com resumo em inglês. Camadas: definição e cinemática.
- A revisão enciclopédica de Parrondo dá o relato atual da informação como recurso termodinâmico [299]. Camada: definição.
- A tese de doutorado de Strasberg testa hipóteses comuns da termodinâmica da informação com modelos físicos [300]. Escrita em inglês, com resumo em alemão. Camada: definição.
- Outros teoremas surgiram em buscas em japonês, russo, chinês, coreano, português, italiano e polonês: limites de velocidade e TURs em redes químicas [127, 131, 132], termodinâmica em tempo finito [159, 162, 163], TURs de Langevin [143, 144], limites informacionais para a produção de entropia [148, 149] e custos de trabalho em uma única realização [38].

<div id="62-experiments-the-price-measured" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Experimentos: o preço medido

- A tese de doutorado de Dago relata o apagamento e a escrita de 1 bit perto da energia mínima, em alta velocidade, em um microcantiléver subamortecido [301]. Escrita em francês. Camada: o piso em joules da definição alcançado em velocidade cinemática.
- A tese de doutorado de Lagoin constrói demônios de Maxwell macroscópicos, incluindo um motor de Szilard, a partir de uma pá em um gás granular [302]. Escrita em francês. Camada: definição. A contabilidade do demônio vale fora do regime microscópico.
- Ciampini e colegas usaram o trabalho extraível para testemunhar correlações quânticas em um experimento fotônico [303]. Camada: definição.
- Experimentos surgiram em buscas em coreano, português, híndi, italiano, espanhol, chinês e japonês: motores de informação [27, 80], demônios em RMN [73, 74], a TUR em qubits [202], motores em banho ativo [217, 218], limites geométricos [211], quebra de simetria e ciclos de Carnot [215, 216], demônios com íons aprisionados [66, 88] e conversão por realimentação e transporte ótimo [69, 76, 209].

<div id="63-theory-of-functional-systems-prediction-before-the-act" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Teoria dos sistemas funcionais: a predição antes do ato

A escola de Anokhin enuncia as cláusulas 1 e 3 em termos fisiológicos. Um gabarito do resultado, o aceitador dos resultados da ação, é formado antes do ato, comparado depois dele, e a comparação reorganiza o comportamento. Esses trabalhos foram encontrados em buscas em língua russa.

- O sistema funcional de Anokhin [93, 94].
- Sudakov sobre o resultado como fator formador do sistema e sobre a predição probabilística do comportamento [95, 304, 305, 306].
- Shvyrkov sobre as metas que organizam a atividade neuronal e sobre o aprendizado como seleção de sistemas neuronais [96, 307].
- K. V. Anokhin sobre a estrutura cognitiva do cérebro como uma hiper-rede de elementos de sistemas funcionais [308].
- Saltykov e Grachev sobre o fator formador do sistema como antecipação [309].
- Vityaev sobre a intencionalidade formalizada como aprendizado de regras que predizem resultados [310].

**Implementado e executado.** Arquiteturas cognitivas construídas sobre a teoria dos sistemas funcionais formam gabaritos de resultado, comparam e aprendem submetas, em simulação e em um robô físico [90, 91, 311, 312, 313]. Nenhuma mede joules. Acrescentar um medidor a um desses agentes testaria a ordem completa de definição, cinemática e cálculo em uma implementação existente. As redes lógicas probabilísticas diferenciáveis são ferramentas de cálculo relacionadas, não construídas sobre sistemas funcionais, sem porta de elegibilidade e sem joules [314].

<div id="64-autonomy-organization-and-minimal-agency" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Autonomia, organização e agência mínima

Encontrados em buscas em espanhol, francês e alemão. A agência é uma organização que se automantém e regula suas interações [103, 104, 105, 106, 107, 108]. A organização é um fechamento de restrições sobre fluxos termodinâmicos [109]. A escola da autonomia entrou na termodinâmica estocástica [110]. Camada: definição, como a organização que deve existir antes que qualquer ato conte.

<div id="65-measured-joules-for-machine-intelligence" class="anchor-alias" aria-hidden="true"></div>

### 6.5 Joules medidos para a inteligência de máquina

Encontrados em buscas em língua chinesa sobre a energia de inferência: medição automatizada da energia de inferência [261], benchmarks de potência por token [262] e a energia do raciocínio em tempo de teste [263].

<div id="66-philosophy-of-agency" class="anchor-alias" aria-hidden="true"></div>

### 6.6 Filosofia da agência

A física da agência de Rovelli surgiu em alemão [115]. Jaeger e Azadi completam o conjunto de artigos de posição [116, 117].

<div id="67-searches-with-no-primary-research" class="anchor-alias" aria-hidden="true"></div>

### 6.7 Buscas sem pesquisa primária

As buscas em híndi e árabe não retornaram pesquisa primária nesses idiomas. As buscas complementares em inglês trouxeram outros trabalhos, listados acima por método. As buscas em persa, turco e hebraico retornaram teses, revisões e trabalhos já citados, sem nova pesquisa primária.

<div id="7-open-problems" class="anchor-alias" aria-hidden="true"></div>

## 7. Problemas em aberto

<div id="71-what-must-be-proven" class="anchor-alias" aria-hidden="true"></div>

### 7.1 O que deve ser provado

**P1. O caminho da execução está bem definido.** Provado. A Proposição 5 dá $\iota = dX/dJ$ como uma densidade no eixo dos joules com $0 \le \iota \le 1/(k_B T\ln 2)$, sob crédito proporcional aos joules. A Proposição 6 dá a convergência do $\iota$ amostrado à medida que a amostragem do medidor se refina, com o erro relativo do medidor como termo de erro.

**P2. Limite de Landauer com porta de agência.** Sob contabilidade em ciclo fechado, cada bit acoplado confirmado custa pelo menos $k_B T \ln 2$, de modo que $v_J \le 1/(k_B T \ln 2)$. Já disponível: o trabalho de medição mais apagamento é pelo menos $k_B T I$ [5], e o apagamento custa pelo menos $k_B T \ln 2$ por bit [6, 7]. Falta: um passo de processamento de dados que mostre que os bits acoplados creditados em $X$ não podem exceder os bits registrados na memória do aceitador durante a comparação. A cláusula 3 já exige que a confirmação $m$ venha de um registro físico. A Proposição 1 prova o piso por ato com esse passo tomado como hipótese (R2).

**P3. Limite de velocidade da agência.** Provado para atos cujo registro satisfaz de (R1) a (R4). A Proposição 1 limita por baixo os joules médios do ato $k$ por $b_k k_B T\ln 2$ mais um termo de tempo finito em $\tau_k$, $\langle A\rangle_k$, o erro de reinicialização $\varepsilon$ e os bits confirmados, por meio da desigualdade de Fano. A Previsão 1 acrescenta os joules permanentes de manter uma meta e dá o tempo de ato ótimo.

**P4. Limite de precisão para agentes.** Provado. A Proposição 3 limita a variância relativa da agência confirmada pela atividade dinâmica, para a contagem de atos confirmados, e pela produção de entropia com o termo de informação, sob realimentação.

**P5. Teorema da retrospectiva.** $\iota$ é função apenas do recibo concluído. Nenhuma grandeza anterior à execução o fixa. Já disponível: cada $m_k$ compara um resultado com uma previsão fixada antes do ato, de modo que $m_k$ é desconhecido antes que o ato $k$ se feche. Falta: uma construção de dois mundos que concordem em tudo o que um preditor anterior à execução vê e difiram em algum $m_k$. Junto com P1, isso faz de "a inteligência é lida na execução concluída" um teorema.

**P6. A classificação sobrevive ao erro do medidor.** Provado. Proposição 8, parte 3: se $(1+\epsilon)J^*_{S_1}(q) < (1-\epsilon)J^*_{S_2}(q)$, com $\epsilon$ o limite do erro relativo do medidor, então $S_1 \succ_q S_2$ sob qualquer leitura dentro desse erro. Falta: um $\epsilon$ validado para cada medidor [271].

**P7. Otimalidade do Mixture of Limits.** Provado em parte. A Proposição 9 dá as condições exatas para engrenagens independentes e para duas engrenagens aninhadas, além do mecanismo de orçamento. A instância da cascata fixa tenta as engrenagens da mais barata para cima, para na primeira engrenagem cuja saída passa em $C(z)$ e recusa com um recibo se a engrenagem seguinte romper o orçamento. Ela atinge o mínimo de joules a menos do custo das tentativas fracassadas. Já disponível: se a suficiência é monótona na ordem das engrenagens e os custos das engrenagens crescem com a ordem, a primeira engrenagem suficiente é a engrenagem suficiente mais barata. Falta: um limite de arrependimento quando as probabilidades de aprovação são estimadas ou a suficiência não é monótona, o caso aninhado com mais de duas engrenagens e as condições sob as quais essa regra e o seletor da lei σ, $a^* = \arg\max[H(a) - \lambda J(a)]$ sujeito a $J \le B$, escolhem o mesmo ato.

**P8. Quando a agência se acumula.** Condições sob as quais $\alpha_J > 0$ ao longo de uma execução, de modo que recibos anteriores reduzam os joules de fechamentos posteriores. Falta: um modelo de reutilização em que os recibos armazenados reduzam o $J$ posterior em mais do que os joules de armazenamento e de consulta. Still dá o lado do custo da memória [225]. A Seção 8.10 mede a parcela do gabarito nos joules de cada ato.

<div id="72-what-must-be-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 7.2 O que deve ser demonstrado

| ID | Afirmação | Evidência exigida |
|---|---|---|
| D1 | $J^*$ por tarefa é medido, não estimado, em pelo menos duas plataformas | `measured_j` do RAPL em Linux x86 e de um medidor de tomada externo no Apple silicon |
| D2 | O seletor da lei σ fecha tarefas com menos joules medidos do que a cascata fixa sob orçamentos restritivos | Execuções pareadas com as mesmas tarefas, engrenagens, predicados, orçamentos e medidores |
| D3 | Recusar com um recibo funciona | Zero gastos além do orçamento, recusas em tarefas inviáveis, poucas recusas em tarefas viáveis |
| D4 | $\iota$ é lido nos recibos e é estável entre sementes | Série $\iota_k$ por execução com dispersão dentro de um limite prefixado |
| D5 | As estimativas não substituem a medição | Concordância de classificação entre `est_j` e `measured_j`, relatada, nunca mesclada |
| D6 | O piso físico é respeitado e a distância até ele é conhecida | Joules medidos por bit confirmado divididos por $k_B T \ln 2$ |
| D7 | Previsão 1: o tempo de ato ótimo e o teto de um agente que mantém uma meta | Uma varredura de $\tau$ em duas ou mais taxas de instabilidade, com os joules do ato e os joules permanentes medidos separadamente e em conjunto |

A Seção 8.11 relata a primeira execução contra D2 a D6, com joules relatados. A Seção 8.11.1 relata a segunda execução na mesma máquina, com as correções da proteção e da recusa, e a Seção 8.11.2 a repete em uma segunda máquina.

<div id="8-experiment-plan" class="anchor-alias" aria-hidden="true"></div>

## 8. Plano experimental

Toda tabela, todo recibo e toda figura deste plano seguem uma regra. Estimativas nunca são `measured_j`. Um valor modelado é rotulado `est_j`. Um valor medido é rotulado `measured_j` e nomeia seu medidor.

<div id="81-meters" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Medidores

Siglas: CPU (unidade central de processamento), GPU (unidade de processamento gráfico), ANE (Apple Neural Engine), AC (corrente alternada), NVML (NVIDIA Management Library).

| Nível | Medidor | O que lê | Rótulo |
|---|---|---|---|
| M0 | Medidor externo de potência na tomada, registrando a 1 Hz ou mais rápido | Potência AC do sistema inteiro | `measured_j`, tomada |
| M1 | RAPL via Linux powercap, domínios de pacote, núcleo, uncore e DRAM onde presentes | Energia acumulada no chip em microjoules | `measured_j`, rapl |
| M1g | Contador de energia total da NVML em uma GPU discreta | Energia acumulada da placa da GPU | `measured_j`, nvml |
| M2 | Apple powermetrics, amostradores de CPU e GPU a 100 ms | Potência de CPU, GPU e ANE conforme relatada pelo sistema | `reported_j`, powermetrics |

- **RAPL.** Ler o contador antes e depois de cada ato. Tratar o retorno a zero do contador. Validar contra o M0 em uma carga de calibração [271, 272].
- **powermetrics.** As leituras são registradas como `reported_j`. Os joules medidos em Apple silicon vêm do M0. Dentro de uma mesma máquina, `reported_j` atribui joules a CPU, GPU e ANE.
- **Linha de base ociosa.** Registrar 120 s de potência ociosa em todos os medidores antes de cada bloco. Relatar lado a lado os joules brutos e os joules com a linha de base ociosa subtraída. Nunca relatar apenas o valor subtraído.
- **Controle de estado.** Fixar o regulador de frequência da CPU onde o sistema operacional permitir. Registrar a temperatura ambiente e a pressão térmica. Encerrar tarefas em segundo plano. Descartar uma execução de aquecimento por braço.

<div id="82-tasks" class="anchor-alias" aria-hidden="true"></div>

### 8.2 Tarefas

Cada tarefa tem um predicado de completude verificável por máquina $C(z)$: testes unitários para código, correspondência exata para aritmética, validação de esquema para extração, um estado final verificado para uso de ferramentas. Dois estratos são fixados de antemão. Tarefas quase ótimas são aquelas que a engrenagem mais barata em geral fecha. Tarefas cumulativas são sequências em que recibos anteriores podem ser reutilizados. $X_{\mathrm{req}}$ é definido por $C(z)$. Passar é uma porta, não uma pontuação.

<div id="83-arms" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Braços

Todos os braços compartilham as engrenagens, o predicado, o orçamento, os medidores e uma ordem de execução intercalada e aleatorizada.

1. **Seletor da lei σ:** $a^* = \arg\max[H(a) - \lambda J(a)]$ sujeito a $J \le B$, com recusa mediante recibo.
2. **Cascata fixa (a mais barata primeiro):** a regra da mais barata suficiente, com as engrenagens testadas em uma ordem fixa, da mais barata para cima. É a comparação pareada: mesma informação, mesmas engrenagens, mesmo orçamento e mesmo direito de recusa. Só a regra de seleção difere.
3. **Sempre a maior engrenagem:** teto de referência.
4. **Sempre a menor engrenagem:** piso de referência, com recusa quando ela falha.

Ambos os seletores são instâncias de Mixture of Limits (mistura de limites). A filosofia é usar a engrenagem mais barata que seja suficiente, porque além do piso joules adicionais não compram progresso verificável. A cascata fixa a aplica em uma ordem fixa. O seletor da lei σ para quando o próximo ato já não paga seus joules. Essa é uma regra de convergência por limiar, portanto também é uma instância de Mixture of Limits. A comparação é entre duas instâncias de uma mesma filosofia. Nos arquivos de código e de dados, a cascata fixa é o braço `mol` e o seletor da lei σ é o braço `sigma`.

<div id="84-budgets-seeds-and-statistics" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Orçamentos, sementes e estatística

- Um piloto executa o braço 2 sem orçamento e registra a mediana dos joules medidos por tarefa, $\tilde J_q$.
- Os níveis de orçamento são $B \in \{0.25, 0.5, 0.75, 1.0\} \times \tilde J_q$, mais o caso sem restrição. Um nível é restritivo somente se pelo menos 20% das tarefas o excedem no piloto. Os níveis que não são restritivos são relatados e excluídos do teste de D2.
- Pelo menos 10 sementes por braço, tarefa e orçamento. Mais, se o piloto mostrar que 10 não conseguem resolver uma diferença de 10% na mediana de $J^*$ com 95% de confiança.
- Relatar média, mediana, desvio padrão e um intervalo de confiança bootstrap de 95% de $J^*$ por tarefa. Comparar os braços 1 e 2 com um teste de postos sinalizados de Wilcoxon sobre a mediana de $J^*$ por tarefa, com tamanho de efeito.
- O pré-registro nomeia os desfechos primários. As comparações secundárias são corrigidas com o procedimento descendente de Holm. Uma análise escolhida depois de uma execução é rotulada post hoc onde quer que apareça, inclusive em resumos, e nunca é o resultado principal. Ela só se torna um desfecho primário no pré-registro da execução seguinte.

<div id="85-receipt-schema" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Esquema do recibo

O recibo é o registro da execução. Um registro por ato:

```
act_id, run_id, task_id, arm, seed, budget_j, gear
prediction_hash, prediction_ts        # R*, fixed before the act
outcome_hash, outcome_ts              # R
m                                     # 1, mu, or 0
coupled_bits_est                      # realized I(do(a); W'), bias-corrected, with interval
coupled_bits_bound                    # capacity bound, never credited as X
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

<div id="86-metrics" class="anchor-alias" aria-hidden="true"></div>

### 8.6 Métricas

- $J^*$ por tarefa: joules medidos para passar em $C(z)$, do M0 onde presente, caso contrário do M1.
- Taxa de fechamento por braço e orçamento.
- Gastos excessivos: atos que excederam $B$. A meta é zero.
- Qualidade da recusa: precisão e revocação das recusas em relação às tarefas que algum braço mostrou serem inviáveis dentro de $B$.
- Série de inteligência: $\iota_k = \Delta X_k/\Delta J_k$ por execução, e sua dispersão entre sementes.
- Sinal da aceleração: o sinal de $\alpha_J$ obtido pela regressão de $\iota_k$ sobre $J$ acumulado, por estrato.
- Verificação da estimativa: correlação de postos de Kendall entre `est_j` e `measured_j`.
- Distância ao piso: joules medidos por bit acoplado confirmado divididos por $k_B T \ln 2$ na temperatura registrada.
- Inteligência do ato: $\iota_k = b_k/J_k$ por ato, que é igual à densidade da Proposição 5 nesse ato.
- Fração do gabarito: $J^{R^*}/J$ por ato e a curva $\iota(w)$ (Seção 8.10).

<div id="87-falsifiers-fixed-before-any-run" class="anchor-alias" aria-hidden="true"></div>

### 8.7 Falseadores, fixados antes de qualquer execução

| ID | Observação | Afirmação derrotada |
|---|---|---|
| F1 | O intervalo de 95% para a diferença pareada na mediana de $J^*$, lei σ menos cascata fixa, inclui zero ou fica acima de zero em todo orçamento restritivo | O seletor da lei σ vence seu rival justo em joules |
| F2 | Algum braço registra um gasto excessivo | A implementação da recusa desse braço |
| F3 | A revocação da recusa em tarefas inviáveis fica abaixo de 0.9, ou mais de 10% das recusas recaem sobre tarefas que outro braço fechou dentro de $B$ | A correção da recusa |
| F4 | A correlação de Kendall entre `est_j` e `measured_j` fica abaixo de 0.8 | O uso desse estimador para qualquer classificação |
| F5 | O coeficiente de variação da média de $\iota$ entre sementes excede 0.25 em uma tarefa | A leitura de $\iota$ na granularidade dessa tarefa |
| F6 | O $\alpha_J$ ajustado não é positivo com 95% de confiança no estrato cumulativo | A acumulação nessas tarefas |
| F7 | A média dos joules medidos por bit confirmado ao longo de uma execução fica abaixo de $k_B T \ln 2$, ou qualquer ato de uma máquina macroscópica fica | A própria contabilidade: uma falha de medidor ou de escrituração, corrigida antes que qualquer outro resultado seja relatado |
| F8 | M1 e M0 discordam em uma carga de calibração por mais do que o limite de erro em P6 | Esse domínio RAPL como fonte medida nessa máquina |
| F9 | Um ciclo de ato físico mostra trabalho abaixo do piso da Proposição 1 com seus $\tau$ e $\langle A\rangle$ registrados | A contabilidade dessa execução: um canal de saltos não contado, um potencial mal calibrado ou uma fonte de trabalho não medida |
| F10 | Uma execução estacionária mostra $\mathrm{Var}(N)/\langle N\rangle^2$ abaixo de $1/\langle K\rangle$ além de seu intervalo de confiança | A contagem de saltos dessa execução: alguns saltos não foram contados |
| F11 | Um controlador mantém a planta com joules medidos por passo abaixo de $k_B T\ln 2 \log_2\lvert\lambda\rvert$ | O medidor ou o modelo da planta dessa execução |
| F12 | O maximizador de $\iota(\tau)$ medido fica fora de $\tau^* \pm 2\delta\tau^*$ da Previsão 1, ou a inclinação de $\ln\tau^*$ contra $\ln s$ se afasta de $-1/2$ por mais de dois erros padrão; ou o $\iota$ de uma execução excede o teto da Previsão 1 | A aditividade dos joules do ato e dos joules permanentes em um mesmo medidor, com $\iota$ como sua densidade; para o teto, a contabilidade dessa execução |

<div id="88-physical-act-cycles" class="anchor-alias" aria-hidden="true"></div>

### 8.8 Ciclos de ato físicos

Estas execuções testam as Proposições 1 a 4 no piso físico. O trabalho é calculado a partir de trajetórias medidas e do potencial calibrado, como em [61, 67, 70]. Ele é registrado como `trajectory_j` e nunca é misturado com `measured_j`, `reported_j` ou `est_j`.

- **Ciclo de ato em um registrador de carga (Proposições 1 e 4).** Uma caixa de elétron único ou um ponto quântico guarda um registro de um bit, como em [68, 70, 71]. Cada ciclo escreve a comparação, age e reinicializa o registro no tempo $\tau$. Um detector de carga conta cada salto de tunelamento, de modo que $\langle A\rangle$ é medido. Varrer $\tau$ ao longo de pelo menos duas décadas. Forma do resultado: trabalho por ciclo contra $k_B T\ln 2 + k_B T/(2\tau\langle A\rangle)$, o piso da Proposição 1 para $N = 2$ e $b = 1$.
- **Contagem de atos confirmados (Proposição 3).** No mesmo registrador, ciclando em regime estacionário, contar os atos confirmados $N$ e todos os saltos $K$ em janelas repetidas de igual duração. Forma do resultado: $\mathrm{Var}(N)/\langle N\rangle^2$ contra $1/\langle K\rangle$, e a dispersão de $T_n$ contra $1/(\langle T_n\rangle\langle k\rangle)$. Em uma máquina de informação com armadilha de realimentação, como em [27], executar o experimento direto e o reverso, calcular $\sigma_I$ a partir das trajetórias medidas e testar a parte 3.
- **O tempo ótimo do ato (Previsão 1).** Este é o teste de laboratório.
  - *Montagem.* Uma esfera coloidal em água à temperatura $T$ fica em uma armadilha de realimentação [61]. Sua posição é lida a cada $\Delta t$, e uma força de realimentação impõe um potencial virtual $U(x, t)$. O trabalho é calculado a partir da trajetória por energética estocástica, $W = \sum_t \partial_t U(x_t, t)\,\Delta t$ [319]. Uma coordenada executa o ciclo de ato de um bit em um poço duplo virtual, reinicializado no tempo $\tau$. A outra é mantida no topo de um poço invertido virtual, $U = -\tfrac{1}{2}k x^2$, cuja taxa de instabilidade $\Lambda$ é definida por $k$ e pela mobilidade da esfera.
  - *Blocos.* Para cada valor de $\Lambda$, três blocos são executados intercalados em ordem aleatorizada. Bloco A: atos sem meta mantida, em nove ou mais valores de $\tau$ espaçados logaritmicamente ao longo de pelo menos duas décadas; ele ajusta $J_0$ e $a$. Bloco B: a meta mantida sem atos; ele dá a potência permanente $s$. Bloco C: ambos juntos, nos mesmos valores de $\tau$; ele dá $\iota(\tau)$. Pelo menos 200 ciclos por ponto.
  - *Varredura de $s$.* Pelo menos quatro valores de $\Lambda$ abrangendo pelo menos uma década, de modo que $s$ abranja pelo menos uma década.
  - *Ajuste.* Ajustar $J(\tau) = J_0 + a/\tau + s\tau$ ao bloco C por mínimos quadrados ponderados. Ler o $\tau^*$ medido no máximo de $\iota(\tau)$ por um ajuste quadrático local em $\ln\tau$. Calcular $\sqrt{a/s}$ e sua faixa $\delta\tau^*$ a partir dos blocos A e B. Fazer a regressão de $\ln\tau^*$ sobre $\ln s$ por mínimos quadrados e relatar a inclinação com seu erro padrão.
  - *Falseamento.* A afirmação falha se a inclinação se afasta de $-1/2$ por mais de dois erros padrão, ou se um $\tau^*$ medido fica fora de $\sqrt{a/s} \pm 2\delta\tau^*$, ou se os joules por ato do bloco C diferem da soma dos blocos A e B além de seu intervalo combinado de 95%. O último teste é a aditividade em um mesmo medidor, o conteúdo físico da previsão.
  - *Poder.* O erro padrão da inclinação deve ficar abaixo de 0.1. Caso contrário, a execução é relatada como inconclusiva e a varredura é estendida. Uma execução inconclusiva não é uma aprovação.
  - *Segundo substrato.* Uma caixa de elétron único com um detector de carga repete o protocolo, com $\langle A\rangle$ contado salto a salto [70]. A concordância em dois substratos é o teste.
  - Todo o trabalho é calculado a partir de trajetórias e registrado como `trajectory_j`.
- **Manter uma planta instável (Proposição 2).** Um controlador digital mantém uma planta com um modo instável de $|\lambda|$ fixo por passo, a $f$ passos por segundo. Medir o controlador com M0 e M1. Registrar os bits do registro por passo. Forma do resultado: joules medidos por passo divididos por $k_B T\ln 2\log_2|\lambda|$, relatados como distância ao piso. Varrer $|\lambda|$ e $f$.

<div id="89-living-agents-measured-ι" class="anchor-alias" aria-hidden="true"></div>

### 8.9 Agentes vivos: ι medido

Forma do resultado: $\iota$ em uma preparação viva, como bits por decisão divididos por joules por decisão, ambos obtidos na mesma preparação e relatados com a distância ao piso. Um $\iota$ vivo conta como medido somente quando ambos os termos são medidos. Um valor em joules calculado a partir de condutâncias ou inferido de imageamento é registrado como `est_j`. A produção de entropia inferida de imageamento cerebral é de granulação grossa e informacional, portanto não é um medidor de joules [257].

- **Quimiotaxia bacteriana.** Taxa de informação a partir do comportamento de células individuais em um gradiente definido, como Mattingly e colegas a mediram [213]. Joules a partir do consumo de oxigênio da mesma cultura, divididos pelo número de células. O piso de comparação é o custo de enviar um bit pelo canal de sinalização da célula, segundo Bryant e Machta [197], ao lado de $k_B T\ln 2$.
- **Córtex visual de camundongo.** Informação de orientação por tentativa a partir de imageamento de dois fótons, e uso sináptico de ATP a partir de registros de célula inteira, como Padamsey e colegas obtiveram ambos [250]. A restrição alimentar desloca os joules. A resposta medida da informação aos joules é o sinal e o tamanho de $dX/dJ$ em um córtex.
- **Memória da mosca.** Fluxo de energia no corpo cogumelo durante a formação da memória de longo prazo, obtido por imageamento como fizeram Plaçais e colegas [252], por associação aprendida, com a retenção como confirmação. A sobrevivência sob inanição e dessecação é o custo do resultado [251, 253].

<div id="810-the-joule-price-of-prediction-first" class="anchor-alias" aria-hidden="true"></div>

### 8.10 O preço em joules de prever primeiro

Forma do resultado. Dividir os joules medidos de cada ato entre a fração do gabarito e o restante, $J_k = J_k^{R^*} + J_k^{\mathrm{act}}$. $J_k^{R^*}$ cobre escrever, manter e reinicializar $R^*(a)$. Reinicializar um gabarito com $H(R^*)$ bits de entropia custa pelo menos $H(R^*)\,k_B T\ln 2$ [6, 24]. Memória que não prevê custa dissipação [54]. Um gabarito eleva $\iota$ quando os joules de ato que ele economiza excedem seus próprios joules. O resultado medido é a curva $\iota(w)$ sobre a largura do gabarito $w$, os bits de $R^*$, com seu maximizador $w^*$ e a razão $\Delta J^{\mathrm{act}}/\Delta J^{R^*}$ em cada passo.

Protocolo. Fixar tarefas, engrenagens, predicados e orçamentos. Variar $w$ sobre uma grade predefinida. Um ato pode parar assim que seu resultado estiver resolvido em relação ao gabarito. Registrar `template_j` e os joules restantes do ato para cada ato, nos mesmos medidores.

Evidência disponível: a previsão confiante reduziu o uso de oxigênio cortical humano em até 12%, medido por imageamento metabólico (preprint) [254]. Em redes celulares, os bits do passado que melhor preveem o futuro são proibitivamente custosos [198]. Em laços de percepção e ação, agentes eficientes em trabalho equilibram previsão e esquecimento [234].

<div id="811-first-run-a-metered-acceptor-on-a-laptop" class="anchor-alias" aria-hidden="true"></div>

<div id="811-first-run-a-kernel-reported-acceptor-on-a-laptop" class="anchor-alias" aria-hidden="true"></div>

### 8.11 Primeira execução: um aceitador relatado pelo kernel em um laptop

Esta execução aplica as Seções 8.1 a 8.7 a uma classe de tarefas em uma máquina. Código, conjuntos de tarefas, recibos e análise estão no repositório do site em `experiments/agency-run`. O pré-registro e seus falseadores foram registrados primeiro no repositório (e830bff). O piloto e a calibração travada vieram em seguida (5828420), e depois a execução principal (35c967a).

**Método.**

- **Agente e tarefa.** Um processo Python fecha quebra-cabeças de Sudoku. O predicado de completude $C(z)$ passa quando a grade está cheia, cada linha, coluna e caixa contém de 1 a 9, e cada pista dada é mantida. Uma tarefa confirmada credita $b = n_{\mathrm{empty}}\log_2 9$ bits, o número de preenchimentos entre os quais o ato escolhe. Esse é o limite de capacidade da Definição 1. O conjunto de teste contém 30 quebra-cabeças, 10 por estrato (fácil, médio, difícil), gerados a partir de uma semente fixa. Um conjunto separado de 30 calibra os seletores.
- **Engrenagens.** g0 preenche solitários nus. g1 acrescenta solitários ocultos. g2 acrescenta busca em profundidade.
- **Braços.** O seletor da lei σ toma $a^* = \arg\max[H(a) - \lambda J(a)]$, com $H(a)$ igual à probabilidade de aprovação calibrada, dadas as engrenagens já tentadas, vezes $b$, e $\lambda = b/B$. A cascata fixa (a mais barata primeiro) toma a engrenagem mais barata cuja probabilidade de aprovação calibrada seja de pelo menos 0.5. Ambos fixam $R^*$ antes de cada ato, calculam seu hash com SHA-256 (Secure Hash Algorithm, 256 bits) e lhe atribuem um carimbo de tempo. Ambos comparam após o ato e recusam com um recibo quando nenhum ato cabe no orçamento. A linha de base cega à meta sorteia uma engrenagem ao acaso, sem previsão, sem comparação, sem escalonamento e sem recusa. O orçamento a interrompe.
- **Orçamentos e sementes.** Por tarefa, $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, a mediana do piloto de g2 sozinha. Os níveis 0.5 e 1.0 são restritivos: 98% e 40% das execuções do piloto os excedem. O nível 2.0 não é (0.7%). Há 20 sementes por condição, em uma ordem intercalada com semente. Ao todo, foram executados 5,400 episódios, com 4,940 atos.
- **Rótulo de energia.** Todo joule é `reported_j`: a estimativa de energia por processo feita pelo kernel para o agente (`ri_energy_nj` de `proc_pid_rusage`), lida antes e depois de cada ato, sem privilégios. O processo é a parede do agente. A grade do Sudoku é mantida dentro desse processo, de modo que o mundo $W'$ não está fora de $S$, como a Definição 2 exige. Esta execução testa a cinemática e a classificação com porta, não a definição. A execução que testa a definição mantém a grade em um segundo processo atrás de um socket, ou em um microcontrolador. `measured_j` está vazio, porque nenhum medidor de tomada foi conectado. `est_j` é o número de ciclos vezes $4.20 \times 10^{-10}$ J, a razão mediana do piloto.

**Resultados.** Média ± desvio padrão sobre 20 sementes. Uma execução é um braço em um nível de orçamento sobre todas as 30 tarefas. CV é o coeficiente de variação, desvio padrão dividido pela média.

| Braço | $B/J_{g2}$ | Tarefas fechadas de 30 | $X$ (bits) | $J$ (relatado, mJ) | $\iota$ (bits por joule relatado) | CV de $\iota$ | Recusas | Cortes | Gastos excessivos |
|---|---|---|---|---|---|---|---|---|---|
| Lei σ | 0.5 | 0.60 ± 0.50 | 108 ± 91 | 20.8 ± 0.3 | 5,254 ± 4,402 | 0.84 | 29.40 | 0 | 0 |
| Lei σ | 1.0 | 9.10 ± 1.86 | 1,479 ± 316 | 43.8 ± 4.0 | 34,454 ± 10,007 | 0.29 | 20.90 | 0 | 9 |
| Lei σ | 2.0 | 28.40 ± 0.60 | 4,823 ± 105 | 66.2 ± 5.8 | 73,345 ± 6,443 | 0.09 | 1.60 | 0 | 0 |
| Cascata fixa (a mais barata primeiro) | 0.5 | 0.70 ± 0.47 | 126 ± 85 | 18.8 ± 0.3 | 6,801 ± 4,569 | 0.67 | 29.30 | 0 | 0 |
| Cascata fixa (a mais barata primeiro) | 1.0 | 6.45 ± 1.50 | 1,047 ± 254 | 44.7 ± 3.6 | 23,804 ± 7,067 | 0.30 | 23.55 | 0 | 7 |
| Cascata fixa (a mais barata primeiro) | 2.0 | 27.50 ± 0.51 | 4,668 ± 92 | 67.0 ± 6.7 | 70,418 ± 7,766 | 0.11 | 2.50 | 0 | 0 |
| Cego à meta | 0.5 | 0.25 ± 0.44 | 45 ± 80 | 14.1 ± 3.1 | 2,775 ± 4,999 | 1.80 | 0 | 20.35 | 20 |
| Cego à meta | 1.0 | 3.85 ± 1.84 | 623 ± 301 | 26.6 ± 5.7 | 24,153 ± 13,364 | 0.55 | 0 | 17.45 | 0 |
| Cego à meta | 2.0 | 18.25 ± 2.71 | 3,034 ± 471 | 34.1 ± 9.7 | 92,724 ± 15,690 | 0.17 | 0 | 1.35 | 0 |

- **Por ato.** 1,902 atos foram confirmados. O $\iota$ mediano por ato foi $1.53 \times 10^5$ bits por joule relatado, com intervalo interquartil de $8.3 \times 10^4$ a $4.7 \times 10^5$. Os joules por bit confirmado foram pelo menos $3.8 \times 10^{14}$ vezes $k_B T\ln 2$ a 300 K, com mediana de $2.3 \times 10^{15}$ vezes. O piso permite $3.5 \times 10^{20}$ bits por joule.
- **Joules por tarefa fechada.** A mediana entre os braços foi de 0.34 a 0.38 mJ para tarefas fáceis, de 1.58 a 1.70 mJ para as médias e de 4.05 a 4.28 mJ para as difíceis.
- **Seletores, pareados por semente (exploratório, post hoc).** Esta análise foi escolhida depois da execução, portanto é exploratória. Com $B = 1.0\,J_{g2}$, o seletor da lei σ fechou 2.65 tarefas a mais por execução do que a cascata fixa (intervalo bootstrap de 95% de 1.5 a 3.8). Seu $\iota$ de execução foi maior em 10,650 bits por joule (de 4,747 a 16,592). Com $B = 2.0\,J_{g2}$, ele fechou 0.9 a mais (de 0.55 a 1.25). A regra da lei σ vai direto à engrenagem que basta, de modo que os joules das tentativas leves fracassadas permanecem no orçamento. Os joules por tarefa fechada foram iguais: nas 4 tarefas que ambos os braços fecharam com $B = 1.0\,J_{g2}$, o intervalo pareado foi de $-7.9$ a $+15.5$ µJ (R-F1).
- **Verificação cruzada do pacote.** O powermetrics, executado de forma não interativa em janelas de 30 s, leu cerca de 12.1 W de potência de CPU e 13.6 W de potência de GPU vindos de outros trabalhos na máquina enquanto o agente dormia. O agente acrescentou cerca de 0.6 W em seu próprio medidor. A potência de CPU de fundo variou cerca de 0.5 W entre janelas, de modo que os joules do pacote com a linha de base ociosa subtraída saíram negativos. O medidor por processo é o medidor da execução. D1 e D5 precisam de um medidor de tomada em uma máquina de resto ociosa.

**Resultados dos falseadores.** Todos foram fixados antes da execução.

| ID | Observação | Resultado |
|---|---|---|
| R-F1 | O intervalo de 95% da diferença pareada por tarefa na mediana de $J^*$, lei σ menos cascata fixa, inclui zero em todo nível restritivo | Disparou. Com $B = 1.0$, 4 tarefas fechadas por ambos: intervalo de $-7.9$ a $+15.5$ µJ. Com $B = 0.5$, nenhuma tarefa fechada por ambos. Nas tarefas que ambos fecham, os joules são iguais |
| R-F2 | Algum episódio termina acima de seu orçamento | Disparou. 36 de 5,400. Lei σ 9 e cascata fixa 7 com $B = 1.0$, de 0.07% a 3.6% acima, quando a comparação final ocorreu fora da guarda. Cego à meta 20 com $B = 0.5$, até 33% acima, em orçamentos da largura de poucas verificações do medidor |
| R-F3 | Revocação da recusa abaixo de 0.9 em níveis de tarefa inviáveis, ou mais de 10% das recusas em níveis de tarefa que algum braço fecha em metade das sementes | Disparou. Revocação de 1.00 em 41 níveis de tarefa inviáveis. 13.1% das recusas recaíram em níveis de tarefa que algum braço fechou |
| R-F4 | Tau-b de Kendall entre `est_j` e `reported_j` por ato abaixo de 0.8 | Manteve-se. 0.96 em 4,000 atos |
| R-F5 | CV do $\iota$ de execução acima de 0.25 em alguma condição | Disparou nos níveis restritivos (de 0.29 a 1.80). Manteve-se com $B = 2.0$ (0.09, 0.11, 0.17) |
| R-F6 | A classificação por $J^*$ difere da classificação por $\iota$ integrado | Disparou. Com $B = 2.0$, $J^*$ classifica lei σ, cascata fixa, cego à meta. O $\iota$ integrado coloca o cego à meta em primeiro. Com $B = 1.0$ os dois últimos trocam de posição |
| R-F7 | Um ato confirmado abaixo de $k_B T\ln 2$ por bit | Manteve-se. O ato mais baixo ficou $3.8 \times 10^{14}$ vezes acima |
| R-F8 | $\iota$ de execução do cego à meta pelo menos igual ao do melhor seletor em um nível restritivo | Manteve-se. 2,775 contra 6,801 com $B = 0.5$. 24,153 contra 34,454 com $B = 1.0$ |

**O que a execução estabelece.**

- $\iota$ é lido nos recibos, ato a ato e execução a execução, como exigem as Proposições 5 e 6. Com um orçamento folgado, ele é estável entre sementes.
- $J^*$ é a classificação, e o $\iota$ integrado não é. O agente cego à meta teve o maior $\iota$ de execução com o orçamento folgado, fechando 18 de 30 tarefas contra 28. Suas falhas foram baratas. $J^*$ passa pela porta de $C(z)$, portanto coloca esse agente em último. É por isso que a Seção 2.3 classifica por $J^*$, com $X_{\mathrm{req}}$ como porta.
- Exploratório, post hoc: sob um orçamento restritivo, o seletor da lei σ fechou mais tarefas do que a cascata fixa, e os joules por tarefa fechada foram iguais. O ganho está em quais tarefas cabem no orçamento, não em um fechamento mais barato da mesma tarefa. A Seção 8.11.2 diz o que as execuções posteriores replicam.
- Duas correções de implementação vêm antes da próxima execução. A comparação e a escrita do recibo passam para dentro da região guardada. Um custo de fechamento medido é cobrado antes de cada ato.

A Figura 4 coloca a porta ao lado da classificação medida com o orçamento folgado.

![Diagrama e dados. As execuções candidatas passam pela porta C de z, X pelo menos X requerido. As que passam são classificadas por J estrela, o mínimo de joules até a conclusão correta; as que falham não são classificadas. Abaixo, Execução 1 com orçamento 2.0: a lei σ fechou 28.40 de 30 tarefas com iota de execução de 73,345 bits por joule; a cascata fixa, 27.50 com 70,418; o cego à meta, 18.25 com 92,724. O iota integrado sozinho colocaria o agente cego à meta em primeiro.](/figures/agency/gate-then-rank.svg)

*Figura 4. Primeiro a porta, depois a classificação por joules. Diagrama com dados da Execução 1 com $B = 2.0\,J_{g2}$, médias sobre 20 sementes da tabela de resultados acima; o $\iota$ integrado sozinho colocaria o agente cego à meta em primeiro (R-F6). Fonte: `experiments/agency-run/results`. Uma [cópia em PNG](/figures/agency/gate-then-rank.png) é fornecida.*

<div id="8111-second-run-guarded-acceptor-40-seeds" class="anchor-alias" aria-hidden="true"></div>

### 8.11.1 Segunda execução: aceitador guardado, 40 sementes

Esta execução usa a mesma classe de tarefas, as mesmas engrenagens e os mesmos três braços da Seção 8.11, no mesmo laptop. O pré-registro da segunda execução foi registrado primeiro no repositório (610dd4c). O piloto e a calibração travada vieram em seguida (c88511f), e depois a execução principal (920d7e2). A Previsão 1 não tem análogo em software nesta execução: o agente não tem um custo de ato declarado que caia com o tempo do ato nem um custo permanente que ele controle, de modo que o pré-registro afirma que o desenho de dose-resposta não é executado.

**Método.**

- **Guarda.** Todo joule de um episódio é cobrado dentro da guarda: seleção, hash, passos de engrenagem, comparação, recibo e leitura final. A verificação de abertura usa gasto $= 0$. Os braços da lei recusam quando a guarda falha. O braço cego à meta é cortado.
- **Limiar de recusa.** Ambos os seletores usam o quantil $r$ dos custos de calibração nos testes de ajuste ao orçamento. $r$ foi travado a partir da reprodução da calibração antes da execução principal: $r = 0.1$, com revocação de 1.0 e precisão de cerca de 0.976 na partição de calibração.
- **Orçamentos e sementes.** Por tarefa, $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, a mediana do piloto de g2 sozinha. Os níveis 0.5 e 1.0 são restritivos: as frações do piloto que os excedem são 0.98 e 0.4. O nível 2.0 não é (0.0067). Há 40 sementes por condição. Ao todo, foram executados 10,800 episódios.
- **Janela silenciosa.** O silêncio não foi alcançado. As sondagens rodaram até o limite. A última sondagem antes do início, às 21:46 no horário local, registrou CPU de outros processos perto de 621% de um núcleo, com mediaanalysisd e processos auxiliares do editor no topo. A potência de linha de base do pacote foi de cerca de 21.4 W. A potência do pacote na janela principal foi de cerca de 22.7 W. A execução registra `quiet_window = no`.
- **Rótulo de energia.** Todo joule é `reported_j`: a estimativa de energia por processo feita pelo kernel para o agente (`ri_energy_nj` de `proc_pid_rusage`), com valores do pacote do powermetrics onde usados para a verificação cruzada. `est_j` é o número de ciclos vezes $1.783 \times 10^{-9}$ J, travado no piloto. `measured_j` está vazio: nenhum medidor de tomada foi conectado.
- **Verificação cruzada do pacote.** Na janela principal, o medidor do processo leu 42.35 J. Os joules líquidos do pacote foram 121.81 J, uma razão de cerca de 2.88 em relação ao processo. A deriva da linha de base do pacote foi de cerca de $-0.082$ W. Como `quiet_window = no`, a verificação cruzada é declarada não realizável. O medidor por processo continua sendo o medidor da execução.

**Resultados.** Média ± desvio padrão sobre 40 sementes. Uma execução é um braço em um nível de orçamento sobre todas as 30 tarefas. CV é o coeficiente de variação, desvio padrão dividido pela média. $J$ é relatado em milijoules para comparação com a Seção 8.11.

| Braço | $B/J_{g2}$ | Tarefas fechadas de 30 | $X$ (bits) | $J$ (relatado, mJ) | $\iota$ (bits por joule relatado) | CV de $\iota$ | Recusas | Cortes | Gastos excessivos |
|---|---|---|---|---|---|---|---|---|---|
| Lei σ | 0.5 | 0.62 ± 0.49 | 113 ± 89 | 59.5 ± 2.0 | 1,942 ± 1,525 | 0.785 | 29.38 | 0 | 0 |
| Lei σ | 1.0 | 2.90 ± 1.74 | 523 ± 314 | 133.7 ± 13.8 | 4,150 ± 2,892 | 0.697 | 27.10 | 0 | 0 |
| Lei σ | 2.0 | 22.73 ± 1.30 | 3,980 ± 206 | 197.3 ± 18.2 | 20,359 ± 2,388 | 0.117 | 7.28 | 0 | 0 |
| Cascata fixa (a mais barata primeiro) | 0.5 | 0.57 ± 0.50 | 104 ± 90 | 60.1 ± 2.1 | 1,777 ± 1,548 | 0.871 | 29.43 | 0 | 0 |
| Cascata fixa (a mais barata primeiro) | 1.0 | 2.67 ± 1.25 | 483 ± 226 | 140.3 ± 13.5 | 3,593 ± 1,948 | 0.542 | 27.32 | 0 | 0 |
| Cascata fixa (a mais barata primeiro) | 2.0 | 19.93 ± 1.42 | 3,509 ± 227 | 201.2 ± 20.4 | 17,684 ± 2,909 | 0.164 | 10.07 | 0 | 0 |
| Cego à meta | 0.5 | 0.12 ± 0.33 | 23 ± 61 | 35.4 ± 11.6 | 513 ± 1,397 | 2.723 | 0 | 22.85 | 0 |
| Cego à meta | 1.0 | 1.00 ± 0.93 | 181 ± 169 | 72.0 ± 19.5 | 2,661 ± 2,579 | 0.969 | 0 | 20.00 | 0 |
| Cego à meta | 2.0 | 10.65 ± 2.27 | 1,859 ± 400 | 97.3 ± 30.1 | 20,302 ± 5,766 | 0.284 | 0 | 8.70 | 0 |

- **Por ato.** 7,960 atos foram executados. 2,448 foram confirmados. O tau-b de Kendall entre `est_j` e `reported_j` foi 0.942 em 4,000 atos. O $\iota$ mediano por ato foi de cerca de $3.11 \times 10^{4}$ bits por joule relatado. Todo ato confirmado ficou muito acima de $k_B T\ln 2$ por bit: o mais baixo ficou cerca de $6.4 \times 10^{14}$ vezes acima desse piso.
- **Recusa.** A revocação foi 1.0 em 49 pares inviáveis. Houve 5,223 recusas. A fração em tarefas fechadas por algum braço foi de cerca de 0.081.
- **Gastos excessivos.** Nenhum episódio terminou acima do orçamento. A fração máxima de gasto excessivo foi $-0.03684$: todo episódio terminou abaixo do orçamento.
- **Seletores, pareados por semente.** Esta análise foi declarada no pré-registro. Com $B = 2.0\,J_{g2}$, o seletor da lei σ fechou 2.8 tarefas a mais por execução do que a cascata fixa (intervalo bootstrap de 95% de 2.3 a 3.275). Seu $\iota$ de execução foi maior em 2,674 bits por joule (de 1,831 a 3,504). Em 39 de 40 sementes, o seletor da lei σ fechou mais. Com $B = 0.5$ e $B = 1.0$, os intervalos para a diferença de tarefas fechadas incluem zero. Esses resultados não disparam nenhum falseador.

**Resultados dos falseadores.** Todos foram fixados antes da execução. A tabela apresenta o resultado da segunda execução ao lado do resultado da primeira.

| ID | Observação | Execução 2 | Execução 1 |
|---|---|---|---|
| R-F1 | Em todo nível restritivo, o intervalo de 95% da diferença pareada por tarefa na mediana de $J^*$, lei σ menos cascata fixa, inclui zero ou fica acima de zero | Manteve-se, porque nenhum intervalo pôde ser formado: com $B = 1.0$ nenhuma tarefa foi fechada por ambos, e com $B = 0.5$ uma foi. Os joules das tarefas compartilhadas não mostram economia da lei σ | Disparou |
| R-F2 | Algum episódio termina acima de seu orçamento | Manteve-se. 0 de 10,800. A guarda cobra comparação, recibo e leitura final | Disparou |
| R-F3 | Revocação da recusa abaixo de 0.9 em pares inviáveis, ou mais de 10% das recusas em pares que algum braço fecha | Manteve-se. Revocação de 1.0 em 49 pares inviáveis. Fração em tarefas fechadas por algum braço de cerca de 0.081. O limiar de recusa pelo quantil $r$ é a mudança em relação à Execução 1 | Disparou |
| R-F4 | Tau-b de Kendall entre `est_j` e `reported_j` por ato abaixo de 0.8 | Manteve-se. 0.942 em 4,000 atos | Manteve-se |
| R-F5 | CV do $\iota$ de execução acima de 0.25 em alguma condição | Disparou nos níveis restritivos (de 0.54 a 2.72) e para o braço cego à meta com $B = 2.0$ (0.284). Manteve-se para ambos os seletores com $B = 2.0$ (0.117, 0.164) | Disparou |
| R-F6 | A classificação por $J^*$ difere da classificação por $\iota$ integrado | Disparou. Com $B = 2.0$, $J^*$ classifica lei σ, cascata fixa, cego à meta. O $\iota$ integrado classifica lei σ, cego à meta, cascata fixa | Disparou |
| R-F7 | Um ato confirmado abaixo de $k_B T\ln 2$ por bit | Manteve-se. O ato mais baixo ficou cerca de $6.4 \times 10^{14}$ vezes acima | Manteve-se |
| R-F8 | $\iota$ de execução do cego à meta pelo menos igual ao do melhor seletor em um nível restritivo | Manteve-se. 513 contra 1,942 com $B = 0.5$. 2,661 contra 4,150 com $B = 1.0$ | Manteve-se |

**O que a execução estabelece.**

- A guarda resolve R-F2. Zero gastos excessivos.
- O quantil de recusa resolve R-F3. A revocação permanece em 1.0 e a fração de recusas em tarefas fecháveis cai abaixo de 10%.
- $J^*$ continua sendo a classificação. O $\iota$ integrado ainda discorda dela com o orçamento folgado (R-F6).
- O $\iota$ de execução ainda é instável entre sementes nos orçamentos restritivos (R-F5).
- R-F1 se manteve apenas porque poucas tarefas foram fechadas por ambos os seletores para formar um intervalo. Nenhuma execução mostra o seletor da lei σ fechando uma tarefa compartilhada com menos joules. O ganho pareado por semente com $B = 2.0$ é de mais tarefas fechadas, não de fechamentos mais baratos das mesmas tarefas.

<div id="8112-second-machine-a-replication-with-a-package-energy-counter" class="anchor-alias" aria-hidden="true"></div>

### 8.11.2 Segunda máquina: uma replicação com um contador de energia do pacote

Esta execução repete o protocolo da segunda execução da Seção 8.11.1 em uma segunda máquina com um contador de energia diferente. É uma replicação da comparação entre seletores, não uma medição de energia. Código, recibos e resumos estão em `experiments/agency-run`: `PREREGISTRATION_v2_jetson.md` e sua Emenda 1, `results_jetson/summary.md` (parte A) e `results_jetson_cyc/summary.md` (parte B). O adendo ao pré-registro foi registrado primeiro no repositório (cb059f0), depois o backend do medidor e o arcabouço de execução (1938577), depois a Emenda 1 (7703822). O piloto da parte A (6ddd086) e a execução principal (a652503) vieram em seguida, depois o piloto da parte B (3fde1fb) e a execução principal (1bb2444).

**Método.**

- **Máquina.** Um laptop Linux com um processador x86 de 14 núcleos: 6 núcleos de desempenho com 2 threads cada e 8 núcleos de eficiência. O turbo estava desligado. Cada núcleo foi fixado em sua frequência base: 2.6 GHz nos núcleos de desempenho e 1.9 GHz nos núcleos de eficiência. O agente rodou fixado em uma thread de um núcleo de desempenho, um episódio por vez. A frequência mediana do núcleo do agente durante os blocos foi 2.6 GHz. As configurações originais foram restauradas após a execução.
- **Inalterado.** Tarefas, predicado, bits acoplados, engrenagens de g0 a g2, os três braços, a guarda, a reprodução da recusa, os níveis de orçamento $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, 40 sementes e 10,800 episódios por parte, os falseadores de R-F1 a R-F8 e a análise pareada por semente são os da Seção 8.11.1.
- **Contador de energia.** RAPL (Running Average Power Limit) é o contador de energia do pacote no chip do processador. Cada intervalo foi cobrado pelos joules do pacote menos a potência de linha de base ociosa daquele bloco vezes os segundos do intervalo. RAPL é um modelo e um sensor dentro do chip, não um medidor de tomada. Ele conta todos os processos no pacote.
- **Janela silenciosa.** O silêncio não foi alcançado: `quiet_window = no`. Um executor de CI (integração contínua) compilou código Rust na máquina o tempo todo. As 40 sondagens antes do início viram outros processos usando de 1.0 a 20.0 núcleos e potência do pacote de 2.3 a 28.7 W. A porta por bloco foi satisfeita antes de 180 de 360 blocos na parte A e de 244 de 360 na parte B. 98 e 208 blocos ficaram silenciosos por toda a sua duração.
- **Parte A.** O medidor do agente é o RAPL lido antes e depois de cada ato. Todo valor é `reported_j`.
- **Parte B.** A Emenda 1 acrescentou esta parte antes de qualquer piloto, porque um teste do arcabouço mostrou que os atos duram de cerca de 0.01 a 6 ms, enquanto o RAPL se atualiza mais ou menos a cada 1 ms em degraus de cerca de 5 a 60 mJ. O medidor do agente é `est_j`: os ciclos de usuário da thread do agente vezes $c$. $c$ foi calibrado no RAPL no piloto da parte B, descontado o ocioso, em 8 rodadas de 3 s, na segunda tentativa: $c = 6.576 \times 10^{-10}$ J por ciclo, a partir de 41.11 J de energia líquida do pacote em 62,516,635,701 ciclos. Todo valor em joules da parte B é `est_j`. Os valores de RAPL registrados ao lado permanecem `reported_j`.
- **Rótulos.** `measured_j` está vazio nas duas partes. Nenhum medidor de tomada ou medidor de shunt foi conectado.
- **Nomes dos braços.** Os nomes dos braços e seus campos no código seguem a Seção 8.3. A linha de base cega à meta é `blind`.

**Resultados da parte A: RAPL lido por ato.** Média ± desvio padrão sobre 40 sementes. $J$ é `reported_j` em joules, como no resumo. Os níveis 0.5, 1.0 e 2.0 são todos restritivos: 0.647, 0.40 e 0.353 das execuções de g2 do piloto os excedem.

| Braço | $B/J_{g2}$ | Tarefas fechadas de 30 | $X$ (bits) | $J$ (relatado, J) | $\iota$ (bits por joule relatado) | CV de $\iota$ | Recusas | Cortes | Gastos excessivos |
|---|---|---|---|---|---|---|---|---|---|
| Lei σ | 0.5 | 0.00 | 0 | 0.0018 | 0 | n/a | 30.00 | 0.00 | 323 |
| Lei σ | 1.0 | 0.00 | 0 | 0.0002 | 0 | n/a | 30.00 | 0.00 | 322 |
| Lei σ | 2.0 | 1.00 ± 0.39 | 181 ± 71 | 0.0018 ± 0.0336 | 14,427 ± 18,680 | 1.295 | 29.00 | 0.00 | 322 |
| Cascata fixa (a mais barata primeiro) | 0.5 | 0.00 | 0 | -0.0008 | 0 | n/a | 30.00 | 0.00 | 326 |
| Cascata fixa (a mais barata primeiro) | 1.0 | 0.00 | 0 | -0.0005 | 0 | n/a | 30.00 | 0.00 | 324 |
| Cascata fixa (a mais barata primeiro) | 2.0 | 1.00 ± 0.51 | 181 ± 91 | 0.0107 ± 0.0286 | 15,451 ± 23,767 | 1.538 | 29.00 | 0.00 | 320 |
| Cego à meta | 0.5 | 0.00 | 0 | 0.0026 | 0 | n/a | 0.00 | 30.00 | 327 |
| Cego à meta | 1.0 | 0.00 | 0 | 0.0009 | 0 | n/a | 0.00 | 30.00 | 323 |
| Cego à meta | 2.0 | 0.28 ± 0.45 | 50 ± 82 | 0.0019 ± 0.0180 | 3,801 ± 13,749 | 3.618 | 0.00 | 28.90 | 321 |

- **Resolução do contador.** O episódio mediano durou cerca de 0.04 ms. 10,075 de 10,800 episódios não viram nenhuma mudança no contador do pacote. 10,549 tiveram `reported_j` igual ou abaixo de zero após a subtração do ocioso.
- **Orçamentos.** As medianas de $J_{g2}$ no piloto variaram de $-0.0110$ a $0.0914$ J, com mediana de $0.0097$ J. O limiar de abertura da guarda foi 0.117 J. Os orçamentos ficaram abaixo dele para 30, 30 e 28 de 30 tarefas nos três níveis, de modo que os braços da lei recusaram quase todas as tarefas.
- **Gastos excessivos.** Toda condição registrou de 320 a 327 gastos excessivos. A fração máxima de gasto excessivo foi 10.86. Uma cobrança que lê zero na maioria dos atos e um degrau inteiro do contador em alguns poucos não consegue respeitar um orçamento de poucos milijoules.
- **Por ato.** 137 atos foram executados. 91 foram confirmados. 44 atos leram zero. 26 atos confirmados leram zero ou menos. O tau-b de Kendall entre `est_j` e `reported_j` foi 0.368 em 93 atos.
- **Verificação cruzada.** O valor líquido do pacote nos blocos foi 3.445 J contra 2.737 J somados sobre os episódios, uma razão de 0.794. A potência ociosa do pacote foi 4.01 W antes da execução e 5.55 W depois. A verificação cruzada é declarada não realizável.
- **Seletores, pareados por semente.** Com $B = 2.0\,J_{g2}$, a diferença de tarefas fechadas foi 0 (intervalo bootstrap de 95% de $-0.15$ a $0.15$). A diferença de $\iota$ de execução foi 1,328 bits por joule relatado (de $-8,971$ a $12,581$). 30 de 40 sementes empataram. Em 0.5 e 1.0, nenhum braço fechou uma tarefa.

**Resultados da parte B: contagem de ciclos vezes uma constante calibrada no RAPL.** Média ± desvio padrão sobre 40 sementes. $J$ é `est_j` em joules, como no resumo. Os níveis 0.5 e 1.0 são restritivos: 0.98 e 0.40 das execuções de g2 do piloto os excedem. O nível 2.0 não é (0.0).

| Braço | $B/J_{g2}$ | Tarefas fechadas de 30 | $X$ (bits) | $J$ (estimado, J) | $\iota$ (bits por joule estimado) | CV de $\iota$ | Recusas | Cortes | Gastos excessivos |
|---|---|---|---|---|---|---|---|---|---|
| Lei σ | 0.5 | 1.10 ± 0.98 | 200 ± 178 | 0.0345 ± 0.0017 | 6,027 ± 5,458 | 0.906 | 28.90 | 0.00 | 0 |
| Lei σ | 1.0 | 8.75 ± 3.14 | 1,574 ± 565 | 0.0805 ± 0.0098 | 20,519 ± 8,516 | 0.415 | 21.25 | 0.00 | 0 |
| Lei σ | 2.0 | 28.60 ± 0.98 | 4,882 ± 154 | 0.1008 ± 0.0234 | 50,667 ± 10,088 | 0.199 | 1.40 | 0.00 | 0 |
| Cascata fixa (a mais barata primeiro) | 0.5 | 1.15 ± 0.92 | 208 ± 167 | 0.0366 ± 0.0013 | 5,833 ± 4,757 | 0.816 | 28.85 | 0.00 | 0 |
| Cascata fixa (a mais barata primeiro) | 1.0 | 9.22 ± 3.07 | 1,660 ± 551 | 0.0813 ± 0.0106 | 21,412 ± 8,130 | 0.380 | 20.77 | 0.00 | 0 |
| Cascata fixa (a mais barata primeiro) | 2.0 | 27.77 ± 2.30 | 4,745 ± 377 | 0.1099 ± 0.0339 | 47,108 ± 13,216 | 0.281 | 2.23 | 0.00 | 0 |
| Cego à meta | 0.5 | 0.20 ± 0.46 | 36 ± 84 | 0.0210 ± 0.0055 | 1,722 ± 3,927 | 2.280 | 0.00 | 21.50 | 0 |
| Cego à meta | 1.0 | 3.73 ± 2.12 | 667 ± 381 | 0.0436 ± 0.0140 | 16,393 ± 9,246 | 0.564 | 0.00 | 16.68 | 0 |
| Cego à meta | 2.0 | 15.65 ± 2.50 | 2,662 ± 433 | 0.0499 ± 0.0160 | 57,266 ± 14,596 | 0.255 | 0.00 | 4.17 | 0 |

- **Por ato.** 7,800 atos foram executados. 3,847 foram confirmados. O $\iota$ mediano por ato foi 69,892 bits por joule estimado, com intervalo interquartil de 35,759 a 146,697. Todo ato confirmado ficou muito acima de $k_B T\ln 2$ por bit: o mais baixo ficou cerca de $3.6 \times 10^{14}$ vezes acima desse piso, a mediana cerca de $5.0 \times 10^{15}$ vezes.
- **Recusa.** A revocação foi 1.0 em 45 pares inviáveis. Houve 4,136 recusas. A fração em tarefas fechadas por algum braço foi de cerca de 0.071.
- **Gastos excessivos.** Nenhum episódio terminou acima do orçamento. A fração máxima de gasto excessivo foi $-0.03977$.
- **Tarefas compartilhadas.** Com $B = 1.0$, 9 tarefas foram fechadas por ambos os seletores. A diferença pareada por tarefa na mediana de $J^*$, lei σ menos cascata fixa, teve média de $1.02 \times 10^{-4}$ J (intervalo de 95% de $-5.23 \times 10^{-4}$ a $6.03 \times 10^{-4}$, Wilcoxon $p = 0.214$). Com $B = 0.5$, uma tarefa foi fechada por ambos, com diferença de $-6.68 \times 10^{-6}$ J. Com $B = 2.0$, 29 tarefas foram fechadas por ambos, com diferença média de $-2.65 \times 10^{-4}$ J (de $-6.63 \times 10^{-4}$ a $5.67 \times 10^{-5}$, $p = 0.358$).
- **Seletores, pareados por semente.** Com $B = 2.0\,J_{g2}$, o seletor da lei σ fechou 0.825 tarefa a mais por execução do que a cascata fixa (intervalo bootstrap de 95% de 0.125 a 1.575). Seu $\iota$ de execução foi maior em 3,559 bits por joule estimado (de $-1,068$ a $8,320$). 9 de 40 sementes favoreceram o seletor da lei σ e 27 empataram. Com $B = 0.5$, a diferença de tarefas fechadas foi $-0.05$ (de $-0.45$ a $0.35$). Com $B = 1.0$, foi $-0.475$ (de $-1.8$ a $0.775$).
- **A estimativa contra o contador.** O tau-b de Kendall entre o `est_j` de cada episódio e o valor líquido do pacote RAPL do mesmo episódio foi $-0.037$ em 4,000 episódios. 5,258 de 10,800 episódios não viram nenhuma mudança no contador do pacote. Somado sobre os blocos, `est_j` foi 23.23 J contra 17.14 J de valor líquido do pacote RAPL, uma razão de 1.355. A potência ociosa do pacote foi 9.37 W antes da execução e 3.17 W depois. A verificação cruzada é declarada não realizável.

**Resultados dos falseadores.** Todos foram fixados antes da execução. A parte B substitui R-F4 pelo teste por episódio contra o RAPL, como afirma a Emenda 1. Na Execução 2 e nas duas partes aqui, "Manteve-se" significa que a observação não ocorreu.

| ID | Observação | Parte A (RAPL por ato) | Parte B (modelo de ciclos) | Execução 2 |
|---|---|---|---|---|
| R-F1 | Em todo nível restritivo, o intervalo de 95% da diferença pareada por tarefa na mediana de $J^*$, lei σ menos cascata fixa, inclui zero ou fica acima de zero | Manteve-se, porque nenhum intervalo pôde ser formado: uma tarefa foi fechada por ambos, com $B = 2.0$, com diferença de $-0.0052$ J, e nenhuma nos outros níveis | Manteve-se, porque a observação exige todos os níveis restritivos e $B = 0.5$ tem uma única tarefa compartilhada ($-6.68 \times 10^{-6}$ J) e nenhum intervalo. Com $B = 1.0$ o intervalo inclui zero | Manteve-se |
| R-F2 | Algum episódio termina acima de seu orçamento | Disparou. De 320 a 327 por condição | Manteve-se. 0 de 10,800 | Manteve-se |
| R-F3 | Revocação da recusa abaixo de 0.9 em pares inviáveis, ou mais de 10% das recusas em pares que algum braço fecha | Manteve-se. Revocação de 1.0 em 88 pares. Fração de 0.0011 | Manteve-se. Revocação de 1.0 em 45 pares. Fração de 0.071 | Manteve-se |
| R-F4 | Parte A: tau-b de Kendall entre `est_j` e `reported_j` por ato abaixo de 0.8. Parte B: tau-b entre o `est_j` do episódio e o valor líquido RAPL do episódio abaixo de 0.8 | Disparou. 0.368 em 93 atos | Disparou. $-0.037$ em 4,000 episódios | Manteve-se |
| R-F5 | CV do $\iota$ de execução acima de 0.25 em alguma condição | Disparou (de 1.295 a 3.618) | Disparou. De 0.380 a 2.280 nos níveis restritivos. Com $B = 2.0$: lei σ 0.199, cascata fixa 0.281, cego à meta 0.255 | Disparou |
| R-F6 | A classificação por $J^*$ difere da classificação por $\iota$ integrado | Disparou. Com $B = 2.0$, $J^*$ classifica lei σ, cascata fixa, cego à meta. O $\iota$ integrado coloca a cascata fixa em primeiro | Disparou. Com $B = 2.0$, $J^*$ classifica lei σ, cascata fixa, cego à meta. O $\iota$ integrado classifica cego à meta, lei σ, cascata fixa | Disparou |
| R-F7 | Um ato confirmado abaixo de $k_B T\ln 2$ por bit | Disparou. 26 atos confirmados leram zero ou menos, o que os coloca abaixo do piso. Isso é quantização do contador | Manteve-se. O ato mais baixo ficou cerca de $3.6 \times 10^{14}$ vezes acima | Manteve-se |
| R-F8 | $\iota$ de execução do cego à meta pelo menos igual ao do melhor seletor em um nível restritivo | Disparou. Com $B = 0.5$ e $1.0$, todos os braços leem 0 | Manteve-se. 1,722 contra 6,027 com $B = 0.5$. 16,393 contra 21,412 com $B = 1.0$ | Manteve-se |

**O que a replicação estabelece.**

- O RAPL por ato não consegue medir atos mais curtos que um milissegundo. A maioria dos episódios não viu nenhuma atualização do contador, de modo que a guarda recusou ou gastou em excesso apenas por quantização. A parte A é um resultado sobre a resolução do medidor. Ela não diz nada sobre os seletores.
- Com um medidor de ciclos, o resultado da seleção tem o mesmo sinal que na Execução 2 com $B = 2.0$: o seletor da lei σ fechou mais tarefas por execução. O ganho é menor (0.825 contra 2.8), e o nível 2.0 não foi restritivo nesta máquina. Nos níveis restritivos, os intervalos incluem zero.
- O modelo de ciclos não acompanhou o contador do pacote episódio a episódio (tau-b $-0.037$), e seu total nos blocos foi 1.355 vezes o valor líquido do contador. Os joules da parte B classificam atos por ciclos. Não são leituras de energia.
- Os joules das tarefas compartilhadas também não mostram economia da lei σ aqui. Onde o seletor da lei σ ganha, ganha em tarefas fechadas, não em um fechamento mais barato da mesma tarefa.
- Nenhum valor nesta seção é `measured_j`.

A Figura 5 coloca lado a lado os resultados de tarefas fechadas das três execuções.

![Três painéis de gráficos de barras de tarefas fechadas de 30 por braço e nível de orçamento para a Execução 1, a Execução 2 e a parte B da segunda máquina. No nível folgado 2.0, o seletor da lei σ fechou 28.40, 22.73 e 28.60; a cascata fixa, 27.50, 19.93 e 27.77; a linha de base cega à meta, 18.25, 10.65 e 15.65. As barras de erro mostram um desvio padrão.](/figures/agency/run-results.svg)

*Figura 5. Tarefas fechadas de 30 em três execuções pré-registradas. Figura de dados: média ± um desvio padrão sobre as sementes, das tabelas de resultados das Seções 8.11, 8.11.1 e 8.11.2 (parte B). Fontes: `experiments/agency-run/results`, `results2` e `results_jetson_cyc`. Uma [cópia em PNG](/figures/agency/run-results.png) é fornecida.*

**O que se replica e o que não se replica.** O resultado dos seletores na execução 1 foi exploratório. Duas execuções posteriores o testaram sob pré-registro.

| Afirmação da execução 1 (exploratória) | Execução 2 (pré-registrada) | Segunda máquina, parte B (pré-registrada) |
|---|---|---|
| Mais tarefas fechadas com $B = 1.0\,J_{g2}$: +2.65 (de 1.5 a 3.8) | Não replicado. O intervalo inclui zero | Não replicado. $-0.475$ (de $-1.8$ a $0.775$) |
| Mais tarefas fechadas com $B = 2.0\,J_{g2}$: +0.9 (de 0.55 a 1.25) | Replicado. +2.8 (de 2.3 a 3.275) | Replicado. +0.825 (de 0.125 a 1.575) |
| Joules por tarefa fechada | Iguais. Nenhuma economia nas tarefas compartilhadas | Iguais. Os intervalos das tarefas compartilhadas incluem zero |

O resultado replicado é estreito. No nível de orçamento mais folgado, o seletor da lei σ fecha mais tarefas do que a cascata fixa, em duas máquinas. Nenhuma execução mostra menos joules para a mesma tarefa fechada, e o ganho da execução 1 com orçamento restritivo não se replicou. A parte A é um resultado sobre a resolução do medidor e não testa nenhuma das duas afirmações.

**Protocolo de medição para a próxima execução.** Ambas as partes falham no medidor, portanto o protocolo muda antes que os seletores sejam testados de novo.

1. **Máquina ociosa.** Não interromper nada que pertença a outra pessoa. Esperar por uma janela silenciosa, ou agendar uma: outros processos em até 0.5 núcleo durante toda a execução, com `quiet_window = yes` registrado. Se o silêncio não for alcançado, a execução não começa.
2. **Medidor de tomada ou de shunt.** Conectar um medidor de potência de tomada, ou um medidor de shunt no trilho de alimentação, amostrado mais rápido do que um ato. Só as suas leituras preenchem `measured_j`.
3. **Verificação de resolução primeiro.** Antes do piloto, registrar o intervalo de atualização e o tamanho do degrau do medidor em relação à duração mediana de um ato. Se o medidor não conseguir resolver um ato, medir blocos de atos e atribuir por contagem, e dizer isso no pré-registro.
4. **Calibrar a estimativa no medidor.** Ajustar `est_j` no medidor de tomada ou de shunt no nível de bloco, e exigir que R-F4 se mantenha antes que `est_j` comande a guarda.
5. **Fixar e registrar.** Fixar a frequência, registrar as linhas de base ociosas antes e depois, relatar a deriva e manter o contador do pacote como uma verificação cruzada rotulada.
6. **O fechamento de tarefas é primário.** O pré-registro da próxima execução faz do fechamento de tarefas o desfecho primário: a diferença pareada por semente em tarefas fechadas, lei σ menos cascata fixa, em cada nível de orçamento, com a correção descendente de Holm entre os níveis. Os joules das tarefas compartilhadas (R-F1) são secundários.

<div id="812-reporting" class="anchor-alias" aria-hidden="true"></div>

### 8.12 Relato

Publicar todos os recibos, os traços brutos dos medidores, as linhas de base ociosas e o código de análise junto com o resultado. Relatar os joules medidos, relatados e estimados em colunas separadas. Nunca somar entre níveis. Declarar quais falseadores dispararam, com o mesmo destaque dos que passaram. Toda execução também responde à lista de verificação de Takahashi e Hayashi [239]: a fronteira da contabilidade; os termos do balanço de energia (energia armazenada e trabalho exportado, ou uma declaração de que são desprezíveis); a linha de base e se os joules são totais ou incrementais; a granulação grossa dos resultados; o horizonte e o protocolo de reinicialização; o tempo de relógio e a potência média ao lado dos bits por joule; e o estimador dos bits acoplados com sua correção de viés.


<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referências

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
42. Richens, J. and Everitt, T. (2024). Robust agents learn causal world models. *International Conference on Learning Representations (ICLR 2024)*, oral, honorable mention. arXiv:2402.10877.
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
239. Takahashi, K. and Hayashi, Y. (2026). Thermodynamic limits of physical intelligence. In *Artificial General Intelligence: 19th International Conference, AGI 2026, Proceedings, Part II*, Lecture Notes in Computer Science. Springer. https://doi.org/10.1007/978-3-032-33195-3_24. arXiv:2602.05463.
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
260. Tschand, A., Rajan, A. T. R., Idgunji, S., Ghosh, A. et al. (2025). MLPerf Power: benchmarking the energy efficiency of machine learning systems from μWatts to MWatts for sustainable AI. *2025 IEEE International Symposium on High Performance Computer Architecture (HPCA)*, 1201-1216. https://doi.org/10.1109/HPCA61900.2025.00092. arXiv:2410.12032.
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
315. Paninski, L. (2003). Estimation of entropy and mutual information. *Neural Computation* 15:1191-1253. https://doi.org/10.1162/089976603321780272
316. Russell, S. and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C
317. Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. *Proceedings of the Third Conference on Uncertainty in Artificial Intelligence (UAI 1987)*, 429-447. arXiv:1304.2759.
318. Simon, H. A. and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6:235-247. https://doi.org/10.1016/0004-3702(75)90002-8
319. Sekimoto, K. (1998). Langevin equation and thermodynamics. *Progress of Theoretical Physics Supplement* 130:17-27. https://doi.org/10.1143/PTPS.130.17
320. Wolpert, D. H., Korbel, J., Lynn, C. W., Tasnim, F., Grochow, J. A., Kardeş, G. et al. (2024). Is stochastic thermodynamics the key to understanding the energy costs of computation? *PNAS* 121:e2321112121. arXiv:2311.17166. https://doi.org/10.1073/pnas.2321112121
321. Chen, L., Zaharia, M. and Zou, J. (2023). FrugalGPT: how to use large language models while reducing cost and improving performance. arXiv:2305.05176 (preprint).
322. Ong, I., Almahairi, A., Wu, V., Chiang, W.-L. et al. (2024). RouteLLM: learning to route LLMs with preference data. arXiv:2406.18665 (preprint).
323. Koyuk, T. and Seifert, U. (2020). Thermodynamic uncertainty relation for time-dependent driving. *Physical Review Letters* 125:260604. arXiv:2005.02312. https://arxiv.org/abs/2005.02312
324. Jordan, S. P. (2017). Fast quantum computation at arbitrarily low energy. *Physical Review A* 95:032305. arXiv:1701.01175. https://arxiv.org/abs/1701.01175
325. Nemenman, I., Shafee, F. and Bialek, W. (2002). Entropy and inference, revisited. *Advances in Neural Information Processing Systems* 14. arXiv:physics/0108025. https://arxiv.org/abs/physics/0108025
326. Norton, J. D. (2005). Eaters of the lotus: Landauer's principle and the return of Maxwell's demon. *Studies in History and Philosophy of Modern Physics* 36:375-411. https://doi.org/10.1016/j.shpsb.2004.12.002
327. Maroney, O. J. E. (2005). The (absence of a) relationship between thermodynamic and logical reversibility. *Studies in History and Philosophy of Modern Physics* 36:355-374. arXiv:physics/0406137. https://arxiv.org/abs/physics/0406137
328. Sagawa, T. (2014). Thermodynamic and logical reversibilities revisited. *Journal of Statistical Mechanics* P03025. arXiv:1311.1886. https://arxiv.org/abs/1311.1886
329. López-Suárez, M., Neri, I. and Gammaitoni, L. (2016). Sub-kBT micro-electromechanical irreversible logic gate. *Nature Communications* 7:12068. https://doi.org/10.1038/ncomms12068
330. Paneru, G., Lee, D. Y., Park, J.-M., Park, J. T., Noh, J. D. and Pak, H. K. (2018). Optimal tuning of a Brownian information engine operating in a nonequilibrium steady state. *Physical Review E* 98:052119. https://doi.org/10.1103/PhysRevE.98.052119
331. Panizon, E. (2026). Optimal control of a mesoscopic information engine. arXiv:2603.29804 (preprint). https://arxiv.org/abs/2603.29804
332. Rolandi, A., Abiuso, P., Lipka-Bartosik, P. et al. (2026). Energy-time-accuracy tradeoffs in thermodynamic computing. arXiv:2601.04358 (preprint). https://arxiv.org/abs/2601.04358
333. Burnell, R., Schellaert, W., Burden, J. et al. (2023). Rethink reporting of evaluation results in AI. *Science* 380:136-138. https://doi.org/10.1126/science.adf6369
334. Zhou, L., Pacchiardi, L., Martínez-Plumed, F. et al. (2025). General scales unlock AI evaluation with explanatory and predictive power. arXiv:2503.06378 (preprint). https://arxiv.org/abs/2503.06378
335. Laber, M., Shafi, Z., Savcisens, G. et al. (2026). Scaling of capability and efficiency at inference time in large reasoning models. arXiv:2609.27166 (preprint). https://arxiv.org/abs/2609.27166
336. Erol, M. H., El, B., Suzgun, M., Yuksekgonul, M. and Zou, J. (2025). Cost-of-Pass: an economic framework for evaluating language models. arXiv:2504.13359 (preprint). https://arxiv.org/abs/2504.13359
337. Saad-Falcon, J., Narayan, A., Akengin, H. O. et al. (2025). Intelligence per Watt: measuring intelligence efficiency of local AI. arXiv:2511.07885 (preprint). https://arxiv.org/abs/2511.07885
338. Standard Performance Evaluation Corporation. SPECpower_ssj2008. https://www.spec.org/power_ssj2008/
339. Krakauer, D. C., Mitchell, M. and Krakauer, J. W. (2026). Large language models and emergence: a complex systems perspective. *Philosophical Transactions of the Royal Society A* 384:20250014. https://doi.org/10.1098/rsta.2025.0014. arXiv:2506.11135.
340. Krakauer, D. C. (2026). Competitive and complementary tools. arXiv:2607.18460 (preprint). https://arxiv.org/abs/2607.18460
341. Kimura, M. (1961). Natural selection as the process of accumulating genetic information in adaptive evolution. *Genetical Research* 2:127-140. https://doi.org/10.1017/S0016672300000616
342. Worden, R. P. (1995). A speed limit for evolution. *Journal of Theoretical Biology* 176:137-152. https://doi.org/10.1006/jtbi.1995.0183
343. Hledík, M., Barton, N. and Tkačik, G. (2022). Accumulation and maintenance of information in evolution. *PNAS* 119:e2123152119. https://doi.org/10.1073/pnas.2123152119
