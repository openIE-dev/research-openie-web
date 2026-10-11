<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*Versão 1.1, 11 de outubro de 2026. Dados e código: [research.openie.dev/data/](/data/#economics). PDF em LaTeX: [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([fonte](/pdfs/latex/ai-coding-market.tex)).*

*O companheiro econômico do artigo [O Reality Code Engine: uma Forma, muitos ajustes e o caminho de baixa entropia para a programação autônoma](/papers/rce/). O artigo de pesquisa contém a engenharia, a teoria e as medições. Este ensaio é onde a teoria e a economia se encontram.*

## Resumo

O mercado trilionário de programação com IA é a afirmação hiperbólica e informada de David Charlot, e as projeções reais confirmam sua escala. Uma estimativa de capital de risco situa o valor dos desenvolvedores de software do mundo em cerca de 3 trilhões de dólares por ano e chama a programação com IA de um mercado capaz de sustentar "até mesmo um gigante de um trilhão de dólares" [1]. Duas empresas de programação com IA relataram mais de 1 bilhão e mais de 2.5 bilhões de dólares de receita anualizada com um ano de diferença entre si [5, 6]. Um laboratório de fronteira está avaliado em 380 bilhões de dólares, e seu produto de programação é sua vitrine [6]. O volume de tokens de um provedor passou de 9.7 trilhões para mais de 3.2 quatrilhões de tokens por mês em dois anos [8]. O investimento de capital das maiores empresas de tecnologia superou 400 bilhões de dólares em 2025 [10].

Todas essas projeções supõem a mesma coisa. Existe um só caminho para a automação computacional autônoma. Ele é de alta energia, alta computação, alta entropia e desordem. Um modelo fica no loop de cada tarefa, e cada tarefa paga aluguel por token.

O [artigo de pesquisa do RCE](/papers/rce/) mede um segundo caminho. O RCE é um ecossistema de código nativo. Um programa é escrito uma única vez, a partir da intenção, como uma Forma, uma codificação sem perdas do estado, dos eventos e das transições puras, e cada linguagem de destino é uma projeção fiel dela. Um estado que a Forma não declara não pode ser escrito, de modo que um programa errado é rejeitado no ponto de entrada, em vez de ser encontrado e corrigido depois. Cada ajuste que passa pela porta é armazenado e reutilizado, de modo que o ecossistema cresce de forma cumulativa. Em 10,000 Formas pré-registradas, com o motor congelado e 0 chamadas a modelo, cada Forma faz a ida e volta para bytes idênticos, cada projeção é determinística, cada entrada malformada é rejeitada no ponto de entrada e a projeção em Python reproduz o traço de referência em 9,999 ([RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n)). O código de outras linguagens entra por elevação, e no código elevado as engrenagens de reparo restauram 520,541 de 520,821 falhas de um token e 63.7% de 21,320 defeitos Java de uma instrução com 0 chamadas a modelo ([RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)). Onde esse caminho cobre uma tarefa, o custo marginal da tarefa cai em direção à energia para executá-la, e um mercado precificado pela geração perde sua base nessa tarefa. Este ensaio separa as projeções das medições, nomeia o que cada projeção supõe e indica onde ela se rompe.

**Tese compartilhada, enunciada uma vez para todos os artigos.** A energia para executar é a única métrica verdadeira da inteligência computacional. Todos os outros fatores colapsam a zero. A forma de porta define o que isso significa. Entre as execuções que satisfazem o predicado de completude $C(z)$ da tarefa dentro do orçamento e do prazo declarados, os sistemas são classificados pelos joules até a conclusão, $J^*$. Correção, prazos e tamanho da tarefa são a porta, não termos da pontuação. Parâmetros, tokens, pontuações de benchmark e preços têm peso zero na classificação ([Agência, Seção 1](/papers/agency/#1-thesis)). Estimativas nunca são `measured_j`.

**O preço, uma afirmação separada, para os companheiros econômicos.** Uma tendência de preço é uma afirmação separada, rotulada como tal. A Epoch AI relata que o custo de um dado nível de desempenho de IA caiu cerca de 47 por cento por trimestre desde 2023, cerca de 13 vezes por ano (Emberson e Roodman, *The plunging price of thought*, 22 de setembro de 2026). Se essa tendência continuar, a energia passa a ser o custo marginal dominante da inferência. Isso é uma tendência citada com uma condição, não um colapso medido. [A correção ortográfica é global](/papers/spellcheck/) é uma prova de existência de que parte da inteligência computacional se torna commodity a preço zero, embutida num pacote. A teoria que esses companheiros usam está no [artigo sobre agência](/papers/agency/), em [Portas de confirmação medidas](/papers/gates/) e em [Reality Code Engine](/papers/rce/).

## 1. Projeções e medições são objetos diferentes

Cada número abaixo leva um de cinco rótulos.

| Rótulo | Significado |
|---|---|
| **Projeção** | Uma previsão ou uma estimativa de valor construída sobre suposições declaradas |
| **Relatado pela empresa** | Um número que uma empresa declara sobre si mesma, como a receita anualizada (o último mês vezes doze) ou uma avaliação de financiamento |
| **Estimativa de pesquisa** | Um número de dimensionamento de mercado vindo de uma pesquisa com compradores |
| **Registrado** | Um número de um documento entregue a um regulador |
| **Medido** | Uma contagem ou uma leitura de energia de uma execução cujos artefatos são guardados. No RCE, a energia leva seu próprio rótulo: `est_j`, `reported_j` ou `measured_j` |

Só a última linha é evidência sobre o custo de um resultado correto. As demais são evidência sobre o que o mercado espera.

## 2. Quem projeta o quê

### 2.1 O valor dos desenvolvedores: o trilhão

| Afirmação | Número | Rótulo | Fonte |
|---|---|---|---|
| Desenvolvedores de software no mundo | cerca de 30 milhões (de 27 milhões a 47 milhões, conforme a estimativa) | Insumo de projeção | Appenzeller e Li [1] |
| Valor por desenvolvedor por ano | 100,000 dólares (suposto) | Insumo de projeção | [1] |
| Contribuição econômica anual | cerca de 3 trilhões de dólares | Projeção | [1] |
| Desenvolvedores no GitHub | mais de 180 milhões; 518.7 milhões de pull requests mesclados no ano | Relatado pela empresa | GitHub Octoverse 2025 [17] |
| Valor da IA generativa em 63 casos de uso | de 2.6 trilhões a 4.4 trilhões de dólares por ano; produtividade da engenharia de software de 20% a 45% do gasto anual atual da função | Projeção | McKinsey [15] |
| Efeito da IA generativa no PIB mundial | 7% ao longo de um período de dez anos | Projeção | Goldman Sachs [16] |
| Ganho de produtividade com um assistente simples | cerca de 20% | Estimativa a partir de entrevistas | [1] |
| Ganho de produtividade com uma implantação de ponta | "pelo menos o dobro" | Estimativa "baseada em evidência anedótica" | [1] |

A contagem de desenvolvedores é frágil: 30 milhões é uma estimativa de profissionais, e só o GitHub conta seis vezes mais contas que desenvolvem nele [17]. O valor por desenvolvedor e o múltiplo de produtividade também são frágeis (Seção 2.7). A estimativa de 2023 da McKinsey é o trilhão original deste mercado, e é uma estimativa de valor para todas as funções [15]. O mesmo ensaio de capital de risco diz que o ecossistema de programação com IA pode "sustentar dezenas de empresas de um bilhão de dólares e até mesmo um gigante de um trilhão de dólares" [1]. Essa frase é o trilhão. É uma estimativa de valor. Não é uma previsão de receita.

### 2.2 Receita de ferramentas e gasto empresarial

| Afirmação | Número | Rótulo | Fonte |
|---|---|---|---|
| Gasto empresarial com ferramentas de programação com IA, 2025 | 4.0 bilhões de dólares, 55% do gasto departamental com IA | Estimativa de pesquisa | Menlo Ventures [2] |
| Gasto empresarial com IA generativa, 2025 | 37 bilhões de dólares | Estimativa de pesquisa | [2] |
| Mercado de ferramentas de código com IA, 2026 | 9.35 bilhões de dólares, chegando a 29.96 bilhões até 2031 | Projeção | Mordor Intelligence [3] |

A receita que o mercado relata hoje está na casa dos bilhões. O trilhão é o valor que o mercado espera capturar.

### 2.3 Receita e avaliações de empresas

| Afirmação da empresa | Número | Data | Rótulo | Fonte |
|---|---|---|---|---|
| Receita anualizada do Cursor | mais de 1 bilhão de dólares | 13 de novembro de 2025 | Relatado pela empresa | Cursor [5] |
| Novo preço do Cursor Pro | de limites de requisições para "20 dólares de uso de modelos de fronteira por mês a preços de API", com reembolsos pela mudança | junho a julho de 2025 | Relatado pela empresa | Cursor [18] |
| Série D do Cursor | 2.3 bilhões de dólares a 29.3 bilhões post-money | 13 de novembro de 2025 | Relatado pela empresa | [5] |
| Receita run-rate da Anthropic | 14 bilhões de dólares | 12 de fevereiro de 2026 | Relatado pela empresa | Anthropic [6] |
| Receita run-rate do Claude Code | mais de 2.5 bilhões de dólares | 12 de fevereiro de 2026 | Relatado pela empresa | [6] |
| Série G da Anthropic | 30 bilhões de dólares a 380 bilhões post-money | 12 de fevereiro de 2026 | Relatado pela empresa | [6] |

A Anthropic declara que a rodada financia "expansões de infraestrutura" [6]. Receita, avaliação e computação são uma única aposta.

### 2.4 Inferência, tokens e economia unitária

| Afirmação | Número | Rótulo | Fonte |
|---|---|---|---|
| Tokens processados pelo Google por mês | 9.7 trilhões (2024), cerca de 480 trilhões (2025), mais de 3.2 quatrilhões (maio de 2026) | Relatado pela empresa | Pichai [8] |
| Ferramentas internas de IA para desenvolvedores do Google | meio trilhão de tokens por dia em março de 2026, mais de três trilhões por dia em maio | Relatado pela empresa | [8] |
| Custo de uma consulta agêntica de programação a preços de tabela | 2.50 dólares: um contexto de 100,000 tokens e 10,000 tokens de saída a 15 e 75 dólares por milhão de tokens | Ilustração | Appenzeller e Li [1] |
| O mesmo a 3 consultas por hora, 7 horas por dia, 200 dias | cerca de 10,000 dólares por ano por desenvolvedor | Ilustração | [1] |
| Tokens na programação agêntica comparados a raciocínio sobre código e chat de código | cerca de 1,000 vezes mais; execuções de uma mesma tarefa diferem em até 30 vezes; maior uso de tokens "não se traduz em maior precisão" | Medido (oito modelos, SWE-bench Verified) | Bai, Huang e Wang [9] |
| Perdas líquidas do investimento da Microsoft na OpenAI, trimestre encerrado em 30 de setembro de 2025 | 4.1 bilhões de dólares antes de impostos, sua participação pelo método de equivalência patrimonial, em outras despesas; uma redução de 3.1 bilhões de dólares no lucro líquido (0.41 dólar por ação diluída) | Registrado e relatado pela empresa | Microsoft Form 10-Q [7]; Microsoft FY26 Q1 performance [19] |

Duas frases nas fontes expõem a economia sem rodeios. Pichai: "muitas empresas já estão estourando seus orçamentos anuais de tokens, e ainda é maio" [8]. Appenzeller e Li: "Por décadas, o custo do desenvolvimento de software foi quase puramente custo de pessoas, mas agora os LLMs acrescentam um componente substancial de despesa operacional" [1].

### 2.5 Preço por token

| Afirmação | Número | Rótulo | Fonte |
|---|---|---|---|
| Custo de um nível fixo de desempenho de IA | queda de cerca de 47% por trimestre, cerca de 13 vezes por ano, desde 2023 | Série de preços medida (cinco benchmarks) | Epoch AI [4] |
| Preço para atingir uma pontuação fixa de benchmark | cai de 9 a 900 vezes por ano, conforme o marco; as quedas mais rápidas são as mais recentes e as menos certas de persistir | Série de preços medida (ajustes log-lineares) | Epoch AI [34] |
| Custo de inferência a desempenho equivalente | queda de cerca de 10 vezes por ano: de 60 dólares por milhão de tokens em 2021 para 0.06 dólar | Estimativa | Appenzeller, a16z [20] |
| Corte de preço da API da DeepSeek, 29 de setembro de 2025 | custo dos desenvolvedores "reduzido em mais de 50%" | Relatado pela empresa | DeepSeek [21] |

As 13 vezes por ano de [4] são um ponto numa faixa ampla [34]. A queda é movida pela concorrência e pelos pesos abertos, como mostra o corte da DeepSeek [21]. Ela não precisa de contabilidade de energia. Essa é a primeira queda da Seção 6. O segundo caminho acrescenta outra: chamadas por tarefa.

### 2.6 Energia e capital

| Afirmação | Número | Rótulo | Fonte |
|---|---|---|---|
| Eletricidade de data centers, 2024 | cerca de 415 TWh, cerca de 1.5% da eletricidade mundial | Estimativa | IEA, *Energy and AI* [11] |
| Eletricidade de data centers, 2030 | cerca de 945 TWh, cenário base | Projeção | [11] |
| Atualizado: 2025 a 2030 | de 485 TWh a 950 TWh, cerca de 3% da demanda mundial | Estimativa e projeção | IEA, *Key Questions on Energy and AI* [10] |
| Investimento de capital das maiores empresas de tecnologia | mais de 400 bilhões de dólares em 2025, com alta esperada de mais 75% em 2026 | Relatado e projetado | [10] |
| Investimento de capital da Alphabet | 31 bilhões de dólares em 2022; cerca de 180 a 190 bilhões esperados em 2026 | Relatado pela empresa e orientação | Pichai [8] |
| Energia por tarefa | queda de pelo menos uma ordem de grandeza por ano; tarefas de raciocínio e agênticas usam "centenas ou milhares de vezes mais energia por consulta do que a geração simples de texto" | Estimativa | [10] |
| Um prompt de texto mediano a um assistente em produção | 0.24 Wh | Medido pelo operador | Elsworth et al. [12] |
| Stargate | 500 bilhões de dólares em quatro anos em infraestrutura de IA para um laboratório, 100 bilhões aplicados de imediato | Anunciado pela empresa | OpenAI [22] |
| Gasto mundial com IA, 2025 | cerca de 1.5 trilhão de dólares | Projeção | Gartner [24] |
| Receita que o investimento precisa recuperar | "AI's $600B question" | Análise | Sequoia Capital [23] |

O aluguel que precisa ser pago é aluguel de hardware. Investimentos e compromissos desse tamanho são pagos por meio de uso precificado acima de sua energia. Essa é a base que o segundo caminho remove nas tarefas cobertas.

### 2.7 Evidência de produtividade

| Estudo | n | Desenho | Efeito | Fonte |
|---|---|---|---|---|
| Ensaio da a16z | entrevistas | Estimativa | cerca de 20% para um assistente simples; "pelo menos o dobro" no melhor da categoria | [1] |
| GitHub Copilot, tarefa de servidor HTTP | desenvolvedores recrutados | Experimento controlado | 55.8% mais rápido numa tarefa de brinquedo | Peng et al. [27] |
| Teste empresarial do Google | 96 engenheiros | Ensaio clínico randomizado | cerca de 21% menos tempo na tarefa | Paradis et al. [28] |
| METR, início de 2025 | 16 desenvolvedores experientes de código aberto, 246 tarefas | Ensaio clínico randomizado | 19% mais lentos com IA | Becker et al. [25] |
| METR, atualização de 2026 | nova coorte | Ensaio clínico randomizado | os autores chamam os novos dados de "um sinal pouco confiável" | METR [26] |

Os efeitos medidos vão de uma desaceleração de 19% a uma aceleração de 56% numa tarefa de brinquedo. Os dois fatores da estimativa de valor, a contagem de desenvolvedores e o múltiplo de produtividade, são frágeis. Isso enfraquece o trilhão. Também enfraquece qualquer afirmação de que o valor que o segundo caminho libera seja um número conhecido.

## 3. O que as projeções supõem

Lidas em conjunto, as projeções se apoiam em quatro suposições. Cada uma é uma afirmação sobre o caminho, não sobre o valor do software.

1. **Um caminho: geração.** Toda mudança é escrita por um modelo. A estimativa de valor escala a produtividade pelo modelo, e a ilustração de custo precifica cada consulta [1].
2. **Alta energia e alta computação.** Volume de tokens, eletricidade de data centers e investimento de capital devem crescer juntos [8, 10, 11]. A energia por consulta cai, e os tokens por tarefa sobem mais depressa [9, 10].
3. **Aluguel por token.** A receita é cobrada por token ou por licença cujo custo são tokens. O custo anual de tokens de um desenvolvedor é projetado na escala de um salário [1].
4. **IA no loop para sempre.** A tarefa 10,000 custa o mesmo que a tarefa 1, porque nada do que o modelo aprendeu na tarefa 1 roda sem o modelo na tarefa 10,000.

O ensaio que enuncia o trilhão também enuncia seu limite: "embora o preço por substituição funcione em mercados iniciais, no fim o custo de um bem converge para seu custo marginal, e o preço também" [1]. Este ensaio concorda, e pergunta qual é o custo marginal de uma tarefa de programação correta.

## 4. A teoria que precifica a tarefa

O [artigo de pesquisa do RCE](/papers/rce/) fornece três resultados que transformam a pergunta numa quantidade.

**A correção é a porta.** Uma tarefa está concluída quando seu predicado de completude $C(z)$ vale: seus testes passam, existe uma prova ou um traço de concordância confere ([RCE §1](/papers/rce/#1-thesis)). Um comprador paga por $C(z) = 1$, não por tokens.

**Os joules são a classificação.** Entre os sistemas que passam pela porta, vence o que tem menos joules até a conclusão, $J^*$ ([Agência §1](/papers/agency/#1-thesis)). Num mercado competitivo, vendedores que passam pela mesma porta competem em custo, e o piso de custo de uma tarefa é a energia para concluí-la mais o preço da prova.

**A Forma é escrita uma vez e reutilizada.** Um programa do ecossistema é escrito uma única vez, a partir da intenção, como uma Forma, e cada destino é uma projeção dela, de modo que o custo de um ajuste é pago uma vez e cada uso posterior roda no piso do manipulador ([RCE §1](/papers/rce/#1-thesis)). **A maioria dos ajustes já existe.** Um programa é uma tupla $P = (S, E, \delta, D, \lambda)$, e pelo teorema das Máquinas de Estados Abstratas de Gurevich todo algoritmo sequencial tem esse formato ([RCE §3](/papers/rce/#3-the-form)). Programas diferem no ajuste, e a maioria dos ajustes já existe: "70% do código no GitHub consiste em clones de arquivos criados anteriormente" ([RCE §7](/papers/rce/#7-reuse-evidence)). Ajustes equivalentes passam pela mesma porta, então a extração escolhe o de menos joules (RCE Proposição 3).

**Proposição E0 (preço de uma tarefa coberta).** Diga-se que uma tarefa está coberta quando um ajuste armazenado passa por sua porta. Entre os vendedores que passam pela porta, a concorrência leva o preço de uma tarefa coberta em direção a $c_J \cdot J^*_{\text{floor}} + c_{\text{proof}}$, em que $c_J$ é o preço de um joule, $J^*_{\text{floor}}$ é a energia para recuperar, aplicar e verificar o ajuste, e $c_{\text{proof}}$ é o custo da verificação. A geração só entra nas tarefas não cobertas.

Mixture of Limits é a filosofia por trás da proposição: há uma quantidade mínima de qualquer coisa para realizar uma tarefa, e qualquer excesso é desperdício ([Portas de confirmação medidas, Parte II](/papers/gates/#part-ii-the-cascade-mixture-of-limits)). Aluguel por token além do piso cobra pelo desperdício.

## 5. As medições

Estas são medições, rotuladas como o RCE as rotula. Elas vêm do [artigo de pesquisa do RCE](/papers/rce/). As primeiras linhas medem o próprio ecossistema; as linhas seguintes medem o reparo de código elevado a partir de outras linguagens ([RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)).

| Medição | Resultado | Rótulo | Onde |
|---|---|---|---|
| Ecossistema de Formas, 10,000 Formas pré-registradas, ida e volta sem perdas e projeção determinística | 10,000 de 10,000, 0 chamadas a modelo | Contagens medidas | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Ecossistema de Formas, entradas e especificações malformadas rejeitadas no ponto de entrada | 10,000 de 10,000, 0 chamadas a modelo | Contagens medidas | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Ecossistema de Formas, a projeção em Python reproduz o traço de referência byte a byte | 9,999 de 10,000, 0 chamadas a modelo | Contagens medidas | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Código elevado, L0 falhas de um token, 9 repositórios reais, partição de teste reservada | 520,541 de 520,821 (0.9995, IC 95% de 0.9994 a 0.9995), 0 chamadas a modelo | Contagens medidas | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| Código elevado, L0, 4 repositórios nunca usados no ajuste | 23,015 de 23,015 (IC 95% de 0.9998 a 1.0000), 0 chamadas a modelo | Contagens medidas | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| Código elevado, L1 Java, ManySStuBs4J 2.0, reservado, arquivo inteiro | 13,586 de 21,320 (0.637, de 0.631 a 0.644), 0 chamadas a modelo; 9,288 de 24,072 (0.386) só com o hunk | Contagens medidas | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| Código elevado, L1 Python, TSSB-3M v1.0.0, reservado | 27,266 de 157,089 (0.174, de 0.172 a 0.175), 0 chamadas a modelo | Contagens medidas | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| Energia por tarefa resolvida, todos os degraus | de 0.10 J a 0.40 J | `est_j` (segundos de CPU × 10 W) | [RCE §6.3](/papers/rce/#63-energy) |
| Energia por tarefa resolvida, subamostra RAPL | 0.056 J (L0, 3,000 tarefas), 0.026 J (L1, 690 resolvidas de 2,000); ±10 J nos totais das execuções | `reported_j` (contador de pacote menos uma linha de base ociosa declarada) | [RCE §6.3](/papers/rce/#63-energy) |

`measured_j` é reservado a um medidor de parede e está vazio em todas as linhas.

## 6. Onde as projeções se rompem

**O aluguel por token se rompe nas tarefas cobertas.** Um programa escrito como Forma é compilado para todos os destinos com 0 tokens: 10,000 de 10,000 Formas pré-registradas foram compiladas, projetadas e passaram pela porta sem nenhuma chamada a modelo [RCE §2.3]. No código elevado, cada reparo coberto também comprou 0 tokens: 520,541 reparos de um token e 40,852 reparos de uma instrução vindos de históricos reais [RCE §6.1, §6.2]. Uma linha de receita precificada por token não ganha nada numa tarefa que não precisa de token.

**A IA no loop para sempre se rompe na promoção.** O modelo é pago uma vez por um caso novo; a porta admite o ajuste como handler, e casos posteriores com o mesmo formato se fecham sem ele ([RCE §4.2](/papers/rce/#42-the-gears)). Onde isso vale, a tarefa 10,000 não custa o que a tarefa 1 custou. Se as chamadas a modelo por rodada chegam a zero em especificações reais é algo medido com N grande pela [RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n).

**Alta energia não é necessária para um resultado correto.** Um reparo reservado passou pela porta com 0.026 a 0.056 joule relatado por tarefa resolvida num contador de pacote, sem modelo [RCE §6.3]. Um prompt de texto mediano a um assistente em produção é medido em 0.24 Wh, ou 864 J [12]. Uma tarefa agêntica de programação usa muitos prompts, e a IEA situa as consultas agênticas em centenas ou milhares de vezes a energia de uma simples [10]. São tarefas diferentes em máquinas diferentes, então não formam uma razão. São uma ordem de grandeza a testar, sob o Protocolo E1.

**A cobertura é medida por classe.** Os degraus dão a cobertura dentro de classes de tarefas: quase todas as falhas de um token, e 63.7% (Java, arquivo inteiro; 38.6% só com o hunk) e 17.4% (Python) dos defeitos de uma instrução, em que os casos em aberto são aqueles cujos bits de intenção estão fora do hunk ou são novos ([RCE §6.0](/papers/rce/#60-the-repair-ladder-on-lifted-code)). A parcela de todo o volume real de programação que cai em classes cobertas é a Proposição E5.

**Duas quedas se multiplicam.** O preço por chamada cai de 9 a 900 vezes por ano a desempenho fixo, conforme a tarefa [4, 34]. A promoção leva as chamadas por tarefa a zero nos casos cobertos [RCE §8.6]. O custo por tarefa é o produto das duas. Uma projeção que extrapola o volume de tokens precifica só a primeira.

**O padrão do corretor ortográfico.** [A correção ortográfica é global](/papers/spellcheck/) registra uma capacidade cujo custo marginal caiu a cerca de zero e que complementava uma ferramenta que todos já tinham. Ela foi embutida no editor e seu preço separado desapareceu, como a economia dos pacotes prevê [13, 14]. Uma tarefa de programação coberta tem as mesmas duas propriedades: seu custo marginal cai ao piso do handler, e ela complementa editores e repositórios que as pessoas já têm. A previsão é a mesma: a tarefa coberta é embutida num pacote, e o que continua com preço é o caso não coberto e a prova.

**Empacotamento pelo dono da plataforma.** O padrão do corretor ortográfico tem um dono. O pacote é feito por quem é dono do editor, do repositório ou da nuvem. Spolsky deu nome à tática: transforme seu complemento em commodity [31]. Nalebuff mostrou que um pacote pode barrar a entrada [32], e Adams e Yellen, que ele discrimina pelo preço [33]. Isso está acontecendo: o GitHub passou os planos individuais do Copilot para cobrança por uso a partir de 1 de junho de 2026 [30], e o Cursor passou o Pro de limites de requisições para preços de API repassados em 2025 [18]. Uma plataforma pode dar de graça a camada do modelo e manter o aluguel na IDE e na nuvem. Um motor precificado por energia compete com um pacote de preço zero apenas onde a porta lhe está aberta: onde os testes, a prova e o recibo são do comprador, não da plataforma.

**Uma Forma no lugar de muitas linguagens.** O artigo do RCE enuncia a tese de que uma Forma universal, com cada linguagem como projeção e cada programa como elevação, substitui a necessidade de qualquer outra linguagem ([RCE §3.6](/papers/rce/#36-one-ecosystem-lossless-and-the-universality-thesis)). A leitura de mercado é esta. Grande parte do gasto que as projeções contam é tradução entre linguagens, frameworks e suas versões, e conciliação de implementações que divergem. Num ecossistema em que um programa é escrito uma vez e todos os destinos são emitidos, esse gasto não tem tarefa alguma para comprar. A adoção é a grandeza em aberto, e é uma questão de mercado, não um teorema.

**O que sobrevive.** A estimativa de valor da Seção 2.1 pode se sustentar. Os desenvolvedores podem produzir mais. O que se rompe é a afirmação de que o valor é capturado como aluguel sobre a geração. A conclusão é condicional. Onde a cobertura é alta e a plataforma não empacota, o valor criado a um custo marginal decrescente vai para quem detém a porta, a prova e o piso de baixa entropia, e boa parte dele vai para o comprador. Onde a plataforma empacota, a evidência diz que quem detém a porta é a plataforma.

## 7. Demanda

Tarefas mais baratas podem aumentar a demanda total. O ensaio de capital de risco espera isso: "acreditamos que o Paradoxo de Jevons vale neste caso" [1]. [Saciedade da tarefa versus rebote agregado na demanda por IA](/papers/satiation/) separa os dois efeitos. O apetite por tarefa para no predicado de completude. O uso agregado ainda pode crescer, porque uma síntese mais barata abre tarefas novas. O segundo caminho muda o primeiro efeito e deixa o segundo em aberto. Um mercado maior de tarefas cobertas é um mercado cujo custo marginal é o piso, não a fronteira. A única elasticidade publicada é pequena. Entre as tarefas da amostra de API da Anthropic, cada aumento de 1% no custo está associado a uma redução de 0.29% na frequência de uso [29]. Isso é um corte transversal entre tarefas, não uma mudança de preço ao longo do tempo. Lida como está, a demanda é inelástica: quedas de preço encolhem a receita num conjunto fixo de tarefas, o que apoia a leitura deste ensaio sobre o aluguel, e não fazem, por si sós, a programação ser usada muito mais.

## 8. Proposições e protocolos

**Proposição E1 (as curvas de custo se cruzam).** Para um fluxo de tarefas num repositório, o custo acumulado por tarefa resolvida do segundo caminho cai abaixo do de um agente de geração após um número finito de tarefas. *Protocolo:* executar o [Protocolo 8.3 do RCE](/papers/rce/#83-a-wall-meter) e um agente de geração simples sobre o mesmo fluxo de issues sob um medidor de parede. Relatar `measured_j` e dólares por tarefa resolvida por índice de tarefa, e o índice de cruzamento.

**Proposição E2 (o preço segue o piso).** Onde uma capacidade de programação é coberta por recuperação e regras, seu preço de mercado cai em direção à energia para executá-la mais o custo da prova. *Protocolo:* acompanhar ao longo do tempo os preços de tabela de uma classe de capacidade coberta contra sua energia de execução medida, à maneira da série de preços do corretor ortográfico.

**Proposição E3 (a escala de computação não é um fosso nas tarefas cobertas).** Nas tarefas que o segundo caminho cobre, a taxa de resolução não sobe com a computação da última engrenagem. *Protocolo:* executar o [Protocolo 8.2 do RCE](/papers/rce/#82-swe-bench-lite-offline) sem modelo, com um modelo local pequeno e com um modelo de fronteira como última engrenagem. Comparar as taxas de resolução nas tarefas fechadas antes da última engrenagem.

**Proposição E4 (a parcela de tokens na receita).** Num repositório em que a cobertura cresce, a parcela do custo da tarefa paga como tokens cai com a cobertura. *Protocolo:* registrar tokens, joules e dólares por tarefa fechada por rodada no protocolo de convergência do RCE com um resolvedor de modelo pago ([RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n)), rotulados, e relatar a parcela de tokens no custo por rodada.

**Proposição E5 (cobertura).** A parcela do volume real de tarefas de programação que cai em classes cobertas pelo segundo caminho é mensurável. *Protocolo:* sortear uma amostra aleatória de pull requests mesclados de repositórios públicos (o GitHub relata 518.7 milhões mesclados em um ano [17]), classificar cada um conforme as engrenagens congeladas G0 a G2 produzam ou não um patch que passe pela porta, e relatar a fração coberta com um intervalo de 95%. Enquanto esse número não existir, a Proposição E0 se aplica a uma parcela não medida.

## Referências
