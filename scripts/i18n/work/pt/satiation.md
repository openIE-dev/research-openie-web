<div id="satiation-and-scarcity-after-free-ai" class="anchor-alias" aria-hidden="true"></div>

*Versão 1.1, 11 de outubro de 2026. Dados e código: [research.openie.dev/data/](/data/#economics). PDF em LaTeX: [/pdfs/latex/satiation.pdf](/pdfs/latex/satiation.pdf) ([fonte](/pdfs/latex/satiation.tex)).*

## Resumo

Uma vez concluída uma tarefa, mais esforço de máquina sobre essa tarefa não acrescenta nada. Este artigo define essa parada com precisão e a separa da questão distinta de saber se a demanda total por trabalho de máquina continua crescendo.

**Em palavras simples**

1. Todo serviço tem uma linha de chegada. Depois dela, mais trabalho de computador nesse serviço é desperdício.
2. Um trabalho de computador mais barato ainda pode levar as pessoas a começar muito mais serviços, de modo que o uso total pode continuar subindo.
3. Os preços em dinheiro da IA estão caindo depressa, mas a eletricidade que ela usa nunca é gratuita.

Muitos modelos de planejamento tratam a demanda por inteligência de máquina como se ela não tivesse linha de chegada. A teoria do consumidor já contém o objeto oposto. A saciedade, e o ponto de êxtase a ela relacionado, é a região em que unidades adicionais de um bem não elevam a utilidade e podem reduzi-la (Andersen, 2001). Este artigo define um parente operacional para o trabalho e o cuidado: um laço atinge a conclusão da tarefa quando um predicado de completude enunciado é satisfeito, as chamadas seguintes não mudam nenhuma cláusula desse predicado de falsa para verdadeira, e as chamadas que desfazem o predicado são dano, não valor. O tempo de engajamento, a contagem de tokens e a contagem de licenças são variáveis diferentes. Elas podem crescer depois da completude.

Duas afirmações precisam ser mantidas separadas. A saciedade no nível da tarefa vale por definição: uma vez que o predicado de completude de uma tarefa é verdadeiro, mais síntese nessa tarefa não compra nada. A saciedade agregada é uma afirmação sobre a demanda total, e ela não está implicada. Uma síntese mais barata pode abrir novas tarefas (Acemoglu e Restrepo, 2019) e elevar o uso total, assim como o carvão mais barato elevou o uso total de carvão (Jevons, 1865). Cada afazer pode ficar saciado enquanto a demanda total por afazeres cresce sem limite. Esse rebote é o problema central de identificação do artigo. A Seção 5.1 enuncia duas hipóteses testáveis e os dados que as identificariam.

Um segundo fato diz respeito ao preço, não à física. A Epoch AI relata grandes quedas no preço de um desempenho de inferência fixo (Epoch AI, 2025; Emberson e Roodman, 2026). Este artigo chama a situação resultante de gratuito na margem, para afazeres digitais cujo resultado é informação e cujo teste de completude é finito. A expressão não significa que os joules sejam gratuitos, que uma planta possa se mover sem um certificado nem que o trabalho de cuidado tenha sido eliminado pela automação. O limite de Landauer é um limite inferior para o apagamento, não uma descrição dos aceleradores atuais (Landauer, 1961; Horowitz, 2014).

O artigo não apresenta um ensaio randomizado, nem uma taxa de erro de um detector de conclusão, nem uma divisão entre a energia gasta antes da completude e a energia gasta depois dela. Essas medições estão especificadas na Seção 3.3 e estão ausentes.

## Notação

| Termo | Definição neste artigo |
|------|--------------------------|
| Saciedade | Na teoria citada, uma queda da utilidade marginal a zero ou abaixo de zero. Na cláusula operacional deste artigo, depois da completude, as chamadas seguintes não mudam nenhuma cláusula de `C` de falsa para verdadeira; as chamadas que desfazem `C` são dano, não valor (Seção 3.1). |
| Ponto de êxtase | Uma cesta na qual uma quantidade adicional do bem reduz a utilidade. Um objeto de livro-texto. Não é estimado aqui. |
| Conclusão da tarefa | O evento em que o predicado de completude se torna verdadeiro. Ortogonal à escala do modelo. |
| Completude do trabalho | Uma parada de trabalho enunciada: chamado fechado, patch integrado, relatório entregue, livro contábil conciliado ou um teste escrito equivalente. |
| Completude do cuidado | Uma parada de cuidado enunciada: avaliação concluída, medicação conciliada, parte receptora notificada, pessoa em estado seguro ou um teste escrito equivalente. |
| Gratuito na margem | O preço marginal de um passo de síntese digital tende a um preço monetário embutido em um pacote ou desprezível. Os joules e as confirmações continuam custosos. |
| Inteligência artificial geral (AGI) | Uma meta ampla de capacidade. Não é uma observação de preços nem um resultado deste artigo. |
| Rebote direto | Uso adicional de um serviço quando seu preço efetivo cai, sobre o mesmo serviço (Gillingham, Rapson e Wagner). |
| Modelado / simulado / medido na placa | Fórmula, execução de programa ou medidor. Os números novos deste artigo não pertencem a nenhuma das três classes; seu conteúdo empírico é a citação de séries e documentos publicados. |

Escopo. A Seção 2 revisa a teoria da saciedade, a automação de tarefas, os mercados de atenção, a evidência sobre ciclos tecnológicos e os preços da inferência. A Seção 3 escreve os predicados e diz quais não foram estimados. A Seção 4 lista as afirmações que se apoiam em citações e as separa das regras de projeto. A Seção 5 responde sobre o rebote, os custos do cuidado e a demanda militar. A Seção 6 lista as ameaças à validade.

## 1. Introdução

Uma curva de demanda com inclinação positiva constante em "inteligência" recomendará mais licenças, mais tokens e mais agentes depois que um trabalho estiver terminado. Essa recomendação é uma escolha de modelagem. Não é um teorema sobre o trabalho. A teoria padrão do consumidor permite que a utilidade marginal diminua e cruze o zero. Se um afazer tem um predicado de completude, a pergunta relevante é se mais saída do modelo muda esse predicado. Se não muda, a saída adicional é um custo sem incremento no objetivo que foi escrito.

A evidência recente de preços aponta no sentido oposto ao da escassez de síntese. As séries da Epoch mostram o preço monetário de um dado desempenho em benchmark caindo rapidamente. Os pesos abertos e os procedimentos de decisão tipados, entre eles o System One, são vias adicionais pelas quais um passo de geração antes escasso se torna barato. As equipes que precificam um afazer fechado como se a síntese ainda fosse escassa estão usando uma restrição obsoleta.

As restrições que não decorrem de uma série de preços são físicas e institucionais. A computação dissipa energia. Horowitz (2014) documenta que o movimento de dados e a memória dominam a energia prática de CMOS, em escalas muito acima do limite ideal de apagamento de Landauer. Um atuador não é um token. Uma assinatura, uma passagem de caso clínica e um pagamento não são revertidos pela amostragem de mais um parágrafo. Baumol (1967) mostrou como setores com crescimento fraco da produtividade podem absorver uma parcela crescente do gasto. Acemoglu e Restrepo (2019) modelam a automação como deslocamento de tarefas somado à possível criação de novas tarefas. Nenhum desses resultados diz que um modelo de linguagem acaba com a doença dos custos. Eles dizem, sim, que "mais capacidade" não é uma descrição suficiente do valor.

A afirmação positiva deste artigo é definicional e bibliográfica. A saciedade é um objeto coerente. Os preços publicados da inferência caíram fortemente. As métricas de engajamento não são métricas de completude. Uma parada por "não gastar" e uma parada por "não mover" são predicados diferentes. A afirmação negativa é igualmente importante. Este artigo não identifica um sistema de demanda estrutural, não estima o rebote e não relata energia medida.

## 2. Trabalhos relacionados

### 2.1 Saciedade e pontos de êxtase

Andersen (2001) trata a saciedade dentro de um modelo evolucionário da mudança estrutural, não como uma preferência verbal. O elemento duradouro para este artigo é o econômico: a valoração marginal de um bem pode chegar a zero. Os pontos de êxtase de livro-texto tornam a geometria explícita. Para uma cesta `x*`, a utilidade não aumenta em uma coordenada além de `x*`, e uma representação suave pode ter ali utilidade marginal negativa. Uma ilustração quadrática, `U(x) = -a (x - x*)^2` para `a > 0`, tem um máximo em `x*` e uma derivada negativa além dele. Essa função é um modelo usado para ensinar a definição. Ela não é ajustada a registros de agentes neste estudo. Nenhum coeficiente `a` é relatado.

A tradução operacional exige um predicado que o modelo não conhece a menos que alguém o enuncie. Seja `C(z) = 1` quando o teste de completude escrito para o episódio `z` é satisfeito, e 0 caso contrário. A saciedade nesse episódio significa que existe um instante `t*` tal que `C` vale 1 em `t*` e, para todas as chamadas posteriores, nenhuma cláusula de `C` muda de falsa para verdadeira. As chamadas que desfazem `C` são dano, não valor. A Seção 3.1 enuncia a mesma regra. O evento interno **concluído econômico** ocorre quando `C` passa a valer 1; este artigo chama esse evento de conclusão da tarefa. Isto é uma definição. Ela só se torna uma afirmação empírica com um conjunto rotulado de episódios e um detector cujos erros são contados. A Seção 4 não contém essa contagem.

Keynes traçou a mesma linha em 1930. Ele dividiu as necessidades em absolutas, sentidas independentemente do que os outros tenham, e relativas, sentidas porque satisfazê-las nos eleva acima dos outros. Ele argumentou que as necessidades absolutas podiam ser atendidas. O predicado de completude é a necessidade absoluta de uma tarefa, posta por escrito. Os desejos relativos e abertos não têm tal predicado, e a Seção 5.2 os mantém fora da afirmação.

### 2.2 Tarefas, deslocamento e doença dos custos

Baumol (1967) analisa o crescimento desequilibrado. Se a produtividade de um setor sobe e a de outro não, o custo relativo do setor estagnado sobe, e ele pode dominar o gasto mesmo quando sua quantidade cresce devagar. Saúde, educação e artes cênicas ao vivo são os exemplos habituais. Artigos posteriores de economia da saúde discutem magnitudes e mecanismos. Este artigo usa Baumol para uma instrução negativa: não inferir, a partir de uma queda no preço do token, que o cuidado se tornou um bem de software. O cuidado continua dependente de tempo, confiança e responsabilidade legal no sentido institucional comum. Um modelo de documentação pode aumentar a atividade registrada, o que é uma ambiguidade relevante para Baumol: a produção medida pode se mover enquanto o predicado de cuidado não se move.

A literatura do trabalho associada a David Autor decompõe os empregos em tarefas que as máquinas podem ou não executar. O enunciado de referência é Acemoglu e Restrepo (2019), "Automation and New Tasks: How Technology Displaces and Reinstates Labor", Journal of Economic Perspectives 33(2), https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3. Eles argumentam que o deslocamento reduz a parcela de tarefas do trabalho e que novas tarefas podem restaurá-la. Uma parada orientada à completude está mais perto de terminar uma tarefa do que de criar uma nova tarefa de engajamento. Um laço de agente sem parada pode elevar as medidas de atividade sem ganho de produtividade. Essa possibilidade é coerente com o alerta deles sobre a automação fraca.

### 2.3 Atenção e engajamento

O livro de Wu "The Attention Merchants" (página da editora: https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/) descreve empresas que colhem atenção e a revendem. A visão geral do Center for Humane Technology sobre a economia da atenção (https://www.humanetech.com/youth/the-attention-economy) é um resumo militante do mesmo padrão, não um ensaio. A inferência usada aqui é limitada. Se o objetivo de um produto é o tempo na tarefa, uma sessão que continua depois de `C = 1` pode parecer bem-sucedida. Se o objetivo é `C`, a mesma sessão é desperdício ou dano. Os dois objetivos não são observacionalmente equivalentes em um registro de tokens. Nenhum experimento deste artigo estima a diferença de bem-estar.

### 2.4 Ciclos históricos

Os mercados de tecnologia mostram com frequência uma fase especulativa, uma fase de uso e uma fase posterior de commodity. A evidência é desigual.

Quinn (2019), "Technological revolutions and speculative finance: evidence from the British Bicycle Mania", Cambridge Journal of Economics 43(2), 271-294, https://doi.org/10.1093/cje/bey029, estuda os preços das ações de empresas de bicicletas de 1895 a 1900. Os preços subiram mais de 200 por cento e depois caíram mais de 75 por cento. O resultado do artigo trata de finanças especulativas e fundamentos, não de um predicado medido de "bicicleta suficiente" para os domicílios. Usá-lo como retrato das finanças na fase de corrida tem respaldo. Usá-lo como prova de saciedade no transporte não tem.

Os automóveis, a aviação regular e a televisão têm mercados semelhantes a commodities no sentido cotidiano: veículos usados, assentos com gestão de receita e painéis vendidos como insumos para conteúdo. As linhas servem de orientação histórica. Não são regressões. A gestão de receita das companhias aéreas depois da desregulamentação é uma instituição de preços para um assento, o que é evidência de um mercado de commodity em assentos, não evidência de que a demanda dos passageiros por viagens esteja saciada em escala global.

A ficha informativa sobre dispositivos móveis do Pew Research Center (https://www.pewresearch.org/internet/fact-sheet/mobile/) é a fonte de saturação usada para os telefones. O arquivo do projeto registra a posse de smartphones nos EUA perto de 91 por cento nas leituras das fichas de 2024 e 2025. Quem citar o número deve abrir a ficha atualizada, porque as fichas são revisadas. Uma posse alta é evidência de difusão. Ela não é, por si só, evidência de que o valor marginal de mais uma câmera de telefone seja zero.

A linha do afazer digital é a que este artigo defende com uma série de preços em vez de uma analogia. Veja a Seção 4.2.

### 2.5 Preços da inferência e pesos abertos

Epoch AI (2025), "LLM inference price trends", https://epoch.ai/data-insights/llm-inference-price-trends, relata quedas de preço a desempenho fixo da ordem de 9 a 900 vezes por ano nos benchmarks daquela nota. Emberson e Roodman para a Epoch AI (2026), "The plunging price of thought", https://epoch.ai/publications/the-plunging-price-of-thought, relatam uma queda de cerca de 47 por cento por trimestre no custo de um dado desempenho desde cerca de 2023, resumida como cerca de 13 vezes por ano, mais rápida perto da fronteira. Esses são os resumos dos autores sobre seus dados. Este artigo não reestima o índice. A leitura econômica é estreita: o preço monetário da síntese para um desempenho medido fixo vem caindo depressa. Um preço de oferta em queda altera a quantidade demandada se a demanda for elástica. Ele não cria um novo predicado de completude e não fixa em zero o preço da energia.

As ferramentas da classe System One são relevantes como mecanismo para um corte adicional de preço em problemas de decisão com um conjunto de opções conhecido. Um modelo System One devolve uma resposta tipada e uma probabilidade para cada opção permitida em uma única passagem direta, sem texto livre. A TypeSafe AI deu nome à categoria com seu modelo hospedado Jev (15 de setembro de 2026). Seguiram-se modelos abertos, entre eles o Laya, da Convai Innovations. Um modelo System One propõe. Ele não é uma avaliação de completude.

Uma regra prática de planejamento segundo a qual a competência de fronteira chega a dispositivos mais baratos em cerca de seis meses não é uma constante medida em nenhuma fonte citada aqui. A destilação, a quantização e a inferência por consulta a tabelas (Ma et al., 2024; Wei et al., 2024) são mecanismos publicados pelos quais uma dada competência pode migrar para hardware mais barato. A velocidade é uma questão empírica para cada par de modelos.

### 2.6 Custo físico

Landauer (1961) limita o apagamento. Bennett (1973) mostra que a computação reversível pode evitar esse limite em teoria. Horowitz (2014) é o enunciado prático para CMOS: a energia por operação e a energia do movimento de dados definem a restrição de projeto, muitas ordens de grandeza acima de `kT ln 2` para a lógica CMOS irreversível. A $T = 300$ K, o limite é $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J por bit apagado, com $k_B = 1.380649 \times 10^{-23}$ J/K.

O Goldman Sachs publicou uma nota de pesquisa intitulada "Gen AI: Too Much Spend, Too Little Benefit?" (https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit). A existência de uma nota importante do lado vendedor que questiona o gasto em infraestrutura em relação ao benefício é um fato documental. Os valores em dólares da nota não são citados aqui, porque as estimativas do lado vendedor não são uma contabilidade científica de energia.

## 3. Definições e métodos

### 3.1 Predicados

Seja um episódio uma sequência de chamadas a modelos ou ferramentas `z_1, ..., z_T` junto com um estado voltado às pessoas. Um predicado de completude `C` mapeia o prefixo do episódio em `{0, 1}`. Exemplos que podem ser escritos sem uma pontuação de modelo:

- Trabalho: os testes passam e a mudança está integrada; ou a discrepância do livro contábil é zero; ou os campos obrigatórios de um relatório estão preenchidos e o relatório foi entregue.
- Cuidado: a lista de medicação coincide com a fonte, o clínico receptor tem a nota e os itens da lista de segurança que a instituição marcou como críticos são verdadeiros.

`C` não é uma probabilidade. Um detector que produz uma pontuação ainda precisa de um limiar e de uma tabela de erros antes de ser um predicado no sentido do experimento ausente da Seção 4.

O evento interno **concluído econômico** no instante `t*` significa `C = 0` no prefixo anterior a `t*` e `C = 1` em `t*`, para o teste escolhido. Este artigo chama essa camada do catálogo de **conclusão da tarefa**. A saciedade relativa às chamadas ao modelo significa que, para todo `t > t*`, as chamadas adicionais não mudam nenhuma cláusula de `C` de falsa para verdadeira. As chamadas que desfazem `C` são dano, não valor. A definição não diz que as pessoas sempre conhecem `t*`. Ela diz que, se nenhum `C` foi escrito, a afirmação de saciedade ainda não é um enunciado sobre aquele produto.

Gratuito na margem é um enunciado sobre o preço monetário. Seja `p_t(q)` o preço do serviço de síntese `q` na data `t`. A evidência de preços arquivada é que `p_t` para um desempenho fixo em benchmark caiu às taxas que a Epoch relata. Gratuito na margem significa que `p_t` é baixo o bastante para que uma licença por assento explique mal o custo daquele afazer. Não significa que a integral da potência ao longo do tempo seja zero.

Uma regra de parada pode, portanto, ter dois tipos de motivo: econômico (o predicado vale, ou um limite de orçamento ou de política é atingido) e físico (um limite de segurança ou de energia é atingido). Os dois tipos são predicados diferentes e devem ser registrados como motivos diferentes.

### 3.2 O que foi feito neste estudo

Este estudo é uma leitura estruturada. As fontes são a espinha de citações verificada no projeto de 29 a 30 de setembro de 2026 e as notas sobre saciedade. A Seção 3.3 nomeia as medições que tornariam empírica a definição operacional.

As regras de projeto da Seção 4.10 são recomendações condicionadas às definições. Elas não são efeitos de tratamento estimados. Um leitor pode rejeitar uma regra sem rejeitar a série de preços da Epoch, e pode aceitar a série de preços sem aceitar uma recomendação de produto.

### 3.3 Medições especificadas e não realizadas

**O predicado é endógeno.** Witt (2001) argumenta que os desejos são aprendidos, de modo que o predicado de completude $C(z)$ pode subir em degraus à medida que o preço cai. Um estudo da saciedade que atravesse uma mudança de preço deve, portanto, congelar $C(z)$ em seu pré-registro antes da mudança e relatar qualquer mudança do predicado como um tratamento separado.

**H1 já pode ser lida em dados públicos.** Chen e colegas (2024) medem os tokens gastos depois da primeira resposta correta; Cuadron e colegas (2025) pontuam o excesso de raciocínio em trajetórias de agentes; Bai, Huang e Wang (2026) constatam que o uso de tokens para uma mesma tarefa na programação agêntica varia até 30 vezes entre execuções. Aplicar a posteriori o $C(z)$ deste artigo a essas trajetórias fornece uma estimativa exploratória de H1, rotulada como exploratória. É a próxima medição.

**Tokens e joules.** H1 e H2 são enunciadas em tokens; a tese está em joules. Masanet e colegas (2020) constataram que a computação dos centros de dados cresceu cerca de seis vezes de 2010 a 2018, enquanto a energia subiu muito menos, de modo que uma elasticidade em tokens não é uma elasticidade em energia. Cada hipótese deve ser relatada nas duas unidades, nomeando a unidade que os dados identificam.

1. Conta dividida. Para cada episódio, somar a energia analítica ou, mais tarde, medida na placa das chamadas com `t <= t*` e das chamadas com `t > t*`. O rebote direto nesse afazer só é visível se a integral posterior à conclusão for estimada. O repositório não contém essa divisão.
2. Erros do detector. Em um corpus rotulado, falso concluído (predicado declarado verdadeiro quando uma cláusula é falsa) e falso continuar (`C` verdadeiro e o sistema continua chamando). Nenhuma taxa é publicada aqui.
3. Passagem de cuidado. Tempo até o estado seguro e uma lista de passagem, contrastados com a duração da sessão. Não medido.
4. Tabela de segmentos. Quais produtos têm um `C` curto e quais são pesquisa aberta ou corridas adversariais. Não estimada. O caso militar é excluído da afirmação de saciedade na Seção 5 em vez de ser forçado para dentro dela.
5. Energia medida. Um medidor de potência externo em uma carga de trabalho enunciada. Não realizada.

Enquanto essas medições não existirem, as frases sobre "joules em excesso" são hipóteses. As frases sobre os preços da Epoch são citações.

### 3.4 Episódios ilustrativos, não dados

Central de suporte. Completude: o problema do cliente está resolvido, a resposta foi enviada e o estado do chamado é Done. Rascunhos adicionais não mudam `C`. Um contador de tokens ainda pode aumentar. O episódio é um exemplo construído para mostrar as variáveis. Não é uma amostra de uma central de atendimento.

Passagem de cuidado. Completude: campos críticos preenchidos, lista de medicação conciliada, parte receptora confirmada, pessoa em estado seguro. A duração da sessão é outra variável. O episódio é construído. Nenhum conjunto de dados hospitalar foi analisado.

Afazer de programação. Completude: o artefato corresponde a um oráculo escrito (testes, ou uma verificação bit a bit). Regenerar um artefato que já passa não eleva `C`.

<div id="28-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

### 3.6 Critérios de fidelidade e regras de parada

Shannon (1959) define uma função taxa-distorção: a menor taxa de descrição que mantém a distorção esperada igual ou abaixo de uma fidelidade escolhida. O objeto é a comunicação sob uma restrição que o usuário enuncia. Não é uma curva de demanda por inteligência. A semelhança com este artigo é apenas estrutural. Um predicado de completude `C` é uma fidelidade rígida: ou as cláusulas enunciadas valem, ou não valem. Uma perda de modelo de linguagem está mais próxima de uma distorção média sobre uma distribuição de treinamento. A perda em queda, e o preço em queda a benchmark fixo, podem ser lidos como movimento ao longo de uma curva taxa-recurso do tipo que Kaplan et al. (2020) e Hoffmann et al. (2022) estimam para o treinamento. Esse movimento não escolhe `C` para um afazer específico. Confundir a distorção do benchmark com a completude do afazer é o erro de categoria por trás dos planos de licenças ilimitadas para trabalho fechado.

Cover e Thomas (2006) é o caminho de livro-texto para a teoria taxa-distorção, se o leitor quiser o desenvolvimento formal. O artigo usa a existência do conceito de fidelidade para manter dois números separados: uma pontuação que sempre pode ser melhorada por uma fração e um predicado que já é verdadeiro.

<div id="29-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

### 3.7 Taxonomia do rebote, sem uma nova estimativa

O cânone do rebote é o enquadramento para H2. Khazzoom (1980) mostrou que a eficiência obrigatória pode aumentar o uso do serviço, Brookes (1990) argumentou o mesmo no nível da economia e Saunders (1992) derivou as condições no crescimento neoclássico. Sorrell e Dimitropoulos (2008) deram as definições microeconômicas e seus limites. Brockway, Sorrell, Semieniuk, Heun e Court (2021) revisaram a evidência e constataram que o rebote em toda a economia pode corroer mais da metade da economia de energia esperada. A saciedade da tarefa não contradiz essa constatação. Ela é uma parada por tarefa, e o rebote agregado de H2 é onde a evidência do cânone se aplica. A iluminação é o caso histórico contra o qual testá-la: Fouquet e Pearson (2006) acompanham sete séculos do preço e do uso da luz no Reino Unido, e Tsao e colegas (2010) constatam que o uso da luz aumentou com a eficiência, um serviço saciável com grande rebote.

A revisão do rebote de Gillingham, Rapson e Wagner separa canais que um único slogan funde. O rebote direto é o uso adicional do mesmo serviço quando seu custo efetivo cai. O rebote indireto é o gasto dos recursos poupados em outros serviços. O rebote em toda a economia passa pelos preços e pelo crescimento. O domínio de política da revisão é a eficiência energética, não os tokens. Ainda assim, a taxonomia se transfere como um alerta sobre identificação. Uma queda medida de `p_t` (afirmação S-2) não identifica, por si só, nenhum dos três canais. O rebote direto em um afazer com `C` já verdadeiro exige que os compradores continuem pagando por chamadas que não mudam `C`. Os canais indireto e de toda a economia podem ser grandes quando surgem novas tarefas (Acemoglu e Restrepo, 2019). Um artigo que relatasse uma única elasticidade e a chamasse de "o rebote" estaria subespecificado. Este artigo não relata nenhuma elasticidade.

O padrão é antigo. Jevons argumentou em 1865 que máquinas a vapor mais eficientes elevariam, e não reduziriam, o uso total de carvão da Grã-Bretanha. Alcott acompanha esse argumento e o debate que se seguiu (*Ecological Economics* 54(1), 2005). Nordhaus mediu o preço da computação ao longo de mais de um século e constatou que ele caiu muitas ordens de grandeza enquanto a computação total aumentava (*Journal of Economic History* 67(1), 2007). As cargas de trabalho de agentes já mostram o lado do uso. A equipe de engenharia da Anthropic relatou, para seu próprio sistema, que os agentes usam cerca de 4 vezes os tokens de uma interação de chat e os sistemas multiagente cerca de 15 vezes (13 de junho de 2025). Esse número é relatado pelo operador, não auditado. Ele é coerente com um apetite por tarefa que cresce à medida que as tarefas mudam de forma, que é exatamente o que a conta dividida da Seção 3.3 precisa separar do desperdício posterior à conclusão.

<div id="210-scarce-joules-and-the-economic-stop-20252026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="210-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

### 3.8 Joules escassos e a parada econômica (trabalhos de 2025 a 2026)

As séries de preços da Epoch (S-2) mostram a síntese ficando mais barata em dinheiro. Publicações recentes sobre energia mostram que os joules continuam escassos e, com frequência, crescem no agregado.

Chung, Wu, Ma e Chowdhury (arXiv:[2601.22076](https://arxiv.org/abs/2601.22076), 2026) diagnosticam a energia da inferência em 1,858 configurações: o tipo de tarefa sozinho pode mover a energia de um LLM por resposta em cerca de 25×; a geração de vídeo pode superar a energia de uma imagem em duas ordens de grandeza. O artigo da *Joule* "Energy use of AI inference, efficiency pathways, and test-time scaling" ([cell.com/joule/fulltext/S2542-4351(26)00114-5](https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5), on-line em 22 de abr. de 2026) estima consultas otimizadas em escala de fronteira na faixa mediana abaixo de um watt-hora, ao mesmo tempo que relata que o raciocínio longo e as consultas agênticas podem elevar a energia em mais de uma ordem de grandeza; ganhos de eficiência de 8 a 20× estão no horizonte visível, não são joules gratuitos. Luccioni, Strubell e Crawford (FAccT 2025) ([doi:10.1145/3715275.3732007](https://doi.org/10.1145/3715275.3732007)) alertam que a eficiência sem uma parada pode amplificar o gasto total (Jevons). A visão geral sobre energia da Epoch AI ([epoch.ai/publications/ai-energy](https://epoch.ai/publications/ai-energy), atualizada em jul. de 2026) separa os modestos custos por consulta da potência agregada dos centros de dados, que dobra rapidamente.

**Leitura para este artigo.** Gratuito na margem é um enunciado sobre o preço monetário. Joules escassos são um enunciado físico. A parada operacional é a conclusão da tarefa: quando `C(z) = 1`, mais síntese não eleva o objetivo escrito, e uma parada por motivos de orçamento ou de política é um sucesso. As estimativas não são energia medida.

<div id="36-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

### 3.9 Protocolo para um estudo do detector de conclusão (não executado)

O protocolo a seguir é um método para uma medição futura. Nenhum passo foi executado. Ele está escrito para que o resultado que falta tenha um critério de saída em vez de um slogan.

População. Episódios extraídos de uma única superfície de produto, não de uma mistura de pesquisa aberta e fechamento de chamados. Cada episódio tem um `C` escrito com um número finito de cláusulas, cada uma observável por uma pessoa que não operou o modelo. O tamanho-alvo é uma escolha de projeto; este artigo não finge que foi feito um cálculo de poder. Uma primeira tabela utilizável precisa de positivos e negativos suficientes para que uma taxa não seja uma única anedota. O arquivo não contém essa tabela.

Rótulo. Dois anotadores marcam cada cláusula como verdadeira ou falsa no momento em que o sistema declara pela primeira vez que terminou, e de novo no fim da sessão. As discordâncias são arbitradas e contadas. A decisão do detector é registrada separadamente do rótulo.

Taxas primárias.

- Falso concluído: o sistema declara `C = 1` enquanto alguma cláusula crítica é falsa.
- Falso continuar: todas as cláusulas críticas são verdadeiras e o sistema emite mais chamadas a modelos ou ferramentas.
- A duração da sessão e a contagem de chamadas são covariáveis, não desfechos.

Divisão secundária, apenas se existir uma contabilidade de energia. Somar a energia, analítica ou medida na placa, das chamadas antes e depois do `t*` arbitrado. Enunciar a classe de medição na mesma frase que o número. Um total analítico do OpCounter não substitui um medidor e não é comparável às tabelas de Horowitz.

Exclusão. Os episódios sem um `C` escrito não são rotulados como "não saciados". Eles ficam fora do escopo. Os episódios adversariais ficam fora do escopo do desfecho de saciedade e ainda podem ser pontuados por recusa física se houver um certificado.

Falha do protocolo. Se os anotadores não conseguem concordar sobre as cláusulas, o predicado não foi escrito. Se o sistema não tem um evento de declarar concluído, o falso continuar não é identificado. Publicar um ranking de modelos em vez das duas taxas não executaria este protocolo.

<div id="37-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

### 3.10 Uma ilustração numérica de um ponto de êxtase (modelo, não ajuste)

Seja uma coordenada `x` a contagem de chamadas ao modelo em um único afazer, e defina

```text
U(x) = -(x - 4)^2
```

para um afazer cujo máximo construído está em quatro chamadas. Então `U(0) = -16`, `U(4) = 0`, `U(8) = -16`. A utilidade marginal é `dU/dx = -2(x - 4)`, que é positiva antes de 4, zero em 4 e negativa depois. A ilustração usa inteiros para que a mudança de sinal seja visível sem um ajuste. Nenhum conjunto de dados foi usado para escolher 4. Substituir 4 por outro inteiro desloca o pico e não muda a definição. Uma métrica de produto igual a `x` coloca `x = 8` acima de `x = 4`. Uma métrica de produto igual a `U` faz o contrário. A afirmação S-3 é essa não identidade, aqui em uma função de brinquedo totalmente especificada e, na Seção 3.4, em episódios construídos. Nenhuma das duas é uma estimativa de bem-estar para uma empresa.

O preço do token pode ser acrescentado sem confundir unidades. Suponha que uma chamada custe `p` em dinheiro e que o comprador pague `p * x` enquanto o valor segue `U`. O indicador aproximado do excedente do comprador `U(x) - p x` continua tendo um maximizador finito para qualquer `p >= 0`. Uma queda de `p` desloca o maximizador, que é a lógica do rebote neste brinquedo, e o maximizador continua finito. O brinquedo não diz onde está o maximizador para nenhum comprador real. Ele bloqueia a inferência de que um `p` menor elimina o máximo.

A Figura 1 desenha o brinquedo e a afirmação agregada, que é separada.

![Esquerda: ilustração de modelo de um ponto de êxtase. O valor U de x é igual a menos x menos 4 ao quadrado, com o excedente U menos p vezes x aos preços 0, 2 e 4; os maximizadores são 4, 3 e 2 chamadas, finitos a qualquer preço. Direita: um esquema do rebote agregado, no qual preços mais baixos abrem mais tarefas, e cada uma delas ainda para em seu próprio predicado.](/figures/satiation/satiation-rebound.svg)

*Figura 1. Saciedade da tarefa e rebote agregado. Ilustração de modelo do brinquedo desta seção, não um ajuste: o maximizador de $U(x) - p\,x$ é $x = 4 - p/2$, finito a qualquer preço. O painel da direita é um esquema; este artigo não estima nenhum rebote. Há uma [cópia em PNG](/figures/satiation/satiation-rebound.png).*

<div id="38-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

### 3.11 Códigos de motivo como partição, não como função de bem-estar

Seja `R` o conjunto de códigos de recusa em um traço. Particione `R` em `R_econ = {policy, budget_exceeded}` e `R_phys = {lut_veto, energy_veto, cbf_veto}`, de acordo com a taxonomia do esquema. Outros códigos, se forem acrescentados mais tarde, precisam ser atribuídos por escrito antes de serem contados. Um intervalo do traço contribui para a recusa econômica posterior à conclusão somente se `C` já vale 1 e o código está em `R_econ`. Ele contribui para a recusa física se o código está em `R_phys`, valha `C` 1 ou não. Uma ação insegura depois da conclusão está nas duas histórias e deve ser contada nas duas colunas, não tirada a média. A recusa irreversível da demonstração MCP é um exemplo físico: códigos de energia e de barreira, 0 chamadas ao executor. Não é um exemplo de `R_econ`. Um episódio futuro com `policy` depois de um patch integrado seria o exemplo econômico. O repositório não inclui esse episódio. A partição é a forma como ele seria pontuado.

## 4. Evidência

### 4.1 Afirmação S-1. A saciedade é um objeto econômico definido

Andersen (2001), https://doi.org/10.1007/PL00003852, e a construção de livro-texto do ponto de êxtase na Seção 2.1 sustentam S-1. A afirmação é teórica. Não é uma função de utilidade medida para nenhuma população de usuários neste estudo.

### 4.2 Afirmação S-2. Os preços publicados da inferência caíram fortemente a desempenho fixo

Sustentada pela Epoch AI (2025) e por Emberson e Roodman (2026), com as magnitudes que essas notas enunciam (Seção 2.5). A afirmação trata dos índices de preços que esses autores publicam. Não é uma afirmação de que a fatura de toda organização caiu 13 vezes, e não é uma afirmação sobre watts.

### 4.3 Afirmação S-3. As variáveis de engajamento não são o predicado de completude

Sustentada pelas definições da Seção 3.1 e pela descrição que a literatura sobre atenção faz dos objetivos de tempo na tarefa (Wu; visão geral do Center for Humane Technology). Nenhuma estimativa causal de perda de bem-estar é reivindicada. A afirmação lógica é a não identidade das variáveis: a contagem de tokens pode aumentar enquanto `C` permanece constante. Os episódios construídos da Seção 3.4 ilustram a não identidade, não são conjuntos de dados.

### 4.4 Afirmação S-4. Os preços da mania das bicicletas se descolaram de uma história simples de fundamentos

Sustentada por Quinn (2019): altas de mais de 200 por cento e quedas posteriores de mais de 75 por cento nas ações de bicicletas, de 1895 a 1900, não totalmente explicadas pelos fundamentos nem por uma simples mudança de risco nos testes desse artigo. A afirmação para aí. Ela não quantifica a saciedade dos domicílios em bicicletas.

### 4.5 Afirmação S-5. A posse de smartphones nos EUA é alta na ficha citada

A leitura que o arquivo do projeto faz da ficha sobre dispositivos móveis do Pew é uma posse perto de 91 por cento nas linhas de 2024 e 2025. A afirmação usada neste artigo é uma difusão dessa ordem, condicionada a que a ficha atualizada coincida com o arquivo. É um fato de saturação sobre a posse, não uma estimativa de ponto de êxtase.

### 4.6 Afirmação S-6. O cuidado não é precificado como um bem de software puro pelo enquadramento de Baumol

Baumol (1967) fornece o enquadramento. Acemoglu e Restrepo (2019) fornecem a linguagem das tarefas. A afirmação é que esses enquadramentos não implicam o fim das exigências de trabalho, confiança ou responsabilidade legal do cuidado quando os preços dos tokens caem. A afirmação não é uma previsão do gasto com saúde.

### 4.7 Afirmação S-7. Uma nota do lado vendedor questiona o gasto em relação ao benefício

A página do Goldman Sachs citada na Seção 2.6 existe e formula a pergunta em seu título.

### 4.9 Afirmação S-9. A Epoch não precifica a lei física a zero

Landauer (1961) e Horowitz (2014) sustentam uma lacuna permanente entre um limite ideal de apagamento e a prática CMOS. S-9 diz apenas que uma citação da Epoch não dispensa uma citação de Landauer.

### 4.10 Regras de projeto, marcadas como projeto

Essas regras decorrem se a pessoa aceita as definições e quer um produto que otimize `C` em vez de tokens. Elas não são efeitos.

1. Escrever `C` antes de acrescentar capacidade de modelo.
2. Tratar como temporário um prêmio no preço da síntese quando séries do tipo da Epoch e pesos abertos se aplicam àquele afazer.
3. Não descrever energia modelada ou simulada como energia medida.
4. Preferir um detector de `C` com uma tabela de erros a um aumento não rotulado do tamanho do modelo, uma vez que o afazer é o produto.
5. Exigir uma verificação de segurança física separada antes de qualquer ação irreversível.
6. Relatar separadamente a energia anterior e posterior à conclusão quando a divisão existir. Ela ainda não existe.
7. Não aplicar o predicado de saciedade a corridas adversariais ou militares (Seção 5.3).
8. Se o objetivo do produto é a atenção, dizer isso. As afirmações de completude então não se aplicam.

Testes eliminatórios para um roteiro, também de projeto: um plano que supõe apetite ilimitado por um afazer com um `C` curto; um preço que exige escassez permanente de síntese e nenhuma cunha física ou de responsabilidade legal; uma história de segurança que usa apenas uma cadeia de confiança; uma alegação de "gratuito" que apaga os joules; um laço de agente sem `C`.

### 4.11 O que seria um resultado e não é

Uma tabela de taxas de falso concluído e falso continuar. Uma série temporal de chamadas depois de `t*`. Uma leitura de medidor da energia em uma carga de trabalho enunciada. Uma estimativa estrutural do rebote. Um prêmio de preço de AGI estimado sobre um afazer saciado. Nada disso aparece entre as afirmações sustentadas da Seção 4.

### 4.12 A não identidade, enunciada como comparação de objetivos

Seja `x` a contagem de chamadas, `s` a duração da sessão, `J_pre` e `J_post` a energia antes e depois da conclusão arbitrada, e `C` o predicado. As implicações a seguir são definicionais.

| Observação | Não implica |
|-------------|----------------|
| `x` aumentou | `C` aumentou |
| `s` aumentou | o bem-estar aumentou |
| `p` caiu (S-2) | `J_post = 0` |
| `C = 1` | a taxa de erro do detector é conhecida |
| a posse de telefones é alta (S-5) | o valor marginal de mais uma chamada ao modelo é zero |
| os preços das ações de bicicletas tiveram alta e colapso (S-4) | os domicílios atingiram um ponto de êxtase no transporte |

A coluna da direita é a lista de inferências que este artigo recusa. Cada observação da esquerda é uma citação da Seção 4 ou uma variável da Seção 3. A tabela é a discussão comprimida em uma verificação. Uma frase que afirma algo da coluna da direita abandonou a evidência.

## 5. Discussão

### 5.1 O rebote: o problema central de identificação

Três resultados limitam o experimento natural. Gundlach e colegas (2025) constatam que os preços a desempenho fixo em benchmark caem depressa enquanto os preços de fronteira não caem, e Du (2026) encontra uma quebra estrutural e um prêmio de raciocínio na evolução dos preços, de modo que os cortes de preço chegam junto com mudanças de modelo. O Economic Index da Anthropic (setembro de 2025) relata que, entre tarefas, cada aumento de 1% no custo está associado a uma queda de 0.29% na frequência de uso, um número transversal inelástico, não uma mudança de preço ao longo do tempo. Um desenho no nível do provedor não consegue identificar o rebote no nível do mercado; o desenho precisa de preços e quantidades no nível do mercado.

Gillingham, Rapson e Wagner revisam o rebote decorrente de políticas de eficiência energética. O mecanismo é a elasticidade residual da demanda. Se o preço monetário da síntese cai, o uso aumenta onde os compradores ainda valorizam mais uma unidade. Em um ponto de êxtase para um afazer fechado, a derivada direta do valor em relação a mais síntese nesse afazer não é positiva, de modo que o rebote direto nesse afazer não está implicado. O rebote indireto, as novas tarefas e o deslocamento da atenção podem permanecer. A margem de novas tarefas de Acemoglu e Restrepo é um lugar por onde a quantidade pode reaparecer. A afirmação S-2, portanto, não implica um teto global para a computação. Ela implica um teto apenas em relação a um `C` enunciado. Negar o rebote global exigiria a divisão da Seção 3.3 e um sistema de demanda. Este artigo não nega o rebote global. Ele se recusa a tratar "Jevons" como uma razão para não escrever `C`.

Duas hipóteses tornam a questão testável.

- **H1. Gasto posterior à conclusão.** A fração da computação de agentes gasta depois de `C(z) = 1`, joules ou chamadas com `t > t*` sobre todos os joules ou chamadas do episódio, está mensuravelmente acima de zero. H1 é o desperdício direto que a parada por completude elimina. Ela pode ser estimada a partir de registros de agentes com um `t*` rotulado por episódio (Seção 3.3, item 1).
- **H2. Jevons nas tarefas.** H2 é a elasticidade do rebote direto de Khazzoom (1980), enunciada para tarefas. Quando o preço da síntese cai, a elasticidade do número de tarefas executadas supera a queda do gasto por tarefa. Então o gasto total aumenta mesmo que cada tarefa esteja saciada. H2 é rebote agregado.

**Identificação.** H1 não precisa de variação de preço: um corpus rotulado, as taxas de erro do detector da Seção 3.3, item 2, e a conta dividida. H2 precisa de mudanças de preço exógenas. Os cortes de preço dos provedores a qualidade de modelo fixa, anunciados em uma data conhecida, são experimentos naturais. O desenho é um painel de contas com o preço pago, as tarefas abertas, as chamadas por tarefa e um rótulo de completude por episódio, antes e depois de cada corte. Comparar contas em um modelo que teve o preço revisto com contas em modelos cujo preço não se moveu fornece uma estimativa de diferenças em diferenças da elasticidade da contagem de tarefas e da resposta do gasto por tarefa, separadamente. O gasto por tarefa pode cair enquanto a contagem de tarefas sobe. Os dois números são necessários. A parada por completude é uma afirmação sobre o primeiro. Jevons é uma afirmação sobre o segundo. Nenhum deles foi estimado aqui.

### 5.2 Bens de status e bens criativos

Alguns bens são valorizados porque não estão terminados: o status, a arte aberta, a pesquisa cujo `C` não é uma lista finita. A definição da Seção 3.1 não impõe um ponto de êxtase a esses bens. Ela impõe uma segmentação. Um afazer finito e uma prática aberta podem ser vendidos pela mesma empresa e não devem compartilhar um pressuposto de demanda. Precificar um afazer finito como se fosse uma corrida aberta de capacidade é um erro de categoria, não uma constatação sobre AGI.

### 5.3 Demanda adversarial

Se o ganho da outra parte é a perda desta, "suficiente" não é definido por uma lista local. Corridas armamentistas e algumas disputas de segurança estão nessa classe. As restrições físicas de confirmação ainda podem se aplicar: uma ação insegura pode ser recusada enquanto a demanda estratégica continua aberta. O escopo faz parte da afirmação, não é uma nota de rodapé que a anula.

### 5.4 Conhecimento incompleto da conclusão

As pessoas julgam mal a conclusão. Os detectores vão produzir falsos concluídos e falsos continuar. Isso é um argumento para medir o erro do detector, que a Seção 3.3 lista como ausente. Não é um argumento para que a duração da sessão substitua `C` em um domínio em que uma passagem de caso perdida tem uma parte responsável. Onde nenhum predicado pode ser escrito, a afirmação operacional deste artigo silencia.

### 5.5 Baumol não está resolvido

Um modelo que redige uma nota mais depressa pode elevar a produção de notas e deixar o exame, o julgamento e a responsabilidade com uma pessoa. As parcelas do gasto ainda podem se mover como Baumol descreveu se o resíduo humano não acelerar. Dizer o contrário seria uma previsão que esta bibliografia não contém. O enunciado permitido é S-6.

### 5.6 Síntese gratuita não é atuação gratuita

Um preço monetário em queda para a inferência não diz nada sobre a energia necessária para mover um sistema físico. Mover uma massa $m$, a partir do repouso, através de uma variação de velocidade $\Delta v$ exige pelo menos $\tfrac12 m (\Delta v)^2$ joules de trabalho, qualquer que seja o preço da instrução que o comandou. Os preços da Epoch ficam em um eixo diferente desse trabalho. Fundi-los em "IA gratuita" apaga a classe de medição.

### 5.7 Confiança não é um certificado

Uma pontuação alta de modelo pode ordenar propostas. Ela não é um predicado de completude: uma pontuação precisa de um limiar e de uma tabela de erros (taxas de falsos positivos e de verdadeiros positivos em relação a um conjunto rotulado) antes de decidir `C`.

### 5.8 O ceticismo do lado vendedor não é uma medição

S-7 impede que uma revisão da literatura ignore uma dúvida pública importante sobre gasto e benefício. Ela não permite que uma nota de pesquisa substitua um medidor ou uma estimativa de demanda. Se os números da nota forem citados mais tarde, a fonte precisa ser o PDF primário, e o rótulo é estimativa do lado vendedor.

### 5.9 O que uma estimativa estrutural de demanda exigiria

S-2 é um fato sobre o preço de oferta proveniente de séries publicadas secundárias. Uma estimativa de demanda é uma regressão diferente. No mínimo, ela precisa de uma quantidade (chamadas, tarefas fechadas ou ambas), de um preço e de uma forma de separar o movimento ao longo de uma curva de demanda do deslocamento da curva. O preço de benchmark da Epoch não é uma fatura no nível da empresa, e a fatura de uma empresa não é `C`. Ligá-los exige um painel que este estudo não tem: contas que registrem o preço pago, as chamadas feitas e um rótulo de completude arbitrado no mesmo episódio. Sem esse painel, a inclinação da demanda depois de `t*` não é identificada. O excedente de brinquedo da Seção 3.10 mostra apenas que um ponto de êxtase quadrático mantém um ótimo finito quando `p` cai. Ele não é a regressão que falta.

A segmentação pertence ao mesmo desenho. Codificar cada produto como `C` finito ou aberto antes de agrupar. Agrupar uma central de chamados com uma ferramenta de pesquisa aberta tira a média de dois regimes de demanda e pode fabricar uma aparência de apetite ilimitado. A exclusão militar da Seção 5.3 é a mesma regra aplicada a um domínio em que o objetivo do oponente impede um ponto de êxtase local. Uma tabela com esses códigos, mesmo ainda sem preços, seria mais informativa do que um único número de mercado total endereçável. A tabela não foi construída.

### 5.10 Por que nenhum múltiplo de `kT ln 2` é enunciado

O resultado de Landauer é uma desigualdade para um apagamento idealizado à temperatura `T`. Horowitz (2014) relata energias para operações CMOS específicas e para o tráfego de memória, em picojoules, sob as hipóteses daquele tutorial. Dividir um pelo outro produz um número somente depois que alguém escolhe a operação, o fator de atividade, a temperatura e o dispositivo. Nenhuma dessas escolhas é medida neste artigo. Enunciar um múltiplo acima do limite de Landauer fingiria que essas escolhas foram feitas. O enunciado científico é a direção da desigualdade: o CMOS irreversível prático, no relato de Horowitz, fica muito acima do limite, e um índice de preços não leva nenhum dispositivo até o limite.

## 6. Limites e ameaças à validade

Validade de construto. A saciedade operacional depende de `C`. Um `C` hostil ou vago torna o predicado arbitrário. A defesa do artigo é exigir que `C` seja escrito em cláusulas observáveis. Muitos produtos reais ainda não têm essa redação. Para esses produtos, a teoria ainda não se aplica empiricamente.

Validade interna da afirmação de preços. S-2 herda a identificação que a Epoch usou (ajuste de qualidade, escolha de benchmark, preços anunciados versus faturas realizadas). Este artigo não auditou os microdados. Uma revisão das séries da Epoch revisaria as magnitudes de S-2 e poderia não revisar a direção. S-2 deve ser relida contra as páginas primárias antes de ser usada como número executivo.

Validade externa. O trabalho e o cuidado, tal como definidos, excluem a rivalidade militar e podem excluir a pesquisa. A posse de telefones não se transfere para produtos de agentes. Os preços das ações de bicicletas não se transferem para as margens do software. Os episódios construídos não são uma amostra.

Validade de medição. Sem joules divididos, sem matriz de confusão do detector e sem medidor de energia em nenhum dispositivo. As especificações de hardware do fabricante não são medições de energia.

Variável omitida. Novas tarefas podem absorver o gasto liberado pela síntese barata. A Seção 5.1 enuncia isso. Um roteiro que trate a saciedade por afazer como uma previsão da demanda agregada de computação não é autorizado por este artigo.

Viés de publicação e tipo de documento. Wu é um livro. A página da Humane Technology é militância. O Goldman Sachs é lado vendedor. Quinn, Epoch, Baumol, Acemoglu e Restrepo, Landauer e Horowitz são as citações que sustentam a carga, e sustentam frases diferentes. A estrutura do artigo é uma tentativa de impedir que essas frases sejam reduzidas, pela média, a um estado de ânimo.

Falseadores. S-1 falha se a teoria citada não contém uma região de utilidade marginal zero. Ela contém. S-2 falha se as páginas primárias da Epoch não relatam quedas desse tipo. Um corpus rotulado futuro em que chamadas adicionais depois de um `C` correto elevem sistematicamente um valor especificado de forma independente falsearia a saciedade para esse corpus. Um corpus assim não falsearia a definição. Ele delimitaria seu domínio.

As especificações de hardware do fabricante listam capacidades, não a atividade de comutação, a potência estática nem a energia de uma carga de trabalho. Um relatório de energia precisa nomear o hardware, a frequência de relógio, a carga de trabalho, o medidor e a duração.

## 7. Conclusão

A saciedade é um objeto padrão na teoria citada, e tem uma forma operacional estreita: um predicado de completude escrito que a síntese adicional não faz avançar. As séries publicadas da Epoch documentam uma queda acentuada do preço monetário da inferência a desempenho fixo. Essa queda sustenta uma descrição dos afazeres digitais como gratuitos na margem e não sustenta joules gratuitos, movimento gratuito da planta nem o fim da estrutura de custos do cuidado. Os preços das ações de bicicletas, a difusão dos smartphones e os mercados de atenção são mais fracos e mais fortes das maneiras específicas que a Seção 4 enuncia. Os objetos científicos que faltam são um detector de conclusão rotulado, uma divisão da energia antes e depois da conclusão e uma estimativa de demanda capaz de ver o rebote. Até que existam, o conteúdo empírico do artigo é o registro citado, e seu conteúdo formal é o predicado.

## Referências

## Apêndice A. Regras de decisão e não resultados

| Id | Enunciado | Classe |
|----|-----------|-------|
| R1 | Escrever o predicado de completude antes de acrescentar capacidade. | Projeto |
| R2 | Esperar que os prêmios no preço da síntese se erodam onde se aplica evidência do tipo da Epoch. | Projeto, condicionado a S-2 |
| R3 | Não alegar energia gratuita nem atuação gratuita. | Restrição decorrente de S-9 |
| R4 | Separar os motivos de parada econômicos dos motivos de parada físicos. | Projeto |
| R5 | Publicar as taxas de erro do detector antes de tratar uma parada como precisa. | Ainda não é um resultado |
| R6 | Dividir a energia antes e depois da conclusão. | Ainda não é um resultado |
| R7 | Manter as corridas adversariais fora da afirmação de saciedade. | Escopo |
| R8 | Reler as fontes primárias do Pew e da Epoch antes de citar uma magnitude mais fina. | Método |

## Apêndice C. Mapa de afirmações

Sustentadas agora: S-1 a S-9, com as frases de escopo da Seção 4.

Não sustentadas: o fim da doença dos custos de Baumol; o movimento gratuito da planta; a saciedade da demanda militar; um rebote global numérico de zero; a operação de um modelo de linguagem em escala de Landauer; watts em placa; um preço de AGI como fato sobre afazeres saciados; uma defasagem universal de destilação; a liderança em desempenho do silício.

Medições em aberto: Seção 3.3.
