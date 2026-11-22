---
title: "A Busca por AGI Resolve o Problema dos Três Corpos na Computação"
deck: "Sistemas computacionais falham com mais frequência nas transferências entre as pessoas que os especificam, constroem e usam. Verificar cada suposição em cada transferência resulta em uma pilha na qual uma correção permanece onde é feita."
lang: "pt"
source: "three-body"
complete: true
---

<div id="the-pursuit-of-agi-resolves-the-three-body-problem-in-computing" class="anchor-alias" aria-hidden="true"></div>

*Revisão 395f081, 4 de novembro de 2026. LaTeX PDF: [/pdfs/latex/three-body.pdf](/pdfs/latex/three-body.pdf) ([source](/pdfs/latex/three-body.tex))*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Falhas de engenharia em grande escala frequentemente começam onde um grupo entrega o trabalho a outro e uma suposição nunca é anotada. Este artigo define essas transferências, indica quando verificá‑las torna um sistema estável e apresenta testes que poderiam provar o contrário.

**Em palavras simples**

1. A maioria das grandes falhas de computador ocorre na transferência entre equipes ou componentes, não dentro delas.
2. A causa costuma ser um palpite que ninguém anotou, como a unidade em que um número está.
3. Se cada um desses palpites for anotado e verificado por uma máquina, uma correção feita em um ponto permanece corrigida e não rompe nada acima dela.

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. Tese

No romance de Liu Cixin *The Three-Body Problem* [1], uma civilização vive em um planeta que orbita três sóis. Suas estações não têm ritmo, porque ninguém pode prever onde três corpos sob gravidade mútua estarão. O título deste artigo toma essa imagem para a computação e a inverte: a instabilidade é real, mas tem uma causa que pode ser localizada, e a causa pode ser removida.

A computação tem três corpos. **Teóricos** declaram o que um sistema deve fazer: a matemática, a especificação, o algoritmo, o modelo físico. **Construtores** o constroem: os projetistas de chips, os escritores de compiladores e kernels, os autores de bibliotecas, os integradores. **Usuários** o executam: os operadores, os programas downstream, as pessoas e as máquinas que dependem de sua saída. Cada corpo é competente e internamente coerente. Um teorema vale. Um chip cumpre sua ficha técnica. Um usuário segue a documentação.

O problema reside entre eles. Cada transferência de um corpo para outro carrega suposições: sobre unidades, tensões, faixas, temporização, memória, codificações, versões, envelopes operacionais e intenção. Quando cada corpo supõe que a transferência não existe, ou que é tarefa de outrem, a suposição nunca é escrita, e uma suposição que nunca é escrita nunca é verificada.

**A alegação central.** A instabilidade dos sistemas computacionais está localizada em suas interfaces não examinadas, não nos corpos. Perseguir a inteligência artificial geral (AGI) de forma séria, como um sistema que deve agir corretamente em todos os corpos e em todos os níveis da pilha, obriga que cada suposição de interface seja tornada explícita e verificada. Uma pilha cujas suposições de interface são todas explícitas e verificadas é estável em sentido preciso: uma correção feita em um nível permanece correta naquele nível e se propaga a todos os níveis superiores. Essa é a resolução que o título nomeia.

A alegação é de engenharia e teoria. É declarada com definições em [Seção 5](#5-definitions-and-propositions), baseia‑se na literatura de interfaces revisada em [Seção 4](#4-the-interface-literature), sua evidência provém de sistemas verificados testados independentemente ([Seção 6](#6-the-stabilized-configuration)), e inclui protocolos e falsificadores que podem refutá‑la ([Seção 8](#8-protocols) e [Seção 9](#9-falsifiers)).

<div id="2-the-three-body-problem-and-what-the-analogy-carries" class="anchor-alias" aria-hidden="true"></div>

## 2. O problema dos três corpos, e o que a analogia carrega

<div id="21-what-the-physics-says" class="anchor-alias" aria-hidden="true"></div>

### 2.1 O que a física diz

Newton resolveu o movimento de dois corpos sob gravidade mútua em forma fechada: cada um se move em uma seção cônica em torno de seu centro de massa comum. Ao acrescentar um terceiro corpo, o problema muda de caráter. O memorial de Poincaré para o prêmio do rei Oscar II, publicado em *Acta Mathematica* em 1890, mostrou que, além dos integrais clássicos, o problema de três corpos não possui mais integrais do tipo que o reduziriam a quadraturas, e ao corrigir um erro em sua primeira submissão ele encontrou o emaranhado de trajetórias próximo a uma órbita periódica que agora é reconhecido como a primeira aparição do caos determinístico [2, 3]. A história de Barrow-Green rastreia o episódio desde o prêmio até o memorial corrigido [3].

“A inexistência de forma fechada geral” requer cautela, pois costuma ser exagerada. Sundman demonstrou, em trabalho publicado em 1912 e 1913, que o problema de três corpos possui uma solução em série convergente para todo o tempo, desde que o momento angular total não seja zero [4], e Wang estendeu uma solução em série global ao problema de n corpos em 1991 [5]. As séries convergem tão lentamente que são inúteis para predição. O conteúdo prático do resultado de Poincaré sobrevive: não há fórmula simples, e condições iniciais próximas podem se separar exponencialmente, de modo que a predição de longo alcance de uma configuração genérica não está disponível. Lorenz encontrou a mesma sensibilidade em um modelo de três variáveis de convecção em 1963 [6]. Stone e Leigh mostraram em 2019 que o problema caótico, não hierárquico de três corpos pode ser descrito estatisticamente, pela distribuição de seus resultados, embora trajetórias individuais não possam ser previstas [7].

<div id="22-the-special-stable-configurations" class="anchor-alias" aria-hidden="true"></div>

### 2.2 As configurações estáveis especiais

O caos é o caso genérico, não o único caso. Lagrange constatou em 1772 que três corpos podem manter suas posições relativas enquanto giram juntos: em uma linha reta ou nos vértices de um triângulo equilátero [3]. No problema restrito, em que o terceiro corpo é leve, esses são os cinco pontos de Lagrange. Os pontos triangulares são linearmente estáveis quando o primário maior é suficientemente pesado em relação ao menor, condição que Routh afirmou em 1874 (razão de massas acima de cerca de 25) [8]. As espaçonaves agora estacionam perto dos pontos de Lagrange do Sol e da Terra por essa razão. Existem outras soluções periódicas: Moore encontrou a órbita em forma de oito numericamente em 1993 [9], Chenciner e Montgomery provaram sua existência para massas iguais em 2000 [10], e Šuvakov e Dmitrašinović descobriram novas famílias em 2013 [11].

A lição deste artigo está na forma dessas soluções. Cada configuração estável é um arranjo especial no qual as forças entre os corpos estão equilibradas em um referencial que se move com eles. A estabilidade não é uma propriedade de um único corpo. É uma propriedade das relações entre os corpos e de um referencial no qual essas relações permanecem fixas.

<div id="23-analogy-and-mechanism" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Analogia e mecanismo

Uma metáfora emprestada da física pode induzir ao erro. A tabela separa o que este artigo usa como analogia do que afirma como mecanismo.

| O problema dos três corpos | Em computação | Status neste artigo |
|---|---|---|
| Três massas, cada uma simples isoladamente | Teóricos, criadores e usuários, cada um coerente isoladamente | Analogia |
| A instabilidade surge das interações, não de nenhum corpo | A falha surge nas interfaces, não dentro dos corpos | Mecanismo, apoiado pelos estudos de falha na Seção 3 e na literatura na Seção 4 |
| Dependência sensível das condições iniciais | Um pequeno descompasso não verificado em uma interface cresce à medida que se propaga pelos níveis | Mecanismo, declarado como Proposição 2 |
| Nenhuma forma fechada geral útil | Nenhum corpo único pode prever o comportamento do sistema inteiro a partir de seu próprio modelo | Analogia; a computação não possui equações de movimento |
| Configurações estáveis existem em um quadro co-rotativo | Uma pilha cujas suposições de interface são todas verificadas mantém uma correção onde é feita | Mecanismo, declarado como Proposição 3 |
| Descrição estatística de resultados caóticos [7] | Taxas de falha podem ser medidas em grande N mesmo onde falhas individuais não são previstas | Método, usado nos protocolos da Seção 8 |

O artigo nunca afirma que a computação obedece à dinâmica newtoniana, que as interfaces exercem forças, ou que um expoente de Lyapunov pode ser calculado para uma organização. A física fornece vocabulário e uma lição estrutural: a estabilidade provém das relações, e é encontrada em configurações especiais, não no caso genérico.

<div id="3-the-three-bodies-of-computing-and-their-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 3. Os três corpos da computação e suas interfaces

![Diagram of three bodies, theorists, makers and users, drawn as circles at the corners of a triangle. Each edge between two bodies is an interface drawn as a band, labeled with the assumptions that cross it: theorist to maker carries the specification, its units and its operating envelope; maker to user carries the API, the version and the voltage and timing limits; user to theorist carries the actual use, the observed failures and the intent that was never written. Dashed portions of each band mark assumptions that no body writes down or checks.](/figures/three-body/three-bodies.svg)

*Figura 1. Os três corpos e suas três interfaces. Diagrama. Os corpos são desenhados sólidos porque cada um é coerente isoladamente. As faixas tracejadas são as suposições não examinadas onde se originam as falhas. Uma [cópia PNG](/figures/three-body/three-bodies.png) é fornecida.*

<div id="31-theorist-to-maker" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Teórico para construtor

Uma declaração de teórico assume um domínio: unidades, intervalos, um envelope operacional, uma máquina idealizada. A implementação de um construtor assume que a declaração está completa. Quando nenhum dos dois registra o envelope, a implementação está correta para um mundo que não é aquele em que será executada.

A perda da Mars Climate Orbiter em 1999 é o caso clássico. O Conselho de Investigação de Incidentes constatou que o software terrestre forneceu dados de impulso dos propulsores em unidades inglesas (pound-force seconds) onde o software de navegação esperava unidades métricas (newton seconds), e que o erro se acumulou durante a viagem até que a espaçonave entrou na atmosfera muito abaixo da altitude planejada [12]. Cada parte fez seu próprio trabalho. A unidade era uma suposição de interface que ninguém verificou.

<div id="32-maker-to-user" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Construtor para usuário

Um fabricante publica uma interface e um usuário depende dela. A documentação declara parte do contrato. O resto é o que a implementação acontecerá. A observação de Hyrum indica a consequência: com usuários suficientes de uma API, todo comportamento observável do sistema será dependido por alguém, independentemente do que o contrato prometa [13]. O ensaio de Spolsky sobre abstrações vazantes faz o ponto complementar: toda abstração não trivial expõe, em algum grau, o que foi construído para ocultar [14].

O primeiro voo da Ariane 5 em 1996 demonstra como a suposição de um fabricante se propaga para um novo usuário. A comissão de investigação constatou que o software de referência inercial reutilizado da Ariane 4 converteu um valor de ponto flutuante de 64 bits relacionado à velocidade horizontal em um inteiro com sinal de 16 bits; na trajetória mais rápida da Ariane 5 o valor excedeu o intervalo, a conversão gerou uma exceção, ambas as unidades de referência foram desligadas e o lançador se desintegrou cerca de 40 segundos após o início da sequência de voo [15]. O software estava correto para o envelope para o qual foi escrito. O envelope era uma suposição de interface que viajou com o código sem ser restabelecida ou verificada [15, 16].

O mesmo padrão aparece na fronteira de hardware. Um conjunto de instruções é um contrato que os fornecedores revisam. A especificação não privilegiada do RISC‑V lista várias bases ratificadas e uma lista longa e crescente de extensões ratificadas [17]. A Apple migrou o Mac de processadores Intel para Apple silicon, anunciado em 2020, e fornece o Rosetta como camada de tradução para aplicações construídas para o contrato anterior; a página da Apple também afirma que a partir do macOS 28 o Rosetta permanecerá apenas para certos jogos mais antigos [18]. A camada de tradução é ela própria uma interface com um fim publicado. Software escrito como se o contrato de instrução fosse fixo encontra uma revisão que não esperava, e a solução é outra camada de interface.

<div id="33-user-to-theorist" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Usuário para teórico

O caminho de retorno é o menos examinado. Os usuários aprendem o que um sistema realmente faz, onde ele falha e o que pretendiam solicitar. A menos que esse conhecimento retorne aos teóricos como uma declaração revisada, a próxima especificação repete as suposições antigas. O relato de Zave e Jackson sobre requisitos torna a lacuna precisa: um requisito é uma declaração sobre o ambiente, uma especificação é uma declaração na interface, e o conhecimento de domínio que os conecta costuma estar não escrito [19]. O “hardware lottery” de Hooker demonstra o caminho de retorno funcionando ao contrário: ideias de pesquisa têm sucesso ou fracassam de acordo com o hardware e o software que estão disponíveis, não apenas por seus méritos, de modo que o que os criadores constroem molda o que os teóricos podem pensar [20].

<div id="34-why-the-instability-looks-irreducible" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Por que a instabilidade parece irredutível

Cada corpo vê apenas seu próprio modelo coerente. De dentro de qualquer corpo, as falhas acima parecem azar ou erro de outrem, porque a causa está em uma borda que nenhum corpo possui. Esta é a contraparte computacional da afirmação de que três corpos não têm fórmula simples: nenhum modelo de participante único prevê o todo. Sculley e colegas encontraram a mesma estrutura dentro de sistemas de aprendizado de máquina, onde o código do modelo é uma pequena parte do sistema e a maior parte do custo de manutenção reside em código de cola, configuração, dependências de dados e consumidores não declarados, isto é, em interfaces [21].

<div id="4-the-interface-literature" class="anchor-alias" aria-hidden="true"></div>

## 4. A literatura de interface

A tese não é nova em suas partes. Sua contribuição consiste em reuni‑las em uma única afirmação e anexar uma configuração estabilizadora e um teste.

**A estrutura segue a comunicação.** Conway observou em 1968 que organizações que projetam sistemas produzem projetos que copiam a estrutura de comunicação da organização [22]. MacCormack, Baldwin e Rusnak testaram essa hipótese de espelhamento em pares correspondentes de produtos construídos por organizações fortemente e frouxamente acopladas e descobriram que as arquiteturas dos produtos diferem na direção prevista [23]. Se os corpos não se comunicam através de uma aresta, o sistema possui uma interface não examinada naquela aresta.

**As interfaces são onde o conhecimento de design reside.** Parnas argumentou em 1972 que um sistema deve ser dividido em módulos pelas decisões que cada módulo oculta, de modo que uma mudança em uma decisão fique confinada a um módulo [24]. Baldwin e Clark generalizaram isso em regras de design: decisões de interface visíveis fixadas antecipadamente, atrás das quais módulos ocultos podem variar [25]. Henderson e Clark mostraram que empresas estabelecidas falham na inovação arquitetural, uma mudança em como componentes conhecidos são ligados, porque seu conhecimento das interfaces está incorporado em sua organização e permanece não examinado [26].

**A correção deve ser verificada nas extremidades.** O argumento de ponta a ponta de Saltzer, Reed e Clark sustenta que uma função pode ser implementada completa e corretamente apenas com o conhecimento da aplicação nos pontos finais, de modo que verificações nas camadas inferiores são, no máximo, auxílios de desempenho [27]. O argumento não afirma que interfaces intermediárias não precisam de verificações. Ele diz que a propriedade que importa deve ser verificada onde seu significado é conhecido.

**Contratos tornam as suposições explícitas.** Hoare atribuiu pré‑condições e pós‑condições a programas em 1969 [28]. Meyer transformou‑as em design por contrato, onde cada rotina declara o que requer e o que garante [29]. Liskov e Wing definiram quando um componente pode substituir outro: quando preserva o comportamento do qual seus usuários dependem [30]. Cada um é uma forma de registrar uma suposição de interface para que possa ser verificada.

**A reutilização falha em suposições incompatíveis.** Garlan, Allen e Ockerbloom descobriram em 1995 que a construção de um sistema a partir de partes existentes falhou porque cada parte fazia suposições implícitas sobre as demais, sobre controle, dados, protocolos e o ambiente, e que essas suposições entravam em conflito [31]. Revisitando o problema em 2009, constataram que ele ainda persistia [32].

**Acidentes são falhas de interação.** O relato teórico‑sistêmico de Leveson trata a segurança como um problema de controle: acidentes surgem de interações inseguras entre componentes que atendem a suas próprias especificações [33]. O breve tratado de Cook sobre falha de sistemas complexos diz o mesmo a partir das operações: catástrofe requer múltiplas falhas, e o sistema geralmente opera em modo degradado [34]. As observações de Lehman sobre evolução de software acrescentam o tempo: um programa usado no mundo deve continuar mudando, e sua complexidade cresce a menos que se trabalhe para reduzi‑la [35].

**Kernels verificados mostram que um limite pode ser uma prova.** seL4 foi o primeiro kernel de sistema operacional de uso geral com uma prova verificada por máquina de que sua implementação atende à sua especificação [36]. A prova é uma verificação de interface tornada total: entre a especificação e o código, nada é assumido.

<div id="5-definitions-and-propositions" class="anchor-alias" aria-hidden="true"></div>

## 5. Definições e proposições

<div id="51-definitions" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Definições

**Definição 1 (corpo).** Um corpo é uma parte com um modelo internamente coerente de um sistema: um teórico, um criador ou um usuário. Um corpo pode ser uma pessoa, uma equipe, uma organização ou um programa.

**Definição 2 (interface).** Uma interface é uma transferência entre dois corpos, ou entre dois níveis de uma pilha, através da qual a saída de um lado se torna a entrada do outro lado.

**Definição 3 (suposição de interface).** Uma suposição de interface é um predicado $a$ sobre os valores que atravessam uma interface, dos quais o lado receptor depende para sua própria correção. Exemplos: uma unidade, um intervalo, um tipo, uma tensão, um limite de tempo, uma versão, um envelope.

**Definição 4 (verificada e não examinada).** Uma suposição é verificada quando um mecanismo avalia $a$ a cada travessia e rejeita a travessia quando $a$ falha. É não examinada quando é utilizada mas não está escrita nem avaliada.

**Definição 5 (pilha).** Uma pilha é uma sequência de níveis $L_0, \dots, L_n$ onde cada nível consome o nível inferior apenas através da interface entre eles. Um corpo pode possuir vários níveis; uma interface pode unir dois corpos ou dois níveis de um mesmo corpo.

**Definição 6 (agente geral).** Seguindo Legg e Hutter, um agente geral é aquele cujo desempenho é medido em uma ampla classe de ambientes, não em uma única tarefa [37]. Morris e colegas operacionalizam níveis de AGI tanto por desempenho quanto por generalidade [38]. Para este artigo, a propriedade relevante é a generalidade entre corpos: o agente deve atuar como teórico, criador e usuário, e em todos os níveis da pilha.

<div id="52-propositions" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Proposições

**Proposição 1 (falhas originam‑se em interfaces não examinadas).** Se todo corpo está correto em relação ao seu próprio modelo, então toda falha do sistema composto viola ao menos uma suposição de interface, e se toda suposição for verificada, a primeira suposição violada é recusada na interface onde ocorre.

*Esboço da prova.* Se todo corpo está correto relativo às suas entradas e toda entrada satisfaz as suposições das quais o corpo depende, a composição está correta por indução sobre a pilha. Uma falha, portanto, requer algum cruzamento no qual uma suposição falha. Se essa suposição for verificada, o cruzamento é recusado ali, de modo que a falha fica localizada naquela interface e não se propaga. ∎

**Proposição 2 (desajustes não verificados se propagam).** Se uma suposição na interface entre $L_k$ e $L_{k+1}$ não for examinada, uma violação nessa interface pode gerar valores errados em todos os níveis acima de $k$, e nenhuma verificação em um nível acima de $k$ que seja formulada apenas nos termos desse nível pode localizá‑la.

*Esboço.* Níveis acima de $k$ veem apenas as saídas de $L_{k+1}$, que são bem formadas em relação ao modelo próprio de $L_{k+1}$. O Mars Climate Orbiter é o exemplo: a solução de navegação era internamente consistente e errada [12].

**Proposição 3 (a configuração estabilizada).** Em uma pilha onde toda suposição de interface é explícita e verificada, uma correção feita no nível $k$ que passa na verificação de seu próprio limite deixa intactas todas as propriedades estabelecidas pelas verificações dos demais limites, e todo nível acima de $k$ herda a correção sem alteração.

*Esboço.* As verificações nos demais limites avaliam predicados sobre os valores que cruzam esses limites. O $L_k$ corrigido altera apenas valores que cruzam os limites de $L_k$, e seus valores de saída satisfazem a suposição verificada do limite acima dele. Cada nível acima de $k$ consome $L_k$ apenas por meio de uma interface verificada, de modo que, se o $L_k$ corrigido satisfaz essa interface, os consumidores recebem uma entrada correta. ∎

**Proposição 4 (a busca por AGI impõe explicitude).** Seja um agente geral, no sentido da Definição 6, exigido a passar por um portão de correção em tarefas extraídas de todos os três corpos e de todos os níveis da pilha. Então, para cada interface que a distribuição de tarefas cruza, ou o agente torna a suposição de interface explícita e a verifica, ou existe uma tarefa na qual o sucesso do agente depende de um palpite não verificado sobre essa suposição.

*Argumento.* Um sistema restrito pode contar com a convenção de seu único ambiente: um sistema de unidades fixo, um conjunto de instruções fixo, uma versão fixa. Um agente geral enfrenta ambientes nos quais essas convenções diferem, por construção da generalidade. Uma suposição que vale em um ambiente e falha em outro deve ser detectada para ser tratada, e detectá‑la é verificá‑la. Um portão de correção é um teste que uma execução ou passa ou falha, sem crédito parcial. Sob tal portão, um palpite que acaba sendo errado é uma tarefa falhada, não crédito parcial. Assim, a busca por generalidade sob um portão gera pressão por interfaces explícitas e verificadas em cada fronteira que o agente toca. A proposição não afirma que algum sistema atual atenda a esse padrão. Ela descreve o que o objetivo requer.

**Proposição 5 (joules classificam as configurações estáveis).** Entre pilhas que passam pelo portão, a que resolve cada interface com a menor energia até a conclusão é preferida, e uma verificação explícita realizada uma vez em uma interface é mais barata ao longo de uma carga de trabalho do que uma falha redescoberta em cada nível acima dela.

*Esboço.* A ordenação é portão então classificação: correção é uma restrição que todo candidato deve satisfazer, e energia até a conclusão, em joules, ordena apenas os candidatos que a satisfazem, como em otimização restrita onde o objetivo é comparado apenas sobre o conjunto factível. Uma verificação na fronteira tem um custo fixo por travessia. Uma incompatibilidade não examinada tem um custo em cada nível que alcança, e esse custo se repete em cada execução até que a incompatibilidade seja encontrada.

<div id="6-the-stabilized-configuration" class="anchor-alias" aria-hidden="true"></div>

## 6. A configuração estabilizada

![Diagram of the same three bodies, now arranged at the corners of an equilateral triangle inside a rotating frame, in the manner of the Lagrange configuration. Each interface band is solid and carries a check mark and a short label: the specification written once, the gate at entry, and the trace and receipt that return to the theorist. At the centre sits a shared frame labeled one specification, one gate, joules as the ranking.](/figures/three-body/stabilized.svg)

*Figura 2. A configuração estabilizada. Diagrama. Na física, três corpos mantêm suas posições relativas em um referencial que gira com eles. Na computação, o referencial compartilhado é uma declaração explícita, verificável por máquina, de intenção com cada suposição de interface checada, de modo que os três corpos preservam suas relações à medida que o sistema muda. Uma [cópia PNG](/figures/three-body/stabilized.png) é fornecida.*

<div id="61-the-shared-frame" class="anchor-alias" aria-hidden="true"></div>

### 6.1 O quadro compartilhado

As configurações de Lagrange são estáveis apenas em um referencial que se move com os corpos. O contraponto computacional é uma representação compartilhada que os três corpos leem e escrevem, na qual cada suposição de interface é uma afirmação verificável: uma especificação formal, um contrato verificado por máquina ou um tipo. Quando a afirmação do teórico, a implementação do criador e o comportamento observado pelo usuário são relacionados por verificações contra uma dessas representações, as transições entre eles são verificações e não traduções.

<div id="62-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Cada suposição de interface explícita

![Diagram of a stack with six levels from intent at the top through specification, gate, projections and runtime to hardware and energy. Between each pair of adjacent levels sits an interface drawn as a small gate with its assumption and its check written beside it. A correction made at the runtime level is drawn with arrows rising through each checked interface to the levels above.](/figures/three-body/stack-checks.svg)

*Figura 3. A pilha com todas as interfaces verificadas. Diagrama. Uma cópia em [PNG](/figures/three-body/stack-checks.png) é fornecida.*

O método possui três etapas. Liste cada fronteira da pilha. Para cada uma, escreva a suposição de que o lado receptor depende como um predicado e nomeie o mecanismo que a avalia em cada travessia. Quando uma verificação falha, a ruptura é localizada naquela fronteira; a correção é feita naquele nível, passada através da verificação dessa fronteira e herdada pelos níveis superiores.

<div id="63-evidence-from-verified-systems" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Evidências de sistemas verificados

A existência de configurações estabilizadas, no sentido da Proposição 3, é apoiada por sistemas construídos e testados por grupos independentes.

- **Um compilador verificado sob teste aleatório.** CompCert é um compilador C cujo meio e back‑end otimizadores carregam uma prova verificada por máquina de que o código gerado preserva a semântica da fonte [39]. Yang, Chen, Eide e Regehr executaram o Csmith, um gerador de programas aleatórios, contra o CompCert e muitos outros compiladores. Eles relataram centenas de bugs previamente desconhecidos nos outros compiladores. No CompCert não encontraram erros de código incorreto no meio‑end verificado. Os defeitos que encontraram estavam em partes fora da prova, como a frente‑end e uma suposição não verificada sobre o alvo [40]. Falhas apareceram onde uma suposição ficou sem verificação, como as Proposições 1 e 2 preveem, e não em limites verificados.
- **Uma fronteira de kernel verificada.** A prova do seL4 relaciona sua implementação em C a uma especificação abstrata, de modo que entre especificação e código nada é assumido [36]. A prova é declarada em relação a suposições explícitas sobre o compilador, o código de montagem e o hardware, o que demonstra o método da Seção 6.2 na prática: as suposições residuais são anotadas como as interfaces restantes.
- **Especificações na prática industrial.** Newcombe e colegas relatam que engenheiros da Amazon Web Services escreveram especificações TLA+ para sistemas distribuídos centrais, e que a verificação de modelo encontrou bugs de design sutis, alguns exigindo longas sequências de eventos, que revisão e teste haviam perdido [41].
- **Unidades como interface verificada.** Os tipos de dimensão de Kennedy tornam a unidade de uma quantidade parte de seu tipo, de modo que um valor pound‑force‑second não pode ser passado onde se espera um valor newton‑second sem conversão explícita [42]. A suposição de interface por trás da perda do Mars Climate Orbiter [12] torna‑se uma recusa em tempo de compilação.

Esta evidência provém de sistemas individuais, cada um construído com verificações em mente. Ela demonstra que a configuração estabilizada existe e pode ser mantida. Não demonstra que a configuração se estende a pilhas que abrangem várias organizações. Os protocolos da Seção 8 foram escritos para testar isso.

<div id="7-the-hardware-side" class="anchor-alias" aria-hidden="true"></div>

## 7. O lado do hardware

A fronteira de hardware é onde as suposições de interface se tornam físicas: uma tensão de alimentação, um envelope térmico, um modelo de memória, um contrato de instrução. A Seção 3.2 apresentou o contrato de instrução como exemplo de interface do fabricante que é revisada ao longo do tempo [17, 18]. Uma pilha que trata o hardware como fixo possui uma interface não examinada em seu nível mais baixo, e a Proposição 2 afirma que um descompasso nesse ponto pode alcançar todos os níveis acima.

Neste artigo, o lado de hardware é um conjunto de interfaces a serem explicitadas, e um resultado de hardware entra sob o mesmo portão e a mesma classificação de energia que o software.

<div id="8-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. Protocolos

Cada protocolo é fixado antes de sua execução. As figuras de energia apresentam um de três rótulos: `est_j` para uma estimativa analítica, `reported_j` para uma leitura de um sistema operacional ou contador on-chip, e `measured_j` para uma leitura de um medidor de energia externo.

<div id="81-interface-inventory" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Inventário de interface

Para um sistema‑alvo, enumere todas as interfaces entre corpos e entre níveis. Para cada uma, registre a suposição como um predicado, seu proprietário e se um mecanismo a verifica. Relate a fração de suposições que são verificadas e a fração que não têm proprietário. Dois auditores independentes inventariam o mesmo sistema; relate o grau de concordância deles.

<div id="82-break-and-catch" class="anchor-alias" aria-hidden="true"></div>

### 8.2 Quebrar e capturar

Para cada suposição registrada, injete uma violação naquela interface em um conjunto de sementes fixo. Registre se a violação é recusada naquela interface, capturada em um nível posterior ou não capturada. A Proposição 1 prevê que suposições verificadas são recusadas em sua própria interface. A Proposição 2 prevê que suposições não examinadas, quando capturadas, são capturadas mais tarde e não são localizadas.

<div id="83-compounding" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Composição

Execute uma carga de trabalho fixa por $R$ rodadas com e sem uma correção promovida em um nível escolhido. Registre as escaladas, falhas e energia por rodada. A Proposição 3 prevê que as escaladas cumulativas com a correção não são maiores em nenhuma rodada, e que nenhuma propriedade verificada antes da promoção falha depois dela.

<div id="84-cross-body-handoff" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Transferência entre corpos

Escolha uma entrega real entre organizações: uma especificação passada a um implementador, uma biblioteca entregue a usuários downstream ou uma revisão de hardware entregue a software. Expresse a entrega como uma representação compartilhada com suposições explícitas, execute o protocolo de quebra e captura sobre ela e compare com a mesma entrega realizada por documentação em prosa. Relate falhas localizadas na interface em cada braço, com intervalos de Wilson de 95 %.

<div id="85-generality-under-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Generalidade sob o portão

Construa um conjunto de tarefas que varie as convenções nas interfaces: unidades, contratos de instrução, versões de bibliotecas, codificações. Avalie os agentes sob um portão de correção. A Proposição 4 prevê que o sucesso em todo o conjunto variado requer a detecção da convenção, de modo que agentes que verificam explicitamente as suposições da interface devem passar uma parcela maior das tarefas variadas do que agentes que assumem um padrão, com sucesso equivalente nas tarefas padrão. Classifique os agentes aprovados por joules até a conclusão.

<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. Falsificadores

Fixed before the runs they test.

| ID | Observation | Defeats |
|---|---|---|
| TBP-F1 | No protocolo de interrupção e captura, uma violação de uma suposição verificada é aceita em sua própria interface | Proposição 1 conforme declarada para o sistema sob teste |
| TBP-F2 | No protocolo de composição, uma correção que passa sua própria verificação de limite faz com que uma verificação previamente aprovada em outro limite falhe | Proposição 3 |
| TBP-F3 | No protocolo cross-body, a representação compartilhada localiza não mais falhas de interface do que a documentação em prosa, dentro dos intervalos | A alegação de que interfaces verificadas explicitamente estabilizam as transferências entre corpos |
| TBP-F4 | No protocolo de generalidade, agentes que assumem valores padrão completam as tarefas variadas a uma taxa não inferior à dos agentes que verificam, com desempenho padrão correspondente | Proposição 4 |
| TBP-F5 | Um inventário de interface de um sistema em funcionamento encontra falhas cuja causa não pode ser atribuída a nenhuma suposição de interface, com cada corpo correto ao seu próprio modelo | A explicação de interface da instabilidade |

<div id="10-limits-of-the-argument" class="anchor-alias" aria-hidden="true"></div>
<div id="10-scope-and-method" class="anchor-alias" aria-hidden="true"></div>

## 10. Escopo e método

A física entra como estrutura. Ela fornece o vocabulário de corpos, relações e configurações estáveis, e cada proposição é declarada e testada nos próprios termos da computação. Alegações sobre sensibilidade são alegações sobre como os resultados dependem de incompatibilidades não examinadas, e são medidas estatisticamente em grande N, da maneira de Stone e Leigh [7].

A explicitidade é mantida, não declarada. As suposições surgem à medida que um sistema encontra novos ambientes, e o mundo que um programa serve continua mudando [35]. O método, portanto, trata cada suposição descoberta como uma nova interface a ser fechada: escrita como um predicado, fornecida uma verificação e mantida verificada sob a Proposição 3. A configuração estabilizada é mantida da mesma forma que uma espaçonave perto de um ponto de Lagrange é mantida, por meio de manutenção de estação contínua.

A unidade de análise é a transferência entre papéis. Uma pessoa pode ser teórico, criador e usuário em uma tarde, de modo que o método se aplica onde quer que ocorra uma transferência, dentro de uma equipe ou entre organizações. Cada abordagem para construir sistemas, desde métodos formais até grandes modelos com testes até código escrito à mão com revisão, é avaliada pela mesma medida: a fração de suas suposições de interface que são explícitas e verificadas, lida a partir do protocolo de inventário da Seção 8.1.

<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. Conclusão

O problema dos três corpos ensinou à física que a instabilidade pode surgir das relações entre partes simples, e que a estabilidade, quando existe, é um arranjo especial dessas relações em um quadro compartilhado. A computação tem três corpos próprios: teóricos, criadores e usuários, e sua instabilidade provém das interfaces entre eles, onde suposições cruzam-se de forma não escrita e não verificada. Um sistema que visa à inteligência geral deve atuar em todos os três corpos e em todos os níveis da pilha, de modo que não pode deixar essas suposições implícitas. Levar esse objetivo a sério significa registrar cada suposição de interface e verificá‑la em cada cruzamento. Em uma pilha construída dessa forma, uma correção permanece onde foi feita e se propaga para cima, e o sistema mantém sua forma à medida que muda. É assim que a busca pela AGI resolve o problema dos três corpos na computação.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referências

[1] Liu Cixin, *The Three-Body Problem*, translated by Ken Liu. Tor Books, 2014. Original Chinese edition 三体, Chongqing Publishing House, 2008. ISBN 978-0-7653-7706-7.

[2] H. Poincaré, "Sur le problème des trois corps et les équations de la dynamique," *Acta Mathematica* 13, 1890, pp. 1 to 270. Introduction: doi:10.1007/BF02392506

[3] J. Barrow-Green, *Poincaré and the Three Body Problem*. History of Mathematics 11, American Mathematical Society, 1997. doi:10.1090/hmath/011

[4] K. F. Sundman, "Mémoire sur le problème des trois corps," *Acta Mathematica* 36, 1913, pp. 105 to 179. doi:10.1007/BF02422379

[5] Q. Wang, "The global solution of the N-body problem," *Celestial Mechanics and Dynamical Astronomy* 50, 1991, pp. 73 to 88. doi:10.1007/BF00048987

[6] E. N. Lorenz, "Deterministic Nonperiodic Flow," *Journal of the Atmospheric Sciences* 20(2), 1963, pp. 130 to 141. doi:10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2

[7] N. C. Stone and N. W. C. Leigh, "A statistical solution to the chaotic, non-hierarchical three-body problem," *Nature* 576, 2019, pp. 406 to 410. doi:10.1038/s41586-019-1833-8

[8] E. J. Routh, "On Laplace's Three Particles, with a Supplement on the Stability of Steady Motion," *Proceedings of the London Mathematical Society* s1-6, 1874, pp. 86 to 97. doi:10.1112/plms/s1-6.1.86

[9] C. Moore, "Braids in classical dynamics," *Physical Review Letters* 70, 1993, pp. 3675 to 3679. doi:10.1103/PhysRevLett.70.3675

[10] A. Chenciner and R. Montgomery, "A Remarkable Periodic Solution of the Three-Body Problem in the Case of Equal Masses," *Annals of Mathematics* 152(3), 2000, pp. 881 to 901. doi:10.2307/2661357

[11] M. Šuvakov and V. Dmitrašinović, "Three Classes of Newtonian Three-Body Planar Periodic Orbits," *Physical Review Letters* 110, 114301, 2013. doi:10.1103/PhysRevLett.110.114301

[12] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[13] H. Wright, "Hyrum's Law." https://www.hyrumslaw.com/

[14] J. Spolsky, "The Law of Leaky Abstractions," *Joel on Software*, 11 November 2002. https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/

[15] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[16] G. Le Lann, "An analysis of the Ariane 5 flight 501 failure: a system engineering perspective," *Proceedings of the IEEE International Conference on the Engineering of Computer-Based Systems*, 1997, pp. 339 to 346. doi:10.1109/ECBS.1997.581900

[17] RISC-V International, *The RISC-V Instruction Set Manual, Volume I: Unprivileged Architecture*, version 20250508, preface. https://docs.riscv.org/reference/isa/v20250508/unpriv/colophon.html

[18] Apple, "Using Intel-based apps on a Mac with Apple silicon," Apple Support, article 102527, published 21 September 2026. https://support.apple.com/en-us/102527

[19] P. Zave and M. Jackson, "Four Dark Corners of Requirements Engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997, pp. 1 to 30. doi:10.1145/237432.237434

[20] S. Hooker, "The Hardware Lottery," *Communications of the ACM* 64(12), 2021, pp. 58 to 65. doi:10.1145/3467017

[21] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[22] M. E. Conway, "How Do Committees Invent?" *Datamation* 14(4), April 1968, pp. 28 to 31. https://www.melconway.com/Home/Committees_Paper.html

[23] A. MacCormack, C. Baldwin and J. Rusnak, "Exploring the duality between product and organizational architectures: A test of the 'mirroring' hypothesis," *Research Policy* 41(8), 2012, pp. 1309 to 1324. doi:10.1016/j.respol.2012.04.011

[24] D. L. Parnas, "On the criteria to be used in decomposing systems into modules," *Communications of the ACM* 15(12), 1972, pp. 1053 to 1058. doi:10.1145/361598.361623

[25] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[26] R. M. Henderson and K. B. Clark, "Architectural Innovation: The Reconfiguration of Existing Product Technologies and the Failure of Established Firms," *Administrative Science Quarterly* 35(1), 1990, pp. 9 to 30. doi:10.2307/2393549

[27] J. H. Saltzer, D. P. Reed and D. D. Clark, "End-to-end arguments in system design," *ACM Transactions on Computer Systems* 2(4), 1984, pp. 277 to 288. doi:10.1145/357401.357402

[28] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969, pp. 576 to 580. doi:10.1145/363235.363259

[29] B. Meyer, "Applying 'design by contract'," *Computer* 25(10), 1992, pp. 40 to 51. doi:10.1109/2.161279

[30] B. H. Liskov and J. M. Wing, "A behavioral notion of subtyping," *ACM Transactions on Programming Languages and Systems* 16(6), 1994, pp. 1811 to 1841. doi:10.1145/197320.197383

[31] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[32] D. Garlan, R. Allen and J. Ockerbloom, "Architectural Mismatch: Why Reuse Is Still So Hard," *IEEE Software* 26(4), 2009, pp. 66 to 69. doi:10.1109/MS.2009.86

[33] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[34] R. I. Cook, "How Complex Systems Fail," Cognitive Technologies Laboratory, University of Chicago, 1998. https://how.complexsystems.fail/

[35] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980, pp. 1060 to 1076. doi:10.1109/PROC.1980.11805

[36] G. Klein, K. Elphinstone, G. Heiser, J. Andronick, D. Cock, P. Derrin, D. Elkaduwe, K. Engelhardt, R. Kolanski, M. Norrish, T. Sewell, H. Tuch and S. Winwood, "seL4: Formal Verification of an OS Kernel," *Proceedings of the 22nd ACM Symposium on Operating Systems Principles*, 2009, pp. 207 to 220. doi:10.1145/1629575.1629596

[37] S. Legg and M. Hutter, "Universal Intelligence: A Definition of Machine Intelligence," *Minds and Machines* 17(4), 2007, pp. 391 to 444. doi:10.1007/s11023-007-9079-x

[38] M. R. Morris, J. Sohl-Dickstein, N. Fiedel, T. Warkentin, A. Dafoe, A. Faust, C. Farabet and S. Legg, "Levels of AGI for Operationalizing Progress on the Path to AGI," *Proceedings of the 41st International Conference on Machine Learning*, 2024. arXiv:2311.02462

[39] X. Leroy, "Formal verification of a realistic compiler," *Communications of the ACM* 52(7), 2009, pp. 107 to 115. doi:10.1145/1538788.1538814

[40] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," *Proceedings of the 32nd ACM SIGPLAN Conference on Programming Language Design and Implementation*, 2011, pp. 283 to 294. doi:10.1145/1993498.1993532

[41] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417

[42] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8
