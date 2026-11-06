---
title: "A distância entre o possível e o implantado: um modelo de cadência da inteligência computacional e a função de forçamento das ferramentas de automação"
deck: "Métodos que reduzem o custo da inteligência computacional são publicados anos antes de a maioria dos produtos os usar. Este artigo mede essa distância com fontes datadas, modela como os calendários de resultados e de financiamento definem parte dela, testa que parcela do gasto em infraestrutura é um circuito fechado, modela o custo de uma tarefa e indica que dados refutariam o modelo."
lang: "pt"
source: "latency"
complete: true
---


*18 de outubro de 2026. As fontes estão datadas e classificadas por classe de evidência nas Referências. As proposições foram derivadas à mão e não foram verificadas por um assistente de demonstração, e nenhum dos números da Seção 7 é um dado. As quantidades marcadas como saída do modelo são calculadas a partir de cifras citadas e não são observações.*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Novos métodos para executar inteligência computacional a custo mais baixo são publicados abertamente e depois chegam à maioria dos produtos após um atraso. Este artigo define esse atraso como uma quantidade mensurável, divide-o em partes técnica, de calendário e de incentivos, e modela como uma ferramenta que reduz o custo da automação muda aquilo pelo que um vendedor pode cobrar com lucro. Em seguida situa o atraso dentro da atual expansão da infraestrutura. Expõe o que os registros públicos documentam sobre o dinheiro que circula entre laboratórios, nuvens e fabricantes de chips, enuncia um teste que separa um circuito fechado da demanda externa, constrói um modelo de custos em dólares e joules por tarefa, compara os métodos de software abertos e o hardware alternativo com a pilha estabelecida, e traça um mapa de onde se encontram a capacidade, o cômputo e a energia. As proposições foram derivadas à mão, e cada previsão nomeia os dados que a refutariam.

**Em palavras simples**

1. Métodos abertos que tornam a inteligência computacional mais barata alcançam os mesmos resultados em máquinas mais antigas e mais baratas, e a espera entre um método publicado e um produto lançado é mais curta para alguns métodos do que para outros.
2. A maior parte do que uma tarefa custa é o preço das máquinas e não a eletricidade, e os preços pagos pelos usuários caíram muito mais depressa do que os custos do hardware. O dinheiro por trás das máquinas inclui circuitos entre alguns poucos laboratórios, nuvens e fabricantes de chips que os registros documentam, e inclui também dinheiro de outros negócios e de clientes externos a esses circuitos. A Seção 10 oferece um teste que separa os dois com dados.
3. Parte da espera vem dos calendários, porque as empresas decidem em passos trimestrais e anuais. Quando uma ferramenta torna o trabalho barato o bastante, esperar deixa de compensar o vendedor, e o que resta a cobrar é o custo de mudar de fornecedor e não o custo do cômputo.

<div id="notation" class="anchor-alias" aria-hidden="true"></div>

## Notação

| Termo | Significado neste artigo |
|---|---|
| Tarefa | Uma unidade de trabalho útil com um limiar de qualidade enunciado $q$, por exemplo uma resposta correta ou uma estimativa verificada. |
| Joules por tarefa, $e$ | Energia medida em joules para concluir uma tarefa com qualidade de pelo menos $q$. Aqui é a unidade de conta da inteligência computacional. |
| Custo por tarefa, $c$ | Custo monetário de uma tarefa: $c = \kappa e + h$, onde $\kappa$ é o preço de um joule e $h$ é o custo de hardware e operação que não cai com $e$. |
| Fronteira de capacidade, $C(t)$ | O custo por tarefa mais baixo alcançável por qualquer método documentado publicamente até o tempo $t$. |
| Fronteira implantada, $D(t)$ | O custo por tarefa mais baixo oferecido em um produto de disponibilidade geral até o tempo $t$. |
| Latência, $L$ | Para um nível de custo $c$, o tempo entre o momento em que a fronteira de capacidade alcança $c$ e o momento em que a fronteira implantada alcança $c$. Define-se na Seção 0. |
| Período de reporte, $T$ | O espaçamento entre as datas de decisão de uma empresa que reporta resultados, cerca de um trimestre. |
| Fricção de mudança, $s$ | O custo por tarefa que um comprador assume para passar a outro vendedor: integração, transferência de dados, retreinamento, condições contratuais, configurações padrão. |
| Custo de adoção, $K$ | Custo único de reconstruir uma oferta em torno de um método novo. |
| Tempo de acelerador por tarefa, $\tau$ | Horas de acelerador utilizadas que uma tarefa ocupa com qualidade de pelo menos $q$. Seção 12. |
| Preço do joule com carga de capital, $\kappa^{*}$ | Preço da eletricidade mais o capital por hora utilizada dividido pela potência da instalação. Seção 12. |
| Limite da proporção de circuito fechado, $\bar\varphi_s$ | Limite superior da proporção das receitas de um fornecedor que o seu próprio capital aportado poderia ter financiado. Seção 10. |
| Déficit tolerado, $w$ | A maior queda dos resultados reportados em um período que uma empresa aceitará, nas mesmas unidades que $K$. |

<div id="0-definitions-and-scope" class="anchor-alias" aria-hidden="true"></div>

## 0. Definições e escopo

Seja $c_C(t)$ o custo por tarefa mais baixo alcançável no tempo $t$ por qualquer método documentado publicamente com qualidade $q$. É não crescente, porque a documentação não se retira. Seja $c_D(t)$ o custo por tarefa mais baixo oferecido em um produto de disponibilidade geral no tempo $t$. É não crescente pela mesma razão quando um vendedor não retira uma oferta, e $c_D(t) \ge c_C(t)$ por construção. Para um nível de custo $c$, escreve-se $t_C(c) = \inf\{t : c_C(t) \le c\}$ e $t_D(c) = \inf\{t : c_D(t) \le c\}$.

**Definição 1 (latência).** $L(c) = t_D(c) - t_C(c) \ge 0$. A pergunta do artigo é quão grande é $L$, o que a fixa e o que a move.

**Definição 2 (partes técnica, de calendário e de incentivos).** Para uma empresa $i$ a latência decompõe-se como $L_i = d + w^{cad}_i + w^{gate}_i$. Aqui $d$ é o atraso de preparação técnica: o tempo de que os engenheiros precisam para portar, testar e robustecer o método. O termo $w^{cad}_i$ é a espera de calendário: o tempo entre a preparação e a próxima data em que a empresa toma decisões de lançamento. O termo $w^{gate}_i$ é o atraso por incentivos: o tempo durante o qual o lançamento tem valor positivo de longo prazo mas uma regra de reporte ou de financiamento o bloqueia. A **latência artificial** é $L_i - d$. A palavra usa-se em sentido estreito: é a parte que o tempo de engenharia não explica, e não é uma afirmação sobre o motivo de ninguém.

**Escopo.** O artigo cobre os métodos que mudam o custo da inteligência computacional: arquiteturas de modelos, formatos numéricos, kernels, compiladores, procedimentos de inferência estatística e medição de energia. Cobre também a infraestrutura que os executa: os fluxos de capital e de compromissos de cômputo entre laboratórios, nuvens e fabricantes de chips, o custo de uma hora de acelerador, os métodos abertos e o hardware alternativo que mudam o tempo de acelerador por tarefa, e onde se situam a capacidade, o cômputo e a energia. Não prevê nenhuma empresa, preço nem quota. A energia por tarefa em joules é a métrica onde existe uma cifra em joules. Onde uma fonte reporta apenas dólares ou segundos, usa-se a cifra em dólares ou segundos e rotula-se como tal.

<div id="1-kinds-of-evidence" class="anchor-alias" aria-hidden="true"></div>

## 1. Classes de evidência

Cada fonte deste artigo classifica-se em uma de três classes, e a classe figura nas Referências.

- **Estabelecido por demonstração na fonte.** A fonte contém um teorema ou uma derivação analítica com a sua demonstração. Uma demonstração dentro de um artigo é a demonstração do autor, não uma verificada por máquina, e o artigo não a chama de mais do que isso. Os autos judiciais e as publicações estatísticas classificam-se como demonstrados, porque reportam fatos datados e não derivações.
- **Demonstrado.** A fonte reporta uma medição, inquérito, experimento ou lançamento datado com um método enunciado. O resultado vale para esse contexto e pode não se transferir para outros.
- **Opinião.** A fonte é uma previsão, uma declaração de um fornecedor sem dados, um relato de um profissional ou uma revisão que resume outros trabalhos. As revisões classificam-se aqui porque o artigo não pode saber por elas o que foi medido.

As cifras citam-se tal como a fonte as declara, com o contexto e as ressalvas da própria fonte. Onde uma quantidade se deriva de cifras citadas, o texto chama-a saída do modelo e mostra a aritmética ou nomeia o script que a calcula. Os anúncios de planos, metas e investimentos previstos classificam-se como opinião, porque declaram uma intenção e não um resultado, e os registros perante o regulador classificam-se como demonstrados. Cada fonte foi obtida em texto completo e cada cifra citada foi localizada nesse texto. As fontes em alemão, francês, espanhol, português, italiano, coreano, japonês e chinês foram lidas no idioma original, e as suas cifras reproduzem-se em inglês sem alterações.

<div id="2-what-became-possible-2024-to-2026" class="anchor-alias" aria-hidden="true"></div>

## 2. O que se tornou possível, de 2024 a 2026

A lista seguinte organiza-se segundo a alavanca que cada método aciona sobre o custo por tarefa. Cada linha dá a data da primeira publicação pública, a afirmação tal como os autores a reportam e a classe.

**Tabela 1. Métodos que mudam o que custa uma tarefa.**

| Alavanca | Método e afirmação | Publicado | Classe |
|---|---|---|---|
| Arquitetura | Os modelos de espaço de estados seletivos e as variantes de atenção são duais através de matrizes semisseparáveis estruturadas, e a camada resultante reporta-se de 2 a 8 vezes mais rápida do que a varredura anterior [38]. | 31 de maio de 2024 | estabelecido por demonstração na fonte |
| Arquitetura | Vários grupos publicaram modelos híbridos de espaço de estados e atenção com pesos abertos ao longo de 2024 e 2025 [39]. | 2024 a 2025 | demonstrado |
| Formato numérico | Os pesos ternários igualam a perplexidade e as pontuações em tarefas finais de 16 bits a partir de cerca de 3 bilhões de parâmetros, com menor latência, memória e energia, nos experimentos dos autores [40]. | 27 de fevereiro de 2024 | demonstrado |
| Formato numérico | Pré-treinamento estável em 4 bits de um modelo híbrido de 12 bilhões de parâmetros com 10 trilhões de tokens, comparável aos resultados em 8 bits, reportado pelo fabricante do hardware [41]. | set. de 2025 | demonstrado |
| Kernels | Um kernel de atenção alcança até 75% do desempenho máximo em 16 bits em uma geração de aceleradores, frente a 35% do seu predecessor [42]. | jul. de 2024 | demonstrado |
| Esparsidade | Atenção esparsa alinhada com o hardware e treinável de forma nativa, com acelerações reportadas a 64 mil tokens de contexto [43]. | fev. de 2025 | demonstrado |
| Decodificação | A decodificação especulativa deixa a distribuição de saída sem alterações e mediu-se de 2 a 3 vezes mais rápida em um modelo de tradução grande [23]. | 30 de novembro de 2022 | estabelecido por demonstração na fonte |
| Escalamento | Quando se conta a demanda de inferência de toda a vida útil, o modelo ótimo em custo é menor e treina-se com mais tokens do que dá a regra que só considera o treinamento [44, 45]. | jan. de 2024 | demonstrado |
| Custo de treinamento | Um modelo de escala de fronteira reportado com 2,788 milhões de horas de acelerador para o treinamento completo, com atenção latente e treinamento em 8 bits [46]. | 26 de dezembro de 2024 | demonstrado |
| Inferência conforme | Cobertura de amostra finita e livre de distribuição para qualquer preditor, com demonstrações reunidas em um livro [47]; uma revisão publicada pela primeira vez em outubro de 2024 e editada em 2025 cobre dados estruturados, não estruturados e dinâmicos [48]. | 18 de novembro de 2024 | estabelecido por demonstração na fonte |
| Inferência com previsões | Intervalos válidos a partir de um pequeno conjunto etiquetado e muitas previsões de máquina, para qualquer preditor [49]. | 2023 | estabelecido por demonstração na fonte |
| Inferência sequencial | Processos E e sequências de confiança que continuam válidos quando um teste se detém a qualquer momento [50]. | nov. de 2023 | estabelecido por demonstração na fonte |
| Estimação causal | O aprendizado de máquina sem viés dá inferência válida sobre um parâmetro objetivo com modelos de perturbação flexíveis, estendido a efeitos identificáveis para além do ajuste por porta traseira [51, 52]. | 2018; 2021 | estabelecido por demonstração na fonte |
| Compiladores | Passes de compilador para diferenciação automática de ordem superior reportam até 1,3 vezes em operadores de segunda ordem, de forma preliminar [53]; um artigo metodológico de 2026 afirma que JAX compilado supera de longe a eficiência de Stan em hardware moderno, sem cifras de referência no seu resumo [54]. | 2025 | demonstrado |
| Programação probabilística | Um compilador que conserva a semântica probabilística reporta uma média geométrica de 6,4 vezes sobre Stan e 53 vezes sobre Turing em testes de referência padrão [55]. | 2025 a 2026 | demonstrado |
| Medição de energia | Um teste de referência aberto mede a energia de inferência em 40 arquiteturas e reporta configurações de Pareto de tempo e energia com poupanças superiores a 40% em alguns casos [56]; um fornecedor reporta 0,24 watts-hora para uma consulta de texto mediana em produção [57]. | 2025 | demonstrado |

Duas taxas dão o contexto. O cômputo necessário para alcançar uma pontuação fixa de um modelo de linguagem reduziu-se a metade aproximadamente a cada 8 meses, com um intervalo de 95% de cerca de 5 a 14 meses [58]. O preço de alcançar um nível fixo em um teste de referência caiu entre 9 e 900 vezes ao ano em seis testes, com uma mediana de cerca de 50, e as taxas mais rápidas apoiam-se em menos de um ano de dados [59]. Ambas são taxas de mudança da fronteira de capacidade $C(t)$ ou de um preço, e nenhuma mede a distância até a implantação.

Dois limites aplicam-se à tabela. Várias linhas são acelerações frente a uma linha de base escolhida pelos autores, de modo que os números não se somam nem se comparam entre linhas. E "possível" nestas linhas significa demonstrado pelos autores em um contexto enunciado, não disponível em um produto.

<div id="3-what-the-gap-looks-like-in-data" class="anchor-alias" aria-hidden="true"></div>

## 3. Como a distância aparece nos dados

**Difusão de longo prazo.** Em 15 tecnologias e 166 países de 1820 a 2003, o atraso médio entre a invenção e a adoção em um país foi de cerca de 45 anos, e os atrasos encolheram ao longo do período [60]. A mesma história traz um aviso sobre o que a adoção significa. Os motores elétricos só elevaram a produtividade das fábricas depois de as plantas serem redesenhadas em torno de um motor por máquina, uma mudança que levou décadas [61]. Um modelo posterior atribui a queda e a subida da produtividade medida a um investimento complementar não medido em processos e competências [62]. Em ambos os relatos o atraso é sobretudo o custo de reorganizar-se em torno da ferramenta, que na notação acima é $K$.

**Lançamento aberto até o hardware de consumo.** Para modelos que cabem em uma placa gráfica de consumo, o atraso médio em relação ao melhor modelo no geral foi de 6 a 12 meses em quatro medidas em 2025, com o maior atraso, 12,4 meses, em uma pontuação de preferência [63]. Uma análise mais ampla de modelos de pesos abertos de qualquer tamanho encontrou cerca de um ano, com um intervalo de 5 a 22 meses por teste de referência, e uma análise posterior baseada em índices situou a média perto de 3 meses [64]. Estas cifras medem a distância entre duas fronteiras públicas. São limites inferiores de um atraso até os produtos, porque um modelo aberto em uma placa ainda não é um produto que alguém seja pago para apoiar.

**Do artigo ao produto.** A decodificação especulativa foi publicada em novembro de 2022. O empregador dos seus autores reportou aplicá-la em produtos até dezembro de 2024 [24]. Um relato de profissional do mesmo mês diz que o uso em produção precisou de trabalho extra em agrupamento, qualidade e fiabilidade e ajuda sobretudo a tamanhos de lote limitados [65]. Mais dois pares estão na Seção 13. Alguns poucos pares datados não são uma distribuição, e o protocolo da Seção 16 especifica como recolher muitos. Uma medida de mais longo prazo da distância artigo-patente encontra que as citações de patentes a artigos são em média 14,4 anos mais antigas do que a patente na primeira página e 16,6 anos quando se contam as citações no texto [66], e as patentes e artigos ligados tipicamente estão a duas a quatro etapas de citação [67]. Essas cifras são para a ciência em geral e não dizem respeito ao aprendizado de máquina em particular.

**Prática dos modelos de 4 bits.** Relatos de profissionais situam o ponto em que a inferência local de 4 bits se tornou viável em máquinas de consumo em 2023 [68]. Os relatos são narrativos, de modo que esta é evidência da classe opinião para uma data e não uma medição.

**Adoção pelas empresas.** O suplemento de 2026 do United States Census Bureau encontrou 18% das empresas a usar IA em uma função de negócio de novembro de 2025 a janeiro de 2026, 22% a esperar usar dentro de seis meses, e 57% dos utilizadores em três ou menos funções [34]. Na União Europeia, 20,0% das empresas com 10 ou mais empregados usaram pelo menos uma tecnologia de IA em 2025, mais 6,5 pontos do que em 2024, com 55,0% das grandes, 30,4% das médias e 17,0% das pequenas empresas [33]. A OCDE reporta 13,9% de adoção em 2024 e 39% das grandes empresas frente a 12% das pequenas [35]. Dados de contratação chineses mostram a contratação de IA generativa em 21% das empresas cotadas frente a 0,2% das não cotadas no fim de 2025 [69]. A redação dos inquéritos e os quadros de amostragem diferem por fonte, e a pergunta do Census foi revista em novembro de 2025, de modo que as taxas não são comparáveis entre linhas.

**Estatísticas oficiais nas línguas originais.** O Statistisches Bundesamt da Alemanha reporta que 20% das empresas com 10 ou mais empregados usaram IA em 2024, frente a 12% em 2023 e 11% em 2021, com 48% das grandes, 28% das médias e 17% das pequenas, e nomeia a falta de conhecimento e a incerteza jurídica como as razões mais comuns para não a usar [70]. A sua tabela de 2025 dá 26% no conjunto e 57% para empresas com mais de 250 empregados, sob uma definição de empresa alterada [31]. O Insee reporta 10% das empresas em França a usar IA em 2024, quatro pontos acima de 2023, 33% das empresas com 250 ou mais empregados, e 42% na informação e comunicação frente a 5% ou menos no transporte, alojamento e restauração, e construção [37]. O Instituto Nacional de Estadística de Espanha reporta 21,1% das empresas com 10 ou mais empregados a usar IA no primeiro trimestre de 2025, 8,7 pontos mais do que um ano antes [32]. O Cetic.br do Brasil reporta 13% das empresas a usar IA em 2024, a mesma parcela que em 2023, concentrada nas grandes empresas e na informação e comunicação [36]. Estatísticas de ministérios coreanos, tal como reportadas na imprensa coreana, dão 32,9% das empresas a usar tecnologia ou serviços de IA em 2024 frente a 30,3% em 2023, e 66,9% para empresas com 250 ou mais trabalhadores [30]. O livro branco do Japão inquiriu trabalhadores em quatro países e encontrou qualquer uso empresarial de IA generativa a 55,2% no Japão, 90,6% nos Estados Unidos, 90,3% na Alemanha e 95,8% na China. Entre as empresas japonesas, 49,7% tinham uma política ativa ou de uso limitado em 2024 frente a 42,7% um ano antes, e a preocupação japonesa mais comum, a 30,1%, era não saber como usá-la de forma eficaz, frente a 9,7% nos Estados Unidos e 10,4% na China [71]. A CNNIC da China conta 515 milhões de utilizadores de IA generativa em junho de 2025, 266 milhões a mais do que em dezembro de 2024, uma penetração de 36,5% [72]. Estas são medições de uso, não de lançamento. Dentro de cada país a taxa sobe com o tamanho da empresa, o que é consistente com um custo de adoção fixo $K$ a pesar menos sobre um orçamento grande, embora os inquéritos não possam separar isso de outras causas.

**Uso ao nível das pessoas e das tarefas.** Quase 40% dos adultos dos Estados Unidos com idades entre 18 e 64 usaram IA generativa no fim de 2024, e cerca de 23% dos trabalhadores a tinham usado no trabalho na semana anterior [73]. Um estudo de campo com 5.179 agentes de apoio ao cliente encontrou 14% mais resoluções por hora em média e 34% mais para trabalhadores novatos e de baixa qualificação [74]. Um ensaio aleatorizado com 16 programadores experientes e 246 tarefas encontrou que as tarefas com IA permitida demoraram 19% mais nesse contexto [75]. Estes resultados diferem porque as tarefas, as pessoas e as ferramentas diferem. Mostram que a implantação não é um único acontecimento, e é por isso que $D(t)$ se define a partir das ofertas e não a partir do uso.

**O que abranda a própria investigação.** O esforço de investigação subiu enquanto a produtividade da investigação caiu na maioria dos setores, e manter a densidade de chips a duplicar precisou de mais de 18 vezes os investigadores do início dos anos 1970 [76]. Isto diz respeito a $C(t)$, não a $L$, e anota-se para que o artigo não leia a fronteira de capacidade como gratuita.

<div id="4-calendars-reporting-and-funding-periods" class="anchor-alias" aria-hidden="true"></div>

## 4. Calendários: períodos de reporte e de financiamento

As datas de decisão nas empresas cotadas seguem o calendário de reporte. Em um inquérito a 401 executivos financeiros, 78% abririam mão de valor económico para suavizar os resultados reportados, e 55% evitariam iniciar um projeto de valor atual líquido muito positivo se isso significasse falhar o consenso do trimestre [77]. Empresas cotadas comparáveis investem menos, e respondem menos às oportunidades de investimento, do que empresas privadas [78]. Tudo isto está demonstrado para tecnologias e períodos anteriores, e nada é uma medição de lançamentos de IA.

A atenção segue o mesmo calendário. A contagem de chamadas de resultados de grandes empresas dos Estados Unidos que citam "AI" chegou a 306 no terceiro trimestre de 2025, frente a uma média de dez anos de 86 [79]. A linguagem das chamadas de resultados tem sido usada como instrumento de medição para outros temas, validada contra a leitura manual [80], e o mesmo instrumento pode apontar-se a temas de lançamento.

O financiamento segue um calendário mais longo. Um fundo de capital de risco tem uma vida finita, tipicamente dez anos, e as firmas levantam novos fundos a cada três a cinco anos [81]. Os acordos de parceria especificam vidas finitas, normalmente dez anos [82]. Os dois calendários diferem em duração, cerca de um trimestre e três a cinco anos, e ambos quantizam quando um compromisso pode ser feito. A Proposição 1 abaixo usa apenas essa estrutura.

![Linha do tempo de datas de decisão trimestrais com três exemplos de tempos de preparação e as semanas que cada um espera até à próxima data; o texto indica que a espera média é metade do período.](/figures/latency/cadence-vs-quarter.png)

*Figura 1. Cadência contra preparação: como um calendário acrescenta espera (ilustração do modelo). Datas de decisão trimestrais com $T = 0,25$ ano; a preparação em uma fase aleatória uniforme espera $T/2$ em média. As fases de preparação são modeladas, não observadas.*

<div id="5-control-and-incumbent-response" class="anchor-alias" aria-hidden="true"></div>

## 5. Controlo e resposta dos incumbentes

Dois resultados mais antigos enquadram o incentivo a implantar. A análise de Arrow encontra o incentivo a inventar menor sob monopólio, no sentido de barreiras à entrada, do que sob concorrência, e conta um monopólio temporário que não impede a entrada como quase competitivo [83]. Uma revisão posterior da literatura sobre concorrência e inovação nota que os incentivos de preempção são uma força ausente dos modelos estáticos simples [84]. Os incumbentes também falham mudanças que rearranjam componentes conhecidos, porque as suas rotinas filtram o que notam [85]. Nenhum é uma afirmação sobre qualquer empresa agora.

O controlo sobre a distribuição está documentado em autos judiciais públicos. Em setembro de 2025 um tribunal de distrito dos Estados Unidos barrou contratos de distribuição exclusiva para vários produtos de busca e de assistente, permitiu pagamentos de predefinição não exclusivos com prazos em geral limitados a um ano, e ordenou remédios de partilha de dados e de sindicação [86]. O artigo usa o registro apenas como evidência de que as predefinições e os termos de distribuição são precificados e regulados, que é o que o parâmetro $s$ na Seção 6 representa.

<div id="6-the-model" class="anchor-alias" aria-hidden="true"></div>

## 6. O modelo

**Contexto.** Uma população de compradores com demanda $Q(p) = A - p$ por período por uma tarefa ao preço $p$. Um incumbente atende-a ao custo $c_0$ com um método existente. Um método público torna-se disponível a qualquer um ao custo $c_e(t)$, não crescente no tempo. Um comprador pode mudar para um vendedor que use o método público com fricção $s$ por tarefa, de modo que o teto de preço do incumbente é $u(t) = c_e(t) + s$. O incumbente pode lançar uma oferta construída sobre o método público a um custo único $K$. As decisões tomam-se apenas nas datas $kT$.

**Hipóteses.**

- A1. Demanda linear $A - p$, com $c_0 < A - s$.
- A2. O custo público declina: $c_e$ é não crescente e contínuo com $c_e(0) = c_0$, e $c_e(t) \ge h \ge 0$.
- A3. O teto $u$ liga o preço do incumbente, isto é $u < \tfrac12 (A + c)$ para o custo $c$ que enfrenta. Isto vale para os números da Seção 7.
- A4. O incumbente maximiza o lucro descontado à taxa $r$ sujeito a uma regra de reporte: uma parcela $\varphi \in [0,1]$ de $K$ é despesa no período de lançamento, e os resultados reportados do período de lançamento não podem ficar aquém do nível pré-lançamento em mais do que $w$.
- A5. Depois do lançamento o custo do incumbente é $c_e(t)$, o custo do método público.
- A6. Os ganhos de fluxo do lançamento tratam-se como constantes depois da data de lançamento (aproximação de estado estacionário).

**Proposição 1 (quantização do calendário).** Se um método fica pronto no tempo $\rho$ e a empresa lança na primeira data de decisão em ou depois de $\rho$ em que o lançamento vale a pena, a espera é $w^{cad} = \lceil \rho / T \rceil T - \rho$. Se $\rho \bmod T$ é uniforme em $[0, T)$, então $E[w^{cad}] = T/2$ e $\mathrm{Var}[w^{cad}] = T^2/12$.

*Derivação.* Escreve-se $\rho = mT + x$ com $x$ uniforme em $[0,T)$. Para $x > 0$ a próxima data é $(m+1)T$ e a espera é $T - x$, que é uniforme em $(0, T]$. Uma variável uniforme em um intervalo de comprimento $T$ tem média $T/2$ e variância $T^2/12$. O caso $x = 0$ tem probabilidade zero. $\square$

*Consequência.* Uma empresa que decide em um calendário trimestral acrescenta em média cerca de 6 semanas, e uma que decide em um ciclo de financiamento de 3 a 5 anos acrescenta 1,5 a 2,5 anos, ao atraso de preparação $d$, sem causa de engenharia. A hipótese de que a preparação é uniforme dentro de um período é a parte fraca, e a Previsão 1 testa o contrário.

**Proposição 2 (limiar de lançamento e lançamento forçado).** Define-se o ganho de fluxo $g(c) = (c_0 - c)(A - c - s)$ para o custo externo $c = c_e$. Em $0 \le c < \min(c_0, A - s)$, $g$ é estritamente decrescente em $c$. Sem restrições de calendário ou de reporte, o lançamento é ótimo exatamente quando $g(c_e(t)) \ge rK$, isto é quando $c_e(t) \le c^\dagger$, onde $c^\dagger$ é a solução única de $g(c^\dagger) = rK$ se existir. Se $c_e \le c_0 - s$, reter não dá lucro, e o lançamento é preferível a reter. Uma regra de reporte pode atrasá-lo mas não pode tornar a retenção lucrativa.

*Derivação.* Sob A3 o incumbente que retém ao custo $c_0$ precifica no teto, de modo que o seu lucro é $(u - c_0)(A - u)$. Depois do lançamento o seu custo é $c$ e o seu lucro é $(u - c)(A - u)$. A diferença é $(c_0 - c)(A - u) = (c_0 - c)(A - c - s) = g(c)$. Diferenciando, $g'(c) = -(A - c - s) - (c_0 - c) < 0$ no intervalo enunciado, de modo que $g$ é estritamente decrescente. Com A6 o valor do lançamento é $g/r - K$, que é não negativo exatamente quando $g \ge rK$. Reter rende o lucro $(u - c_0)(A - u)$, que é zero em $u = c_0$, isto é em $c_e = c_0 - s$, e negativo abaixo. O lançamento nesse ponto rende o lucro $s(A - c - s) > 0$ por A1. $\square$

**Proposição 3 (porta de reporte, atraso e uma região de nunca lançar).** Sob A4 a mudança dos resultados reportados no período de lançamento é $g \cdot T - \varphi K$. O lançamento é permitido se isto for pelo menos $-w$, isto é se $g \ge (\varphi K - w)/T$. Define-se $G_{eff} = \max\{rK, (\varphi K - w)/T\}$ e $c_{eff} = g^{-1}(G_{eff})$. Então $c_{eff} \le c^\dagger$, a data de lançamento move-se de $t(c^\dagger)$ para $t(c_{eff})$ ou para o ponto de lançamento forçado $c_0 - s$, o que for anterior, e para $c_e(t) = c_e(0) e^{-\lambda t}$ o atraso é $(1/\lambda)\ln(c^\dagger / c_{eff})$ quando $c_{eff} \ge c_0 - s$. Se $G_{eff} > g(h)$, onde $h$ é o piso de custo, o lançamento nunca ocorre nas condições de VPL e de porta, e só o lançamento forçado em $c_0 - s$ se aplica se $c_0 - s \ge h$.

*Derivação.* Os resultados reportados no período de lançamento ganham $gT$ de lucro operacional e perdem a parte despesa $\varphi K$ do custo de adoção. Exigir que o líquido seja pelo menos $-w$ dá a desigualdade enunciada. Como $g$ é estritamente decrescente (Proposição 2), o maior de dois ganhos exigidos corresponde ao limiar de custo menor, de modo que $c_{eff} \le c^\dagger$. Com $c_e(t) = c_e(0) e^{-\lambda t}$ o tempo para alcançar $c$ é $t(c) = (1/\lambda)\ln(c_e(0)/c)$, e a diferença de dois desses tempos é o atraso enunciado. O ganho alcançável é no máximo $g(h)$ porque $c_e \ge h$ por A2. $\square$

**Proposição 4 (função de forçamento).** Suponha-se que uma ferramenta de automação reduz o custo de adoção de $K$ para $K'$. (a) O limiar de VPL $c^\dagger$ sobe, de modo que o lançamento é ótimo mais cedo. (b) Se $\varphi K' \le w$, a porta de reporte não liga, $G_{eff} = rK'$, e $w^{gate} = 0$. (c) A latência total da empresa cai para $d' + w^{cad}$, onde $d'$ é o atraso de preparação técnica com a ferramenta.

*Derivação.* (a) $g(c^\dagger) = rK$ e $g$ é estritamente decrescente, de modo que baixar $K$ baixa o ganho exigido e sobe $c^\dagger$. (b) A condição de porta $g \ge (\varphi K' - w)/T$ é satisfeita por todo $g \ge 0$ quando o lado direito é não positivo, que é $\varphi K' \le w$. Então $G_{eff} = rK'$. (c) Segue da Definição 2 e da Proposição 3. $\square$

*Leitura.* Uma ferramenta atua como função de forçamento de duas maneiras separadas. Baixa $K$ e assim remove o atraso de porta uma vez que $K$ passa abaixo de $w/\varphi$. E baixa $c_e$ para todos os vendedores, o que força o lançamento em $c_e \le c_0 - s$, onde reter não rende nada. A primeira é uma propriedade da empresa que adota e a segunda uma propriedade do mercado.

**Proposição 5 (a latência do mercado é fixada pela empresa menos constrangida).** Se $D(t) = \min_i c_i(t)$ sobre as empresas que podem vender à população de compradores, então $L(c) = \min_i L_i(c)$.

*Derivação.* $t_D(c) = \inf\{t : \min_i c_i(t) \le c\} = \min_i t_i(c)$, e $t_C(c)$ não depende de $i$. Subtraindo dá o resultado. $\square$

*Consequência.* Um calendário ou uma porta que atrasa uma empresa não atrasa o mercado quando outra empresa pode alcançar os mesmos compradores sem esse atraso. A latência observada em um mercado é então a latência da empresa mais rápida que tem acesso. Onde o acesso é restrito, porque os compradores não podem alcançar outros vendedores, o mínimo toma-se sobre um conjunto menor. No modelo este é o papel de $s$.

**Proposição 6 (o que resta a cobrar).** Depois do lançamento, com o teto a ligar, o preço é $p = c_e + s$, o lucro é $\pi = s(A - c_e - s)$, e a margem por tarefa é $s$, independente de $c_e$. O preço muda um-para-um com o custo, enquanto a razão preço-custo $p/c_e = 1 + s/c_e$ sobe à medida que o custo cai. O valor marginal da fricção é $\partial \pi / \partial s = A - c_e - 2s$, que é positivo para $s < (A - c_e)/2$ e aumenta à medida que $c_e$ cai.

*Derivação.* Sob A3 o incumbente cobra o teto $u = c_e + s$. Com custo $c_e$, a margem é $u - c_e = s$ e o volume é $A - u$, dando $\pi = s(A - c_e - s)$. A razão segue de $p/c_e = (c_e + s)/c_e$. Diferenciando $\pi$ em $s$ dá $A - c_e - 2s$, e $\partial^2\pi / \partial s\,\partial(-c_e) = 1 > 0$. $\square$

*Leitura.* À medida que o custo do cômputo cai, a parte do preço que reflete o cômputo encolhe, e a margem restante depende de quão custoso é para um comprador sair. O gasto que eleva $s$ torna-se mais valioso. No modelo isto é uma afirmação sobre incentivos e não um juízo sobre qualquer empresa. Políticas que baixam $s$, como limites aos termos de predefinição ou formatos de dados portáteis, baixam a margem no mesmo montante, e o modelo não diz se isso é desejável.

<div id="7-a-numerical-illustration-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

## 7. Uma ilustração numérica, não um ajuste

O script `model_check.py` na pasta de trabalho reproduz estes números com a biblioteca padrão. Parâmetros: $A = 10$, $c_0 = 4$, $s = 2$, $r = 0.10$ por ano, $T = 0.25$ ano, $\varphi = 1$, $w = 0.1$, e o custo externo a reduzir-se a metade a cada 8 meses de modo que $c_e(t) = 4 e^{-\lambda t}$. A taxa de 8 meses ecoa [58] e é uma escolha para ilustração, não uma estimativa para o custo.

**Tabela 2. Data de lançamento com e sem uma ferramenta que reduz o custo de adoção.**

| Caso | $K$ | Limiar de VPL | Limiar de porta | Lançamento em | Atraso de porta |
|---|---|---|---|---|---|
| Antes da ferramenta | 2.0 | $c = 3.951$, dia 4 | $c = 2.594$ | mês 5.00 | 4.85 meses |
| A ferramenta reduz o custo de adoção | 0.1 | $c = 3.998$ | $c = 3.998$ | dia 0.2 | 0 |

Na primeira linha a porta exige um ganho de $(\varphi K - w)/T = 7.6$, muito acima do requisito de VPL $rK = 0.2$, de modo que a parte de atraso por incentivos $w^{gate}$ é 4.85 meses. Isso é mais longo do que o termo de calendário da Proposição 1 para uma empresa trimestral, que é 1.5 meses em média. Na segunda linha $\varphi K' = 0.1 \le w = 0.1$, de modo que a porta não liga e só a condição de VPL permanece, como na Proposição 4(b).

![Uma curva decrescente do ganho contra o custo externo com dois níveis horizontais tracejados: um nível alto de porta antes de uma ferramenta e um nível baixo depois dela. A curva cruza o nível baixo mais cedo à medida que o custo cai.](/figures/latency/forcing-function-threshold.png)

*Figura 2. A função de forçamento: um custo de adoção mais baixo remove a porta (ilustração do modelo). Ganho $g(c)$ contra os dois limiares, com os parâmetros desta seção. Dados: `model_check.py` e Tabela 2.*

**Tabela 3. Depois do lançamento, com $s = 2$.**

| $c_e$ | Preço $p$ | $p / c_e$ | Lucro | $\partial \pi / \partial s$ |
|---|---|---|---|---|
| 4.0 | 6.00 | 1.50 | 8.00 | 2.00 |
| 3.0 | 5.00 | 1.67 | 10.00 | 3.00 |
| 2.0 | 4.00 | 2.00 | 12.00 | 4.00 |
| 1.0 | 3.00 | 3.00 | 14.00 | 5.00 |
| 0.5 | 2.50 | 5.00 | 15.00 | 5.50 |

O lucro sobe à medida que o custo cai porque a demanda linear deixa o volume expandir. Com demanda saciada a coluna de lucro achatar-se-ia, e a afirmação de que a margem fica em $s$ não mudaria. Uma simulação da Proposição 1 com $T = 0.25$ e preparação uniforme dá uma espera média de 0.1250 frente a $T/2 = 0.125$ e variância 0.00521 frente a $T^2/12 = 0.00521$ (200.000 sorteios, semente 7).

<div id="8-predictions-and-what-would-refute-them" class="anchor-alias" aria-hidden="true"></div>

## 8. Previsões e o que as refutaria

Cada previsão nomeia os dados, o teste e o resultado que contaria contra o modelo. As previsões enunciam-se antes de quaisquer dos dados terem sido recolhidos.

**Previsão 1 (agrupamento de calendário).** As datas em que as empresas com reporte trimestral tornam métodos anteriormente abertos geralmente disponíveis não são uniformes dentro do trimestre. *Teste:* para uma amostra de pelo menos 200 lançamentos de empresas cotadas, calcular a fase de cada data dentro do trimestre fiscal da empresa e aplicar os testes de Rayleigh e Kuiper contra a uniformidade. *Refutada se* a hipótese nula de fase uniforme não for rejeitada a 5% com 200 ou mais itens independentes.

**Previsão 2 (cotadas contra não cotadas).** Para o mesmo método e dificuldade comparável, o atraso mediano do lançamento aberto até um produto de disponibilidade geral é mais longo para empresas cotadas do que para empresas financiadas fora de um calendário de reporte. *Teste:* pares emparelhados por método, com o tipo de empresa como tratamento e razões de risco para o tempo até o lançamento. *Refutada se* o intervalo de 95% da razão de risco (cotadas sobre não cotadas) situar-se inteiramente acima de 0.8.

**Previsão 3 (as ferramentas baixam a porta).** Depois de uma ferramenta de automação que reduz o custo de portabilidade se tornar disponível para um alvo de hardware ou de software, o tempo do lançamento aberto até a disponibilidade geral nesse alvo cai. *Teste:* diferença em diferenças com alvos servidos e não servidos pela ferramenta, com o atraso de lançamento em dias como resultado. *Refutada se* o intervalo de 95% da mudança estimada situar-se inteiramente acima de $-30$ dias. A margem de 30 dias é uma escolha de protocolo feita antes da recolha de dados.

**Previsão 4 (o preço ultrapassa o custo).** Onde os custos de joules e de hardware por tarefa são medidos, a razão do preço de lista para o custo por tarefa sobe à medida que o custo medido cai. *Teste:* painel de serviços com uma tarefa enunciada, usando medições abertas de energia e preços de lista. *Refutada se* a razão for plana ou cair em mais de metade das tarefas ao longo de um período em que o custo caiu por um fator de 2 ou mais.

**Previsão 5 (o gasto move-se para a fricção).** Em um mercado onde o custo por tarefa cai, a parcela da receita do vendedor gasta em distribuição, predefinições e empacotamento sobe. *Teste:* pagamentos de distribuição divulgados e termos de empacotamento em registros e autos judiciais contra a receita. *Refutada se* a parcela for plana ou cair enquanto o custo por tarefa cai por um fator de 2 ou mais.

**Previsão 6 (a latência do mercado segue a empresa mais rápida).** Em mercados onde os compradores podem alcançar mais de um vendedor com baixa fricção, a latência do mercado está perto da latência mínima da empresa, e em mercados com fricção medida alta está mais perto da mediana. *Teste:* regredir a latência do mercado sobre a fricção de mudança medida. *Refutada se* o intervalo de 95% do declive da fricção situar-se inteiramente em ou abaixo de zero.

**Previsões sobre o financiamento e o custo da expansão.** As previsões das Seções 10 e 12 dizem respeito aos fluxos de dinheiro e ao custo de uma hora de acelerador. Enunciam-se nessas seções, e testam-se sobre registros e listagens datados depois deste artigo.

**O que refutaria o próprio modelo.** Uma descoberta de que as datas de lançamento são uniformes dentro do trimestre para empresas cotadas (Previsão 1), de que empresas cotadas e não cotadas lançam ao mesmo ritmo (Previsão 2) e de que a chegada de ferramentas de portabilidade não muda o atraso (Previsão 3) não deixaria papel para calendários nem portas de reporte, e a latência artificial da Definição 2 seria zero na medição. O modelo reduzir-se-ia então ao atraso de engenharia $d$.

<div id="9-the-money-loop-what-the-filings-document" class="anchor-alias" aria-hidden="true"></div>

## 9. O circuito do dinheiro: o que os registros documentam

Uma descrição comum da expansão atual é uma economia circular: os laboratórios compram cômputo às nuvens, as nuvens e as neonuvens compram chips e memória, e os fabricantes de chips e as nuvens investem nos laboratórios. Esta seção expõe o que documentos datados dizem sobre essa descrição. Não dá veredicto. Cada item marca-se **documentado** quando um registro, um lançamento datado ou uma estatística oficial declara o montante e as contrapartes, **inferido** quando segue por aritmética de cifras documentadas sob uma hipótese enunciada, e **não encontrado** quando as fontes lidas não o dizem.

![Grafo de fluxos com dez partes nomeadas em colunas: finanças, fabricantes de chips, laboratórios, nuvens. Setas de capital vão da NVIDIA, SoftBank, Amazon e Microsoft para a OpenAI e da NVIDIA e Microsoft para a Anthropic; a NVIDIA coloca 2 bilhões de dólares na CoreWeave; fundos da Blue Owl colocam 7 bilhões de dólares em dinheiro em um empreendimento da Meta. Setas tracejadas mostram compromissos de compra da OpenAI e da Meta à CoreWeave e um warrant da AMD à OpenAI. O texto lista os compromissos maiores da OpenAI com a Microsoft e a Amazon.](/figures/latency/capital-compute-flow.png)

*Figura 3. Compromissos de capital e de cômputo entre laboratórios, nuvens, fabricantes de chips e finanças. As setas seguem a direção do dinheiro ou do compromisso de compra e não são líquidas. Dados: `scripts/figures/latency_figures.py` com `latency_data/flows.csv`; as fontes listam-se na Tabela 4.*

**Capital aportado aos clientes.** Na ronda de 122 bilhões de dólares que a OpenAI fechou em março de 2026, a NVIDIA reporta-se a 30 bilhões de dólares, a Amazon a até 50 bilhões e a SoftBank a 30 bilhões [9]. Uma carta de intenções anterior tinha dito que a NVIDIA pretendia investir até 100 bilhões de dólares de forma progressiva à medida que cada gigawatt fosse implantado, o que é uma declaração de intenção e não uma transação fechada [87]. A Microsoft reporta cerca de 27% da public benefit corporation da OpenAI e 13 bilhões de dólares de compromissos totais de financiamento contabilizados sob o método da equivalência patrimonial [7]. Para a Anthropic, a NVIDIA e a Microsoft comprometeram-se a investir até 10 e 5 bilhões de dólares [10]. A NVIDIA comprou 2 bilhões de dólares de ações Classe A da CoreWeave depois do fim do exercício fiscal de 2025 dessa empresa [4]. A AMD emitiu à OpenAI um warrant de até 160 milhões de ações a 0,01 dólares por ação, com vesting em tranches ligadas a compras de produtos GPU AMD Instinct [88].

**Compras comprometidas pelos clientes.** A OpenAI contratou a compra de 250 bilhões de dólares incrementais de serviços Azure [7, 89], um acordo de 38 bilhões de dólares com a AWS que o anúncio descreve como a crescer ao longo de sete anos [8], e até 6,5 bilhões de dólares da CoreWeave, enquanto a Meta tem um formulário de encomenda com a CoreWeave de até 14,2 bilhões [4]. A Anthropic comprometeu-se a comprar 30 bilhões de dólares de cômputo Azure e a contratar até mais um gigawatt [10]. A própria NVIDIA reporta 27 bilhões de dólares de compromissos plurianuais de serviços em nuvem e 3,5 bilhões de dólares de garantias de terreno, energia e casca a parceiros em fase inicial [3].

**Tabela 4. O que está documentado, o que é inferido e o que as fontes não dizem.**

| Item | Documentado | Inferido, com a hipótese | Não encontrado nas fontes lidas |
|---|---|---|---|
| Capital próprio de fornecedores em clientes | Os montantes e as datas acima [9, 10, 4] | Nenhum tirado | Se algum capital próprio está condicionado a compras, exceto o warrant da AMD, cujo vesting está ligado a compras de GPU no registro [88] |
| Compras dos laboratórios às nuvens | Azure 250 e AWS 38 bilhões de dólares para a OpenAI; Azure 30 bilhões para a Anthropic [7, 8, 10] | a cifra da AWS média cerca de 5,4 bilhões de dólares por ano se espalhada de forma uniforme ao longo de sete anos | O prazo e a rampa do compromisso Azure; as condições ligadas à cifra de 50 bilhões de dólares da Amazon |
| Concentração de clientes | Clientes diretos da NVIDIA a 22% e 14% da receita, com construtores de sistemas e distribuidores entre os clientes diretos [3]; CoreWeave com a Microsoft a 67% da receita de 2025 [4] | Um limite inferior do índice de Herfindahl a partir das parcelas divulgadas: pelo menos 0,068 para a NVIDIA e 0,449 para a CoreWeave | Quem está por trás dos clientes diretos da NVIDIA |
| Pré-pagamentos de clientes | A receita diferida da Oracle de pré-pagamentos de clientes com um componente de financiamento significativo subiu 11,4 bilhões de dólares no trimestre, dentro do fluxo de caixa operacional de 23,1 bilhões [5] | Cerca de metade do fluxo de caixa operacional desse trimestre veio de pré-pagamentos | Quais clientes pré-pagaram |
| Financiamento ao nível do empreendimento | Fundos da Blue Owl detêm 80% e a Meta 20% de um empreendimento para o campus Hyperion; os fundos contribuíram 7,0 bilhões de dólares em dinheiro contra cerca de 27 bilhões de dólares de custo de desenvolvimento [2, 1] | O dinheiro é cerca de um quarto do custo de desenvolvimento | Termos de arrendamento, dívida levantada pelo empreendimento e garantias |
| Vidas de depreciação | Vidas enunciadas para servidores na Figura 12 [4, 14, 15, 16, 17] | Passar uma vida de 5 para 6 anos baixa a carga anual linear nos mesmos ativos em um sexto | A vida útil que as GPUs alcançam em uso |
| Capital em dinheiro contra caixa operacional | A série anual na Figura 8 [11] | A razão entre os dois | Arrendamentos financeiros e arrendamentos fora do balanço |

O termo **cliente** nesta tabela segue o uso próprio de cada registro. O dinheiro é fungível, de modo que um registro pode mostrar que o capital foi para um cliente e que o cliente pagou ao fornecedor, e não pode mostrar que um financiou o outro. A Seção 10 enuncia um teste que funciona dentro desse limite.

![Diagrama: a Meta detém 20 por cento e fundos da Blue Owl 80 por cento de um empreendimento conjunto que possui um campus de centro de dados na Louisiana. A Blue Owl pagou 7 bilhões de dólares em dinheiro no fecho; a Meta contribuiu 4,3 bilhões de dólares de ativos e recebeu uma distribuição de 2,6 bilhões de dólares.](/figures/latency/hyperion-structure.png)

*Figura 4. Uma estrutura de financiamento tal como registrada: o empreendimento do campus Hyperion. Bilhões de USD tal como impressos. Dados: comunicado e relatório trimestral da Meta [1, 2].*

**Concentração e backlog.** As parcelas de clientes divulgadas são altas nos nós alavancados e mais baixas no maior fabricante de chips. A CoreWeave reporta os seus três maiores clientes a 73% da receita de 2023, os seus dois maiores a 77% em 2024 e a Microsoft sozinha a 67% em 2025 [4]. As suas obrigações de desempenho restantes de 60,7 bilhões de dólares são 11,8 vezes a sua receita de 2025 de 5,131 bilhões. A Oracle reporta obrigações de 664 bilhões de dólares a 31 de agosto de 2026 e espera que cerca de 13% delas sejam reconhecidas nos doze meses seguintes [5, 6], frente a uma receita do exercício fiscal de 2026 de 67,4 bilhões [11]. A OpenAI reportou receita de 13,1 bilhões de dólares para 2025 e declarou um ritmo de 2 bilhões de dólares por mês em março de 2026 [9]. As compras contratadas são plurianuais e condicionais a termos que estas cifras não mostram, de modo que não são receita de um ano e não são aditivas com as cifras acima.

![Barras horizontais de parcelas de clientes divulgadas: NVIDIA dois clientes diretos a 22 e 14 por cento; CoreWeave Microsoft 67 por cento em 2025, dois maiores 77 por cento em 2024, três maiores 73 por cento em 2023.](/figures/latency/customer-concentration.png)

*Figura 5. Concentração de clientes tal como divulgada. Parcela da receita enunciada nos relatórios anuais; os clientes só são nomeados onde o registro os nomeia. Dados: relatórios anuais [3, 4].*

![Barras em escala logarítmica. Receita da OpenAI em 2025 13,1 bilhões de dólares frente a compras contratadas de 250 bilhões de dólares da Microsoft Azure e 38 bilhões de dólares da AWS. Receita da CoreWeave 5,1 bilhões frente a 60,7 bilhões de obrigações. Receita da Oracle 67,4 bilhões frente a 664 bilhões de obrigações.](/figures/latency/commitments-vs-revenue.png)

*Figura 6. Compromissos contratados contra a receita obtida, bilhões de USD em escala logarítmica. Os compromissos são plurianuais e condicionais; a receita é de um exercício fiscal. Dados: registros e lançamentos [4, 5, 6, 7, 8, 9].*

**Os laboratórios também compram noutro lado.** A Anthropic anunciou um plano de usar até um milhão de TPUs, no valor de dezenas de bilhões de dólares e bem acima de um gigawatt de capacidade em 2026 [90]. A OpenAI anunciou um plano de implantar 10 gigawatts de aceleradores do seu próprio desenho [91] e detém o warrant da AMD acima. Um laboratório que compra a vários fornecedores e desenha as suas próprias peças não é um único cliente de nenhum deles, o que importa para o limite da seção seguinte.

<div id="10-a-closed-loop-test-and-its-predictions" class="anchor-alias" aria-hidden="true"></div>

## 10. Um teste de circuito fechado e as suas previsões

A pergunta que os documentos não podem responder por si mesmos é quanta da receita de um fornecedor é paga com dinheiro que o próprio fornecedor aportou. O teste abaixo transforma-a em quantidades que um registro pode limitar.

Para uma janela $W$ (um exercício fiscal), seja $F_{sc}$ o capital aportado pelo fornecedor $s$ ao cliente $c$ (capital próprio, empréstimos, garantias, warrants valorizados na emissão), seja $R_{cs}$ a receita que $s$ recebe de $c$, seja $R_s$ a receita total de $s$, e seja $Z_c$ o capital que $c$ levanta de todas as fontes.

**Definição 3 (razão de ida e volta).** $\rho_{sc} = F_{sc} / R_{cs}$, capital aportado por dólar de receita recebida da mesma contraparte.

**Definição 4 (limite da proporção de circuito fechado).** $\bar\varphi_s = \sum_c \min(F_{sc}, R_{cs}) / R_s$. Um cliente não pode ter pago a $s$ com mais do capital próprio de $s$ do que $s$ aportou, nem do que pagou, de modo que $\bar\varphi_s$ é um limite superior da parcela de $R_s$ que poderia ter sido financiada pelo próprio capital de $s$. A contraparte do lado do cliente é $\psi_c = \sum_s F_{sc} / Z_c$, a parcela do capital levantado por $c$ que veio dos seus próprios fornecedores. Ambos são limites calculados a partir de cifras divulgadas. Não são estimativas do que aconteceu, porque o dinheiro é fungível.

**Proposição 7 (quando uma compra financiada pelo fornecedor compensa).** Seja o fornecedor $s$ a vender ao preço $p$ com custo unitário $u$ e margem bruta $m = (p - u)/p$. Seja-lhe a aportar capital $F$ que induz uma parcela $\theta$ das vendas $Q$ que de outro modo não ocorreriam, e seja-lhe a recuperar valor $V$ da sua participação. O lucro incremental é $\pi = \theta (p - u) Q + V - F$. Se todo o $F$ é gasto com $s$, de modo que $pQ = F$, então $\pi \ge 0$ se e só se $\theta \ge \theta^* = (1 - v)/m$, onde $v = V/F$.

*Derivação.* Substitui-se $(p-u)Q = m\,pQ = mF$ e resolve-se $\theta m F + vF - F \ge 0$. $\blacksquare$ (À mão, não verificado por máquina.)

*Consequência.* Como $\theta \le 1$, o financiamento pelo fornecedor só compensa através das vendas induzidas quando $v \ge 1 - m$. Com a margem bruta de 71,1% reportada pela NVIDIA para o exercício fiscal de 2026 [3], a participação deve esperar recuperar pelo menos 28,9% do capital. A saída do modelo para a parcela induzida de equilíbrio $\theta^*$ com recuperação 0, 25%, 50%, 75% e 100% é 1,41, 1,05, 0,70, 0,35 e 0, de modo que sem recuperação nenhuma parcela de vendas induzidas chega.

![Três barras horizontais. A NVIDIA sozinha aportou até 24,6 por cento da ronda da OpenAI de março de 2026. A NVIDIA mais a Amazon no seu máximo enunciado é até 65,6 por cento. O capital documentado da NVIDIA aos clientes é no máximo 19,5 por cento da sua receita do exercício fiscal de 2026.](/figures/latency/closed-loop-bounds.png)

*Figura 7. Teste de circuito fechado, limites superiores a partir de cifras documentadas (saída do modelo). A NVIDIA sozinha é 30 dos 122 bilhões de dólares da ronda da OpenAI; acrescentar a Amazon no seu máximo enunciado dá 80 de 122; o capital dirigido anunciado de novembro de 2025 a março de 2026 (30, 10 e 2 bilhões de dólares) compara-se com a receita do exercício fiscal de 2026 da NVIDIA de 215,9 bilhões de dólares. Dados: `latency_data/model_outputs.json`, calculados por `model_airace.py` a partir de [9, 10, 4, 3].*

**Limites a partir dos documentos.** A parcela da NVIDIA na ronda da OpenAI é no máximo 24,6%, e com a Amazon no seu máximo enunciado as duas chegam no máximo a 65,6%, com a parte da Microsoft não divulgada (saída do modelo). O capital que a NVIDIA anunciou ou foi reportada a aportar aos clientes de novembro de 2025 a março de 2026 é 42 bilhões de dólares (30 para a OpenAI, até 10 para a Anthropic e 2 para a CoreWeave), que é 19,5% da sua receita do exercício fiscal de 2026 de 215,9 bilhões e 41% do seu fluxo de caixa operacional de 102,7 bilhões [3, 11]. A primeira cifra é uma comparação de escala, porque os montantes e o ano de receita diferem. Lida como um limite, significa que se cada um desses dólares voltasse como receita da NVIDIA dentro de um ano, no máximo cerca de um quinto da receita desse ano seria financiado pelo próprio capital da NVIDIA.

**Previsões.** Cada uma nomeia dados, um teste e um resultado que contaria contra a afirmação. Estas previsões foram escritas depois de os registros acima terem sido lidos, e testam-se sobre registros datados depois deste artigo.

**Previsão 7 (a parcela do circuito permanece limitada).** Para cada fornecedor de chips ou de nuvem com capital dirigido divulgado, $\bar\varphi_s$ calculado a partir de cada relatório anual permanece abaixo de 0,25 enquanto a receita de clientes que não receberam capital dirigido cresce pelo menos tão depressa como a receita dos que receberam. *Teste:* registros anuais, com clientes nomeados onde os registros os nomeiam. *Refutada se* $\bar\varphi_s$ exceder 0,5 em um exercício fiscal, ou se o crescimento da receita se concentrar em clientes que receberam capital dirigido. Valores entre 0,25 e 0,5 são inconclusivos.

**Previsão 8 (a receita de utilizadores finais ultrapassa os compromissos).** Para um laboratório, a razão das compras contratadas para a receita dos doze meses precedentes cai ao longo de quatro trimestres consecutivos enquanto a receita sobe. *Teste:* declarações dos laboratórios e divulgações de backlog das nuvens. *Refutada se* a razão subir durante quatro trimestres consecutivos.

**Previsão 9 (o stress aparece primeiro onde a concentração e a alavancagem são mais altas).** Quando um laboratório revê um compromisso de cômputo para baixo, o tamanho das revisões de orientação nos nós fornecedores ordena-se pela parcela do maior cliente divulgada. *Teste:* revisões de orientação depois de qualquer acontecimento desse tipo, ordenadas pela parcela do maior cliente divulgada. *Refutada se* a ordem for independente da concentração.

**Previsão 10 (a substituição reduz a capacidade comprometida por dólar de receita).** Onde métodos abertos e hardware mais barato reduzem o tempo de acelerador por tarefa (Seção 12), os gigawatts comprometidos por dólar de receita do laboratório caem. *Teste:* capacidade anunciada e receita do laboratório por trimestre. *Refutada se* os gigawatts comprometidos por dólar de receita subirem durante quatro trimestres consecutivos enquanto o tempo de acelerador por tarefa medido também cai em testes de referência abertos.

<div id="11-the-strongest-counter-evidence" class="anchor-alias" aria-hidden="true"></div>

## 11. A contraevidência mais forte

A leitura de que a expansão é sobretudo um circuito fechado encontra quatro conjuntos de documentos que apontam no outro sentido, e um conjunto que aponta para a fragilidade.

**A maior parte do gasto é financiada a partir das operações nos maiores compradores.** Nos seus últimos exercícios fiscais, o gasto de capital em dinheiro foi 0,63 do fluxo de caixa operacional na Microsoft, 0,94 na Amazon, 0,56 na Alphabet e 0,60 na Meta [11]. O gasto é grande, e paga-se com dinheiro que as mesmas empresas ganham noutros negócios.

![Seis pequenos gráficos de barras do gasto anual de capital e do fluxo de caixa operacional para Microsoft, Amazon, Alphabet, Meta, Oracle e CoreWeave. O gasto sobe de forma acentuada nas seis. O gasto de capital permanece abaixo do fluxo de caixa operacional na Microsoft, Alphabet e Meta, quase o iguala na Amazon em 2025, e excede-o na Oracle nos exercícios fiscais de 2025 e 2026 e na CoreWeave em todos os anos.](/figures/latency/capex-vs-cash-flow.png)

*Figura 8. Gasto de capital em dinheiro contra o caixa das operações, anual, bilhões de USD. Uma razão acima de 1 significa que o gasto excedeu o fluxo de caixa operacional nesse ano. Exclui arrendamentos financeiros e arrendamentos fora do balanço. Dados: série anual SEC XBRL em `latency_data/capex_ocf.csv` [11].*

**O maior fornecedor de chips poderia financiar o seu capital dirigido a partir do seu próprio caixa.** Os 42 bilhões de dólares acima são 41% do fluxo de caixa operacional de um ano na NVIDIA [3, 11], e os seus dois maiores clientes diretos são 22% e 14% da receita, com construtores de sistemas e distribuidores entre eles [3].

**A receita de utilizadores finais é real e crescente nas declarações lidas.** A OpenAI reportou 13,1 bilhões de dólares de receita para 2025 e um ritmo de 2 bilhões de dólares por mês em março de 2026, o que anualiza para 24 bilhões (aritmética) [9].

**Os laboratórios diversificam.** O plano da Anthropic de até um milhão de TPUs ao lado dos seus compromissos Azure e NVIDIA, e os planos da OpenAI para os seus próprios aceleradores e o warrant da AMD, significam que os laboratórios aqui nomeados têm mais do que uma fonte de chips nos seus planos anunciados [90, 10, 91, 88].

**O que a contraevidência não remove.** O gasto de capital em dinheiro foi 1,74 vezes o fluxo de caixa operacional na Oracle no exercício fiscal de 2026 e 3,37 vezes na CoreWeave em 2025 [11]. O trimestre da Oracle terminado a 31 de agosto de 2026 mostra um fluxo de caixa operacional de 23,1 bilhões de dólares com 11,4 bilhões disso provenientes de pré-pagamentos de clientes, e um fluxo de caixa livre de 5 bilhões negativos [5, 6]. As obrigações da CoreWeave são 11,8 vezes a sua receita, e a sua base de clientes está concentrada [4]. Estes são os nós onde um défice no financiamento de um laboratório chegaria primeiro, que é o que a Previsão 9 testa.

**Leitura líquida, até onde os documentos vão.** Circuitos de dezenas de bilhões de dólares estão documentados entre fornecedores e clientes nomeados. Os documentos limitam a parcela da receita do maior fornecedor de chips que o seu próprio capital poderia ter financiado a menos de um quinto, e mostram a maior parte do gasto dos hiperescaladores paga a partir do caixa operacional. Os nós concentrados e alavancados, uma nuvem com pré-pagamentos e uma neonuvem com um único cliente dominante, são onde a hipótese de circuito importaria mais. Os termos de acordos privados não são públicos, de modo que os documentos dão limites e não uma medição.

<div id="12-what-a-task-costs-the-infrastructure-cost-model" class="anchor-alias" aria-hidden="true"></div>

## 12. O que custa uma tarefa: o modelo de custos da infraestrutura

A Seção 0 define o custo por tarefa como $c = \kappa e + h$. Esta seção preenche $\kappa$ e $h$ a partir do custo de uma hora de acelerador e liga o resultado a $C(t)$, $D(t)$ e $L$.

**Hora de acelerador.** Seja $K$ o capital por acelerador, incluindo a parcela da instalação, da energia e do arrefecimento, com vida linear $y$ anos e utilização $u$. O capital por hora utilizada é $a = K / (8760\, y\, u)$. Seja $P$ a potência da instalação por acelerador em quilowatts e $\kappa_e$ o preço da eletricidade por quilowatt-hora. Uma tarefa que ocupa $\tau$ horas utilizadas custa
$$c = \tau\,(a + \kappa_e P), \qquad e = 3.6\times 10^{6}\, P\,\tau \ \text{joules}.$$

**Proposição 8 (o preço do joule com carga de capital).** Com hardware fixo, $c = \kappa^{*} e$ com $\kappa^{*} = \kappa_e + a/P$ por equivalente de quilowatt-hora, de modo que os joules por tarefa continuam a ser a unidade de conta correta, e o preço que converte joules em dólares é dominado por $a/P$ sempre que $a/P \gg \kappa_e$. *Derivação.* Elimina-se $\tau$ entre as duas expressões. $\blacksquare$ (À mão.)

**Entradas.** O conjunto de dados de centros de dados da Epoch AI dá, para 74 sítios com ambas as cifras, capital mediano de cerca de 33.300 dólares e 880 watts de potência da instalação por equivalente H100, com o capital por equivalente H100 a variar de cerca de 19.600 a cerca de 200.800 dólares [12]. Estas são estimativas construídas a partir de licenças públicas e imagens, e o capital listado de um sítio inclui cômputo, construção e acabamento.

![Quatro pequenos painéis de barras: capital por equivalente H100 em 74 sítios, watts da instalação por equivalente H100, eficiência tensorial de pico de doze aceleradores por ordem de lançamento, e potência listada nos seis maiores países.](/figures/latency/small-multiples.png)

*Figura 9. Quatro indicadores em um painel. Capital e watts da instalação por equivalente H100 para 74 sítios ordenados por valor, eficiência tensorial de pico de doze aceleradores por ordem de lançamento, e potência listada nos seis maiores países. Dados: `latency_data/frontier_dc_cost_per_h100e.csv`, `hardware_flops_per_watt.csv`, `frontier_dc_by_country.csv` [12, 13].*

**Saída do modelo.** Com vidas de 4 a 6 anos, utilização de 40% a 80% e eletricidade a 0,04 a 0,12 dólares por quilowatt-hora, uma hora de acelerador utilizada custa entre cerca de 0,83 e 2,5 dólares, e a energia é entre 1,5% e 11,8% disso. O preço com carga de capital $a/P$ é cerca de 0,9 a 2,7 dólares por equivalente de quilowatt-hora, frente a eletricidade a 0,04 a 0,12, de modo que $\kappa^*$ é dominado pelo capital a cerca de 8 a 70 vezes o termo da eletricidade.

![Barras horizontais empilhadas do custo por hora de acelerador utilizada para vidas de 5 e 6 anos e utilização de 40, 60 e 80 por cento. O capital domina; a eletricidade é uma fatia fina. O custo varia de cerca de 0,96 a 2,2 dólares por hora.](/figures/latency/accelerator-hour-cost.png)

*Figura 10. O que custa uma hora de acelerador e quão pouco disso é energia (saída do modelo). Capital 33.311 dólares e 880 W por equivalente H100, eletricidade 0,08 dólares por quilowatt-hora. Dados: `latency_data/model_outputs.json`, calculados por `model_airace.py` a partir de [12].*

Seguem três consequências. Eletricidade mais barata pode baixar o custo de uma tarefa no máximo pela parcela de energia, que é no máximo cerca de um oitavo nesta grelha. A utilização importa tanto como a energia: reduzir $u$ a metade duplica $a$. E a vida enunciada $y$ é uma escolha contabilística que move $a$ na proporção de $1/y$.

**Vidas e eficiência.** As operações tensoriais de pico por watt subiram cerca de 1,42 vezes por ano em doze aceleradores líderes de 2016 a 2024 nas especificações próprias dos fornecedores, o que é uma duplicação cerca de a cada dois anos [13]. Um sítio limitado pela potência que substituísse uma peça por uma três anos mais nova obteria cerca de $1.42^3 = 2.9$ vezes as operações de pico a partir da mesma potência. As especificações de pico não são a energia entregue por tarefa, porque a utilização, o tráfego de memória e o software decidem a cifra entregue. As vidas de servidores enunciadas na Figura 12 vão de 5 a 6 anos em várias grandes empresas, e o intervalo enunciado é mais amplo noutras. Vidas dessa duração e uma duplicação de eficiência a cada dois anos são consistentes quando peças mais antigas continuam a render a preços fixados pelas mais novas, o que é uma afirmação sobre preços e não sobre física.

![Dispersão em eixo logarítmico das operações tensoriais de pico por watt para doze aceleradores de 2016 a 2024 com um ajuste tracejado de cerca de 1,4 vezes por ano.](/figures/latency/hardware-efficiency.png)

*Figura 11. FLOP/s tensoriais de pico por watt de aceleradores líderes em escala logarítmica, com um ajuste de cerca de 1,42 vezes por ano. Especificações de pico dos fornecedores, não energia entregue por tarefa. Dados: `latency_data/hardware_flops_per_watt.csv` e `hardware_fit.json` [13].*

![Gráfico de pontos e setas das vidas de servidores enunciadas em anos. A CoreWeave alongou de 5 para 6 em 2023, a Amazon encurtou um subconjunto de 6 para 5 em 2025, a Meta fixou 5,5 em 2025, a Alphabet usa 6, a Microsoft declara 2 a 6 e a Oracle 1 a 6.](/figures/latency/depreciation-lives.png)

*Figura 12. Vidas úteis enunciadas para servidores e equipamento de rede, em anos, a partir dos relatórios anuais. As vidas são estimativas contabilísticas, não vidas de serviço medidas. Dados: relatórios anuais [4, 14, 15, 16, 17].*

**O preço não é o custo.** Para um sistema ao nível do GPT-3.5, o preço da inferência caiu mais de 280 vezes entre novembro de 2022 e outubro de 2024, enquanto os custos de hardware caíram 30% ao ano e a eficiência energética do hardware melhorou 40% ao ano [18]. Ao longo dos 1,9 anos dessa janela essas taxas dão cerca de 2,0 vezes para o custo de hardware e 1,9 vezes para a eficiência energética (saída do modelo). Dividir 280 por 2,0 deixa um fator de cerca de 141 que o custo de hardware não explica. Esse resto mistura modelos menores, eficiência algorítmica, utilização e margens, e as fontes não o repartem. A Epoch AI estima separadamente que o cômputo necessário para um desempenho fixo de modelo de linguagem se reduz a metade cerca de a cada 8 meses [58], e que o preço para um nível fixo de teste de referência caiu 9 a 900 vezes ao ano com uma mediana perto de 50, as taxas mais rápidas a apoiarem-se em menos de um ano de dados [59].

![Três barras em escala logarítmica: o declínio do custo de hardware explica cerca de 2 vezes, a eficiência energética do hardware cerca de 1,9 vezes, frente a uma queda de preço observada de 280 vezes; o fator restante é cerca de 141 vezes.](/figures/latency/price-decomposition.png)

*Figura 13. Uma queda de preço de 280 vezes e quanto o hardware pode explicar (saída do modelo a partir das taxas anuais em [18]). Dados: `latency_data/model_outputs.json`.*

**Ligação às fronteiras.** Seja $\tau_C(t)$ o menor tempo de acelerador por tarefa à qualidade $q$ entre métodos documentados e $\tau_D(t)$ o tempo em produtos de disponibilidade geral. Então $c_C(t) = \tau_C(t)\,\kappa^*(t)$ para a fronteira de capacidade, e a fronteira implantada segue o preço oferecido, que é pelo menos o custo mais a margem da Seção 6. O custo de hardware entra em $C$ e $D$ da mesma maneira, porque fornecedores e compradores compram no mesmo mercado, de modo que desloca ambas as fronteiras em conjunto e deixa $L$ quase inalterado. A latência é movida pelo termo de software $\tau$: um método que corta o tempo de acelerador por tarefa por um fator $g$ baixa $c_C$ por esse fator quando é publicado, e $c_D$ só quando um produto o adota. Durante a espera, a razão do custo implantado para o de capacidade é $g$.

**Ligação ao modelo de cadência.** O capital compromete-se em passos plurianuais e carrega-se ao longo de vidas de vários anos, de modo que as datas de decisão para o hardware estão longe umas das outras, e o custo de adoção $K$ da Seção 6 inclui o valor do capital instalado que um método novo deixaria obsoleto ou pouparia. Um método que corre em hardware que uma empresa já possui tem um custo de adoção que é sobretudo engenharia. Um método que precisa de hardware novo leva consigo o ciclo de capital. É por isso que os métodos de software abertos em peças existentes são os menos sujeitos a portas, e por isso que a Previsão 3 compara alvos com e sem ferramentas de portabilidade.

**Onde o custo deixa de acompanhar a capacidade.** A uma qualidade fixa $q$, o custo por tarefa cai com $\tau$, com o hardware e com o preço. Na fronteira da capacidade, o custo por tarefa é fixado pelo treinamento e pela prestação dos maiores modelos e não cai da mesma maneira, e é por isso que uma tarefa de qualidade de fronteira e uma tarefa de qualidade fixa têm curvas de custo diferentes. Os dados acima medem apenas a primeira.

**Previsão 11 (peças mais antigas continuam a render).** Se as vidas de servidores enunciadas são economicamente realistas, os preços de aluguer por hora de acelerador para peças com vários anos caem mais lentamente do que as operações de pico por watt implicariam. *Teste:* listagens de preços abertas datadas por peça e idade, contra o ajuste de eficiência na Figura 11. *Refutada se* o preço de uma peça mais antiga por unidade de operações de pico cair pelo menos tão depressa como o ajuste de eficiência.

**Previsão 12 (a parcela de energia permanece pequena).** Em uma amostra de implantações medidas a parcela de energia do custo por tarefa permanece abaixo de 15% a preços de eletricidade abaixo de 0,12 dólares por quilowatt-hora. *Teste:* medição aberta de energia da inferência [56] combinada com preços listados da hora de acelerador. *Refutada se* a parcela medida exceder 15% em uma maioria das implantações.

<div id="13-open-methods-and-existing-hardware-at-parity" class="anchor-alias" aria-hidden="true"></div>

## 13. Métodos abertos e hardware existente em paridade

Uma segunda descrição do presente é que o trabalho algorítmico aberto deixa a infraestrutura existente e mais antiga performar em paridade com a mais nova. O registro datado apoia uma afirmação mais estreita, exposta aqui pela alavanca que cada método aciona e pelo atraso até um uso lançado.

**Tabela 6. Métodos abertos, os seus artigos datados e o que um uso posterior mostra.**

| Alavanca | Método aberto e o que os autores reportam | Publicado | Uso posterior | Atraso |
|---|---|---|---|---|
| Quantização | Modelos com 175 bilhões de parâmetros quantizados em cerca de quatro horas de GPU para 3 ou 4 bits por peso com perda de precisão desprezável [92] | out. 2022 | Inferência local de 4 bits reportada como prática em máquinas de consumo em 2023 [68] | Não calculado: o uso posterior é uma implementação de 4 bits diferente, e a sua data é evidência da classe opinião |
| Pesos ternários em CPU | Um modelo de 2 bilhões de parâmetros a 0,4 GB de memória não embutida e 29 ms por token em uma CPU, frente a 1,4 a 4,8 GB e 41 a 124 ms para seis modelos abertos de precisão completa de tamanho semelhante [26] | abr. 2025 | Pesos do modelo lançados com o artigo | 0 meses |
| Kernels de atenção | Atenção exata tornada mais rápida ao contabilizar leituras e escritas entre níveis de memória [19] | mai. 2022 | Kernels de atenção acelerados no lançamento do PyTorch 2.0 [20] | Cerca de 10 meses |
| Memória de serviço | Memória chave-valor paginada em um sistema de serviço aberto, com maior débito do que sistemas anteriores à mesma latência [93] | set. 2023 | Código-fonte lançado com o artigo | 0 meses |
| Modelos de espaço de estados e híbridos | Um modelo sem atenção a reportar 5 vezes o débito de inferência dos Transformers [21]; um híbrido que cabe em uma GPU de 80 GB, com pesos abertos [22] | dez. 2023 | O híbrido, mar. 2024; mais híbridos em 2024 e 2025 [39] | Cerca de 3 a 4 meses |
| Decodificação especulativa | Distribuição de saída inalterada com decodificação 2 a 3 vezes mais rápida [23] | nov. 2022 | Reportada em produtos Google até dez. 2024 [24] | Cerca de 24 meses |
| Custo de treinamento | 2,788 milhões de horas de GPU H800 para o treinamento completo, autorreportado [46]; raciocínio por aprendizado por reforço com modelos destilados menores [94] | dez. 2024 a jan. 2025 | Modelos destilados menores lançados com o segundo relatório | Não aplicável |
| Serviço não NVIDIA | Eficiência de prefill de 4,45 tokens por segundo por TFLOPS em NPUs Ascend, acima de resultados publicados para SGLang em H100 e DeepSeek em H800, potência não reportada [95] | jun. 2025 | Implantação dos autores | Não aplicável |

Os atrasos calculam-se do mês de publicação até a data do uso posterior, e apoiam-se em um par por linha. São uma amostra de alguns, não uma distribuição, e o protocolo da Seção 16 especifica como recolher muitos.

![Três dumbbells que mostram meses entre um artigo de método e um sistema lançado: FlashAttention até PyTorch 2.0 cerca de 10 meses, Mamba até Jamba cerca de 3 meses, decodificação especulativa até produtos Google cerca de 24 meses.](/figures/latency/research-to-product-lag.png)

*Figura 14. Do artigo ao produto, três pares datados. Mês do primeiro artigo público e a data em que o mesmo método é reportado dentro de um sistema lançado. Os meses são arredondados e a amostra é de três. Dados: datas na Tabela 6 [19, 20, 21, 22, 23, 24].*

**Modelos abertos contra a fronteira fechada, por cômputo de treinamento.** Usando o primeiro modelo notável em cada nível de cômputo de treinamento, qualquer tipo de acesso contra pesos abertos, o atraso de pesos abertos foi 1 mês a $10^{22}$ FLOP, 30 meses a $10^{23}$, 24 meses a $10^{24}$ e 15 meses a $10^{25}$, e ainda nenhum modelo de pesos abertos está registado a $10^{26}$ [25]. Cada nível é cruzado primeiro por um modelo, de modo que os atrasos apoiam-se em um par por nível. A direção é que o atraso encolhe à medida que o nível sobe, e a ressalva é que o cômputo de treinamento não é capacidade.

![Gráfico dumbbell para limiares de cômputo de treinamento de 1e22 a 1e26 FLOP: o primeiro modelo notável em qualquer tipo de acesso e o primeiro modelo de pesos abertos, com a distância em meses a encolher de cerca de 30 meses a 1e23 para 15 meses a 1e25 e ainda nenhum modelo de pesos abertos a 1e26 nos dados.](/figures/latency/open-compute-lag.png)

*Figura 15. Quando os modelos de pesos abertos alcançaram cada nível de cômputo de treinamento. Primeiro modelo notável no nível ou acima, qualquer tipo de acesso contra pesos abertos. Dados: `latency_data/compute_threshold_firsts.csv`, a partir do conjunto de dados de modelos notáveis da Epoch AI [25].*

Em hardware de consumo, modelos abertos que cabem em uma GPU de consumo igualam a fronteira depois de uma média de 6 a 12 meses, conforme a medida [63]. Modelos de pesos abertos de qualquer tamanho atrasam-se relativamente à fronteira fechada cerca de um ano em testes de referência, com um intervalo de 5 a 22 meses [64].

**O que a paridade significa aqui.** Significa a mesma pontuação de teste de referência. Não significa o mesmo débito: uma placa de consumo corre um fluxo, e um centro de dados serve muitos, onde o agrupamento e os kernels importam. Os ganhos da quantização e dos kernels aplicam-se em ambos. O cômputo necessário para um desempenho fixo reduz-se a metade cerca de a cada 8 meses [58], o que é $2^{12/8} = 2.8$ vezes por ano, cerca do dobro das 1,42 vezes por ano da eficiência de hardware na Figura 11. Onde isso vale, o progresso algorítmico ultrapassa o progresso de hardware a uma qualidade fixa, e peças compradas mais cedo produzem mais tarefas de uma qualidade dada do que produziam. Se essas tarefas extra se vendem a preços mais baixos ou são pedidas em números maiores é uma pergunta sobre a demanda que nenhuma das fontes aqui resolve.

![Linha do tempo de duas pistas de 2022 a 2026 com marcadores numerados e uma legenda. A pista superior lista lançamentos de métodos e modelos como Chinchilla, FlashAttention, decodificação especulativa, Mamba, DeepSeek-V3 e R1, atenção esparsa nativa e BitNet. A pista inferior lista implantações e acontecimentos de financiamento desde o PyTorch 2.0 em março de 2023 até a ronda de 122 bilhões de dólares da OpenAI em março de 2026.](/figures/latency/timeline-capability-vs-deployment.png)

*Figura 16. Lançamentos de capacidade contra implantação e financiamento, 2022 a 2026. Os marcadores numerados remetem à legenda. Pista superior: métodos e modelos públicos. Pista inferior: lançamentos de produtos, contratos e registros. Dados: datas das fontes nas Referências.*

<div id="14-other-ways-to-build-the-machine" class="anchor-alias" aria-hidden="true"></div>

## 14. Outras maneiras de construir a máquina

Uma terceira descrição é que grupos que fazem hardware por processos ortogonais mostram que parte do custo da infraestrutura convencional é mais alta do que a tarefa precisa. As fontes lidas contêm demonstrações datadas de desenhos analógicos, fotónicos, neuromórficos, FPGA, só CPU e eletrónica flexível. Diferem em tarefa, escala e medição, de modo que esta seção reporta cada uma dentro do seu próprio artigo e tira apenas razões que o próprio artigo reporta.

**Tabela 7. Desenhos alternativos, o que foi medido e a ressalva.**

| Abordagem | Demonstração | Medido ou reportado | Ressalva |
|---|---|---|---|
| Analógico em memória | 35 milhões de dispositivos de memória de mudança de fase em 34 mosaicos em uma tarefa de palavra-chave de fala [96] | Até 12,4 TOPS por watt sustentados no chip, precisão equivalente ao software | Rede pequena, sem linha de base emparelhada no texto lido, de modo que nenhuma razão se tira |
| Fotónico | Um processador de IA fotónico a uma precisão que os autores apresentam como prática para ResNet e BERT [97] | Precisão nessas redes | Sem joules por tarefa no texto lido |
| Neuromórfico | Um modelo MatMul-free de 370 milhões de parâmetros no Loihi 2 [28] | Até 3 vezes o débito com 2 vezes menos energia do que transformers em uma GPU de borda | Preliminar, modelo pequeno |
| FPGA | FlightLLM em uma placa Alveo U280 a correr LLaMA2-7B com esparsidade e quantização compiladas [27] | 6,0 e 4,2 vezes a eficiência energética e 1,8 e 1,4 vezes a eficiência de custo de um V100S e de um A100 | Comparação dos autores e configuração da GPU |
| Pesos ternários em CPU | BitNet b1.58 2B em uma CPU [26] | 0,4 GB de memória frente a 1,4 a 4,8 GB, e 29 ms frente a 41 a 124 ms por token | A energia de 0,028 J por token é estimada por um modelo aritmético, 6,6 a 23 vezes mais baixa do que as linhas de base, e não foi lida de um medidor de potência |
| Pilha de acelerador alternativa | Serviço em NPUs Ascend [95] | 4,45 tokens por segundo por TFLOPS no prefill, acima de resultados publicados de H100 e H800 | Potência não reportada, de modo que nenhuma razão em joules se tira |
| Processo flexível, não silício | Um microprocessador Arm de 32 bits em um substrato flexível [98] | Que um processador geral pode ser feito por um processo não silício | Sem resultado de aprendizado de máquina e sem joules por tarefa |

![Barras horizontais de razões contra uma linha de base: BitNet em CPU energia 6,6 a 23,2 vezes mais baixa por estimativa, memória 3,5 a 12 vezes mais baixa, FlightLLM FPGA 4,2 a 6,0 vezes eficiência energética e 1,4 a 1,8 vezes eficiência de custo frente a duas GPUs, Loihi 2 cerca de 2 vezes menos energia preliminar.](/figures/latency/alternative-hardware-ratios.png)

*Figura 17. Desenhos alternativos contra uma linha de base no mesmo artigo. A razão é o custo da linha de base dividido pelo custo alternativo, tal como cada artigo a reporta; as tarefas diferem, de modo que as barras não são comparáveis entre linhas. As barras mostram o intervalo reportado. Dados: razões na Tabela 7 [26, 27, 28].*

**O que isto apoia.** Para classes particulares de tarefa, nomeadamente modelos pequenos, implantação na borda, decodificação em CPU e inferência esparsa ou quantizada em lógica programável, os autores reportam energia ou memória 2 a 23 vezes mais baixas do que uma linha de base convencional. Estas são razões dentro do artigo em modelos pequenos ou médios. As fontes lidas não contêm nenhuma medição de um desenho alternativo a servir um modelo de escala de fronteira, e nenhuma em desenhos de escala de wafer ou de nó maduro, de modo que este artigo não tira uma conclusão para eles.

**Porque uma razão de energia não é uma razão de custo.** Pela Proposição 8, a preços de centro de dados a energia é entre cerca de 1,5% e 11,8% de uma hora de acelerador. Uma alternativa que baixa a energia por tarefa por um fator de 10 baixa o custo por tarefa no máximo pela parcela de energia, a menos que também baixe o capital por tarefa. O resultado de memória do modelo ternário aponta para esse segundo caminho: um modelo que precisa de 0,4 GB em vez de 1,4 a 4,8 GB pode correr em um dispositivo menor e mais barato, e o efeito de capital não foi medido nas fontes aqui. Onde a eletricidade não é o termo dominante, a comparação útil é dólares por tarefa incluindo capital, e nenhum dos artigos de hardware alternativo lidos a reporta exceto o FlightLLM, cujas razões de eficiência de custo são os números menores da tabela.

<div id="15-where-capability-compute-and-power-sit" class="anchor-alias" aria-hidden="true"></div>

## 15. Onde se situam a capacidade, o cômputo e a energia

A geografia da expansão lê-se aqui a partir de estatísticas nacionais, ministérios e agências, na língua original onde a fonte não está em inglês. As unidades diferem entre países, de modo que as cifras se colocam lado a lado e não se ordenam.

**Cômputo e energia.** No conjunto de dados de centros de dados da Epoch AI, os sítios de fronteira listados totalizam 14,1 GW, dos quais os Estados Unidos detêm 84%, seguidos da Malásia a 1,1 GW e da China a 0,7 GW [12]. O conjunto de dados apoia-se em licenças públicas e imagens, de modo que sítios em lugares com menos divulgação pública têm mais probabilidade de serem omitidos. As estatísticas próprias da China reportam uma quantidade diferente: 10,85 milhões de racks padrão em uso e capacidade de cômputo inteligente de 788 EFLOPS no fim de junho de 2025 [99], e 1,59 milhões de PFLOPS (FP16) no fim de 2025 [100]. As duas cifras chinesas vêm de publicações diferentes e podem apoiar-se em definições diferentes, e nenhuma é comparável com uma cifra de potência listada. Para a eletricidade, os centros de dados usaram cerca de 415 TWh em 2024, 1,5% do total mundial, com 45% nos Estados Unidos, 25% na China e 15% na Europa, e a Agência Internacional de Energia projeta uma duplicação para cerca de 945 TWh até 2030 como cenário modelado [101, 102].

![Mapa-múndi com círculos vermelhos dimensionados pela potência de centros de dados de IA de fronteira: Estados Unidos cerca de 11,9 gigawatts, Malásia 1,1, China 0,7, e sítios pequenos no Reino Unido, Finlândia, Indonésia, Noruega, Austrália, Portugal e Islândia.](/figures/latency/map-frontier-datacenters.png)

*Figura 18. Onde se situa a potência de centros de dados de IA de fronteira. A área do círculo é proporcional à potência listada em megawatts; 94 sítios, 14,1 GW. Dados: `latency_data/frontier_dc_by_country.csv` [12].*

**De onde vêm os modelos.** Dos modelos notáveis em 2025 por afiliação nacional do desenvolvedor, os Estados Unidos contam 59, a China 35 e a Coreia do Sul 8, com modelos únicos do Canadá, França, Hong Kong, Singapura e Reino Unido [29].

![Mapa-múndi a sombrear países por modelos de IA notáveis lançados em 2025: Estados Unidos 59, China 35, Coreia do Sul 8, e um cada para Canadá, França, Singapura e Reino Unido.](/figures/latency/map-notable-models.png)

*Figura 19. De onde vieram os modelos de IA notáveis em 2025, por afiliação nacional do desenvolvedor. Dados: Stanford AI Index 2026 tal como tirado da base de dados da Epoch AI [29].*

**Chips.** Para os aceleradores no conjunto de dados de hardware da Epoch, a TSMC é a foundry registada em cerca de quatro em cada cinco das entradas cuja foundry está registada, seguida da Samsung, SMIC e Intel, e a foundry não está registada em mais de um terço de todas as entradas (`latency_data/hardware_foundry_counts.json`) [13]. As fontes lidas não deram cifras utilizáveis de capacidade de empacotamento nem de capacidade de fabrico por país, de modo que este artigo não traça um mapa delas.

**Programas nacionais.** Os programas enunciam o seu tamanho em unidades diferentes, e a Tabela 8 dá cada um tal como enunciado.

**Tabela 8. Programas nacionais tal como enunciados, com a língua da fonte.**

| Lugar | Declaração | Língua | Classe |
|---|---|---|---|
| China | Capacidade de cômputo inteligente de 788 EFLOPS no fim de junho de 2025 e 1,59 milhões de PFLOPS (FP16) no fim de 2025 [99, 100] | Chinês | demonstrado |
| Coreia do Sul | Declaração do governo de assegurar 260.000 GPUs NVIDIA, em outubro de 2025 [103] | Coreano | opinião |
| Japão | Pelo menos 10 trilhões de ienes de apoio público ao longo dos sete anos até o exercício fiscal de 2030, visando mais de 50 trilhões de ienes de investimento privado ao longo de dez anos [104]; investigação de mercado a declarar que o investimento em nuvem em centros de dados japoneses se espera de centenas de bilhões de ienes ou mais por ano [105] | Japonês | opinião |
| União Europeia | 200 bilhões de euros a mobilizar para a IA, com um fundo de 20 bilhões de euros para gigafábricas de IA [106, 107] | Inglês e italiano | opinião |
| Índia | 38.231 GPUs integradas sob o portal de cômputo IndiaAI, tal como reportado ao parlamento em março de 2026 [108] | Inglês | demonstrado |
| Brasil | R$ 23,03 bilhões de investimento planejado para 2024 a 2028 [109] | Português | opinião |
| Emirados Árabes Unidos | Um cluster de cômputo de 1 GW dentro de um campus planejado de 5 GW em Abu Dhabi [110] | Inglês | opinião |
| Arábia Saudita | Capacidade projetada de até 500 MW ao longo de cinco anos [111] | Inglês | opinião |
| África | Uma fábrica de IA a implantar-se na África do Sul, com planos para a Nigéria, Quénia, Egito e Marrocos; sem cifra de capacidade enunciada [112] | Inglês | opinião |

![Mapa-múndi com chamadas para programas nacionais de cômputo: plano do Brasil de R$ 23,03 bilhões, meta InvestAI da UE de 200 bilhões de euros com um fundo de gigafábrica de 20 bilhões de euros, Arábia Saudita até 500 MW, UAE 1 GW Stargate, Índia 38.231 GPUs, China 1,59 milhões de PFLOPS, Coreia do Sul 260.000 GPUs, Japão pelo menos 10 trilhões de ienes até o exercício fiscal de 2030, Estados Unidos 11,9 GW de sítios de fronteira listados.](/figures/latency/map-national-programs.png)

*Figura 20. Programas nacionais de cômputo e os seus tamanhos enunciados. As unidades diferem por país, de modo que nenhuma ordenação é implícita. Dados: Tabela 8.*

As declarações na classe Opinião são planos e metas, e a classe Demonstrado contém capacidade ou estatísticas reportadas. Os dois tipos não devem somar-se.

**Uso.** Inquéritos oficiais a empresas que usam IA dão 32,9% na Coreia do Sul em 2024, 26% na Alemanha em 2025, 21,1% em Espanha no início de 2025, 20,0% na União Europeia em 2025, 18% nos Estados Unidos no inverno de 2025 a 2026, 13,9% para a área da OCDE em 2024, 13% no Brasil em 2024 e 10% em França em 2024, com anos e definições que diferem [30, 31, 32, 33, 34, 35, 36, 37]. O Japão e a China medem-se sobre pessoas e não sobre empresas [71, 72].

![Barras horizontais da proporção de empresas que usam IA em inquéritos oficiais: Coreia do Sul 32,9, Alemanha 26, Espanha 21,1, UE 20,0, Estados Unidos 18, OCDE 13,9, Brasil 13, França 10 por cento.](/figures/latency/adoption-by-country.png)

*Figura 21. Proporção de empresas que usam IA em inquéritos oficiais. Os anos e as definições diferem, de modo que cada linha se lê por si. Dados: as publicações estatísticas citadas na Seção 3 [30, 31, 32, 33, 34, 35, 36, 37].*

**O que a geografia mostra.** A potência de cômputo listada concentra-se em um país por uma margem ampla, enquanto os modelos publicados e as declarações oficiais de capacidade mostram um segundo país com uma grande parcela dos modelos e uma grande capacidade declarada que os conjuntos de dados de potência listada estão mal situados para ver. Os programas de outros lugares declaram planos à escala de gigawatts ou de centenas de bilhões, e o uso medido da IA pelas empresas está entre 10% e 33% nos inquéritos lidos. A distância entre os planos e o uso medido é a distância que este artigo estuda, agora à escala nacional.

<div id="16-experiment-protocol-not-executed" class="anchor-alias" aria-hidden="true"></div>

## 16. Protocolo experimental (não executado)

**Propósito.** Medir $L$ e as suas três partes para uma lista de métodos, usando apenas datas públicas.

**Unidade.** Um método, como um formato numérico, um kernel, um procedimento de inferência ou um passe de compilador, com uma descrição pública datada.

**Datas a recolher para cada método.** A primeira publicação pública (preprint ou repositório), a primeira implementação aberta, o primeiro lançamento em uma biblioteca aberta de uso amplo e o primeiro lançamento de disponibilidade geral em pelo menos um produto comercial, com o tipo de empresa (cotada, privada, do setor público, académica). Cada data regista-se com a ligação à sua fonte e uma cópia de arquivo.

**Amostragem.** Todos os métodos de uma lista pré-registada tirada de um conjunto fixo de fóruns e repositórios de 2022 a 2026, incluindo fóruns e repositórios não anglófonos, com a regra de seleção escrita antes de consultar qualquer data de lançamento.

**Análise.** Calcular $L$ por método. Estimar $E[w^{cad}]$ com os testes de fase da Previsão 1 e comparando o atraso médio com $T/2$. Estimar a parte de porta como a diferença entre empresas cotadas e não cotadas (Previsão 2). Reportar medianas com intervalos bootstrap, e reportar que proporção dos métodos nunca chega a um produto.

**Energia.** Onde um método reporta joules por tarefa, registar as condições de medição, e onde não o faz, executá-lo em um arnês de energia aberto como o citado na Tabela 1 e reportar os joules medidos.

**Financiamento e custo.** Calcular o limite da Definição 4 para cada fornecedor e exercício fiscal a partir dos registros, o preço do joule com carga de capital a partir dos preços listados da hora de acelerador e da potência medida, e a razão entre as compras contratadas e a receita recente de cada laboratório, e registar cada um com o registro e a página de onde vem. O script de figuras `scripts/figures/latency_figures.py` e os ficheiros de dados de `scripts/figures/latency_data/` reproduzem todas as figuras das Seções 9 a 15 a partir das fontes citadas.

**Resultados.** Uma tabela de datas, um script de análise e um registro de exclusões. Os scripts e os dados publicar-se-ão com o estudo nas mesmas condições que este sítio.

<div id="17-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 17. Conclusão

Os métodos públicos que reduzem o custo da inteligência computacional chegam aos produtos depois de um atraso com uma parte técnica, uma parte de calendário e uma parte de incentivos. A primeira é tempo de engenharia. A segunda é a estrutura das datas de decisão, que em um calendário trimestral acrescenta em média cerca de seis semanas (Proposição 1). A terceira aparece quando uma regra de reporte bloqueia um lançamento que vale a pena a longo prazo (Proposição 3). Uma ferramenta que reduz o custo de adotar um método elimina a terceira quando o custo cai abaixo de um limite enunciado, e uma ferramenta que reduz o custo do trabalho em si força o lançamento quando reter não rende nada (Proposição 4). Quando o mercado tem vários vendedores alcançáveis com pouca fricção, o mais rápido fixa a latência (Proposição 5). À medida que cai o custo do cômputo, a margem que resta depende da fricção de mudança (Proposição 6). A evidência sobre a infraestrutura acrescenta o seguinte. Os registros documentam circuitos de dezenas de bilhões de dólares entre fornecedores e clientes nomeados, e limitam a menos de um quinto a parcela da receita do maior fornecedor de chips que o seu próprio capital poderia ter financiado, enquanto a maior parte do gasto dos hiperescaladores se paga com o fluxo de caixa operacional. A preços de centro de dados a energia é uma parte pequena de uma hora de acelerador e o capital é a parte grande, de modo que o custo por tarefa segue o tempo de acelerador por tarefa, a utilização e a vida enunciada da máquina. Os métodos abertos e os desenhos alternativos reduzem o tempo de acelerador, a memória ou a energia por tarefa nas medições dos próprios autores, para modelos pequenos e médios, e nenhuma fonte lida os mede à escala de fronteira. A capacidade, o cômputo e a energia estão distribuídos de forma desigual, e os planos nacionais declaram-se a escalas muito acima do uso medido. As proposições são um modelo, e as previsões nomeiam os registros, listagens e medições que refutariam cada uma.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referências

Each entry ends with its evidence class (Section 1).

1. Meta, joint venture with funds managed by Blue Owl Capital to develop the Hyperion data center. 2025-10-21. <https://investor.atmeta.com/investor-news/press-release-details/2025/Meta-Announces-Joint-Venture-with-Funds-Managed-by-Blue-Owl-Capital-to-Develop-Hyperion-Data-Center/default.aspx> (opinion)
2. Meta Platforms, Quarterly Report on Form 10-Q, period ended 30 September 2025. 2025-10-30. <https://www.sec.gov/Archives/edgar/data/1326801/000162828025047240/meta-20250930.htm> (demonstrated)
3. NVIDIA, Annual Report on Form 10-K, fiscal year ended 25 January 2026. 2026-02-25. <https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm> (demonstrated)
4. CoreWeave, Annual Report on Form 10-K, fiscal year ended 31 December 2025. 2026-03-02. <https://www.sec.gov/Archives/edgar/data/1769628/000176962826000104/crwv-20251231.htm> (demonstrated)
5. Oracle, Quarterly Report on Form 10-Q, period ended 31 August 2026. 2026-09-11. <https://www.sec.gov/Archives/edgar/data/1341439/000119312626389274/orcl-20260831.htm> (demonstrated)
6. Oracle, Q1 FY27 results (Exhibit 99.1 to Form 8-K). 2026-09-10. <https://www.sec.gov/Archives/edgar/data/1341439/000119312626387905/orcl-20260910.htm> (demonstrated)
7. Microsoft, Quarterly Report on Form 10-Q, period ended 30 September 2025, Note 17. 2025-10-29. <https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm> (demonstrated)
8. OpenAI and Amazon Web Services, partnership announcement. 2025-11-03. <https://openai.com/index/aws-and-openai-partnership/> (opinion)
9. CNBC, OpenAI closes record-breaking 122 billion dollar funding round. 2026-03-31. <https://www.cnbc.com/2026/03/31/openai-funding-round-ipo.html> (opinion)
10. Microsoft, NVIDIA and Anthropic, strategic partnerships announcement. 2025-11-18. <https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/> (opinion)
11. U.S. Securities and Exchange Commission, XBRL company concept API (annual capital expenditure and operating cash flow, seven filers). 2026-10. <https://data.sec.gov/api/xbrl/companyconcept/> (demonstrated)
12. Epoch AI, Frontier Data Centers dataset (CC BY). 2026-10. <https://epoch.ai/data/data-centers> (demonstrated)
13. Epoch AI, Machine Learning Hardware dataset (CC BY). 2026-10. <https://epoch.ai/data/machine-learning-hardware> (demonstrated)
14. Amazon, Annual Report on Form 10-K, fiscal year ended 31 December 2025. 2026-02-06. <https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm> (demonstrated)
15. Meta Platforms, Annual Report on Form 10-K, fiscal year ended 31 December 2025. 2026-01-29. <https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/meta-20251231.htm> (demonstrated)
16. Alphabet, Annual Report on Form 10-K, fiscal year ended 31 December 2025. 2026-02-05. <https://www.sec.gov/Archives/edgar/data/1652044/000165204426000018/goog-20251231.htm> (demonstrated)
17. Microsoft, Annual Report on Form 10-K, fiscal year ended 30 June 2026. 2026-07-29. <https://www.sec.gov/Archives/edgar/data/789019/000119312626323660/msft-20260630.htm> (demonstrated)
18. Stanford HAI, AI Index Report 2025. 2025-04. <https://hai.stanford.edu/assets/files/hai_ai_index_report_2025.pdf> (demonstrated)
19. Dao et al., FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness. 2022-05-27. <https://arxiv.org/abs/2205.14135> (demonstrated)
20. PyTorch, PyTorch 2.0 release announcement. 2023-03-15. <https://pytorch.org/blog/pytorch-2-0-release/> (opinion)
21. Gu and Dao, Mamba: Linear-Time Sequence Modeling with Selective State Spaces. 2023-12-01. <https://arxiv.org/abs/2312.00752> (demonstrated)
22. Lieber et al., Jamba: A Hybrid Transformer-Mamba Language Model. 2024-03-28. <https://arxiv.org/abs/2403.19887> (demonstrated)
23. Leviathan, Kalman, Matias, Fast Inference from Transformers via Speculative Decoding. 2022-11-30 (ICML 2023). <https://arxiv.org/abs/2211.17192> (established by proof in the source)
24. Google Research, Looking back at speculative decoding. 2024-12-06. <https://research.google/blog/looking-back-at-speculative-decoding/> (opinion)
25. Epoch AI, Notable AI Models dataset (CC BY). 2026-10. <https://epoch.ai/data/notable-ai-models> (demonstrated)
26. Ma et al., BitNet b1.58 2B4T Technical Report. 2025-04-16. <https://arxiv.org/abs/2504.12285> (demonstrated)
27. Zeng et al., FlightLLM: Efficient Large Language Model Inference with a Complete Mapping Flow on FPGAs. 2024-01-08. <https://arxiv.org/abs/2401.03868> (demonstrated)
28. Abreu et al., Neuromorphic Principles for Efficient Large Language Models on Intel Loihi 2. 2025-03. <https://arxiv.org/abs/2503.18002> (demonstrated)
29. Stanford HAI, AI Index Report 2026, research and development chapter. 2026-04. <https://hai.stanford.edu/ai-index/2026-ai-index-report> (demonstrated)
30. (Korean) Electronic Times, reporting the 2025 Enterprise Informatization Statistics of the Ministry of Science and ICT and NIA. 2026-01-20. <https://www.etnews.com/20260120000071> (demonstrated)
31. (German) Statistisches Bundesamt, Unternehmen mit Nutzung von Technologien der künstlichen Intelligenz nach Beschäftigtengrößenklassen (table, 2025). 2025. <https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/IKT-in-Unternehmen-IKT-Branche/Tabellen/ikti-unternehmen-kuenstliche-intelligenz.html> (demonstrated)
32. (Spanish) Instituto Nacional de Estadística, Encuesta sobre el uso de TIC y del comercio electrónico en las empresas, nota de prensa. 2025-10-22. <https://ine.es/dyngs/Prensa/ETICCE20241T2025.pdf> (demonstrated)
33. Eurostat, 20% of EU enterprises use AI technologies. 2025-12-11. <https://ec.europa.eu/eurostat/documents/7870049/23260410/KS-01-26-009-EN-N.pdf> (demonstrated)
34. Bonney et al., The Microstructure of AI Diffusion (Census CES-WP-26-25). 2026-04. <https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html> (demonstrated)
35. OECD, Emerging divides in the transition to artificial intelligence. 2025-06. <https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/06/emerging-divides-in-the-transition-to-artificial-intelligence_eeb5e120/7376c776-en.pdf> (demonstrated)
36. (Portuguese) Cetic.br/NIC.br, Pesquisa TIC Empresas 2024, resumo executivo. 2025-05. <https://www.nic.br/media/docs/publicacoes/2/20250512121759/tic_empresas_2024_resumo_executivo.pdf> (demonstrated)
37. (French) Insee, Les technologies de l'information et de la communication dans les entreprises en 2024, Insee Première n° 2061. 2025-07. <https://www.insee.fr/fr/statistiques/fichier/8604126/ip2061.pdf> (demonstrated)
38. Dao and Gu, Transformers are SSMs (Mamba-2, state space duality). 2024-05-31. <https://arxiv.org/abs/2405.21060> (established by proof in the source)
39. Lieber et al. (Jamba); NVIDIA (Nemotron-H); TII (Falcon-H1); IBM (Granite 4.0). 2024 to 2025. <https://arxiv.org/abs/2504.03624> (demonstrated)
40. Ma et al., The Era of 1-bit LLMs (BitNet b1.58). 2024-02-27. <https://arxiv.org/abs/2402.17764> (demonstrated)
41. NVIDIA, Pretraining Large Language Models with NVFP4. 2025-09. <https://arxiv.org/abs/2509.25149> (demonstrated)
42. Shah et al., FlashAttention-3. 2024-07. <https://arxiv.org/abs/2407.08608> (demonstrated)
43. Yuan et al., Native Sparse Attention. 2025-02 (ACL 2025). <https://arxiv.org/abs/2502.11089> (demonstrated)
44. Hoffmann et al., Training Compute-Optimal Large Language Models. 2022-03-29. <https://arxiv.org/abs/2203.15556> (demonstrated)
45. Sardana et al., Beyond Chinchilla-Optimal: Accounting for Inference in Language Model Scaling. 2024-01 (ICML 2024). <https://arxiv.org/abs/2401.00448> (demonstrated)
46. DeepSeek-AI, DeepSeek-V3 Technical Report. 2024-12-26. <https://arxiv.org/abs/2412.19437> (demonstrated)
47. Angelopoulos, Barber, Bates, Theoretical Foundations of Conformal Prediction. 2024-11-18 (v5 2026-03-06). <https://arxiv.org/abs/2411.11824> (established by proof in the source)
48. Zhou, Chen, Gui and Cheng, Conformal Prediction: A Data Perspective. 2024-10 (arXiv 2410.06494; ACM Computing Surveys 2025). <https://arxiv.org/abs/2410.06494> (opinion)
49. Angelopoulos et al., Prediction-powered inference. 2023 (Science). <https://www.science.org/doi/10.1126/science.adi6000> (established by proof in the source)
50. Ramdas, Grunwald, Vovk, Shafer, Game-Theoretic Statistics and Safe Anytime-Valid Inference. 2023-11 (Statistical Science 38(4)). <https://doi.org/10.1214/23-sts894> (established by proof in the source)
51. Chernozhukov et al., Double/debiased machine learning. 2018 (Econometrics Journal). <https://doi.org/10.1111/ectj.12097> (established by proof in the source)
52. Jung, Tian, Bareinboim, Estimating Identifiable Causal Effects through Double Machine Learning. 2021 (AAAI). <https://doi.org/10.1609/aaai.v35i13.17438> (established by proof in the source)
53. Sathia et al., Compiler Optimizations for Higher-Order Automatic Differentiation. 2025 (PPoPP workshop). <https://ece.is/assets/pdf/diffprog-ppopp25-paper90.pdf> (demonstrated)
54. Ward et al., JAX a la Stan. 2026-10-11. <https://bob-carpenter.github.io/dj-paper/template-computo-python.pdf> (opinion)
55. Qian et al., Impulse: probabilistic programming via compiler augmentation. 2026 (abstract). <https://ece.is/assets/pdf/impulse-pldi-src-abstract.pdf> (demonstrated)
56. Chung et al., The ML.ENERGY Benchmark. 2025 (NeurIPS Datasets and Benchmarks). <https://ml.energy/leaderboard/> (demonstrated)
57. Google, Measuring the environmental impact of delivering AI at Google Scale. 2025-08. <https://arxiv.org/abs/2508.15734> (demonstrated)
58. Ho et al. (Epoch AI), Algorithmic progress in language models. 2024-03 (NeurIPS 2024). <https://arxiv.org/abs/2403.05812> (demonstrated)
59. Epoch AI, LLM inference prices have fallen rapidly but unequally across tasks. 2025. <https://epoch.ai/data-insights/llm-inference-price-trends> (demonstrated)
60. Comin and Hobijn, An Exploration of Technology Diffusion. 2010 (AER 100(5)). <https://doi.org/10.1257/aer.100.5.2031> (demonstrated)
61. P. A. David, The Dynamo and the Computer. 1990 (AER 80(2)). <https://ideas.repec.org/a/aea/aecrev/v80y1990i2p355-61.html> (demonstrated)
62. Brynjolfsson, Rock, Syverson, The Productivity J-Curve. 2021 (AEJ Macro). <https://doi.org/10.1257/mac.20180386> (demonstrated)
63. Somala and Emberson (Epoch AI), Frontier AI performance becomes accessible on consumer hardware within a year. 2025-08-15. <https://epoch.ai/data-insights/consumer-gpu-model-gap> (demonstrated)
64. Epoch AI, Open vs. closed AI: how behind are open models?. 2025. <https://epoch.ai/publications/open-models-report> (demonstrated)
65. Gupta and Kiely, Production-ready speculative decoding with TensorRT-LLM. 2024-12-19. <https://www.baseten.co/blog/how-we-built-production-ready-speculative-decoding-with-tensorrt-llm/> (opinion)
66. Marx and Fuegi, Reliance on Science: Worldwide Front-Page Patent Citations to Scientific Articles. 2020 (NBER 27987; JEMS 2022). <https://www.nber.org/system/files/working_papers/w27987/w27987.pdf> (demonstrated)
67. Ahmadpoor and Jones, The dual frontier. 2017 (Science). <https://doi.org/10.1126/science.aam9527> (demonstrated)
68. Willison, Stanford Alpaca, and the acceleration of on-device large language model development. 2023-03-13. <https://simonwillison.net/2023/Mar/13/alpaca/> (opinion)
69. Li et al., Now Hiring: Firm-Level Adoption of Generative AI in China (World Bank). 2025/2026. <https://thedocs.worldbank.org/en/doc/cbdef4ef57efdbb3c29aa4c07edf860b-0050062026/original/Now-hiring-Firm-Level-Li-etal.pdf> (demonstrated)
70. (German) Statistisches Bundesamt, Pressemitteilung Nr. 444: Jedes fünfte Unternehmen nutzt künstliche Intelligenz. 2024-11-25. <https://www.destatis.de/DE/Presse/Pressemitteilungen/2024/11/PD24_444_52911.html> (demonstrated)
71. Japan Ministry of Internal Affairs and Communications, 令和7年版情報通信白書 (Information and Communications White Paper 2025), data tables, in Japanese. 2025. <https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r07/html/nd112220.html> (demonstrated)
72. (Chinese) China Internet Network Information Center, 生成式人工智能应用发展报告（2025）. 2025-10. <https://pdf.dfcfw.com/pdf/H301_AP202510241768289458_1.pdf> (demonstrated)
73. Bick, Blandin, Deming, The Rapid Adoption of Generative AI. 2024-09 (rev. 2025-02). <https://www.nber.org/papers/w32966> (demonstrated)
74. Brynjolfsson, Li, Raymond, Generative AI at Work (NBER Working Paper 31161; later published in QJE 2025). 2023 working paper, revised. <https://www.nber.org/papers/w31161> (demonstrated)
75. METR, Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity. 2025-07-10. <https://arxiv.org/abs/2507.09089> (demonstrated)
76. Bloom, Jones, Van Reenen, Webb, Are Ideas Getting Harder to Find?. 2020 (AER 110(4)). <https://doi.org/10.1257/aer.20180338> (demonstrated)
77. Graham, Harvey, Rajgopal, The Economic Implications of Corporate Financial Reporting. 2005 (JAE 40); NBER 2004-10. <https://www.nber.org/papers/w10550> (demonstrated)
78. Asker, Farre-Mensa, Ljungqvist, Corporate Investment and Stock Market Listing: A Puzzle?. 2015 (RFS 28(2)). <https://doi.org/10.1093/rfs/hhu077> (demonstrated)
79. FactSet, Highest number of S&P 500 earnings calls citing AI over the past 10 years. 2025-12. <https://insight.factset.com/highest-number-of-sp-500-earnings-calls-citing-ai-over-the-past-10-years-1> (demonstrated)
80. Hassan, Hollander, van Lent, Tahoun, Firm-Level Political Risk. 2019 (QJE 134(4)). <https://doi.org/10.1093/qje/qjz021> (demonstrated)
81. Metrick and Yasuda, Venture Capital and Other Private Equity: A Survey (NBER Working Paper 16652). 2010-10. <https://www.nber.org/system/files/working_papers/w16652/w16652.pdf> (opinion)
82. Gompers and Lerner, What Drives Venture Capital Fundraising? (Brookings Papers: Microeconomics). 1998. <https://www.brookings.edu/wp-content/uploads/1998/01/1998_bpeamicro_gompers.pdf> (demonstrated)
83. Arrow, Economic Welfare and the Allocation of Resources for Invention (NBER chapter). 1962. <https://www.nber.org/system/files/chapters/c2144/c2144.pdf> (established by proof in the source)
84. Shapiro, Competition and Innovation: Did Arrow Hit the Bull's Eye? (NBER conference draft). 2010. <https://conference.nber.org/confer/2010/RDIA10/Shapiro.pdf> (opinion)
85. Henderson and Clark, Architectural Innovation. 1990 (ASQ 35(1)). <https://doi.org/10.2307/2393549> (demonstrated)
86. US District Court for D.C., United States v. Google LLC, remedies memorandum. 2025-09-02. <https://www.courthousenews.com/wp-content/uploads/2025/09/judge-amit-mehta-google-search-monopoly-remedy-ruling.pdf> (demonstrated)
87. NVIDIA and OpenAI, letter of intent announcement. 2025-09-22. <https://nvidianews.nvidia.com/news/openai-and-nvidia-announce-strategic-partnership-to-deploy-10gw-of-nvidia-systems> (opinion)
88. Advanced Micro Devices, Form 8-K, Item 1.01 (warrant issued to OpenAI). 2025-10-06. <https://www.sec.gov/Archives/edgar/data/2488/000119312525230895/d28189d8k.htm> (demonstrated)
89. Microsoft, The next chapter of the Microsoft-OpenAI partnership. 2025-10-28. <https://blogs.microsoft.com/blog/2025/10/28/the-next-chapter-of-the-microsoft-openai-partnership/> (opinion)
90. Anthropic, Expanding our use of Google Cloud TPUs and services. 2025-10-23. <https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services> (opinion)
91. OpenAI and Broadcom, strategic collaboration announcement. 2025-10-13. <https://openai.com/index/openai-and-broadcom-announce-strategic-collaboration/> (opinion)
92. Frantar et al., GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers. 2022-10-31. <https://arxiv.org/abs/2210.17323> (demonstrated)
93. Kwon et al., Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM). 2023-09-12. <https://arxiv.org/abs/2309.06180> (demonstrated)
94. DeepSeek-AI, DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning. 2025-01-22. <https://arxiv.org/abs/2501.12948> (demonstrated)
95. Zuo et al., Serving Large Language Models on Huawei CloudMatrix384. 2025-06. <https://arxiv.org/abs/2506.12708> (demonstrated)
96. Le Gallo et al., An analog-AI chip for energy-efficient speech recognition and transcription, Nature. 2023-08-23. <https://www.nature.com/articles/s41586-023-06337-5> (demonstrated)
97. Ahmed et al., Universal photonic artificial intelligence acceleration, Nature. 2025-04-09. <https://www.nature.com/articles/s41586-025-08854-x> (demonstrated)
98. Biggs et al., A natively flexible 32-bit Arm microprocessor, Nature. 2021-07-21. <https://www.nature.com/articles/s41586-021-03625-w> (demonstrated)
99. (Chinese) 国务院, 截至今年6月底我国智能算力规模达788百亿亿次/秒 (人民日报). 2025-09-02. <https://www.gov.cn/yaowen/liebiao/202509/content_7038732.htm> (demonstrated)
100. (Chinese) 全国数据资源统计调查工作组, 全国数据资源调查报告（2025年）. 2026. <https://www.nda.gov.cn/sjj/swdt/xwfb/0429/ff808081-9b5e8626-019d-d86b2f54-1154.pdf> (demonstrated)
101. International Energy Agency, Energy and AI, executive summary. 2025-04. <https://www.iea.org/reports/energy-and-ai/executive-summary> (demonstrated)
102. International Energy Agency, Energy and AI, energy demand from AI. 2025-04. <https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai> (demonstrated)
103. (Korean) 뉴시스, 정부, 엔비디아 GPU 26만장 확보. 2025-10-31. <https://www.newsis.com/view/NISX20251031_0003385059> (opinion)
104. (Japanese) 経済産業省, AI・半導体産業基盤強化フレーム. 2024-11. <https://www.meti.go.jp/policy/mono_info_service/ai_semiconductor_frame/ai_semiconductor_frame.html> (opinion)
105. (Japanese) 総務省 有識者会合 資料5, 国内データセンター市場におけるAI需要・地方分散・再エネ電源 (富士キメラ総研). 2024-05-30. <https://www.meti.go.jp/policy/mono_info_service/joho/conference/digital_infrastructure/0007/005_fujichimera.pdf> (opinion)
106. European Commission, EU launches InvestAI initiative to mobilise 200 billion euro (English). 2025-02-11. <https://digital-strategy.ec.europa.eu/en/news/eu-launches-investai-initiative-mobilise-eu200-billion-investment-artificial-intelligence> (opinion)
107. (Italian) Commissione europea, UE lancia InvestAI per mobilitare 200 miliardi di EUR. 2025-02-11. <https://digital-strategy.ec.europa.eu/it/news/eu-launches-investai-initiative-mobilise-eu200-billion-investment-artificial-intelligence> (opinion)
108. Press Information Bureau (India), reply in the Lok Sabha on the IndiaAI Mission. 2026-03-25. <https://www.pib.gov.in/PressReleasePage.aspx?PRID=2245063> (demonstrated)
109. (Portuguese) Ministério da Ciência, Tecnologia e Inovação, Plano Brasileiro de Inteligência Artificial 2024-2028. 2025. <https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/transformacaodigital/plano-brasileiro-de-inteligencia-artificial> (opinion)
110. SoftBank Group, Global Tech Alliance Launches Stargate UAE. 2025-05-22. <https://group.softbank/en/news/press/20250522> (opinion)
111. NVIDIA, HUMAIN and NVIDIA Announce Strategic Partnership to Build AI Factories in Saudi Arabia. 2025-05-13. <https://nvidianews.nvidia.com/news/humain-and-nvidia-announce-strategic-partnership-to-build-ai-factories-of-the-future-in-saudi-arabia> (opinion)
112. Cassava Technologies, Cassava scales African AI infrastructure with NVIDIA-powered AI factories. 2025. <https://www.cassavatechnologies.com/cassava-scales-african-ai-infrastructure-with-nvidia-powered-ai-factories-to-accelerate-sovereign-data-capabilities/> (opinion)
