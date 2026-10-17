### 3.2 Definições

**Definição 1 (a Forma).** Um programa é uma tupla

$$P = (S, E, \delta, D, \lambda)$$

- $S = \Sigma_c \times \Sigma_d$, o espaço de estados: estruturas sobre um vocabulário fixo $\Sigma$, divididas em regiões de controle $\Sigma_c$ e dados $\Sigma_d$. $\Sigma_d$ contém o relógio lógico, a contagem de entradas e as relações tipadas (na linguagem, também as regiões declaradas). Cada estado é uma instância de banco de dados no sentido de Codd [5].
- $E$, o alfabeto de eventos, incluindo o tique do relógio lógico.
- $\delta : S \times E \to S \times O^*$, a transição: total, determinística e pura, escrita como um conjunto finito de atualizações guardadas "if $\varphi$ then $f(\bar t) := t_0$", em que cada passo lê um conjunto limitado de posições. Ela devolve o próximo estado e as saídas do passo. Escreva $\delta_1 = \pi_1 \circ \delta$ para a sua componente de estado.
- $D$, o log durável: uma sequência de entradas $\{\mathit{seq}, \mathit{event}, \mathit{prev\_hash}, \mathit{state\_hash}, \mathit{hash}\}$, em que $\mathit{state\_hash}$ é o SHA-256 do JSON canônico do estado após o passo, $\mathit{hash}$ é o SHA-256 do JSON canônico dos quatro primeiros campos, e o primeiro $\mathit{prev\_hash}$ são 64 zeros. O log é uma cadeia de hashes, de modo que mudar qualquer entrada passada muda todo $\mathit{hash}$ posterior.
- $\lambda = \pi_2 \circ \delta : S \times E \to O^*$, o mapa de saída. Uma máquina de Mealy lê os dois argumentos [6]; uma máquina de Moore lê só o estado [7].

**Definição 2 (Forma e ajuste).** A *forma* é o formato da tupla com quatro invariantes: $\delta$ é determinística e pura; a exploração é limitada; o vocabulário é fixo; o estado é a dobra do log,

$$\mathrm{state}(D) = \mathrm{foldl}(\delta_1, s_0, D).$$

Um log também pode carregar o resultado, as saídas e o estado de cada entrada. Esses campos são derivados: não entram no hash e devem ser iguais ao replay (T1 e T3 da [§3.7](#37-the-language-versions-06-and-07-costs-and-theorem-status)). Dois tipos de rejeição são distintos. No perfil do motor todo evento é aplicado, e uma entrada que falha no seu contrato produz uma saída `reject` e uma linha de erro. Na linguagem, um evento recusado deixa o estado inalterado (T8) e é registrado como recusado.

O *ajuste* são os dados que completam o formato: o vocabulário $\Sigma$, os alfabetos $E$ e $O$, o programa de regras $\Pi$ que define $\delta$, as regras de saída que definem $\lambda$ e os dados iniciais $s_0$. Nos termos de Gurevich, o ajuste é o vocabulário, o programa ASM e as estruturas iniciais. Nos termos de Codd, $\Sigma$ é o esquema e $s_0$ é a instância. Em termos de linhas de produto, um ajuste é uma seleção de características [8]. Em termos de síntese guiada por sintaxe (SyGuS), um ajuste é um termo de uma gramática que satisfaz uma especificação [9].

**Definição 3 (equivalência de ajustes).** Dois ajustes são equivalentes quando, para toda sequência de eventos $L$, suas sequências de saída sob $\lambda$ são iguais.

**Definição 4 (linguagem de ajuste).** Uma gramática cujos termos denotam ajustes. Linguagens de programação, documentos SCXML, configurações XState e especificações `.rce` são linguagens de ajuste. Uma linguagem de ajuste é completa quando todo programa ASM sobre $\Sigma$ tem um termo nela.

**Definição 5 (projeção de controle).** Divida $\Sigma = \Sigma_c \cup \Sigma_d$ em símbolos de controle finitos e relações de dados. O statechart de $P$ é a projeção de $\delta$ sobre $\Sigma_c$: os estados são valores de $\Sigma_c$, as transições carregam um evento e uma guarda sobre $\Sigma_d$, e as ações são atualizações de $\Sigma_d$. Os statecharts de Harel dão a hierarquia e as regiões ortogonais [10].

**Definição 6 (e-graph de ajuste).** Para um ajuste $F$ e um conjunto $R$ de reescritas corretas, o e-graph de ajuste $EG(F, R)$ é o e-graph saturado dos termos de regra de $F$ sob $R$ [11, 12]. Cada e-classe contém ajustes equivalentes pela Definição 3.

**Definição 7 (custo em joules).** $\mathrm{cost}_J(t)$ é a energia estimada (`est_j`) para executar o termo $t$ uma vez num substrato nomeado, ponderada pelo número esperado de execuções.

