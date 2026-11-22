---
title: "\"IA\" lê humano: codificação em linguagem humana na velocidade da máquina e o custo de energia"
deck: "Trabalho em andamento. Por que grande parte do que as máquinas trocam é escrita para pessoas, qual é o custo disso em bytes, tokens, tempo e energia de rusage do kernel por processo no Apple Silicon (`reported_j`) ao longo de 34 cargas de trabalho de análise sintática e tokenização, e por que a energia medida por um medidor externo de potência (`measured_j`) permanece em aberto."
lang: "pt"
source: "ai-reads-human"
complete: true
---

<div id="ai-reads-human-human-language-encoding-at-machine-speed-and-the-energy-cost" class="anchor-alias" aria-hidden="true"></div>

*Em andamento, revisão af57f48, 22 de novembro de 2026. Observatório interativo, dados, código e registro de leitura: [research.openie.dev/living/ai-reads-human/](/living/ai-reads-human/). Termos compartilhados: [glossário](/glossary/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Agentes de software trocam dados em formatos feitos para leitura humana, como JSON, YAML, Markdown, XML e CSV. Este estudo nomeia o trabalho extra que isso causa, o *imposto de impedância* (impedance tax), define-o com unidades e mede três de suas parcelas em um corpus semeado de 20.000 registros: tempo de análise (parse), contagem de tokens em cinco tokenizadores abertos e os contadores `reported_j` de canal duplo do Apple M5 Max, do sistema operacional e do chip, em todas as 34 cargas de análise e `tiktoken` (seção 5c). Uma tentativa inicial, não isolada, em todo o chip, em dois notebooks ocupados, não conseguiu separar a análise da deriva de cargas concorrentes em segundo plano (seção 5b). Ao isolar cada carga de trabalho em um subprocesso de trabalho dedicado, usando `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` do kernel macOS por processo (`L3`, rótulo `D`), obtém-se uma amplitude de energia de análise de `2.053,8×`, que vai de `280,4 nJ/registro` para binário de formato fixo (`struct.iter_unpack`) até `2.212,1 nJ/registro` para JSON da biblioteca padrão (`7,89×`), `69.922,1 nJ/registro` para YAML em C com `libyaml` (`249,4×`) e `575.799,3 nJ/registro` para YAML puramente em Python (`2.053,8×`). Também se mostra que a tokenização `cl100k_base` de JSON compacto (`27.679,2 nJ/registro`, `98,7×` o binário de formato fixo) consome `12,5×` o `reported_j` do próprio `json.loads()` no chip. Ao mesmo tempo, o `IOReport` em todo o chip (`L2`, rótulo `A2`) acionou o Falsificador 6 (deriva da linha de base ociosa antes/depois `> 5,0%`) em `109` de `170` janelas de medição em hosts compartilhados, o que confirma por que a subtração de pacote não isolada falha em hosts ativos. Nenhuma sonda externa de potência em linha ou medidor de parede foi conectada (`measured_j = None`, `board_metered = false`), e os joules de prefill/decodificação de modelos em GPU permanecem planejados (M4).

**Em palavras simples**

1. Computadores e pessoas frequentemente usam o mesmo formato escrito. Esse formato é fácil de ler para pessoas, mas o computador precisa realizar trabalho extra para lê-lo de volta.
2. No nosso corpus de teste de 20.000 registros, ler binário de formato fixo (`struct.iter_unpack`) custou `280,4 nJ/registro` no contador por processo `ri_energy_nj` do kernel do Apple M5 Max (`reported_j`), em comparação com `2.212 nJ/registro` (`7,89×`) para o leitor JSON embutido do Python, `69.922 nJ/registro` (`249,4×`) para YAML acelerado em C e `575.799 nJ/registro` (`2.053,8×`) para YAML puramente em Python.
3. Tokenizar JSON compacto para um modelo de IA com `tiktoken` (`cl100k_base`) custou `27.679 nJ/registro` (`1,69×` a tokenização de CSV e `12,5×` a própria análise com `json.loads()`), antes de o modelo de linguagem executar qualquer multiplicação de matrizes. Todas as cifras de energia desta página são contadores `reported_j` do kernel/chip (`measured_j = None`, `board_metered = false`); a energia de prefill/decodificação de modelos em GPU e as sondas externas de potência de hardware ainda estão planejadas.

> **Status: trabalho em andamento, que será ampliado.** Seções marcadas como *Planejado* (como os contadores de prefill/decodificação em GPU M4, os corpora em linguagem natural M6 e os analisadores C/Rust entre linguagens M8) ainda não foram concluídas. Todos os números desta página são recalculados a partir de arquivos disponíveis para download em `/living/ai-reads-human/`. Os contadores de energia do chip são estritamente `reported_j` (`measured_j = None`, `board_metered = false`).

<div id="1-background-formats-written-for-people" class="anchor-alias" aria-hidden="true"></div>

## 1. Contexto: formatos escritos para pessoas

A maior parte dos dados que agentes trocam hoje viaja em formatos cujas especificações colocam as pessoas à frente das máquinas. As passagens citadas abaixo foram lidas para esta página; o status de leitura de cada fonte (FULL, PARTIAL ou UNAVAILABLE) está no [registro de leitura](/living/ai-reads-human/READ_LEDGER.md).

- **TeX** começou em 1982: o arquivo fonte `tex.web` (cabeçalho, primeiros 19,000 bytes lidos; PARTIAL) registra que a versão 0 foi lançada em setembro de 1982 e data versões posteriores a partir da 3.0 (março de 1990) em diante.
- **Markdown** foi desenvolvido por John Gruber com ajuda de Aaron Swartz e lançado em 2004 como uma descrição de sintaxe e um script Perl que converte para HTML; a especificação CommonMark (versão 0.31.2, 28 de janeiro de 2024) afirma que a descrição "não especifica a sintaxe de forma inequívoca" e lista questões que deixa em aberto (CommonMark 0.31.2, seções 1.1 e 1.2).
- **CSV** foi documentado em outubro de 2005 pelo RFC 4180, um RFC *informativo* que diz "não existe especificação formal" e descreve o que a maioria das implementações parece fazer.
- **JSON** é definido pelo RFC 8259 (dezembro de 2017, substituindo o RFC 7159) como "um formato de intercâmbio de dados leve, baseado em texto, independente de linguagem". O RFC 7493 (março de 2015, I-JSON) o restringe para protocolos.
- **Formas canônicas e binárias** também existem no registro de padrões: o RFC 8785 (junho de 2020) define um Esquema de Canonicalização JSON, e o RFC 8949 (dezembro de 2020, substituindo o RFC 7049) define CBOR, um formato de dados binário com uma seção sobre codificação determinística (seção 4.2) que os protocolos podem adotar.
- **YAML** revisão 1.2.2 (1 de outubro de 2021) lista seus objetivos de design "em prioridade decrescente", e o objetivo de maior prioridade é "YAML deve ser facilmente legível por humanos" (seção 1.1).

![Cronologia das especificações datadas lidas para este tópico](/living/ai-reads-human/charts/format-timeline.svg)

*Figura 1. Datas impressas nos documentos listados no registro de leitura. Gerado por `scripts/make_charts.py`.*

Esses fatos não afirmam que formatos legíveis por humanos são erros. Eles afirmam que a legibilidade por pessoas foi um objetivo de design declarado, e que o custo de lê-los de volta por máquina não foi aquilo que se buscava minimizar. Onde outros trabalhos chegam a formas orientadas à máquina (CBOR, JSON canônico, Protocol Buffers, Avro, safetensors, GGUF), este estudo registra isso como uma observação de convergência: diversas comunidades chegaram a codificações fixas ou determinísticas para intercâmbio de máquina enquanto mantêm texto para pessoas.

<div id="2-the-impedance-tax-defined" class="anchor-alias" aria-hidden="true"></div>

## 2. O imposto de impedância, definido

Seja um conjunto de registos R que transporta informação necessária a um consumidor máquina. Seja F um formato com codificador enc_F e descodificador dec_F, e seja M uma forma máquina canónica: uma cadeia de bytes válida por valor.

| Símbolo | Significado | Unidade |
|---|---|---|
| B_F | tamanho codificado de R no formato F | byte |
| N | número de registos | 1 |
| k | um tokenizador | n/a |
| T_{F,k} | tokens produzidos por k sobre a codificação de R | token |
| d_{F,k} = B_F / T_{F,k} | bytes por token | byte/token |
| t_parse(F) | tempo de parede para descodificar R em valores na memória | s |
| P | potência média durante uma operação | W = J/s |
| E | energia de uma operação, E = ∫ P dt, aproximadamente P_avg · t | J |
| e_prefill | energia do modelo por token de entrada | J/token |

O **imposto de impedância** de F em relação a M é a energia adicional que um consumidor gasta porque a informação chega em F:

Z(F) = E_enc(F) + E_parse(F) + E_tok(F,k) + e_prefill · T_{F,k} + E_ctx(F)

τ(F) = Z(F) − Z(M)  (joules),  θ(F) = Z(F) / Z(M)  (adimensional)

E_ctx(F) é o custo de descodificação adicional que um contexto mais longo provoca; o seu coeficiente depende do modelo e constitui um alvo de medição (M4 abaixo). A secção 5c mede `E_parse(F)` e `E_tok(F,k)` em `reported_j` (`ri_energy_nj`) do núcleo por processo em Apple M5 Max.

Três razões adimensionais podem ser medidas sem qualquer contador de energia:

- razão de bytes β_F = B_F / B_ref
- razão de tokens κ_{F,k} = T_{F,k} / T_{ref,k}
- razão de tempo de análise π_F = t_parse(F) / t_parse(ref)

e estão ligadas por uma identidade que os números de tokens abaixo obedecem:

κ_F = β_F · (d_ref / d_F)

pelo que um formato pode custar mais tokens por ter mais bytes, por os seus bytes se dividirem em mais fragmentos, ou por ambas as razões.

![Onde o imposto de impedância é pago: codificar, transportar, analisar, tokenizar, leitura do modelo](/living/ai-reads-human/charts/impedance-pipeline.svg)

*Figura 2. Os termos de Z(F). Sem modelo no caminho (máquina para máquina) aplicam-se apenas codificação, transporte e análise. Com um modelo a ler texto, aplicam-se tokenização e leitura.*

<div id="21-physical-scale-and-what-this-page-does-not-claim" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Escala física e o que esta página não afirma

O piso termodinâmico para apagar um bit à temperatura T é o limite de Landauer, E = k_B T ln 2. Com k_B = 1,380649e-23 J/K (exato pela definição do SI de 2019; o valor foi conferido em 18 de outubro de 2026 contra a página do NIST CODATA 2022 para a constante de Boltzmann) e T = 300 K, isso resulta em **2,871e-21 J** por bit, recalculado em `scripts/verify_numbers.py`. Oito bits correspondem a 2,297e-20 J. Trata-se de um limite inferior para lógica irreversível, e não de uma estimativa do custo de análise sintática: o software real consome ordens de grandeza mais, em tráfego de memória, execução de instruções e resfriamento. Esta página não usa o limite para prever nenhum número.

As cifras de energia para inferência de modelos provêm de medições de outros autores em seus próprios equipamentos e servem apenas como contexto, não como medição nossa:

- Samsi et al., "From Words to Watts: Benchmarking the Energy Costs of Large Language Model Inference" (arXiv:2310.03003), definem a energia por token de saída como a energia total da GPU dividida pelo número de tokens de saída decodificados, e relatam cerca de 3 a 4 J por token de saída para um modelo LLaMA de 65 bilhões de parâmetros, com comprimento máximo de geração de 512, medidos com NVIDIA DCGM na infraestrutura MIT SuperCloud (GPUs V100 para as execuções com 8, 16 e 32 fragmentos). Esse artigo não separa a energia do preenchimento (prefill) da energia da decodificação.
- Luccioni, Jernite e Strubell, "Power Hungry Processing: Watts Driving the Cost of AI Deployment?" (ACM FAccT 2024, DOI 10.1145/3630106.3658542), mediram a energia por 1.000 inferências, por tarefa, com CodeCarbon em um nó com 8 GPUs A100; sua Tabela 2 relata média de 0,002 kWh para classificação de texto e 0,047 kWh para geração de texto. Esses números foram conferidos contra a Versão Corrigida Oficial V1.1 da ACM (6 de novembro de 2024), que apresenta os mesmos valores da Tabela 2 e a mesma configuração (8 GPUs A100 80GB na AWS, com CodeCarbon). Cita-se a V1.1: o artigo observa que uma versão anterior utilizou 0,012 kWh em uma comparação. O restante do artigo foi lido apenas em parte.

Uma cifra de energia por leitura de palavra na DRAM (amplamente citada como 640 pJ por leitura de 32 bits) **não é usada nesta página**. Sua fonte atribuída, Horowitz (2014), foi consultada: o artigo indica cerca de 1 a 2 nJ por acesso à DRAM, e os slides da palestra plenária, de 1,3 a 2,6 nJ por acesso de 64 bits; a cifra de 640 pJ aparece apenas em slides posteriores que a citam. A Seção 9 registra essa situação.

<div id="3-what-was-measured" class="anchor-alias" aria-hidden="true"></div>

## 3. O que foi medido

As linhas de base de tempo de análise inicial e contagem de tokens foram executadas em uma máquina virtualizada Intel Xeon (8 vCPU, Linux 6.12, Python 3.13.5), que não possui contadores de energia RAPL (`/sys/class/powercap` está ausente), seguidas pelas campanhas de energia Apple M5 Max relatadas nas seções 5b e 5c. O corpus é sintético e semeado (`scripts/gen_corpus.py`, semente 20261016): 20.000 registros, cada um com um id, um nome de três palavras, um escore em ponto flutuante, um booleano, três etiquetas e um inteiro de 31 bits.

![Um registro em cinco codificações](/living/ai-reads-human/charts/one-record-five-ways.svg)

*Figura 3. Registro 0 em CSV, JSON compacto, YAML, XML e um layout binário fixo de 23 bytes. O layout binário armazena cada palavra como um índice de um byte em uma lista compartilhada de 24 palavras, de modo que a leitura requer essa lista. Contagens de bytes das formas de texto incluem a quebra de linha.*

<div id="31-parse-time" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Tempo de análise

![Tempo de análise por registro: binário fixo 116 ns, JSON stdlib 904 ns, YAML libyaml 85300 ns](/living/ai-reads-human/charts/parse-time-headline.svg)

*Figura 4. Mínimo de 9 repetições sobre 20.000 registros na linha de base Linux Xeon. Fonte: `/living/ai-reads-human/data/parse_time.tsv`, coluna `ns_per_record`. Escala logarítmica.*

| Formato e analisador | ns por registro (Xeon) | razão em relação ao binário fixo |
|---|---|---|
| Binário fixo, `struct.iter_unpack` | 116 | 1,0 |
| JSON, biblioteca padrão do Python | 904 | 7,8 |
| YAML, PyYAML com libyaml | 85.300 | 735,3 |

O YAML demorou 94,4 vezes mais que o JSON da stdlib nos mesmos registros no hospedeiro Xeon (e `22.404 ns` vs `570 ns` = `39,3×` para o C `libyaml`, ou `161.227 ns` = `282,9×` para o YAML puro-Python, no Apple M5 Max na seção 5c). A tabela completa do Xeon com todos os formatos e analisadores testados encontra-se na Figura 5.

![Tempo de análise por registro, todos os formatos testados](/living/ai-reads-human/charts/parse-time-all.svg)

*Figura 5. Todas as linhas de `data/parse_time.tsv` exceto a linha numpy de cópia zero, que não constrói objetos e não é comparável.*

**Limites desta medição.** (a) Os analisadores realizam trabalhos diferentes: o leitor de binário fixo devolve tuplos, JSON e YAML constroem objetos Python tipados, CSV devolve cadeias de caracteres, e as linhas XML e Markdown constroem árvores ou fluxos de tokens sem converter valores, pelo que as razões comparam o comportamento de ponta a ponta das bibliotecas, e não o custo intrínseco de cada formato. (b) Um único ambiente de execução de linguagem (CPython 3.13). (c) O corpus é sintético e com poucos identificadores. (d) O tempo isolado não é energia: a seção 5c mede, portanto, o `ri_energy_nj` (`reported_j`) do kernel por processo diretamente em todas as 34 cargas de trabalho de análise e tokenização.

<div id="32-tokens" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Tokens

Um modelo de linguagem lê tokens, não bytes. Os mesmos registros, contados com o tokenizador `cl100k_base` nos 2.000 primeiros registros de cada visão (e verificados em todos os 20.000 registros da seção 5c):

![Tokens por registro em relação ao CSV](/living/ai-reads-human/charts/tokens-vs-csv.svg)

*Figura 6. κ = tokens por registro da visão dividido pelos tokens por registro do CSV. Fonte: `/living/ai-reads-human/data/tokens.tsv`.*

| Visão | tokens por registro | κ (em relação ao CSV) |
|---|---|---|
| CSV | 22,9 | 1,00 |
| JSON, compacto | 36,2 | 1,58 |
| YAML | 51,4 | 2,24 |
| JSON, formatado (recuo de 2) | 65,6 | 2,86 |

A identidade da seção 2 se sustenta com estes dados: para o JSON compacto, β = 1,912 e d_CSV/d_JSON = 0,826, resultando em κ = 1,58; para o YAML, 2,028 × 1,107 = 2,24; para o JSON formatado, 3,056 × 0,936 = 2,86. O JSON compacto custa mais tokens principalmente porque possui cerca de 1,9 vez os bytes do CSV, e o JSON formatado, sobretudo pelo mesmo motivo, acrescido do recuo. O YAML tem tanto mais bytes quanto tokens mais curtos.

![Razão de tokens em relação ao CSV sob cinco tokenizadores](/living/ai-reads-human/charts/tokens-five-tokenizers.svg)

*Figura 7. A mesma razão sob os tokenizadores `cl100k_base`, `o200k_base`, GPT-2, Mistral-7B-v0.1 e Qwen2.5-0.5B. A ordenação se mantém nos cinco; a magnitude da diferença não (o JSON formatado equivale a 3,66 vezes o CSV sob o GPT-2 e a 2,22 vezes sob o Qwen2.5). Nenhum tokenizador comercial fechado foi testado.*

![Bytes codificados por registro](/living/ai-reads-human/charts/bytes-per-record.svg)

*Figura 8. Bytes por registro. A figura binária de 23 bytes não inclui a lista compartilhada de palavras; qualquer afirmação honesta sobre o tamanho de uma forma binária deve nomear a lista (ou dicionário) da qual depende, com versão e hash.*

**Um resultado negativo que vale ser declarado.** Escrever o layout binário como texto para um modelo não elimina o custo: em base64 foram 20,3 tokens por registro (κ = 0,89) e em hexadecimal 22,7 (κ = 0,99), aproximadamente o mesmo que o CSV, porque um modelo de texto precisa de uma visão textual. A economia para um modelo vem do envio de menos campos, mais bem escolhidos, e não da mudança na codificação do que é enviado. Essa afirmação é Planejada (M7), não medida.

<div id="4-why-the-hazards-come-with-the-readability" class="anchor-alias" aria-hidden="true"></div>

## 4. Por que os perigos acompanham a legibilidade

Formatos projetados para pessoas e para programas frouxamente acoplados permitem que uma mesma entrada signifique coisas diferentes para leitores distintos. A tabela lista os perigos encontrados nas especificações lidas, e em testes executados nas versões de bibliotecas nomeadas (Python 3.13.5, Node v20.19.2, jq 1.7, PyYAML 6.0.2, lxml 6.1.3). Linhas de teste (T, U, X, Y, códigos C) estão em `tests-formats/RESULTS.txt` e descrevem somente essas versões. "Spec" significa o texto do documento citado.

| Classe | Formato | Perigo | Evidência |
|---|---|---|---|
| Ambiguidade | JSON | Nomes de membros duplicados geram comportamento “imprevisível”; as implementações relatam o último, todos ou falham. Três ferramentas testadas mantiveram o último valor. | RFC 8259 secção 4; T1 |
| Ambiguidade | Markdown | A descrição original não especifica a sintaxe de forma inequívoca; os dialetos divergiram. | CommonMark 0.31.2 secção 1.2 |
| Diferença de analisadores | Números JSON | 9007199254740993 é exato em Python e arredonda para ...992 em Node. | RFC 8259 secção 6; T2 e N2 |
| Diferença de analisadores | JSON | O `json` do Python aceita `NaN` e `Infinity` isolados, o que a especificação não permite. | RFC 8259 secção 6; T6 |
| Formas não canónicas | JSON | `1`, `1.0`, `1e0`, `10E-1`, `0.1e1` são um número escrito de cinco maneiras e dois tipos Python. | U3 |
| Formas não canónicas | JSON | A ordem dos membros não altera o significado, mas altera os bytes e qualquer hash deles. | T8 |
| Ordenação | Canonicalização de JSON | A ordenação por unidades de código UTF-16 difere da ordem por pontos de código para U+1F600 versus U+FFEE. | RFC 8785 secção 3.2.3; U2 |
| Formas não canónicas | CBOR | A codificação determinística é um perfil opcional que os protocolos podem adotar; não é o padrão. | RFC 8949 secção 4.2 |
| Formas não canónicas | Protocol Buffers | “Não assuma que a saída de bytes de uma mensagem serializada é estável.” | Guia de codificação do Protobuf, “Implicações” |
| Perigos numéricos | JSON | As implementações podem limitar o intervalo e a precisão; o intervalo de inteiros exatamente representáveis é ±(2^53)−1. | RFC 8259 secções 6 e 9; RFC 7493 secção 2.2 |
| Perigos numéricos | JSON | `1e400` torna-se `inf` tanto em Python como em Node; `-0` é tratado de forma diferente. | T3, N3, T4, N4 |
| Perigos numéricos | Resolvedor YAML 1.1 | No PyYAML, `010` é 8, `12:30:45` é 45045 e `country: NO` é `{country: False}`. | Linhas Y |
| Perigos numéricos | TOML | A especificação diz que um inteiro que não pode ser armazenado sem perda é um erro; o `tomllib` do Python aceitou 2^63. | TOML 1.0.0; linhas T |
| Unicode | JSON | `"\uDEAD"` (substituto não emparelhado) é permitido pela gramática; analisa, depois falha na codificação UTF-8. | RFC 8259 secção 8.2; T5 |
| Unicode | JSON | As formas NFC e NFD do mesmo texto são chaves distintas. | U1 |
| Injeção | CSV | Uma célula que começa com `=` é dado simples para o analisador e uma fórmula para alguns programas de folha de cálculo. | OWASP CSV Injection; linha C |
| Injeção | XML | Com resolução de entidades ativada, o lxml leu um ficheiro local através de uma entidade externa. | Linhas X |
| Explosão de recursos | YAML | 166 bytes de aliases expandiram-se para 59.049 folhas lógicas. | Teste de alias Y |
| Explosão de recursos | XML | 202 bytes de entidades internas expandiram-se para 10.000 caracteres (49,5 vezes). | Linhas X |
| Explosão de recursos | JSON | Os limites de profundidade são definidos pela implementação; o Python levantou `RecursionError` em 100.000 níveis de aninhamento. | RFC 8259 secção 9; T9 |
| Totalidade | qualquer analisador | Exceções de biblioteca são fluxo de controlo fora do tipo de retorno da função. | T5, T9 |

Nenhuma dessas razões justifica evitar os formatos voltados para pessoas. Cada uma delas indica, na verdade, que o mesmo texto não deve ser usado como a única autoridade na comunicação entre máquinas.

<div id="5-planned-measuring-energy" class="anchor-alias" aria-hidden="true"></div>

## 5. Planejado: medindo energia

A trilha de medição separa contadores `reported_j` de análise/tokenização concluídos de inferência GPU aberta e sondas de potência de hardware externo:

| ID | Medição | Status |
|---|---|---|
| M1, M2, M3 | Tempo de análise, tokens, taxa de tokenizador | **Concluído** (`data/parse_time.tsv`, `data/tokens.tsv`, `data/tokenize_time.tsv`) |
| M5 | Análise e energia `tiktoken` em todas as 34 cargas de trabalho via Apple M5 Max de canal duplo `reported_j` (`L3` por processo `ri_energy_nj` + `L2` chip inteiro `IOReport` com Falsifier 6 idle-drift gating) | **Concluído para `reported_j`** (section 5c; `data/energy_reported_j.tsv`; `measured_j = None`, `board_metered = false`) |
| M4 | Energia de pré-preenchimento e energia de decodificação por token em função do comprimento do contexto, mesmo modelo, GPU com contador de energia de hardware ou sonda externa de trilho/parede | Planejado (necessita de contador de GPU dedicado ou sonda de energia inline) |
| M6 | Um segundo corpus: documentação em linguagem natural e logs comparados a telemetria rica em identificadores | Planejado |
| M7 | Nível de tarefa: tokens que um agente precisa para responder a um conjunto fixo de perguntas a partir de uma projeção dos campos necessários versus o documento completo | Planejado |
| M8 | Outros analisadores por formato (simdjson, rapidyaml, libxml2 C, pulldown-cmark) para limitar os efeitos de linguagem e tempo de execução | Planejado |

Leituras externas de tomada de parede ou sonda de energia USB-C inline (`measured_j`) permanecem não coletadas; a seção 5c relata estritamente os contadores `reported_j` do sistema operacional/no chip.

<div id="5b-measured-energy-no-net-effect-resolved" class="anchor-alias" aria-hidden="true"></div>

## 5b. Energia medida: nenhum efeito líquido resolvido

*Primeira tentativa de subtração de todo o chip, executada em 2026-10-18 em dois laptops Apple M5 Max (48 GB em bateria, 128 GB em AC), macOS 27.0.1, Python 3.13.16, contador de energia macmon 0.10.0 (48 GB) e 0.9.0 (128 GB), lendo `IOReport` de todo o SoC e sensores SMC (`all_power` e `sys_power`). Nove cargas de análise nos mesmos 20.000 registos, cada uma em ciclo durante 10 s num fio, 10 rodadas intercaladas, com uma janela de inatividade de 10 s antes e depois de cada rodada. Ficheiros: `/living/ai-reads-human/data/energy_joules.tsv` e amostras brutas em `/living/ai-reads-human/data/energy_raw_m5max48/` e `energy_raw_m5max128/`.*

**Resultado da tentativa não isolada de todo o chip: a subtração do pacote acima do nível de inatividade não conseguiu resolver a análise de fio único num anfitrião ocupado.** Em ambos os laptops (média de carga de um minuto de 41 a 68), a linha de base de inatividade pré/pós moveu-se entre 2 e 7 W entre janelas, enquanto um fio de análise adicionava apenas 1 a 5 W a um chip que consumia 18 a 36 W, deixando todas as médias líquidas dentro de 1,5 erros-padrão de zero (várias negativas). Essa falha motivou o protocolo de canal duplo na secção 5c: emparelhar `IOReport` de todo o chip (`L2`, controlado pelo Falsificador 6 de modo que subtrações líquidas com desvio sejam automaticamente rejeitadas) com `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` por PID do kernel do macOS (`L3`), que atribui a energia da CPU estritamente ao subprocesso de trabalho dedicado que executa cada carga.

<div id="5c-dual-channel-apple-m5-max-reported_j-across-all-34-parse-and-tokenize-workloads" class="anchor-alias" aria-hidden="true"></div>

## 5c. `reported_j` de dois canais no Apple M5 Max em todas as 34 cargas de trabalho de parsing e tokenização

*Executado em 22/11/2026 (`16:44:52` a `16:53:22 UTC`) em Apple M5 Max (`128 GB` de RAM, `macOS 27.2.1` `arm64`, `Python 3.13.14`, `macmon 0.12.0`), corpus semeado `20261016` (`20.000` registros em 12 arquivos fixados por SHA-256), `5` rodadas intercaladas e embaralhadas × `34` cargas de trabalho = `170` janelas de subprocesso worker dedicadas. Arquivos: [`/living/ai-reads-human/data/energy_reported_j.tsv`](/living/ai-reads-human/data/energy_reported_j.tsv) e [`/living/ai-reads-human/data/energy_reported_j_summary.json`](/living/ai-reads-human/data/energy_reported_j_summary.json). Explorador interativo: [`/living/ai-reads-human/`](/living/ai-reads-human/).*

<div id="telemetry-channels-and-falsifier-6-demonstration" class="anchor-alias" aria-hidden="true"></div>

### Canais de telemetria e demonstração do Falsificador 6

Cada janela de medição registrou dois canais de telemetria sem raiz simultaneamente enquanto mantinha `measured_j = None` e `board_metered = false`:

1. **Por-processo `L3` `reported_j` (rótulo de host compartilhado `D`, isolado de co-inquilinos)**: `proc_pid_rusage(worker_pid, RUSAGE_INFO_V6).ri_energy_nj`, integrado pelo kernel XNU estritamente sobre as threads agendadas dentro do subprocesso de trabalho dedicado para aquela única passagem de formato/tokenizador.
2. **Todo o SoC `L2` `reported_j` (rótulo de host compartilhado `A2`, acionado pelo Falsificador 6)**: `macmon pipe` amostrando Apple Silicon `IOReport` `chip_power` juntamente com linhas de base ociosas de `0.8 s` pré- e pós-janela. Sob **Falsificador 6**, qualquer janela cuja linha de base ociosa pré/post drifte por `> 5.0%` tem seu `derived_marginal_j` automaticamente invalidado ao invés de relatado. Neste host compartilhado (média de carga de 1-minuto `12.92`, consumo ocioso do chip `30.5-35.4 W`), o Falsificador 6 invalidou **`109` de `170` janelas (`64.1%`)** ao longo das 34 cargas de trabalho (`61 / 170` válidas, `0 / 34` cargas de trabalho passando todas as replicações `5 / 5`), reproduzindo quantitativamente o diagnóstico da seção 5b enquanto `L3` `ri_energy_nj` resolveu limpamente cada carga de trabalho individual.

<div id="parse-stage-l3-reported_j-16-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### Fase de análise `L3` `reported_j` (`16` cargas de trabalho, `20.000` registos)

| Formato e analisador sintático | Bytes do corpus | ms de parede / `20k` (média ± DP) | `L3` `nJ / registo` (média ± DP) | `L3` `nJ / byte` | Instruções / registo | Rácio de energia `L3` vs binário |
|---|---:|---:|---:|---:|---:|---:|
| Binário fixo (`numpy.frombuffer`, vista de cópia zero) | `460.000` | `0,0002 ± 0,0000` | `0,04 ± 0,01` | `0,002` | `0,3` | `0,00×` (apenas vista) |
| **Binário fixo (`struct.iter_unpack`, referência)** | `460.000` | `1,359 ± 0,351` | **`280,36 ± 111,38`** | `12,19` | `1.397,4` | **`1,00×`** |
| JSON (`orjson`, C/Rust SIMD) | `2.325.428` | `7,053 ± 1,359` | **`1.405,93 ± 372,34`** | `12,09` | `6.187,0` | **`5,01×`** |
| CSV (`csv`, biblioteca padrão Python) | `1.205.469` | `8,804 ± 1,309` | **`1.798,22 ± 435,28`** | `29,83` | `8.812,4` | **`6,41×`** |
| MessagePack (`msgpack`) | `1.660.773` | `10,817 ± 3,321` | **`1.802,46 ± 593,84`** | `21,71` | `9.593,3` | **`6,43×`** |
| **JSON (`json.loads`, biblioteca padrão Python)** | `2.325.428` | `11,396 ± 1,219` | **`2.212,12 ± 409,29`** | `19,03` | `12.700,6` | **`7,89×`** |
| JSON formatado (`json.loads`, indentação 2) | `3.685.429` | `11,716 ± 2,225` | **`2.648,45 ± 669,32`** | `14,37` | `13.433,3` | **`9,45×`** |
| CBOR (`cbor2`) | `1.660.877` | `15,286 ± 1,250` | **`2.719,58 ± 365,78`** | `32,75` | `14.514,3` | **`9,70×`** |
| XML (`lxml`, biblioteca C) | `2.885.487` | `22,204 ± 2,392` | **`3.800,46 ± 331,49`** | `26,34` | `19.521,4` | **`13,56×`** |
| XML (`xml.etree.ElementTree`) | `2.885.487` | `26,354 ± 0,750` | **`6.029,30 ± 370,65`** | `41,79` | `27.495,7` | **`21,51×`** |
| JSON Lines (`json.loads` por linha) | `2.325.427` | `22,729 ± 1,481` | **`6.130,27 ± 946,08`** | `52,72` | `27.414,8` | **`21,87×`** |
| Tabela Markdown (`markdown-it-py`, tokens) | `1.525.499` | `115,160 ± 7,576` | **`22.824,50 ± 2.464,64`** | `299,24` | `115.255,0` | **`81,41×`** |
| TOML (`tomllib`, biblioteca padrão Python) | `2.505.426` | `298,582 ± 60,674` | **`57.803,43 ± 16.269,64`** | `461,43` | `260.140,9` | **`206,17×`** |
| **YAML (`PyYAML` com `libyaml` C)** | `2.445.427` | `448,071 ± 95,009` | **`69.922,12 ± 13.405,09`** | `571,86` | `371.347,0` | **`249,40×`** |
| Lista Markdown (`markdown-it-py`, tokens) | `1.925.427` | `417,700 ± 54,289` | **`99.595,04 ± 17.044,11`** | `1.034,52` | `377.878,0` | **`355,23×`** |
| **YAML (`PyYAML`, Python puro)** | `2.445.427` | `3.224,548 ± 375,725` | **`575.799,27 ± 56.674,36`** | `4.709,19` | `2.706.372,9` | **`2.053,75×`** |

<div id="tokenization-stage-l3-reported_j-18-tiktoken-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### Estágio de tokenização: `L3` `reported_j` (`18` cargas `tiktoken`, `20.000` registros)

Quando um modelo de linguagem ingere texto, e não memória estruturada, a tokenização por pares de bytes (`E_tok(F,k)` na seção 2) domina o custo de decodificação em CPU nos formatos compactos:

| Tokenizador e visão | Tokens / `20k` | Tempo de parede ms / `20k` (média ± DP) | `L3` `nJ / registro` (média ± DP) | `L3` `nJ / token` | Razão vs CSV (`mesmo tok`) | Razão vs leitura binária fixa |
|---|---:|---:|---:|---:|---:|---:|
| `cl100k_base` · CSV (`recs.csv`) | `459.916` | `73,442 ± 20,454` | **`16.384,84 ± 4.362,40`** | `712,51` | `1,000×` | `58,44×` |
| `cl100k_base` · Tabela Markdown | `569.973` | `105,364 ± 18,819` | **`23.385,73 ± 5.597,57`** | `820,59` | `1,427×` | `83,41×` |
| `cl100k_base` · Lista Markdown | `649.947` | `105,199 ± 11,723` | **`26.749,70 ± 4.445,05`** | `823,13` | `1,633×` | `95,41×` |
| `cl100k_base` · JSONL (`recs.jsonl`) | `753.109` | `154,114 ± 43,130` | **`26.983,02 ± 9.347,95`** | `716,58` | `1,647×` | `96,24×` |
| **`cl100k_base` · JSON compacto (`recs.json`)** | `733.111` | `124,295 ± 7,051` | **`27.679,19 ± 2.697,37`** | `755,12` | **`1,689×`** | **`98,73×`** (`12,51×` `json.loads`) |
| `cl100k_base` · XML (`recs.xml`) | `1.046.596` | `171,844 ± 21,381` | **`36.730,51 ± 6.968,26`** | `701,90` | `2,242×` | `131,01×` |
| `cl100k_base` · TOML (`recs.toml`) | `933.109` | `178,111 ± 23,760` | **`38.499,73 ± 6.633,02`** | `825,19` | `2,350×` | `137,32×` |
| `cl100k_base` · YAML (`recs.yaml`) | `1.029.947` | `208,434 ± 33,837` | **`51.880,14 ± 12.381,40`** | `1.007,43` | `3,166×` | `185,05×` |
| **`cl100k_base` · JSON formatado (`recs_pretty.json`)** | `1.313.111` | `266,827 ± 21,754` | **`70.590,45 ± 10.239,93`** | `1.075,16` | **`4,308×`** | **`251,78×`** (`26,65×` `json.loads` formatado) |
| `o200k_base` · CSV (`recs.csv`) | `464.995` | `51,864 ± 5,906` | **`9.570,91 ± 1.012,53`** | `411,66` | `1,000×` | `34,14×` |
| `o200k_base` · JSON compacto (`recs.json`) | `754.794` | `93,277 ± 8,521` | **`15.125,65 ± 1.287,77`** | `400,79` | `1,580×` | `53,95×` (`6,84×` `json.loads`) |
| `o200k_base` · Tabela Markdown / Lista | `574.818` / `654.792` | `68,091` / `68,666` | **`15.693,90`** / **`17.362,58`** | `546,05` / `530,32` | `1,640×` / `1,814×` | `55,98×` / `61,93×` |
| `o200k_base` · JSONL / XML / TOML | `774,8k` / `1.054,8k` / `934,8k` | `83,02` / `114,79` / `106,68` | **`21.530,58`** / **`22.997,48`** / **`25.307,32`** | `555,78` / `436,05` / `541,45` | `2,250×`-`2,644×` | `76,79×`-`90,27×` |
| `o200k_base` · YAML (`recs.yaml`) | `1.034.792` | `141,338 ± 24,980` | **`29.401,44 ± 7.308,15`** | `568,26` | `3,072×` | `104,87×` |
| `o200k_base` · JSON formatado (`recs_pretty.json`) | `1.314.794` | `193,648 ± 18,210` | **`37.070,18 ± 3.651,35`** | `563,89` | `3,873×` | `132,22×` |

Três achados emergem da campanha de `170` janelas:

1. **Tokenizar JSON demanda uma ordem de magnitude mais CPU `reported_j` do que analisá-lo**: `tiktoken` (`cl100k_base`, implementado em Rust compilado) consome `27,679.2 nJ/record` (`0.554 J` por `20,000` registros, `129,192` instruções/registro) em JSON compacto, **`12.51×`** Python's `json.loads()` (`2,212.1 nJ/record`), **`19.69×`** `orjson.loads()` (`1,405.9 nJ/record`), e **`98.73×`** `struct.iter_unpack` (`280.4 nJ/record`). Indentar JSON (`indent=2`) inflaciona a energia de tokenização do `cl100k_base` em mais **`2.55×`** para `70,590.5 nJ/record` (`4.31×` tokenização CSV) simplesmente para ler sequências de espaços em branco.  
2. **Rácios de energia de análise acompanham estreitamente os rácios de instruções, com variação menor de potência efetiva (`3.28-5.65 W` por PID de trabalhador)**: C `libyaml` consome `3.31 W` de potência efetiva do trabalhador (`249.4×` binário `reported_j` vs `329.8×` tempo de parede), enquanto `jsonl` por linha e `tiktoken` JSON formatado consomem `5.37-5.46 W` (`21.87×` e `251.78×` `reported_j` vs `16.73×` e `196.37×` tempo de parede), confirmando por que contadores diretos por processo `ri_energy_nj` são preferíveis a multiplicar o tempo de parede por uma estimativa de potência constante.  
3. **Limite de proveniência**: `ri_energy_nj` é um contador do sistema operacional/firmware (`reported_j`, nível de telemetria `L3`), não um shunt de hardware externo ou analisador de energia de tomada (`measured_j = None`, `board_metered = false`), e ainda cobre o trabalho da CPU/memória do host antes das passagens forward da rede neural (`e_prefill · T_{F,k}` em M4).

<div id="6-where-a-canonical-machine-form-fits" class="anchor-alias" aria-hidden="true"></div>

## 6. Onde uma forma canônica de máquina se encaixa

Uma resposta ao imposto é manter uma forma canônica de máquina para armazenamento e troca e emitir texto humano apenas quando uma pessoa solicita lê-lo. Vários projetos seguiram essa rota para partes do problema: CBOR determinístico, JSON canônico, formatos binários vinculados a esquemas. As propriedades que tal forma precisaria ter são testáveis: uma única sequência de bytes válida por valor, uma versão declarada, esquema fechado, limites de tamanho e profundidade declarados antes da decodificação, e uma declaração de tamanho que nomeia o dicionário do qual depende.

<div id="61-an-open-design-question" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Uma questão de projeto em aberto

Qual forma canônica de troca é a melhor não é decidido aqui. O JSON canônico (RFC 8785) mantém uma forma textual, mas exige regras para a formatação de números e para a ordem das chaves; o CBOR determinístico (RFC 8949, seção 4.2) é binário (`2,719.6 nJ/record` no `cbor2` do Python, `9.70×` de forma binária fixa), porém deixa escolhas a cada protocolo. Uma forma binária com prefixo de comprimento ou com passo fixo (`280.4 nJ/record` em `struct.iter_unpack`, ou `0.04 nJ/record` para uma visão de buffer sem cópia) elimina quase todo o trabalho de análise sintática entre máquinas, ao passo que um modelo textual ainda exige uma visão textual projetada (`16,384.8 nJ/record` para CSV contra `70,590.5 nJ/record` para JSON formatado, sob `cl100k_base`). Qual compromisso de ponta a ponta prevalece, uma vez incluídos o pré-preenchimento do modelo em GPU (`M4`) e as tarefas de projeção de campos (`M7`), permanece em aberto.

<div id="7-reproduce-this-page" class="anchor-alias" aria-hidden="true"></div>

## 7. Reproduza esta página

Tudo o que é necessário está em `/living/ai-reads-human/` neste site:

- `data/parse_time.tsv`, `data/tokens.tsv`, `data/tokenize_time.tsv`, `data/ENV.txt`, `data/SUMMARY.txt`: as linhas de base de tempo e token do Linux Xeon.
- `data/energy_reported_j.tsv` e `data/energy_reported_j_summary.json`: o conjunto de dados `reported_j` de canal duplo Apple M5 Max de 34 cargas de trabalho, 170 janelas (`L3` `ri_energy_nj` + `L2` `IOReport` Falsifier 6) (`data/energy_joules.tsv` mantém a execução nula de chip inteiro não isolado de outubro de 2026).
- `scripts/gen_corpus.py` (corpus semeado), `bench_parse.py`, `bench_tokens.py`, `bench_tokenize_time.py`, `summarize.py`: as medições.
- `scripts/make_charts.py`: reconstrói todos os gráficos a partir dos arquivos de resultados e verifica os valores principais.
- `scripts/verify_numbers.py`: recalcula todos os números citados no texto; sai com código não-zero em caso de divergência.
- `tests-formats/`: os scripts por trás das linhas de teste de risco.

```
python3 -m venv --system-site-packages venv
venv/bin/pip install tiktoken tokenizers msgpack cbor2 orjson ruamel.yaml markdown-it-py psutil
venv/bin/python scripts/gen_corpus.py 20000
venv/bin/python scripts/bench_parse.py 9 > results/parse_time.tsv
venv/bin/python scripts/bench_tokens.py 2000 > results/tokens.tsv
venv/bin/python scripts/make_charts.py charts && venv/bin/python scripts/verify_numbers.py
```

Os vocabulários dos tokenizadores para GPT-2, Mistral-7B-v0.1 e Qwen2.5-0.5B são descarregados de um hub de modelos por `bench_tokens.py`. Os temporizações e os contadores `ri_energy_nj` dependem do processador anfitrião e do sistema operativo; espera-se que a ordenação de múltiplas ordens de grandeza entre formatos se mantenha, enquanto os valores absolutos em nanossegundos e nanojoules variam com o hardware.

<div id="8-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 8. Ameaças à validade

- O contador `ri_energy_nj` do kernel (`L3` `reported_j`) é um contador do sistema operacional baseado em modelo para Apple Silicon, e não um medidor inline de trilho DC nem um medidor de tomada AC (`measured_j = None`, `board_metered = false`); além disso, os joules de prefill e decode do modelo de GPU (`M4`) ainda não são medidos aqui.
- Em hosts compartilhados, a subtração líquida acima da ociosidade do `IOReport` de todo o SoC (`L2`) é vulnerável à deriva causada por co-locatários (`109 / 170` janelas invalidadas pelo Falsifier 6 na seção 5c; resultado nulo na seção 5b).
- A sobrecarga de alocação de objetos do Python contribui para várias linhas de análise sintática (parsers compilados em C/Rust em `M8` delimitarão a sobrecarga de tempo de execução; observe que `orjson` e `tiktoken` já executam código nativo compilado).
- Um único corpus sintético, com poucos identificadores (`seed = 20261016`); registros de linguagem natural e de telemetria permanecem sem teste (`M6`).
- Os tokenizadores testados são abertos; tokenizadores comerciais fechados não foram testados.
- O layout binário de 23 bytes depende de um dicionário compartilhado de 24 palavras (`SHA-256` fixado em `data/energy_reported_j_summary.json`), que as cifras de bytes por registro não repetem.

<div id="9-read-ledger-and-references" class="anchor-alias" aria-hidden="true"></div>

## 9. Ler ledger e referências

O status por fonte está no [registro de leitura](/living/ai-reads-human/READ_LEDGER.md) (COMPLETO, PARCIAL, INDISPONÍVEL). Citado: RFC 8259, RFC 7493, RFC 8785, RFC 8949, RFC 4180, CommonMark 0.31.2, YAML 1.2.2 (seção 1.1), TOML 1.0.0, guia de codificação do Protocol Buffers, OWASP CSV Injection, `tex.web` (apenas cabeçalho, PARCIAL), Samsi et al. arXiv:2310.03003, Luccioni et al. DOI 10.1145/3630106.3658542. Fontes HTML foram lidas como texto sem tags, portanto figuras nelas não foram lidas.

**Não lidos (acesso pago ou indisponível), listados com identificadores e não citados para nenhuma afirmação:**

| Item | Identificador |
|---|---|
| ISO 32000-1:2008, Formato de Documento Portátil | Catálogo ISO (acesso pago) |
| ISO/IEC 29500, Office Open XML | ISO/IEC 29500 (equivalente gratuito ECMA-376 apenas parcialmente lido) |
| ISO/IEC 26300, OpenDocument | ISO/IEC 26300 (leitura da parte 1 do OASIS ODF 1.3 gratuita) |
| IEEE 754-2019, Aritmética de Ponto Flutuante | DOI 10.1109/IEEESTD.2019.8766229 |
| Sennrich, Haddow, Birch, "Tradução Neural de Palavras Raras com Unidades Subpalavra" | DOI 10.18653/v1/P16-1162 |
| O Padrão Unicode e UAX #15 | unicode.org (não obtido) |
| ECMA-262 (serialização numérica referenciada pela RFC 8785) | não obtido |
| The TeXbook, edição impressa | ISBN 978-0-201-13447-6 |
| Horowitz, "Computing's energy problem", fonte atribuída da citação de 640 pJ por leitura de DRAM de 32 bits | **lido; 640 pJ não encontrado no artigo ou nos slides plenários (eles dão 1 a 2 nJ, e 1.3 a 2.6 nJ por acesso de 64 bits); não usado** |
| Strubell et al. 2019; Patterson et al. 2021 e 2022; Wu et al. 2021 | citado apenas dentro dos artigos de Samsi e Luccioni; não lido, nenhuma afirmação feita |

<div id="10-what-will-be-added" class="anchor-alias" aria-hidden="true"></div>

## 10. O que será adicionado

Expansões planeadas, sem ordem fixa: modelo de GPU para energia de pré-preenchimento e decodificação por token (`M4`) e validação externa inline com medidor de parede (`measured_j`); analisadores nativos compilados em C/Rust (`M8`); um corpus de linguagem natural e de registos estruturados (`M6`); contagens de tokens por tarefa para cargas de trabalho de projeção de campos de agentes (`M7`); mais formatos do registo (PDF 2.0, C2PA, dialetos de Markdown, LaTeX) com os seus perigos; e uma comparação elaborada de projeções binárias canónicas para modelos.

*© 2026 Open Interface Engineering, Inc. Texto, figuras, dados e scripts: MIT OR Apache-2.0, à sua escolha.*
