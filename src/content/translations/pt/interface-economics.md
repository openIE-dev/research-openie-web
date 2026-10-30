---
title: "O preço da interface não examinada"
deck: "O que custam as falhas de interface, usando apenas números declarados por uma fonte primária, cada um rotulado como custo contabilizado, estimativa de modelo ou estimativa de pesquisa."
lang: "pt"
source: "interface-economics"
complete: true
---

*Versão 1.0, 11 de outubro de 2026. PDF em LaTeX: [/pdfs/latex/interface-economics.pdf](/pdfs/latex/interface-economics.pdf) ([fonte](/pdfs/latex/interface-economics.tex)).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Este ensaio reúne os custos publicados de falhas que acontecem nas passagens entre as partes de um sistema e rotula cada cifra segundo a forma como foi produzida. Ele não as soma em um único total.

**Em palavras simples**

1. Algumas falhas nas passagens têm um preço exato, como uma sonda a Marte perdida que custou centenas de milhões de dólares.
2. As cifras nacionais maiores são estimativas obtidas de pesquisas e modelos, e nenhuma delas conta apenas as falhas nas passagens.
3. Escrever e verificar o que cada lado pressupõe é barato, mas quem faz isso paga enquanto todos se beneficiam, então isso tende a não ser feito.

<div id="0-definitions-and-scope" class="anchor-alias" aria-hidden="true"></div>

## 0. Definições e escopo

Uma **interface** é uma passagem pela qual a saída de uma parte se torna a entrada de outra: de quem enuncia o que um sistema deve fazer (teóricos), para quem o constrói (construtores), para quem o opera (usuários), ou entre dois níveis de uma pilha de software e hardware. Um **pressuposto de interface** é uma condição sobre os valores que atravessam uma passagem da qual o lado receptor depende para sua própria correção, como uma unidade, um intervalo, um tipo, uma versão ou um envelope de operação. Um pressuposto é **não examinado** quando se depende dele, mas ele não foi escrito nem verificado. Uma longa literatura de engenharia, de Garlan, Allen e Ockerbloom sobre o descasamento arquitetural até Leveson sobre os acidentes como falhas de interação, situa muitas falhas de sistemas nesses pressupostos [19, 20]. Este ensaio pergunta quanto essas falhas custam e responde apenas com cifras que uma fonte primária declara. Cada cifra é rotulada por tipo. Um **custo contabilizado** é o que uma agência ou empresa informa ter realmente gastado ou perdido. Uma **estimativa de modelo** é uma cifra produzida por um método declarado a partir de pesquisas, entrevistas ou dados secundários. Uma **projeção** é uma afirmação sobre o futuro. Os três tipos não são somados entre si.

Os custos contabilizados de falhas de interface individuais são grandes e específicos: o projeto Mars Surveyor 1998, que incluía o Mars Climate Orbiter, custou 327.6 milhões de dólares [1], e a ESA aprovou 214 milhões de ECU para recuperar a missão Cluster perdida no primeiro Ariane 5 [4]. As estimativas de modelo são maiores e mais amplas: o NIST situou o custo anual de uma infraestrutura inadequada de testes de software nos Estados Unidos em 59.5 bilhões de dólares [6], e o custo da interoperabilidade inadequada no setor de instalações de capital dos EUA em 15.8 bilhões de dólares por ano [7]. O CISQ estimou o custo da má qualidade de software nos Estados Unidos em não menos de 2.41 trilhões de dólares em 2022 e a dívida técnica acumulada em cerca de 1.52 trilhão de dólares [8]. Nenhuma dessas cifras mede apenas a falha de interface. Cada uma a contém.

<div id="1-kinds-of-number" class="anchor-alias" aria-hidden="true"></div>

## 1. Tipos de número

As afirmações econômicas sobre falhas de software circulam em três formas que se parecem e não são iguais. O orçamento de um projeto é um registro contábil. Uma estimativa nacional de custo é a saída de um modelo cujos insumos são pesquisas, estudos de caso e pressupostos sobre a escala. Uma previsão não é nenhuma das duas coisas. Este ensaio segue uma regra: cada cifra traz seu tipo, sua fonte e o que ela realmente conta.

Cifras do custo da "falha de interface" como um único total anual circulam sem um método declarado. Nenhuma das estimativas primárias da Seção 3 isola as interfaces, então este ensaio não as associa a nenhum total único.

<div id="2-single-failures-accounted" class="anchor-alias" aria-hidden="true"></div>

## 2. Falhas individuais, contabilizadas

**Mars Climate Orbiter.** A interface era uma unidade: dados de impulso dos propulsores em libra-força segundo lidos como newton segundo [2]. A ficha técnica do projeto da NASA dá o custo do projeto Mars Surveyor 1998 como 327.6 milhões de dólares para o orbitador e o Mars Polar Lander juntos: 193.1 milhões de dólares para o desenvolvimento das naves, 91.7 milhões de dólares para o lançamento e 42.8 milhões de dólares para as operações [1]. Reportagens da época davam o orbitador sozinho como uma nave de 125 milhões de dólares [3]. Tipo: custo contabilizado do projeto, com uma cifra informada para a nave individual.

**Ariane 501 e Cluster.** A interface era um envelope: o software reutilizado do Ariane 4 pressupunha um intervalo de velocidade horizontal que o novo lançador ultrapassou [5]. Os quatro satélites Cluster foram perdidos. O relato da ESA sobre a recuperação registra as opções que seu Comitê do Programa Científico orçou em 1996, entre elas 351 milhões de unidades de conta para reconstruir os quatro satélites com o projeto original, e a ESA aprovou em 1997 uma missão de recuperação, Cluster II, por 214 milhões de ECU [4, 17]. Tipo: custo contabilizado da recuperação que a ESA escolheu, que é um limite inferior da perda, não o valor dos satélites nem da ciência adiada.

Esses dois casos fixam a forma do problema. Em cada um, cada órgão fez o seu próprio trabalho, e o custo recaiu sobre a interface. Em cada um, a verificação que teria detectado o descasamento era barata em relação à perda. Nenhum dos dois casos pode ser escalado para uma cifra nacional, porque acidentes individuais não são uma amostra.

<div id="3-national-estimates-modeled" class="anchor-alias" aria-hidden="true"></div>

## 3. Estimativas nacionais, modeladas

![Gráfico de barras em um eixo logarítmico em dólares das estimativas primárias citadas neste ensaio, coloridas por tipo. Custos contabilizados: o projeto Mars Surveyor 1998, com 327.6 milhões de dólares, e a recuperação Cluster II, com 214 milhões de ECU. Estimativas de modelo: NIST 2004, interoperabilidade inadequada nas instalações de capital dos EUA, 15.8 bilhões de dólares por ano; NIST 2002, infraestrutura inadequada de testes de software, 59.5 bilhões de dólares por ano; Stripe 2018, tempo dos desenvolvedores gasto com código ruim, cerca de 85 bilhões de dólares por ano; CISQ 2022, dívida técnica, cerca de 1.52 trilhão de dólares acumulados; CISQ 2022, custo da má qualidade de software nos EUA, pelo menos 2.41 trilhões de dólares em 2022.](/figures/interface-economics/estimates-by-kind.svg)

*Figura 1. As estimativas por tipo. Figura de dados, eixo logarítmico. Valores conforme impressos pelas fontes [1, 4, 6, 7, 8, 9]. As barras não são aditivas: o total do CISQ contém categorias que se sobrepõem às cifras do NIST e da Stripe, e um estoque (a dívida técnica) aparece ao lado de fluxos anuais. Uma [cópia em PNG](/figures/interface-economics/estimates-by-kind.png) está disponível.*

**Testes de software, NIST 2002.** A RTI International, para o NIST, estimou que uma infraestrutura inadequada de testes de software custava à economia dos EUA de 22.2 bilhões a 59.5 bilhões de dólares por ano, sendo a cifra superior o custo total e a inferior a parcela que melhorias viáveis poderiam eliminar [6]. O método combinou pesquisas com desenvolvedores e usuários de dois setores, a fabricação de equipamentos de transporte e os serviços financeiros, com uma extrapolação para a economia nacional. Tipo: estimativa de modelo.

**Interoperabilidade, NIST 2004.** Gallaher e colegas, para o NIST, estimaram o custo da interoperabilidade inadequada no setor de instalações de capital dos EUA em 15.8 bilhões de dólares por ano, a partir de entrevistas e pesquisas com proprietários, operadores, arquitetos, engenheiros e empreiteiros [7]. Interoperabilidade aqui é a capacidade de trocar e usar dados de projeto e de operação entre sistemas de software, o que é uma interface no sentido definido no Resumo. O relatório declara que sua cifra omite custos que não conseguiu quantificar. Tipo: estimativa de modelo, um único setor, apresentada como conservadora.

**Má qualidade de software, CISQ 2022.** O Consortium for Information and Software Quality estimou que o custo da má qualidade de software nos Estados Unidos havia crescido para pelo menos 2.41 trilhões de dólares em 2022, e que a dívida técnica acumulada havia crescido para cerca de 1.52 trilhão de dólares [8]. O relatório constrói o total a partir de categorias (falhas operacionais, projetos malsucedidos, problemas de sistemas legados e perdas com crimes cibernéticos atribuídas a vulnerabilidades de software) e extrai boa parte de seus insumos de fontes secundárias; seu componente de crimes cibernéticos reparte uma previsão global para os Estados Unidos [8]. Tipo: estimativa de modelo construída em parte sobre outras estimativas. É a maior cifra documentada nesta área, e é uma cifra para a qualidade de software como um todo, não para as interfaces.

**Tempo dos desenvolvedores, Stripe 2018.** Uma pesquisa da Stripe realizada com a Harris Poll informou que os desenvolvedores gastam cerca de 17.3 horas por semana em trabalho de manutenção, como depuração e refatoração, e cerca de quatro horas por semana com "código ruim", que o relatório avalia em quase 85 bilhões de dólares por ano no mundo todo [9]. Tipo: estimativa baseada em pesquisa.

O que essas cifras compartilham é uma estrutura, não um total. Cada uma conta o custo de um pressuposto do qual se dependeu e que não foi verificado: um caminho não testado, um formato de dados que não se transfere, uma vulnerabilidade em uma fronteira, um sistema legado cujos contratos ninguém consegue reenunciar. Um descasamento que não é verificado onde surge passa como entrada bem formada para cada nível acima dele, de modo que seu custo aparece longe de sua causa, como na solução de navegação do Mars Climate Orbiter, que era internamente consistente e errada [2]. É também por isso que as estimativas nacionais precisam ser modeladas em vez de contadas.

<div id="4-technical-debt-is-an-interface-account" class="anchor-alias" aria-hidden="true"></div>

## 4. A dívida técnica é uma conta de interfaces

Cunningham introduziu a dívida técnica em 1992 como o custo de entregar código cuja estrutura ainda não corresponde ao que a equipe aprendeu, com juros pagos a cada mudança posterior até que a dívida seja quitada [10]. Sculley e colegas mostraram que, em sistemas de aprendizado de máquina, a maior parte dessa dívida fica fora do modelo, no código de cola, na configuração, nas dependências de dados e nos consumidores não declarados [11]. Nos termos definidos acima, grande parte da dívida técnica é um saldo de pressupostos de interface não examinados mantido nos livros, e seus juros são o custo que um descasamento não verificado cobra de cada nível acima dele, a cada execução.

A estimativa do CISQ de cerca de 1.52 trilhão de dólares de dívida técnica acumulada nos Estados Unidos é um estoque, medido pelo custo de correção [8]. As cifras anuais da Seção 3 são fluxos. A consequência econômica é uma hipótese, testada na Seção 7: uma verificação paga uma vez em uma fronteira pode custar menos, ao longo de uma carga de trabalho, do que uma falha paga de novo em cada nível que ela alcança.

<div id="5-standards-are-how-markets-close-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 5. Padrões são a forma como os mercados fecham interfaces

Os economistas estudam o problema da interface há décadas sob outro nome: compatibilidade. Katz e Shapiro mostraram que, quando o valor de um produto cresce com o número de usuários com os quais ele pode funcionar, os incentivos das empresas para serem compatíveis dependem de seu tamanho e posição, e o mercado pode entregar compatibilidade de menos [12]. Farrell e Saloner mostraram que um mercado pode ficar preso a um padrão antigo, ou migrar para um novo depressa demais, porque a escolha de cada usuário depende do que os outros escolhem [13]. A história do teclado QWERTY de David tornou concreta a dependência da trajetória [14]. Baldwin e Clark mostraram que as regras de projeto, interfaces visíveis fixadas de antemão, são o que permite que indústrias modulares cheguem a se formar [15]. A revisão de Swann para o governo do Reino Unido resumiu as evidências de que os padrões contribuem para a produtividade e o comércio [16].

O fio comum é que uma interface é um bem público com custos privados. Escrever um pressuposto e verificá-lo beneficia cada parte que atravessa a fronteira, mas é pago por quem escreve. Cada parte tem um motivo para tratar a passagem como trabalho de outra. Os organismos de normalização, os reguladores e os donos de plataformas são as instituições que historicamente pagaram esse custo. Representações verificadas por máquina, como tipos que carregam unidades de medida ou especificações formais verificadas por um verificador de modelos [21, 22], reduzem o custo privado de fechar uma interface em direção ao custo de executar sua verificação.

<div id="6-generated-code-crosses-the-same-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 6. O código gerado atravessa as mesmas interfaces

O código produzido por um gerador automático atravessa as mesmas fronteiras que o código escrito à mão: entre uma especificação e uma implementação, entre uma biblioteca e seus usuários, entre o software e o contrato de instruções abaixo dele. Cada travessia carrega pressupostos que um gerador não verifica, a menos que seja construído para isso. As cifras da Seção 3, portanto, também dizem respeito à geração automática de código. Se uma grande parcela do custo da má qualidade de software é o custo de pressupostos não verificados nas fronteiras, então o valor de fechar interfaces pode superar o valor de escrever código mais depressa. Isso é uma hipótese sobre onde está o valor, não uma medição. Os protocolos da Seção 7 são a maneira de medi-lo.

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. Proposições e protocolos

**Proposição E1 (a parcela da interface).** Em uma população de falhas de software com custos contabilizados, a parcela do custo cuja causa é um pressuposto de interface violado, conforme definido no Resumo, supera a parcela cuja causa está inteiramente dentro de um único órgão.

*Protocolo.* Tome um corpus público de incidentes com campos de custo, como relatórios de acidentes de agências ou documentos regulatórios. Dois codificadores classificam cada causa como de interface ou interna usando as definições do Resumo, sem conhecer o custo. Informe a parcela da interface ponderada pelo custo com um intervalo bootstrap e a concordância entre os codificadores.

**Proposição E2 (verificações compensam).** Para uma carga de trabalho fixa, o custo de adicionar uma verificação explícita em uma interface é menor do que o custo esperado das falhas que ela recusa, somado sobre cada nível que a falha alcançaria de outra forma. Formalmente, para uma interface atravessada $N$ vezes, seja $c$ o custo de uma verificação em dólares, $\pi$ a probabilidade de que uma travessia viole o pressuposto e $L_m$ o custo em dólares que uma violação não detectada impõe no nível $m$ dos $M$ níveis que ela alcança. A verificação compensa quando $N c < N \pi \sum_{m=1}^{M} L_m$, ou seja, quando $c < \pi \sum_m L_m$. Os dois casos contabilizados da Seção 2 têm $\sum_m L_m$ da ordem de $10^8$ dólares, então a condição vale para qualquer verificação que custe menos de $10^8 \pi$ dólares por travessia.

*Protocolo.* Em um sistema cujos níveis têm custos de operação conhecidos, injete uma violação de cada pressuposto de interface registrado em um conjunto fixo de sementes, registrando o custo de cada verificação e o custo de cada violação não detectada onde ela cai. Informe ambos em joules e em dólares a um preço declarado.

**Proposição E3 (fechar uma interface reduz seu custo privado).** Quando o pressuposto de interface faz parte de uma representação compartilhada e é verificado por construção, o custo de fechá-lo para uma única parte cai em direção ao custo de executar a verificação.

*Protocolo.* Escolha uma passagem real entre organizações, como uma especificação entregue a um implementador. Conduza-a em um braço como documentação em prosa e no outro como uma representação verificada por máquina. Registre as horas de trabalho de cada lado da passagem e as falhas localizadas na interface em cada braço, com intervalos de Wilson de 95%.

<div id="8-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 8. Conclusão

O custo das interfaces não examinadas é real, grande e mal medido. Falhas individuais podem ser precificadas com exatidão, e mostram que a perda recai sobre uma fronteira que cada órgão achava pertencer a outro. As estimativas nacionais são modelos, e as maiores delas descrevem a qualidade de software como um todo. Nenhuma fonte primária declara o custo da falha de interface por si só, e este ensaio não fornece um. O que as evidências sustentam é uma estrutura: custos que surgem nas fronteiras, se propagam para cima e se acumulam como dívida, em mercados que fornecem de menos o bem público de uma interface verificada. As proposições da Seção 7 enunciam como essa estrutura pode ser testada.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referências

[1] NASA Jet Propulsion Laboratory, "Mars Climate Orbiter Fact Sheet," Mars Surveyor 1998 project. Archived copy: https://web.archive.org/web/20121003073752/http://mars.jpl.nasa.gov/msp98/orbiter/fact.html

[2] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[3] A. Pollack, "Two Teams, Two Measures Equaled One Lost Spacecraft," *The New York Times*, 1 October 1999. https://archive.nytimes.com/www.nytimes.com/library/national/science/100199sci-nasa-mars.html

[4] European Space Agency, "Cluster will fly again!," press release N° 12 1997, 26 March 1997. https://www.esa.int/Newsroom/Press_Releases/Cluster_will_fly_again

[5] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[6] RTI International for the National Institute of Standards and Technology, *The Economic Impacts of Inadequate Infrastructure for Software Testing*, Planning Report 02-3, May 2002. https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf

[7] M. P. Gallaher, A. C. O'Connor, J. L. Dettbarn and L. T. Gilday, *Cost Analysis of Inadequate Interoperability in the U.S. Capital Facilities Industry*, NIST GCR 04-867, 2004. doi:10.6028/NIST.GCR.04-867

[8] H. Krasner, *The Cost of Poor Software Quality in the US: A 2022 Report*. Consortium for Information and Software Quality, 2022. https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/

[9] Stripe, *The Developer Coefficient*, with Harris Poll, September 2018. https://stripe.com/files/reports/the-developer-coefficient.pdf

[10] W. Cunningham, "The WyCash portfolio management system," *OOPSLA 1992 Addendum*, *ACM SIGPLAN OOPS Messenger* 4(2), 1993, pp. 29 to 30. doi:10.1145/157710.157715

[11] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[12] M. L. Katz and C. Shapiro, "Network Externalities, Competition, and Compatibility," *American Economic Review* 75(3), June 1985, pp. 424 to 440. RePEc:aea:aecrev:v:75:y:1985:i:3:p:424-40. https://www.jstor.org/stable/1814809

[13] J. Farrell and G. Saloner, "Standardization, Compatibility, and Innovation," *RAND Journal of Economics* 16(1), 1985, pp. 70 to 83. doi:10.2307/2555589

[14] P. A. David, "Clio and the Economics of QWERTY," *American Economic Review* 75(2), Papers and Proceedings, May 1985, pp. 332 to 337. RePEc:aea:aecrev:v:75:y:1985:i:2:p:332-37. https://www.jstor.org/stable/1805621

[15] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[16] G. M. P. Swann, *The Economics of Standardization: An Update*. Report for the UK Department for Business, Innovation and Skills, 2010. https://www.gov.uk/government/publications/economics-of-standardisation-update-to-report

[17] European Space Agency, "The Resurrection of the Cluster Scientific Mission," *ESA Bulletin* 91, 1997. https://www.esa.int/esapub/bulletin/bullet91/b91cred.htm

[19] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[20] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[21] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8

[22] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417
