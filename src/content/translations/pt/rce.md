---
title: "O Reality Code Engine: uma Forma sem perdas para programação nativa, verificada e de baixo consumo de energia"
deck: "Um sistema de programação em que um programa é escrito uma vez como uma máquina de estados e o código em outras linguagens é gerado a partir dela: sua especificação, o verificador de referência e seus emissores, as provas em Lean e medições registradas da dimensão dos programas, com protocolos e falseadores fixados de antemão."
lang: "pt"
source: "rce"
complete: true
---


*Versão 1.24, 28 outubro 2026. Especificação: [rascunho atual (rascunho 0.9)](/rce/spec/), de [openIE-dev/rce](https://github.com/openIE-dev/rce); as contagens das verificações executadas em [§3.7](#37-the-language-one-text-costs-and-theorem-status) estão nos commits públicos nomeados ali, e aqueles em `e416fd0` são registrados em [`src/data/rce-facts.json`](https://github.com/openIE-dev/research-openie-web/blob/dcharlot65-openie/src/data/rce-facts.json). Dados e código: [research.openie.dev/data/](/data/#rce). Playground (verificador de referência): [openie-dev.github.io/rce](https://openie-dev.github.io/rce/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Este artigo descreve o Reality Code Engine (RCE), um sistema no qual um programa é escrito uma vez como uma máquina de estado, chamada de Forma, e o código em outras linguagens é gerado a partir dele. Ele apresenta a especificação escrita da linguagem, o verificador de referência que a implementa e emite Rust, Python, JavaScript e Scala (a saída em Scala ainda não concorda com a referência), as provas em Lean de seus teoremas, medições registradas da dimensão de seus programas, o design do motor que encontra, verifica e reutiliza soluções, e o design pelo qual cada linguagem deve ser elevada para a Forma e emitida a partir dela. Ele afirma como as alegações poderiam ser mostradas como falsas e os protocolos das medições ainda a serem feitas.

**Em palavras simples**

1. Um programa é escrito uma vez, em uma forma precisa, e o computador produz o mesmo programa a partir dele em Rust, Python e JavaScript hoje. O design é para todas as linguagens; as ferramentas que converteriam outras linguagens ainda não foram construídas.
2. Tudo que um programa pode fazer é declarado em sua forma, e a linguagem exige que cada entrada tenha um resultado declarado, um passo ou uma recusa registrada, em vez de um indefinido que é encontrado e corrigido depois.
3. No design do motor, uma correção que passa nas verificações é salva e reutilizada, de forma que o mesmo problema não custe tempo ou energia duas vezes.
<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. Tese

A automação computacional autônoma é um espaço de design com muitos pontos nele. Cada abordagem ocupa algum lugar ao longo de cinco eixos contínuos: a energia gasta por resultado correto; a entropia que o sistema deve resolver em tempo de execução, e com isso, quão determinístico seu output é; a força da verificação que aceita um resultado; quão longe cada resultado aceito é reutilizado e composto; e quão muito a abordagem depende de um modelo. Um grande modelo de linguagem (LLM), um modelo estatístico de texto, que escreve cada mudança a partir do prompt está perto de um canto desse espaço: ele depende do modelo para cada tarefa, tira uma amostra fresca de uma distribuição de alta entropia cada vez, e paga novamente pela geração em cada tarefa. Recuperação, regras, síntese, verificação e cache ocupam muitos outros pontos, e sistemas reais combinam esses elementos.

O Reality Code Engine (RCE) é um ponto nesse espaço. Este artigo descreve-o, e as medições que ele relata são sobre sua linguagem e as ferramentas dessa linguagem. O RCE modela um programa como uma máquina de estado funcional de banco de dados. Lopes e colegas mediram que cerca de 70% do código no GitHub consiste em clones de arquivos anteriores [33], então o design do motor do RCE primeiro recupera uma solução existente, adapta-a e verifica-a, e chama um modelo apenas quando nada mais barato conclui a tarefa.

**A reivindicação central.** O RCE é projetado como um ecossistema de código completo no qual programas são autorizados nativamente a partir da intenção. A intenção é escrita uma vez, como uma Forma: um estado, um conjunto de eventos e uma transição pura e total. A Forma é uma codificação sem perdas dessa intenção. O RCE é projetado para que cada linguagem de destino seja uma projeção da Forma, e cada projeção deve reproduzir byte por byte a trajetória da Forma. Hoje, o verificador de referência tem quatro emissores, para Rust, Python, JavaScript e Scala, que traduzem a árvore de sintaxe verificada de um programa em vez da Forma; as saídas de Rust, Python e JavaScript passam cada uma 1.459 testes de conformidade com 0 falhas, e a saída de Scala ainda não concorda com a referência ([§4.5](#45-the-compilers)). Cada estado em que um programa pode estar é declarado em sua Forma, e a linguagem exige que cada entrada tenha um resultado declarado: um passo que o leva, ou uma recusa por seu contrato que deixa o estado inalterado e é registrada no log (T8). Um programa que atende a esses requisitos não pode se desviar de sua intenção da maneira como um programa em uma linguagem comum se desvia de seus comentários, seus testes ou suas outras implementações, e não precisa de difs pós-fato ou rastreamento de erros. O contrato de entrada que faz o verificador de referência atender ao segundo requisito na entrada está listado em [§10](#10-work-to-finish). No design do motor, cada solução que a porta aplica é armazenada e reutilizada, então o ecossistema compõe-se conforme cresce ([§2.4](#24-gated-verified-recursive-self-improvement)). Código escrito em outras linguagens é projetado para entrar por elevação ([§6](#6-lift-entering-the-ecosystem-from-other-languages)). A única elevação pública hoje é uma sonda para um padrão Go; elevar todas as linguagens para a Forma e emitir todas as linguagens a partir dela é o objetivo de uma proposta no repositório de especificações, cujos níveis de aceitação dizem quando uma linguagem conta como elevada ou emitida ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)).

Cada ponto no espaço enfrenta a mesma porta. A porta é a correção: o predicado de completude de uma tarefa $C(z)$, aqui os testes da tarefa, uma prova ou uma trajetória de acordo. Entre as execuções que passam pela porta, os sistemas são classificados pelo número de joules para completude, $J^*$. A correção é uma restrição, não uma pontuação.

No design do motor, os mecanismos do RCE, chamados engrenagens, executam em ordem de custo, e a primeira engrenagem cujo candidato passa pela porta encerra a tarefa.

As figuras de energia são rotuladas pela fonte. `est_j` é uma estimativa analítica. `reported_j` é um contador do sistema operacional ou da placa. `measured_j` é reservado para um medidor de parede e está vazio em cada resultado aqui. O RCE não tem uma figura de energia medida: o verificador de referência não calcula joules, suas unidades de orçamento contam trabalho e não são energia, e cada `est_j` neste artigo é um modelo. Um custo sem modelo é rotulado como não precificado e nunca é lido como zero ([§4.4](#44-receipts)).
<div id="2-the-design-space-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

## 2. O espaço de design do código autônomo

![Uma frase entra. Um andar sai. A intenção humana é de alta entropia; um funil de conversões da intenção para especificação para 626 linguagens de superfície para uma representação intermediária para código de máquina perde informações em cada fronteira; todo código atinge algumas formas de máquina; RCE escreve o significado uma vez em uma Forma canônica, foi projetado para tratar cada superfície como uma projeção (hoje Rust, Python e JavaScript passam no conjunto de conformidade e Scala ainda não) e para permitir que a forma correta mais barata vence.](/figures/rce/intent-entropy.svg)

*Figura 1. Entropia da intenção e o andar da máquina. Uma cópia [PNG](/figures/rce/intent-entropy.png) está disponível. O painel 6 afirma o design do RCE; o que existe hoje está descrito em [§4.5](#45-the-compilers). Fontes: Shannon (1951); Lopes et al. (2017); a contagem de 626 linguagens é uma pesquisa não publicada pelos autores do OpenIE e não apoia nenhuma afirmação neste artigo. Os resultados de Python e C são comportamento da especificação da linguagem; o overflow com sinal em C é comportamento indefinido.*

**A intenção é de alta entropia.** "Faça o checkout mais rápido" carrega muitos significados: carregamento de página mais rápido, menos etapas, aprovação mais rápida da cartão, um carrinho em cache, ou mais rápido em uma classe de dispositivos. O contexto é implícito e nunca escrito. Shannon mediu o inglês impresso em cerca de 0,6 a 1,3 bits por letra [1]. As letras são previsíveis. O significado não é.

**Cada conversão perde informação.** A intenção se torna uma especificação, e o contexto é perdido. A especificação se torna uma das centenas de linguagens de superfície, e alternativas e casos de borda são perdidos. A fonte se torna uma representação intermediária (IR), e nomes, estilo e razões do autor são perdidos. A IR se torna código de máquina, e tipos se tornam tamanhos e loops se tornam saltos.

**O andar é de baixa entropia.** Todo programa termina como carregamentos, armazenamentos, aritmética e saltos. O destino tem espaço para apenas algumas formas, então o código se curva para elas. A convergência é por design.

**As fronteiras são onde o significado diverge.** A mesma linha dá respostas diferentes nas bordas. Em Python, `-3 % 2` é 1 e `-7 / 2` é -3,5. Em C, `-3 % 2` é -1, `-7 / 2` é -3, e o overflow com sinal é comportamento indefinido. Um sistema que regenera o código em cada fronteira adivinha em cada fronteira.

**Os eixos, declarados como quantidades.**

| Eixo | Um extremo | Outro extremo | Onde o design do RCE se situa |
|---|---|---|---|
| Energia por resultado correto | Paga novamente em pleno em cada tarefa | Paga uma vez por novo caso, depois o andar do manipulador | No andar para tarefas cobertas |
| Entropia resolvida em tempo de execução, e determinismo | A distribuição completa do prompt, uma amostra fresca cada vez | Apenas o residual, nenhuma solução armazenada cobre, uma saída determinística | Apenas o residual; cada projeção determinística |
| Força de verificação | Saída aceita na inspeção | Testes, cobertura e um certificado de prova | A porta completa em cada resultado |
| Reutilização e compounding | Cada resultado usado uma vez | Cada solução aceita armazenada e reutilizada | Cada solução que a porta aplica é armazenada |
| Dependência de modelo | Um modelo em cada tarefa | Nenhum modelo | Um modelo apenas como a última engrenagem |

As abordagens diferem por grau em cada eixo, e os eixos interagem: a reutilização reduz a energia e a entropia restante para resolver, e a verificação forte é o que torna a reutilização segura. O RCE escreve o significado uma vez, em uma Forma canônica. Em seu design, cada linguagem de superfície é uma projeção dessa Forma, verificada para corresponder a ela, e entre formas equivalentes a mais barata e correta executa; quatro linguagens são emitidas hoje ([§4.5](#45-the-compilers)).

A Figura 2 desenha os cinco eixos e coloca as principais classes de abordagem neles.

![Gráfico de radar com cinco eixos: energia por resultado correto, determinismo, força de verificação, reutilização e compounding, e independência de modelos. Cinco classes de abordagem são desenhadas como polígonos. Um modelo em cada tarefa está perto do centro em todos os eixos. Um loop de agente com porta de testes está mais alto em verificação. Um modelo com recuperação e cache está mais alto em reutilização. Síntese e reparo clássicos estão altos em determinismo e independência de modelos. O RCE, marcado com estrelas, está no ou perto do anel externo em todos os cinco eixos. As posições são qualitativas.](/figures/rce/design-space.svg)

*Figura 2. O espaço de design do código autônomo. Diagrama qualitativo: cada classe de abordagem é colocada pela leitura do artigo da Seção 2 em níveis ordinais, não por medição. A dependência de modelo é desenhada como independência de modelos para que a saída seja melhor em cada eixo. Uma cópia [PNG](/figures/rce/design-space.png) está disponível.*
<div id="21-programming-is-coding-theory" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Programação é teoria de codificação

A tese desta seção é que a programação pode ser lida como teoria de codificação. Um programador converte intenções ao longo de um gradiente entre dois regimes entropicos. A intenção é alta entropia, uma distribuição sobre significados. O código é baixa entropia, uma transição determinística por estado. Cada passo do trabalho de software, desde uma exigência até um registrador, é um passo dessa conversão. A literatura já disse isso em partes há setenta anos, em muitos idiomas. Esta seção reúne as partes em um argumento e coloca cada engrenagem RCE nela.

**A medida.** Shannon definiu a entropia de uma fonte e a capacidade de um canal [40], e mediu o inglês impresso em cerca de 0,6 a 1,3 bits por letra [1]. Kolmogorov, escrevendo em russo em *Problemy Peredachi Informatsii* em 1965, deu três abordagens para a quantidade de informação e tornou a algorítmica a principal: a informação em um objeto é o comprimento do programa mais curto que o produz [41]. Solomonoff chegou ao mesmo objeto como uma teoria da inferência indutiva [42], e Chaitin mostrou que o tamanho do programa obedece identidades formalmente idênticas às de Shannon [43]. Rissanen transformou a ideia em uma regra para escolher modelos, a menor descrição de comprimento [44]. Juntos, eles dizem que um programa é uma palavra de código: uma descrição de um comportamento, e a mais curta correta é o piso. A regra de extração RCE, manter o termo com menos joules entre termos equivalentes (Proposição 3), é essa regra com joules no lugar de bits.

**O código está no regime de baixa entropia, e as pessoas o mediram.** Hindle, Barr, Su, Gabel e Devanbu encontraram que o código é "muito repetitivo, e de fato ainda mais do que línguas naturais", com menor entropia cruzada sob os mesmos modelos de n-grama [35]. Gabel e Su encontraram que a maioria das linhas de um projeto já existem em outro lugar [34], e Lopes et al. encontraram que a maioria dos arquivos no GitHub são clones [33]. Tu, Su e Devanbu encontraram que o código também é local: o que foi escrito perto prevê o que vem a seguir [46]. Ray e colegas encontraram que linhas com bugs são menos naturais, com maior entropia, e que a entropia cai quando o bug é corrigido [45]. Em 2025 Yang, Kolak, Hellendoorn e Martins usaram a mudança de entropia que um patch induz para classificar candidatos de reparo e separar patches corretos dos que sobrefitam [51]. Allamanis, Barr, Devanbu e Sutton revisaram o campo sob o nome de naturalidade [47]. O resultado não é apenas um em língua inglesa. Prem Devanbu apresentou-o como palestra-chave na Conferência de Engenharia de Software da Índia em 2013 [50]. Sridhara, Sinha e Mani, no IBM Research da Índia, mediram os artefatos de língua natural ao redor do código no mesmo local e encontraram que as mensagens de commit são as mais regulares e o texto de Stack Overflow se comporta como inglês comum [49]. Na China, o *Journal of Software* (软件学报) publicou uma revisão da pesquisa sobre naturalidade do código em 2022, que afirma a medida de entropia cruzada e a descoberta de que o código defeituoso tem maior entropia [48]. No Japão, Doi, Higo, Arima, Shimonaka e Kusumoto da Universidade de Osaka usaram a naturalidade de n-grama, primeiro em um relatório técnico da IEICE em língua japonesa e depois no ICPC 2018, para distinguir arquivos de origem gerados por máquina de humanos [73, 74]. O código gerado está ainda mais baixo na escala de entropia do que o código humano, porque um gerador é uma conversão fixa. No Brasil, a tese de doutorado de Arrebola construiu sugestões de código com modelos de n-grama e tópicos segmentados por projeto e mantenedor, e avaliou-as pela entropia cruzada, os bits necessários para codificar o próximo token [75]. Os dois regimes são visíveis em um repositório: o texto ao redor do código é alta entropia, e o código é baixa.

**A medida importa.** Febres, Jaffé e Gershenson, trabalhando da Venezuela e do México, compararam o inglês, o espanhol e o texto de programa pela diversidade de vocabulário por comprimento da mensagem e encontraram o texto de programa mais diverso [76]. Rahman, Palani e Rigby encontraram que muito da previsibilidade de n-grama do código vem de tokens de sintaxe, e que o código ainda é repetitivo, menos do que primeiro relatado, uma vez que esses são removidos, com o uso de API sendo a parte mais repetitiva [77]. Ambos os resultados aprimoram a afirmação em vez de invertê-la. Diversidade de símbolos não é previsibilidade, e o regime de baixa entropia é uma propriedade da distribuição condicional do próximo passo, que é o que uma transição determinística fixa. No design, a primeira engrenagem RCE, lookup (G0, [§2.2](#22-how-rce-converts-and-where-each-gear-sits)), chama formas, não texto superficial, por esse motivo.

**A intenção está no regime de alta entropia.** Zave e Jackson mostraram que uma exigência é uma afirmação sobre o ambiente, uma especificação é uma afirmação na interface, e o gap entre eles é preenchido apenas por conhecimento de domínio que frequentemente não é escrito [64]. Brooks dividiu a dificuldade do software em essência e acidente: a essência é a construção conceitual, e a maior parte dela é especificação e design, não representação [61]. Naur argumentou que um programa é a parte visível de uma teoria mantida por seus programadores, e que a teoria não é totalmente recuperável do texto [62]. Lido por Shannon, os três dizem a mesma coisa. A intenção carrega mais incerteza do que qualquer um programa, e escrever o programa é a ação que a remove. O que permanece na cabeça de um programador após o código ser escrito é a parte da intenção que o código não codificou.

**A conversão é uma refinamento, e o refinamento é uma estreitamento.** Hoare deu programas uma lógica na qual um programa é correto em relação a uma pré-condição e pós-condição [54]. Wirth ensinou refinamento passo a passo: decomponha uma tarefa em instruções por decisões sucessivas, cada uma fixando uma escolha que a especificação deixou aberta [53]. Os comandos guardados de Dijkstra tornaram as escolhas abertas explícitas como não determinismo, e derivaram programas de especificações removendo-o [52]. Em Munique, o projeto CIP de Bauer e Wössner construiu o desenvolvimento de programas como uma sequência de transformações que preservam a correção da especificação para o programa [58]. Na França, o método B de Abrial e depois Event-B levaram o refinamento à escala industrial, com obrigações de prova em cada passo [55, 56]. Na Finlândia, Back e von Wright deram ao refinamento seu cálculo teórico da rede [57]. Em cada um, uma especificação denota um conjunto de comportamentos aceitáveis e cada passo de refinamento encolhe o conjunto, até que um comportamento determinístico reste. Isso é redução de entropia com uma prova em cada passo. A Forma RCE é o último elemento dessa cadeia: uma transição determinística total $\delta$ sobre estados de banco de dados, com cada escolha resolvida ([§3.2](#32-definitions)).

**A síntese é busca que estreita um espaço de hipóteses.** Gulwani's FlashFill aprende um programa de string de alguns exemplos de entrada-saída representando o conjunto de todos os programas consistentes e intersectando-o com cada novo exemplo [59]. Gulwani, Polozov e Singh enquadram a síntese de programas em geral como busca por um espaço de programas restrito pela intenção [60], e Solar-Lezama's sketching preenche buracos em um programa parcial com um solucionador [27]. Cada exemplo ou restrição é uma medição que remove hipóteses. A medida de Shannon conta quantas dessas medições são necessárias. No design, a terceira engrenagem RCE, síntese (G2, [§2.2](#22-how-rce-converts-and-where-each-gear-sits)), é essa engrenagem.

**O que a conversão produz tem uma forma.** Gurevich provou que cada algoritmo sequencial é capturado por uma Máquina de Estado Abstrata em seu próprio nível de abstração [2]. Codd tornou o estado uma relação [5], e o sourcing de eventos torna o estado a dobra de um log apenas de adição [14]. Sob Curry e Howard, uma prova é um programa e uma proposição é um tipo [18, 72], então um programa verificado é uma prova de sua especificação. Essas são as razões do regime de baixa entropia ter poucas formas: o destino é uma máquina de estado sobre um banco de dados, qualquer que seja a linguagem superficial.

**A baixa entropia decai sem uma porta.** Lehman observou ao longo de décadas de grandes sistemas que um programa em uso deve continuar mudando, e que sua complexidade cresce a menos que se faça trabalho para reduzi-la [63]. Torres, Baltes, Treude e Wagner mediram a entropia estrutural e textual sobre as histórias de commit de 25 projetos e encontraram que as duas crescem juntas [78]. A entropia flui de volta para o código do ambiente. Um sistema que mantém o código no regime de baixa entropia precisa de uma porta em cada mudança, e a porta RCE é a correção ([§4.3](#43-the-gate)).

**Compiladores já fazem codificação de fonte.** Franz e Kistler enviaram programas como árvores sintáticas abstratas comprimidas e geraram código nativo ao carregar, que é codificação de fonte de um programa sobre sua própria gramática [67]. Fraser inferiu modelos estatísticos de código de um corpus para comprimi-lo [68]. Futamura mostrou em 1971, no jornal japonês *Systems, Computers, Controls*, que especializar um interpretador para um programa produz um programa compilado, e que especializar o especializador produz um compilador [70]. Ershov em Novosibirsk desenvolveu a mesma ideia como computação mista [71]. A interpretação abstrata dos Cousots calcula uma descrição de baixa informação, sonora de cada comportamento de um programa [69]. A analogia com codificação de canal é a leitura deste artigo, não um teorema citado: tipos, testes e provas adicionam redundância verificada para que um programa errado seja detectado antes de executar, como uma verificação de paridade detecta uma palavra corrompida.

**A eliminação é onde os joules vão.** Landauer mostrou que um passo logicamente irreversível, a eliminação de um bit, dissipa pelo menos $k_B T \ln 2$ [65]. Bennett mostrou que a computação pode, em princípio, ser feita logicamente reversível, então a eliminação, não a computação, carrega o limite [66]. Converter a intenção de alta entropia em um programa de baixa entropia descarta cada alternativa que a intenção permitiu. Essa descartada é uma eliminação da informação sobre as alternativas, e tem um piso termodinâmico. No design do motor, RCE paga a descartada uma vez por novo caso e armazena o resultado, então um caso repetido não apaga nada novo.

**O que o superfície custa, medido.** O resultado de naturalidade tem duas correções que este artigo agora carrega, e uma terceira descoberta que se refere ao Form sem nome. Primeiro, o gap bruto de entropia entre código e prosa encolhe substancialmente uma vez que os tokens de sintaxe são removidos [77], e Casalnuovo, Lee, Morgan e Devanbu encontraram que parte do que resta é um efeito de familiaridade: nos projetos Java e Python com mais estrelas, o código original tinha menor surpresa do que reescritas que preservavam o significado, e 50 avaliadores humanos concordaram com a preferência do modelo de linguagem 61,9% do tempo [132]. O que lê como natural é o que o leitor viu mais, então uma Forma canônica move o equilíbrio desse loop em vez de escapar dele. Segundo, as únicas quantidades que acompanham a carga de compreensão medida são o tamanho textual, o tamanho do vocabulário e o alcance da dependência de fluxo de dados: em um estudo que testou métricas de código contra ativação cerebral, essas três correlacionaram-se com Kendall τ ≈ 0,4 enquanto a complexidade ciclomática de McCabe correlacionou-se com nada (τ ≈ 0,09) [133]; em 121 métricas de legibilidade e 444 avaliações, nenhuma única métrica atingiu |τ| > 0,16 com a compreensão medida [134]; e a impressão bonita contra o layout interrompido mostrou nenhuma diferença de fMRI [135], consistente com a descoberta de que o formatação é 13 a 15% dos tokens de linguagens de chaves e pode ser removido para dez modelos de linguagem sem mudança significativa na precisão [136]. Terceiro, nomes são um canal de baixa concordância, alta dependência: dois desenvolvedores escolhem o mesmo nome com probabilidade mediana de 6,9% [137], comentários coevoluem com o código que descrevem em 7 a 13% dos casos [138], e ainda assim modelos de fronteira perdem 11 a 29 pontos de precisão de resumo e até 24 pontos de precisão de previsão de execução quando identificadores são removidos ou substituídos [139]. Humanos, por contraste, não processam identificadores como linguagem no nível neural: trocar identificadores em inglês por japoneses alterou a resposta do sistema de linguagem por Δβ = 0,03 [140]. A consequência para RCE é declarada em [§3.8](#38-behaviour-equivalence-and-dimension): posições permanecem no hash (T7) e nomes permanecem fora dele, mas a tabela lateral que os mantém deve carregar o *conceito* que um nome codifica, porque os únicos autores que importarão lerão através de nomes e a Forma ainda não mostrou que um modelo pode raciocinar a partir de uma sem nome.
<div id="22-how-rce-converts-and-where-each-gear-sits" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Como o RCE converte, e onde cada engrenagem se encaixa

Lido como teoria da codificação, uma tarefa chega como uma mensagem cuja incerteza restante é aquilo que nenhuma solução armazenada já resolve. No design do motor, cada engrenagem remove incerteza a um preço diferente, e as engrenagens são ordenadas por esse preço ([§4.2](#42-the-gears)); a tabela fornece esse design engrenagem por engrenagem, com a porta e a promoção.

| Engrenagem | O que ela faz com a incerteza | Linhagem no argumento acima |
|---|---|---|
| G0 Lookup | Reconhece que a intenção já estava codificada; resolve-a por recuperação, no chão do manipulador | Repetitividade e clones [33, 34, 35]; localidade [46] |
| G1 Rules | Aplica uma reescrita guardada conhecida; resolve um resíduo recorrente sem busca | Transformação que preserva a correção [52, 58]; refinamento com obrigações de prova [55, 56] |
| G2 Synthesis | Busca no espaço de hipóteses e o estreita com exemplos, restrições e um solucionador | Síntese de programas como busca [27, 59, 60] |
| G3 a G5 Models | Amostra de uma distribuição aprendida sobre o código quando nenhuma engrenagem inferior fecha o gap; apenas um proponente | Modelos de cross-entropia do código [35, 47] |
| Porta | Aceita um candidato apenas com testes, cobertura e um certificado de prova | Lógica de Hoare [54]; Curry-Howard [18, 72] |
| Promoção | Armazena a solução aceita, de forma que o mesmo resíduo custa G0 na próxima vez | Comprimento mínimo de descrição [44]; apagamento de Landauer pago uma vez [65] |

As posições nos eixos da Seção 2 diferem em onde a conversão é paga. Uma abordagem que amostra a distribuição completa do prompt em cada tarefa paga novamente o lado de alta entropia cada vez. Uma abordagem que armazena e reutiliza soluções aceitas paga apenas pelo resíduo, e apenas uma vez. A maioria dos sistemas está entre esses extremos, e o design do RCE está no extremo de reutilização.

<div id="23-the-ecosystem-at-large-n" class="anchor-alias" aria-hidden="true"></div>

### 2.3 O ecossistema para N grande

A reivindicação de [§1](#1-thesis) deve ser testada diretamente, para N grande, sob o protocolo abaixo, registrado antes de sua execução. Um gerador semeado escreve pelo menos 10.000 Formas, cada uma um módulo da linguagem com uma região de estado, um evento com campos inteiros e um passo cujo corpo é um termo aritmético aleatório de profundidade limitada sobre um conjunto fixo de operadores. O verificador de referência e seus emissores estão congelados em um commit público antes da execução, e nenhum modelo é chamado. As projeções são os quatro emissores de programa do verificador de referência: Rust, Python, JavaScript e Scala. Cinco propriedades são verificadas em cada Forma:

| Propriedade | O que é verificado por Forma |
|---|---|
| Codificação sem perdas | A JSON canônica da Forma (`rce emit form`), decodificada para a fonte (`rce unform`) e codificada novamente, dá os mesmos bytes |
| Projeção determinística | Dois emissores de um mesmo alvo dão os mesmos bytes |
| Projeção fiel | Cada programa emitido (Rust, Python, JavaScript e Scala) imprime o byte por byte da trilha de referência para eventos semeados |
| Porta na entrada, entradas | Cargas malformadas (tipo errado, campo faltante, campo extra, valor aninhado) e eventos não declarados são todos recusados, com o estado inalterado e a recusa registrada |
| Porta na entrada, especificações | Um módulo que usa um nome que não declara é recusado antes da emissão (W-NAME-1) |

A Seção 9 afirma a observação que derrota a reivindicação, RCE-F0: em uma execução pré-registrada de pelo menos 10.000 Formas, qualquer uma das quatro projeções imprime uma trilha que difere da trilha de referência da Forma, ou qualquer entrada malformada é aceita. No conjunto de conformidade, a saída do Scala ainda não concorda com a referência ([§4.5](#45-the-compilers)), e o verificador público ainda não atende ao contrato de entrada ([§10](#10-work-to-finish), item 15). Um alvo adicionado aos emissores entra no protocolo apenas por uma nova inscrição. As Formas geradas são pequenas, então tal execução mede a codificação, as projeções e a porta. Formas levantadas de programas reais são medidas sob o protocolo de [§8.7](#87-lift-coverage-across-languages).
<div id="24-gated-verified-recursive-self-improvement" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Auto-aperfeiçoamento recursivo verificado com porta

Good (1965) [111] definiu a máquina ultrainteligente como uma que poderia projetar máquinas melhores, de forma que o aperfeiçoamento se recursasse. Yudkowsky (2013) [113] formulou a questão como uma de retornos: se cada unidade de aperfeiçoamento torna a próxima unidade mais barata ou mais cara. A máquina Gödel de Schmidhuber (2007) [112] deu uma resposta formal com garantia: um programa reescreve qualquer parte de si mesmo, incluindo sua própria busca, apenas após provar que a reescrita melhora sua utilidade esperada. O teorema de Löb (1955) [114] é o obstáculo que um provador que se confia a si mesmo encontra, que Yudkowsky e Herreshoff (2013) [115] chamaram de obstáculo Löbian: um sistema, em geral, não pode provar a validade de um sucessor que utiliza seu próprio sistema de prova. Sistemas recentes abandonam o requisito de prova e selecionam com base em pontuação medida: STOP (Zelikman et al., 2023) [116] aperfeiçoa o suporte que aperfeiçoa o código, a Máquina Gödel Darwin (Zhang et al., 2025) [117] mantém um arquivo de agentes de codificação auto-modificados escolhidos com base em pontuação de benchmark, AlphaEvolve (Novikov et al., 2025) [118] evolui programas sob avaliadores automáticos, e Voyager (Wang et al., 2023) [119] cresce uma biblioteca de habilidades verificadas que tarefas futuras reutilizam.

RCE toma a estrutura da máquina Gödel e da biblioteca de Voyager, com duas diferenças que evitam o obstáculo para os objetos que promove. Primeiro, o objeto que se aperfeiçoa não é o provador. No design, RCE promove manipuladores, reescritas e engrenagens, e cada um é verificado contra um kernel fixo e uma regra de prova fixa: as propriedades contra as quais o kernel é verificado ([§5.3](#53-model-checking-of-the-kernel)) e a codificação da aritmética da Forma para um solucionador de satisfatibilidade modulo teorias (SMT) ([§5.2](#52-the-proof-rule-for-rewrites)) nunca mudam durante a promoção, então nenhum passo precisa confiar no sistema de prova de um sucessor. Segundo, a porta é uma prova de correção na fronteira, não uma pontuação. Uma pontuação pode subir enquanto uma suposição de interface se quebra; uma prova na fronteira não pode ser superada por uma mudança que a quebre.

**Proposição R1 (correção monótona).** Se cada mudança promovida passa pela verificação de sua fronteira, e as verificações das outras fronteiras permanecem inalteradas, então todas as propriedades estabelecidas por essas verificações antes da promoção ainda se mantêm após ela.

**Proposição R2 (compostura).** Seja uma carga de trabalho um multiconjunto de tarefas e seja um manipulador promovido que feche todas as tarefas de sua forma. Então o número de escalonamentos na rodada $t$ é não crescente em $t$, e uma correção promovida antes da rodada 1 reduz as escalonamentos cumulativos de cada horizonte pelo número de escalonamentos que ela fecha em cada rodada posterior.

**Proposição R3 (custo decrescente).** Como um manipulador promovido é executado no lugar de uma chamada a modelo, e seu custo é a contagem de operações do manipulador precificada pela tabela de substrato, a energia de uma rodada cai em direção à energia dos manipuladores sozinhos conforme os escalonamentos caem em direção a zero.

As projeções de Futamura (1971, republicado 1999) [120] e a supercompilação de Turchin (1986) [121] dão o limite desse processo. Especializar um interpretador para um programa produz um programa compilado; especializar o especializador produz um compilador. No design, as promoções de RCE especializam o caminho geral de escalonamento para as formas que realmente ocorrem, então o motor converge para o programa residual de sua carga de trabalho: a parte da computação que um modelo ou uma pessoa ainda deve fornecer. O auto-aperfeiçoamento recursivo sob uma porta é essa convergência, feita com passos verificados.

<div id="3-the-form" class="anchor-alias" aria-hidden="true"></div>

## 3. A Forma

<div id="31-the-strongest-formal-statement-of-same-form" class="anchor-alias" aria-hidden="true"></div>

### 3.1 A afirmação formal mais forte de "mesma forma"

O escopo do teorema é declarado primeiro. Os postulados sequenciais de Gurevich cobrem algoritmos sequenciais; algoritmos paralelos e interativos precisam dos postulados adicionais de Blass e Gurevich [3]. Blass, Dershowitz e Gurevich argumentam que nenhuma relação de equivalência única sobre algoritmos se encaixa em todos os propósitos [79], e Moschovakis e Vardi estabelecem o debate sobre o que é um algoritmo [80, 81]. Um manipulador de web que faz entrada e saída fica fora do teorema sequencial. A Forma lida com interação da mesma forma que a linha interativa: cada entrada é um evento em $E$, e a máquina de estados passa sobre ela. Assim, "uma Forma" é uma escolha de modelagem baseada no teorema sequencial e estendida por convenção, com precedentes de produção na arquitetura Elm [83], históricos de eventos de fluxo durável [84] e semânticas de fluxo como Flo [82]. As proposições da Seção 3.4 são declaradas para essa escolha.

O teorema da Máquina de Estado Abstrato (ASM) de Gurevich é a afirmação formal mais forte de que cada algoritmo tem uma forma [2]. Uma máquina de estado abstrato é uma máquina cujos estados são estruturas de primeira ordem e cujo passo é um conjunto finito de atualizações guardadas. Gurevich declara três postulados. Tempo Sequencial: um algoritmo tem estados, estados iniciais e um mapa de um passo $\tau$. Estado Abstrato: os estados são estruturas de primeira ordem sobre uma única vocabulário fixo, fechadas sob isomorfismo. Exploração Limitada: um conjunto finito de termos decide cada passo. Seu Teorema Principal (Teorema 6.13) afirma: "Para cada algoritmo sequencial $A$, existe uma máquina de estado abstrato sequencial equivalente $B$." Blass e Gurevich estendem isso para algoritmos paralelos [3]. Dershowitz e Gurevich adicionam um quarto axioma, que as operações iniciais são computáveis, e dele derivam a tese de Church [4].
<div id="32-definitions" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Definições

**Definição 1 (a Forma).** Um programa é um tuplo

$$P = (S, E, \delta, D, \lambda)$$

- $S = \Sigma_c \times \Sigma_d$, o espaço de estados: estruturas sobre um vocabulário fixo $\Sigma$, dividido em regiões de controle $\Sigma_c$ e dados $\Sigma_d$. $\Sigma_d$ contém o relógio lógico, a contagem de entrada e as relações tipadas (na linguagem, também as regiões declaradas). Cada estado é uma instância de banco de dados no sentido de Codd [5].
- $E$, o alfabeto de eventos, incluindo o tick do relógio lógico.
- $\delta : S \times E \to S \times O^*$, a transição: total, determinística e pura, escrita como um conjunto finito de atualizações guardadas "se $\varphi$ então $f(\bar t) := t_0$", cada passo lendo um conjunto limitado de localizações. Ele retorna o próximo estado e as saídas do passo. Escreva $\delta_1 = \pi_1 \circ \delta$ para sua componente de estado.
- $D$, o log durável: uma sequência de entradas $\{\mathit{seq}, \mathit{event}, \mathit{prev\_hash}, \mathit{state\_hash}, \mathit{hash}\}$, onde $\mathit{state\_hash}$ é o SHA-256 da JSON canônica do estado após o passo, $\mathit{hash}$ é o SHA-256 da JSON canônica das primeiras quatro campos, e o primeiro $\mathit{prev\_hash}$ é 64 zeros. O log é uma cadeia de hash, então alterar qualquer entrada passada altera todos os $\mathit{hash}$ posteriores.
- $\lambda = \pi_2 \circ \delta : S \times E \to O^*$, o mapa de saída. Uma máquina de Mealy lê ambos os argumentos [6]; uma máquina de Moore lê apenas o estado [7].

**Definição 2 (Forma e ajuste).** A *forma* é o formato do tuplo com quatro invariantes: $\delta$ é determinístico e puro; a exploração é limitada; o vocabulário é fixo; o estado é a pasta do log,

$$\mathrm{state}(D) = \mathrm{foldl}(\delta_1, s_0, D).$$

Um log também pode carregar o resultado de cada entrada, saídas e estado. Esses são derivados: eles não são hashados, e devem ser iguais à reprodução (T1 e T3 de [§3.7](#37-the-language-one-text-costs-and-theorem-status)). Dois tipos de rejeição são distintos. No perfil do motor que o Apêndice D da especificação define, cada evento é aplicado, e uma entrada que falha em seu contrato produz uma saída `reject` e uma linha de erro (D.6). Na linguagem, um evento recusado deixa o estado inalterado (T8) e é registrado como recusado.

O *ajuste* é os dados que preenchem o formato: o vocabulário $\Sigma$, os alfabetos $E$ e $O$, o programa de regras $\Pi$ que define $\delta$, as regras de saída que definem $\lambda$, e os dados iniciais $s_0$. Em termos de Gurevich, o ajuste é o vocabulário, o programa ASM e as estruturas iniciais. Em termos de Codd, $\Sigma$ é o esquema e $s_0$ é a instância. Em termos de linha de produto, um ajuste é uma seleção de recursos [8]. Em termos de síntese guiada por sintaxe (SyGuS), um ajuste é um termo de uma gramática que atende a uma especificação [9].

**Definição 3 (equivalência de ajuste).** Dois ajustes são equivalentes quando, para cada sequência de eventos $L$, suas sequências de saída sob $\lambda$ são iguais.

**Definição 4 (linguagem de ajuste).** Uma gramática cujos termos denotam ajustes. Linguagens de programação, documentos de diagramas de estado em State Chart XML (SCXML), configurações XState e especificações `.rce` são linguagens de ajuste. Uma linguagem de ajuste é completa quando cada programa ASM sobre $\Sigma$ tem um termo nela.

**Definição 5 (projeção de controle).** Divida $\Sigma = \Sigma_c \cup \Sigma_d$ em símbolos de controle finitos e relações de dados. O diagrama de estado de $P$ é a projeção de $\delta$ sobre $\Sigma_c$: os estados são valores de $\Sigma_c$, as transições carregam um evento e uma guarda sobre $\Sigma_d$, e as ações são atualizações para $\Sigma_d$. Os diagramas de estado de Harel dão a hierarquia e as regiões ortogonais [10].

**Definição 6 (e-grafo de ajuste).** Para um ajuste $F$ e um conjunto $R$ de reescritas sólidas, o e-grafo de ajuste $EG(F, R)$ é o e-grafo saturado dos termos de regra de $F$ sob $R$ [11, 12]. Cada classe e contém ajustes equivalentes pela Definição 3.

**Definição 7 (custo em joules).** $\mathrm{cost}_J(t)$ é a estimativa da energia (`est_j`) para executar o termo $t$ uma vez em um substrato nomeado, ponderada pelo número esperado de execuções.

<div id="33-why-database-functional-state-machine" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Por que "máquina de estado funcional de banco de dados"

Uma estrutura relacional finita é uma instância de banco de dados, então um estado de Gurevich é um banco de dados e cada passo é uma transação limitada. *Banco de dados*: $S$ é uma estrutura relacional. *Funcional*: $\delta$ e $\lambda$ são puros. *Máquina de estado*: as execuções são pastas de $\delta$ sobre eventos. Moseley e Marks traçam a mesma linha na arquitetura [13]. A origem de eventos a traça na estado de aplicação: "Capture all changes to an application state as a sequence of events" [14]. Dedalus a traça na lógica, onde o estado mutável é uma relação indexada pelo tempo [15].
<div id="34-propositions" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Proposições

**Proposição 1 (a Forma captura cada algoritmo sequencial).** Para cada algoritmo sequencial $A$ existe uma instância de Forma $P$ cujas execuções são as execuções de $A$.

*Esboço da demonstração.* O Teorema 6.13 fornece uma ASM $B$ com os estados, estados iniciais e mapa de um passo de $A$. Defina $E = \{\varepsilon\}$, $\delta(s, \varepsilon) = \tau_B(s)$, $D = (s_0, \varepsilon^n)$ e $\lambda$ como a identidade. O fold após $n$ ticks é $\tau_A^n(s_0)$. Pelo Corolário 3.3 de Gurevich, $P$ e $A$ têm as mesmas execuções. ∎

**Proposição 1b (programas interativos).** Estenda $\Sigma$ com um conjunto de símbolos de entrada nário para $e$ antes de cada passo; então $\delta(s, e) = \tau(s[\mathit{in} := e])$ é um algoritmo sequencial sobre o vocabulário estendido, e a Proposição 1 se aplica. A construção é nossa.

**Proposição 1c (computabilidade).** Sob o axioma de Dershowitz e Gurevich, cada instância de Forma computa uma função computável por Turing [4, 16, 17]. A Forma não adiciona poder. Ela dá a cada programa na classe uma forma.

**Proposição 1d (provas são ajustes).** "Para cada prova de uma proposição dada, existe um programa do tipo correspondente" [18]. Um tipo é uma especificação e uma prova é um ajuste que atende a ela. A porta de correção é a existência dessa prova ou de um teste de aceitação bem-sucedido.

**Proposição 2 (um gerador).** Uma função $G : \mathrm{Fit} \to \mathrm{Program}$ gera um programa executável para cada ajuste e não lê nenhum domínio. *Base:* cada programa é uma instância de Forma, então $G$ emite um armazenamento tipado, um tipo de evento, regras compiladas, um log com um fold e um despachante de saída. Scaffolders como geradores de Rails, JHipster e Yeoman são $G$ restringidos a pequenos idiomas de ajuste. A engenharia de linha de produtos começa com "a descoberta sistemática e exploração da comumidade entre sistemas de software relacionados" [8]; a comumidade é a Forma.

**Proposição 3 (extração de menor energia).** A extração com $\mathrm{cost}_J$ retorna o termo de menor joule que o extrator encontra na classe $e$ de $F$. *Esboço da demonstração.* As reescritas são sólidas, então cada termo na classe $e$ tem o comportamento observável de $F$ e passa pela mesma porta. A extração minimiza o custo, e o custo é joules. ∎ Isso é a Mistura de Limites aplicada ao código. Mistura de Limites, Parte II do artigo complementar [Portas de confirmação medidas](/papers/gates/), afirma que uma tarefa precisa de uma energia mínima esperada para fechar e que a energia gasta após a conclusão da tarefa não compra progresso verificado; aplicado ao código, diz: mantenha o termo mínimo que realiza a tarefa, e o resto é desperdício.

**Proposição 4 (determinismo da reprodução).** Se $\delta$ não lê o relógio de parede, ordena as atualizações sem nomes e loga cada entrada, duas reproduções de um $D$ dão hashes de estado idênticos em cada passo.

**Proposição 5 (projeção do statechart é sólida).** Projete cada estado de uma execução sobre $\Sigma_c$. O resultado é uma execução do statechart emitido sob os mesmos eventos.

**Proposição 6 (orçamento de coordenação).** Regras marcadas como monotônicas executam em réplicas sem coordenação; apenas regras não monotônicas precisam de um ponto de coordenação. *Base:* o teorema CALM, "os programas que têm implementações distribuídas consistentes e sem coordenação são exatamente os programas que podem ser expressos em lógica monotônica" [19].

O Apêndice D.5 da especificação deriva a tag da regra, nunca de uma declaração, e tem a verificação do IR do perfil do motor recusar uma Forma cuja tag armazenada difere da derivada:

| A regra tem | Tag | Motivo |
|---|---|---|
| nenhuma resolução, leitura, junção ou varredura | monotônica | suas escritas apenas adicionam chaves e crescem contadores |
| uma resolução | não monotônica | ela deleta linhas de escalonamento |
| uma leitura de seu próprio sumidouro | não monotônica | leitura, modificação, escrita |
| uma junção com chave | não monotônica | a linha unida pode estar ausente agora e presente depois, ou sobrescrita |
| uma varredura | não monotônica | ela observa a relação inteira, incluindo o que está ausente |

A tag é sólida, mas não completa: uma junção contra uma relação apenas de inserção seria monotônica, mas o perfil não prova que uma relação é apenas de inserção, então a tag não afirma isso. Uma Forma é sem coordenação quando todas as regras são monotônicas. Cada leitura, junção e varredura vê o estado no momento da entrada do evento, então o estado pós-execução de um evento de entrada não depende da ordem em que as regras para diferentes sumidouros executam; apenas a ordem de saída importa, e ela é fixada pelo hash de conteúdo.

**Proposição 7 (inteligência como derivada de joule).** Seja $X$ a contagem de tarefas através da porta e $J$ os joules gastos. $\iota = dX/dJ$ é lida em retrospectiva de $D$, que registra cada evento, e, no design do motor, de seus recibos ([§4.4](#44-receipts)), cada um dos quais carrega o `est_j` de uma chamada de engrenagem. A extração sob $\mathrm{cost}_J$ mantém a porta fixa e não aumenta $J$, então, com $X$ igual, não diminui $\iota$.

<div id="35-graph-e-graph-and-statechart" class="anchor-alias" aria-hidden="true"></div>

### 3.5 Grafo, e-grafo e statechart

| Estrutura | Parte da Forma | O que decide |
|---|---|---|
| Statechart | Guardas de $\delta$ sobre $\Sigma_c$ | Qual transição dispara |
| Grafo de fluxo de dados | Dependências de leitura e escrita de $\delta$ e $\lambda$ (redes de processos de Kahn [20]) | O que executa e em que ordem |
| E-grafo | A classe de equivalência do ajuste | Qual ajuste equivalente executa |

O statechart e o grafo descrevem um ajuste. O e-grafo descreve cada ajuste equivalente a ele. A extração escolhe entre eles com base em joules.
<div id="36-one-ecosystem-lossless-and-the-universality-thesis" class="anchor-alias" aria-hidden="true"></div>

### 3.6 Uma ecossistema, sem perdas, e a tese da universalidade

**Sem perdas por construção.** O teorema da codificação de fonte de Shannon fixa o limite inferior para um código sem perdas no entropia da fonte [40]. Uma Forma é um código sem perdas para a intenção em um sentido estreito que pode ser verificado: a serialização canônica da Forma é injetiva, então duas Formas que diferem em qualquer estado, evento ou transição têm hashes de forma diferentes, e decodificando a serialização se obtém a mesma Forma. No design, cada projeção para um alvo é uma função da Forma sozinha; os emissores de hoje leem o programa verificado em vez disso ([§4.5](#45-the-compilers)). Transformações bidirecionais tornam a ida e volta precisa. Foster, Greenwald, Moore, Pierce e Schmitt definem uma lente como um par de funções get e put com condições de ida e volta que fazem uma visão e sua fonte concordarem [122], Hofmann, Pierce e Wagner estendem as condições para lentes simétricas [123], e Czarnecki e colegas revisam as mesmas condições de consistência em engenharia de modelos, bancos de dados e linguagens de programação [124]. A condição de ida e volta do RCE é a condição GetPut no nível do programa inteiro: eleve uma projeção de volta e o hash de forma não muda.

**Correta por construção.** Dijkstra propôs em 1968 que um programa e sua prova fossem desenvolvidos juntos, de forma que a correção fosse projetada em vez de testada [125]. Hall e Chapman levaram a abordagem para um sistema seguro comercial com especificação formal e refinamento em cada passo [126]. A regra de Minsky para programação funcional tipada, tornar estados ilegais inrepresentáveis, diz a mesma coisa no nível de tipo: um tipo que não pode conter um valor ruim remove a necessidade de verificá-lo [127]. O programação funcional total de Turner exige que cada função termine em cada entrada, de forma que um programa denota uma função matemática sem falha oculta [128]. A Forma do RCE é total no sentido de Turner, seus tipos de contrato tornam estados não declarados inrepresentáveis no sentido de Minsky, e a cadeia de refinamento de [§2.1](#21-programming-is-coding-theory) termina com ela no sentido de Dijkstra. A consequência é a declarada em [§1](#1-thesis): o que um programa faz é o que sua Forma declara, então não há nada para diferenciar ou rastrear depois disso.

**A tese da universalidade.** Enunciada em termos teóricos, a tese é que existe uma Forma universal. Programas são escritos nativamente nela, cada linguagem existente é alcançável a partir dela como uma projeção fiel, e cada programa existente entra nela por meio de elevação. A tese de Gurevich fornece a base: cada algoritmo sequencial é capturado, passo a passo, por uma Máquina de Estado Abstrato no seu próprio nível de abstração [2], e algoritmos paralelos da mesma forma [3]. Uma Forma é tal máquina sobre um estado de banco de dados.

**Proposição U1 (captura).** Se um programa em uma linguagem $L$ é um algoritmo sequencial ou paralelo no sentido de Gurevich, então existe uma Forma cuja transição simula-o passo a passo no nível de abstração do programa [2, 3].

**Proposição U2 (projeção fiel).** Se a projeção $\pi_L$ de uma Forma para $L$ preserva a trajetória da Forma em cada entrada no contrato, então a Forma e sua projeção são intercambiáveis para cada observador da trajetória, e $L$ não adiciona nada que a Forma não tenha.

**Proposição U3 (elevação por construção).** Cada linguagem de programação em uso tem uma gramática formal, um analisador que produz uma árvore de sintaxe concreta, uma árvore de sintaxe abstrata e uma semântica fixada por sua especificação ou implementação de referência. Uma elevação $\lambda_L$ é construída por linguagem em três etapas: a gramática, depois a árvore de sintaxe abstrata, depois a Forma, com cada construção de $L$ recebendo sua regra de Forma pela semântica de $L$. Uma elevação assim construída satisfaz $\pi_L(\lambda_L(p)) \equiv p$ no comportamento e $\lambda_L(\pi_L(F)) = F$ no hash de forma, então o par é uma lente no sentido de [122], e um programa em $L$ é mantido como uma Forma sem perdas.

**Proposição U4 (substituição).** Se U2 e U3 se mantêm para a linguagem $L$, então nenhum programa precisa ser escrito em $L$: ele é escrito uma vez como uma Forma e emitido como $L$ onde uma plataforma o exige.

**Cada linguagem como alvo e fonte: o design.** A Forma não impõe limites aos alvos, e o RCE foi projetado para elevar cada linguagem para a Forma e emitir cada linguagem a partir dela. O design é a proposta [`spec/proposals/rce-form.md`](https://github.com/openIE-dev/rce/blob/main/spec/proposals/rce-form.md) do repositório de especificações. Ele fixa uma codificação da Forma, `rce-form/1`, que eleva e emite compartilham, e trata uma linguagem como dados: uma gramática fixa, uma tabela de elevação que mapeia a sintaxe da linguagem para a codificação, uma tabela de impressão que imprime a codificação como o texto da linguagem, e uma biblioteca de tempo de execução que declara os valores e operações embutidas da linguagem exatamente. Uma elevação é aceita por comparação exata com a própria implementação da linguagem, e uma emissão por comparação exata da saída do programa emitido, executada sob a própria construção da linguagem, com uma escada de níveis de aceitação de 0 (a linguagem tem uma linha, com um identificador de um catálogo público como o Histórico das Linguagens de Programação ou GitHub Linguist, na própria linguagem de registro da proposta) através de 4 (em um corpus fixo, cada caso concorda byte por byte ou é mantido pela elevação ou pela emissão com uma razão nomeada, pelo menos um caso concorda, nenhum difere, e nenhum caso elevado é mantido por um limite de recursos) e 5 (elevação e emissão formando uma lente sobre esse corpus) até 6 (concordância com uma segunda implementação independente, ou com o próprio conjunto de testes da linguagem composto por pelo menos 30% do corpus), e um nível é publicado apenas com as contagens da execução que o atingiu. A proposta se baseia em três anteriores: o registro de emissão (`spec/proposals/emit-targets.md`), cujas camadas listam os sistemas, plataformas, linguagens dinâmicas e não-von-Neumann a seguir, incluindo os novos entrantes de 2024 a 2026 catalogados em [§3.7](#37-the-language-one-text-costs-and-theorem-status); um emissor com uma tabela de impressão por linguagem (`spec/proposals/one-emitter.md`); e como a Forma mantém o que lhe é oferecido (`spec/proposals/compliance.md`). Na codificação, cada definição de um programa é nomeada pelo hash de seus bytes, e seu corpo é um gráfico sobre cinco tipos de nós (Bind, Apply, Branch, Iterate e Halt), que mantêm os números lhes dados pelo núcleo do flowG ([openIE-dev/flow-g](https://github.com/openIE-dev/flow-g)), seu vocabulário de 22 primitivas e 11 tipos de fio; flowG é a primeira passada do projeto sobre uma forma compartilhada entre intenção e silício e o pai do RCE. O design não foi construído: a proposta afirma que nada nele foi construído e que nenhuma linha de sua camada de forma existe, e o núcleo tipado que seus impressores leriam existe apenas em uma branch de desenvolvimento do repositório. O que existe hoje é mais estreito. O verificador de referência emite Rust, Python, JavaScript e Scala por meio de quatro emissores manualmente escritos que traduzem a árvore de sintaxe verificada de um programa, não a Forma ([§4.5](#45-the-compilers)). A única elevação de outra linguagem no repositório público é a sonda `spec/lift/go/lift_go.py`, que eleva um padrão Go (uma estrutura com um método de receptor de ponteiro por evento, guardas que retornam um erro, e atribuições de campo) para uma Forma; em seu único exemplo, uma porta, a Forma elevada tem os mesmos estados de controle e transições que uma Forma manualmente escrita da mesma porta quando as duas declaram seus erros na mesma ordem. Sob `lang/`, o repositório também mantém, nos formatos de arquivo por linguagem da proposta, oráculos fixos e corpora registrados para Go 1.24, Python 3.13 e JavaScript (ECMAScript 2020) contra os quais uma elevação seria julgada; nenhum elevador existe, como [sua leia-me](https://github.com/openIE-dev/rce/blob/main/lang/README.md) afirma.

U1 é um teorema. U2 é verificada para Rust, Python e JavaScript pelos testes dos emissores de programa ([§5.1](#51-differential-testing-of-the-program-emitters)), ainda não se mantém para Scala, e será verificada para N grande sob o protocolo de [§2.3](#23-the-ecosystem-at-large-n). U3 é uma construção a ser construída linguagem por linguagem a partir da gramática; um padrão Go é elevado por uma sonda pública hoje, e [§8.7](#87-lift-coverage-across-languages) afirma como a construção é medida enquanto é construída.

**Duas qualificações.** A elevação de U3 é uma construção, e seu domínio é menor do que a frase acima sugere. A Forma exige que cada programa termine (T2), então a elevação de qualquer linguagem Turing-completa é no máximo um mapa do fragmento terminante dessa linguagem, e a pertencimento a esse fragmento é indeterminável (teorema de Rice aplicado a um alvo total [141]). No fragmento terminante a elevação ainda não é canônica: representação de fechamento, que sub-termos tornam-se estados de controle, e ordem de avaliação são escolhas livres, e o inverso existe apenas para programas em forma defuncionalizada [142, 143]. Então $\lambda_L$ é uma construção sobre a imagem de um mapa parcial cujo domínio é indeterminável, as condições de ida e volta da lente se mantêm sobre essa imagem, e "cada programa existente entra nela por meio de elevação" é uma afirmação sobre o fragmento que a construção alcança, medida como [§8.7](#87-lift-coverage-across-languages) a mede. A segunda qualificação diz respeito ao hash sobre o qual a afirmação de injetividade é feita. A especificação 6.1 hash as formas posicionais do estado e do evento (regiões e campos como listas na ordem de declaração, uma variante por seu índice, um evento por seu índice entre os eventos do módulo); a entrada armazenada mantém seu legível `event` e `state`, e uma trajetória repete as formas hashadas sob `hashed` (formato de trajetória `rce-trace/2`). O módulo Lean `RCE/NameFree.lean` hash as chaves de De Bruijn, e `RCE/Positional.lean` modela a embutida posicional (registros de tipos declarados como listas de campos na ordem de declaração, variantes como índice e campos, eventos por índice, registros não declarados por nome) e prova que ela não muda sob qualquer renomeação que seja injetiva e fixe nomes não declarados, que é o que a projeção sem nome realiza, então o hash de estado e a cadeia inteira de entradas não mudam para cada função de hash; o índice de evento que ele hash é, por definição, o índice de declaração do modelo de De Bruijn, então as duas codificações concordam sobre o componente que compartilham. O verificador de referência e os runtimes de Python, JavaScript e Rust concordam sobre os hashes, e um teste verifica que um programa e sua projeção sem nome têm os mesmos hashes de log, como T7 afirma; no commit público `f2bd7222`, que adiciona `RCE/Positional.lean`, a auditoria passa com 5.052 teoremas com axiomas padrão apenas. Um verificador de referência anterior hash a JSON canônica nomeada, então seus hashes de log dependiam de nomes enquanto os do modelo não; o registro de propostas da especificação registra essa descoberta, o teste que a demonstrou e sua resolução como um erratum sob C.15 (a entrada de log está fora do significado de um programa), com os fixos de trajetória, aplicações de ouro, 130 pinos de conformidade e os vetores de alimentação da biblioteca padrão regenerados.
<div id="37-the-language-one-text-costs-and-theorem-status" class="anchor-alias" aria-hidden="true"></div>

### 3.7 A linguagem: um texto, custos e status dos teoremas

A linguagem RCE é definida por uma especificação escrita ([/rce/spec/](/rce/spec/); código fonte no [repositório rce](https://github.com/openIE-dev/rce)). Há uma única linguagem, o texto da especificação em um commit, e cada módulo de um programa está nela (especificação 2.7). As Seções 2 a 10 definem o núcleo; o Apêndice C define a concorrência (`par`, `for ... par`, `with budget`, grupos de trabalho, LVars, sessões e supervisores) e aplica-se a cada módulo; o Apêndice D define o perfil do motor: as especificações e ajustes do design do motor. Nenhuma declaração seleciona um dialeto: um comentário de primeira linha `# rce-version:` é um rótulo de liberação que nomeia o commit da especificação contra o qual um módulo foi escrito, é ignorado pelo verificador e não é hashado, e uma construção que o verificador não implementa é recusada como reservada, não implementada (W-RES-1, Apêndice F.12). A linguagem está em desenvolvimento e muda conforme formas melhores são encontradas: uma forma pode ser adicionada, generalizada ou substituída, e a mudança e cada programa do repositório que ela toca se movem juntos em um commit, nunca como uma escolha por módulo, então um programa nunca depende da versão de outro programa ou biblioteca: tudo verificado em um commit concorda com a especificação nesse commit.

**Por que um único texto e nenhuma seleção de versão.** O registro sobre versionamento apoia essa regra em vez da seleção por módulo que os rascunhos anteriores tinham. A resolução de dependências com uma versão por pacote e restrições arbitrárias é NP-completo, estabelecido para distribuições Linux [176], reafirmado em 2020 para cada modelo de componente não trivial [177] e provado independentemente para gerenciadores de pacotes de linguagem por redução de 3-SAT [178]. Um número de versão semântica não carrega a promessa que faz: cerca de um terço das liberações do Maven Central ao longo de sete anos introduziu uma mudança quebradora, em liberações menores e de correção com a mesma frequência que em maiores [179], uma replicação em 119.879 atualizações ainda encontrou 20,1% das liberações não principais quebradoras [180], e o texto de engenharia da Google conclui que o versionamento semântico é uma resumo perdido do risco de adotar uma mudança e mantém uma versão de tudo em um repositório [181]. A exposição é uma propriedade do gráfico transitivo: para mais de 80% dos 35.863 artefatos do Maven afetados pela vulnerabilidade Log4j, a dependência era mais de um nível profundo [182]. Onde o registro converge é na identidade derivada do conteúdo, de forma que duas coisas diferentes nunca compartilham um nome e variantes coexistem [183, 184], na mudança por acréscimo sob nomes que nunca são reutilizados [185], e em uma prova direta de que uma mudança preservou o comportamento em vez de um número que afirma [186]; o design de hardware executou tal prova, verificação de equivalência, como a porta em cada revisão por duas décadas [187], e builds reprodutíveis vinculam um artefato ao seu código fonte por seu hash [188]. O design RCE toma cada um desses como uma regra: um texto em um commit, hashes de definição com uma tabela de compatibilidade fechada (F.4.3), um manifesto que fixa por hash sem resolver (F.5.3), hashes de log sem nome (T7) e comportamento como o único sentido de dois programas serem os mesmos ([§3.8](#38-behaviour-equivalence-and-dimension)). A pesquisa de 24 de outubro de 2026 que lê o registro contra essas regras, com as lacunas que ele lista (um hash de programa completo, a verificação de equivalência executada como uma porta em cada mudança, proveniência no código emitido), está no repositório de dados ([/data/](/data/#rce)) e sua proposta é `spec/proposals/one-commit-change.md`.

**Orçamentos contam com o trabalho.** Um bloco `with budget` cobra cada operação um custo fixo da tabela do Apêndice C.6.4 e trava com `budget` quando a contagem se esgota. A contagem é um proxy para o trabalho, não uma medição de tempo ou energia; `est_j` é separado.

| Operação | Custo |
|---|---|
| chamada de uma função do usuário ou de um fechamento, $c_{call}$ | 4 |
| método da biblioteca padrão no receptor de tamanho $n$, tamanho do primeiro argumento $k$ | $4 + w(m, n, k)$ |
| envio ou recebimento de canal | 8 |
| `spawn` | 32 |
| uma `par` branch ou `for ... par` chunk | 16 |
| lista ou mapa literal, ou compreensão, com $n$ resultados; `[x; n]` | $4 + n$ |
| índice, fatia, acesso a membro; operadores unários; `and`, `or`; operadores e comparações de inteiro, bool e texto | 1 |
| float `+`, `-`, `*` | 2 |
| float `/`, `%` | 8 |

Tamanhos são o comprimento em bytes UTF-8 de um texto, o comprimento de uma lista e o número de entradas de um mapa; qualquer outro valor tem tamanho 0. O trabalho do método $w$ é fixado pela classe de complexidade do método no avaliador de referência: $n + k$ para os métodos lineares em texto, listas e mapas (mapas são listas de associação ordenadas), $n \lceil \log_2 n \rceil$ para `sort` (0 quando $n \le 1$), e 0 para os métodos restantes. As chamadas que `map`, `filter` e `fold` fazem ao seu argumento de função são cobradas como chamadas adicionais. A aritmética saturada no maior inteiro de 128 bits, e $w$ nunca diminui quando $n$ ou $k$ cresce. O avaliador de referência e os tempos de execução emitidos de Rust, Python e JavaScript calculam a mesma função, e um teste verifica que a armadilha de orçamento cai na mesma operação em todos os quatro.

**Uma regra de custo.** O custo de uma chamada de método da biblioteca padrão é o único custo do texto, em cada módulo e onde quer que a chamada seja executada (especificação 2.7, C.15). A regra é léxica ao texto, não ao módulo, então ligar módulos não muda nenhum custo; testes verificam em ambas as direções nas bordas dos módulos no avaliador de referência e nos programas emitidos de Rust, Python e JavaScript.

**Status dos teoremas.** A especificação afirma os teoremas T1 a T34 e registra o status de cada um exatamente. As provas estão no Lean 4 (v4.12.0, sem Mathlib) sobre um cálculo de núcleo. As palavras usadas para o nível de um resultado são estas. *Proved* significa uma prova Lean sobre a semântica de núcleo da linguagem. *Proved on a semantics* significa uma prova Lean sobre uma semântica de passo pequeno de um núcleo de RCE. *Model* significa uma prova Lean sobre um modelo abstrato que não está conectado à semântica RCE ou ao avaliador de referência. *Vectors* significa que os resultados do avaliador de referência em programas gerados são verificados contra o modelo pelo núcleo Lean, que é uma correspondência em amostras, não uma prova sobre o avaliador. *Tested* significa teste diferencial em entradas declaradas. *Checked mechanically* significa decidido por um programa, como um construtor de tabelas LALR(1).

| | Declaração | Nível |
|---|---|---|
| T1 | determinismo: um resultado por estado e evento; um resultado por tick da semântica de concorrência | provado |
| T2 | totalidade de $\delta$, com uma limitação explícita sobre os passos de avaliação; recursão estrutural e composição limitada ao longo do gráfico de chamadas | provado (o núcleo da expressão Lean não tem chamadas de funções do usuário; recursão e composição são provadas em modelos separados) |
| T3 | o estado de tempo de execução é $\mathrm{foldl}(\delta_1, s_0, D)$ e a reprodução reproduz cada hash e saída | provado |
| T4 | progresso, incluindo ticks (alguma tarefa se move, ou a execução termina ou relata `Deadlock`) | provado |
| T5 | preservação, incluindo o intervalo inteiro de cada campo escrito | provado |
| T6 | segurança de memória, caminhos completos de empréstimo, nenhuma partilha mutável entre tarefas | provado para o núcleo de propriedade e uma semântica instrumentada de caminhos de empréstimo |
| T7 | independência de nome de hashes de log, ids e escolhas de seleção | provado |
| T8 | atomicidade: um evento recusado deixa o estado inalterado | provado |
| T9-L | os emissores de programa (`rust`, `python`, `js`) concordam com o avaliador de referência | provado para o emissor de Rust em um núcleo, como uma tradução verificada para MiniRust, uma embutida profunda do subconjunto de Rust emitido; que `rustc` implementa MiniRust é confiável e testado; os outros emissores testados |
| T10 | a gramática é ambígua | verificado mecanicamente (LALR(1), 0 conflitos, para ambas as versões) e amostrado por um fuzzer |
| T11 | justiça de seleção | provado no modelo de rotação |
| T12 | um handle linear é consumido exatamente uma vez em cada caminho | provado em um modelo de declaração |
| T13 | operações f32 dão os mesmos bits em alvos que concordam com IEEE 754 | provado para multiplicação; para adição, subtração e divisão a propriedade de arredondamento único é o teorema de Figueroa, citado e não mecanizado |
| T14 | aritmética verificada u64 é exata no intervalo | provado |
| T15 | iteradores terminam, respeitam o limite da loop e são prefix-consistentes | provado |
| T16 a T31 | concorrência do Apêndice C: determinismo de `par`, comutação, reduções, liberdade de deadlock, prazos, grupos de trabalho, relógios vetoriais, prioridades, escopos, atores, sessões, LVars, lotes atômicos, réplicas | provado em uma semântica: T16, T17, T19a, T20, T23; provado em um modelo de execuções: T24; provado em um cálculo de sessão: T28; modelo: T18, T19b, T21, T22, T25, T26, T31; modelo com vetores: T27, T29, T30. Nenhum é uma prova sobre o avaliador de referência de Rust |
| T32 | reprodução estrangeira: para cada oráculo, a reprodução do log é igual à execução viva, e um contrato de resposta se mantém para cada resposta registrada | provado |
| T33 | `&mut` restaura em caso de falha (F.4.4): uma chamada falha deixa o estado `&mut` do chamador como no chamado; uma chamada que retorna escreve de volta (a regra anterior de cópia de saída em cada resultado é aposentada) | provado |
| T34 | a passagem de forma preservando a ordem (ANF) antes de cada emissor dá o mesmo valor, armazenamento e traço de custos e emissões | provado para um fragmento de núcleo com ANF completo; a implementação é testada diferencialmente nos alvos Rust, Python e JavaScript, incluindo uma varredura de orçamentos ao longo do ponto de armadilha; a saída de Scala passa pela mesma passagem, mas não está nesses testes |

T9-L é a afirmação sobre os emissores de programas da linguagem, que [§5.1](#51-differential-testing-of-the-program-emitters) descreve; um alvo fora desse conjunto não tem nenhuma afirmação T9. A especificação também afirma T9-F, para os alvos do compilador de Form do motor, e [§10](#10-work-to-finish) lista seu teste.

![Grade de 34 entradas, T1 a T34 com T9 mostrado como T9-L e T19 dividido em T19a e T19b, cada um com um nível codificado. Proved: T1, T2, T3, T4, T5, T7, T8, T14, T15, T32, T33; Proved para um núcleo ou fragmento declarado; resto testado ou citado: T6, T9-L, T13, T34; Proved em uma semântica de passo pequeno de um núcleo de RCE: T16, T17, T19a, T20, T23; Proved em um modelo nomeado (modelo de rotação, modelo de declaração, modelo de execuções, cálculo de sessão): T11, T12, T24, T28; Modelo: T18, T19b, T21, T22, T25, T26, T31; Modelo, com vetores do avaliador verificados pelo núcleo Lean: T27, T29, T30; Verificado mecanicamente (tabelas LALR(1)): T10.](/figures/rce/theorem-status.svg)

*Figura 3. Status dos teoremas, T1 a T34. Nível de cada teorema conforme registrado na especificação no commit público `ac95172` (rascunho 0.7); teoremas adicionados após T34 não são mostrados, e T9 é mostrado como T9-L, a afirmação sobre os emissores de programas. `P`: prova Lean sobre a semântica de núcleo. `P*`: provado para um núcleo ou fragmento declarado, o resto testado ou citado. `S`: provado em uma semântica de passo pequeno de um núcleo de RCE. `M+`: provado em um modelo nomeado (modelo de rotação, modelo de declaração, modelo de execuções, cálculo de sessão). `M`: prova Lean sobre um modelo abstrato. `MV`: modelo, com vetores do avaliador de referência verificados pelo núcleo Lean. `C`: verificado mecanicamente. T16 a T31 são os teoremas de concorrência do Apêndice C, e nenhum é uma prova sobre o avaliador de referência de Rust. Lean 4 v4.12.0, sem Mathlib. Fonte: `spec/book/10-theorems.md` e Apêndice C.13. Uma [cópia PNG](/figures/rce/theorem-status.png) está disponível.*

**Verificações executadas.** No commit público `e416fd0`, `lake build` completa sobre os 58 arquivos de `spec/lean/RCE/` sem `sorry` (46 arquivos no commit público `4304048`), e o relatório de auditoria contínua afirma que os axiomas de 4.877 constantes de teoremas são apenas `propext`, `Quot.sound` e `Classical.choice`. A auditoria conta cada constante de teorema no ambiente do núcleo, incluindo constantes geradas pelo elaborador, então difere da contagem de declarações `theorem` e `lemma` no código fonte, que é 1.116 no mesmo commit. No mesmo commit, a fonte do verificador de referência contém 385 funções de teste. No commit público `ac95172`, a verificação da especificação constrói as tabelas LALR(1) da gramática do núcleo (seções 2 a 10, 932 estados) e da gramática com o Apêndice C (1.110 estados) com 0 conflitos, aceita 51 de 51 exemplos válidos, recusa 12 de 12 rejeições sintáticas e 64 de 64 programas mal tipados ou inadmissíveis, e analisa cada exemplo com três analisadores, e a construção WebAssembly do verificador passa 401 de 401 verificações contra os corpora de exemplos.

**Uma observação de convergência.** Duas varreduras de 24 de outubro de 2026 catalogaram 111 linguagens de programação primeiramente tornadas públicas entre janeiro de 2024 e outubro de 2026 [189, 190]: 72 projetadas para modelos de linguagem ou agentes como autores ou implementadas principalmente por um agente (48 da catalogação agentlanguages.dev [166], lida no seu repositório de fonte, e 24 além disso), e 39 linguagens gerais ou de sistemas, com 35 linguagens pré-2024 atingindo uma marca na janela. Entre os entrantes de autorização de máquina, a contagem por ano é 3, 10 e 57 para 2024, 2025 e 2026. Dois posicionamentos são quase universais: recusa de entrada inválida em uma fronteira (54 de 72) e emissão para outra linguagem (57 de 72; 17 de 39 entrantes gerais, com Go como alvo de 2026 e C como padrão de sistemas). Minorias adotam uma forma canônica (25 de 72), exemplos ou testes dentro do programa (21 de 72; 2 de 39), uma especificação escrita como definição autoritativa (16 de 72; 14 de 39), avaliação determinística como uma porta declarada (13 de 72; 3 de 39, entre eles Gossamer, Dawn e Wyzer) e segurança de memória sem coletor (8 de 72; 7 de 39, convergindo para contagem de referência precisa ou propriedade de posse em vez de anotações de tempo de vida, com pilhas de dados de Goose sendo a exceção [191]). Um log apenas de adição com reprodução (5 de 72; nenhuma de 39) e definições identificadas por hash (2 de 72; 3 de 39, Bend, Scrapscript e Dawn [192]) são raros, e uma forma intermediária como fonte de verdade está ausente das novas linguagens de propósito geral. Uma tendência distinta de 2025 e 2026 é linguagens cujos compiladores foram escritos principalmente por agentes de modelo e divulgados como tais, entre eles Goose, Rue, Cursed e Jolt, cujas afirmações de desempenho são auto-relatadas. As escolhas de design deste artigo, portanto, se repetem onde são baratas (um resultado declarado para cada entrada na fronteira, impressão para uma linguagem de hospedagem) e permanecem raras onde são teoremas aqui (uma forma canônica, exemplos como parte do programa, reprodução de um log encadeado por hash, identidade sem nome). Esta é uma observação de que escolhas se repetem e onde; não é evidência de que sejam corretas, e este artigo não faz comparação de qualidade com esses projetos. A proposta de registro de emissão do repositório de especificação lista cada entrante como um alvo e uma fonte sob os mesmos termos de cada outra linguagem; nenhum deles é elevado ou emitido hoje ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)).
<div id="38-behaviour-equivalence-and-dimension" class="anchor-alias" aria-hidden="true"></div>

### 3.8 Comportamento, equivalência e dimensão

A definição 3 diz que dois ajustes são equivalentes quando suas sequências de saída concordam em cada sequência de eventos. Esta seção dá a essa definição uma propriedade universal, define a dimensão de um programa como um número calculado e relata as medições registradas dele. O texto normativo é a seção 6.10 da especificação (rascunho 0.9, commit `45fc95c`), com os teoremas T57 a T61 e o comando `rce dim`.

**Comportamento como um ponto na coalgebra final.** Fixe um programa $P$ com espaço de estados $S$, alfabeto de eventos $E$ e $\delta : S \times E \to S \times O^*$, e escreva $\delta_1 = \pi_1 \circ \delta$ e $\lambda = \pi_2 \circ \delta$ como na definição 1. O comportamento de um estado $s$ é a função $\mathrm{beh}_P(s) : E^* \to (O^*)^*$ com $\mathrm{beh}_P(s)(\varepsilon) = \varepsilon$ e $\mathrm{beh}_P(s)(e \cdot w) = \lambda(s, e) \cdot \mathrm{beh}_P(\delta_1(s, e))(w)$: as saídas por passo ao longo de qualquer sequência de eventos. $(S, \langle \lambda, \delta_1 \rangle)$ é uma coalgebra do functor $F(X) = (O^* \times X)^E$; $F$ tem uma coalgebra final $\mathrm{Beh}$ cujo portador é o conjunto das funções de stream causais, e $\mathrm{beh}_P$ é a única morfismo de coalgebra $S \to \mathrm{Beh}$ (Rutten [144], Teorema 2.3). Dois ajustes são equivalentes, $F \equiv G$, quando $\mathrm{beh}_F(s_0^F) = \mathrm{beh}_G(s_0^G)$. Isso é a definição 3 reafirmada; o novo conteúdo é que $\equiv$ é a igualdade em um objeto que cada Forma, em cada linguagem de ajuste, mapeia por meio da mesma construção. O espaço de comportamento não é uma variedade: ele carrega a métrica ultramétrica prefixo $d(b_1, b_2) = 2^{-n}$, $n$ o comprimento da sequência de eventos discriminante mais curta, sob a qual ele é completo e totalmente desconectado [145]. A concordância de rastreamento em cada sequência de comprimento no máximo $k$ portanto certifica $d \le 2^{-(k+1)}$: uma bola em torno do comportamento, não o comportamento. É o que os testes diferenciais de [§5.1](#51-differential-testing-of-the-program-emitters) estabelecem, e ele nunca entra em um hash.

**Dois métodos de prova.** Uma relação $R \subseteq S \times S$ é uma bisimulação para $P$ quando $s\,R\,t$ implica, para cada $e$, $\lambda(s, e) = \lambda(t, e)$ e $\delta_1(s, e)\,R\,\delta_1(t, e)$. T58 afirma que $\mathrm{beh}_P(s) = \mathrm{beh}_P(t)$ se e somente se alguma bisimulação relaciona $s$ e $t$: para mostrar dois ajustes equivalentes, exiba a relação; para mostrá-los diferentes, exiba uma sequência discriminante, que também dá a distância. T1 e T2 (totalidade e determinismo) são exatamente a completude e o determinismo que tornam a máquina mínima única; uma máquina mal especificada não tem mínimo único [146].

**Dimensão.** $\mathrm{reach}(P)$ é o conjunto de estados alcançáveis a partir de $s_0$; é finito porque $S$ é finito sob os limites de valor e tamanho da especificação (N9). A dimensão de $P$ é

$$\dim(P) = |\{\mathrm{beh}_P(s) : s \in \mathrm{reach}(P)\}|,$$

o número de comportamentos distintos $P$ pode ter, que é o índice de Nerode da sua máquina de Mealy mínima [147], computável para um alfabeto explícito em $n \log n$ [148]. $\log_2 \dim(P)$ é os bits de estado que o comportamento precisa; $\log_2 |\mathrm{reach}(P)| - \log_2 \dim(P)$ é a *redundância* do ajuste, os bits de estado que não alteram nenhuma saída futura. Uma dimensão de controle $\dim_c(P) \le \dim(P)$ é definida na projeção que substitui cada guarda sobre $\Sigma_d$ por seu símbolo de predicado, um autômato finito simbólico [149], e sua máquina mínima, numerada por uma travessia em largura primeiro na ordem de evento canônica, tem uma string única sem nome [150]; seu SHA-256 sobre JSON canônico é `shape_ctl`, uma terceira chave ao lado do hash do termo sem nome e da chave e-classe da definição 6. A igualdade em qualquer chave implica equivalência; a desigualdade implica nada.

O que é e o que não é um teorema aqui deve ser dito claramente. $S$ e $E$ são finitos pelos limites de valor e astronomicamente grandes: $|S| \le 256^{\mathrm{VALUE\_LIMIT}}$ por campo, então a finitude torna cada pergunta comportamental decidível e nenhuma delas tratável. A máquina mínima é uma forma canônica para a projeção de controle finito, onde a minimização de autômatos simbólicos é única até a equivalência de predicado [149]; para campos que são apenas comparados e copiados, autômatos de registro dão um teorema de Myhill-Nerode [151]; o momento $\delta$ faz aritmética inteira no estado, o único objeto canônico é o próprio termo. "Cada Forma é uma máquina de Mealy finita, e sua máquina mínima é sua forma canônica" é portanto verdadeira como declarada para $\Sigma_c$ mais predicados de guarda e não é uma afirmação computável para $\Sigma_d$. Isso também é a leitura honesta da proposição 3: a extração de menor joule retorna o termo de menor joule *que o extrator encontra*, e três funções distintas são definidas em uma e-classe: as unidades de orçamento sem visão de alvo da especificação C.6, que colocam o armadilha de orçamento na mesma operação em cada runtime e nunca são joules; `est_j`, que é por alvo ([§6.3](#63-energy)); e o representante hashado, escolhido por custo de árvore com um empate canônico-JSON para reprodutibilidade. O termo emitido e o termo hashado de uma e-classe podem diferir; nenhum pode diferir entre motores dados o mesmo log.

**Status dos teoremas.** T57 (finalidade: $\mathrm{beh}_P$ é o único morfismo de coalgebra), T58 (equivalência é bisimilaridade), T59 (acordo de rastreamento até o comprimento $k$ limita a distância por $2^{-(k+1)}$), T60 (para $S$ finito, o quociente de $\mathrm{reach}(P)$ pela maior bisimulação é a máquina mínima, com $\dim(P)$ estados) e T61 (`shape_ctl` é invariante sob renomeação e sob reescrita de predicados equivalentes de guardas) são declarados no capítulo 10 da especificação, e `spec/lean/RCE/Behaviour.lean` está em `lake build` (Lean 4.12.0; no commit público `f2bd7222`, `scripts/lean-audit.sh` lê 5,052 teoremas com axiomas padrão apenas e sem `sorry`). O que é provado, no escopo exato do capítulo: a equação do morfismo de T57 (`beh_cons`; a unicidade do morfismo é declarada, não provada); T58 para um programa e para dois (`bisim_beh`, `beh_bisim`, `behEq_iff_bisim`, `bisim2_beh`, `beh_bisim2`); e T59 em ambas as direções sobre um alfabeto finito explícito, os eventos declarados sobre os conjuntos de limites que `rce dim` explora (`trace_ball`, `ball_trace`), com a declaração sobre todos de $E$ declarada, não provada. T60 é declarada, com uma prova de modelo por refinamento de partição como próximo passo. T61 é testada apenas para renomeação, contra a projeção sem nome `rce fmt --nameless`, que imprime um programa com nomes posicionais por tipo na ordem de declaração primeira e é aceito sempre que a fonte é, com os mesmos hashes de rastreamento por T7; sua invariância sob reescrita de guardas é declarada, não provada, e o quociente simbólico não é implementado.

**`rce equiv`: a verificação de equivalência como ferramenta.** `rce equiv A B` explora dois programas a partir de seus estados iniciais sobre as mesmas instâncias de evento, compara cada passo por sua saída sem nome (valores emitidos na forma posicional, uma recusa pelo índice de declaração do erro, T7), refina os dois gráficos juntos e lê se os dois estados iniciais caem em uma classe (T58); quando não caem, imprime a sequência de evento discriminante mais curta e as duas saídas no final. `rce change OLD NEW` combina isso com a diferença de exportação de F.4.3 e classifica uma mudança como um erratum (cada exportação compatível, cada comportamento mantido), uma mudança de significado ou uma mudança de interface, que é a regra de C.15 decidida pela ferramenta. Executado entre cada programa do corpus e sua projeção sem nome como um passo de integração contínua, a verificação encontrou um programa cuja projeção foi recusada (um campo de estado nomeado como um método da biblioteca padrão renomeou o método); a projeção foi corrigida e a varredura relata cada Forma do corpus equivalente à sua projeção, como T7 afirma. É a versão da verificação de equivalência do Forma que o design de hardware executa em cada revisão ([§3.7](#37-the-language-one-text-costs-and-theorem-status)): uma mudança sob a qual cada programa mantém seu comportamento é um erratum, qualquer outra é uma mudança de significado, decidida pela ferramenta e não por um número de versão. Com `rce hash`, que imprime um hash do programa sobre a projeção sem nome (um hash para um programa e seu renome, um diferente para um passo alterado), e a linha de origem que cada arquivo emitido agora carrega, as três mecanismos que o registro chama raro em novas linguagens (seção 3.7) são comandos do verificador de referência.

**`rce dim`, e as execuções registradas.** `rce dim FILE [--fuel n] [--control]` explora $\mathrm{reach}(P)$ em largura primeiro sobre os eventos declarados com payloads extraídos de cada tipo de refinamento de campo ou, sem um, do conjunto de limites da especificação 6.3, até `--fuel` estados, depois executa o refinamento de partição de Hopcroft com as saídas como a partição inicial (100.000 estados em 10 a 40 s; a primeira iteração de Moore foi quadrática e não terminou), e relata estados explorados, comportamentos (exatos quando o limite não é atingido, caso contrário um limite inferior), redundância em bits por região, e com `--control` os estados de controle e `shape_ctl`. Três exemplos foram escritos com valores conhecidos: um contador com uma bandeira não lida (1,00 bit de redundância), um contador mod-6 que emite paridade (1,58 bits) e uma porta com três estados alcançáveis e nenhuma redundância. A preregistro (`openie-research-experiments/rce/bench/dimension/PREREG.json`, registrado em 22 de outubro de 2026 antes do comando ter sido construído e modificado antes de cada execução posterior, com um sidecar hashado) fixa as populações e três hipóteses sobre programas limitados cujos passos explorados emitem ou recusam: H0, que pelo menos metade deles carrega mais de 0,5 bit de redundância; H1, que um programa com um local de emissão carrega mais redundância que um programa com vários; e H2, que uma região carrega pelo menos 80% da redundância quando excede 1 bit. Seu falsificador é RCE-F6 de [§9](#9-falsifiers), uma redundância mediana abaixo de 0,1 bit. As execuções relatadas aqui, `dim-r2` a `dim-r5`, foram feitas uma vez cada com `--fuel 100000 --control`, contra uma construção de um commit público de openIE-dev/rce, com o hash binário registrado em cada linha; a primeira execução registrada, `dim-r1`, e o piloto antes dela estão listados em [§10](#10-work-to-finish). O rótulo de controle é a recusa ou os construtores emitidos apenas, e $\dim_c \le \dim$ se mantém em cada linha dessas execuções. Em uma máquina de estado cujos exemplos leem estado ela nunca emite, a intenção é carregada pelos exemplos e por nenhuma saída; um relatório de `rce check` que nomeia tal `exemplo` (um que lê um campo que nenhum passo jamais emite ou recusa) é uma proposta aberta.

**As execuções congeladas.** A execução `dim-r2` de 23 de outubro de 2026 (commit `1107442b` de openIE-dev/rce, registrada como uma segunda emenda da mesma preregistro antes da execução, com a camada lida da chave que `rce dim` relatou como `observable` nesse commit, agora `has_output`) amostra a camada que emite por regra: cada programa do repositório mesclado sob seus exemplos, programas, aplicações e listagens de livro que é aceito sozinho, tem uma região de estado e contém uma emissão ou uma declaração de falha. Isso é 25 programas, 24 deles com saída, 14 limitados a 100.000 estados. Entre eles, `ring_buffer` tem 12.500 estados alcançáveis, 781 comportamentos e cinco estados de controle; quatro bits de seu estado não alteram nenhuma saída, todos em uma região, e sua projeção de controle, que registra apenas quais passos disparam, tem cinco estados. Excluindo os três programas escritos para `rce dim` e suas cópias no livro, restam 8 programas de saída limitados, dos quais 6 carregam mais de 0,5 bit (intervalo de Wilson 95% 0,41 a 0,93), com uma redundância mediana de 1,79 bits (intervalo interquartil 0,25 a 3,37); sobre todos os 14, 10 de 14 (0,45 a 0,88) e uma mediana de 1,29 bits. RCE-F6 (uma mediana abaixo de 0,1 bit) não é acionado; a extremidade inferior do intervalo está abaixo da metade, então H0 é apoiada e não estabelecida nesse tamanho. H1 não é apoiada (os dois programas com um local de emissão carregam 1,58 e 4,00 bits, os dois programas com múltiplos locais de emissão 2,51 e 3,65), e H2 se mantém em 8 de 9 linhas qualificadas apenas porque 8 têm uma região de estado; o um programa com duas regiões atribui 62% de sua redundância à sua região maior. A adição substancial da execução é três medições de tamanho de aplicação. A aplicação de chat explora 100.000 estados com 176 comportamentos e 69 estados de controle, então pelo menos 9,15 bits de seu estado não alteram nenhuma saída, a maior redundância medida e um limite inferior; a unidade de encaminhamento seletivo (40.218 estados, 7.038 comportamentos, 2,51 bits) e o terminal (3.390 estados, 270 comportamentos, 3,65 bits) são exatos. A razão entre estados de controle e comportamentos varia por uma ordem de magnitude na população (5 a 781 para o buffer de anel, 69 a 176 para o chat, 5.095 a 7.038 para a unidade de encaminhamento), que mede quão muito do comportamento de um programa é quais passos disparam contra quais valores fluem. A execução também mostra que a camada precisa de uma regra registrada mais fina: a bandeira da ferramenta é verdadeira para um programa cuja cada saída é a mesma (uma constante, ou uma recusa que cada estado dá), então uma terceira execução deve registrar "com saída, com mais de uma saída distinta" antes de amostrar. Linhas, intervalos e a emenda estão no repositório de experimentos sob `rce/bench/dimension/` (`results/dim-r2.jsonl`, `RESULTS.md`). Uma terceira execução, `dim-r3` (23 de outubro de 2026, registrada antes dela), aplicou a regra mais fina que a segunda execução pediu: `rce dim` relata o número de saídas distintas (`distinct_outputs`; valores emitidos e recusas contados separadamente como `emits` e `refuses`), e a camada é com saída com pelo menos duas delas. Em 28 programas (a população da segunda execução mais as três programas aceitos com duas ou mais regiões de estado), 22 são estritamente com saída e 12 desses são limitados; a redundância mediana é 1,29 bits (8 de 12 acima de 0,5 bit, Wilson 0,39 a 0,86), e 2,05 bits sobre os 6 não escritos para a ferramenta. Os três programas que a regra mais fina removeu (um termostato, um reconciliador e um carrinho) são observáveis apenas por uma constante, então as medianas da segunda execução contaram bits que alteram uma saída que nunca altera de fato. H2 é testado onde pode, no único programa estritamente com saída com múltiplas regiões acima de 1 bit, cuja região maior carrega 62%, abaixo do limiar de 80%; ele permanece aberto em uma linha. Uma quarta execução sobre os 86 programas de conformidade com estado (registrada antes dela) mediu os cinco programas de contrato de hospedeiro colhidos pela primeira vez, todos limitados dentro do combustível e carregando de 0,01 bit (o motorista de terminal) a 2,16 bits (o motorista de canal) com quocientes de controle em milhares, e respondeu à pergunta de múltiplas regiões para este corpus: os únicos programas estritamente com saída com múltiplas regiões são cópias distinguidas por dados de um exemplo de capacidade, então H2 não pode ser decidido a partir de material público existente e o próximo passo é autorizar programas observáveis com múltiplas regiões, registrados como uma população antes da execução. Esse passo foi tomado em 24 de outubro de 2026: doze programas com duas regiões (um elevador, uma máquina de venda, uma passagem, um estacionamento, uma impressora, um lobby, uma cartão bancário, uma lavadora, uma sessão, um jogador, um controlador climático e um reservatório) foram escritos no corpus de programas e registrados como a quinta execução, com a divulgação de que a ferramenta foi executada nos rascunhos. Todos os doze são estritamente com saída, limitados e explorados em milissegundos; onze têm zero redundância e o décimo segundo, o controlador climático, mantém 1,58 bits em duas bandeiras que registram sua última ação e que nada lê. A mediana é 0,00 bits, então RCE-F6 é acionado nesta população: o estado acidental não é comum em pequenos Forms cujos caps são impostos por recusas e cujas fases emitem. Lido com as execuções anteriores (1,29 bits sobre os exemplos estritamente com saída manual, 0,01 a 2,16 bits para os programas de hospedeiro, pelo menos 9 bits para a aplicação de chat), a quantidade cresce com o tamanho do programa e com o número de campos que nada lê. A reivindicação que os dados apoiam é a própria do falsificador: `rce dim` é um diagnóstico para programas maiores e para regiões adicionadas sem um observador, não uma propriedade de pequenos Forms em geral.

**O registro do conceito.** A especificação 6.6 agora descreve uma tabela lateral não hashada indexada pelas chaves sem nome de um programa e mantendo seus nomes, strings de intenção e comentários de documentação, e `rce emit form` imprime-a sob `names`, indexada pelo índice de declaração (o índice que `shape_ctl` usa), após os campos hashados. Projeções renderizam-a; $\delta$ nunca a lê; é o complemento que torna a projeção de um Forma um lente simétrico [123] e não uma retração. A evidência de [§2.1](#21-programming-is-coding-theory) diz que a tabela deve conter o conceito que um nome representa e não apenas sua ortografia, porque escolha de palavras e ordem são os dois passos em que os desenvolvedores discordam em 6,9% [137] e o passo em que concordam é o conceito. Se um modelo pode raciocinar do Forma com o registro anexado tanto quanto da superfície nomeada é o primeiro dos três experimentos registrados de [§12.3](#123-why-human-written-code-is-redundant) e está aberto.
<div id="4-the-engine-gears-gate-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## 4. O motor: engrenagens, porta e recibos

Esta seção descreve o design do motor, que o Apêndice D da especificação e suas propostas definem.

<div id="41-the-engine-is-a-form" class="anchor-alias" aria-hidden="true"></div>

### 4.1 O motor é uma Forma

O RCE executa software como um gráfico de manipuladores determinísticos pequenos. Um manipulador que não pode decidir levanta uma escalada. Um resolutor responde à escalada uma vez, e a resposta é instalada como um manipulador permanente, então o próximo caso da mesma forma é executado sem resolutor. O design exige que o motor atenda a cada invariante da Forma:

| Invariante | O que o design exige do motor |
|---|---|
| Recarregar é uma dobra verificada | Recarregar lê o log literalmente, recalcula cada hash e link, e dobra o resto com $\delta$. Nada é re-estampado. Uma cadeia quebrada recusa-se a carregar. |
| Ordem de tick sem nome | Os manipuladores executam na ordem de classificação topológica, depois por uma chave de nó sem nome. As saídas são estagiadas e entregues após todos os manipuladores executarem, como na semântica ASM. Renomear cada nó dá o mesmo hash de estado anônimo em cada entrada. |
| Nenhuma queda silenciosa | Um correio eletrônico completo mantém a mensagem em uma fila ordenada e loga `Backpressure`, e cada tarefa ainda fecha. |
| Payloads estão no log | Entradas, ticks, resultados de manipuladores externos, instalações e falhas são entradas no log. O hash de estado após cada entrada corresponde a uma dobra a partir de um motor vazio. |
| Relógio lógico | Contagem de vida conta ticks, não tempo de parede. |
| Hashes estáveis | SHA-256 (Algoritmo de Hash Seguro, 256-bit) sobre JSON canônico, chaves ordenadas em cada profundidade, para entradas, estados, formas e ids de regras. |

<div id="42-the-gears" class="anchor-alias" aria-hidden="true"></div>

### 4.2 As engrenagens

Cada engrenagem é tentada apenas quando a engrenagem abaixo não passa pela porta. Essa ordem é uma cascata fixa.

| Engrenagem | Método | Linhagem |
|---|---|---|
| G0 Lookup | Uma biblioteca compartilhada de manipuladores indexada por hash SHA-256 da forma; para reparo de código, localização em funções classificadas | Busca e recuperação de código [21] |
| G1 Regras | Modelos determinísticos, modelos de reparo protegidos e validadores derivados de esquema, cada um verificado para sensibilidade à mutação | PAR, TBar, AVATAR, FixMiner [22, 23, 24, 25]; codemods como Coccinelle [26] |
| G2 Síntese | Enumeração sobre a gramática do manipulador, solvers e e-grafs | Sketching, SyGuS, egg [27, 9, 12] |
| G3 a G5 Modelos | Um modelo de decisão tipado, um modelo local pequeno, depois um modelo remoto, último | Cascadas de modelos [28] |

<div id="43-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 A porta

Um candidato é promovido apenas quando passa pela porta. A porta repete as entradas registradas do nó, executa o candidato em sombra em amostras frescas com um limite de cobertura (a regra dos três em um orçamento de erro declarado), verifica o esquema de saída e exige o certificado de prova da Seção 5. Um candidato rejeitado é registrado com seu contraexemplo.

![Diagrama. Quatro caixas de engrenagens empilhadas do mais barato ao mais caro: G0 Lookup, uma biblioteca compartilhada de manipuladores indexada por hash SHA-256 da forma; G1 Regras, modelos de reparo protegidos e validadores derivados de esquema; G2 Síntese, enumeração sobre a gramática do manipulador, solvers e e-grafs; G3 a G5 Modelos, um modelo de decisão tipado, um modelo local pequeno e um modelo remoto, marcados apenas como proponentes. Cada engrenagem envia seu candidato a uma porta com cinco verificações: repetição das entradas registradas, uma execução em sombra com um limite de cobertura, uma verificação do esquema de saída, o certificado da verificação de modelo do núcleo com Kani, um verificador de modelo para Rust, e para reescritas uma verificação aleatória seguida por uma prova com o solucionador Z3 SMT. Um passo promove o candidato a um manipulador armazenado, que alimenta G0; um fracasso é registrado com seu contraexemplo e escala para a próxima engrenagem.](/figures/rce/gears-gate.svg)

*Figura 4. Modelos propõem, verificadores decidem. Diagrama: as engrenagens executam na ordem de custo: G0 Lookup, G1 Regras, G2 Síntese, G3 a G5 Modelos (um modelo de decisão tipado, um modelo local pequeno, depois um modelo remoto). Cada candidato passa pela mesma porta: repetição das entradas registradas do nó, uma execução em sombra em amostras frescas com um limite de cobertura, uma verificação do esquema de saída e o certificado da verificação de modelo do núcleo com Kani, um verificador de modelo para Rust (Seção 5.3); uma reescrita proposta também precisa de uma verificação aleatória e depois uma prova com o solucionador Z3 SMT (Seção 5.2). Um candidato que passa é promovido e fecha a mesma forma em G0 na próxima vez; um que falha é registrado com seu contraexemplo e a próxima engrenagem é tentada. No design, os cabos Kani e a codificação SMT não mudam com a promoção. Fonte: Seções 2.2, 4.2, 4.3, 4.6, 5.2 a 5.5. Uma [cópia PNG](/figures/rce/gears-gate.png) está disponível.*
<div id="44-receipts" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Recibos

Todo promoção, recusa, adiamento e instalação é uma mutação em um log apenas-append encadeado com SHA-256, então manipular qualquer entrada passada quebra a cadeia [29, 30]. O custo de cada manipulador é precificado a partir de contagens de operações do interpretador com uma tabela de custos por host e rotulado `est_j`. O supervisor é o resolutor de escaladas do motor, que executa as engrenagens em ordem em cada uma, e cada uma de suas chamadas carrega um recibo. Um recibo nomeia a engrenagem, o método da estimativa (`basis`), os candidatos tentados e se a engrenagem resolveu a escalada. Seu campo `est_j` é obrigatório: é um número finito não negativo, ou nulo, e nulo é permitido apenas quando `basis` diz `unpriced`, como em uma chamada a modelo sem figura de energia. Um recibo com o campo ausente não é analisado. Um custo não precificado nunca é lido como zero, então um total sobre recibos relata suas invocações precificadas e não precificadas separadamente, e um economia que depende de uma resolução não precificada é relatada como desconhecida.

![Diagrama. Topo: três entradas de log, seq 0, 1 e 2, cada uma com campos seq, evento, prev_hash, state_hash e hash. O primeiro prev_hash é 64 zeros; cada prev_hash posterior é igual ao hash da entrada anterior, desenhado como setas. state_hash é o SHA-256 do estado após o passo; hash é o SHA-256 do JSON canônico de evento, prev_hash, seq e state_hash. Fundo: um recibo de engrenagem com campos gear, gear_name, est_j, basis, candidates_tried e resolved, ao lado da regra que est_j é obrigatório e é um número finito não negativo ou nulo, com nulo permitido apenas quando basis diz unpriced; custo não precificado nunca é lido como zero joules.](/figures/rce/receipt-chain.svg)

*Figura 5. O log é uma cadeia de hash; cada custo carrega uma base. Diagrama: entradas do log durável D são `{seq, evento, prev_hash, state_hash, hash}`. `state_hash` é o SHA-256 do JSON canônico do estado após o passo; `hash` é o SHA-256 do JSON canônico de `{evento, prev_hash, seq, state_hash}`; o primeiro `prev_hash` é 64 zeros, então alterar qualquer entrada passada altera cada hash posterior. Um recibo de engrenagem carrega `gear`, `gear_name`, `est_j`, `basis`, `candidates_tried` e `resolved`. `est_j` é obrigatório e é um número finito não negativo, ou nulo apenas quando `basis` diz unpriced; recibos de chamada a modelo carregam `est_uj` em microjoules sob a mesma regra. Um custo não precificado nunca é lido como 0 J. Rótulos de hash são simbólicos. Fonte: especificação 6.1 e Seção 4.4. Uma [cópia PNG](/figures/rce/receipt-chain.png) está disponível.*

<div id="45-the-form-compiler" class="anchor-alias" aria-hidden="true"></div>

<div id="45-the-compilers" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Os compiladores

O compilador da linguagem é o `rce emit TARGET FILE` do verificador de referência (especificação 10.5). Ele traduz um módulo que passa `rce check` para um dos cinco outputs: `form`, a Forma $P = (S, E, \delta, D, \lambda)$ como uma linha de JSON canônico, uma função determinística do texto do programa; e quatro programas, `rust` (um arquivo de fonte Rust), `python` (um arquivo Python 3), `js` (um módulo JavaScript para Node) e `scala` (um arquivo Scala 3 para a máquina virtual Java). Os emissores de programa traduzem o módulo verificado, não a Forma, e cada saída é autossuficiente. Cada alvo é gerado. Nenhum é escrito. Os quatro não estão no mesmo nível. No conjunto de conformidade do repositório da especificação (`conformance/reports/` no commit público `464bd98b`), as saídas Rust, Python e JavaScript passam cada uma 1.459 testes com 0 falhas, e os outros 520 não se aplicam a um emissor (admissão, o contrato do host, replicação e comandos de ferramentas). A saída Scala passa 52, falha 1.189 e tem 591 não suportados de 1.832 resultados; 1.186 das falhas são o build ou execução Scala saindo com status 2 em vez de um valor comparado, e esses resultados precedem a conversão do conjunto para as regras de um único idioma de [§3.7](#37-the-language-one-text-costs-and-theorem-status). Scala, portanto, é emitido, mas ainda não concorda com a referência, e não tem nenhuma reivindicação T9.

A especificação 6.3 corrige um comportamento em cada borda numérica, que cada alvo deve reproduzir: aritmética de inteiros verificada trava em overflow do tipo estático e nunca envolve; inteiro `/` trunca para zero ($-7/2 = -3$); `%` toma o sinal do dividendo ($-3 \bmod 2 = -1$); divisão por zero trava; floats são IEEE 754 binary64, arredondados corretamente uma vez por operador, e um resultado não finito trava; tempo é apenas o relógio lógico.

No design do motor, um segundo compilador reduz uma especificação de manipulador e seu ajuste através de um e-graph para uma IR Forma e projeta para alvos adicionais; seu teste está listado em [§10](#10-work-to-finish).
<div id="46-method-the-whole-stack-evaluated-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Método: toda a pilha avaliada, todas as suposições de interface explícitas

Um programa é uma pilha de níveis: texto fonte e instruções; manipuladores; a Forma, uma única função de passo $\delta : S \times E \to S \times O^*$ sobre $S = \Sigma_c \times \Sigma_d$ (regiões de controle; dados: o relógio, a contagem de entrada e relações tipadas); o log, uma cadeia de hashes SHA-256 cujas entradas registram cada evento, o hash do estado que produziu e o hash da entrada anterior; as reescritas que transformam a Forma; e o substrato que a executa. Cada nível descansa em suposições sobre o nível abaixo. No design, RCE trata nenhum nível como fixo: ele avalia toda a pilha, escreve cada suposição de interface como uma afirmação verificável e a verifica em cada execução. Hoje, as ferramentas públicas verificam a cadeia de log durante a reprodução (`rce host replay`) e comparam os programas emitidos em Rust, Python e JavaScript com o referencial; as outras verificações na tabela abaixo são design ([§5.2](#52-the-proof-rule-for-rewrites) até §5.4; para o contrato de entrada, [§10](#10-work-to-finish) item 15).

| Limites | Suposição | Verificação |
|---|---|---|
| fonte para manipulador | uma entrada satisfaz seu contrato de fonte | a verificação do contrato no evento de entrada de δ |
| manipulador para destino | cada saída Ok satisfaz o esquema de saída | prova do manipulador: avaliação pelo avaliador do núcleo, que o design exige ser total e determinístico e verifica com um verificador de modelos ([§5.3](#53-model-checking-of-the-kernel)) |
| log para estado | cada entrada carrega o hash do estado que produziu | dobra do núcleo, que recusa a primeira entrada cujo hash não corresponde ([§5.3](#53-model-checking-of-the-kernel)) |
| reescrita para Forma | uma reescrita preserva a saída para cada entrada | verificação aleatória, depois uma prova SMT ([§5.2](#52-the-proof-rule-for-rewrites)) |
| stub para foreman | um manipulador que não pode decidir escala em vez de escolher um resultado que não pode decidir | manipuladores stub emitem escalas; resoluções são promovidas apenas através do caminho de promoção |
| Forma para destino | cada destino emitido calcula o mesmo δ | as saídas do programa emitido e o hash da última entrada de seu log igualam o referencial; hoje isso vale no conjunto de conformidade para Rust, Python e JavaScript e não para Scala ([§4.5](#45-the-compilers)) |

Uma verificação falhada localiza a quebra no limite onde ocorre. A correção é feita nesse nível, passada pela verificação desse limite e promovida. Cada nível acima do corrigido herda a correção sem alterações adicionais, pois cada nível acima consome o nível corrigido apenas através da interface cuja suposição agora é verificada. É nesse sentido que as correções se propagam para cima e se compõem.

<div id="5-verification" class="anchor-alias" aria-hidden="true"></div>

## 5. Verificação

<div id="51-five-targets-one-trace" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-across-five-targets" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-of-the-program-emitters" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Teste diferencial dos emissores de programas

T9-L afirma que os emissores de programas `rust`, `python` e `js` concordam com o avaliador de referência. Para o emissor de Rust, é provado em um núcleo, como uma tradução verificada para MiniRust, uma embutida profunda do subconjunto de Rust emitido; que `rustc` implementa MiniRust é confiável e testado. Para os emissores de Python e JavaScript, é testado: a saída do programa emitido é igual às observações do avaliador de referência para cada linha do programa de exemplo (uma linha por constante, verificação, função sem argumentos, evento de exemplo e saída de `fn main`), e no conjunto de conformidade suas saídas e o hash da última entrada de seu log igualam o referencial. A trilha de referência completa de cada programa de exemplo, byte por byte, é a porta que a proposta de registro de emissão estabelece para cada linguagem ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). O emissor de Scala não tem uma reivindicação T9, e sua saída ainda não concorda com o referencial ([§4.5](#45-the-compilers)). O avaliador de referência e os runtimes emitidos de Rust, Python e JavaScript também calculam a mesma função de orçamento, e um teste verifica que a armadilha de orçamento cai na mesma operação em todos os quatro ([§3.7](#37-the-language-one-text-costs-and-theorem-status)); a passagem ANF que preserva a ordem antes de cada emissor é testada diferencialmente nos alvos Rust, Python e JavaScript, incluindo uma varredura de orçamentos através do ponto de armadilha (teorema T34). Isso é teste diferencial na linha de McKeeman e de Csmith [86]: concordância entre implementações independentes em um conjunto de entradas declarado. Não é validação de tradução [85], e fora do núcleo provado do emissor de Rust não é um compilador verificado. Não diz nada sobre entradas fora do conjunto testado.

<div id="52-rewrites-proved-in-z3" class="anchor-alias" aria-hidden="true"></div>

<div id="52-the-proof-rule-for-rewrites" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Regra de prova para reescritas

Regras de reescrita verificadas têm uma linhagem. Ruler infere e verifica regras de reescrita por saturação de igualdade sem modelo no loop [87]. A reescrita proposta pelo modelo mencionada na Seção 5.5 repete uma regra que o motor já tinha, então esse registro é uma afirmação sobre a porta, que recusou 15 das 18 propostas, e não uma reivindicação de que um modelo é uma boa fonte de regras.

No design do motor, cada reescrita de e-grafos deve ser provada no solver SMT Z3 [31] contra uma codificação sem quantificadores da avaliação de termos e aritmética da Forma: valores como um tipo de dados, vetores de bits de 64 bits com verificação de overflow, divisão e resto com sinal do dividendo e floats binários de 64 bits. Uma reescrita que muda overflow, ordem de escalonamento ou uma mensagem não recebe nenhuma prova. Uma equivalência proposta entra no e-grafos apenas com uma prova.
<div id="53-model-checking-of-the-kernel" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Verificação do modelo do núcleo

O design verifica o núcleo do motor (cadeia de hash, dobra, posições livres de nomes e avaliação do manipulador) com o verificador de modelos Kani para Rust [32]. A avaliação do manipulador é o ponto fixo de um passo não recursivo, então uma prova de que o passo é total e determinístico por construtor se aplica à avaliação por indução estrutural. O design nomeia dez propriedades, uma para cada suporte:

| Suporte | Propriedade |
|---|---|
| `chain_appended_verifies` | Uma cadeia de hash anexada verifica |
| `chain_detects_tampering` | Uma entrada alterada quebra a cadeia |
| `fold_equals_replay` | A dobra é igual à reprodução |
| `fold_rejects_wrong_state` | Uma dobra que discorda do estado armazenado é recusada |
| `position_is_name_independent` | As posições das regras não dependem dos nomes dos nós |
| `reason_tokens_are_name_independent` | Os motivos são livres de nomes por meio de tokens inteiros |
| `handler_core_leaves` | Manipuladores de folha são totais e determinísticos |
| `handler_core_validate` | A validação é total e determinística |
| `handler_core_pipeline` | Pipelines são totais e determinísticos |
| `handler_core_ifhas` | Guardas são totais e determinísticas |

<div id="54-promotion-gate-on-the-proof-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Porta de promoção no certificado da prova

No design, a execução da verificação do modelo escreve um certificado cujo hash é armazenado com o motor. O motor, o log, os ids das regras e a avaliação do manipulador passam pelo núcleo, e a promoção exige o certificado.

<div id="55-the-model-as-a-proposer-behind-the-check" class="anchor-alias" aria-hidden="true"></div>

### 5.5 O modelo como proponente atrás da verificação

Um modelo pode propor equivalências. Ele pode não aceitá-las. Um modelo local de 1,5 bilhão de parâmetros de codificação foi executado como proponente na especificação `orders-form`, e o registro público da execução ([`rce/bench/results/llm-proposer-form-demo.form.json`](https://github.com/openIE-dev/openie-research-experiments/blob/main/rce/bench/results/llm-proposer-form-demo.form.json)) contém 18 propostas, 13 delas distintas. O registro dá a origem de cada proposta apenas como `llm`; o modelo, Qwen2.5-Coder-1.5B sob o llama.cpp, é nomeado por este artigo e por nenhum registro público. A verificação recusou 15 propostas, 12 delas distintas: quatro que não são analisáveis, duas que colocam um valor onde um termo pertence, e nove comutacões de operadores aritméticos, cada uma recusada com um contra-exemplo no qual os dois lados falham de maneiras diferentes. As 3 que aceitou são uma reescrita, `(pipe pass ?a) => ?a`, sob três nomes, e essa reescrita repete uma regra que o motor já tinha. O registro mostra a porta recusando o que está errado; ele não mostra nenhuma nova regra do modelo.

<div id="6-lift-entering-the-ecosystem-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

## 6. Elevação: entrando no ecossistema a partir de outras linguagens

<div id="6-importing-legacy-code-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

A elevação foi projetada para ser a porta de entrada no ecossistema para códigos escritos em outros lugares. Ela será uma construção, feita por linguagem a partir de ferramentas que cada linguagem já possui: uma gramática formal, um analisador como [tree-sitter](https://tree-sitter.github.io/tree-sitter/) que produz a árvore de sintaxe, a árvore de sintaxe abstrata e os símbolos que as ferramentas do servidor de linguagem resolvem ([Language Server Protocol](https://microsoft.github.io/language-server-protocol/)). O perfil do motor especifica uma elevação, `rce scan DIR --form`, que constrói a Forma a partir dessa árvore para Rust, Python, TypeScript e Go e rotula cada elemento elevado como não provado (Apêndice D.8); nem essa elevação nem o motor são públicos, e nada no Apêndice D é verificado pelas ferramentas publicadas. O repositório público contém uma única elevação de verificação, `spec/lift/go/lift_go.py`, que eleva um padrão Go, e o design para elevar todas as linguagens, com os níveis nos quais uma elevação é aceita, é a proposta `spec/proposals/rce-form.md` ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). Um programa elevado carrega os defeitos de sua fonte, então a elevação inclui reparo, e o protocolo abaixo mede o reparo em corpora públicos de bugs com a localização dada.

<div id="60-the-repair-ladder-on-lifted-code" class="anchor-alias" aria-hidden="true"></div>
<div id="60-the-repair-ladder" class="anchor-alias" aria-hidden="true"></div>

### 6.0 A escada de reparos

<div id="23-per-rung-ladder-results" class="anchor-alias" aria-hidden="true"></div>

Uma tarefa de codificação é medida aqui pelos **bits de intenção** que ela precisa: os bits que devem ser fornecidos fora do que o motor já possui (o programa ao redor da edição, as bibliotecas, os testes, o índice de correções conhecidas). Escrevendo $H_{task}$ para os bits que fixam o artefato-alvo e $H_{corpus}$ para os bits que o corpus já corrige, os bits fornecidos são $I = H_{task} - H_{corpus}$. Uma engrenagem que classifica a edição correta em posição $r$ entre seus candidatos forneceu $\log_2 r$ bits de busca, e a porta fornece o restante. A escada ordena as tarefas pelo tamanho da edição, um proxy objetivo para $I$: um token (L0), uma instrução (L1), um bloco (L2), vários blocos em um único arquivo (L3), vários arquivos (L4), uma função de uma especificação ou testes (L5), uma alteração no nível de problema (L6) e um programa de uma especificação (L7). Os degraus, corpora, divisões e hipóteses são pré-registrados; os arquivos estão no [repositório público](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

L2 a L4 devem ser medidos em um conjunto reservado de Defects4J ([Seção 8.1](#81-defects4j)), e L5 a L7 sob os protocolos de [Seção 8.2](#82-swe-bench-lite-offline). O método e a porta de L0 e L1 seguem.

**Método.** Cada corpus é embaralhado com uma semente fixa. As primeiras 2.000 posições de cada embaralhamento, e para L0 três repositórios inteiros (commons-lang, requests, flask), formam a divisão de desenvolvimento, na qual as engrenagens podem ser ajustadas; os resultados de desenvolvimento não são relatados. Cada tarefa restante está na divisão de teste. Antes de uma execução de teste, o solucionador é confirmado e seu hash binário registrado, e nenhuma engrenagem muda durante a execução, então cada linha a ser relatada é um resultado de solucionador congelado em tarefas de teste apenas, com 0 chamadas ao modelo. O pré-registro (`PREREG.json`) e o script de relatório estão no [repositório público](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

**Porta.** Em L0 e L1 a localização é dada e a porta é identidade com os espaços em branco removidos: a linha ou instrução reparada, com todos os bytes de espaços em branco removidos, deve ser igual ao byte por byte do desenvolvedor. Isso é mais estrito do que passar os testes, porque um patch pode passar um conjunto de testes fraco e ainda estar errado. Qi e colegas encontraram que a maioria dos patches que GenProg relatou como correções eram plausíveis, mas incorretas [92]; o sobreajuste aos testes é documentado em reparos baseados em busca e baseados em semântica [93, 94] e abordado com testes gerados [95]; ferramentas pontuam mais alto no benchmark no qual foram ajustadas [96]; e vieses de localização de falhas afetam comparações [97]. Identidade com espaços em branco removidos fecha a lacuna de plausibilidade nestes degraus, e fornecer a localização remove o termo de localização, então a taxa mede apenas as engrenagens de reparo. L2 e acima usam os testes como porta e relatam contagens separadas de plausíveis e corretas (Seção 8.1).

<div id="61-l0-one-token-faults" class="anchor-alias" aria-hidden="true"></div>

### 6.1 L0: falhas de um token

O corpus L0 é cada mutante do estilo PIT [109] com um token de substituição válido em repositórios reais em commits fixos, cinco Java (commons-math, commons-collections, jsoup, joda-time, gson) e quatro Python (click, attrs, pydantic, sympy), com quatro repositórios nunca usados para ajuste (commons-text, commons-io, more-itertools, httpx) como um segundo conjunto de testes. Mutantes são um substituto para falhas reais de um token que Just e colegas encontraram estar acopladas a falhas reais [110]. Se o vizinhança que restaura uma falha de um token é construída a partir das mesmas tabelas de operadores que produziram os mutantes, uma taxa alta reflete parcialmente essa sobreposição e não a capacidade de reparo em falhas que ocorrem na prática. Uma busca simples de inversão de operador, executada nos mesmos mutantes, é a linha de base que mostra quanta taxa a sobreposição explica, e uma taxa L0 é lida ao lado dela.

<div id="62-l1-one-statement-bugs-from-real-histories" class="anchor-alias" aria-hidden="true"></div>

### 6.2 L1: bugs de uma instrução de histórias reais

L1 usa dois conjuntos de dados públicos de correções reais de uma instrução minerados de histórias de código aberto: ManySStuBs4J 2.0 [107] para Java e TSSB-3M v1.0.0 [108], shard 14 e 15, para Python. O solucionador recebe ou apenas o bloco de 7 linhas ou o arquivo inteiro no commit pai, com índices dos métodos do projeto e condições de proteção, e os dois são relatados como linhas separadas. Esses conjuntos de dados não têm uma liderança de reparo publicada sob essa porta (apenas bloco, identidade com espaços em branco removidos, localização dada), então nenhum número de reparo aprendido é colocado ao lado deles; Defects4J, que tem uma, é comparado com TBar na Seção 8.1.
<div id="63-energy" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Energia

Sob o protocolo, cada linha da escada carrega `est_j`, um modelo de segundos de unidade central de processamento (CPU) vezes 10 W, não uma medição, e uma subsample é lida no Running Average Power Limit (RAPL) [105], o contador de pacote no chip do processador, como `reported_j`: o delta do pacote ao longo de toda a execução, menos a potência ociosa de uma amostra coletada imediatamente antes, vezes a duração da execução. `measured_j`, um medidor de parede em uma via nomeada, segue o protocolo da Seção 8.3.

**Dois regimes e um vetor calibrado.** A estimativa acima, segundos de CPU vezes 10 W, é uma tabela de substrato e não consegue distinguir entre alvos, então a extração de menor joule nunca escolhe um alvo. A literatura sobre medições diz como a correção deve parecer. Em um núcleo em ordem, joules são lineares na contagem de operações: um modelo com seis contadores no Cortex-M0 atinge R² ≈ 0.99 e um erro absoluto médio de 2.8 a 4.3%, com coeficientes como 0.96 nJ por instrução e 2.1 nJ por ramificação tomada [152]. Em um núcleo fora de ordem o modelo colapsa no tempo: com um núcleo fixado e turbo desligado, um Xeon Gold 6430 consumiu 189.8 ± 0.5 W em todas as implementações e benchmarks de replicação de linguagem-energia, e a classificação que colocava Python em 75.88 vezes C desapareceu uma vez que a escolha da biblioteca, paralelismo, aquecimento e bugs de medição foram controlados [153]. Os próprios contadores têm valor desigual: Intel RAPL prevê a potência da tomada com um erro absoluto médio de 1.8% uma vez que a DRAM é incluída, mas atualizações ocorrem a cada milissegundo e desviaram 10 a 12% com a temperatura do pacote em uma geração [105]; pesquisando-o mais rápido que 10 ms produz até 50% de leituras desatualizadas [154]; NVIDIA's NVML amostra cerca de um quarto do tempo de execução e execuções simples erraram até 70% contra um medidor externo [155]. O metro de unidade estilo gás correlaciona-se com o tempo da CPU apenas com Pearson ≈ 0.51 no Ethereum [156], então "a energia escala com as operações contadas" é uma suposição que a subsample `reported_j` tem que testar. Uma proposta para a especificação mantém três objetos separados: as unidades de orçamento C.6 permanecem determinísticas, cegas para alvos e no log; `est_j` torna-se $\langle \mathrm{count}(\mathit{term}), E[\mathit{target}] \rangle$ mais potência ociosa vezes tempo no regime A (microcontroladores, canais de array de porta programável de campo (FPGA), núcleos em ordem) e $P_{\mathrm{active}} \cdot t + E_{\mathrm{llc}} \cdot \mathit{misses}$ no regime B (CPUs fora de ordem e unidades de processamento gráfico (GPUs)); e o vetor de coeficiente $E[\mathit{target}]$ é uma entrada de log `host.Calibrated` com seu protocolo, contagem de amostras e erro padrão por coeficiente, escrita por `rce host calibrate` sob um protocolo normativo (pelo menos 30 pares A/B intercalados contra a linha de base ociosa, blocos de pelo menos 60 s ou $10^9$ operações, aquecimento descartado, temperatura registrada, bruto e líquido reportados, o medidor nomeado com sua referência de validação, RAPL amostrado não mais rápido que 10 ms), de modo que a extração sob `est_j` é uma função do log e reexecuções. Recibos ganham um hash `calibration` e um `stale_fraction`, a parcela das operações de um passo sem linha calibrada, valorado `unpriced`; totais mantêm as quatro etiquetas em colunas separadas. O falsificador é RCE-F5 em [§9](#9-falsifiers). A primeira calibração a executar é a escada de energia KV260 em sua via de núcleo com $N \ge 30$, que transforma o substituto `E_LUT_READ = 1e-12` da especificação em um coeficiente com um erro padrão.
<div id="7-reuse-evidence" class="anchor-alias" aria-hidden="true"></div>

## 7. Reutilização de evidências

A posição do RCE no eixo de reutilização baseia-se em um fato de engenharia: o código é reutilizado em todas as escalas. Cada método abaixo o mede de forma diferente.

| Método | Fonte | Encontrado |
|---|---|---|
| Mapeamento de clones no nível de arquivo | DéjàVu, Lopes et al. 2017 [33] | De 428 milhões de arquivos em 4,5 milhões de projetos não-fork no GitHub, 85 milhões são únicos: "70% do código no GitHub consiste em clones de arquivos criados anteriormente." Em JavaScript, 6% dos arquivos são distintos. |
| Redundância no nível de linha | Gabel e Su 2010 [34] | Contra 420 milhões de linhas, "entre 50% e 100% de cada projeto é redundante" em cerca de uma linha. |
| Modelos linguísticos estatísticos | Hindle et al. 2012 [35] | O código é "muito repetitivo, e de fato ainda mais do que línguas naturais." |
| Deduplicação quase total do corpus | The Stack [36] | A deduplicação quase total remove 54,7% da versão 1 do The Stack (6,4 TB para 2,9 TB) e 52,4% da versão 2 (67,5 TB para 32,1 TB). |
| Preservação de todo o arquivo | Software Heritage [129, 130] | 30,3 bilhões de conteúdos de arquivos únicos de 448 milhões de origens (contadores do arquivamento, lidos em 13 de outubro de 2026), cada um armazenado uma vez pelo hash de seus bytes. |
| Padrões de correção minerados | PAR, TBar [22, 23] | O PAR encontrou "vários padrões comuns de correção" em mais de 60.000 patches humanos. As 15 categorias de padrões do TBar corrigem corretamente 43 bugs do Defects4J no pipeline padrão, e 74 de 101 com localização perfeita de falhas, sem aprendizado. Esses são os números lidos em [23]; o significado dos 101 (patches plausíveis ou bugs tentados) não foi reverificado contra esse artigo aqui, então trate a proporção como não confirmada. |
| Tarefas translinguísticas | Rosetta Code [131] | 1.360 tarefas (e 421 tarefas em rascunho), cada uma implementada em conceito em muitas das 1.009 linguagens conhecidas. |

![Cinco painéis pequenos, cada um com sua própria unidade. Lopes et al. 2017: de 428 milhões de arquivos em 4,5 milhões de projetos não-fork no GitHub, 85 milhões são únicos, com a citação de que 70% do código no GitHub consiste em clones de arquivos criados anteriormente. Gabel e Su 2010: entre 50% e 100% de cada projeto é redundante em cerca de uma linha, contra 420 milhões de linhas. The Stack: a deduplicação quase total remove 54,7% da versão 1, 6,4 TB para 2,9 TB, e 52,4% da versão 2, 67,5 TB para 32,1 TB. Software Heritage: 30,3 bilhões de conteúdos de arquivos únicos de 448 milhões de origens, contadores do arquivamento lidos em 13 de outubro de 2026, cada um armazenado uma vez pelo hash de seus bytes. PAR encontrou vários padrões comuns de correção em mais de 60.000 patches humanos; TBar corrige corretamente 43 bugs do Defects4J no pipeline padrão e 74 de 101 com localização perfeita de falhas.](/figures/rce/reuse.svg)

*Figura 6. O código é reutilizado em todas as escalas. Dados: cinco medidas de reutilização, cada uma em sua própria unidade; os painéis não são comparáveis entre si. Mapeamento de clones no nível de arquivo (Lopes et al. 2017 [33]): de 428 milhões de arquivos em 4,5 milhões de projetos não-fork no GitHub, 85 milhões são únicos. Redundância no nível de linha (Gabel e Su 2010 [34]): entre 50% e 100% de cada projeto é redundante em cerca de uma linha, contra 420 milhões de linhas. Deduplicação quase total do corpus (The Stack [36]): 54,7% removidos da versão 1 (6,4 TB para 2,9 TB) e 52,4% da versão 2 (67,5 TB para 32,1 TB). Software Heritage [129, 130]: 30,3 bilhões de conteúdos de arquivos únicos de 448 milhões de origens (contadores do arquivamento lidos em 13 de outubro de 2026), cada um armazenado uma vez pelo hash de seus bytes. Padrões de correção minerados (PAR [22], TBar [23]): PAR encontrou padrões comuns de correção em mais de 60.000 patches humanos; TBar corrige corretamente 43 bugs do Defects4J no pipeline padrão e 74 de 101 com localização perfeita de falhas. Valores conforme a tabela acima. Uma cópia [PNG](/figures/rce/reuse.png) está disponível.*

Cada linha é uma entrada para o motor. Clones e dedup dizem que uma solução geralmente existe, que é G0. Correções recorrentes dizem que a adaptação é principalmente um catálogo pequeno de reescritas protegidas, que é G1. A redundância no nível de linha reduz o espaço de busca de G2. A escada de reparo da Seção 6 é o protocolo que mede isso em escala em divisões reservadas. Duas advertências aprimoram a leitura. Duplicatas inflam a recuperação e as pontuações do modelo a menos que sejam removidas [104]. E linhas com bugs são menos naturais do que as corrigidas [45], então o próprio bug é o caso de busca que menos consegue prever; a forma da correção, e não a linha com bug, é o que G0 e G1 devem se basear. A linha de mineração de regras que faz isso em escala, desde a busca gerar-e-validar do GenProg [88] e o modelo de correção aprendido do Prophet [89] até o Getafix no Facebook [90] e a correção sem modelo de violações de análise estática do Sorald [91], deriva templates de história disjunta e relata precisão em casos não vistos [98]. Isso é o padrão adotado na Seção 8.4.

<div id="8-measurement-protocols-for-what-comes-next" class="anchor-alias" aria-hidden="true"></div>

## 8. Protocolos de medição para o que vem a seguir

Cada protocolo é fixado antes de sua execução: compromisso de preregistro, sementes e commit do solver registrados, cada artefato mantido. Porta primeiro, joules segundo, rótulos sempre.

<div id="81-defects4j" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Defects4J

Defects4J possui 854 bugs ativos reais de Java, cada um com testes de reprodução [37].

1. Desenvolva em um subconjunto de 100 bugs, offline, através de `defects4j checkout`; relate apenas resultados reservados, em um conjunto disjunto extraído dos bugs ativos por uma regra semeada registrada antes da execução, que exclui o subconjunto de desenvolvimento e cada bug já executado com qualquer engrenagem, e congelado antes da execução.
2. Execute G0, depois G1, depois G2, depois um modelo local por último. Registre a engrenagem que fechou cada bug.
3. Porta: os testes de disparo e o conjunto completo passam. Relate contagens plausíveis e corretas separadamente; correto significa equivalente ao patch do desenvolvedor na revisão.
4. Relate chamadas ao modelo por correção correta e joules por correção correta, rotulados.
5. Pontos de referência: as 43 correções corretas do TBar e suas 74 de 101 sob localização perfeita (números lidos de [23], com o denominador não reverificado aqui). Esta seção é um protocolo. Nenhum resultado do Defects4J deste motor é relatado neste artigo.
6. Verificação de contaminação: marque cada bug cuja correção aparece literalmente no índice do G0, e relate com e sem bugs marcados.
<div id="82-swe-bench-lite-offline" class="anchor-alias" aria-hidden="true"></div>

### 8.2 SWE-bench Lite, offline

SWE-bench Lite é um subconjunto de 300 tarefas de problemas reais do GitHub resolvidos por testes ocultos [38].

1. Use o harness oficial do Docker sem rede.
2. Primeira execução: apenas G0 e G1, zero chamadas ao modelo. Isso é o piso de resolver sem um modelo.
3. Segunda execução: adicione um modelo local como a última engrenagem.
4. Relate a taxa de resolução, chamadas ao modelo por tarefa resolvida e joules por tarefa resolvida, rotuladas.
5. Verificação de contaminação conforme em 8.1. SWE-Bench+ descobriu que 32,67% dos patches bem-sucedidos tinham a solução no texto do problema [39].

<div id="83-a-wall-meter" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Um medidor de parede

1. Conecte um medidor de parede ou um medidor de derivação na alimentação do host, registrado a uma taxa declarada com seu relógio sincronizado ao log de execução.
2. Máquina ociosa: os runners de CI e outros builds são interrompidos, e uma porta de janela silenciosa é verificada antes de cada bloco e registrada.
3. Subtraia uma linha de base ociosa medida e declare o método.
4. Preencha `measured_j` apenas com o medidor. Relate `reported_j` (RAPL) e `est_j` ao lado dele em colunas separadas. Nunca some entre rótulos.
5. Execute a subsample do RAPL da escada (Seção 6.3) sob o medidor, depois o conjunto reservado de Defects4J.

<div id="84-a-held-out-run-with-the-gears-frozen" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Uma execução reservada com as engrenagens congeladas

Este é o método da Seção 6, estendido para novos corpora.

1. Congele G0, G1 e G2 em um commit com marcação, registre o hash binário e publique o conjunto de regras com seus timestamps de autoria.
2. Desenhe uma fatia reservada disjunta: as instâncias de Rust e Python de Multi-SWE-bench [102] e BugsInPy [103], deduplicadas contra o índice de G0 [104].
3. Registre previamente a fatia, os sementes e as hipóteses antes da primeira execução.
4. Relate contagens separadas de resolvidas, plausíveis e idênticas em bytes, cada uma com um intervalo de 95%.

<div id="85-baselines-in-the-same-table" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Linhas de base na mesma tabela

1. Sem modelo: `cargo fix` e clippy [106], e Sorald ou uma porta TBar [91].
2. Modelo barato: sem agente com um modelo local [99].
3. Modelo remoto: um agente com um modelo de fronteira, sua energia estimada a partir de divulgações do provedor e rotulada `est_j`.
4. Relate o custo de passagem [101] em joules e em dólares para cada linha, com o custo controlado conforme Kapoor e colegas exigem [100].

<div id="86-convergence-of-model-calls-at-large-n" class="anchor-alias" aria-hidden="true"></div>

### 8.6 Convergência das chamadas ao modelo para grandes N

A promoção é o mecanismo pelo qual o modelo sai do loop: um resolutor é pago uma vez para um novo caso, a porta aplica a solução como um manipulador, e cada caso posterior do mesmo formato fecha em G0 ou G1 ([Seção 4.2](#42-the-gears)). A convergência é a afirmação de que as chamadas ao modelo por rodada caem para zero em uma especificação fixa sob tráfego vivo. É medida da seguinte forma.

1. Desenhe pelo menos 1.000 especificações de repositórios públicos, estratificadas por linguagem e tamanho, e congele o motor e o resolutor antes da primeira rodada.
2. Reproduza o tráfego de produção gravado, pelo menos 10.000 eventos por especificação, em rodadas de tamanho fixo.
3. Registre por rodada: novas escaladas, chamadas ao modelo, promoções, adiamentos e joules por tarefa fechada, cada um rotulado (`est_j`, `reported_j`, `measured_j`).
4. Ponto final principal: a proporção de especificações que atingem uma rodada com zero chamadas ao modelo dentro de 20 rodadas, com um intervalo de Wilson de 95%. Secundário: chamadas ao modelo por tarefa fechada por rodada, e a rodada da última chamada ao modelo.
5. Relate especificações que nunca convergem com sua causa (uma entrada travada, uma dependência ausente, nova intenção), e execute o adiamento de entrada travada como um braço previamente registrado.

**Proposição 8 (abordagem de piso).** À medida que a cobertura de G0 e G1 cresce, os joules por tarefa resolvida se aproximam do piso dourado de aplicar uma correção conhecida e executar os testes. Os degraus da escada e o conjunto reservado de Defects4J sob o teste do medidor de parede o testam.

<div id="87-lift-coverage-across-languages" class="anchor-alias" aria-hidden="true"></div>

### 8.7 Cobertura de elevação em diferentes linguagens

<div id="87-coverage-of-real-programs-across-languages" class="anchor-alias" aria-hidden="true"></div>

A elevação é medida conforme é construída. Para a linguagem $L$, um programa conta como elevado quando $\pi_L(\lambda_L(p))$ passa nos próprios testes do programa e reproduz suas gravações de rastreamento byte por byte, e $\lambda_L(\pi_L(\lambda_L(p)))$ tem o mesmo hash de forma que $\lambda_L(p)$. A amostra é de pelo menos 10.000 programas por linguagem para pelo menos dez linguagens, desenhada com uma semente fixa de corpora públicos fixos, com o elevador congelado e seu hash binário registrado antes de cada execução, e zero chamadas ao modelo. Cada execução relata a proporção elevada com um intervalo de Wilson de 95%, e cada construção ainda não elevada é um item de trabalho para o elevador dessa linguagem, construído e congelado antes da próxima execução. O objetivo é todos os programas em todas as linguagens.
<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. Falsificadores

Fixados antes das execuções que testam.

| ID | Observação | Derrota |
|---|---|---|
| RCE-F0 | Em uma execução pré-registrada de pelo menos 10.000 Formas, qualquer uma das quatro projeções (Rust, Python, JavaScript, Scala) imprime uma trajetória que difere da trajetória de referência da Forma, ou qualquer entrada malformada é aceita | A afirmação de que as projeções são fiéis e a porta recusa na entrada |
| RCE-F1 | Na fatia reservada, G0 a G2 com regras congeladas resolvem menos de 10% das tarefas com 0 chamadas ao modelo | A afirmação de que a maioria das soluções já existe para reparos nessa escala |
| RCE-F2 | Os patches idênticos em bytes ou equivalentes são menos da metade das tarefas reservadas resolvidas | A interpretação da porta como mais do que plausível nas tarefas cobertas |
| RCE-F3 | Sob o medidor de parede, os joules brutos por tarefa resolvida do solver RCE excedem os do modelo baseline mais barato nas tarefas que ambos resolvem | A afirmação de menor energia por tarefa resolvida nas tarefas cobertas |
| RCE-F4 | No protocolo de convergência da Seção 8.6, menos da metade das especificações sem uma entrada travada atingem uma rodada com zero chamadas ao modelo dentro de 20 rodadas | Compilar o modelo fora do loop |
| RCE-F5 (registrado em 22 de outubro de 2026) | Na subsample da escada sob o medidor de parede da Seção 8.3, com uma entrada `host.Calibrated` para o host, o R² por alvo de `reported_j` no vetor de contagem C.6 está abaixo de 0,8 no regime A, ou `est_j` no regime B está errado em mais de 25% na mediana | A afirmação de que a estimativa calibrada é um proxy útil; a base do recibo para esse host torna-se `unpriced` até que um modelo melhor seja calibrado |
| RCE-F6 (registrado em 22 de outubro de 2026) | Na medição de dimensão registrada da Seção 3.8, a redundância mediana sobre programas limitados, com saída (a camada que as execuções registradas chamam observável) está abaixo de 0,1 bit. Status, 24 de outubro de 2026: acionado na população de duas regiões autorais da quinta execução (mediana 0,00 bits sobre doze programas), não acionado nos exemplos escritos à mão (1,29 bits, terceira execução) ou nos programas do host (0,46 bits por família, quarta execução) | A afirmação de que o estado acidental é comum em Formas pequenas nessa escala; `rce dim` é então um diagnóstico apenas para programas grandes, que é a interpretação que a Seção 3.8 agora dá |
<div id="10-work-to-finish" class="anchor-alias" aria-hidden="true"></div>

## 10. Trabalho para concluir

Cada item tem seu protocolo nomeado.

1. Elevação construída e medida em pelo menos dez idiomas sob o protocolo da Seção 8.7.
2. O braço de especificação: especificações no estilo de MBPP e HumanEval autoradas como Formas e emitidas para cada destino.
3. Resultados reservados em L2 a L4, no conjunto reservado de Defects4J desenhado pela regra registrada da Seção 8.1, e em L5 a L7 (Seção 8.2).
4. Linhas de base em uma tabela, custo de passagem em joules e dólares (Seção 8.5).
5. Uma série `measured_j`: um medidor de parede em um host ocioso, pelo menos 10 repetições, lado a lado bruto e líquido (Seção 8.3).
6. A pesquisa de 626 idiomas publicada com seu método (Figura 1).
7. Novos conjuntos de dados reservados com as engrenagens congeladas: Multi-SWE-bench e BugsInPy (Seção 8.4).
8. Convergência de chamadas a modelos em pelo menos 1.000 especificações (Seção 8.6).
9. T60, T61 e T59 sobre todo $E$ provado (T60 por refinamento de partição mecanizado), e T62 vinculado de seu modelo para a ordem do admitente (Seção 3.8).
10. A descoberta do `state_hash` de T7 está resolvida (Seção 3.6) e `RCE/Positional.lean` prova a codificação posicional que o verificador hash não muda sob os renomamentos da especificação 10.6 para cada função de hash. O que resta é ligar o modelo Lean ao verificador que executa: a Fase 2 da Seção 13 extrai o verificador e o interpretador do Lean e os usa como a porta, com o verificador Rust cruzado verificado contra eles, em vez de provar um refinamento do núcleo Lean para o interpretador Rust, o que [§12.1](#121-seven-areas-of-the-design) recusa.
11. Uma população de dimensões registrada cegamente (programas escritos sem o benchmark em mente, ou levantados), grande o suficiente para testar H2 além das duas linhas que agora carregam; as execuções registradas em commits públicos registraram RCE-F6 como acionado em uma população e não nas outras (Seção 3.8).
12. Os três experimentos pré-registrados da Seção 12.3: a precisão do modelo na Forma sem nome com e sem o registro do conceito; a taxa de comutação de declarações adjacentes no código levantado; e se a exclusão reversível certificada por replay move a linha de base de exclusão de 20%.
13. A primeira entrada `host.Calibrated` no degrau KV260 com $N \ge 30$, e a regressão que RCE-F5 testa (Seção 6.3).
14. O formato IR da Forma 2 (definições endereçadas por conteúdo) tornado o único formato, de forma que os 77 tijolos da biblioteca padrão recusados apenas por tamanho de termo sejam inferiores, e a condição de ida e volta hash(lift(emit(F))) = hash(F) verificada por destino em $N = 10{,}000$ (Seção 13).
15. O contrato de entrada do verificador de referência, de forma que cada entrada tenha um resultado declarado ao entrar (Seção 1). No commit público `d91a9fc8`, `rce run` e `rce host run` descartam um campo de carga útil que o evento não declara e aplicam o evento, e armazenam um campo do tipo errado a menos que a aritmética do passo seja travada nele. O contrato recusa um evento não declarado, um campo faltante, extra ou mal tipado e um valor aninhado, deixa o estado inalterado e registra a recusa (T8); o protocolo da Seção 2.3 testa-o em N grande.
16. O emissor de Scala trazido à concordância com a referência no conjunto de conformidade, onde ele passa 52 de 1.832 resultados hoje ([§4.5](#45-the-compilers)), com os resultados de Scala do conjunto reexecutados sob as regras de um único idioma.
17. O design de [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) construído: a codificação `rce-form/1` da proposta `spec/proposals/rce-form.md`, e para cada idioma sua tabela de elevação, tabela de impressão e biblioteca de tempo de execução, publicada no nível de aceitação que suas execuções atingem, com as contagens dessas execuções.

<div id="56-brownfield-agreement" class="anchor-alias" aria-hidden="true"></div>

**Resultados sendo reconstruídos no código público.** O motor produziu os resultados abaixo. Cada um é reconstruído no código público antes de entrar neste artigo: o código em um commit público marcado, uma inscrição selada antes da execução, linhas por tarefa publicadas, e um comando que reproduz o resumo a partir de um clone limpo (a primeira fase do programa em [§13](#13-programme-of-work-and-its-gates)).

| Resultado | Protocolo neste artigo | Rastreamento de reconstrução |
|---|---|---|
| Contagem de testes do motor (`cargo test --release`, e o total de `make check`) e a auditoria do Lean em um commit do motor | §3.7 | Contagens de verificação em um commit público: os testes do verificador de referência, `lake build` e a auditoria do Lean, a verificação da especificação e as verificações de WebAssembly, com um identificador de execução de integração contínua |
| O piloto de 22 de outubro de 2026 e a primeira execução da dimensão registrada, `dim-r1` (77 programas de `spec/examples/` e `rce-examples`), ambas feitas em commits que não são públicos | §3.8 | A mesma população reexecutada com `rce dim` em um commit público |
| Verificação do kernel: dez alavancas verificadas com Kani 0.67.0, suas contagens de verificação e o certificado que a promoção exige | §5.3, §5.4 | Kani em um pacote público do kernel que o log do verificador, a dobra e o código posicional chamam, com as dez alavancas e um certificado armazenado |
| A execução do ecossistema em 10.000 Formas geradas: codificação sem perdas, projeção determinística e fiel, a porta na entrada para entradas e especificações, seu teste de regressão e seu tempo de CPU | §2.3 | O protocolo da Seção 2.3 executado no verificador de referência e seus emissores, registrado sob um novo identificador de execução |
| T9-F: o compilador de Forma do motor (`rce form`) e seus cinco destinos (Rust, WebAssembly, Python, XState, SCXML) imprimindo a traça de referência nas bordas e eventos semeados de uma especificação com onze operadores | §3.7 | Um teste diferencial dos emissores públicos nas bordas e eventos semeados registrados |
| As provas do Z3 das reescritas do e-grafos internos do motor e o proponente determinístico de 87 identidades familiares | §5.2 | Uma porta pública de reescrita: um avaliador de referência de termos de IR de Forma, uma codificação SMT-LIB com um resultado não satisfatório por reescrita e controles negativos, e as identidades listadas na inscrição |
| As invariantes de Forma da Seção 4.1 verificadas pelos testes nomeados do motor, a compounding de escalas no trabalho de referência da Proposição R2 e a demonstração do motor no navegador | §2.4, §4.1 | O perfil do motor, a porta, a promoção e os recibos no código público, construídos a partir do Apêndice D |
| As taxas de reparo com um token (L0) em nove repositórios e em quatro nunca ajustados, com os bits de busca médios e a quebra de não resolvidos | §6, §6.1 | Uma ferramenta pública de reparo executada no protocolo L0, com a linha de base de inversão do operador ao lado |
| As taxas de reparo com uma declaração (L1) em ManySStuBs4J 2.0, apenas em blocos e no arquivo inteiro, e em TSSB-3M, com as taxas por categoria | §6, §6.2 | As engrenagens L1 na ferramenta pública de reparo, no protocolo L1 |
| Acordo da elevação com o código original em fixos de Rust, Python, TypeScript e Go | §6 | Elevações públicas por idioma, executadas em fixos escritos recentemente |
| Acordo de três programas de abordagem de vendas, reexpressos como Formas, com seus inputs registrados e a `est_j` mudança sob extração | §6 | Os programas escritos como módulos de linguagem e reexecutados contra os inputs registrados publicamente |
| `est_j` por tarefa resolvida na escada e a subsample RAPL | §6.3 | `est_j` a partir das execuções reconstruídas da escada, e `reported_j` em um host com RAPL |
<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. Conclusão

RCE é um ecossistema de código nativo por design. Um programa é escrito uma vez, a partir da intenção, como uma Forma: uma codificação sem perdas de estado, eventos e transições puras, das quais, no design, cada linguagem de destino é uma projeção que deve reproduzir sua trajetória. Cada estado em que um programa pode estar é declarado em sua Forma, e um evento recusado deixa o estado inalterado (teorema T8), então um programa no ecossistema não se desvia de sua intenção e não precisa de difs ou rastreamento de erros após o fato. A linguagem é uma especificação escrita em um único commit. O verificador de referência implementa-a e emite Rust, Python e JavaScript, que cada um passa 1.459 testes de conformidade com 0 falhas, e Scala, que ainda não concorda com a referência; a especificação registra o nível da prova de cada teorema; e a dimensão de um programa é um número calculado, medido em execuções registradas em commits públicos, que acionaram RCE-F6 em uma população e não nas outras. No design do motor, toda solução que a porta aplica é armazenada e reutilizada, e o ecossistema compõe-se sob uma porta cuja correção é monótona (Proposição R1). Código de outras linguagens é projetado para entrar por meio de elevação, uma construção de cada gramática da linguagem para sua árvore de sintaxe para a Forma; um padrão Go é elevado por uma sonda pública hoje, e elevar e emitir todas as linguagens é o objetivo da proposta `spec/proposais/rce-form.md`. As Seções 3.6 e 8.7 afirmam as proposições de universalidade e como sua construção é medida, a Seção 9 afirma as observações que derrotariam as alegações, e a Seção 10 lista o trabalho que permanece, incluindo os resultados do motor sendo reconstruído no código público.

<div id="12-the-form-against-the-record" class="anchor-alias" aria-hidden="true"></div>

## 12. A Forma contra o registro

Esta seção coloca a Forma contra três corpos de evidências: a teoria e as ferramentas de cada área que o design toca, a história do design de linguagens de programação lida como uma comparação do que cada linguagem corrige e do que deixa livre, e as causas medidas da redundância no código escrito por humanos. Cada subseção afirma o que a evidência mostra, com sua fonte, e depois a posição que este artigo toma e o motivo. Onde uma posição é um julgamento em vez de um resultado medido, o texto diz isso. As três pesquisas por trás desta seção foram conduzidas em outubro de 2026; seus textos completos e notas de trabalho são publicados no repositório de experimentos ([openie-research-experiments/rce/surveys](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/surveys)).
<div id="121-seven-areas-of-the-design" class="anchor-alias" aria-hidden="true"></div>

### 12.1 Sete áreas do design

**Formas canônicas.** Para uma máquina completa e determinística sobre um alfabeto finito, a máquina mínima é única até isomorfismo, e uma ordem de percurso fixa transforma isso em uma string única [150]. A Forma fornece completude e determinismo (T1, T2), então a projeção de controle finito de [§3.8](#38-behaviour-equivalence-and-dimension) tem uma forma canônica. O componente de dados não: autômatos finitos simbólicos têm uma mínima canônica até equivalência de predicado [149], autômatos de registro sobre igualdade ou ordem densa admitem um teorema de Myhill-Nerode [151], e um estado atualizado por aritmética inteira não tem representante canônico, mas o próprio termo. Extração de um e-grafo sob um custo que cobra sub-termos compartilhados uma vez é NP-difícil e não aproximável a um fator constante [158], então um representante hashado deve usar um custo reprodutível entre extraidores. Posição: três chaves de forma, cada uma nomeando sua camada no input hashado (o hash do termo sem nome, a forma de controle de [§3.8](#38-behaviour-equivalence-and-dimension), e a chave de classe e com seu orçamento de saturação); equivalência definida uma vez, como bisimulação; corpos de passos guardados verificados primeiro pelo procedimento de decisão quase linear de álgebra de Kleene guardada com testes [157]. Recusado: qualquer reivindicação de que a máquina mínima é *a* forma canônica de uma Forma com estado aritmético; um representante hashado escolhido pelo custo de sub-termo compartilhado. Aberto: para qual fragmento igual significado implica uma forma de controle igual (o inverso de T61).

**Representação intermediária endereçável por conteúdo.** A experiência de cinco anos de Unison com definições identificadas por hash reduziu-se a uma invariante, que o hash cobre a semântica e nunca nomeia, e um custo, re-hashing dependente sob edição [159]; Dhall hasha a forma normal de uma linguagem total [160]; o esforço de Nix para endereçar por conteúdo a construção de saídas permaneceu experimental por quinze anos porque referências auto-referenciais e não-determinismo quebraram [161]. Posição: definições indexadas pelo digesto do corpo α-eliminado, normalizado, com nomes, posições de origem e ortografia literal em uma tabela não hashada renderizada pelas projeções; um emissor que percorre a representação intermediária através de uma tabela por-alvo, substituindo quatro emissores que percorrem a sintaxe de superfície; cada runtime que serializa é verificado contra os vetores JSON canônicos. Recusado: substituir JSON canônico pelos bytes hashados com RFC 8785 (que não pode carregar um inteiro distinto de um float, zero negativo ou um inteiro exato de 64 bits sem sinal) ou com CBOR determinístico (cuas duas especificações discordam sobre a largura de float e a ordem de chaves); artefatos emitidos como identidade por endereçamento por conteúdo; normalização β completa antes do hashing, já que uma função recursiva então não tem termo finito. Aberto: chaves de nível de componente para recursão mútua.

**O log como uma ordem parcial.** Uma trilha no sentido de Mazurkiewicz é uma palavra módulo a comutação de eventos independentes, e todas as linearizações de uma configuração lêem a mesma trilha. O teorema da consistência como monotonicidade lógica diz quais programas não precisam de coordenação [19], e sua extensão para leituras diz que observações de estado convergente são inseguras a menos que sejam de forma de limiar [82]. Posição: uma entrada do log hashada sobre sua cadeia, número de sequência, evento e os hashes das entradas que observou causalmente, com o hash de estado registrado apenas em cortes, de modo que o digesto é o mesmo sob cada linearização que a semântica admite; a tag monotônica estendida para leituras; cada braço tomado de um `select` cross-chain é logado. O teorema de que qualquer ordem consistente com as dependências se dobra ao mesmo estado de corte (T62) é provado em um modelo e é uma proposta, não texto normativo. Recusado: deixar um alvo escolher a linearização de um evento não monotônico. Aberto: a extensão da prova do modelo ao avaliador completo.

**Síntese a partir da intenção.** Um verificador verifica apenas a validade: uma pós-condição que sempre é verdadeira verifica. A completude de uma especificação tem que ser medida, e a medida que funciona é a proporção de saídas mutadas que a especificação rejeita; remover essa medida da porta no estudo que a introduziu reduziu a verificabilidade para 1,56% [162]. Enumeração direcionada por tipo sobre autômatos de árvores com restrições de igualdade elevou a proporção resolvida de um benchmark de busca de biblioteca de 64% para 88% [163], e auto-refinamento e voto da maioria raramente justificam seu custo uma vez que o custo por resultado correto é contabilizado [164]. Posição: intenção como um programa com buracos carregando obrigações, exemplos, um conjunto nomeado de definições utilizáveis e um orçamento; uma regra que recusa uma intenção cujas obrigações rejeitam nenhum comportamento; uma completude medida relatada com cada intenção; um registro de derivação por buraco fornecendo os candidatos antes e depois de cada verificação. Recusado: promoção por pontuação; loops de refinamento dentro de uma chamada a modelo. Aberto: uma medida independente de corpus da informação que uma intenção carrega.

**Modelos de custo de energia.** A literatura de medição é resumida em [§6.3](#63-energy): joules são lineares em contagens de operação em um núcleo em ordem [152] e lineares no tempo em um núcleo fora de ordem [153]; contadores no chip diferem em valor por uma ordem de magnitude [105, 154, 155]; a medição unitária do tipo usada por Ethereum correlaciona-se com o tempo de CPU apenas em 0,51 [156]. Posição: três objetos distintos, nunca mesclados , as unidades de orçamento determinísticas e cegas para o alvo da especificação; uma estimativa que é um vetor calibrado por alvo aplicado às contagens (em ordem) ou ao tempo (fora de ordem); e os rótulos de recibo, mantidos em colunas separadas. Recusado: joules na tabela de orçamento; constantes por linguagem; um contador lido como uma medição de metro de parede.

**Linguagens projetadas para autores de máquina.** Um catálogo de 42 tais linguagens, 36 delas primeiramente listadas em 2026, mostra cada um dos mecanismos deste artigo com um par: evidência encadeada por hash, contratos obrigatórios divididos em provados e verificados em tempo de execução, um núcleo de assistente de prova, árvores de sintaxe como a fonte de verdade com definições hashadas [166]. A observação de convergência de [§3.7](#37-the-language-one-text-costs-and-theorem-status) permanece. O que distingue este design não é qualquer mecanismo, mas que replay e injetividade são teoremas (T3, T7) em vez de promessas em tempo de execução, e que exemplos são rastros de eventos tipados sobre a mesma semântica que o replay usa, então a oráculo que um modelo não pode contornar é o próprio programa. Posição: um registro versionado de códigos de regra com diagnósticos e planos de reparo legíveis por máquina; pares de tradução validados por testes fabricados a partir dos emissores e do verificador, que é a receita que recuperou linguagens de baixa recursos em [165] executada em reverso. Recusado: qualquer reivindicação de ser primeiro ou único.

**Engenharia de prova.** Os padrões que fecharam a lacuna entre uma especificação e seu modelo mecanizado fizeram isso gerando prosa, tabelas de verificador e definições de uma única fonte autorizada: SpecTec para WebAssembly encontrou dez erros em cinco propostas e foi adotado para todas as edições futuras [167]. Os projetos que provaram uma implementação correta por refinamento pagaram por isso: cerca de doze anos-pessoa para 8.700 linhas de C [169]. Os mantenedores de CompCert listam cada item confiável com sua razão [168]. Posição: uma única fonte de regra autorizada gerando o texto da especificação, as tabelas do verificador e as definições do Lean, com uma verificação que falha em qualquer divergência; o núcleo do Lean como o executor de registro para o subconjunto que cobre, com a contagem de construções não suportadas publicada e delimitando o escopo declarado de cada teorema; um capítulo listando cada componente confiável com seu teste. Recusado: uma prova de refinamento do núcleo do Lean para o interpretador Rust; contagem de teoremas como medida de garantia; duas semânticas autorizadas de qualquer coisa.
<div id="122-the-form-among-programming-languages" class="anchor-alias" aria-hidden="true"></div>

### 12.2 A Forma entre linguagens de programação

Sobre cem linguagens em doze famílias foram colocadas em oito coordenadas , layout de estado, alfabeto de evento, transição, ordem, recurso, confiança, tempo de vinculação e intenção , registrando para cada uma se o autor fixa, o compilador ou runtime escolhe, ou a linguagem não tem palavra para isso. Três regularidades seguem. Apenas três famílias obtêm determinismo global sem o esforço do autor, por três teoremas diferentes: as linguagens sincronizadas por uma verificação de causalidade, as linguagens de fluxo e lógica por monotonicidade, e as linguagens de ação atômica protegida por escalonamento de uma regra por vez com análise estática de conflito. Toda família que atingiu certificação de segurança o fez removendo as mesmas três coordenadas que a Forma remove: alocação dinâmica, recursão não limitada e escolha não determinística. E as duas coordenadas que nenhuma família fixa bem são confiança e intenção; a intenção e os blocos de exemplo e os valores de capacidade da Forma fixam ambas.

As cinco designs mais próximas da Forma são Dedalus, cujas relações indexadas no tempo são o log e cujas regras de próximo passo são a transição [15]; Bluespec, cujas regras atômicas protegidas são escalonadas por uma ordem escolhida pelo compilador provada igual à execução de uma regra por vez; a arquitetura Elm, que é os quatro componentes da Forma sob outros nomes [83]; Lustre, cuja disciplina com memória limitada e escalonamento estático foi certificada em cerca de cem sistemas de aviação; e Unison, sobre identidade [159]. O registro também fixa cinco restrições, cada uma um lugar onde uma linguagem anterior pagou pela escolha oposta. Tarefas concorrentes devem reduzir a máquinas de estado sem pilha, como as funções assíncronas do Rust, porque uma coroutine com pilha não pode ser registrada passo a passo. Composição paralela deve ser emitida como um passo estruturado, nunca como um produto explícito de autômatos, o que nos compiladores de Esterel falhou além de cerca de mil linhas de código fonte concorrente. Manipuladores de efeito são um não objetivo do rascunho 0.9: a especificação F.2 exclui manipuladores resumíveis e multi-tiro, citando o limite de totalidade do teorema T2 e a reprodução do log do teorema T3. O registro argumenta a exclusão da propriedade de posse e o limite do teorema T2 em vez disso: cada resumo adicional duplica o estado capturado, e o número de resumos depende dos dados, então nenhum limite do gráfico de chamadas existe; ele encontra o argumento do teorema T3 respondível. Conclui que os manipuladores devem ser de um tiro, como o OCaml 5 escolheu, e nomeia manipuladores de um tiro, resumíveis de cauda como um fragmento que a Forma poderia admitir sem quebrar nenhum teorema. A única dimensão de um programa que é um teorema é o índice de sua projeção de controle finito ([§3.8](#38-behaviour-equivalence-and-dimension)). E a elevação de uma linguagem completa de Turing é uma mapa parcial cujo domínio é indeterminável ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). O vocabulário da geometria diferencial que um rascunho anterior deste projeto usou (cartas, gauge, holonomia, geodésicas) não tem correspondente na literatura de linguagens de programação e não é usado aqui; os objetos que existem são a coalgebra final, funtores da sintaxe para ela, o grupoide de provas de reescrita cujos componentes conectados são e-classe, e comprimento mínimo de descrição com joules no lugar de bits.

As proposições de universalidade de [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) são tornadas mensuráveis por um critério de encapsulação. A Forma encapsula uma linguagem $L$ quando, para cada programa $p$ de $L$ em um corpus fixo, a Forma elevada não é pior que $p$ em cinco coordenadas e estritamente melhor em pelo menos uma: joules medidos nas mesmas tarefas e hospedeiro; redundância no sentido de [§3.8](#38-behaviour-equivalence-and-dimension) contra os bits de estado $p$ declara; decidibilidade, significando que toda propriedade decidida para $p$ é decidida para a Forma; a ida e volta, significando concordância de comportamento com um comprimento declarado e a condição do lente no hash de forma; e o custo para um modelo atingir um programa passando pela porta a partir da mesma intenção. A afirmação de que a Forma é melhor que uma linguagem de programação é a conjunção desse critério sobre o corpus, uma execução registrada por linguagem, e nada mais: não afirma expressividade, pois uma Forma não pode dizer mais que $p$, nem legibilidade, que é uma propriedade de uma projeção, nem adoção. Uma linguagem na qual a Forma é estritamente pior em qualquer coordenada após duas execuções registradas não é encapsulada, e o registro do que essa linguagem fixa que a Forma não torna-se um item de trabalho para a Forma.
<div id="123-why-human-written-code-is-redundant" class="anchor-alias" aria-hidden="true"></div>

### 12.3 Por que o código escrito por humanos é redundante

O código escrito por humanos carrega redundância sempre que o meio não dá ao autor um canal para o que é pretendido, e essa redundância é uma substituição privada de cada autor. A evidência medida classifica-a em três camadas. Formatação representa 13 a 15% dos tokens de linguagens delimitadas por chaves e pode ser removida sem perda de precisão para dez modelos de linguagem [136], e o layout não tem efeito mensurável sobre a compreensão humana [135]. As únicas quantidades que acompanham a carga de compreensão medida são o tamanho textual, o tamanho do vocabulário e o alcance das dependências de fluxo de dados, cada uma com Kendall's τ ≈ 0,4, enquanto a complexidade ciclomática não acompanha nada (τ ≈ 0,09) [133]; e 97% dos bugs reais de concorrência, excluindo deadlocks, são pressupostos não verificados sobre atomicidade ou ordem, 96% deles envolvendo no máximo duas threads, porque o texto sequencial não pode declarar uma ordem parcial e o autor escreve uma total [170]. Nomes são escolhidos com uma média de concordância de 6,9% entre desenvolvedores e são decodificados com 97% [137]; comentários param de acompanhar o código que descrevem após alguns commits [138]; no entanto, modelos de linguagem perdem até 29 pontos de precisão quando identificadores são removidos [139]. Dois outros causas são organizacionais. Desenvolvedores não apagam: em três sistemas de produção, 54 a 60% dos arquivos nunca foram executados ao longo de seis a dezesseis meses, os desenvolvedores removeram 20% do código que lhes foi mostrado como desnecessário, e a cautela foi razoável, pois o detector tinha 32% de precisão [171]. E as organizações enviam seus limites: oito métricas organizacionais previram binários propensos a falhas com 86,2% de precisão e 84,0% de recall, superando todas as métricas de código [172].

A posição que segue tem quatro partes. A Forma toma ordem, localidade, idioma e alcançabilidade, cada uma decidível sobre um estado, um conjunto de eventos e um passo total. A projeção toma layout e idioma, renderizados por comunidade, porque a vantagem de um especialista está confinada ao código escrito em planos familiares e uma projeção que emite apenas código correto custa-lhe isso. A intenção permanece um registro estruturado e verificado, do qual a projeção renderiza nomes ([§3.8](#38-behaviour-equivalence-and-dimension)). E a especificação é governada por uma verificação mecânica de admissão, porque a autoria por modelos aumenta a taxa de propostas sem mudar a regra. Três perguntas nas quais o design depende não tiveram medição na literatura e foram registradas como experimentos com protocolos selados: se um modelo raciocina com a mesma precisão de uma Forma sem nome com seu registro de conceito como de uma superfície nomeada; que percentual das declarações adjacentes no código comum comutam sob as dependências da Forma, que é o tamanho do folga cujo custo a figura de 97% mede; e se a exclusão verificada por reprodução e reversível por um comando move a taxa de exclusão de 20%. Duas alegações que circularam no material de trabalho do projeto não têm fonte rastreável e não são usadas: um estudo de 2014 sobre contagens de páginas de manual de linguagem, e a afirmação de que programadores experientes escrevem menos código, que remete a um post de weblog citando um estudo não nomeado.

<div id="124-how-the-language-grows-and-shrinks" class="anchor-alias" aria-hidden="true"></div>

### 12.4 Como a linguagem cresce e encolhe

Toda linguagem que permaneceu pequena substituiu o gosto dos revisores por uma regra sobre o que conta como admissível. O processo do Go está inclinado para recusar, e em um estudo recusou 40,9% de 1.095 propostas com um conjunto publicado de razões [173]; a regra de Lua sobre mecanismos em vez de políticas manteve sua implementação em cerca de 25.000 linhas de C; Elm parou. O regime que cresce também é documentado por seu próprio líder: o benefício de uma característica é privado e imediato, seu custo difuso e adiado, e é mais fácil mobilizar entusiasmo por algo novo do que por opositores [175]. No RCE, a Forma cresce dentro de um único texto. Quando um programa precisa de uma forma que o texto não possui, incluindo uma que ninguém previu, a forma é escrita na especificação em si mesma, sem versão e sem macro, bandeira, diretiva ou plugin. O repositório de especificação estabelece sete regras sobre como uma forma entra no texto, cada uma nomeando a artefato que a enforça. Uma construção entra na gramática normativa apenas com um exemplo aceito e um recusado, uma afirmação Lean do teorema no qual ela depende vinculada ao verificador por uma tabela de regras gerada ou por vetores de teste, e sem conflitos de análise; qualquer coisa menos é uma proposta. Uma segunda ortografia de algo que a Forma já diz é recusada apenas por esse motivo. A mudança ocorre em ambas as direções: qualquer construção pode ser alterada, generalizada, substituída ou removida quando uma forma melhor é encontrada, e a mudança se move juntamente com cada programa, exemplo e módulo de biblioteca do repositório que toca em um commit, com uma linha do livro-razão dizendo o que mudou e por quê. Cada interface tem um único locus de decisão, porque uma fronteira organizacional que passa por uma interface é um local previsto de defeito [172]. As decisões e suas razões são publicadas em um livro-razão com um conjunto fixo de razões, então a taxa de recusa é um número que qualquer pessoa pode ler. O mercado não poda, então o uso nunca é uma razão para manter uma construção. E a autoria por um modelo muda a taxa, não a regra.
<div id="125-the-library-and-the-compute-fabric" class="anchor-alias" aria-hidden="true"></div>

### 12.5 A biblioteca e o tecido computacional

Seja uma linguagem deve incluir uma grande biblioteca ("baterias incluídas") ou um núcleo pequeno e especificado com um registro gratuito, geralmente é discutido como conveniência contra flexibilidade. O registro mostra que ambas as posições falham no mesmo ponto [193]. Uma biblioteca incluída com a linguagem vincula sua interface à promessa de compatibilidade da linguagem e perde flexibilidade [195]. Seus módulos são removidos uma vez que um instalador existe: a Proposta de Melhoria do Python 594 removeu 22 deles, citando custo de manutenção e facilidade de instalação a partir do registro [194]. Um registro gratuito produz gráficos transitivos profundos: metade dos pacotes dependentes em Cargo, npm e NuGet têm pelo menos 41, 21 e 27 dependências transitivas [196]. Uma especificação com muitas implementações diverge em suas bordas, como mais de 30 analisadores JSON fazem em uma gramática subespecificada [197]. Onde o registro converge, converge para uma camada curada que é entregue e alterada como uma unidade.

A mesma falha aparece em todos os tecidos computacionais. Em processadores gráficos, modelos de única fonte correspondem ao código nativo em kernels de streaming e perdem em reduções: no produto escalar, os scores de portabilidade de desempenho de Kokkos, RAJA e SYCL estão entre 0,80 e 0,91 [198]. Em um FPGA, uma fonte SYCL migrada do CUDA e ajustada para um GPU atinge 0,2% a 47% da velocidade de sua versão otimizada para FPGA, por razões derivadas dos tempos publicados no maior tamanho do problema [193, 199]. Os sistemas investigados que dão um significado no software e no hardware o fazem cortando sua linguagem de origem para o que seu hardware pode significar (estado de tamanho conhecido estaticamente, nenhuma pilha ou recursão na parte do hardware, um tick lógico), e suas provas cobrem partes da cadeia, não todas [193, 200]. Formatos de código portáveis funcionam onde fixam semânticas [201]. Resultados bit-identicos custam pouco quando projetados [202]. Resultados de consistência para modelos de memória são pares [203]. A colocação a partir de custos medidos é não determinística a menos que cada decisão seja registrada e reexecutada, ou a execução seja simulada no tempo virtual [193, 204]. Para autores de máquinas, a pergunta também é uma de conhecimento: dos pacotes nomeados pelo código que 16 modelos geraram em Python e JavaScript, 19,7% não existiam [205].

Ambos os debates perguntam onde o significado da biblioteca é mantido: por uma implementação, por cada pacote do registro, por uma especificação verificada com tolerâncias, ou por um binário de fornecedor para um tecido. A posição RCE mantém-o no único texto.

- **A biblioteca é parte do texto.** Ela é escrita na linguagem e construída em cada ferramenta (especificação 4.1). Ela é fixada pelo hash de seu manifesto, que um programa nomeia como sua única dependência (F.5.3).
- **Ela não tem variante de plataforma.** Ela realiza entrada e saída apenas através de adaptadores.
- **Seu custo é o custo de sua fonte em cada binário.** Um passo, portanto, significa o mesmo em cada host (HC-7).
- **A escolha por alvo pertence ao host.** O host admite um tecido para uma classe de operações apenas após uma verificação de exatidão de bit registrada contra a referência do CPU (HC-13), e ele registra cada colocação para reprodução (HC-12).
- **O que está disponível é uma lista que uma ferramenta imprime, completa em cada commit e crescendo no mesmo texto.** Se uma função existe torna-se uma consulta, não uma recordação.

A Forma faz isso como uma forma, não como uma porta. Os sistemas do registro cortam sua linguagem de origem porque ela diz mais do que seu hardware pode significar. A Forma P = (S, E, δ, D, λ) é a forma que cada programa já tem: o estado que mantém, os eventos que responde, seu passo, seu log e suas saídas. É por isso que programas de outras linguagens são projetados para entrar nela por elevação, dentro do domínio [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) estados, e por que nenhuma parte desta posição classifica programas em admitidos e recusados.

A Forma é rígida em cada commit, com um texto e um significado. É flexível entre commits. Quando um programa precisa de uma forma que a forma não tem, a forma a ganha no texto, nunca através de um macro, sinal, diretiva ou plugin ao lado. Uma mudança pode estender, generalizar ou substituir uma forma. Ela se move junto com os programas do repositório em um commit, e os hashes do programa, a verificação de equivalência de [§3.8](#38-behaviour-equivalence-and-dimension) e o log registram o que se moveu. Comportamento e equivalência (especificação 6.10) e as entradas do tecido do host foram adicionadas dentro do texto sem alterar o significado de qualquer programa aceito, e o log como uma ordem parcial e intenção com lacunas são propostos da mesma forma. Sob a proposta, o hardware segue a mesma regra: o motor lê os tamanhos de estado e custos de passo de uma Forma para realizá-la, com um estado de tamanho estático em registradores e um estado crescente na memória que o circuito endereça.

"Baterias incluídas" e "especificação e livre" então param de ser alternativas: as baterias são parte da especificação, e o programa é livre de qualquer tecido.

A metade da biblioteca desta posição é mantida no repositório em suas partes principais: a biblioteca é escrita na linguagem, construída em cada ferramenta e fixada por hash. Uma de suas partes permanece: uma definição da biblioteca padrão através das seções da especificação. Desde openIE-dev/rce `5e701e33` (27 de outubro de 2026), `use` é a única maneira de trazer um módulo da biblioteca. A metade do tecido é um contrato cuja reprodução é provada em um modelo do host (especificação Apêndice E, teorema T37), com os logs de exemplo replegados através do verificador de referência (`tests/host_contract.rs`), e um executor de referência cuja reprodução é testada contra sua execução viva (`tests/host_runtime.rs`), exercitado apenas em CPUs. A proposta "uma biblioteca e uma Forma em cada tecido computacional" lista o que permanece [193]:

- uma definição da biblioteca padrão;
- evidência de verificação rederivada na reprodução;
- colocação em cada caminho de execução;
- uma árvore de redução por construção;
- execuções de calibração;
- classes de operações inteiro e binary32;
- realisação de hardware lida de cada Forma's forma;
- um host sem um sistema operacional;
- duas medições que o registro falta: a energia de um kernel através das classes de dispositivos sob um limite, e a proporção da funcionalidade da biblioteca que os assistentes de modelo reutilizam em vez de reimplementar.
<div id="13-programme-of-work-and-its-gates" class="anchor-alias" aria-hidden="true"></div>

## 13. Programa de trabalho e suas portas

Duas revisões independentes dos repositórios públicos em outubro de 2026 chegaram à mesma diagnose. O verificador não é ele próprio verificado: nada refina a semântica do Lean para o interpretador do Rust, os dois núcleos do Lean não têm nenhum teorema relacionando-os, e o relatório da suite de conformidade para o núcleo mecanizado (`conformance/reports/results-lean-core.json` no commit público `d91a9fc8`) registra 210 testes passando, 1 falhando e 1.766 não suportados de 1.977, então cerca de um décimo da suite está sob o teorema que a visão geral anuncia. O código emitido é um tempo de execução de valor dinâmico por alvo, quatro runtimes escritos à mão de cerca de 2.000 linhas cada. A estimativa de energia não consegue distinguir os alvos, então a extração de menor joule nunca escolhe um. O perfil do motor especifica uma elevação para quatro linguagens, nenhuma delas pública; a única elevação pública é uma sonda para um padrão Go, e a reivindicação de universalidade precisa de dez. E o motor , as engrenagens, o e-gráfico, as reescritas e suas provas, o núcleo e sua verificação de modelo, e a elevação , não é público, então os resultados que ele produziu entram neste artigo apenas quando cada um é reconstruído no código público; [§10](#10-work-to-finish) lista-os com seus rastros de reconstrução. Para um projeto cujo motivo declarado para trabalhar em aberto é rastreabilidade, isso é o maior risco no programa.

O programa é ordenado por dependência: reprodutibilidade primeiro; depois a codificação e o modelo de custo que toda medição posterior depende; depois a cadeia de provas; e apenas depois a amplitude. Cada fase termina em uma porta que é um falsificador registrado antes da execução, relatado com um intervalo de confiança; uma fase fecha quando sua observação da porta é publicada, nunca com base no esforço. As portas são declaradas em [§9](#9-falsifiers) e a tabela abaixo.

| Fase | Entregas | O que derrota a fase |
|---|---|---|
| 0 Reproduzir | Cada resultado que depende do motor reconstruído no código público em um commit marcado, conforme [§10](#10-work-to-finish) lista; os registros por tarefa de cada execução reconstruída; o conjunto Defects4J reservado concluído; cada registro selado por hash; uma string de versão; a errata da especificação fechada; uma ortografia cada de terminação, autoridade e erro; uma medida publicada de redundância superficial (construtos distintos por Forma sobre o corpus de exemplos) | Um número neste artigo que não pode ser reconstruído a partir de um commit público com um único comando |
| 1 Congelar a Forma | Definições endereçáveis por conteúdo como a única forma intermediária; relações tipadas como um valor Forma; uma redução que cada emissor consome; a condição de ida e volta verificada por alvo; um modelo de custo por alvo calibrado conforme [§6.3](#63-energy) afirma | Uma definição recusada por tamanho; um alvo cuja ida e volta muda um hash de forma; o modelo de custo classificando dois alvos opostamente ao medidor de parede |
| 2 Um núcleo, porta verificada | Um único núcleo Lean com T1 a T9 reafirmados sobre ele; as regras de tipagem geradas a partir da tabela de regras do verificador de modo que uma regra sem um contrapartido Lean falhe a construção; o verificador e o interpretador extraídos do Lean e usados como a porta, com o verificador Rust como uma frente de verificação cruzada | A porta extraída e o verificador Rust discordando sobre qualquer programa; um teorema reafirmado necessitando de um passo admitido; testes de conformidade não suportados acima de 10% |
| 3 Alvos cotados em joules | Arrays de rank-n e operações em massa como a única ortografia para trabalho numérico; emissores Zig e Fortran com modos fixos de ponto flutuante e estouro; dicas de layout na ajuste e nunca na Forma; um certificado de validação de tradução por módulo emitido; o protocolo do medidor de parede de [§8.3](#83-a-wall-meter) | RCE-F3 e RCE-F5; um módulo emitido sem certificado; a extração escolhendo o mesmo termo para cada par de alvos |
| 4 Elevação como entrada | Uma elevação por linguagem, Go e Python primeiro, depois TypeScript e Rust, depois C e Zig; 10.000 programas por linguagem com a elevação congelada; o critério de encapsulação de [§12.2](#122-the-form-among-programming-languages) executado por linguagem; um log público, apenas-append, de hashes de forma admitidos com seus certificados | Cobertura de elevação abaixo de 10% em qualquer uma das primeiras quatro linguagens após a segunda execução registrada; a Forma estritamente pior em qualquer coordenada do critério |
| 5 O ecossistema compõe | Síntese a partir de intenções com buracos; as primeiras engrenagens públicas com seus certificados de verificação; o protocolo de convergência de [§8.6](#86-convergence-of-model-calls-at-large-n) em 1.000 especificações públicas; baselines em uma tabela com custo por resultado correto em joules e dólares | RCE-F1, RCE-F2, RCE-F4; as ferramentas incapazes de verificar ou emitir a si mesmas |

Três posições onde as revisões diferiram das pesquisas de [§12](#12-the-form-against-the-record) são resolvidas da seguinte forma. O JSON canônico permanece a única codificação com hash, pelos motivos dados em [§12.1](#121-seven-areas-of-the-design); uma codificação binária pode espelhá-lo apenas para transporte se for uma bijeção com esses bytes, verificada nos mesmos vetores. A única ortografia de terminação é uma medida declarada decrescente, com os limites de loop e recursão como a semântica; a forma endereçável por conteúdo ainda precisa de um ponto fixo limitado para recursão, e a medida é o que a limita. Reduzir o vocabulário de concorrência a dois primitivos é registrado como uma proposta aberta em vez de uma decisão, porque os teoremas dos dois primitivos devem ser provados primeiro no verificador em vez de em um modelo. Não no programa de forma alguma: um compilador auto-hospedado antes da fase 2, alvos adicionais antes da fase 1, qualquer construção dos apêndices antes de seu teorema, e um compilador de produção, que a própria visão geral da especificação diz que não deve ser construído até o documento parar de se mover.

Desde as revisões, os seis repositórios que devem concordar com a especificação , o livro, os programas de exemplo, a biblioteca padrão, a suite de conformidade, o pacote de gramática e o editor , foram mesclados no repositório de especificação com suas histórias, e cada um é verificado por um fluxo de trabalho que constrói o verificador a partir do mesmo commit. Nada no projeto fixa ou vende uma especificação mais antiga; o verificador vendido no editor, seis commits atrás, foi o último tal fixo. O site de pesquisa e o repositório de experimentos permanecem separados e leem o repositório de especificação; ele nunca os lê.
<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referências

[1] C. E. Shannon, "Prediction and Entropy of Printed English," *Bell System Technical Journal* 30(1), 1951. doi:10.1002/j.1538-7305.1951.tb01366.x

[2] Y. Gurevich, "Sequential Abstract State Machines Capture Sequential Algorithms," *ACM Transactions on Computational Logic* 1(1), 2000. doi:10.1145/343369.343384

[3] A. Blass and Y. Gurevich, "Abstract State Machines Capture Parallel Algorithms," *ACM Transactions on Computational Logic*, 2003. doi:10.1145/937555.937561

[4] N. Dershowitz and Y. Gurevich, "A Natural Axiomatization of Computability and Proof of Church's Thesis," *Bulletin of Symbolic Logic*, 2008. doi:10.2178/bsl/1231081370

[5] E. F. Codd, "A Relational Model of Data for Large Shared Data Banks," *Communications of the ACM*, 1970. doi:10.1145/362384.362685

[6] G. H. Mealy, "A Method for Synthesizing Sequential Circuits," *Bell System Technical Journal*, 1955. doi:10.1002/j.1538-7305.1955.tb03788.x

[7] E. F. Moore, "Gedanken-Experiments on Sequential Machines," *Automata Studies*, 1956. doi:10.1515/9781400882618-006

[8] K. Kang et al., "Feature-Oriented Domain Analysis (FODA) Feasibility Study," CMU/SEI-90-TR-021, 1990.

[9] R. Alur et al., "Syntax-Guided Synthesis," FMCAD 2013. doi:10.1109/FMCAD.2013.6679385

[10] D. Harel, "Statecharts: A Visual Formalism for Complex Systems," *Science of Computer Programming*, 1987. doi:10.1016/0167-6423(87)90035-9

[11] R. Tate, M. Stepp, Z. Tatlock and S. Lerner, "Equality Saturation," POPL 2009. doi:10.1145/1480881.1480915

[12] M. Willsey et al., "egg: Fast and Extensible Equality Saturation," POPL 2021. doi:10.1145/3434304

[13] B. Moseley and P. Marks, "Out of the Tar Pit," 2006.

[14] M. Fowler, "Event Sourcing," 2005. https://martinfowler.com/eaaDev/EventSourcing.html

[15] P. Alvaro et al., "Dedalus: Datalog in Time and Space," LNCS 2011. doi:10.1007/978-3-642-24206-9_16

[16] A. M. Turing, "On Computable Numbers," *Proceedings of the London Mathematical Society*, 1937. doi:10.1112/plms/s2-42.1.230

[17] A. Church, "An Unsolvable Problem of Elementary Number Theory," *American Journal of Mathematics*, 1936. doi:10.2307/2371045

[18] P. Wadler, "Propositions as Types," *Communications of the ACM*, 2015. doi:10.1145/2699407

[19] J. M. Hellerstein and P. Alvaro, "Keeping CALM," *Communications of the ACM*, 2020. doi:10.1145/3369736

[20] G. Kahn, "The Semantics of a Simple Language for Parallel Programming," IFIP 1974, pp. 471 to 475.

[21] H. Husain et al., "CodeSearchNet Challenge," 2019. arXiv:1909.09436

[22] D. Kim, J. Nam, J. Song and S. Kim, "Automatic Patch Generation Learned from Human-Written Patches" (PAR), ICSE 2013. doi:10.1109/ICSE.2013.6606626

[23] K. Liu et al., "TBar: Revisiting Template-based Automated Program Repair," ISSTA 2019. arXiv:1903.08409

[24] K. Liu et al., "AVATAR: Fixing Semantic Bugs with Fix Patterns of Static Analysis Violations," SANER 2019. arXiv:1812.07270

[25] A. Koyuncu et al., "FixMiner: Mining Relevant Fix Patterns for Automated Program Repair," 2018. arXiv:1810.01791

[26] Y. Padioleau et al., "Documenting and Automating Collateral Evolutions in Linux Device Drivers" (Coccinelle), EuroSys 2008. doi:10.1145/1352592.1352618

[27] A. Solar-Lezama et al., "Combinatorial Sketching for Finite Programs," ASPLOS 2006. doi:10.1145/1168857.1168907

[28] L. Chen, M. Zaharia and J. Zou, "FrugalGPT," 2023. arXiv:2305.05176

[29] S. Haber and W. S. Stornetta, "How to Time-Stamp a Digital Document," *Journal of Cryptology*, 1991. doi:10.1007/BF00196791

[30] S. A. Crosby and D. S. Wallach, "Efficient Data Structures for Tamper-Evident Logging," USENIX Security 2009.

[31] L. de Moura and N. Bjørner, "Z3: An Efficient SMT Solver," TACAS 2008. doi:10.1007/978-3-540-78800-3_24

[32] Kani Rust Verifier. https://github.com/model-checking/kani

[33] C. V. Lopes et al., "DéjàVu: A Map of Code Duplicates on GitHub," OOPSLA 2017. doi:10.1145/3133908

[34] M. Gabel and Z. Su, "A Study of the Uniqueness of Source Code," FSE 2010. doi:10.1145/1882291.1882315

[35] A. Hindle et al., "On the Naturalness of Software," ICSE 2012. doi:10.1109/ICSE.2012.6227135

[36] D. Kocetkov et al., "The Stack: 3 TB of Permissively Licensed Source Code," 2022. arXiv:2211.15533; The Stack v2 dataset card, https://huggingface.co/datasets/bigcode/the-stack-v2

[37] R. Just, D. Jalali and M. D. Ernst, "Defects4J: A Database of Existing Faults to Enable Controlled Testing Studies for Java Programs," ISSTA 2014. doi:10.1145/2610384.2628055

[38] C. E. Jimenez et al., "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" 2023. arXiv:2310.06770

[39] R. Aleithan et al., "SWE-Bench+: Enhanced Coding Benchmark for LLMs," 2024. arXiv:2410.06992

[40] C. E. Shannon, "A Mathematical Theory of Communication," *Bell System Technical Journal* 27, 1948. doi:10.1002/j.1538-7305.1948.tb01338.x

[41] A. N. Kolmogorov, "Three approaches to the quantitative definition of information," *Problemy Peredachi Informatsii* 1(1), 1965 (in Russian); English translation, *International Journal of Computer Mathematics* 2, 1968. doi:10.1080/00207166808803030

[42] R. J. Solomonoff, "A formal theory of inductive inference. Part I," *Information and Control* 7(1), 1964. doi:10.1016/S0019-9958(64)90223-2

[43] G. J. Chaitin, "A Theory of Program Size Formally Identical to Information Theory," *Journal of the ACM* 22(3), 1975. doi:10.1145/321892.321894

[44] J. Rissanen, "Modeling by shortest data description," *Automatica* 14(5), 1978. doi:10.1016/0005-1098(78)90005-5

[45] B. Ray, V. Hellendoorn, S. Godhane, Z. Tu, A. Bacchelli and P. Devanbu, "On the 'naturalness' of buggy code," ICSE 2016. doi:10.1145/2884781.2884848

[46] Z. Tu, Z. Su and P. Devanbu, "On the localness of software," FSE 2014. doi:10.1145/2635868.2635875

[47] M. Allamanis, E. T. Barr, P. Devanbu and C. Sutton, "A Survey of Machine Learning for Big Code and Naturalness," *ACM Computing Surveys* 51(4), 2018. doi:10.1145/3212695

[48] 陈浙哲, 刘忠鑫, 鄢萌, 徐洲, 夏鑫, 雷晏 (Z. Chen, Z. Liu, M. Yan, Z. Xu, X. Xia and Y. Lei), "代码自然性及其应用研究进展" (Research progress of code naturalness and its application), *软件学报 (Journal of Software)* 33(8), 3015 to 3034, 2022. doi:10.13328/j.cnki.jos.006355

[49] G. Sridhara, V. S. Sinha and S. Mani, "Naturalness of Natural Language Artifacts in Software," ISEC 2015 (India Software Engineering Conference). doi:10.1145/2723742.2723758

[50] P. Devanbu, "On the naturalness of software," keynote, ISEC 2013 (India Software Engineering Conference). doi:10.1145/2442754.2442763

[51] A. Z. H. Yang, S. Kolak, V. J. Hellendoorn, R. Martins et al., "Revisiting Unnaturalness for Automated Program Repair in the Era of Large Language Models," ICSE 2025. doi:10.1109/ICSE55347.2025.00089

[52] E. W. Dijkstra, "Guarded commands, nondeterminacy and formal derivation of programs," *Communications of the ACM* 18(8), 1975. doi:10.1145/360933.360975

[53] N. Wirth, "Program development by stepwise refinement," *Communications of the ACM* 14(4), 1971. doi:10.1145/362575.362577

[54] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969. doi:10.1145/363235.363259

[55] J.-R. Abrial, *The B-Book: Assigning Programs to Meanings*, Cambridge University Press, 1996. doi:10.1017/CBO9780511624162

[56] J.-R. Abrial, *Modeling in Event-B: System and Software Engineering*, Cambridge University Press, 2010. doi:10.1017/CBO9781139195881

[57] R.-J. Back and J. von Wright, *Refinement Calculus: A Systematic Introduction*, Springer, 1998. doi:10.1007/978-1-4612-1674-2

[58] F. L. Bauer and H. Wössner, *Algorithmic Language and Program Development*, Springer, 1982. doi:10.1007/978-3-642-61807-9

[59] S. Gulwani, "Automating string processing in spreadsheets using input-output examples," POPL 2011. doi:10.1145/1926385.1926423

[60] S. Gulwani, O. Polozov and R. Singh, "Program Synthesis," *Foundations and Trends in Programming Languages* 4(1-2), 2017. doi:10.1561/2500000010

[61] F. P. Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering," *Computer* 20(4), 1987. doi:10.1109/MC.1987.1663532

[62] P. Naur, "Programming as theory building," *Microprocessing and Microprogramming* 15(5), 1985. doi:10.1016/0165-6074(85)90032-8

[63] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980. doi:10.1109/PROC.1980.11805

[64] P. Zave and M. Jackson, "Four dark corners of requirements engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997. doi:10.1145/237432.237434

[65] R. Landauer, "Irreversibility and Heat Generation in the Computing Process," *IBM Journal of Research and Development* 5(3), 1961. doi:10.1147/rd.53.0183

[66] C. H. Bennett, "Logical Reversibility of Computation," *IBM Journal of Research and Development* 17(6), 1973. doi:10.1147/rd.176.0525

[67] M. Franz and T. Kistler, "Slim binaries," *Communications of the ACM* 40(12), 1997. doi:10.1145/265563.265576

[68] C. W. Fraser, "Automatic inference of models for statistical code compression," PLDI 1999. doi:10.1145/301618.301672

[69] P. Cousot and R. Cousot, "Abstract interpretation: a unified lattice model for static analysis of programs by construction or approximation of fixpoints," POPL 1977. doi:10.1145/512950.512973

[70] Y. Futamura, "Partial evaluation of computation process: an approach to a compiler-compiler," *Systems, Computers, Controls* 2(5), 1971; reprinted in *Higher-Order and Symbolic Computation* 12(4), 1999. doi:10.1023/A:1010095604496

[71] A. P. Ershov, "Mixed computation: potential applications and problems for study," *Theoretical Computer Science* 18(1), 1982. doi:10.1016/0304-3975(82)90111-6

[72] W. A. Howard, "The formulae-as-types notion of construction," in J. P. Seldin and J. R. Hindley (eds.), *To H. B. Curry: Essays on Combinatory Logic, Lambda Calculus and Formalism*, Academic Press, 1980.

[73] 土居真之, 肥後芳樹, 有馬諒, 下仲健斗, 楠本真二 (M. Doi, Y. Higo, R. Arima, K. Shimonaka and S. Kusumoto), "ソースコードの「自然さ」を利用した自動生成ファイルの特定" (Identifying auto-generated files using the naturalness of source code), 電子情報通信学会技術研究報告 (IEICE Technical Report) 117(380), 19 to 24, January 2018. https://sdl.ist.osaka-u.ac.jp/pman/pman3.cgi?D=517

[74] M. Doi, Y. Higo, R. Arima, K. Shimonaka and S. Kusumoto, "On the naturalness of auto-generated code: can we identify auto-generated code automatically?" ICPC 2018. doi:10.1145/3196321.3196356

[75] F. V. Arrebola, "Modelo de sugestão de código-fonte baseado em modelos de linguagem organizados em um contexto hierárquico" (A source code suggestion model based on language models organized in a hierarchical context), doctoral thesis in electrical engineering, Fundação Educacional Inaciana Padre Sabóia de Medeiros (FEI), Brazil, 2018. Advisor R. A. C. Bianchi.

[76] G. Febres, K. Jaffé and C. Gershenson, "Complexity measurement of natural and artificial languages," *Complexity* 20(6), 2015. doi:10.1002/cplx.21529

[77] M. Rahman, D. Palani and P. C. Rigby, "Natural Software Revisited," ICSE 2019. doi:10.1109/ICSE.2019.00022

[78] A. Torres, S. Baltes, C. Treude and M. Wagner, "Applying Information Theory to Software Evolution," NLBSE 2023. doi:10.1109/NLBSE59153.2023.00017

[79] A. Blass, N. Dershowitz and Y. Gurevich, "When are two algorithms the same?," *Bulletin of Symbolic Logic* 15(2), 2009. arXiv:0811.0811. https://arxiv.org/abs/0811.0811

[80] Y. N. Moschovakis, "What is an algorithm?," in *Mathematics Unlimited: 2001 and Beyond*, Springer, 2001. https://www.math.ucla.edu/~ynm/papers/eng.pdf

[81] M. Y. Vardi, "What is an algorithm?," *Communications of the ACM* 55(3), 2012. doi:10.1145/2093548.2093549

[82] S. Laddad, A. Cheung, J. M. Hellerstein and M. Milano, "Flo: a Semantic Foundation for Progressive Stream Processing," POPL 2025. arXiv:2411.08274. https://arxiv.org/abs/2411.08274

[83] The Elm Architecture, Elm guide. https://guide.elm-lang.org/architecture/

[84] Temporal, "Workflows" (event history), documentation. https://docs.temporal.io/workflows

[85] A. Pnueli, M. Siegel and E. Singerman, "Translation validation," TACAS 1998. doi:10.1007/BFb0054170

[86] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," PLDI 2011. doi:10.1145/1993498.1993532

[87] C. Nandi, M. Willsey, A. Zhu et al., "Rewrite Rule Inference Using Equality Saturation," OOPSLA 2021. arXiv:2108.10436. https://arxiv.org/abs/2108.10436

[88] C. Le Goues, T. Nguyen, S. Forrest and W. Weimer, "GenProg: A Generic Method for Automatic Software Repair," *IEEE TSE* 38(1), 2012. doi:10.1109/TSE.2011.104

[89] F. Long and M. Rinard, "Automatic patch generation by learning correct code," POPL 2016. doi:10.1145/2837614.2837617

[90] J. Bader, A. Scott, M. Pradel and S. Chandra, "Getafix: Learning to Fix Bugs Automatically," OOPSLA 2019. arXiv:1902.06111. https://arxiv.org/abs/1902.06111

[91] K. Etemadi, N. Harrand, S. Larsen et al., "Sorald: Automatic Patch Suggestions for SonarQube Static Analysis Violations," *IEEE TDSC*, 2022. arXiv:2103.12033. https://arxiv.org/abs/2103.12033

[92] Z. Qi, F. Long, S. Achour and M. Rinard, "An analysis of patch plausibility and correctness for generate-and-validate patch generation systems," ISSTA 2015. doi:10.1145/2771783.2771791

[93] E. K. Smith, E. T. Barr, C. Le Goues and Y. Brun, "Is the cure worse than the disease? Overfitting in automated program repair," ESEC/FSE 2015. doi:10.1145/2786805.2786825

[94] X.-B. D. Le, F. Thung, D. Lo and C. Le Goues, "Overfitting in semantics-based automated program repair," *Empirical Software Engineering* 23, 2018. doi:10.1007/s10664-017-9577-2

[95] Y. Xiong, X. Liu, M. Zeng, L. Zhang and G. Huang, "Identifying patch correctness in test-based program repair," ICSE 2018. doi:10.1145/3180155.3180182

[96] T. Durieux, F. Madeiral, M. Martinez and R. Abreu, "Empirical Review of Java Program Repair Tools: A Large-Scale Experiment on 2,141 Bugs and 23,551 Repair Attempts," ESEC/FSE 2019. arXiv:1905.11973. https://arxiv.org/abs/1905.11973

[97] K. Liu, A. Koyuncu, T. F. Bissyandé et al., "You Cannot Fix What You Cannot Find! An Investigation of Fault Localization Bias in Benchmarking Automated Program Repair Systems," ICST 2019. arXiv:1812.07283. https://arxiv.org/abs/1812.07283

[98] M. Monperrus, "Automatic Software Repair: A Bibliography," *ACM Computing Surveys* 51(1), 2018. doi:10.1145/3105906

[99] C. S. Xia, Y. Deng, S. Dunn and L. Zhang, "Agentless: Demystifying LLM-based Software Engineering Agents," 2024. arXiv:2407.01489. https://arxiv.org/abs/2407.01489

[100] S. Kapoor, B. Stroebl, Z. S. Siegel, N. Nadgir and A. Narayanan, "AI Agents That Matter," 2024. arXiv:2407.01502. https://arxiv.org/abs/2407.01502

[101] M. H. Erol, B. El, M. Suzgun, M. Yuksekgonul and J. Zou, "Cost-of-Pass: An Economic Framework for Evaluating Language Models," 2025. arXiv:2504.13359. https://arxiv.org/abs/2504.13359

[102] D. Zan, Z. Huang, W. Liu et al., "Multi-SWE-bench: A Multilingual Benchmark for Issue Resolving," 2025. arXiv:2504.02605. https://arxiv.org/abs/2504.02605

[103] R. Widyasari, S. Q. Sim, C. Lok et al., "BugsInPy: a database of existing bugs in Python programs to enable controlled testing and debugging studies," ESEC/FSE 2020. doi:10.1145/3368089.3417943

[104] M. Allamanis, "The Adverse Effects of Code Duplication in Machine Learning Models of Code," Onward! 2019. arXiv:1812.06469. https://arxiv.org/abs/1812.06469

[105] K. N. Khan, M. Hirki, T. Niemi, J. K. Nurminen and Z. Ou, "RAPL in Action: Experiences in Using RAPL for Power Measurements," *ACM TOMPECS* 3(2), 2018. doi:10.1145/3177754

[106] The Rust project, rustfix and `cargo fix`. https://github.com/rust-lang/rustfix

[107] R.-M. Karampatsis and C. Sutton, "How Often Do Single-Statement Bugs Occur? The ManySStuBs4J Dataset," MSR 2020. doi:10.1145/3379597.3387491

[108] C. Richter and H. Wehrheim, "TSSB-3M: Mining single statement bugs at massive scale," MSR 2022. doi:10.1145/3524842.3528505

[109] H. Coles, T. Laurent, C. Henard, M. Papadakis and A. Ventresque, "PIT: a practical mutation testing tool for Java," ISSTA 2016. doi:10.1145/2931037.2948707

[110] R. Just, D. Jalali, L. Inozemtseva, M. D. Ernst, R. Holmes and G. Fraser, "Are mutants a valid substitute for real faults in software testing?" FSE 2014. doi:10.1145/2635868.2635929

[111] I. J. Good, "Speculations Concerning the First Ultraintelligent Machine," *Advances in Computers* 6, 1965. doi:10.1016/S0065-2458(08)60418-0

[112] J. Schmidhuber, "Gödel Machines: Fully Self-referential Optimal Universal Self-improvers," in *Artificial General Intelligence*, Springer, 2007. doi:10.1007/978-3-540-68677-4_7

[113] E. Yudkowsky, "Intelligence Explosion Microeconomics," Technical report 2013-1, Machine Intelligence Research Institute, 2013. https://intelligence.org/files/IEM.pdf

[114] M. H. Löb, "Solution of a Problem of Leon Henkin," *Journal of Symbolic Logic* 20(2), 1955. doi:10.2307/2266895

[115] E. Yudkowsky and M. Herreshoff, "Tiling Agents for Self-Modifying AI, and the Löbian Obstacle," Machine Intelligence Research Institute, 2013. https://intelligence.org/files/TilingAgentsDraft.pdf

[116] E. Zelikman, E. Lorch, L. Mackey and A. T. Kalai, "Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation," 2023. doi:10.48550/arXiv.2310.02304

[117] J. Zhang, S. Hu, C. Lu, R. Lange and J. Clune, "Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents," 2025. doi:10.48550/arXiv.2505.22954

[118] A. Novikov et al., "AlphaEvolve: A coding agent for scientific and algorithmic discovery," 2025. doi:10.48550/arXiv.2506.13131

[119] G. Wang, Y. Xie, Y. Jiang, A. Mandlekar, C. Xiao, Y. Zhu, L. Fan and A. Anandkumar, "Voyager: An Open-Ended Embodied Agent with Large Language Models," 2023. doi:10.48550/arXiv.2305.16291

[120] Y. Futamura, "Partial Evaluation of Computation Process: An Approach to a Compiler-Compiler," *Higher-Order and Symbolic Computation* 12(4), 1999 (first published 1971). doi:10.1023/A:1010095604496

[121] V. F. Turchin, "The Concept of a Supercompiler," *ACM Transactions on Programming Languages and Systems* 8(3), 1986. doi:10.1145/5956.5957

[122] J. N. Foster, M. B. Greenwald, J. T. Moore, B. C. Pierce and A. Schmitt, "Combinators for Bidirectional Tree Transformations: A Linguistic Approach to the View-Update Problem," *ACM Transactions on Programming Languages and Systems* 29(3), 2007. doi:10.1145/1232420.1232424

[123] M. Hofmann, B. Pierce and D. Wagner, "Symmetric Lenses," *POPL*, 2011. doi:10.1145/1926385.1926428

[124] K. Czarnecki, J. N. Foster, Z. Hu, R. Lämmel, A. Schürr and J. F. Terwilliger, "Bidirectional Transformations: A Cross-Discipline Perspective," *ICMT*, LNCS 5563, 2009. doi:10.1007/978-3-642-02408-5_19

[125] E. W. Dijkstra, "A Constructive Approach to the Problem of Program Correctness," *BIT* 8(3), 1968. doi:10.1007/BF01933419

[126] A. Hall and R. Chapman, "Correctness by Construction: Developing a Commercial Secure System," *IEEE Software* 19(1), 2002. doi:10.1109/52.976937

[127] Y. Minsky, "OCaml for the Masses," *Communications of the ACM* 54(11), 2011. doi:10.1145/2018396.2018413

[128] D. A. Turner, "Total Functional Programming," *Journal of Universal Computer Science* 10(7), 2004. doi:10.3217/jucs-010-07-0751

[129] R. Di Cosmo and S. Zacchiroli, "Software Heritage: Why and How to Preserve Software Source Code," iPRES 2017, Kyoto. https://hal.science/hal-01590958

[130] Software Heritage, archive counters, read 13 October 2026: 30,253,266,524 file contents and 448,311,919 origins. https://archive.softwareheritage.org/api/1/stat/counters/

[131] Rosetta Code, main page, read 13 October 2026: 1,360 tasks, 421 draft tasks, 1,009 known languages. https://rosettacode.org/wiki/Rosetta_Code

[132] C. Casalnuovo, K. Lee, H. Wang, P. Devanbu and E. Morgan, "Do Programmers Prefer Predictable Expressions in Code?" *Cognitive Science* 44(12), 2020; preprint arXiv:1910.03704. https://arxiv.org/abs/1910.03704

[133] N. Peitek, S. Apel, C. Parnin, A. Brechmann and J. Siegmund, "Program Comprehension and Code Complexity Metrics: An fMRI Study," ICSE 2021. https://www.se.cs.uni-saarland.de/publications/docs/PAP+21.pdf

[134] S. Scalabrino, G. Bavota, C. Vendome, M. Linares-Vásquez, D. Poshyvanyk and R. Oliveto, "Automatically Assessing Code Understandability," *IEEE Transactions on Software Engineering* 47(3), 2021. https://www.cs.wm.edu/~denys/pubs/TSE'19-Understandability.pdf

[135] N. Peitek, J. Siegmund, C. Parnin, S. Apel and A. Brechmann, "Beyond Gaze: Preliminary Analysis of Pupil Dilation and Blink Rates in an fMRI Study of Program Comprehension," and the companion layout study, 2017. https://www.se.cs.uni-saarland.de/publications/docs/SPP+17.pdf

[136] "The Hidden Cost of Readability: How Code Formatting Silently Consumes Your LLM Budget," arXiv:2508.13666, August 2025; ICSE 2026. https://arxiv.org/abs/2508.13666

[137] D. G. Feitelson, A. Mizrahi, N. Noy, A. Ben Shabat, O. Eliyahu and R. Sheffer, "How Developers Choose Names," *IEEE Transactions on Software Engineering* 48(1), 2022; preprint arXiv:2103.07487. https://arxiv.org/abs/2103.07487

[138] F. Wen, C. Nagy, G. Bavota and M. Lanza, "A Large-Scale Empirical Study on Code-Comment Inconsistencies," ICPC 2019. https://www.inf.usi.ch/faculty/lanza/PUBS/P/Wen2019a.pdf

[139] "When Names Disappear: Revealing What LLMs Actually Understand About Code," arXiv:2510.03178, October 2025. https://arxiv.org/abs/2510.03178

[140] A. A. Ivanova, S. Srikant, Y. Sueoka, H. H. Kean, R. Dhamala, U.-M. O'Reilly, M. U. Bers and E. Fedorenko, "Comprehension of Computer Code Relies Primarily on Domain-General Executive Brain Regions," *eLife* 9, 2020. doi:10.7554/eLife.58906

[141] H. G. Rice, "Classes of Recursively Enumerable Sets and Their Decision Problems," *Transactions of the American Mathematical Society* 74, 1953. doi:10.1090/S0002-9947-1953-0053041-6

[142] O. Danvy and K. Millikin, "Refunctionalization at Work," BRICS RS-08-4, 2008; *Science of Computer Programming* 74(8), 2009. https://www.brics.dk/RS/08/4/

[143] M. S. Ager, D. Biernacki, O. Danvy and J. Midtgaard, "A Functional Correspondence between Evaluators and Abstract Machines," PPDP 2003. doi:10.1145/888251.888254

[144] J. J. M. M. Rutten, "Universal Coalgebra: A Theory of Systems," *Theoretical Computer Science* 249(1), 2000. doi:10.1016/S0304-3975(00)00056-6

[145] J. W. de Bakker and J. I. Zucker, "Processes and the Denotational Semantics of Concurrency," *Information and Control* 54(1-2), 1982. doi:10.1016/S0019-9958(82)91013-8

[146] C. P. Pfleeger, "State Reduction in Incompletely Specified Finite-State Machines," *IEEE Transactions on Computers* C-22(12), 1973. doi:10.1109/T-C.1973.223591

[147] A. Nerode, "Linear Automaton Transformations," *Proceedings of the American Mathematical Society* 9(4), 1958. doi:10.2307/2033204

[148] J. Hopcroft, "An n log n Algorithm for Minimizing States in a Finite Automaton," in *Theory of Machines and Computations*, Academic Press, 1971. doi:10.1016/B978-0-12-417750-5.50022-1

[149] L. D'Antoni and M. Veanes, "Minimization of Symbolic Automata," POPL 2014. doi:10.1145/2535838.2535849

[150] R. Reis, N. Moreira and M. Almeida, "On the Representation of Finite Automata," DCFS 2005. https://www.dcc.fc.up.pt/~nam/resources/publica/dcfsrma05.pdf

[151] M. Bojańczyk, B. Klin and S. Lasota, "Automata with Group Actions," LICS 2011. doi:10.1109/LICS.2011.48

[152] J. Lee et al., "A Linear Energy Model for Cortex-M0 Class Cores from Six Hardware Counters," arXiv:2104.01055, 2021. https://arxiv.org/abs/2104.01055

[153] N. van Kempen, H. Kwon, D. T. Nguyen and E. D. Berger, "It's Not Easy Being Green: On the Energy Efficiency of Programming Languages," arXiv:2410.05460v4, 2025. https://arxiv.org/abs/2410.05460


[154] Dauner et al., "Stale Reads: Sampling Hazards of On-Chip Energy Counters," HotCarbon 2026. https://hotcarbon.org/assets/2026/paper-46.pdf

[155] Z. Yang et al., "Part-Time Power Measurements: nvidia-smi's Lack of Attention," arXiv:2312.02741v3, 2024. https://arxiv.org/abs/2312.02741

[156] D. Perez and B. Livshits, "Broken Metre: Attacking Resource Metering in EVM," NDSS 2020; arXiv:1909.07220. https://arxiv.org/abs/1909.07220

[157] S. Smolka, N. Foster, J. Hsu, T. Kappé, D. Kozen and A. Silva, "Guarded Kleene Algebra with Tests: Verification of Uninterpreted Programs in Nearly Linear Time," POPL 2020. doi:10.1145/3371129

[158] Y. Sun, Y. Zhang and Z. Ni, "E-Graph Extraction with DAG Cost Is NP-Hard and Inapproximable," arXiv:2408.17042, 2024. https://arxiv.org/abs/2408.17042

[159] Unison Computing, "The Big Idea," Unison language documentation; and "A New Update Process," 20 October 2023. https://www.unison-lang.org/docs/the-big-idea/

[160] Dhall language standard, "Binary Semantics and Semantic Integrity Checks," `binary.md`. https://github.com/dhall-lang/dhall-lang/blob/master/standard/binary.md

[161] Tweag, "Towards a Content-Addressed Model for Nix," 10 September 2020, and "Self-References in a Content-Addressed Nix," 18 November 2020. https://www.tweag.io/blog/2020-09-10-nix-cas/


[162] "SpecRL: Measuring Specification Completeness for Verified Program Synthesis," arXiv:2604.05820, 2026. https://arxiv.org/abs/2604.05820

[163] J. Koppel, Z. Guo, E. de Vries and A. Solar-Lezama, "Searching Entangled Program Spaces," ICFP 2022. doi:10.1145/3547622

[164] M. Erol et al., "Cost-of-Pass: An Economic Framework for Evaluating Language Models," arXiv:2504.13359, 2025. https://arxiv.org/abs/2504.13359

[165] F. Cassano, J. Gouwar, F. Lucchetti, C. Schlesinger, A. Freeman, C. J. Anderson, M. Q. Feldman, M. Greenberg, A. Jangda and A. Guha, "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs," OOPSLA 2024. doi:10.1145/3689735

[166] agentlanguages.dev, catalogue of agent-oriented programming languages, read 19 October 2026 (42 entries). https://agentlanguages.dev

[167] WebAssembly Community Group, "SpecTec Has Been Adopted," 27 March 2025; D. Youn et al., "Bringing the WebAssembly Standard up to Speed with SpecTec," PLDI 2024. https://webassembly.org/news/2025-03-27-spectec/

[168] D. Monniaux and S. Boulmé, "The Trusted Computing Base of the CompCert Verified Compiler," ESOP 2022. https://arxiv.org/abs/2201.10280

[169] G. Klein, J. Andronick, K. Elphinstone, T. Murray, T. Sewell, R. Kolanski and G. Heiser, "Comprehensive Formal Verification of an OS Microkernel," *ACM Transactions on Computer Systems* 32(1), 2014; cost figures from NICTA technical report 4180. https://www.trustworthy.systems/publications/nicta_full_text/4180.pdf

[170] S. Lu, S. Park, E. Seo and Y. Zhou, "Learning from Mistakes: A Comprehensive Study on Real World Concurrency Bug Characteristics," ASPLOS 2008. doi:10.1145/1346281.1346323

[171] R. Haas, R. Niedermayr, T. Röhm and S. Apel, "Is Static Analysis Able to Identify Unnecessary Source Code?" *ACM Transactions on Software Engineering and Methodology* 29(1), 2020. doi:10.1145/3368267

[172] N. Nagappan, B. Murphy and V. Basili, "The Influence of Organizational Structure on Software Quality: An Empirical Case Study," ICSE 2008. doi:10.1145/1368088.1368160

[173] "An Empirical Study of Go's Language Proposal Process," arXiv:2510.06984, October 2025 (1,095 proposals; 448 declined, 337 accepted). https://arxiv.org/abs/2510.06984

[174] Z. R. Tam, C.-K. Wu, Y.-L. Tsai, C.-Y. Lin, H. Lee and Y.-N. Chen, "Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models," EMNLP Industry 2024; arXiv:2408.02442. https://arxiv.org/abs/2408.02442

[175] B. Stroustrup, "Thriving in a Crowded and Changing World: C++ 2006-2020," HOPL IV, *Proceedings of the ACM on Programming Languages* 4(HOPL), 2020. doi:10.1145/3386320

[176] F. Mancinelli, J. Boender, R. Di Cosmo, J. Vouillon, B. Durak, X. Leroy and R. Treinen, "Managing the Complexity of Large Free and Open Source Package-Based Software Distributions," ASE 2006, pp. 199-208. doi:10.1109/ASE.2006.49

[177] P. Abate, R. Di Cosmo, G. Gousios and S. Zacchiroli, "Dependency Solving Is Still Hard, but We Are Getting Better at It," SANER 2020, pp. 547-551. doi:10.1109/SANER48275.2020.9054837

[178] R. Cox, "Version SAT," research!rsc, 13 December 2016. https://research.swtch.com/version-sat

[179] S. Raemaekers, A. van Deursen and J. Visser, "Semantic versioning and impact of breaking changes in the Maven repository," *Journal of Systems and Software* 129:140-158, 2017. doi:10.1016/j.jss.2016.04.008

[180] L. Ochoa, T. Degueule, J.-R. Falleri and J. Vinju, "Breaking bad? Semantic versioning and impact of breaking changes in Maven Central," *Empirical Software Engineering* 27:61, 2022. doi:10.1007/s10664-021-10052-y

[181] T. Winters, T. Manshreck and H. Wright (eds.), *Software Engineering at Google*, chapter 21, O'Reilly, 2020. https://abseil.io/resources/swe-book/html/ch21.html

[182] J. Wetter and N. Ringland, "Understanding the Impact of Apache Log4j Vulnerability," Google Open Source Insights, 17 December 2021. https://blog.deps.dev/log4j/

[183] E. Dolstra, *The Purely Functional Software Deployment Model*, PhD thesis, Utrecht University, 2006. https://edolstra.github.io/pubs/phd-thesis.pdf

[184] R. Di Cosmo, M. Gruenpeter and S. Zacchiroli, "Referencing Source Code Artifacts: a Separate Concern in Software Citation," *Computing in Science & Engineering* 22(2):33-43, 2020. doi:10.1109/MCSE.2019.2963148

[185] R. Hickey, "Spec-ulation," keynote, Clojure/conj, December 2016. Transcript: https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/Spec_ulation.md

[186] B. Godlin and O. Strichman, "Regression verification," DAC 2009, pp. 466-471. doi:10.1145/1629911.1630034

[187] J. Baumgartner, H. Mony, V. Paruthi, R. Kanzelman and G. Janssen, "Scalable Sequential Equivalence Checking across Arbitrary Design Transformations," ICCD 2006. https://research.ibm.com/publications/scalable-sequential-equivalence-checking-across-arbitrary-design-transformations

[188] C. Lamb and S. Zacchiroli, "Reproducible Builds: Increasing the Integrity of Software Supply Chains," *IEEE Software* 39(2):62-70, 2022. doi:10.1109/MS.2021.3073045

[189] Open Interface Engineering, "Languages for or by machine authors, January 2024 to October 2026," working note 5 of the survey of 24 October 2026, `rce/surveys/2026-10-24/notes/languages_for_machine_authors.md`, openIE-dev/openie-research-experiments. https://github.com/openIE-dev/openie-research-experiments

[190] Open Interface Engineering, "New general-purpose and systems languages, January 2024 to October 2026," working note 6 of the survey of 24 October 2026, `rce/surveys/2026-10-24/notes/new_general_purpose_languages.md`, openIE-dev/openie-research-experiments. https://github.com/openIE-dev/openie-research-experiments

[191] W. van Oortmerssen, Goose: a memory-safe systems language with no heap allocator, garbage collector, or lifetime annotations, repository, 2026. https://github.com/aardappel/goose

[192] dawnop, Dawn: a small functional language with effects in the type signature and content-addressed packages, repository, 2026. https://github.com/dawnop/dawn-lang

[193] Open Interface Engineering, "Batteries included or specification and free: what the record says, and one Form on every compute fabric," synthesis of the survey of 24 October 2026, with working notes 7 to 18 and the proposal `spec/proposals/one-library-every-fabric.md` of openIE-dev/rce. https://github.com/openIE-dev/openie-research-experiments/blob/main/rce/surveys/2026-10-24/batteries-specification-and-fabrics.md

[194] C. Heimes and B. Cannon, "PEP 594: Removing dead batteries from the standard library," Python Enhancement Proposals, 2019. https://peps.python.org/pep-0594/

[195] Rust project, "RFC 1242: Policy for rust-lang crates," 2015. https://rust-lang.github.io/rfcs/1242-rust-lang-crates.html

[196] A. Decan, T. Mens and P. Grosjean, "An empirical comparison of dependency network evolution in seven software packaging ecosystems," Empirical Software Engineering 24, 2019. https://doi.org/10.1007/s10664-017-9589-y

[197] N. Seriot, "Parsing JSON is a Minefield," 2016. https://seriot.ch/projects/parsing_json.html

[198] J. H. Davis, P. Sivaraman, J. Kitson, K. Parasyris, H. Menon, I. Minn, G. Georgakoudis and A. Bhatele, "Taking GPU Programming Models to Task for Performance Portability," Proc. ICS 2025. https://doi.org/10.1145/3721145.3730423

[199] C. Weckert, L. Solis-Vasquez, J. Oppermann, A. Koch and O. Sinnen, "Altis-SYCL: Migrating Altis Benchmarking Suite from CUDA to SYCL for GPUs and FPGAs," SC '23 Workshops, 2023. https://doi.org/10.1145/3624062.3624542

[200] T. Bourgeat, C. Pit-Claudel, A. Chlipala and Arvind, "The essence of Bluespec: a core language for rule-based hardware design," Proc. PLDI 2020. https://doi.org/10.1145/3385412.3385965

[201] A. Haas, A. Rossberg, D. L. Schuff, B. L. Titzer, M. Holman, D. Gohman, L. Wagner, A. Zakai and J. F. Bastien, "Bringing the Web up to Speed with WebAssembly," Proc. PLDI 2017. https://doi.org/10.1145/3062341.3062363

[202] A. Arteaga, O. Fuhrer and T. Hoefler, "Designing Bit-Reproducible Portable High-Performance Applications," Proc. IPDPS 2014. https://doi.org/10.1109/IPDPS.2014.127

[203] D. Lustig, S. Sahasrabuddhe and O. Giroux, "A Formal Analysis of the NVIDIA PTX Memory Consistency Model," Proc. ASPLOS 2019. https://doi.org/10.1145/3297858.3304043

[204] StarPU project, StarPU Handbook: performance models and simulation with SimGrid, Inria. https://files.inria.fr/starpu/doc/html/

[205] J. Spracklen, R. Wijewickrama, A. H. M. N. Sakib, A. Maiti, B. Viswanath and M. Jadliwala, "We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs," Proc. USENIX Security 2025.
