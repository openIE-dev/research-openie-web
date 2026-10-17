### 3.4 Proposições

**Proposição 1 (a Forma captura todo algoritmo sequencial).** Para todo algoritmo sequencial $A$ existe uma instância da Forma $P$ cujas execuções são as execuções de $A$.

*Esboço de prova.* O Theorem 6.13 dá uma ASM $B$ com os estados, os estados iniciais e o mapa de um passo de $A$. Tome $E = \{\varepsilon\}$, $\delta(s, \varepsilon) = \tau_B(s)$, $D = (s_0, \varepsilon^n)$ e $\lambda$ a identidade. A dobra após $n$ tiques é $\tau_A^n(s_0)$. Pelo Corolário 3.3 de Gurevich, $P$ e $A$ têm as mesmas execuções. ∎

**Proposição 1b (programas interativos).** Estenda $\Sigma$ com um símbolo de entrada de aridade zero, definido como $e$ antes de cada passo; então $\delta(s, e) = \tau(s[\mathit{in} := e])$ é um algoritmo sequencial sobre o vocabulário estendido, e a Proposição 1 se aplica. A construção é nossa.

**Proposição 1c (computabilidade).** Sob o axioma de Dershowitz e Gurevich, toda instância da Forma computa uma função Turing-computável [4, 16, 17]. A Forma não acrescenta poder. Ela dá a todo programa da classe uma forma.

**Proposição 1d (provas são ajustes).** "For each proof of a given proposition, there is a program of the corresponding type" [18]. Um tipo é uma especificação, e uma prova é um ajuste que a satisfaz. A porta da correção é a existência dessa prova ou de um teste de aceitação aprovado.

**Proposição 2 (um gerador).** Uma função $G : \mathrm{Fit} \to \mathrm{Program}$ gera um programa executável para todo ajuste e não lê nenhum domínio. *Base:* todo programa é uma instância da Forma, então $G$ emite um armazenamento tipado, um tipo de evento, regras compiladas, um log com uma dobra e um despachante de saída. Geradores de esqueleto como os geradores do Rails, o JHipster e o Yeoman são $G$ restrito a pequenas linguagens de ajuste. A engenharia de linhas de produto parte de "the systematic discovery and exploitation of commonality across related software systems" [8]; o que é comum é a Forma.

**Proposição 3 (extração de menor energia).** A extração com $\mathrm{cost}_J$ devolve o termo de menos joules que o extrator encontra na e-classe de $F$. *Esboço de prova.* As reescritas são corretas, então todo termo da e-classe tem o comportamento observável de $F$ e passa pela mesma porta. A extração minimiza o custo, e o custo é em joules. ∎ Isso é Mixture of Limits aplicado a código: manter o ajuste mínimo que faz a tarefa, e o resto é desperdício.

**Proposição 4 (determinismo do replay).** Se $\delta$ não lê relógio de parede, ordena atualizações sem nomes e registra toda entrada, dois replays do mesmo $D$ dão hashes de estado idênticos em todo passo.

**Proposição 5 (a projeção em statechart é correta).** Projete cada estado de uma execução sobre $\Sigma_c$. O resultado é uma execução do statechart emitido sob os mesmos eventos.

**Proposição 6 (orçamento de coordenação).** Regras marcadas como monotônicas rodam em réplicas sem coordenação; só regras não monotônicas precisam de um ponto de coordenação. *Base:* o teorema CALM, "the programs that have consistent, coordination-free distributed implementations are exactly the programs that can be expressed in monotonic logic" [19].

A marca é derivada da regra, nunca declarada, e a verificação da IR recusa uma Forma cuja marca armazenada difere da derivada (especificação, Apêndice D.5):

| A regra tem | Marca | Motivo |
|---|---|---|
| nenhum resolve, read, join ou scan | monotônica | suas escritas só acrescentam chaves e fazem crescer contadores |
| um resolve | não monotônica | apaga linhas de escalada |
| um read do seu próprio sumidouro | não monotônica | ler, modificar, escrever |
| um join por chave | não monotônica | a linha juntada pode estar ausente agora e presente depois, ou ser sobrescrita |
| um scan | não monotônica | observa a relação inteira, inclusive o que está ausente |

A marca é correta e não completa: um join contra uma relação somente de inserção seria monotônico, mas o perfil não prova que uma relação é somente de inserção, então a marca não o afirma. Uma Forma é livre de coordenação quando toda regra é monotônica. Todo read, join e scan vê o estado na entrada do evento, de modo que o pós-estado de um evento de entrada não depende da ordem em que rodam as regras de sumidouros diferentes; só a ordem das saídas depende dela, e essa ordem é fixada pelo hash do conteúdo.

**Proposição 7 (inteligência como derivada em joules).** Seja $X$ a contagem de tarefas que passam pela porta e $J$ os joules gastos. $\iota = dX/dJ$ é lida em retrospecto a partir de $D$, que registra todo evento e seu `est_j`. A extração sob $\mathrm{cost}_J$ mantém a porta fixa e não aumenta $J$, então, com $X$ igual, ela não diminui $\iota$.

