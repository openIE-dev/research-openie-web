<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*Versão 1.1, 11 de outubro de 2026. Dados e código: [research.openie.dev/data/](/data/#economics). PDF em LaTeX: [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([fonte](/pdfs/latex/ai-coding-market.tex)).*


## Resumo

As previsões dizem que a programação com IA valerá trilhões de dólares por ano. Este ensaio lista quem diz isso, rotula cada número pelo que ele é e nomeia as suposições que as previsões compartilham.

**Em palavras simples**

1. Os grandes números sobre a programação com IA são, em sua maioria, palpites sobre o futuro, não contagens de dinheiro já ganho.
2. Quase todos supõem que cada novo trecho de código precisa de um grande modelo de IA, pago por palavra, para sempre.
3. Se o código que funciona puder ser guardado e reutilizado, o custo de um trabalho repetido cai em direção ao custo da eletricidade para executá-lo, e essas previsões seriam altas demais.

## 1. Projeções e medições são objetos diferentes

Cada número abaixo leva um de cinco rótulos.

| Rótulo | Significado |
|---|---|
| **Projeção** | Uma previsão ou uma estimativa de valor construída sobre suposições declaradas |
| **Relatado pela empresa** | Um número que uma empresa declara sobre si mesma, como a receita anualizada (o último mês vezes doze) ou uma avaliação de financiamento |
| **Estimativa de pesquisa** | Um número de dimensionamento de mercado vindo de uma pesquisa com compradores |
| **Registrado** | Um número de um documento entregue a um regulador |
| **Medido** | Uma contagem ou uma leitura de energia de uma execução cujos artefatos são guardados. As leituras de energia levam um de três rótulos: `est_j` para uma estimativa analítica, `reported_j` para um contador do sistema operacional ou do chip, `measured_j` para um medidor de potência externo |

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
| Receita anualizada da Anthropic | 14 bilhões de dólares | 12 de fevereiro de 2026 | Relatado pela empresa | Anthropic [6] |
| Receita anualizada do Claude Code | mais de 2.5 bilhões de dólares | 12 de fevereiro de 2026 | Relatado pela empresa | [6] |
| Série G da Anthropic | 30 bilhões de dólares a 380 bilhões post-money | 12 de fevereiro de 2026 | Relatado pela empresa | [6] |

A Anthropic declara que a rodada financia "expansões de infraestrutura" [6]. Receita, avaliação e computação são uma única aposta.

A Figura 1 coloca num só eixo os valores em dólares das Seções 2.1 a 2.3 e 2.6, marcados pelo rótulo que cada fonte traz.

![Gráfico de pontos em escala logarítmica dos valores em dólares das tabelas do ensaio. Projeções: contribuição dos desenvolvedores de cerca de 3 trilhões de dólares, valor da IA generativa de 2.6 a 4.4 trilhões, gasto mundial com IA de 1.5 trilhão, mercado de ferramentas de código com IA de 9.35 bilhões em 2026 e 29.96 bilhões em 2031. Estimativa: investimento de capital acima de 400 bilhões. Estimativas de pesquisa: gasto empresarial com IA generativa de 37 bilhões e gasto com ferramentas de programação com IA de 4.0 bilhões. Relatado pela empresa: receita anualizada do Claude Code acima de 2.5 bilhões e do Cursor acima de 1 bilhão.](/figures/ai-coding-market/spend-by-label.svg)

*Figura 1. Valores em dólares por rótulo. Figura de dados, escala logarítmica. Fontes: Appenzeller e Li [1], Menlo Ventures [2], Mordor Intelligence [3], Cursor [5], Anthropic [6], IEA [10], McKinsey [15], Gartner [24]. Há uma [cópia em PNG](/figures/ai-coding-market/spend-by-label.png).*

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

A Figura 2 traça a série de tokens.

![Gráfico de linhas em escala logarítmica dos tokens processados por mês no Google: 9.7 trilhões em 2024, cerca de 480 trilhões em 2025 e mais de 3.2 quatrilhões em maio de 2026, relatado pela empresa.](/figures/ai-coding-market/tokens.svg)

*Figura 2. Tokens processados por mês no Google. Figura de dados, relatado pela empresa, escala logarítmica. Fonte: Pichai [8]; a nota sobre o uso de tokens é de Bai, Huang e Wang [9]. Há uma [cópia em PNG](/figures/ai-coding-market/tokens.png).*

### 2.5 Preço por token

| Afirmação | Número | Rótulo | Fonte |
|---|---|---|---|
| Custo de um nível fixo de desempenho de IA | queda de cerca de 47% por trimestre, cerca de 13 vezes por ano, desde 2023 | Série de preços medida (cinco benchmarks) | Epoch AI [4] |
| Preço para atingir uma pontuação fixa de benchmark | cai de 9 a 900 vezes por ano, conforme o marco; as quedas mais rápidas são as mais recentes e as menos certas de persistir | Série de preços medida (ajustes log-lineares) | Epoch AI [34] |
| Custo de inferência a desempenho equivalente | queda de cerca de 10 vezes por ano: de 60 dólares por milhão de tokens em 2021 para 0.06 dólar | Estimativa | Appenzeller, a16z [20] |
| Corte de preço da API da DeepSeek, 29 de setembro de 2025 | custo dos desenvolvedores "reduzido em mais de 50%" | Relatado pela empresa | DeepSeek [21] |

As 13 vezes por ano de [4] são um ponto numa faixa ampla [34]. A queda é movida pela concorrência e pelos pesos abertos, como mostra o corte da DeepSeek [21]. Ela não precisa de contabilidade de energia. Essa é a primeira das duas quedas da Seção 5. A reutilização acrescenta outra, diferente: as chamadas por tarefa.

A Figura 3 desenha as duas séries de preços.

![Gráfico em escala logarítmica do preço por milhão de tokens com capacidade fixa. Uma estimativa da a16z cai de 60 dólares em 2021 para 0.06 dólar em 2024, cerca de dez vezes por ano. Uma inclinação tracejada da Epoch AI, de cerca de treze vezes por ano desde 2023, é desenhada indexada a dez dólares em 2023.](/figures/ai-coding-market/price-trend.svg)

*Figura 3. Preço de um nível fixo de capacidade. Figura de dados, escala logarítmica: os extremos da a16z são os publicados [20]; a linha da Epoch AI é a taxa declarada de cerca de 13 vezes por ano desde 2023 [4], indexada a um início arbitrário só para mostrar a inclinação. A faixa por marco vem da Epoch AI [34]. Há uma [cópia em PNG](/figures/ai-coding-market/price-trend.png).*

### 2.6 Energia e capital

| Afirmação | Número | Rótulo | Fonte |
|---|---|---|---|
| Eletricidade de data centers, 2024 | cerca de 415 TWh, cerca de 1.5% da eletricidade mundial | Estimativa | IEA, *Energy and AI* [11] |
| Eletricidade de data centers, 2030 | cerca de 945 TWh, cenário base | Projeção | [11] |
| Eletricidade de data centers, 2025 a 2030 | de 485 TWh a 950 TWh, cerca de 3% da demanda mundial | Estimativa e projeção | IEA, *Key Questions on Energy and AI* [10] |
| Investimento de capital das maiores empresas de tecnologia | mais de 400 bilhões de dólares em 2025, com alta esperada de mais 75% em 2026 | Relatado e projetado | [10] |
| Investimento de capital da Alphabet | 31 bilhões de dólares em 2022; cerca de 180 a 190 bilhões esperados em 2026 | Relatado pela empresa e orientação | Pichai [8] |
| Energia por tarefa | queda de pelo menos uma ordem de grandeza por ano; tarefas de raciocínio e agênticas usam "centenas ou milhares de vezes mais energia por consulta do que a geração simples de texto" | Estimativa | [10] |
| Um prompt de texto mediano a um assistente em produção | 0.24 Wh | Medido pelo operador | Elsworth et al. [12] |
| Stargate | 500 bilhões de dólares em quatro anos em infraestrutura de IA para um laboratório, 100 bilhões aplicados de imediato | Anunciado pela empresa | OpenAI [22] |
| Gasto mundial com IA, 2025 | cerca de 1.5 trilhão de dólares | Projeção | Gartner [24] |
| Receita que o investimento de capital precisa recuperar | "AI's \$600B question" | Análise | Sequoia Capital [23] |

O aluguel que precisa ser pago é aluguel de hardware. Investimentos e compromissos desse tamanho são pagos por meio de uso precificado acima de sua energia. Nas tarefas que podem ser fechadas por reutilização, essa base é menor.

### 2.7 Evidência de produtividade

| Estudo | n | Desenho | Efeito | Fonte |
|---|---|---|---|---|
| Ensaio da a16z | entrevistas | Estimativa | cerca de 20% para um assistente simples; "pelo menos o dobro" no melhor da categoria | [1] |
| GitHub Copilot, tarefa de servidor HTTP | desenvolvedores recrutados | Experimento controlado | 55.8% mais rápido numa tarefa de brinquedo | Peng et al. [27] |
| Teste empresarial do Google | 96 engenheiros | Ensaio controlado randomizado | cerca de 21% menos tempo na tarefa | Paradis et al. [28] |
| METR, início de 2025 | 16 desenvolvedores experientes de código aberto, 246 tarefas | Ensaio controlado randomizado | 19% mais lentos com IA | Becker et al. [25] |
| METR, atualização de 2026 | nova coorte | Ensaio controlado randomizado | os autores chamam os novos dados de "um sinal pouco confiável" | METR [26] |

Os efeitos medidos vão de uma desaceleração de 19% a uma aceleração de 56% numa tarefa de brinquedo. Os dois fatores da estimativa de valor, a contagem de desenvolvedores e o múltiplo de produtividade, são frágeis. Isso enfraquece o trilhão. Também significa que qualquer valor liberado por uma programação mais barata não é um número conhecido.

## 3. O que as projeções supõem

Lidas em conjunto, as projeções se apoiam em quatro suposições. Cada uma é uma afirmação sobre uma direção do espaço de projeto, não sobre o valor do software.

1. **Uma direção: geração.** Toda mudança é escrita por um modelo. A estimativa de valor escala a produtividade pelo modelo, e a ilustração de custo precifica cada consulta [1].
2. **Alta energia e alta computação.** Volume de tokens, eletricidade de data centers e investimento de capital devem crescer juntos [8, 10, 11]. A energia por consulta cai, e os tokens por tarefa sobem mais depressa [9, 10].
3. **Aluguel por token.** A receita é cobrada por token ou por licença cujo custo são tokens. O custo anual de tokens de um desenvolvedor é projetado na escala de um salário [1].
4. **IA no loop para sempre.** A tarefa 10,000 custa o mesmo que a tarefa 1, porque nada do que o modelo aprendeu na tarefa 1 roda sem o modelo na tarefa 10,000.

O ensaio que enuncia o trilhão também enuncia seu limite: "embora o preço por substituição funcione em mercados iniciais, no fim o custo de um bem converge para seu custo marginal, e o preço também" [1]. Este ensaio concorda, e pergunta qual é o custo marginal de uma tarefa de programação correta.

## 4. Quanto custa uma tarefa correta

Defina, para uma tarefa de programação, $C \in \{0, 1\}$ como o resultado de sua verificação de aceitação (os testes passam, uma prova é verificada ou uma saída coincide com uma referência), $J$ como a energia usada para chegar a $C = 1$, em joules, $c_J$ como o preço da energia, em dólares por joule, e $c_{\text{check}}$ como o custo de executar a verificação, em dólares. Um comprador paga por $C = 1$, não por tokens.

**A energia limita o custo marginal.** O custo marginal de uma execução é de pelo menos $c_J J$, já que a eletricidade precisa ser comprada. Sob concorrência, o preço tende ao custo marginal [1, 14].

**Muito código é reutilizado.** Gurevich provou que todo algoritmo sequencial é capturado por uma máquina de estados abstrata sequencial: um conjunto de estados e uma regra de transição [35]. Lopes e colegas mediram que cerca de 70% do código no GitHub consiste em clones de arquivos criados anteriormente [36]. Onde já existe uma solução que passa, uma tarefa pode ser fechada recuperando-a e verificando-a, em vez de gerá-la de novo.

**Proposição E0 (preço de uma tarefa coberta).** Diga-se que uma tarefa está coberta quando uma solução armazenada passa em sua verificação. Seja $J_{\text{floor}}$ a energia para recuperar, aplicar e verificar essa solução. Sob concorrência entre vendedores cujos resultados passam na mesma verificação, o preço de uma tarefa coberta tende a

$$p_{\text{covered}} \to c_J \, J_{\text{floor}} + c_{\text{check}}.$$

A geração só é necessária nas tarefas não cobertas. Para um fluxo de tarefas com fração coberta $f \in [0, 1]$ e custo médio de geração $p_{\text{gen}}$ nas tarefas não cobertas, o preço esperado por tarefa é $\bar p = f \, p_{\text{covered}} + (1 - f) \, p_{\text{gen}}$. A fração $f$ ainda não foi medida (Proposição E4).

## 5. Onde as projeções são frágeis

**Preço por token.** Uma tarefa fechada por reutilização não precisa de tokens, de modo que uma linha de receita precificada por token não ganha nada com ela. A receita total de tokens num fluxo de tarefas escala com $1 - f$.

**O modelo em cada loop.** Se uma solução encontrada uma vez é armazenada e verificada, as tarefas posteriores da mesma forma não precisam do modelo, de modo que as chamadas a modelo por tarefa caem à medida que $f$ cresce. Se isso acontece no trabalho real é o que a Proposição E3 mede.

**Energia por tarefa.** Um prompt de texto mediano a um assistente em produção é medido por seu operador em 0.24 Wh, ou 864 J [12], e a IEA situa as consultas de raciocínio e agênticas em centenas ou milhares de vezes a energia de uma consulta simples [10]. Nenhuma medição pública compara geração e recuperação nas mesmas tarefas, de modo que nenhuma razão é enunciada aqui.

**Duas quedas se multiplicam.** Escreva o custo por tarefa como $p = n \cdot q$, com $n$ chamadas a modelo por tarefa e $q$ dólares por chamada. O preço por chamada a desempenho fixo cai por um fator de 9 a 900 por ano, conforme a tarefa [4, 34]. A reutilização reduz $n$. Uma projeção que extrapola o volume de tokens modela apenas $q$.

**Empacotamento.** Um bem cujo custo marginal é próximo de zero, e que complementa uma ferramenta que as pessoas já têm, tende a ser empacotado nessa ferramenta, e seu preço separado desaparece [13, 14]. Nalebuff mostrou que um pacote pode dissuadir a entrada [32], e Adams e Yellen, que ele pode discriminar preços [33]; Spolsky descreveu a estratégia de transformar um complemento em commodity [31]. As mudanças de preço são visíveis: o GitHub passou os planos individuais do Copilot para cobrança por uso a partir de 1 de junho de 2026 [30], e o Cursor passou o Pro de limites de requisições para preços de API repassados em 2025 [18].

**O que sobrevive.** A estimativa de valor da Seção 2.1 pode se sustentar. O que é frágil é a suposição de que o valor é cobrado como uma tarifa sobre a geração, já que essa tarifa só se aplica à fração $1 - f$.

## 6. Demanda

Tarefas mais baratas podem aumentar a demanda total. O ensaio de capital de risco espera isso: "we believe Jevon's Paradox in this case holds" [1]. Dois efeitos devem ser separados. A demanda por uma tarefa para assim que $C = 1$. O uso total ainda pode crescer, porque um trabalho mais barato abre tarefas novas. A única elasticidade publicada é pequena. Entre as tarefas da amostra da API da Anthropic, cada aumento de 1% no custo está associado a uma redução de 0.29% na frequência de uso, uma elasticidade de $\varepsilon \approx -0.29$ [29]. Trata-se de uma relação transversal entre tarefas, não de uma mudança de preço ao longo do tempo. Com $|\varepsilon| < 1$, uma queda de preço sobre um conjunto fixo de tarefas reduz a receita, já que a receita $R = pQ$ varia segundo $dR/R = (1 + \varepsilon)\, dp/p$.

## 7. Proposições e protocolos

**Proposição E1 (as curvas de custo se cruzam).** Para um fluxo de tarefas num repositório, o custo acumulado por tarefa resolvida de um método que armazena e reutiliza soluções verificadas fica abaixo do de um método que gera cada mudança, após um número finito de tarefas. *Protocolo:* executar ambos sobre o mesmo fluxo de issues sob um medidor de potência externo. Relatar `measured_j` e os dólares por tarefa resolvida segundo o índice da tarefa, e o índice de cruzamento.

**Proposição E2 (o preço segue o piso).** Onde uma capacidade de programação pode ser fechada por recuperação e regras, seu preço de tabela cai em direção a $c_J J_{\text{floor}} + c_{\text{check}}$. *Protocolo:* acompanhar ao longo do tempo os preços de tabela de uma classe de capacidade desse tipo em comparação com sua energia de execução medida.

**Proposição E3 (a parcela de tokens no custo).** Num repositório onde a reutilização cresce, a parcela do custo da tarefa paga em tokens cai. *Protocolo:* registrar tokens, joules e dólares por tarefa fechada e por rodada, e relatar a parcela de tokens no custo por rodada.

**Proposição E4 (cobertura).** A fração coberta $f$ do volume real de tarefas de programação é mensurável. *Protocolo:* extrair uma amostra aleatória de pull requests mesclados de repositórios públicos (o GitHub relata 518.7 milhões mesclados em um ano [17]), testar em cada um se existe uma solução recuperada que passa nos testes do repositório, e relatar $f$ com um intervalo de Wilson de 95%.

## Referências
