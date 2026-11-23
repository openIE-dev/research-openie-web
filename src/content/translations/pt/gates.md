---
title: "Portas de Comprometimento Medidas: Energia para Conclusão Correta em Sistemas Agênticos"
deck: "Uma porta que permite a um agente agir somente após a aprovação de uma verificação, uma cascata que tenta o método mais barato primeiro, e as medições de energia de ambos, rotuladas conforme a forma como cada uma foi obtida."
lang: "pt"
source: "gates"
complete: true
---

<div id="notational-intelligence-as-commit-law" class="anchor-alias" aria-hidden="true"></div>
<div id="metered-commit-gates-energy-to-correct-completion-for-agentic-systems" class="anchor-alias" aria-hidden="true"></div>

*Revisão db13599, 5 de novembro de 2026. Dados e código: [research.openie.dev/data/](/data/#gates). LaTeX PDF: [/pdfs/latex/gates.pdf](/pdfs/latex/gates.pdf) ([fonte](/pdfs/latex/gates.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Visão geral

Este artigo define um portão que permite que uma máquina atue somente após a aprovação de uma verificação, e uma regra que tenta o método mais barato primeiro. Ele relata resultados de software e uma medição de energia a nível de placa, cada uma rotulada conforme foi obtida.

**Em palavras simples**

1. Um computador não deve executar uma ação que não possa ser desfeita até que uma verificação simples indique que é segura.
2. Deve tentar a forma mais barata de concluir uma tarefa primeiro e usar um modelo de IA grande somente se nada mais barato funcionar.
3. Cada decisão é registrada com a energia consumida, de modo que qualquer pessoa possa verificá‑la posteriormente.

Este artigo tem duas partes que compartilham uma regra: a correção é o portão, e os joules são a classificação. A Parte I é o portão de commit. Uma proposta pode não se autorizar. Um ato irreversível ocorre apenas atrás de um certificado, e toda decisão, commit ou recusa, é escrita em um recibo. A Parte II é Mistura de Limites: uma tarefa requer energia esperada mínima para ser concluída, e energia gasta após a tarefa estar completa não compra progresso verificado. Sua instância padrão é uma cascata que tenta a engrenagem mais barata primeiro: Lookup, depois Formula, depois Solver, depois Model. A cascata para assim que o predicado de conclusão da tarefa $C(z)$ se torna verdadeiro, e recusa com um recibo quando a próxima engrenagem ultrapassaria o orçamento. Entre os sistemas que completam a tarefa corretamente, aquele que necessita de menos joules classifica‑se mais alto.

Uma medição de placa ancora o tecido do portão. Em um AMD Kria KV260, o INA260 embarcado leu diferenças de nível SOM A/B/A de 11.428 pJ por ciclo de portão (erro padrão 129 pJ, N = 4) para o tecido do portão WCA, e 98.0 pJ por ciclo de semente (erro padrão 30.8 pJ, N = 4) para o tecido da semente. O INA260 está conectado a `VCC_SOM`, que alimenta o sistema de processamento, a lógica programável, a memória DDR e os reguladores do módulo ([KV260 device tree, `ina260@40`](https://gbmc.googlesource.com/linux/+/ccd1cdca5cd433c8a5dff78b69a79b31d9b77ee1/arch/arm64/boot/dts/xilinx/zynqmp-sck-kv-g-revB.dtso)), portanto essas são diferenças de módulo inteiro, não uma figura de trilho‑núcleo ou apenas PL (Seção I.3.7). A diferença do tecido‑semente na tabela da Seção I.4.9 é +0.0098 W (erro padrão 0.0031 W), que corresponde a 9.8 mW, o mesmo 98.0 pJ por ciclo de semente a cerca de 100 MHz. Na alimentação de 5 V declarada para esta comparação isso equivale a 1.96 mA, próximo à resolução de corrente de 1.25 mA da peça, e a diferença é relatada como inconclusiva até que um medidor de trilho‑PL e ao menos 10 passagens sejam executados.

<div id="01-contributions" class="anchor-alias" aria-hidden="true"></div>

### 0.1 Contribuições

1. Um envelope de commit: proposta, depois certificado, depois commit ou recusa, depois recibo. O certificado é conjuntivo: consulta permite E um predicado de energia, opcionalmente E uma função barreira de controle. Os motivos de recusa são tipados. Uma implementação de referência em Rust, Wise Computer Automation (WCA), executa-o (Parte I).  
2. Uma invariância de proveniência tipada. A saída rotulada `ModelGenerated` nunca pode ser promovida a `Deterministic` (Partes I e II).  
3. Uma cascata com recusas nomeadas, e a condição sob a qual o mais barato primeiro é ótimo em joules esperados, que decorre do resultado de ordenação de Simon e Kadane para busca sequencial: experimente engrenagens em ordem decrescente de $p_i / c_i$, onde $p_i$ é a probabilidade de que a engrenagem $i$ conclua a tarefa e $c_i$ sua energia esperada em joules (Simon e Kadane, 1975) (Parte II).  
4. Energia para conclusão correta como o ranking, definido na Seção 0.2.  
5. Recibos como instrumento. Cada recibo contém o hash da predição e sua marca temporal antes do ato, o resultado, a correspondência, os joules por nível (medidos, reportados, estimados, nunca somados) e o motivo da recusa.

<div id="02-energy-to-correct-completion" class="anchor-alias" aria-hidden="true"></div>

### 0.2 Energia para conclusão correta

Seja $C(z)$ o predicado de conclusão da tarefa, com qualquer prazo escrito nele. Para um sistema $S$ com políticas $\pi$ e uma taxa de falha permitida $\delta$,

$$
J^*(S) = \min_{\pi} \; \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta .
$$

Correção e prazos são restrições. Entre os sistemas que passam pelo portão, apenas joules os ordenam. Ordenar sistemas pelo número real $J^*$ constitui um pré‑ordem total, pois quaisquer dois reais podem ser comparados. Se cada leitura tem erro de medidor de no máximo $\epsilon$ joules, dois sistemas cujo $J^*$ difere em mais de $2\epsilon$ mantêm sua ordem. MLPerf Power coloca cada resultado de energia atrás de um alvo de precisão. $J^*$ tem a mesma forma.

<div id="03-how-to-read-this-paper" class="anchor-alias" aria-hidden="true"></div>

### 0.3 Como ler este artigo

Seções na Parte I são numeradas I.n e seções na Parte II são numeradas II.n. Cada parte tem sua própria lista de referências. Duas figuras contêm as ideias principais: Figura 1 (Seção I.1) desenha o portão de commit, e Figura 2 (Seção II.1) desenha o piso e o platô de Mixture of Limits. Preços e demanda não são discutidos aqui.

<div id="part-i" class="anchor-alias" aria-hidden="true"></div>
<div id="part-i-the-commit-gate" class="anchor-alias" aria-hidden="true"></div>

## Part I. A porta de comprometimento

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="i-abstract" class="anchor-alias" aria-hidden="true"></div>

## I. Resumo

Agentes propõem ações. O trabalho irreversível começa somente quando uma ação tem permissão para ser executada. Este artigo trata essa etapa de permissão como um objeto formal. A inteligência notacional de Linus Lee é a observação de que uma mudança nos símbolos pode tornar alguns pensamentos baratos e outros expressáveis. A afirmação aqui é mais restrita. Para máquinas que podem mover matéria ou acionar uma ferramenta irreversível, a notação útil é uma lei de tempo de execução: uma proposta não pode autorizar a si mesma. A referência de software, Wise Computer Automation (WCA), registra a lei como quatro objetos sob o esquema `wca.commit.v1`: uma proposta, um certificado, um motivo de recusa tipado e uma decisão de commit. O certificado usado na referência é conjuntivo. Uma tabela de consulta (LUT) allow bit deve ser verdadeira, e um predicado de energia deve ser verdadeiro. Uma função de barreira de controle opcional (CBF) pode ser adicionada. Chamadas somente leitura podem contornar o portão. Chamadas irreversíveis não podem.

Os números de energia neste artigo são produtos de contagens de operações e constantes analíticas de energia (um modelo OpCounter). Eles não são potência da placa. O comportamento de field-programmable gate array (FPGA) tem três classes aqui. A simulação Icarus Verilog verifica a lógica de transferência de registradores emitida. Um Alchitry Pt V2 executa o portão de malha fechada e concorda com o software em cada decisão. Ele não possui medidor, portanto sua energia não é medida. Um AMD Kria KV260 executa o tecido do portão sob seu monitor de potência INA260 integrado. Parar e executar o mesmo bitstream, intercalado A/B/A, produz uma diferença medida a nível de placa de 11.428 pJ por ciclo de portão (erro padrão 129 pJ, N = 4) para oito avaliações paralelas de LUT allow, predicado de energia e barreira a 25 MHz. O tecido de semente menor fornece 98.0 pJ por ciclo de semente (erro padrão 30.8 pJ, N = 4). Estes são `measured_j` a nível de placa. Eles não são leituras de core-rail e não representam o custo de joule de planta em malha fechada (Seção I.3.7). O estágio B está disponível como um instrumento de navegador em https://research.openie.dev/living/fpga-sim/. Ele compila o mesmo portão Rust para WebAssembly (WASM) e mostra o estado da LUT e rastros de commit através da API WebGPU. Esse instrumento é uma emulação. Não é uma medição de dispositivo sob teste (DUT) e não representa a potência da placa Alchitry.

Os resultados de software medidos são limitados. Em um episódio de pêndulo de 16 passos com semente 1, a referência comete 1 passo e recusa 15. A energia analítica do episódio é 8.6795e-10 joule. No teste port-Hamiltoniano de ponto fixo Safe relatado, as permissões falsas contra o oráculo de energia contínua `Vdot <= epsilon` são 0 nas grades declaradas, e o custo é 79 recusas falsas em 209.261 decisões (Seção I.4.3). Esse é o par de segurança e vivacidade naquele conjunto de testes (Seção I.4.10). Uma demonstração Model Context Protocol (MCP) recusa uma chamada de ferramenta irreversível sem invocar o executor. Uma comparação toy com uma barreira de conjunto de energia e um escudo discreto mostra desacordo entre definições de segurança. Nenhum desses resultados é uma reivindicação de liderança em energia de silício, de desempenho de controle industrial, ou de medição de core-rail.

<div id="notation" class="anchor-alias" aria-hidden="true"></div>
<div id="i-notation" class="anchor-alias" aria-hidden="true"></div>

## I. Notação

Os termos são definidos na primeira utilização científica abaixo e reunidos aqui para que as seções posteriores possam usar a forma abreviada.

| Termo | Definição neste artigo |
|------|--------------------------|
| Inteligência notacional | A alegação de Lee de que notações melhores podem ampliar o que uma pessoa ou sistema pode fazer de forma confiável, além de apenas adicionar ferramentas. |
| Portão de commit | Uma regra de tempo de execução que ou aplica uma ação proposta ou a recusa. O proponente não obtém um segundo canal informal. |
| Automação Inteligente de Computador (WCA) | A referência de software que implementa o portão de commit na fronteira entre uma proposta e um efeito irreversível. |
| Arquitetura Energy-First (EFA) | A escolha de design de colocar um predicado de energia dentro do registro de permissão, não apenas em um relatório posterior. |
| Proposta | Uma ação candidata `u`, estado e dicas analíticas de energia opcionais. Não pode ser confirmada. |
| Certificado | O registro do portão: permissão LUT, predicado de energia, predicado CBF opcional, razões e métricas. |
| Razão de recusa | Um código tipado como `lut_veto`, `energy_veto`, `cbf_veto`, `budget_exceeded` ou `policy`. |
| Decisão de commit | O envelope que define a ação da planta para `u` ou para zero. |
| Tabela de consulta (LUT) | Um mapa discreto de um código compacto para permitir ou recusar. |
| Multiplicador de matriz ternária de consulta (TLMM) | O caminho de proposta de consulta de tabela ternária barato da referência. |
| Função de barreira de controle (CBF) | Um certificado de invariância de conjunto quando sua desigualdade se mantém (Ames et al., 2019). |
| Protocolo de Contexto de Modelo (MCP) | Um transporte de chamada de ferramenta. Neste artigo é um adaptador em teste, não um certificado de planta. |
| Sistema Um | Procedimentos de decisão tipados (classe Laya / Jev) que escolhem entre opções conhecidas em software. Eles são proponentes. |
| Port-Hamiltoniano | Um modelo de energia estruturado usado aqui para uma verificação estilo passividade em plantas de brinquedo. |
| Verificação em tempo de execução (RV) | Checagem de uma propriedade em um traço em execução. Relacionado, mas não idêntico, ao registro de commit. |
| Dispositivo sob teste (DUT) | Hardware medido sob uma carga declarada com um medidor declarado. As execuções KV260 da Seção I.3.7 são as únicas medições DUT neste artigo. |
| Field-programmable gate array (FPGA) | Lógica reconfigurável. Este artigo relata simulação Verilog, um Alchitry Pt V2 programado com energia não medida, e leituras de medidor KV260 ao nível de placa (Seção I.3.7). |
| WebAssembly (WASM) | Um alvo de compilação portátil para o navegador. O emulador FPGA WASM da Etapa B está disponível em https://research.openie.dev/living/fpga-sim/. |
| WebGPU | A API GPU do navegador nomeada como caminho de exibição e avaliação de grade para esse emulador. |
| Alchitry Pt V2 | A documentação do fornecedor identifica um Xilinx Artix-7 XC7A100T. FPGA programado (carregado em SRAM) com o portão de commit em malha fechada; energia não medida (Seção I.3.7). |
| DiffLogic | Redes de portas lógicas diferenciáveis treinadas para estrutura booleana (Petersen et al., 2022). |
| Estimativa analítica de energia | `J = sum_op count_op * E_op` com constantes nomeadas. Não é potência da placa. |
| Modeled | Uma quantidade obtida a partir de uma fórmula declarada ou estrutura ajustada. |
| Simulated | Uma quantidade obtida executando o software ou modelo Verilog. |
| Board-measured | Uma quantidade de um medidor em um dispositivo e carga de trabalho declarados. Apenas as leituras KV260 do NI-9 pertencem a esta classe. |
| Oracle-safe | Conformidade com o oráculo contínuo de energia `Vdot <= epsilon` na planta declarada. |
| Check-safe | O residual discreto Safe ponto fixo / Q16.16 que aproxima esse oráculo no portão. |
| Set-safe | Invariância de conjunto sob um predicado de barreira ou escudo (por exemplo um CBF de conjunto de energia), que pode divergir de oracle-safe. |

<div id="terms-used-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i-terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### I. Termos utilizados aqui

Este artigo já distingue três predicados de segurança. **Oracle-safe** significa o oráculo contínuo `Vdot <= epsilon`. **Check-safe** significa o residual discreto Safe Q16.16 que rastreia esse oráculo no portão. **Set-safe** significa invariância de conjunto sob uma barreira ou escudo. NI-4 mostra que check-safe e set-safe podem discordar. A referência de software é a implementação em Rust que produz cada resultado simulado aqui. As classes de evidência são definidas na tabela de Notação: modelado, simulado, medido‑no‑placa. O sinalizador da página `board_metered` está verdadeiro devido apenas às leituras KV260.

**Constantes analíticas.** `E_LUT_READ = 1e-12` J e as demais constantes OpCounter na Seção I.3.4 são substitutos de engenharia para comparação relativa dentro deste modelo. Elas não são medições calibradas da placa. Não as interprete como joules de silício. As contagens zero‑false‑allows contra o oráculo nomeado permanecem conforme relatado.

**Figuras vivas.** Pilha de commits: [/living/ni/#ni-diag-02](/living/ni/#ni-diag-02). Executor Seed-1: [/living/ni/#ni-run-01](/living/ni/#ni-run-01). Safe false-allow=0: [/living/ni/#ni-run-02](/living/ni/#ni-run-02). Simulador Stage B: [/living/fpga-sim/](/living/fpga-sim/).

**Escopo da Parte I.** A Seção I.2 coloca o registro de commit contra pesquisa de notação, teoria da informação, resultados de escalonamento, redes LUT, certificados de controle e aplicação em tempo de execução. A Seção I.3 define os objetos, as plantas, o modelo analítico de energia, o instrumento de navegador e as placas. A Seção I.4 relata apenas quantidades produzidas pela referência de software, pelas placas ou por uma fonte externa citada. A Seção I.5 responde a objeções que têm forma publicada. A Seção I.6 indica o que falsificaria as alegações e o que não foi medido.

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>
<div id="i1-introduction" class="anchor-alias" aria-hidden="true"></div>

## I.1. Introdução

Um modelo de linguagem pode classificar ações. Classificação não é permissão. O modo de falha que importa para uma planta, um invólucro, um pagamento ou um passo laboratorial destrutivo é um commit: a ação é executada. Pontuações suaves permanecem úteis a montante. Elas são do tipo errado no ramo irreversível, porque uma probabilidade não nomeia qual predicado falhou, e não força o comando do atuador a zero.

Lee (2022) declara uma alegação anterior de forma clara. Notação não é decoração. Uma notação que torna uma operação executável altera quais erros podem ser anotados e quais podem ser ocultados. Iverson (1980) fez o mesmo ponto para linguagens de arrays: notação é uma ferramenta de pensamento. Engelbart (1962) tratou linguagem, artefatos, métodos e treinamento como um único sistema. Kay (1972) e Victor (2013; 2012 talk) argumentaram que representações devem manter as consequências próximas da ideia que está sendo editada. Matuschak e Nielsen perguntaram por que ferramentas para o pensamento estagnam como produtos. Essa literatura trata de cognição e mídia. Ela não especifica, por si só, um registro que uma máquina deve obedecer antes de se mover.

O centro industrial da inteligência artificial recente é escala. Kaplan et al. (2020) e Hoffmann et al. (2022) relatam escalonamento de perda com parâmetros, dados e computação. Hooker (2021) argumenta que ideias se espalham quando se ajustam ao hardware e aos kernels disponíveis. Esses resultados descrevem como a capacidade de um proponente cresce com os recursos investidos nele. Eles não definem um predicado de commit.

A contribuição deste artigo é uma referência de software para esse predicado, mais um relatório do que a referência realmente faz em plantas de brinquedo. A contribuição é composicional. Escudos LUT booleanos, certificados de energia, busca ternária em tabela e transportes de ferramenta já existem em trabalhos anteriores. A referência os conecta como uma única decisão auditável: proposta, depois certificado, depois recusa tipada ou commit. A alegação é a existência e o comportamento desta referência, não a prioridade.

Três declarações de medição restringem todo número posterior. Primeiro, joules calculados pelo OpCounter são estimativas analíticas. Segundo, resultados em Verilog são simulação. Terceiro, os únicos joules da placa são as diferenças ao nível da placa KV260 da Seção I.3.7, arquivadas como `measured_j` com o medidor nomeado. O sinalizador de resultado da placa é verdadeiro apenas para essas execuções KV260. O Pt V2 permanece não medido. Um leitor deve ser capaz de distinguir modelado, simulado e medido em placa a partir da cláusula de método anexada ao número.

Figura 1 ilustra o portão de commit.

![Flow diagram: propose, then certify against the predicate and certificate, then either commit an act on the world or refuse with no act. Both outcomes write a receipt with a hash, joules and a reason.](/figures/gates/commit-gate.svg)

*Figura 1. O portão de commit. Diagrama de propor, certificar, commitar ou recusar, e recibo, conforme definido na Seção I.3. Uma [PNG copy](/figures/gates/commit-gate.png) é fornecida.*

<div id="i2-related-work" class="anchor-alias" aria-hidden="true"></div>

## I.2. Trabalhos relacionados

<div id="21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>
<div id="i21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>

### I.2.1 Notação e ferramentas de raciocínio

Lee (2022) argumenta que inventar notações pode ser mais importante do que inventar ferramentas automatizadas adicionais, porque uma notação altera os pensamentos que são baratos. O registro da entrevista com The Gradient é consistente com esse ensaio e não constitui um resultado empírico independente. Iverson (1980), palestra do Prêmio Turing, é a declaração clássica da ciência da computação: notação é uma ferramenta de pensamento, e executabilidade faz parte do teste. Engelbart (1962) localiza a inteligência em um sistema humano mais artefato, não em um cérebro nu. Kay (1972) especifica um meio dinâmico pessoal. “Media for Thinking the Unthinkable” e “Inventing on Principle”, de Victor, defendem que criadores precisam de representações cujas consequências sejam visíveis enquanto a ideia ainda está sendo formada. Matuschak e Nielsen, “How can we develop transformative tools for thought?”, documentam a adoção e os modos de falha institucional de tais ferramentas.

Este artigo utiliza essa linhagem para uma inferência limitada. Se uma notação é executável, algumas falhas tornam‑se dados ordinários em vez de acidentes não representados. Uma razão de recusa tipada é um exemplo. Não sustenta a forte alegação Sapir‑Whorf de que a linguagem determina o pensamento. A alegação forte é rejeitada na Seção I.5. A alegação fraca, que é a de Iverson, é que uma notação executável altera o custo das operações e a representabilidade dos erros.

Chollet (2019) define inteligência como eficiência na aquisição de habilidades e fundamenta a definição na teoria da informação algorítmica. Essa definição trata da aprendizagem de novas habilidades, não de commit.

<div id="22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>
<div id="i22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### I.2.2 Informação, comprimento de descrição e custo físico

Shannon (1948) define entropia e capacidade de canal. Shannon (1959) define taxa‑distorsão: quanta descrição é necessária para uma fidelidade declarada. Kolmogorov (1965) define comprimento de descrição pelo tamanho do programa. Solomonoff (1964) define inferência indutiva por uma mistura sobre programas. Chaitin (1977) desenvolve a complexidade por tamanho de programa. Cover e Thomas (2006) constituem a espinha dorsal do livro‑texto. Jaynes (1957) usa entropia máxima como regra para distribuições sob restrições. Brillouin (1956) conecta informação à negação física da entropia na linha do demônio de Maxwell.

O treinamento por entropia cruzada de um modelo de linguagem é um objetivo informativo‑teórico sobre uma distribuição de dados. A palestra de Sutskever em 2023 no Simons Institute, que é uma palestra e não um artigo, discute aprendizado não supervisionado como compressão. Esse fato não fornece um certificado de Kolmogorov para uma cadeia específica, e não gera um bit de commit. A compressão estatística de uma distribuição de treinamento não é o mesmo objeto que um conjunto de permissões em tempo de execução sob uma restrição de planta.

Landauer (1961) prova um limite inferior: a exclusão logicamente irreversível dissipa ao menos `kT ln 2` por bit no modelo ideal. Bennett (1973) mostra que a computação logicamente reversível pode evitar esse custo de exclusão no limite. Horowitz (2014) relata energia prática de CMOS em escalas de picojoules para operações e movimentação de memória, muito acima do limite de Landauer, e trata energia ao invés da contagem de transistores como a restrição. Mead (1990) apresenta o argumento neuromórfico para eficiência analógica. Sandberg (2016) alerta que um consumo cerebral próximo a 20 watts não limita a energia de um sistema engenheirado treinado do zero. Um preprint de particionamento cortical (arXiv:2102.06273) alerta ainda contra tratar toda essa potência biológica como computação comparável. Este artigo usa Landauer e Horowitz como limites e tabelas práticas. Não afirma que qualquer modelo na referência opere próximo a `kT ln 2`.

<div id="23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-and-hardware-fit" class="anchor-alias" aria-hidden="true"></div>

### I.2.3 Escala e adequação ao hardware

Hestness et al. (2017), Kaplan et al. (2020) e Hoffmann et al. (2022) documentam a escalabilidade empírica da perda em aprendizado profundo. Amodei e Hernandez (2018), um post no blog da OpenAI, descrevem o rápido crescimento do cálculo de treinamento para resultados marcantes. A página é um ensaio de fornecedor. Este artigo não depende de um tempo de duplicação específico a partir dele. Sutton (2019) argumenta que métodos gerais que utilizam computação superaram sistemas que codificam o conteúdo do conhecimento humano como características fixas. O ensaio não é um argumento contra toda restrição. Um predicado de commit é uma restrição à ação, não uma característica de xadrez construída manualmente. Hooker (2021) explica por que alternativas perdem quando a base instalada de chips e bibliotecas recompensa a multiplicação densa de matrizes.

Este artigo classifica por joules para conclusão correta e separa o custo da proposta da permissão. Um preço não é um termo em nenhum dos dois.

<div id="24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>
<div id="i24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>

### I.2.4 Redes `LUT6`, consulta ternária e lógica diferenciável

Umuroglu et al. (2020) mapeiam redes esparsas de baixa precisão para tabelas de verdade em FPGA (LogicNets). Petersen et al. (2022) treinam redes de portas lógicas com relaxamentos diferenciáveis (DiffLogic). Bacellar et al. (2024) treinam redes sem peso de LUTs (redes neurais sem peso diferenciáveis). Ma et al. (2024) estudam modelos de linguagem de peso ternário (BitNet b1.58). Wei et al. (2024) implementam multiplicação de matriz de baixa precisão por busca em tabela em CPUs (T-MAC). A linha TeLLMe (arXiv:2504.16266) é um projeto de multiplicação de matriz ternária por LUT voltado para execução em FPGA. Esses sistemas demonstram que tabelas e portas são um substrato computacional real. Eles não, nos artigos citados, anexam um veto de energia port-Hamiltoniano e um envelope de commit tipado a um executor de ferramenta.

A referência usa DiffLogic como uma tabela de permissão fina em recursos toy, e TLMM como um caminho de proposta. Esse é um trabalho diferente de usar uma rede lógica como o classificador completo, que é a avaliação usual do DiffLogic (benchmarks de visão, contagens de portas elevadas). A Seção I.6 registra a lacuna de capacidade.

<div id="25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>
<div id="i25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>

### I.2.5 Certificados, escudos e monitoramento em tempo de execução

Ames et al. (2019) pesquisam funções barreira de controle como certificados de invariância de conjunto, tipicamente impostas por um filtro ou um programa quadrático. Alshiekh et al. (2018 preprint arXiv:1708.08611) introduzem escudos que substituem ações inseguras por ações seguras, minimamente quando possível. Dawson, Gao e Fan (2022) revisam certificados de Lyapunov e barreira aprendidos e os modos de falha de tratar uma rede neural como um certificado sem verificação. Manek e Kolter (2020) aprendem dinâmicas estáveis com uma estrutura de Lyapunov. Greydanus, Dzamba e Yosinski (2019) aprendem redes neurais Hamiltonianas. Roth et al. (2025) estudam redes neurais port-Hamiltonianas estáveis. Yu, Zikelic e Henzinger (2024) reparam certificados neurais usando monitores de tempo de execução. Leung e Paré (arXiv:2512.24493) fornecem garantias de segurança bayesiana para sistemas port-Hamiltonianos com funções de energia aprendidas. Sua energia é o Hamiltoniano físico da planta. Não é a energia da computação. O caminho Seguro desta referência usa energia nesse mesmo sentido físico. Os joules da computação são uma conta separada (Seção I.3.4). Sanchez et al. (2018) revisam taxonomias de verificação em tempo de execução.

**O portão é um Simplex.** A arquitetura Simplex de Sha executa um controlador de alto desempenho não verificado ao lado de um controlador de segurança verificado, e um módulo de decisão entrega o controle ao controlador de segurança antes que a planta deixe a região da qual pode se recuperar (Sha 2001). “Uma proposta pode não se autorizar” é essa regra, transferida de loops de controle para chamadas de ferramentas e atuadores. Garantia em tempo de execução é seu nome em aviação e robótica. Três resultados mais antigos fixam o restante da forma. Saltzer e Schroeder nomearam mediação completa: todo acesso é verificado contra autoridade, a cada vez (1975). Um monitor de referência é o mecanismo que faz a verificação. O commit em duas fases de Gray separa preparação de confirmação, de modo que nenhum participante confirma sozinho (1978). O código carregado de prova de Necula envia uma prova que o host verifica antes que o código não confiável seja executado (1997). O registro de commit aqui é um monitor de referência à frente de efeitos irreversíveis, com um interruptor Simplex para recusa e um certificado que o host verifica, como no código carregado de prova. O que a referência acrescenta a essa linhagem é um conjunto e um livro‑razão: um predicado de energia dentro do certificado, e joules no mesmo registro da decisão.

A referência não substitui essa matemática. O caminho Seguro é um teste conservador de ponto fixo de uma identidade de energia conhecida em um pêndulo, `V = (1/2)(g theta^2 + omega^2)` com `Vdot = omega * u`. O CBF usado no concurso‑toy é uma desigualdade de conjunto de energia sobre o mesmo `V`, não uma alegação de ter resolvido o programa quadrático de Ames em um manipulador. Estrutura de Lyapunov aprendida em um carrinho‑pólo é um segundo toy, relatado na Seção I.4, e não um teorema de região de atração para plantas arbitrárias.

<div id="26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>
<div id="i26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>

### I.2.6 Modelos de mundo, decisões tipadas e transporte de ferramentas

Ha e Schmidhuber (2018) e Hafner et al. (DreamerV3, arXiv:2301.04104) mostram que modelos aprendidos podem propor ações a partir de trajetórias imaginadas. Os ensaios JEPA de LeCun (Meta research blog) defendem modelos de mundo preditivos. LeCun et al. (2006) é o tutorial anterior sobre aprendizado baseado em energia. O erro de predição não é identicamente zero nesses sistemas. Um preditor pode ficar a montante de um portão. Ele não pode substituir o portão a menos que suas predições sejam perfeitas e o modelo da planta seja a planta. Este artigo não compete com esses sistemas em benchmarks de predição.

Os modelos System One retornam uma resposta tipada e uma probabilidade para cada opção permitida em uma única passagem forward, sem texto livre. TypeSafe AI nomeou a categoria com seu modelo Jev hospedado (15 de setembro de 2026). Modelos abertos seguiram, entre eles Laya da Convai Innovations, um codificador com cabeças de decisão. Eles reduzem o custo de geração quando o conjunto de opções é tipado e conhecido. O anúncio do Protocollo de Contexto de Modelo da Anthropic especifica descoberta e transporte para ferramentas. O transporte entrega uma chamada. Ele não avalia `Vdot`. No adaptador MCP da referência, ferramentas irreversíveis exigem um certificado antes que o executor seja executado. Essa é uma alegação de engenharia sobre esse adaptador, testada pela demonstração na Seção I.4, não uma alegação sobre todo servidor MCP em produção.

<div id="27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>
<div id="i27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>

### I.2.7 O que a composição acrescenta

Escudos recusam ações inseguras, mas não são, nos artigos citados, exportados como o registro de commit de quatro campos da referência com uma conta analítica de joules. DiffLogic e redes LUT calculam funções. Eles não são, nesses artigos, um veto na frente de um proponente separado e de um executor de ferramenta. Filtros de barreira conscientes de energia são contínuos. O bit de permissão da referência é uma tabela. A alegação composicional é a fiação: permissão LUT e predicado de energia e barreira opcional, registrados com uma razão tipada, aplicados antes de um efeito irreversível, com energia analítica mantida distinta da energia da placa. A Seção I.4 indica quais partes dessa fiação foram executadas.

<div id="28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-2025-to-2026" class="anchor-alias" aria-hidden="true"></div>

### I.2.8 Pares de certificação e comprometimento (2025 a 2026)

Vários sistemas recentes impõem uma decisão antes que uma ferramenta irreversível seja executada.

Shi et al., **Progent** (arXiv:[2504.11703](https://arxiv.org/abs/2504.11703)), verificam cada chamada de ferramenta contra regras simbólicas de menor privilégio e utilizam um resolvedor SMT de modo que o privilégio só possa ser reduzido sem aprovação (confinamento monotônico). Chen, Kang e Li, **ShieldAgent** (ICML 2025; [proceedings.mlr.press/v267/chen25ae.html](https://proceedings.mlr.press/v267/chen25ae.html)), impõem circuitos de política de segurança verificáveis sobre trajetórias de ação do agente antes do escudo. Yu, Žikelić e Henzinger (AAAI 2025; [doi:10.1609/aaai.v39i25.34840](https://doi.org/10.1609/aaai.v39i25.34840)) reparam certificados neurais via monitoramento em tempo de execução. Uma linha paralela verifica certificados de barreira de controle ReLU online sobre uma região de antecipação (arXiv:[2507.11987](https://arxiv.org/abs/2507.11987)).

**O que a Parte I acrescenta.** Esses pares são objetos de política, escudo ou reparo de certificado. Esta referência entrega um envelope de commit de quatro campos (`proposal` → `certificate` → `commit|refuse` → receipt) com um bit de permissão LUT conjuntivo e um predicado de energia, razões de recusa tipificadas e joules analíticos mantidos distintos da potência da placa. O transporte (MCP) permanece como proposta. Joules da placa existem apenas para as execuções KV260 na Seção I.3.7, ao nível da placa.

<div id="i29-runtime-enforcement" class="anchor-alias" aria-hidden="true"></div>

### I.2.9 Aplicação em tempo de execução

O portão é um autômato de segurança. Schneider demonstrou que monitores de execução impõem exatamente as propriedades de segurança [Schneider 2000](https://doi.org/10.1145/353323.353382), e Ligatti, Bauer e Walker ampliaram o monitor para autômatos de edição que suprimem ou inserem ações [Ligatti et al. 2005](https://doi.org/10.1007/s10207-004-0046-8). Falcone definiu quando impor em vez de verificar [Falcone 2010](https://doi.org/10.1007/978-3-642-16612-9_9), e Bauer, Leucker e Schallhart forneceram veredictos em tempo de execução com três valores [Bauer et al. 2011](https://doi.org/10.1145/2000799.2000800), que correspondem a permitir, recusar e `settle_refuse`. O que este artigo acrescenta a essa linha é o predicado de energia no certificado e o recibo. Guardas de agente de 2024 a 2026 têm a mesma forma, uma verificação entre uma chamada de ferramenta proposta e seu efeito: GuardAgent [arXiv:2406.09187](https://arxiv.org/abs/2406.09187) e AgentSpec [arXiv:2503.18666](https://arxiv.org/abs/2503.18666). PolicyGuide argumenta que uma verificação em cada ação não pode direcionar um fluxo de trabalho de múltiplas etapas [arXiv:2608.19861](https://arxiv.org/abs/2608.19861); por isso a Parte II coloca a parada no predicado da tarefa $C(z)$ em vez de no ato único. Trabalho irreversível de múltiplas etapas também requer compensação, que sagas fornecem [Garcia-Molina and Salem 1987](https://doi.org/10.1145/38713.38742), e “uma proposta pode não se autorizar” é o princípio do monitor de referência que kernels de capacidade como seL4 impõem por prova [Klein et al. 2009](https://doi.org/10.1145/1629575.1629596). A varredura 0-false-allow da Seção I.4 é um teste sobre uma grade, não uma prova; a Seção I.6 declara esse limite, e ele se aplica a todo resumo do resultado.

<div id="i210-reference-points-for-the-board-figure" class="anchor-alias" aria-hidden="true"></div>

### I.2.10 Pontos de referência para a figura da placa

Espera‑se que uma implementação em FPGA de uma função consuma mais energia do que um ASIC; Kuon e Rose mediram a diferença de potência dinâmica [Kuon and Rose 2007](https://doi.org/10.1109/TCAD.2006.884574), e Horowitz fornece a energia CMOS por operação que enquadra tais valores [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323). Uma estimativa de potência do fornecedor para o mesmo bitstream, ao lado da leitura SOM, faz parte do protocolo PL-rail.

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>
<div id="i3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## I.3. Definições e métodos

<div id="31-objects" class="anchor-alias" aria-hidden="true"></div>
<div id="i31-objects" class="anchor-alias" aria-hidden="true"></div>

### I.3.1 Objetos

Fixe um estado `x` e uma ação candidata `u` em um conjunto `U`. Uma proposta é uma tupla

```text
Proposal = (u, x, hints)
```

`hints` pode incluir quantidades analíticas de energia. Uma proposta não tem interpretação como permissão.

Um certificado é uma tupla

```text
Certificate = (lut_allow, energy_ok, cbf_ok, reasons, metrics)
```

`lut_allow` e `energy_ok` são Booleanos. `cbf_ok` é um Booleano quando o modo de composição selecionado o requer, e está ausente caso contrário. `reasons` é uma lista de motivos de recusa. `metrics` inclui a conta analítica de energia e a bandeira de resultado do quadro.

Os modos de composição no README do esquema são:

```text
lut_and_energy        : commit <=> lut_allow AND energy_ok
lut_and_safe          : commit <=> lut_allow AND safe_energy_ok
lut_and_safe_and_cbf  : commit <=> lut_allow AND safe_energy_ok AND cbf_ok
```

Ablations `energy_only` e `lut_only` existem para que uma comparação possa remover um conjuntivo. Elas não são o padrão para ferramentas irreversíveis.

Uma decisão de commit é

```text
if commit then plant_action = u else plant_action = 0
```

com o certificado anexado. O executor para uma ferramenta irreversível é chamado apenas no primeiro ramo.

Registro trabalhado. O arquivo `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` armazena uma recusa na qual `lut_allow` é true e `energy_ok` é false. O código do motivo é `energy_veto`. A string de detalhe do ponto fixo é `Vdot_q=1461 > eps_q=13`. `plant_action` é `[0.0]`. O registro define a bandeira de resultado do quadro como false. Um conjuntivo verdadeiro não efetua commit.

<div id="32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>
<div id="i32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>

### I.3.2 Plantas e oráculos

A planta principal é um pêndulo. As quantidades de referência contínuas usadas pela verificação Safe são `g = 9.81`, `epsilon = 0.05`, `V = (1/2)(g theta^2 + omega^2)`, e `Vdot = omega * u`. `energy_ok` no oráculo contínuo significa `Vdot <= epsilon`.

A verificação discreta legada é uma aproximação em ponto fixo Q8.8, combinada bit a bit com o módulo Verilog `wca_ph_energy.v` na simulação. A verificação Safe (`SafeFixedPointPHCertificate`) usa Q16.16 e um resíduo inteiro exato. O predicado relatado é

```text
energy_ok <=> 4*omega_q*u_q + 2*(abs(omega_q)+abs(u_q)) + 1
              <= floor(4*epsilon*S^2)
```

com o argumento de arredondamento apresentado em `artifacts/RESULTS.md`: sob arredondamento para o mais próximo com erro de no máximo metade do bit menos significativo, `Vdot` está limitado por `(prod + (1/2) abs + 1/4) / S^2`. O objetivo de projeto é unilateral. Se o predicado Safe permite, o oráculo contínuo permite. O recíproco não é exigido. Recusas extras são um custo medido, não uma contradição da direção de segurança.

Uma segunda planta, carrinho‑pólo, é usada apenas na simulação aprendida‑Lyapunov. O estado é `[x, xdot, theta, thetadot]`, com `g = 9.81`, massa do carrinho 1.0, massa do pólo 0.1, comprimento 0.5. `V` é uma forma quadrática `xi^T P xi / 2` com `P` definido positivo por uma construção de Cholesky mais um múltiplo da identidade. O ajuste é gradiente estocástico sobre uma margem de `Vdot + alpha V` sob uma política linear, semente 42, 400 iterações, lote 32, `alpha = 0.15`, conforme registrado em `RESULTS.md`. O portão contínuo é `Vdot <= 0.05`. A regra discreta Safe adiciona uma margem de Lipschitz vezes metade do bit menos significativo. Esta é uma simulação de um quadrático ajustado em uma caixa. Não constitui prova para outras plantas.

<div id="33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>
<div id="i33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>

### I.3.3 Caminho de permissão e proposta via `LUT6`

O LUT permitido nos episódios relatados é uma exportação DiffLogic com máscara `21887` em quatro características: theta absoluto, omega absoluto, `u` absoluto e um bit de energia, salvo se uma seção indicar o contrário. TLMM é uma tabela ternária agrupada usada como proponente. Iso-correção significa concordância com um produto matricial ternário ingênuo dentro de tolerância absoluta de 1e-12, que `RESULTS.md` registra como medido em software. O comportamento de escala é o que `wca-tlmm-scale` grava sob um orçamento analítico avançado declarado. O orçamento padrão discutido nos resultados é 2e-10 joule por avanço, analítico, não elétrico.

<div id="34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>
<div id="i34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>

### I.3.4 Modelo analítico de energia

`RESULTS.md` separa dois fatos. As contagens de operações são exatas no OpCounter. Joules são as contagens multiplicadas por constantes:

| Constante | Valor (joule) | Função |
|----------|----------------|------|
| `E_LUT_READ` | 1e-12 | leitura de LUT |
| `E_BRAM_WORD` | 1e-11 | palavra de BRAM |
| `E_BITMASK_OP` | 5e-14 | operação de máscara de bits |
| `E_ADD` | 5e-13 | adição |
| `E_PACK` | 2e-13 | empacotamento |
| `E_COMMIT_BASE` | 2e-11 | sobrecarga de commit |
| `E_REFUSE_OVERHEAD` | 5e-12 | sobrecarga de recusa |

`J = sum count_op * E_op`. Essas constantes são substitutos de engenharia, não medições. Contadores de estrutura, como acertos de BRAM compartilhado, são relatados e não são cobrados a menos que alterem uma leitura contabilizada. Alterar uma constante redimensiona cada joule analítico em conjunto. Esse é o motivo pelo qual os números não podem ser comparados aos tokens por joule de um fornecedor, à energia do MLPerf Tiny ou a uma medição de trilho. Eles podem ser comparados entre modos dentro do mesmo modelo.

A utilidade nas tabelas internas é a contagem de commits. A contagem de commits não é uma recompensa de tarefa. Uma política que efetua mais commits pode obter maior utilidade por joule violando o oráculo de energia. A Seção I.4, portanto, não trata a utilidade por joule como métrica de segurança.

<div id="35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>
<div id="i35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>

### I.3.5 Adaptador de ferramenta

`wca-mcp-gate` classifica ferramentas. Ferramentas somente leitura podem ser executadas sem um registro de commit. Ferramentas desconhecidas são tratadas como irreversíveis. Ferramentas irreversíveis requerem um certificado sob o modo compose configurado, padrão `lut_and_safe_and_cbf` em `artifacts/mcp_gate_demo.json`. Ao recusar, `executed` é false e `executor_calls` é 0. O executor de demonstração registra chamadas e não realiza entrada ou saída do host. A string do método no arquivo de demonstração é `rust_mcp_commit_gate_v1`.

<div id="36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>
<div id="i36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>

### I.3.6 Simulação de Verilog

O repositório gera Verilog e imagens de memória para a LUT de permissão e o portão de commit (`artifacts/fpga/`). `wca-rtl-verify` e Icarus Verilog verificam o comportamento bit a bit desses modelos contra o oráculo de software. Icarus executa uma simulação. Ele não realiza place, route ou medição de um chip. Vivado relata entradas apenas para as execuções KV260 da Seção I.3.7, como utilização e fechamento de temporização. As estimativas de energia do Vivado não são resultados.

<div id="37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>
<div id="i37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>

### I.3.7 Instrumento de navegador e placas

O caminho de completude para replicação tem três estágios. Os estágios A e B existem. O estágio C tem duas placas: uma para acordo de decisão e outra para joules.

Estágio A, presente. Binaries Rust em `wca-commit` executam o episódio, a verificação Safe, a demonstração da ferramenta e a conta analítica de joules. Icarus simula Verilog emitido em uma estação de trabalho.

Estágio B, enviado. O núcleo puro de decisão (proposta entra, certificado sai, passo da planta, atualização analítica de joules) compila para `wasm32` (`crates/wca-fpga-sim`). Uma página estática em https://research.openie.dev/living/fpga-sim/ carrega o módulo. WebGPU mantém as palavras LUT e um buffer de rastreamento de `(step, lut_allow, energy_ok, cbf_ok, decision)` para exibição. Os timestamps do WebGPU não são joules. No seed-1 (16 passos, theta 1.5, omega 3.0) o episódio WASM relata 1 comprometido, 15 recusados, joule analítico 8.6795e-10, correspondendo ao Estágio A. O módulo WASM é uma emulação das mesmas funções que o crate Rust executa. Não é um modelo ciclo‑preciso de um Artix-7, nem um modelo de potência por atividade de comutação, e não substitui o Icarus no Verilog. O Estágio B não reivindica um DUT Alchitry Pt V2.

Estágio C, placa programada, energia não medida. Um Alchitry Pt V2 foi detectado e carregado (SRAM) com um bitstream de commit‑gate WCA em loop fechado: dinâmica da planta pendular seed-1 no tecido, proposta TLMM, LUT permitida, resíduo port‑Hamiltoniano Safe Q16.16, e resíduo de função barreira de controle estilo Ames (CBF). O commit no tecido é `lut_allow ∧ energy_ok ∧ cbf_ok`. UART a 115200 8N1 concordou com o ouro composto de software em permitir/recusar/commit (1 commit, 15 recusas, único commit no passo 6). Nesse episódio seed-1 em loop fechado o conjuntivo CBF não alterou o rastreamento de permitir/recusar em relação ao LUT e ao PH Safe sozinho (o único commit PH tem u=0, portanto a verificação de Lie do CBF se mantém). **Loop fechado** aqui significa que o estado da planta evolui a partir dos commits e recusas de gate no tecido; não é um ROM de estímulo transmitido de estado da planta/proposta. O Pt V2 **não possui medidor de joules embarcado**. Nenhum medidor USB inline ou shunt foi conectado. Estimativas de potência Vivado / pós‑PAR não são leituras do DUT. A página de produto da SparkFun nomeia o FPGA XC7A100T-2FGG84I e lista 101.440 células lógicas, 240 fatias DSP48E1, 4.860 Kb de RAM de bloco e 256 MB de DDR3L (https://www.sparkfun.com/alchitry-pt-v2.html); esses permanecem especificações do fornecedor. Métodos de medição do construtor: [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy).

Etapa C, placa metrificada. Um AMD Kria KV260 possui um monitor de energia INA260 integrado (`ina260_u14`). Três execuções foram realizadas em 30 de setembro de 2026, cada uma como passes intercalados A/B/A com N = 4, estabilização de 15 s e amostragem de 25 s a aproximadamente 4 Hz. A execução 1 compara um tecido de semente de execução livre (439 LUTs) com o bitstream de referência da placa. Ela fornece apenas watts, sem contagem de operações, portanto não fornece joules por operação. A execução 2 interrompe e executa um bitstream de semente (975 LUTs) a cerca de 100 MHz sob um contador de operações no dispositivo. A diferença é de +0.0098 W (erro padrão 0.0031 W), o que corresponde a 98.0 pJ por ciclo de semente (erro padrão 30.8 pJ). A execução 3 interrompe e executa o bitstream de porta: oito vias, cada uma a conjunção do LUT de permissão, do resíduo de energia Safe Q16.16 e do resíduo de barreira, em 6.370 LUTs e 128 fatias DSP, temporização fechada em 25 MHz. A diferença é de +0.2857 W (erro padrão 0.0032 W). A 2.4999 × 10⁷ ciclos de porta por segundo isso equivale a 11.428 pJ por ciclo de porta (erro padrão 129 pJ), cerca de 1.43 nJ por decisão de via. O desvio A2 menos A1 foi de +0.0047 W (erro padrão 0.0040 W). Os hashes e logs do bitstream estão no artefato `wca-kv260-meter` da referência.

O que o medidor pode e não pode ver. O INA260 especifica um deslocamento máximo de 5 mA e um erro máximo de ganho do sistema de 0.15 %, com um passo de corrente de 1.25 mA (folha de dados TI INA260). O deslocamento é comum a A e B na mesma placa e trilho, de modo que a diferença entre parada e execução o cancela. O erro de ganho escala a diferença em no máximo 0.15 %. O medidor detecta a energia da placa, portanto a diferença inclui a árvore de relógio e o roteamento comutados pela habilitação, não apenas a lógica de porta. A diferença da execução 2 está cerca de três erros padrão de zero. A da execução 3 está cerca de noventa. O próximo protocolo está fixo: ler a trilha central (VCCINT) através da telemetria do regulador do módulo ou de uma unidade de fonte-medida; ao menos 30 pares intercalados A/B aleatórios; ao menos 10⁹ avaliações de porta por bloco; temperatura do die registrada com uma linha de base ociosa antes de cada bloco; valores brutos e subtraídos ambos relatados; a estimativa de energia do Vivado relatada ao lado da leitura com a discrepância. A execução 3 não é um custo de joule de planta em malha fechada, e as constantes analíticas da Seção I.3.4 não são calibradas por ela.

A razão científica para a etapa B é replicação e inspeção, não uma nova alegação física. Um leitor com um navegador executa o mesmo episódio semente‑1 e lê o mesmo bit de permissão e códigos de razão que o crate imprime. O acordo com a etapa A é o teste de aceitação para a etapa B, e ele passa na semente 1. O acordo de decisões é o teste de aceitação para o Pt V2, e ele passa na semente 1. Uma leitura de medidor em uma carga de trabalho declarada é o teste de aceitação para o KV260, e as execuções 2 e 3 atendem a ele ao nível da placa.

<div id="38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>
<div id="i38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>

### I.3.8 O que não é um método deste artigo

Nenhum estudo com sujeitos humanos. Nenhuma alegação sobre relatividade linguística além da rejeição na Seção I.5. Nenhuma extrapolação de treinamento-computação. Nenhuma identificação de saciação econômica. Nenhuma otimização contra taxa de transferência Groq, Etched ou Taalas. Nenhum benchmark de modelo mundial.

<div id="4-results" class="anchor-alias" aria-hidden="true"></div>
<div id="i4-results" class="anchor-alias" aria-hidden="true"></div>

## I.4. Resultados

Todas as quantidades nesta seção são simuladas no software de referência, salvo quando uma frase cita um artigo externo. Joules analíticos utilizam a Seção I.3.4. Apenas NI-9 é medido na placa.

<div id="41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>
<div id="i41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>

### I.4.1 Afirmação NI-1. O registro de comprometimento existe como esquema e tipo Rust

Os esquemas `Proposal`, `Certificate`, `RefuseReason` e `CommitDecision` estão em `artifacts/schemas/wca.commit.v1/`. Os tipos Rust estão em `crates/wca-commit/src/schema.rs`. Os testes de ida e volta são `cargo test -p wca-commit`. Este é um resultado de existência sobre a referência, versão `wca.commit.v1`. Não se trata de um teorema de unicidade.

<div id="42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>
<div id="i42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>

### I.4.2 Afirmação NI-2. Episódio de pêndulo Seed-1

Comando, de `RESULTS.md`:

```text
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Resultado relatado: committed = 1, refused = 15, analytical episode energy = 8.6795e-10 joule. Os mesmos valores de committed e refused e a mesma energia analítica são relatados para `--safe-ph` nessa semente. `RESULTS.md` indica que o único commit corresponde ao passo 6. Nota da cadeia de ferramentas nesse arquivo: Rust 1.98. Reexecutar o binário é a reprodução. A energia não é uma medição de um chip.

<div id="43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>
<div id="i43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>

### I.4.3 Afirmação NI-3. Permissões falsas da verificação de energia segura

`wca-ph-tighten` compara decisões discretas ao oráculo contínuo `Vdot <= epsilon`. Em uma grade 21³ mais 200 000 amostras Monte Carlo próximas ao limiar (209 261 decisões):

| Caminho | Permissão falsa | Recusa falsa | Ambas permitem | Ambas recusam |
|------|-------------|--------------|------------|-------------|
| Legado Q8.8 | 30836 | 105 | 104711 | 73609 |
| Seguro v1 (sobrestimativa Q8.8) | 0 | 42430 | 62386 | 104445 |
| Seguro v2 (resíduo Q16.16) | 0 | 79 | 104737 | 104445 |

`RESULTS.md` também indica que uma grade mais densa 41³ mais 50 000 amostras Monte Carlo, verificada em `cargo test`, afirma permissão falsa igual a 0. Seguro v2 reduz recusas falsas de 42 430 para 79 em relação ao Seguro v1 enquanto mantém permissões falsas em 0. O legado Q8.8 não é seguro sob esta definição: registra 30 836 permissões falsas. Essas contagens são propriedades do teste numérico, não de um pêndulo físico.

<div id="44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>
<div id="i44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>

### I.4.4 Afirmação NI-4. Comparação de barreira simplificada, nenhuma definição domina

`wca-cbf-bakeoff` executa sementes de 0 a 4, 40 passos, passo de tempo 0.05, escala de ação 2.5, demonstração compartilhada TLMM e máscara DiffLogic `21887`. A barreira do conjunto de energia usa `h = 18 - V` e permite quando `h >= 0` e `omega * u <= kappa * h` com `kappa = 0.05`. O escudo discreto permite um passo que permanece dentro de theta absoluto no máximo 2 e omega absoluto no máximo 4. Laço fechado difere porque as trajetórias divergem. O arquivo relata médias por episódio para compromissos e somas para contagens de violações. Linhas selecionadas:

| Filtro | Compromisso | Recusa | J Analítico | Falso permitir vs PH | `h < 0` | `Vdot > epsilon` |
|--------|-------------|--------|--------------|----------------------|---------|-------------------|
| `lut_and_safe_ph` | 1 | 38 | 2.153e-09 | 0 | 4 | 0 |
| `cbf_energy_set` | 1 | 38 | 2.056e-09 | 3 | 0 | 3 |
| `shield_discrete` | 18 | 21 | 2.306e-09 | 90 | 38 | 90 |
| `lut_only` | 40 | 0 | 2.544e-09 | 194 | 220 | 194 |

Neste planta e neste oráculo, `lut_and_safe_ph` tem zero violações de `Vdot` e quatro eventos `h < 0`. A barreira do conjunto de energia tem zero eventos `h < 0` e três violações de `Vdot`. O escudo compromete mais e viola o oráculo de energia frequentemente. `lut_only` corresponde a `always_allow` nas violações na tabela relatada. A concordância offline em um fluxo sempre‑permitir compartilhado de 200 passos gera 4 discordâncias entre `lut_and_safe_ph` e `cbf_energy_set`, e 70 contra o escudo.

Interpretação dentro do teste: passividade e invariância de conjunto são predicados diferentes. O portão LUT‑e‑energia não é equivalente a um filtro Ames, e não vence todas as colunas. Uma linha de base de programa quadrático completo em uma planta mais rica não está nesta tabela. Essa comparação permanece aberta. O resultado disponível é a discordância, que constitui evidência contra a fusão dos dois certificados em uma única palavra.

<div id="45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>
<div id="i45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>

### I.4.5 Afirmação NI-5. Simulação Lyapunov segura do pêndulo invertido sobre trilho

No auditor descrito na Seção I.3.2 (grade n = 7 mais 20 000 amostras de fronteira dentro da caixa de Lipschitz, 26 487 decisões), o Safe aprendeu Lyapunov versus o oráculo contínuo `Vdot` registra falsos permissões 0, falsos recusos 3, ambos permissões 15 925, ambos recusos 10 559. O laço fechado significa, em cinco sementes: `lut_and_safe_lyap` comete 11, recusa 28, J analítico 2.719e-09, e registra zero falsas permissões contra esse oráculo. A barreira de nível‑set no mesmo `V` comete 14 e registra 15 violações do oráculo de energia. O escudo discreto comete 29 e registra 95. Mesmo padrão do pêndulo: o conjuntivo Safe acompanha seu próprio oráculo; um certificado diferente acompanha outro; permissividade sem o oráculo não é segurança.

Este é mais um planta simulada adicional. Não estabelece o portão de compromisso em dinâmicas industriais.

<div id="46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>
<div id="i46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>

### I.4.6 Afirmação NI-6. Demonstração `MCP`

`artifacts/mcp_gate_demo.json` registra quatro casos. O sinalizador board-result no arquivo está false.

| Caso | Classe | Executado | Chamadas ao executor | Commit |
|------|--------|-----------|----------------------|--------|
| `read_only_bypass` | read-only | true | (nenhum registro de commit) | absent |
| `irreversible_refuse` | irreversible | false | 0 | false |
| `irreversible_allow` | irreversible | true | 1 | true |
| `shell_exec_gated` | irreversible | true | (gated) | true |

O caso de recusa lista `energy_veto` (`vdot` 6.0 contra `eps` 0.05) e `cbf_veto`. A ação da planta nesse caso é `[0.0]`. O caso de permissão usa compose `lut_and_safe_and_cbf` e ação da planta `[-0.02]`. A nota no arquivo afirma que a recusa nunca é executada. Esta é uma demonstração do adaptador, não um estudo de campo de agentes de uso de computador.

<div id="47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>
<div id="i47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>

### I.4.7 Afirmação NI-7. `TLMM` sob um orçamento analítico

`RESULTS.md` relata uma demonstração 2 por 4, configuração do grupo 2 próxima a 4,24e-11 joules analíticos, sob o orçamento avançado. As maiores configurações que permanecem dentro do orçamento avançado de 2e-10 param em 64 parâmetros. Larguras 8 por 16 e superiores excedem esse orçamento mesmo após o otimizador. A iso-correção contra aritmética ternária ingênua é uma comparação de software com tolerância 1e-12. Essas afirmações não dizem que o projeto corresponde ao throughput do TeLLMe ou a qualquer energia de placa.

<div id="48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>
<div id="i48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>

### I.4.8 Afirmação NI-8. Permissão DiffLogic versus professor de energia, apenas simplificado

No benchmark de porta multi‑semente rígida em `RESULTS.md`, após calibração de limiar e rótulos mais densos, DiffLogic corresponde ao professor de energia na taxa de recusa 50,0 ± 15,9 por cento, precisão no limiar 0,890 ± 0,067 e revocação 0,802 ± 0,076. Uma referência de máscara de bits recusa mais (71,0 ± 14,9 por cento) e revoga menos (0,454 ± 0,266). Antes da calibração, a taxa de recusa do DiffLogic era 57,5 ± 14,1 por cento com revocação 0,724 ± 0,163. A correspondência ocorre neste arranjo de rotulagem toy. Não se trata de um resultado do ImageNet ou de um conjunto de controle. A utilidade interna por joule aumenta para a porta calibrada (3,570e9 versus 3,212e9 antes) sob o modelo analítico. Como afirma a Seção I.3.4, essa razão usa a contagem de commits como utilidade.

<div id="49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>
<div id="i49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>

### I.4.9 Afirmação NI-9. Joules em nível de placa do tecido de portas

| Degrau | Fabricação | Clock | Diferença (W) | Operação | Joules por operação | Rótulo |
|---|---|---|---|---|---|---|
| 1 | Seed freerun vs board baseline | n/a | −0.8212 (SE 0.0024) | none | none | `measured_j`, watts only |
| 2 | Seed, halt vs run | about 100 MHz | +0.0098 (SE 0.0031) | one seed cycle | 98.0 pJ (SE 30.8) | `measured_j`, INA260, SOM rail (`VCC_SOM`) |
| 3 | Gate, 8 lanes, halt vs run | 25 MHz | +0.2857 (SE 0.0032) | one gate cycle, 8 decisions | 11,428 pJ (SE 129) | `measured_j`, INA260, SOM rail (`VCC_SOM`) |

N = 4 passes intercalados A/B/A por degrau. O sinal negativo no degrau 1 indica que o fluxo de bits da semente consome menos energia que o fluxo de bits de referência da placa. Não significa que a semente seja gratuita. A Seção I.3.7 apresenta os limites de uma leitura ao nível da placa.

<div id="410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>
<div id="i410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>

### I.4.10 Segurança e vivacidade

Zero permissões falsas é segurança. Um portão que recusa tudo também é seguro, e inútil. Vigor é o outro eixo: recusas falsas, e a parcela de tarefas que o agente controlado completa. NI-3 relata ambos na grade Seguro. Safe v2 reduz recusas falsas de 42,430 para 79 com zero permissões falsas. O episódio seed-1 compromete 1 passo de 16, e essa contagem isolada não indica se a planta atingiu seu objetivo. O relatório requerido é uma fronteira por planta: taxa de conclusão de tarefas versus taxa de permissões falsas, um ponto por modo de composição do NI-4 (`lut_only`, `shield_discrete`, `cbf_energy_set`, `lut_and_safe_ph`), cada ponto com suas sementes e dispersão. Nas cargas de trabalho do agente, a mesma fronteira usa um conjunto de ataques para permissões falsas e um conjunto de tarefas benignas para conclusão. Um portão é avaliado na fronteira, não em um único eixo.

<div id="411-what-the-scan-supports" class="anchor-alias" aria-hidden="true"></div>
<div id="i411-what-the-literature-search-supports" class="anchor-alias" aria-hidden="true"></div>

### I.4.11 O que a pesquisa bibliográfica sustenta

Uma busca bibliográfica em setembro de 2026 (Seções I.2.4 a I.2.9) não encontrou nenhum sistema publicado que componha um LUT Booleano aprendido, um predicado de energia port-Hamiltoniano ou de Lyapunov, e uma proposta de LUT ternário como um único limite de commit com simulação RTL bit‑exata e uma conta analítica de joules. Os vizinhos mais próximos são escudos, filtros de barreira conscientes de energia, redes lógicas como modelo completo e projetos TLMM sem um certificado de energia. A busca sustenta uma declaração de lacuna sobre a literatura que foi pesquisada. Não sustenta uma reivindicação de prioridade sobre trabalho não publicado, e não sustenta uma reivindicação de liderança em energia.

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>
<div id="i5-discussion" class="anchor-alias" aria-hidden="true"></div>

## I.5. Discussão

<div id="51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>
<div id="i51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>

### I.5.1 Escala não responde à questão do comprometimento

Kaplan, Hoffmann, Hooker e Sutton descrevem como a perda e a capacidade de proposta escalam. Um proponente maior ainda pode emitir uma ação que falha `Vdot <= epsilon`. Colocar esse proponente atrás do certificado usa escala onde a evidência indica que a escala funciona, e usa o predicado onde a escala está silenciosa. A Bitter Lesson se opõe a características humanas congeladas que bloqueiam a aprendizagem. Isso não implica excluir um predicado de segurança. Se um resultado futuro mostrar que uma política sem restrições atende ao mesmo teste de falso-permissão com menor custo analítico e erro de tarefa igual, a preferência de engenharia do NI-3 pelo portão seria enfraquecida nessa planta. A distinção lógica entre proposta e permissão permaneceria.

<div id="52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>
<div id="i52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>

### I.5.2 Linguagem natural e `MCP` são transporte e proposta

MCP resolve descoberta e forma de chamada. System One resolve algumas decisões sem geração livre. Nenhum objeto é `energy_ok`. A demonstração em NI-6 mostra um recuso que não chama o executor. Uma implantação de produção poderia contornar o adaptador. A alegação não é que o protocolo torne o contorno impossível. A alegação é que a permissão deve ser um registro separado se efeitos irreversíveis devem ser auditáveis.

<div id="53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>
<div id="i53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>

### I.5.3 O determinismo linguístico forte não é a afirmação

A forte hipótese de que a linguagem determina o pensamento não é uma premissa. A declaração operacional é local. Nesse esquema, um commit sem um certificado válido não constitui um registro bem‑sucedido. Uma cadeia de confiança não tipada pode ser armazenada ao lado de uma bandeira de sucesso e ainda deixar a razão não declarada. O enum elimina essa ambiguidade específica. Ele não descreve a cognição humana.

<div id="54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>
<div id="i54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>

### I.5.4 O formalismo pode ser dispendioso; este predicado é pequeno

Exigir uma prova de todo o agente a cada passo dominaria o orçamento. A referência formaliza um limite. Chamadas somente leitura contornam. O resíduo Seguro é uma desigualdade de ponto fixo, não uma consulta SMT geral. A energia do episódio analítico do NI-2 é 8.6795e-10 joule sob as constantes declaradas. Não pode ser expressa como fração da energia da placa de um modelo generativo, porque essa comparação não foi medida. Uma divisão entre joules de proposta e joules de porta em uma carga de trabalho de agente real não está nos resultados. Até que isso ocorra, a objeção de custo é respondida para esta porta de brinquedo e permanece aberta para certificados grandes.

<div id="55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>
<div id="i55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>

### I.5.5 Um modelo incorreto com sinal verde é uma falha real

Se `V` não for a energia da planta, `energy_ok` pode ser verdadeiro enquanto a planta não está segura. A mitigação presente na referência é um gêmeo contínuo nos brinquedos, um código de razão separado e uma recusa em tratar uma probabilidade como um certificado. A mitigação ausente é a estabilidade de entrada-para-estado de perturbação, uma região de atração verificada ou um orçamento de credibilidade bayesiano do tipo estudado por Leung e Paré. NI-4 é a evidência de que dois certificados respeitáveis discordam. Essa discordância é uma razão para nomear o predicado, não uma razão para confiar em qualquer um fora de seu teste.

<div id="56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>

### I.5.6 A teoria de certificados anterior não é duplicada aqui

Ames, Alshiekh, Dawson e os artigos sobre monitoramento em tempo de execução já definem filtros e monitores. A adição do NI-1 é o registro de produto e a composição com uma exportação LUT e um executor de ferramenta em uma única referência. Onde a barreira de brinquedo vence na invariância de conjunto, o artigo afirma isso (NI-4, NI-5). A composição é `cbf_ok` como outro conjuntivo quando esse predicado é o requerido. Não se trata de uma alegação de que o LUT calcula o programa quadrático de Ames.

<div id="57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>
<div id="i57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>

### I.5.7 Preditores e chips de inferência especializados

Modelos de mundo reduzem parte do erro de previsão e deixam um residual. Dispositivos de inferência especializados alteram o custo das propostas. As cifras de taxa de fornecedor são relatórios do fornecedor até que um medidor independente as repita. O trabalho do portão é o ramo irreversível. Se a única interface de um dispositivo for um fluxo de tokens, o registro de commit ainda precisa existir em algum lugar antes que atuadores ou ferramentas irreversíveis sejam executados.

<div id="58-analytical-joules-are-not-a-costume-for-watts" class="anchor-alias" aria-hidden="true"></div>
<div id="i58-analytical-joules-are-not-watts" class="anchor-alias" aria-hidden="true"></div>

### I.5.8 Joules analíticos não são watts

As constantes na Seção I.3.4 são números de engenharia escolhidos. Elas tornam as contagens comparáveis dentro do repositório. Não são calibradas para um trilho Artix-7. Relatá‑las como watts da placa seria um relatório de medição falso. O relatório correto é o fornecido: as contagens de operação são calculadas; os joules analíticos são modelados; os joules da placa provêm apenas do medidor KV260 e são arquivados separadamente. A Etapa B da Seção I.3.7 torna o mesmo modelo inspecionável em um navegador em https://research.openie.dev/living/fpga-sim/. Ela não altera a classe de medição. Os rungs KV260 o fazem, para o tecido que eles executaram.

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>
<div id="i6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## I.6. Limitações e ameaças à validade

Validade interna. Seed-1 é uma condição inicial. A grade Safe é grande mas ainda assim uma caixa escolhida e um epsilon escolhido. Amostras de Monte Carlo próximas ao limiar estressam a fronteira que os projetistas escolheram para estressar. Um epsilon diferente ou uma identidade de planta diferente quebra a afirmação numérica até que seja reexecutada. O CBF no bake‑off é uma desigualdade de conjunto de energia implementada no mesmo crate, não um resolvedor codificado independentemente a partir de uma implementação de referência da Ames. O desacordo é informativo. O ranking absoluto em relação ao código da literatura não está estabelecido.

Validade de construto. Contagem de commits como utilidade não mede o sucesso da tarefa. Falso allow é definido contra um oráculo nomeado. Um sistema pode ser seguro‑por‑oráculo e seguro‑por‑verificação (zero falsos allows contra `Vdot <= epsilon`) e ainda falhar em segurança de conjunto (`h >= 0`), como mostra NI-4. Leitores que tratam “safe” como uma única palavra interpretarão erroneamente a tabela.

Validade externa. Ambas as plantas são brinquedos. Não há manipulador, quadrotor ou teste humano‑no‑loop. A demonstração MCP não invoca uma rede. Verilog é simulado. O instrumento do navegador é distribuído como simulação da Etapa B. O Alchitry Pt V2 concorda nas decisões e não é medido. A leitura KV260 é a nível de placa e em malha aberta. Contagens de células lógicas do fornecedor não são confirmadas aqui.

Validade de medição. Constantes analíticas podem ser editadas para qualquer escala. Comparações com as tabelas de picojoules de Horowitz, com o limite de Landauer ou com tokens do fornecedor por joule não são válidas com essas constantes. Os rungs KV260 são um medidor a nível de placa sob uma carga de trabalho declarada. Uma leitura de core‑rail durante o episódio de malha fechada é a medição ausente. A potência da ferramenta pós‑place‑and‑route seria uma terceira classe, ainda não um medidor, e não é relatada como resultado.

Relato estatístico. Onde `RESULTS.md` fornece uma média e um desvio padrão, este artigo os copia. Não adiciona intervalos de confiança que não foram calculados. Cobertura de múltiplas sementes são cinco sementes nos bake‑offs e nas dispersões relatadas do benchmark de porta rígida. Isso não constitui uma afirmação de amostra grande.

Não reivindicado. O seguinte não são resultados: liderança em joules de silício; operação próximo ao limite de Landauer; potência equivalente a cérebro; vitória sobre System One em latência; vitória sobre benchmarks de modelo‑mundo; determinismo linguístico forte; identificação de “inteligência” com contagem de commits.

Falsificadores. NI-2 é falso se o comando declarado na revisão do crate declarada não imprimir essas contagens. NI-3 é falso se o teste Safe v2 relatar um falso allow na grade declarada. NI-6 é falso se o caso de recusa no arquivo de demonstração for executado. NI-1 é falso se o esquema e o tempo de execução divergirem. Um emulador da etapa B que discorda da etapa A na semente 1 falha em seu próprio teste de aceitação. Um futuro medidor que atribui energia da placa ao número analítico sem um estudo de calibração não confirma o modelo analítico.

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>
<div id="i7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## I.7. Conclusão

O artigo definiu uma decisão de commit como um certificado conjuntivo sobre um bit de permissão LUT e um predicado de energia, com uma barreira opcional, e mostrou uma referência de software que emite a decisão antes de um efeito irreversível. Nos testes de pêndulo relatados, a regra de ponto fixo Seguro tem zero permissões falsas contra seu oráculo contínuo `Vdot <= epsilon` no conjunto de testes declarado, ao custo de 79 recusas falsas em 209.261 decisões. Nas comparações relatadas, esse oráculo não é o mesmo que invariância de conjunto. A energia de episódio analítico para a execução seed-1 é 8.6795e-10 joule sob constantes publicadas. A recusa da ferramenta na demonstração MCP não chama o executor. As verificações Verilog são simulação. O instrumento WASM e WebGPU do navegador está disponível em https://research.openie.dev/living/fpga-sim/ para que a mesma decisão possa ser inspecionada sem uma placa. Continua sendo uma simulação, não um resultado de DUT. O Alchitry Pt V2 concorda com o software em todas as decisões da seed 1 e permanece não medido. O KV260 mede o tecido de portas ao nível da placa: 11.428 pJ por ciclo de porta de oito vias a 25 MHz. A referência é um artefato de software medido e um tecido medido na placa. O joule do chip em malha fechada é a próxima medição.

<div id="references" class="anchor-alias" aria-hidden="true"></div>
<div id="i-references" class="anchor-alias" aria-hidden="true"></div>

## I. Referências

Simon, H. A., and Kadane, J. B. Optimal problem-solving search: all-or-none solutions. Artificial Intelligence 6(3), 235-247, 1975. https://doi.org/10.1016/0004-3702(75)90002-8

Alshiekh, M., Bloem, R., Ehlers, R., Konighofer, B., Niekum, S., and Topcu, U. Safe reinforcement learning via shielding. arXiv:1708.08611.

Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P. Control barrier functions: theory and applications. European Control Conference, 2019. https://doi.org/10.23919/ECC.2019.8796030

Amodei, D., and Hernandez, D. AI and compute. OpenAI, 2018. https://openai.com/index/ai-and-compute/

Anthropic. Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

Bacellar, A., et al. Differentiable weightless neural networks. arXiv:2410.11112.

Bauer, A., Leucker, M., and Schallhart, C. Runtime verification for LTL and TLTL. ACM Transactions on Software Engineering and Methodology 20(4), 14, 2011. https://doi.org/10.1145/2000799.2000800

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Brillouin, L. Science and Information Theory. Academic Press, 1956.

Chaitin, G. J. Algorithmic information theory. IBM Journal of Research and Development, 1977. https://doi.org/10.1147/rd.214.0350

Chen, Z., Kang, M., and Li, B. ShieldAgent: Shielding Agents via Verifiable Safety Policy Reasoning. ICML 2025 (PMLR v267). arXiv:2503.22738. https://proceedings.mlr.press/v267/chen25ae.html

Chollet, F. On the measure of intelligence. arXiv:1911.01547.

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Dawson, C., Gao, S., and Fan, C. Safe control with learned certificates: a survey of neural Lyapunov, barrier, and contraction methods. arXiv:2202.11762.

Engelbart, D. C. Augmenting human intellect: a conceptual framework. 1962. https://www.dougengelbart.org/pubs/augment-3906-Framework.html

Falcone, Y. You should better enforce than verify. Runtime Verification (RV 2010), Lecture Notes in Computer Science 6418, 89-105. Springer, 2010. https://doi.org/10.1007/978-3-642-16612-9_9

Garcia-Molina, H., and Salem, K. Sagas. Proceedings of ACM SIGMOD 1987, 249-259. https://doi.org/10.1145/38713.38742

Gray, J. Notes on data base operating systems. In Operating Systems: An Advanced Course, Lecture Notes in Computer Science 60, 393-481. Springer, 1978. https://doi.org/10.1007/3-540-08755-9_9

Greydanus, S., Dzamba, M., and Yosinski, J. Hamiltonian neural networks. arXiv:1906.01563.

Ha, D., and Schmidhuber, J. World models. arXiv:1803.10122.

Hafner, D., Pasukonis, J., Ba, J., and Lillicrap, T. Mastering diverse domains through world models. arXiv:2301.04104.

Henzinger, T. A., Kueffner, K., and Yu, E. Formal verification of neural certificates done dynamically. arXiv:2507.11987. https://arxiv.org/abs/2507.11987

Hestness, J., et al. Deep learning scaling is predictable, empirically. arXiv:1712.00409.

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Hooker, S. The hardware lottery. arXiv:2009.06489. Communications of the ACM, 2021. https://doi.org/10.1145/3467017

Horowitz, M. Computing's energy problem (and what we can do about it). IEEE International Solid-State Circuits Conference, 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Iverson, K. E. Notation as a tool of thought. Communications of the ACM, 1980. https://dl.acm.org/doi/10.1145/358896.358899

Jaynes, E. T. Information theory and statistical mechanics. Physical Review 106, 620, 1957. https://doi.org/10.1103/PhysRev.106.620

Kang, S., Yu, T., and Hwang, S. J. PolicyGuide: from guarding one action to guiding the whole workflow for policy-compliant LLM agents. arXiv:2608.19861. https://arxiv.org/abs/2608.19861

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Kay, A. A personal computer for children of all ages. 1972. https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf

Klein, G., et al. seL4: formal verification of an OS kernel. Proceedings of SOSP 2009, 207-220. https://doi.org/10.1145/1629575.1629596

Kolmogorov, A. N. Three approaches to the quantitative definition of information. 1965. English: International Journal of Computer Mathematics, 1968. https://doi.org/10.1080/00207166808803030

Kuon, I., and Rose, J. Measuring the gap between FPGAs and ASICs. IEEE Transactions on Computer-Aided Design 26(2), 203-215, 2007. https://doi.org/10.1109/TCAD.2006.884574

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

LeCun, Y. Path towards autonomous machine intelligence / JEPA discussion. Meta AI blog. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/

LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., and Huang, F. J. A tutorial on energy-based learning. 2006. http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf

Lee, L. Notational intelligence. 2022. https://thesephist.com/posts/notation/

Leung, C. H., and Paré, P. E. Bayesian safety guarantees for port-Hamiltonian systems with learned energy functions. arXiv:2512.24493.

Levy, W. B., and Calvert, V. G. Cerebral cortical communication overshadows computational energy-use, but these combine to predict synapse number. arXiv:2102.06273.

Ligatti, J., Bauer, L., and Walker, D. Edit automata: enforcement mechanisms for run-time security policies. International Journal of Information Security 4, 2-16, 2005. https://doi.org/10.1007/s10207-004-0046-8

Ma, S., et al. The era of 1-bit LLMs: all large language models are in 1.58 bits. arXiv:2402.17764.

Manek, G., and Kolter, J. Z. Learning stable deep dynamics models. arXiv:2001.06116.

Matuschak, A., and Nielsen, M. How can we develop transformative tools for thought? https://numinous.productions/ttft/

Mead, C. Neuromorphic electronic systems. Proceedings of the IEEE, 1990. https://doi.org/10.1109/5.58356

Necula, G. C. Proof-carrying code. Proceedings of the 24th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL '97), 106-119, 1997. https://doi.org/10.1145/263699.263712

Petersen, F., et al. Deep differentiable logic gate networks. arXiv:2210.08277.

Qiao, Y., Chen, Z., Zhang, Y., Wang, Y., et al. TeLLMe: an energy-efficient ternary LLM accelerator for prefilling and decoding on edge FPGAs. arXiv:2504.16266.

Roth, F., et al. Stable port-Hamiltonian neural networks. arXiv:2502.02480.

Saltzer, J. H., and Schroeder, M. D. The protection of information in computer systems. Proceedings of the IEEE 63(9), 1278-1308, 1975. https://doi.org/10.1109/PROC.1975.9939

Sanchez, C., et al. A survey of challenges for runtime verification from advanced application domains. arXiv:1811.06740.

Sandberg, A. Energetics of the brain and AI. arXiv:1602.04019.

Schneider, F. B. Enforceable security policies. ACM Transactions on Information and System Security 3(1), 30-50, 2000. https://doi.org/10.1145/353323.353382

Sha, L. Using simplicity to control complexity. IEEE Software 18(4), 20-28, 2001. https://doi.org/10.1109/MS.2001.936213

Shannon, C. E. A mathematical theory of communication. Bell System Technical Journal, 1948. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Shi, T., He, J., Wang, Z., et al. Progent: Securing AI Agents with Privilege Control. arXiv:2504.11703. https://arxiv.org/abs/2504.11703

Solomonoff, R. J. A formal theory of inductive inference, parts I and II. Information and Control, 1964.

SparkFun. Alchitry Pt V2 product page. https://www.sparkfun.com/alchitry-pt-v2.html

Sutskever, I. An observation on generalization. Simons Institute talk, 2023. https://www.youtube.com/watch?v=AKMuA_TVz3A

Sutton, R. The bitter lesson. 13 March 2019. http://www.incompleteideas.net/IncIdeas/BitterLesson.html

Texas Instruments. INA260 precision digital current and power monitor, data sheet. https://www.ti.com/lit/ds/symlink/ina260.pdf

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Umuroglu, Y., et al. LogicNets. arXiv:2004.03021.

Victor, B. Inventing on principle. 2012. https://www.youtube.com/watch?v=PUv66718DII

Victor, B. Media for thinking the unthinkable. https://worrydream.com/MediaForThinkingTheUnthinkable/

Wang, H., Poskitt, C. M., and Sun, J. AgentSpec: customizable runtime enforcement for safe and reliable LLM agents. arXiv:2503.18666. https://arxiv.org/abs/2503.18666

Wei, J., et al. T-MAC. arXiv:2407.00088.

Xiang, Z., Zheng, L., Li, Y., Hong, J., et al. GuardAgent: safeguard LLM agents by a guard agent via knowledge-enabled reasoning. arXiv:2406.09187. https://arxiv.org/abs/2406.09187

Yu, E., Žikelić, Đ., and Henzinger, T. A. Neural control and certificate repair via runtime monitoring. AAAI 2025. https://doi.org/10.1609/aaai.v39i25.34840 (arXiv:2412.12996).

Local measurement record: `artifacts/RESULTS.md` in the `wca-lut-edge` software reference. KV260 meter record: `artifacts/stage-c/wca-kv260-meter/` (protocol, claim status, A/B/A logs and summaries). Schema examples: `artifacts/schemas/wca.commit.v1/examples/`. Demo: `artifacts/mcp_gate_demo.json`.

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## I. Apêndice A. Reprodutibilidade

Caminho da estação de trabalho usado para gerar os logs citados: a árvore `wca-lut-edge`, Rust 1.98 conforme registrado em `RESULTS.md`. Comandos do dia a dia:

```text
cargo test -p wca-commit
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph
cargo run --release --bin wca-ph-tighten -- --grid 21 --out artifacts/ph_tighten_report.json
cargo run --release --bin wca-cbf-bakeoff -- --out artifacts/cbf_bakeoff_report.json
cargo run --release --bin wca-lyap-plant -- --out artifacts/lyap_plant_report.json
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-tlmm-scale -- --out artifacts/tlmm_scale_report.json
```

Icarus Verilog estava na versão 12.0 na nota de ambiente em `RESULTS.md`. As verificações RTL são simulação. Não leia joules analíticos como potência da placa.

O sinalizador de resultado da placa é verdadeiro apenas para os degraus 1 a 3 da Etapa C do KV260 (Seção I.3.7), ao nível da placa. Todo o resto dos resultados neste artigo é simulação ou análise.

<div id="appendix-b-browser-fpga-emulator-architecture-to-build" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-b-browser-fpga-emulator-architecture" class="anchor-alias" aria-hidden="true"></div>

## I. Apêndice B. Emulador FPGA em navegador: arquitetura

Este apêndice descreve a arquitetura do emulador Stage B, que roda em https://research.openie.dev/living/fpga-sim/. Os números de acordo Seed-1 abaixo são da execução WASM contra o ouro Stage A.

Módulos.

1. `decision_core`. Funções puras já representadas pelo certificado Rust, passo da planta e acumulador de joules. Nenhum sistema de arquivos e nenhuma thread são necessários. Alvo `wasm32-unknown-unknown`.
2. `lut_image`. A mesma imagem de memória que o caminho Verilog carrega (`artifacts/fpga/wca_allow_lut.mem` e sucessores). A cópia do navegador deve ter hash correspondente ao arquivo usado na verificação Icarus.
3. `trace`. Esquema fixo: índice de passo, estado, `u`, `lut_allow`, `energy_ok`, `cbf_ok`, códigos de razão, incremento analítico de joule, ação da planta. Nomes de campo idênticos a `wca.commit.v1` para que um dump possa ser comparado ao JSON da crate.
4. `webgpu_view`. Dispositivo, fila e um buffer de armazenamento para a LUT e o trace. Um shader desenha allow e refuse. Um segundo despacho pode mapear o residual Safe através de uma grade. Buffers são para inspeção. Eles não são um modelo de potência.
5. `workstation_oracle`. Icarus permanece o oráculo RTL. O navegador não o substitui. Desacordo entre WASM e o binário Rust falha a compilação. Desacordo entre WASM e Icarus na imagem LUT compartilhada falha a compilação. Nenhuma comparação menciona watts.

Testes de aceitação. O teste seed-1 passa (Seção I.3.7). Os demais são as verificações especificadas para o módulo.

- Seed-1, 16 passos, theta inicial 1.5, omega 3.0: comprometido 1, recusado 15, joule analítico 8.6795e-10, correspondendo ao NI-2.
- Smoke grid Safe: allow falso 0 em um subconjunto publicado do teste de decisão 209,261, correspondendo à direção NI-3.
- Vetor de recusa MCP: contagem de chamadas do executor 0, correspondendo ao NI-6.
- Um teste unitário que a leitura do buffer WebGPU equivale ao trace WASM. Se a leitura não estiver disponível, a página deve mostrar que o caminho GPU não confirmou o trace, e o trace CPU WASM permanece o resultado.

Follow-on físico para **joules** da placa. O Stage C já programou um commit-gate em loop fechado no Alchitry Pt V2 com acordo de decisão UART; a placa ainda não possui medidor de joule interno. Um medidor de potência USB inline ou um shunt mais osciloscópio no trilho de 5 V, sob uma carga declarada, é o que suportaria um joule medido na placa. Estimativas Vivado / pós-PAR não são esse medidor. Figuras de célula lógica e memória do fornecedor permanecem figuras do fornecedor. Consulte [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy).

Fora do escopo do emulador: treinamento DiffLogic no navegador e estimativa de potência dinâmica Artix-7 a partir de um shader.

<div id="part-ii" class="anchor-alias" aria-hidden="true"></div>
<div id="mixture-of-limits-navigation-law-for-computer-intelligence" class="anchor-alias" aria-hidden="true"></div>
<div id="part-ii-the-cascade-mixture-of-limits" class="anchor-alias" aria-hidden="true"></div>

## Part II. A cascata (Mistura de Limites)

<div id="mol-abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="ii1-the-rule" class="anchor-alias" aria-hidden="true"></div>

## II.1. A regra

Uma tarefa é definida por um predicado de completude $C(z) \in \{0, 1\}$ sobre seu estado $z$. Um **gear** é um mecanismo que pode encerrar a tarefa: Lookup (leitura de um valor armazenado e verificado), Formula (avaliação de forma fechada), Solver (execução de busca, otimizador ou obtenção de certificado) ou Model (execução de um gerador aprendido). O gear $i$ tem uma probabilidade de passagem $p_i$, a probabilidade de que ele alcance $C(z) = 1$ na classe da tarefa, e uma energia esperada $c_i$ em joules (J).

O **floor** de uma tarefa é a menor energia esperada na qual alguma política sobre gears atinge $C(z) = 1$ com probabilidade de falha no máximo $\delta$. Equivale a $J^*$ da Seção 0.2. O **plateau** é a região de gasto além do floor: uma vez que $C(z) = 1$, nenhum cálculo adicional pode elevar $C$, de modo que joules adicionais não compram nada no objetivo declarado.

**Mixture of Limits** é a regra: experimentar gears em uma ordem que minimize a energia esperada até o primeiro fechamento, parar no primeiro gear que fecha $C(z)$, e recusar com um recibo quando o próximo gear excederia o orçamento ou não puder mudar a decisão. Lookup → Formula → Solver → Model é a ordem padrão. É ótima apenas sob a condição derivada na Seção II.2. Cada fechamento passa pelo registro da Parte I: propor, certificar, comprometer ou recusar, recibo.

**Onde o modelo se situa.** Model último é uma ordem de tentativa, não um veredicto sobre o que modelos podem fazer. Snell et al. (2024) mostraram que um agendamento computacionalmente ótimo de computação em tempo de teste supera o best-of-N em mais de 4× em eficiência, e que em alguns problemas a computação em tempo de teste pode substituir um modelo maior. Esse resultado refere‑se ao agendamento dentro do gear Model, que é precificado em joules como qualquer outro gear. O gear Model abre sempre que gears mais baratos não conseguem fechar $C(z)$, e abre primeiro quando eles passam raramente demais para pagar por suas falhas.

Figura 2 ilustra o floor e o plateau para uma tarefa.

![Diagram of verified progress against spend for one task. Progress rises in steps as the cascade escalates from Lookup to Formula to Solver; the Solver closes the task, marking the floor. Past the floor the Model stage adds spend with no further verified progress, the plateau where value of information is zero.](/figures/gates/mol-plateau.svg)

*Figura 2. Mixture of Limits em uma tarefa. Diagrama, não uma medição. Uma [cópia PNG](/figures/gates/mol-plateau.png) é fornecida.*

**Mixture of Limits não é Mixture of Experts.** O roteamento Mixture‑of‑Experts (MoE) seleciona parâmetros dentro de um único modelo generativo (Shazeer et al., 2017; Fedus et al., 2022). Mixture of Limits seleciona se e onde gastar entre gears, e um modelo MoE pode servir como seu gear Model.

| | MoE | Mixture of Limits |
|---|---|---|
| Onde a escolha é feita | Dentro de um modelo | Entre gears, antes de qualquer modelo ser executado |
| Objeto escolhido | Quais parâmetros são executados | Qual gear fecha, ou recusar |
| Sucesso | Verossimilhança do próximo token | $C(z) = 1$, um compromisso certificado, e um recibo |
| Recusa | Não é um resultado nativo | Um resultado tipado com um recibo |

<div id="ii2-expected-energy-of-a-cascade-and-the-optimal-order" class="anchor-alias" aria-hidden="true"></div>

## II.2. Energia esperada de uma cascata e a ordem ótima

**Dois engrenagens.** Seja uma engrenagem leve L com probabilidade de passagem $q_L$ e energia $c_L$ precedendo uma engrenagem pesada H que sempre passa, com energia $c_H$. Tentar L primeiro custa $c_L + (1 - q_L)\,c_H$ em expectativa. Tentar H primeiro custa $c_H$. Portanto L primeiro é mais barato se e somente se

$$
c_L + (1 - q_L)\,c_H < c_H \iff c_L < q_L\, c_H .
$$

Por exemplo, uma busca custando $c_L = 10^{-9}$ J que passa em $q_L = 0.3$ das tarefas à frente de uma chamada de modelo custando $c_H = 10$ J economiza $q_L c_H - c_L \approx 3$ J por tarefa em expectativa. Se $q_L$ cair abaixo de $c_L / c_H = 10^{-10}$, a ordem se inverte.

**Muitas engrenagens.** Para $n$ engrenagens tentadas em sequência até a primeira passagem, com resultados independentes, a energia esperada da ordem $\sigma$ é

$$
\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j<k} \bigl(1 - p_{\sigma(j)}\bigr).
$$

Trocar duas engrenagens adjacentes $a$ então $b$ altera essa soma por um fator comum a ambos os termos vezes $(c_a + (1-p_a)c_b) - (c_b + (1-p_b)c_a) = c_a p_b - c_b p_a$. Assim $a$ deve preceder $b$ se e somente se $p_a / c_a > p_b / c_b$, e a ordem ótima ordena as engrenagens por $p_i / c_i$ decrescente (Simon e Kadane, 1975). O mais barato primeiro é ótimo exatamente quando as engrenagens mais baratas também têm maior probabilidade de passagem por joule. Quando isso falha, a cascata começa em uma engrenagem mais pesada. Sob um orçamento vinculante, os joules de tentativas leves falhas permanecem gastos, de modo que um seletor que estima $p_i / c_i$ por tarefa pode encerrar tarefas que uma ordem fixa não pode.

**Piso físico.** Qualquer engrenagem que apaga $n$ bits de forma irreversível à temperatura $T$ dissipa no mínimo

$$
E_{\text{Landauer}}(n, T) = n\, k_B T \ln 2, \qquad k_B = 1.380649 \times 10^{-23}\ \text{J/K},
$$

que corresponde a $2.87 \times 10^{-21}$ J por bit a 300 K (Landauer, 1961; Bennett, 1973, para o limite reversível). Operações CMOS medidas custam cerca de 0,9 pJ para uma soma de ponto flutuante de 32 bits em 45 nm e cerca de 1 a 2 nJ para um acesso a DRAM (Horowitz, 2014, texto do artigo; os slides plenários dão 1,3 a 2,6 nJ para um acesso de 64 bits), oito a doze ordens de magnitude acima desse piso. O valor frequentemente citado de 640 pJ por leitura de DRAM de 32 bits não está nesse artigo nem em seus slides e não é usado aqui. A figura de Landauer em um recibo é, portanto, um limite inferior rotulado, nunca uma medição.

**Modelo de custo de catálogo.** Antes de uma engrenagem ser executada, o software referencia preços como

$$
E_{\text{est}}(x) = \theta(D)\,\mu(S, V),
$$

onde $\theta(D)$ (adimensional) escala com a classe de dificuldade $D$ da ação $x$ e $\mu(S, V)$ (J) é uma energia de catálogo para o primitivo $S$ na visão de hardware $V$. Ambos são constantes de catálogo, de modo que $E_{\text{est}}$ é uma estimativa usada para ordenar engrenagens. Não é derivado da física, e nunca é relatado como uma medição. A classificação entre sistemas que encerram a tarefa usa joules medidos (Seção 0.2).

<div id="ii3-stopping-conditions" class="anchor-alias" aria-hidden="true"></div>

## II.3. Condições de parada

**Valor da informação.** Seja $B$ o retorno de uma decisão, $x$ o estado de informação atual, $y$ uma observação ou cálculo adicional, $c(y)$ sua energia, e $\lambda$ a taxa de conversão entre retorno e joules. O valor líquido é

$$
\Delta(x, y) = \mathbb{E}[B \mid x, y] - \mathbb{E}[B \mid x] - \lambda\, c(y)
$$

(Harvey, 1966; Russell and Wefald, 1991). A regra recusa a escalada quando $\Delta \le 0$. Uma vez $C(z) = 1$, os dois primeiros termos são iguais para qualquer $y$ adicional na tarefa, de modo que $\Delta = -\lambda c(y) < 0$ e a parada ocorre.

**Cobertura gramatical.** Seja $G$ o conjunto de derivações verificadas disponíveis para Lookup, Formula e Solver. Uma consulta $q$ está coberta quando existe uma derivação $q \vdash_G a$. Quando $q$ está coberta, a engrenagem Model não é aberta, pois uma engrenagem coberta passa com probabilidade 1 a menor energia que a engrenagem Model, de modo que, pela desigualdade de duas engrenagens da Seção II.2, ela vai primeiro e fecha a tarefa. Quando $q$ não está coberta e a política proíbe a engrenagem Model, a regra recusa.

**Recusa de estabilização.** Uma engrenagem Solver que busca uma configuração de baixa energia ou atinge um ponto fixo certificado (commit) ou relata que não se estabilizará dentro de seu orçamento (recusa).

Razões de recusa nomeadas na referência de software:

| Razão | Condição |
|---|---|
| `voi` | $\Delta \le 0$ para cada próximo passo disponível |
| `grammar` | Não coberto e a engrenagem Model não é permitida |
| `energy` | A estimativa da próxima engrenagem excede o orçamento restante |
| `efa_certificate` | A verificação do certificado falha antes do commit |
| `settle_refuse` | O Solver não se estabiliza dentro de seu orçamento |
| `primitive_gap` | Um primitivo requerido está ausente do catálogo |
| `safety` | Uma verificação de capacidade nega a ação |

<div id="ii4-provenance-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## II.4. Proveniência e recibos

Cada resposta contém uma classe de replay indicando como foi produzida: `Deterministic` (Lookup, Formula ou um Solver certificado), `RetrievedCited`, `Composed` ou `ModelGenerated`. O sistema de tipos proíbe o fortalecimento de uma classe: `ModelGenerated` não pode ser reescrita como `Deterministic`. A energia em um recibo possui um de três rótulos: **Estimated** (catálogo, Landauer ou figura de combustível de instrução), **Unmetered** (sem leitura) ou **Metered** (um medidor nomeado retornou uma leitura). A referência de software deixa `measured_j` indefinido a menos que um medidor retorne. O catálogo de primitivas que a referência navega, agrupado em famílias, é denominado Periodic Stack neste artigo; cada célula está Present (implementada) ou Gap (ausente).

<div id="ii5-software-reference" class="anchor-alias" aria-hidden="true"></div>

## II.5. Referência de software

A referência de software `mixture-of-limits` (Apache-2.0 ou MIT) possui um harness, `cargo run -p mol-cli -- prove`, que imprime `VERIFIED` para cada critério e termina com código 0. A suíte de testes do workspace (`cargo test --workspace`) passa (P0), e o harness termina com código 0 (P1). Um critério marcado como verificado indica que existe uma implementação e que ela cumpre a especificação declarada. Não se trata de um teorema, nem de uma replicação independente, nem de uma medição de energia. Na execução de 2 de outubro de 2026 o harness imprime 43 critérios `VERIFIED` (isto substitui a contagem anterior de cerca de 29); a tabela abaixo detalha os itens de P2 a P24, e II.5.1 a II.5.3 descrevem os critérios de lacuna de produto A11 a A14 que foram adicionados posteriormente. Os demais critérios não são detalhados neste artigo e encontram‑se na `PLAN.md` e em `product/ACCEPTANCE` da referência de software.

<div id="6-prove--claim-map" class="anchor-alias" aria-hidden="true"></div>

| Prova # | Critério | ID da alegação | Alegação | Nota de escopo | Medição |
|---|---|---|---|---|---|
| Prova # | Critério (PLAN) | ID da reivindicação do artigo | Reivindicação (uma frase) | Referência de software / nota de escopo | Medição |
|---|---|---|---|---|---|
| P2 | Fechamento determinístico (dupla execução) | `claim.mol.deterministic_close` | Mesmas solicitações produzem o mesmo commit/refuse + id de limite. | nenhum | Não medido |
| P3 | Fechamento por fórmula/consulta sem modelo | `claim.mol.formula_lookup_no_model` | Landauer / conversão de unidade fecha COMMIT na Consulta ou Fórmula; modelo nunca respondeu. | nenhum | Não medido / Estimado (piso de Landauer na recepção) |
| P4 | VoI refuse when `!allow_model` | `claim.mol.voi_refuse` | Solicitação de formato livre → REFUSE `voi`. | nenhum | Não medido |
| P5 | Commit de liquidação + recusa de liquidação | `claim.mol.settle_ternary` | Liquidação ternária → COMMIT; `will not settle` → REFUSE `settle_refuse`. | Stub de settle referenciado por software; sem VM / FPGA | Não medido |
| P6 | Recusa de certificado ao divergir | `claim.mol.efa_certificate_refuse` | Fórmula + `diverge` → REFUSE `efa_certificate`. | Certificado na árvore | Não medido |
| P7 | Mutação de capacidade padrão-negado | `claim.mol.capability_deny_mutate` | `AutomateGate::default().gate(Mutate)` → Refuse. | nenhum | Não medido |
| P8 | Rótulos de recibo | `claim.mol.receipt_honesty` | Referência de software: `measured_j=None`, estimativa rotulada (`EstimateKind`). | Fechamento padrão ao vivo RAPL/NVML FORA DE ESCOPO | Não medido / Estimado |
| P9 | `ModelGenerated` ↛ `Deterministic` | `claim.mol.replay_no_strengthen` | `TypedAnswer::weaken_to` retorna `ReplayCoercion`. | nenhum | nenhum |
| P10 | Navegação periódica de catálogo ao vivo da Pilha | `claim.mol.stack_live_catalog` | Família + presente + escala → COMMIT na Consulta; 258 engrenagens de Consulta/Fórmula/Solver/Navegação ao vivo. | Calibração μ + hardware de silício FORA DE ESCOPO; referência de software Gap sims na prova | Não medido |
| P11 | `primitive_gap` via sondagem de registro | `claim.mol.primitive_gap` | Marcador de gap `physical_settle` + nome ausente → REFUSE `primitive_gap` (não apenas string). | nenhum | Não medido |
| P12 | Catálogo μ / impedância | `claim.mol.mu_catalog` | Recibos marcam `mu_source=catalog`, `mu`, `landauer_floor_ratio`; `E≈θ·μ` (estimativa do catálogo, não RAPL/`measured_j`). | μ **corpo de calibração** FORA DE ESCOPO | Estimado |
| P13 | Reprodução de transcrição de recibo | `claim.mol.receipt_replay` | Reprodução JSONL/em memória reproduz commit/refuse + id de limite; modelo nunca respondeu. | nenhum | Não medido |
| P14 | Z2 recuperar+citar | `claim.mol.z2_retrieve_cite` | Acerto factual semeado → COMMIT `RetrievedCited` + ids de citação; desconhecido → REFUSE `claim_unknown` (sem invenção). | Corpus semente apenas na árvore | Não medido |
| P15 | Z1 compor/síntese | `claim.mol.z1_compose` | ≥2 reivindicações citadas → COMMIT `Composed` + `synthesis.composed_from`; ausente → REFUSE `compose_missing`; nunca lavada como Deterministic/RetrievedCited isoladamente. | nenhum | Não medido |
| P16 | Loop de caixa de correio do agente | `claim.mol.agent_mailbox` | Objetivo/Mensagem/Ação → fechar → commit\|recusar + recibo na transcrição; demonstração atinge fórmula/citação/compõe COMMIT e voi/settle_refuse REFUSE; modelo frio; bandeiras de medição mantêm. | none | Unmetered |
| P17 | Estado bitemporal + memória | `claim.mol.bitemporal_memory` | Escreve apenas em Mistura de Limites fechar COMMIT; Mutate negar / livre-form lembrar → REFUSE; lembrar → `RetrievedCited` + `memory:` citar; desconhecido → `memory_unknown`. | none | Unmetered |
| P18 | Roteamento de tecido + inventário de referência de software | `claim.mol.fabric_soft_ref` | Inventário offline válido (`source=software_ref`, Cpu sempre); Busca/Fórmula→Cpu; Liquidar→ThermoSettle\|Cpu; Modelo→Gpu* ou REFUSE `fabric_unavailable`; detectar ≠ joules medidos. | Live wgpu presence optional / not required for prove | Unmetered |
| P19 | Shell de desktop sem interface gráfica | `claim.mol.desktop_headless` | `ShellSession` perguntar/fechar → visualização de recibo (zona/fabric/limite/estimated_j/`measured_j=None`); registro de joules; VoI recusar; GUI não requerida. | egui GUI optional | Unmetered / Estimated |
| P20 | Rótulos de medidor do SO | `claim.mol.os_meter_honesty` | Recurso desativado / VM / sem permissão → `measured_j=None`, componentes vazios, `measure_source=unavailable`; fixtures carimbam fontes rotuladas; fechamento padrão permanece sem medição. | Live probe optional (`energy-meter`) | Unmetered (default) / Metered only when probe returns |
| P21 | Certificação de cápsula WASM | `claim.mol.wasm_capsule` | `add.wasm` sob runtime stub; combustível → apenas estimated_j; concessão FS/rede / combustível excedido / host-share → REFUSE; fechar carimba cápsula. | Optional `wasmtime` feature | Unmetered / Estimated (fuel) |
| P22 | Caminho de sessão da faixa do agente | `claim.mol.agent_lane` | Partições de faixa; `host_invoke` sem proveniência recusa; palavra‑chave confirmar insuficiente; necessidade de `GrantReceipt`; permitir carimbos `AgentLaneReceipt`. | none | Unmetered |
| P23 | Recibo de computação multi‑tecido | `claim.mol.fabric_compute_receipt` | Inventário de referência de software; `ComputeFabric` / `ScheduleDecision` / `ComputeStepReceipt` com `fabric_id`; carimbos em cascata `fabric:route`; Fórmula CPU COMMIT; Modelo residual pode `fabric_unavailable`; `measured_j=None` no caminho de referência de software. | none | Unmetered |
| P23b | Software suave de tecido ao vivo | `claim.mol.fabric_live_soft` | Recurso desativado permanece software_ref; mock/live Metal pode carimbar `gpu_metal`; Fórmula permanece Cpu; ausência de Gpu* falha-fechada; prova não requer GPU; `measured_j=None` a menos que Medido. | Soft / optional detect | Unmetered |
| P23c | wgpu / Metal pequeno kernel | `claim.mol.kernel_vector_add` | Vector-add WGSL em sala limpa; stub leve offline (mesmo checksum); Gpu* carimba `kernel:vector_add` + `execution_proof`; medidor opcional sobreposto pode carimbar o pacote `measured_j` com `energy_honesty=measured` (nome do campo); sem joules de pacote rail-sum. | Metal ao vivo opcional; fixação OK para prova | Sem medição (padrão) / Medido apenas se o medidor retornar |
| P24 | Certificação e2e do ecossistema (um recibo) | `claim.mol.ecosystem_e2e` | Via → tecido (referência de software Cpu) → WASM → rótulos de energia (combustível estimado; amostra_de_medidor opcional) → host invoca apenas com `GrantReceipt` → confirmar\|recusar em **um** recibo; recusar-sem-concessão → `grant_receipt_required`. | nenhum | Sem medição / Estimado |

Fora do invólucro: contadores de energia ao vivo (RAPL, NVML) como o fechamento padrão, detecção de GPU ao vivo, hardware de certificado no dispositivo, pesos de modelo treinado e medidores de silício para células Gap. Nenhum é reivindicado.

<div id="ii51-phase-1-micro-perception-on-the-arena-a11-a14" class="anchor-alias" aria-hidden="true"></div>

### II.5.1 Micro-percepção de fase 1 na arena (A11, A14)

A arena pontua a cascata em tarefas tipificadas (decisão, fechamento de ticket, risco) contra uma linha de base sempre‑modelo e uma linha de base de folha pequena. Linhas de base tipificadas são executadas com `phase1=false`. Com `phase1=true`, uma string de ticket, risco ou decisão não estruturada primeiro passa pelo transdutor de AST de regras em árvore (`mol phase1`) e só então entra na cascata; entrada não reconhecida é recusada, de modo que o transdutor nunca é usado como modelo e Model LAST permanece último. Na execução de referência de software em 2 de outubro de 2026 (n = 36, America/New_York), a cascata fechou 36 de 36 corretamente e recusou 5 de 5 casos de saciação, enquanto a linha de base sempre‑modelo e a linha de base de folha obtiveram cada uma 28 de 36 e 0 de 5 na saciação. A energia média estimada em joules foi aproximadamente 2.1e-11 para a cascata, 5.0e-1 para a linha de base sempre‑modelo e 2.5e-4 para a linha de base de folha. Estes são estimativas de catálogo; `measured_j` não está definido, e os valores provêm da própria tabela publicada da referência, não de uma nova execução para este artigo.

<div id="ii52-tier-1-os-meters-a13" class="anchor-alias" aria-hidden="true"></div>

### II.5.2 Medidores de sistema operacional de nível 1 (A13)

Um recurso opcional de compilação adiciona sondas ao nível do pacote de modo que `` `measured_j` `` seja preenchido apenas a partir de uma leitura real: Linux RAPL (delta de `energy_uj` do powercap), NVIDIA (potência do `nvidia-smi` multiplicada pela janela, ou um delta de energia consumida, como energia total da GPU do dispositivo) e macOS (watts `PSTR` do SMC multiplicados pela janela, sem sudo; o canal do pacote Energy Model não é usado e os trilhos nunca são somados). O harness executa com o recurso desativado, de modo que `` `measured_j` `` permanece não definido nesse caso. O Critério A13 carimba as fixações RAPL, NVML e SMC e proíbe a invenção de um valor a partir de uma porcentagem de utilização. Nenhuma figura da Parte II é uma leitura dessas sondas.

<div id="ii53-primitive-distillation-a12" class="anchor-alias" aria-hidden="true"></div>

### II.5.3 Destilação primitiva (A12)

Após um commit certificado Model LAST, `mol distill` acrescenta uma entrada Lookup ou Formula a um armazenamento com reprodução determinística; uma proposta não certificada nunca é destilada. Uma segunda passagem no padrão destilado então fecha em Lookup ou Formula sem abrir Model LAST (A12). Os recibos mantêm `estimated_j` rotulado como uma estimativa.

Reproduzir: `cargo run -p mol-cli -- prove` (43 critérios incluindo A1 a A14), `-- arena`, `-- phase1 "please close ticket as R-OK"`, `-- distill "ticket summary" --gear lookup --store product/fixtures/distill_store.json`. Código: [openIE-dev/mixture-of-limits](https://github.com/openIE-dev/mixture-of-limits).

<div id="ii6-related-work" class="anchor-alias" aria-hidden="true"></div>

## II.6. Trabalhos relacionados

**Cascatas e metaraciocínio.** Viola e Jones (2001) executaram uma cascata de classificadores reforçados em que estágios baratos rejeitam a maioria das entradas. Russell e Wefald (1991) precificaram cada cálculo pelo seu valor esperado para a rede de decisão de seu custo e interromperam quando nenhum apresentava valor líquido positivo. Horvitz (1987) definiu a mesma troca para raciocínio limitado. Algoritmos de tempo arbitrário trocam computação por qualidade com uma parada interrompível (Dean e Boddy, 1988; Zilberstein, 1996). O encadeamento de modelos envia uma entrada para um modelo maior somente quando um menor está incerto (Varshney e Baral, 2022), e o FrugalGPT para quando um avaliador aprendido aceita a resposta (Chen, Zaharia e Zou, 2023). Mixture of Limits difere em três aspectos: as engrenagens incluem mecanismos não-neurais antes de qualquer modelo; a parada é o predicado $C(z)$, não uma pontuação aprendida; e o custo são joules em um recibo, não dólares ou latência.

**Gaste além da resposta.** Modelos de raciocínio gastam tokens após sua primeira resposta correta sem alterá‑la (Chen et al., 2024), e uma pesquisa coleta métodos que param mais cedo (Sui et al., 2025). Decodificação especulativa (Leviathan et al., 2023), Mixture‑of‑Depths (Raposo et al., 2024), quantização (Frantar et al., 2022; Lin et al., 2024) e caches KV paginados (Kwon et al., 2023) reduzem a energia de uma engrenagem de Modelo uma vez que ele é executado. Eles não decidem se ele será executado.

**Recuperação de fórmulas.** AI Feynman (Udrescu e Tegmark, 2020), SINDy (Brunton et al., 2016) e PySR (Cranmer, 2023) recuperam formas fechadas a partir de dados; AlphaGeometry (Trinh et al., 2024) e AlphaProof (Hubert et al., 2025) emparelham um proponente com um verificador simbólico ou Lean. Cada um produz engrenagens de Fórmula ou Solver certificado que concluem tarefas cobertas com menor energia que um gerador.

**Roteamento entre modelos.** Esses sistemas escolhem qual modelo responde. Nenhum tenta primeiro uma engrenagem não‑neuronal ou recusa com uma razão tipada.

| Sistema | Título | ID | Classe | O que roteia ou acelera | Energia ou custo conforme relatado | Diferença |
|---|---|---|---|---|---|---|
| **RouteLLM** | *RouteLLM: Aprendendo a Roteirizar LLMs com Dados de Preferência* (arXiv); título da conferência ICLR 2025 usa *from Preference Data* | arXiv:[2406.18665](https://arxiv.org/abs/2406.18665) · ICLR 2025 | Roteador de preferência (LLM forte↔fraco) | Consulta → LLM forte ou fraco | Custo / qualidade (API \$); relatado pelos autores | Modelo↔modelo; sem piso de Lookup/Formula; sem recusa tipada de commit |
| **PEARL** (routing) | *PEARL: Roteamento consciente de desempenho e energia para LLMs* | DOI:[10.1016/j.future.2025.108218](https://doi.org/10.1016/j.future.2025.108218) · FGCS 176:108218 | Roteador multi-LLM consciente de energia | Consulta → LLM sob limite de energia (EMM prevê energia) | Autores relatam roteamento consciente de energia (GPU/infra) | Ainda escolhe um modelo; Mixture of Limits pode recusar antes de qualquer modelo |
| **GreenServ** | *GreenServ: Roteamento Dinâmico Consciente de Contexto e Energia para Inferência Multi-Modelo LLM* | arXiv:[2601.17551](https://arxiv.org/abs/2601.17551) · ICPE 2026 | Roteador multi-LLM de bandido contextual | Características da consulta → LLM; acurácia vs **energia GPU medida** (Zeus) | **Medido** (GPU Wh dos autores via Zeus) no pool de LLMs deles | Roteamento de pool de modelos; cascata Mixture of Limits é não-neural primeiro |
| **VoltanaLLM** | *VoltanaLLM: Energia-Eficiente e SLO-Consciente Serviço Desagregado de LLM via Controle Adaptativo de Frequência e Roteamento Espaço de Estado* | arXiv:[2509.04827](https://arxiv.org/abs/2509.04827) | Serviço desagregado P/D + frequência + roteamento espaço de estado | Instâncias de pré-preenchimento/decodificação + frequência GPU sob SLOs TTFT/ITL | **Medido** (autores; pyNVML em A100/GH200) até ~36.3% de energia GPU E2E vs baseline de frequência máxima (resultado de serviço em campo) | Roteia **instâncias da mesma pilha generativa**; Mixture of Limits pode nunca abrir decodificação |
| **HCSpec** | *HCSpec: Decodificação Especulativa em Cascata Horizontal de Dois Níveis para Inferência de Modelo de Linguagem Grande de Alta Eficiência* | DOI:[10.18653/v1/2026.acl-long.353](https://doi.org/10.18653/v1/2026.acl-long.353) · ACL 2026 | Decodificação especulativa (rascunho↔alvo) | Cascata de rascunho especializada por posição → verificação do alvo | Aceleração de latência (vs EAGLE-3 / AR) | Acelera geração; não recusa geração em pisos |
| **CAS-Spec** | *CAS-Spec: Decodificação Auto-Especulativa Adaptativa em Cascata para Aceleração de Inferência Sem Perdas em Tempo Real de LLMs* | arXiv:[2510.26843](https://arxiv.org/abs/2510.26843) · NeurIPS 2025 | Cascata auto-especulativa (rascunhos DSIA) | Estágios de rascunho do alvo (esparsidade/quant) + DyTC | Aceleração de latência ~1.1×-2.3× AR (autores); tokens sem perdas | Hierarquia de rascunho interna ao modelo ≠ pisos Mixture of Limits |
| **GCD** | *Decodificação Constrita por Gramática para Tarefas NLP Estruturadas sem Ajuste Fino* | arXiv:[2305.13971](https://arxiv.org/abs/2305.13971) · DOI:[10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674) · EMNLP 2023 | Decodificação LLM constrita por gramática | Mascarar logits para CFG | Não medido / métricas de qualidade | Restringe **tokens**; Mixture of Limits restringe **commit** |

<div id="ii7-baselines-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## II.7. Linhas de base e falsificadores

Uma reivindicação em cascata é testada em um conjunto de tarefas tipificado como fronteira de joules por tarefa contra taxa de fechamento. Os braços são: sempre o modelo grande; sempre o modelo pequeno; um roteador aprendido (Ong et al., 2024); uma cascata pontuada (Chen, Zaharia and Zou, 2023); um seletor que estima $p_i / c_i$ por tarefa; e um oráculo que conhece o equipamento suficiente mais barato para cada tarefa. A ordem fixa Lookup → Formula → Solver → Model afirma que a fronteira ocorre apenas onde sua curva está abaixo de todo braço. A ordem é falsificada em uma classe de tarefa onde o $p_i / c_i$ medido não está diminuindo ao longo dela, pela derivação da Seção II.2. As reivindicações do harness são falsificadas se `mol prove` não sair 0 na revisão declarada.

<div id="ii8-limits" class="anchor-alias" aria-hidden="true"></div>

## II.8. Limitações

O arnês é existência construtiva em software. Nenhuma figura da Parte II é uma leitura de medidor: catálogos e energias de Landauer são estimativas, e `` `measured_j` `` está indefinido no caminho do arnês. O resultado de ordem ótima assume resultados de engrenagens independentes; falhas correlacionadas alteram a energia esperada e exigem a soma completa da Seção II.2 com probabilidades condicionais. As probabilidades de passagem $p_i$ devem ser estimadas por classe de tarefa, e o erro de estimativa desloca a ordem. A comparação de fronteira da Seção II.7 ainda não foi executada.

<div id="ii-references" class="anchor-alias" aria-hidden="true"></div>

## II. Referências

Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17(6):525-532. https://doi.org/10.1147/rd.176.0525

Brunton, S. L., Proctor, J. L., and Kutz, J. N. (2016). Discovering governing equations from data by sparse identification of nonlinear dynamical systems. *PNAS* 113(15):3932-3937. https://doi.org/10.1073/pnas.1517384113

Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. arXiv:2305.05176.

Chen, X., et al. (2024). Do NOT Think That Much for 2+3=? On the Overthinking of o1-Like LLMs. arXiv:2412.21187.

CAS-Spec (2025). Cascade Adaptive Self-Speculative Decoding. NeurIPS. arXiv:2510.26843.

Cranmer, M. (2023). Interpretable Machine Learning for Science with PySR and SymbolicRegression.jl. arXiv:2305.01582.

Dean, T., and Boddy, M. (1988). An analysis of time-dependent planning. AAAI-88, 49-54.

Fedus, W., Zoph, B., and Shazeer, N. (2022). Switch Transformers. *JMLR* 23(120).

Frantar, E., et al. (2022). GPTQ. arXiv:2210.17323.

Geng, S., et al. (2023). Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning. EMNLP. https://doi.org/10.18653/v1/2023.emnlp-main.674

GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. ICPE. arXiv:2601.17551.

HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. ACL. https://doi.org/10.18653/v1/2026.acl-long.353

Horowitz, M. (2014). Computing's energy problem (and what we can do about it). ISSCC. https://doi.org/10.1109/ISSCC.2014.6757323

Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. UAI. arXiv:1304.2759.

Howard, R. A. (1966). Information value theory. *IEEE Transactions on Systems Science and Cybernetics* 2(1):22-26. https://doi.org/10.1109/TSSC.1966.300074

Hubert, T., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning. *Nature*. https://doi.org/10.1038/s41586-025-09833-y

Kwon, W., et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. arXiv:2309.06180.

Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5(3):183-191. https://doi.org/10.1147/rd.53.0183

Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. ICML.

Lin, J., et al. (2024). AWQ. MLSys. arXiv:2306.00978.

Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. arXiv:2406.18665.

PEARL (2025). Performance and energy aware routing for LLMs. *Future Generation Computer Systems* 176:108218. https://doi.org/10.1016/j.future.2025.108218

Raposo, D., et al. (2024). Mixture-of-Depths. arXiv:2404.02258.

Russell, S., and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C

Shazeer, N., et al. (2017). Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer. ICLR. arXiv:1701.06538.

Simon, H. A., and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6(3):235-247. https://doi.org/10.1016/0004-3702(75)90002-8

Snell, C., Lee, J., Xu, K., and Kumar, A. (2024). Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters. arXiv:2408.03314.

Sui, Y., et al. (2025). Stop Overthinking: A Survey on Efficient Reasoning for Large Language Models. arXiv:2503.16419.

Trinh, T. H., et al. (2024). Solving olympiad geometry without human demonstrations. *Nature* 625:476-482. https://doi.org/10.1038/s41586-023-06747-5

Udrescu, S.-M., and Tegmark, M. (2020). AI Feynman. *Science Advances* 6(16). https://doi.org/10.1126/sciadv.aay2631

Varshney, N., and Baral, C. (2022). Model cascading. EMNLP. https://doi.org/10.18653/v1/2022.emnlp-main.756

Viola, P., and Jones, M. (2001). Rapid object detection using a boosted cascade of simple features. CVPR. https://doi.org/10.1109/CVPR.2001.990517

VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. arXiv:2509.04827.

Zilberstein, S. (1996). Using anytime algorithms in intelligent systems. *AI Magazine* 17(3).

<div id="ii-appendix-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## II. Apêndice. Reprodutibilidade

```bash
cargo test --workspace
cargo run -p mol-cli -- prove   # expect 43 VERIFIED lines (A1 to A14 included), exit 0
cargo run -p mol-cli -- arena   # refresh the arena table from a real run only
```
