---
title: "Escrever um jogo uma vez e executá-lo em todo lugar: onde termina a reprodução exata e começa a tolerância"
deck: "Pode um jogo ser escrito uma vez como uma máquina de estados verificada e projetado em vários motores, conjuntos de instruções e pilhas gráficas? Executado em 25 células alvo × hospedeiro multi-ISA por 100.000 tiques sob física inteira Q32.32 (GE-H1: 0 / 20.500 incompatibilidades SHA-256 em arm64 macOS, aarch64 Linux e AMD/Intel x86_64 Linux), 25.000 tiques de ponto flutuante inter-ISA (GE-H2: t_div = 10 Apple libm versus GNU glibc sin/cos, t_div = 406 x86_64 FMA versus arm64 fmadd sem -ffast-math) e 4 GPUs físicas em Metal e Vulkan (GE-H3: desvio de pixel LSB de 1,3%-9,3%, Δ_max ≤ 2, PSNR 64,2-72,1 dB, SSIM ≥ 0,99983), emparelhado com um protótipo jogável WebXR/Canvas Q32.32 com orçamento de joules."
lang: "pt"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*Revisão af57f48, 22 de novembro de 2026. Explorador interativo, inspetor entre GPUs e Arena de Orçamento Cronológico jogável em `Q32.32`: [research.openie.dev/living/game-engines/](/living/game-engines/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Este estudo pergunta se um jogo pode ser escrito uma vez como uma máquina de estado verificada e então projetado através de linguagens, arquiteturas de conjunto de instruções de unidades de processamento central (CPU) (ISAs) e back-ends de unidades de processamento gráfico (GPU). Ambas as especificações pesquisadas e três suítes de falsificação empíricas executadas fornecem uma fronteira nítida: **sim** para as regras do jogo e simulação sob aritmética inteira de ponto fixo ancorada (`(GE-H1)`: `0 / 20,500` Secure Hash Algorithm 256-bit (`SHA-256`) incompatibilidades de ponto de verificação ao longo de `100,000` ticks de uma arena 2D de 16 corpos projetada em `25` células alvo × hospedeiro em `arm64` `macOS 27.2.1`, `aarch64` `Linux 6.8`, e Advanced Micro Devices (`AMD`) Zen 5 e Intel Raptor Lake `x86_64` `Linux 7.0`, variando de `0.073 J` a `13.60 J` no macOS por processo `reported_j` e de `1.89 J` a `181.87 J` no Linux Running Average Power Limit (`RAPL`) pacote `reported_j`); **não** quando transcendentes de ponto flutuante não ancorados ou a redução de fused multiply-add (`FMA`) entram em colisões caóticas multi-corpo (`(GE-H2)`: mesmo *sem* `-ffast-math`, Apple `libSystem` `libm` versus Linux `glibc` `std::sin`/`std::cos` divergem no tick `10`, ISA cruzada `x86_64` `-mavx2 -mfma` versus `arm64` `fmadd` diverge no tick `406`, e V8 `Math.sin` diverge entre ISAs no tick `66`); e **não** para pixels bit-exatos entre fornecedores de GPU, porém **sim** sob um portão de tolerância unidirecional limitado (`(GE-H3)`: entre Apple `Metal`, `AMD` Mesa Radeon Vulkan (`RADV`), Nvidia Vulkan (`NVIDIA`) e Intel Mesa Vulkan (`ANV`) em `512×512` `RGBA8Unorm`, `24 / 24` pares de quadros cross-GPU diferem em `SHA-256` bruto em `1.30%`-`9.34%` dos pixels, mas mantêm erro máximo por canal $\Delta_{\max} \le 2 / 255$, relação sinal-ruído de pico (`PSNR`) `64.16`-`72.06 dB`, e similaridade estrutural (`SSIM`) `0.99983`-`0.99999`, com `measured_j = None` e `board_metered = false`).

**Em palavras simples**

1. **A simulação exata entre chips e linguagens funciona quando a aritmética está fixada em inteiros.** Ao longo de mais de `100.000` tiques (`20.500` pontos de verificação `SHA-256` confirmados), Rust nativo, C++20 (`Clang` e a coleção de compiladores (`GCC`)), WebAssembly (`Wasm`), JavaScript `BigInt` e Python reproduzem o mesmo estado de 732 bytes bit a bit em Apple Silicon (`arm64`), NVIDIA Jetson Thor (`aarch64`), AMD Zen 5 (`x86_64`) e Intel Raptor Lake (`x86_64`) sem nenhuma discrepância.
2. **A física de ponto flutuante padrão deriva entre sistemas operacionais e famílias de CPU mesmo sem `-ffast-math`.** As operações algébricas puras `+`, `-`, `*`, `/` e `sqrt` com `FMA` desativado (`-ffp-contract=off`) coincidem entre `x86_64` e `arm64` para todos os `25.000` tiques testados, mas a chamada de `std::sin`/`std::cos` entre `libm` do macOS e `glibc` do Linux inverte um bit no tique `10` (`0,17 s` a `60 Hz`) e dessincroniza as pontuações do jogo no tique `9.798` (`163,3 s`), enquanto a ativação da contração `FMA` padrão (`-ffp-contract=fast`) diverge entre `x86_64` e `arm64` no tique `406` e dessincroniza o jogo no tique `11.205`.
3. **As placas gráficas não desenham bits idênticos, portanto a renderização pertence a jusante de um portão unidirecional de tolerância.** Entre Apple `Metal`, AMD `RADV` Vulkan, NVIDIA Vulkan e Intel `ANV` Vulkan, `1,3%` a `9,3%` dos pixels diferem por `1` a `2` bits menos significativos (`LSB`), quebrando verificações ingênuas de `SHA-256` do framebuffer enquanto passam na tolerância perceptual (`PSNR > 64 dB`, `SSIM > 0,9998`) porque nenhum valor da GPU jamais flui de volta para o estado da simulação.

![Diagrama da divisão proposta. Uma caixa no topo contém o jogo Forma P igual a S, E, delta, D, lambda, com esquemas de interface tipados e um verificador estrito. As setas levam a quatro projeções: simulação (Rust, WebAssembly, XState, SCXML, Python) e script (Rhai, Lua, Luau) à esquerda na zona exata, julgada por um hash de estado por tique; cena (semelhante a BSN, glTF, OpenUSD) e renderização (Slang, WGSL, WESL) à direita na zona de tolerância, julgada por erro por pixel. Uma linha vertical tracejada marca o limite de determinismo. Uma faixa na parte inferior lista efeitos do hospedeiro que entram apenas como eventos registrados: entrada, relógio, áudio, rede, entrada e saída de recursos, desenhos de GPU, física cosmética.](/figures/game-engines/architecture.svg)

*Figura 1. Divisão proposta. Uma Forma alimenta quatro projeções. Simulação e script ficam na zona exata, julgada por hashes de estado por tique. Cena e renderização ficam na zona de tolerância, julgada por erro por pixel. Efeitos do hospedeiro entram apenas como eventos registrados.*

![Grade com onze representações existentes como linhas (Slang, Naga, WGSL e WESL, glTF, OpenUSD, BSN, SCXML e XState, VGDL, GameRule, nAIVE, SpacetimeDB) e sete colunas de capacidade (comportamento, cena, shader, ordem de execução, multi-destino, registro de reprodução, verificação entre camadas). Células verdes marcam capacidade documentada, âmbar parcial, cinza ausente ou não documentada. A coluna de verificação entre camadas é cinza exceto por marcas parciais em Slang e nAIVE.](/figures/game-engines/coverage.svg)

*Figura 2. Cobertura das representações existentes, avaliadas apenas a partir dos documentos lidos para este estudo. Verde: capacidade documentada. Âmbar: parcial. Cinza: ausente ou não documentada. A coluna mais à direita, verificação entre camadas, está quase vazia.*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. Termos, notação e a ideia sob teste

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF: Mecanismo de Código da Realidade [mesma casa], representação intermediária, sistema de componentes de entidades, máquina de estados finitos e campo de distância assinada</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL: unidade central de processamento, unidade de processamento gráfico, arquitetura(s) de conjunto de instruções, instrução única múltiplos dados, Extensões Vetoriais Avançadas 2, Arm Advanced SIMD, unidade de função especial, pipeline de operações de rasterização e arquitetura móvel Intel Raptor Lake</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8: Instituto de Engenheiros Elétricos e Eletrônicos (como em IEEE 754 de ponto flutuante), multiplicação-fusão-aditiva, opcodes vetoriais x86_64 de multiplicação-fusão-aditiva e multiplicação-aditiva negada, opcodes escalares AArch64 de multiplicação-fusão-aditiva e multiplicação-subtração, unidade no último lugar, bit menos significativo, Algoritmo de Hash Seguro (`SHA-256`), erro absoluto médio, erro quadrático médio da raiz, razão pico sinal-ruído, índice de similaridade estrutural, desvio padrão e formato de framebuffer vermelho-verde-azul-alfa de 8 bits por canal</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, CUDA: Linguagem de Sombreado WebGPU, Linguagem de Sombreado Estendida WebGPU, Representação Intermediária Portátil Padrão V, Linguagem de Sombreado OpenGL, Linguagem de Alto Nível de Sombreado, Linguagem de Sombreado Metal, Direct3D 11, Direct3D 12 e Arquitetura de Dispositivo Unificado de Computação</li>
<li>RADV, ANV, LLVM, GNU, GCC, PE, OS, API, APIs, WebXR, WebMCP, URL, JSON, YAML, README, MB, CS0246, RE, ENGINE, DFU: driver Mesa Radeon Vulkan, driver Mesa Intel Vulkan, infraestrutura de compilador de Máquina Virtual de Baixo Nível, projeto GNU's Not Unix, Coleção de Compiladores GNU, Executável Portátil do Windows, sistema operacional, interface(s) de programação de aplicações, API de Realidade Estendida Web, Protocolo de Contexto de Modelo Web, Localizador Uniforme de Recursos, Notação de Objeto JavaScript, YAML Ain't Markup Language, arquivo de documentação README do repositório, megabytes, diagnóstico de compilador C# de tipo ausente CS0246, RE ENGINE da Capcom (marca “Reach for the Moon” / “RE neXt” do mecanismo) e prefixo DOI de Dagstuhl Follow-Ups</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG: State Chart XML, Linguagem de Descrição de Jogo, Linguagem de Descrição de Videogame, Notação de Cena Bevy, Linguagem Semântica Boldsea, Representação Intermediária de Múltiplos Níveis, transações atômicas/consistentes/isoladas/duráveis, biblioteca de rede de reversão Good Game Peace Out, Formato de Transmissão de Linguagem Gráfica (ISO/IEC 12113:2022), Descrição de Cena Universal Aberta, Descrição de Cena Universal, rede de área local, inteligência artificial e Computational Intelligence and Games</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, V100, GH200, CTC: Benchmark Escalonado de Saciação (Satiation Tiered Benchmark), níveis de telemetria (`L2` contador de socket/pacote, `L3` contador de kernel por processo) [mesma casa], Limite Médio de Potência em Execução (Running Average Power Limit), registrador específico de modelo (model-specific register), identificador de processo (process identifier), `proc_pid_rusage` (`RUSAGE_INFO_V6`), Advanced Micro Devices, NVIDIA Corporation, GPU Volta V100, superchip Grace Hopper GH200 e curva temporal fechada (closed timelike curve)</li>
</ul>

Para manter as referências à frente transparentes de cima para baixo, a Seção 1 define a notação Form, a Seção 2 pesquisa representações de jogos existentes, a Seção 3 analisa divergência de ponto flutuante, a Seção 4 tabula representações intermediárias, a Seção 5 enuncia a divisão de camada proposta, a Seção 6 relata as execuções do falsificador multi-ISA e cross-GPU, a Seção 7 lista indicadores de inviabilidade, e a Seção 8 documenta fontes e limites.

A [Engine de Código da Realidade (RCE)](https://research.openie.dev/about/rce/) trata um programa como uma máquina de estado chamada Form, escrita $P = (S, E, \delta, D, \lambda)$:

- $S$: o conjunto de estados;
- $E$: o conjunto de eventos (entradas);
- $\delta : S \times E \to S$: a função de transição;
- $D$: um log somente-apêndice de cada passo realizado;
- $\lambda$: o mapa de saída do estado para a saída observável.

Um verificador estrito aceita um Form ou nomeia a regra que ele quebra. Emissores então projetam o Form aceito em Rust, Python, JavaScript e Scala. XState (uma biblioteca de statechart JavaScript e TypeScript), SCXML (uma Recomendação do Consórcio World Wide Web) e WebAssembly (`Wasm`) não estão entre os alvos dos emissores; este estudo os trata como projeções candidatas. Porque cada passo vai para $D$, qualquer execução pode ser reproduzida.

Um motor de jogo é uma máquina muito maior. Ele executa uma simulação de passo fixo, uma camada de script, uma descrição de cena e um pipeline de renderização numa GPU. As Seções 1 a 8 perguntam quais dessas camadas podem residir dentro de um Form, quais devem permanecer fora como efeitos do hospedeiro, e onde a exatidão deve ceder lugar à tolerância.

A ideia tem um longo histórico. A especificação da Stanford [Linguagem de Descrição de Jogos (GDL)](http://ggp.stanford.edu/readings/gdl_spec.pdf) cobre “jogos finitos, discretos, determinísticos de múltiplos jogadores com informação completa” e observa que o modelo subjacente natural desses jogos “é uma máquina de estados finita”. O que é novo em um motor de jogo não é a máquina de estados, mas tudo ao seu redor: física de ponto flutuante, scripts, cenas e GPUs.

<div id="2-what-the-landscape-shows" class="anchor-alias" aria-hidden="true"></div>

## 2. O que a paisagem revela

<div id="21-game-logic-as-data-already-works-on-one-backend" class="anchor-alias" aria-hidden="true"></div>

### 2.1 A lógica de jogo como dados já funciona em um único backend

O GameRule ([Multimedia Systems 32:564, 2026](https://doi.org/10.1007/s00530-026-02629-8)) expressa o comportamento como regras *quando-faça* por ator, sobre 14 ações de criar, ler, atualizar e excluir e 6 condições. Seu contrato determinístico é concreto: um único escalonador central executa a partir de um único FixedUpdate, na ordem de declaração, a última escrita prevalece, e as criações e exclusões são adiadas para o fim da travessia. Os autores justificam o contrato citando o manual da Unity, que afirma que a ordem de execução de scripts "não é garantida entre compilações, máquinas ou versões da Unity". Em três jogos de exemplo da Unity (Haunted Jaunt, Survival Shooter e Tanks), o código de comportamento foi reduzido de 572 para 107 linhas (−81,3%).

O custo é medido. A interpretação de regras custa cerca de $c \approx 65\ \mu\text{s}$ por ator por passo. Com um orçamento de passo $T = 20$ ms, o limite de atores é

$$N_{\max} = \frac{T}{c} = \frac{20\ \text{ms}}{65\ \mu\text{s}} \approx 308,$$

o que concorda com a observação do artigo de que o orçamento é excedido entre 200 e 350 atores (23,872 ms com 350). Existe apenas um backend Unity, de modo que a portabilidade entre motores é argumentada, mas não demonstrada.

<div id="22-order-of-execution-can-be-made-deterministic-by-construction" class="anchor-alias" aria-hidden="true"></div>

### 2.2 A ordem de execução pode ser tornada determinística por construção

O padrão ECS armazena o estado do jogo como componentes anexados a identificadores de entidades e executa o comportamento como sistemas sobre eles. Redmond, Castello, Calderón Trilla e Kuper dão-lhe um modelo formal, Core ECS ([arXiv:2508.15264](https://arxiv.org/abs/2508.15264)). Eles provam que um escalonamento em que cada par concorrente de mutações comuta é determinístico, e que dois subescalonamentos que escrevem conjuntos disjuntos de rótulos de componentes podem ser executados em paralelo sem alterar o resultado. Ao analisar o Bevy ECS, EnTT, Flecs, Specs e apecs, eles constatam que nenhum permite anexar um novo componente concorrentemente com outra mutação; tais alterações estruturais são adiadas e aplicadas serialmente. Tasnim e Zhao ([SAC 2026, doi:10.1145/3748522.3779910](https://doi.org/10.1145/3748522.3779910)) acrescentam uma semântica operacional e um sistema de tipos para archetype ECS que rastreia conjuntos de leitura e escrita por sistema, e relatam sobre uma simulação de Tower Defense em que um layout de archetype paralelo alcançou 109,54 quadros por segundo contra 36,13 para uma linha de base orientada a objetos. O spawn e delete diferidos do GameRule é a mesma disciplina, alcançada de forma independente.

<div id="23-compiling-is-not-the-same-as-being-right" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Compilar não é o mesmo que estar certo

O benchmark Mage ([arXiv:2605.07342](https://arxiv.org/abs/2605.07342)) executou 858 tentativas de geração sobre 26 padrões de mecânicas do Unity. Sem uma IR, 43% das saídas passaram na execução (runtime), mas o F1 de mecanismos (concordância entre as mecânicas solicitadas e as implementadas) ficou em apenas cerca de 0,12. Ao condicionar a geração a uma IR, a taxa de aprovação em tempo de execução caiu para 14% a 21%, mas o F1 de mecanismos subiu para 0,82 a 1,00. A taxa de compilação mostrou-se anticorrelacionada com a correção funcional: o erro de tipo ausente CS0246 apareceu 469 vezes sob condicionamento por IR e nenhuma vez sem ele. Uma IR apenas comportamental e uma IR de cena completa foram estatisticamente indistinguíveis (teste de McNemar, p = 1,0). A lição para o RCE é que um verificador que apenas prova que "compila" mede a grandeza errada. As verificações de interface devem ser comportamentais.

<div id="24-public-benchmarks-with-replayable-traces-exist" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Benchmarks públicos com traços reproduzíveis existem

GameCraft-Bench ([arXiv:2606.17861](https://arxiv.org/abs/2606.17861); [repositório](https://github.com/FreedomIntelligence/gamecraft-bench)) oferece 140 tarefas bidimensionais do Godot 4 em 15 famílias. As submissões contêm traços de entrada reproduzíveis. O agente mais forte do artigo alcançou 41.46 % e o repositório posteriormente relata 65.70 %. Não cobre Unity, Unreal, 3D, multijogador ou cenas de física de grande escala. [Summer Engine](https://www.summerengine.com/templates) publica 17 modelos de jogo de código aberto (rally, plataforma, defesa de torre, metroidvania, sobreviventes, tiro em primeira pessoa, multijogador LAN, voxel e outros). O framework General Video Game AI e seu VGDL ([arXiv:1802.10363](https://arxiv.org/abs/1802.10363)) fornecem 120 jogos para um jogador e 60 jogos para dois jogadores, definidos por conjuntos de sprites, interações, terminações e mapeamento de níveis.

<div id="25-convergence-across-industry-and-research" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Convergência entre a indústria e a pesquisa

Vários esforços estão convergindo para a mesma forma: arquivos declarativos de cena e pipeline, uma camada de script em sandbox, uma linguagem de shader moderna e um registo de eventos.

- [nAIVE](https://github.com/poro/nAIVE) é construído em Rust sobre `wgpu` com um ECS (hecs), cenas YAML, materiais e pipelines de renderização, Lua 5.4 com sandbox por entidade, shaders Slang compilados cruzadamente para WGSL, física Rapier, um barramento de eventos com validação de esquema YAML e um executor de testes headless. O seu [site](https://naive.dev/) mostra um ficheiro YAML de 92 linhas que declara um pipeline diferido de cinco passes. O README também descreve uma simulação computacional na GPU que controla mais de 50.000 entidades, uma escolha que coloca essa simulação do lado da tolerância da fronteira delineada a seguir.
- A Capcom descreve o REX (“RE neXt Engine”) como uma evolução gradual do RE ENGINE envolvendo cerca de 200 engenheiros ([Capcom IR](https://www.capcom.co.jp/ir/english/data/oar/2025/re-engine.html)). A cobertura de imprensa ([PC Gamer](https://www.pcgamer.com/gaming-industry/game-development/capcom-announces-plans-to-transform-its-re-engine-into-an-ai-generation-game-engine/)) refere seis programas, entre os quais o Re:Dox, que traduz diferentes tipos de dados num conjunto comum de regras, e o RE:Flows, que converte ideias de mecânicas de jogo numa linguagem de programação normalizada; também indica que mais de 2.000 pessoas utilizam o RE Engine.
- A proposta BSN do Bevy ([discussion 14437](https://github.com/bevyengine/bevy/discussions/14437)) define cenas como valores composáveis de Patch, EntityPatch e DynamicScene com uma macro `bsn!` e um formato de recurso, deixando os manipuladores de eventos por resolver.
- O [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) executa a lógica de jogo como redutores que correm como transações ACID sobre tabelas e reproduz um registo de commits, que é o registo RCE $D$ sob outro nome.
- As Ontologias Executáveis ([doi:10.48550/arXiv.2601.07964](https://doi.org/10.48550/arXiv.2601.07964)) modelam o comportamento de jogo em BSL sobre um grafo de eventos imutável e apenas de adição. O artigo recomenda uma abordagem híbrida na qual a física, a renderização e a animação mantêm abordagens tradicionais de alta frequência, enquanto as missões e as decisões correm sobre o grafo de eventos, unidas através de eventos agregados. Essa é a mesma divisão de camadas proposta aqui.

<div id="3-the-physics-of-divergence-why-exactness-is-binary" class="anchor-alias" aria-hidden="true"></div>

## 3. A física da divergência: por que a exatidão é binária

A adição de ponto flutuante não é associativa. Em hardware paralelo, a ordem de uma redução varia de execução para execução. Um estudo sobre a não associatividade de ponto flutuante em hardware paralelo ([arXiv:2408.05148](https://arxiv.org/abs/2408.05148)) define a variabilidade escalar

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

em que $f_d$ é uma redução determinística e $f_{nd}$ é uma redução não determinística. Ao permutar uma soma de $10^6$ valores de precisão dupla distribuídos normalmente, o resultado variou em até cerca de $4.26 \times 10^{-13}$, e o máximo de $|V_s|$ cresceu como $\sqrt{n}$. Uma redução determinística em árvore custou cerca de 0,2% em relação à acumulação atômica em uma NVIDIA V100, e até 7,8% em uma GH200. Em 1.000 execuções de treinamento de redes de grafos, cada execução produziu pesos distintos.

Um jogo transforma diferenças minúsculas em diferenças visíveis. A dinâmica de corpos rígidos com contato e a dinâmica de muitos corpos são tipicamente caóticas. Sob um expoente de Lyapunov local $\Lambda$, uma perturbação cresce como

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

de modo que o tempo até que ela atinja um tamanho visível na jogabilidade $\Delta$ é

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*Modelo ilustrativo:* considere $\delta_0 \approx 6 \times 10^{-8}$ (um ULP de precisão simples, relativo), $\Delta = 1$ (um objeto do outro lado de uma parede) e um $\Lambda = 2\ \text{s}^{-1}$ assumido. Então $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s. O logaritmo é a chave: reduzir $\delta_0$ um milhão de vezes proporciona apenas cerca de 6,9 segundos a mais. A concordância aproximada, portanto, não pode salvar a simulação. Ou o estado é bit a bit idêntico, ou eventualmente diverge, uma previsão testada diretamente em 25.000 ticks de colisão em múltiplas ISAs abaixo (`GE-H2`).

A prática concorda. A [Gaffer On Games](https://gafferongames.com/post/floating_point_determinism/) registra que o determinismo entre máquinas exige o mesmo compilador e o mesmo conjunto de instruções, que o Battlezone 2 encontrou diferenças entre AMD e Intel em funções transcendentais, e que os replays de MotoGP não puderam ser compartilhados entre o Xbox e computadores pessoais. Ela cita a recomendação de Markstein de proibir a contração FMA e a reassociação. O [guia do Rapier](https://rapier.rs/docs/user_guides/rust/determinism/) mostra um caminho funcional: o determinismo entre plataformas só se mantém com sua funcionalidade `enhanced-determinism` (incompatível com `simd8`), em alvos IEEE 754-2008 (o Wasm se qualifica), usando funções transcendentais implementadas por software.

Para renderização, a [especificação WGSL](https://www.w3.org/TR/WGSL/) afirma que "WGSL às vezes permite vários comportamentos possíveis para um determinado recurso. Isso é um risco de portabilidade." Sua seção de ponto flutuante avança ainda mais: "WGSL não especifica um modo de arredondamento"; "Uma implementação pode reassociar operações"; ela "pode fundir operações se a expressão transformada for pelo menos tão precisa quanto a original"; entradas subnormais e saídas de muitas operações "pode ser reduzido a zero"; e a built-in `fma` "pode ser expandido para um multiplicação ordinária ... e uma adição." Os pixels, portanto, são especificados para diferir entre implementações. A [especificação SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) oferece uma ferramenta mais restrita: sua decoração NoContraction marca uma instrução aritmética que "não pode ser combinada com outra instrução para formar uma única operação", e tais operações "não têm permissão para reassociar". Isso é uma proteção por instrução em um back-end, não uma garantia portátil para um shader inteiro.

<div id="4-the-ir-table" class="anchor-alias" aria-hidden="true"></div>

## 4. A tabela de IR

| Representação | Camada | Propriedade mais forte (documentada) | O que falta para uma Forma |
|---|---|---|---|
| [Slang](https://shader-slang.org/) | Shaders | IR de módulos; back-ends para D3D12, Vulkan, Metal, D3D11, OpenGL, CUDA, WebGPU, CPU; sistema de capacidades | Sem estado do jogo, sem eventos, sem garantia de semântica exata para números de ponto flutuante |
| [Naga](https://github.com/gfx-rs/wgpu/tree/trunk/naga) | Shaders | IR validado; WGSL, SPIR-V e GLSL na entrada; SPIR-V, WGSL, MSL, HLSL e GLSL na saída | O mesmo; sem ligação a um esquema de cena |
| [WGSL](https://www.w3.org/TR/WGSL/) / [WESL](https://wesl-lang.dev/) | Shaders | Análise de uniformidade; WESL adiciona importações, compilação condicional, pacotes, `wgsl-test` | Permite reassociação, fusão e flush-to-zero; sem tipos do lado do hospedeiro |
| [SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) | IR binário de shader | A decoração NoContraction proíbe fusão e reassociação por instrução | Apenas por instrução; sem semântica de jogo |
| [MLIR](https://mlir.llvm.org/) | Infraestrutura de compiladores | Dialetos de múltiplos níveis para lowering | Não é um modelo de jogo; semântica deixada para cada dialeto |
| [glTF 2.0](https://www.khronos.org/gltf/) (ISO/IEC 12113:2022) | Ativos e cena | Padrão de intercâmbio entre ferramentas | Sem comportamento, sem ordem de execução |
| [OpenUSD](https://openusd.org/release/intro.html) | Cena | Arcos de composição, caminhos de espaço de nomes | Autodescrito como “Not a rigging system”; sem semântica de simulação |
| [BSN](https://github.com/bevyengine/bevy/discussions/14437) | Cena | Patches tipados sobre componentes, importações versionadas | Manipuladores de eventos não resolvidos; apenas Bevy |
| [SCXML](https://www.w3.org/TR/scxml/) / [XState](https://stately.ai/docs/xstate) | Comportamento | Semântica de microetapa e macroetapa, prioridade por ordem de documento, regiões paralelas seriais | O modelo de dados é específico da plataforma; sem disciplina numérica, sem cena ou shader |
| [GDL](http://ggp.stanford.edu/readings/gdl_spec.pdf) | Regras | Descrição lógica de jogos finitos, discretos e determinísticos | Sem física contínua, sem renderização |
| [VGDL](https://arxiv.org/abs/1802.10363) | Regras | Jogos compactos em grade 2D, grande corpus público | Apenas grade 2D; sem fidelidade de renderização ou física |
| [Core ECS](https://arxiv.org/abs/2508.15264) | Ordem de execução | Teorema que fornece uma condição para escalonamentos concorrentes determinísticos | Um modelo formal, não um formato de motor; sem cena ou shader |
| [GameRule](https://doi.org/10.1007/s00530-026-02629-8) | Regras | Contrato de escalonador determinístico, economia de código medida | Apenas Unity; cerca de 65 µs por ator; sem verificador formal |
| [nAIVE](https://github.com/poro/nAIVE) | Motor completo | Cenas e pipelines em YAML, Lua, Slang, validação de esquema de eventos | Sem semântica formal publicada ou verificação de tipos entre camadas |
| [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) | Lógica de servidor | Redutores como transações, reprodução de commit-log | Apenas lado do servidor; sem renderização no cliente ou cena |

<div id="5-proposed-architecture" class="anchor-alias" aria-hidden="true"></div>

## 5. Arquitetura proposta

<div id="51-layer-split" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Divisão de camadas

1. **Forma de simulação (exata).** $S$ mantém valores de ponto fixo ou IEEE 754 estrito, com FMA e reassociação desativados e transcendentais implementados em rotinas de software em inteiro ou fixas. $E$ mantém eventos de tique e entradas registradas. $\delta$ usa semântica de macroetapa SCXML: por tique, processa eventos na ordem da fila, resolve conflitos pela ordem do documento, executa regiões paralelas serialmente. Coleções iteram em uma ordem declarada, seguindo o contrato de GameRule (ordem de declaração, última escrita vence, alterações estruturais adiadas para o fim do tique). Onde paralelismo é desejado, o verificador admite apenas escalonamentos que satisfazem a condição de disjunção do Core ECS.
2. **Projeção de script (exata).** Scripts de designer compilam para guardas e ações sobre $S$, emitidos como [Rhai](https://rhai.rs/book/about/features.html) (em sandbox, com garantia “Don’t Panic”, suporte no-std e Wasm), Lua ou [Luau](https://luau.org/) (em sandbox por padrão, com tipos graduais). Os scripts só podem chamar $\delta$ por meio de ações declaradas. Eles não podem ler relógios, fontes aleatórias ou resultados de GPU diretamente.
3. **Projeção de cena (tolerância a jusante).** $\lambda$ mapeia $S$ para uma árvore de patches semelhante a BSN cuja esquema de componentes faz parte da Forma. glTF e OpenUSD servem como alvos de exportação para ativos.
4. **Projeção de renderização (tolerância).** Materiais e passes são autorados em Slang ou WGSL e emitidos por Slang ou Naga para back-ends Metal e Vulkan. A renderização é uma função pura de $\lambda(s)$. Nenhum resultado de GPU jamais flui de volta para $S$.

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Dentro da Forma versus efeitos do hospedeiro

Dentro: estado, transições, ordem de regras, física de ponto fixo para corpos relevantes para a jogabilidade, o gerador aleatório com sua semente em $S$, esquemas de interface. Fora, como eventos registrados: entrada de dispositivo, tempo de relógio de parede, pacotes de rede, saída de áudio, entrada e saída de ativos, desenhos de GPU e qualquer física de terceiros usada para efeitos cosméticos. A reprodução alimenta $D$ de volta através de $\delta$ em vez de tocar dispositivos. O custo de armazenamento é modesto. A uma taxa de tique $f_{\text{tick}} = 60$ Hz e $b = 16$ bytes de entrada por tique, o registro cresce a $f_{\text{tick}} \cdot b = 960$ B/s, cerca de 3,5 MB por hora.

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Fronteira de determinismo

- **Critério da zona exata:** para os alvos A e B e para cada tick $t$, $H(s_t^A) = H(s_t^B)$, em que $H$ é uma função de hash criptográfica sobre uma serialização canônica de $S$.
- **Critério da zona de tolerância:** para quadros renderizados $I^A$ e $I^B$ do mesmo $s_t$, a fração de pixels com erro por canal acima de $\varepsilon$ não deve exceder $p_{\max}$, combinada com pisos limitados de similaridade estrutural (`SSIM`) e de razão sinal-ruído de pico (`PSNR`). A Seção 6.3 executa esta calibração em quatro arquiteturas de GPU (`Metal`, Vulkan `RADV`, Vulkan `NVIDIA` e Vulkan `ANV`).
- A rede de rollback no estilo de [GGPO](https://github.com/pond3r/ggpo), que depende de predição de entradas e execução especulativa, é válida apenas do lado exato desta fronteira.

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Verificação de interface entre camadas

O verificador valida quatro arestas tipadas antes de qualquer emissão: (a) script para simulação: cada ação nomeia uma transição declarada com tipos de argumento correspondentes; (b) simulação para cena: a saída de $\lambda$ corresponde ao esquema do componente; (c) cena para renderização: cada vinculação de material corresponde a um recurso Slang ou WGSL de tipo, grupo e índice de vinculação compatíveis; (d) cobertura de eventos: todo evento que um script escuta é produzível por alguma transição ou fonte host. A constatação da Mage (Seção 2.3) é a razão pela qual as verificações de arestas são julgadas por rastros de comportamento, não pelo sucesso de compilação.

<div id="6-falsifier-first-test-plan-and-executed-multi-isa--cross-gpu-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Plano de teste falsificador-primeiro e resultados multi-ISA / cross-GPU executados

Cada hipótese é listada com seu critério de eliminação. Se o critério for atendido, a alegação é retirada. As subseções 6.1 a 6.4 relatam as três suítes falsificadoras empíricas executadas (`GE-H1` replay multi-ISA `Q32.32` em 25 células alvo × hospedeira, `GE-H2` derivações de ponto flutuante cross-ISA entre `x86_64` e `arm64`/`aarch64`, e `GE-H3` tolerância de renderização headless `wgpu` cross-GPU entre Apple `Metal` e AMD, NVIDIA e Intel `Vulkan`), além de um protótipo interativo de `Q32.32` com orçamento de joules (`GE-H4` a `GE-H9` permanecem em aberto).

| ID | Hipótese | Corpus de teste | Medida | Critério de eliminação | Estado |
|---|---|---|---|---|---|
| GE-H1 | As projeções de simulação são idênticas bit a bit entre linguagens, SOs e ISAs de CPU | Arena 2D de 16 corpos Form (`Q32.32` de ponto fixo, estado de `732` bytes) em `arm64` macOS, `aarch64` Linux e AMD/Intel `x86_64` Linux | $H(s_t)$ em Rust, Wasm32, C++20 (`Clang`/`GCC`), Node.js `BigInt`, Python 3 por $10^5$ ticks (`25` células) | Qualquer incompatibilidade de hash em qualquer ponto de verificação em qualquer célula `(host, target)` | **Executado (`0 / 20.500` incompatibilidades, Seção 6.1)** |
| GE-H2 | Modo estrito versus deriva de limite de ponto flutuante entre ISAs e de biblioteca/FMA | Arena caótica 2D de 16 corpos (`25.000` ticks em `arm64` macOS, `aarch64` Linux e AMD/Intel `x86_64` Linux) | Ticks de divergência exata `t_div` em `f64` estrito, `libm` `sin/cos` entre SOs, FMA entre ISAs, V8 `Math.sin` e `f32` | Incompatibilidade inesperada sob aritmética algébrica fixada ou deriva silenciosa imprevisível | **Executado em `arm64`, `aarch64` e `x86_64` (Seção 6.2)** |
| GE-H3 | A renderização entre GPUs permanece dentro da tolerância limitada (`wgpu` / WGSL) | 4 estados canônicos `Q32.32` (`t = 0, 250, 1k, 10k`) renderizados a `512×512` `RGBA8Unorm` em 4 GPUs físicas (`Metal`, `RADV`, `NVIDIA`, `ANV`) + `llvmpipe` + `CPU Q16.16` | `SHA-256` do framebuffer, `%` de pixels diferentes, $\Delta_{\max}$, MAE, RMSE, `PSNR` e `SSIM` | Qualquer par de GPUs físicas que falhe em `PSNR > 40 dB`, `SSIM > 0.999` ou $p(\Delta > 8) \le 0.001$ | **Executado (`24/24` portão de aprovação: `PSNR 64,2-72,1 dB`, `SSIM ≥ 0,99983`, Seção 6.3)** |
| GE-H4 | Regras codificadas em Form reduzem o código como o GameRule | Comportamentos de Haunted Jaunt, Survival Shooter, Tanks | Linhas de código de comportamento | Redução abaixo de 50% (GameRule alcançou 81,3%) | Aberto |
| GE-H5 | O tempo de execução de Form excede o teto do GameRule | Escalonamento sintético de atores | Tempo de passo contra $N$ | Tempo de passo acima de 20 ms abaixo de $N = 350$ | Aberto |
| GE-H6 | Verificações de interface capturam defeitos reais | 26 padrões do Mage; falhas injetadas de ligação e esquema | Taxa de detecção; F1 do mecanismo | Detecção abaixo de 90% das falhas injetadas ou F1 não melhor que o 0,12 sem IR | Aberto |
| GE-H7 | Varredura completa da inclinação $\ln(\Delta/\delta_0)$ em modelos do Summer Engine | Modelos do Summer Engine pesados em física reexpressos como Forms | Tempo de divergência contra $\delta_0$ injetado | Inclinação de $t^{*}$ contra $\ln(1/\delta_0)$ não distinguível de zero | Aberto |
| GE-H8 | A reprodução é completa | Sessões gravadas de uma hora | Hash final reproduzido a partir de $D$ apenas | Qualquer reprodução que necessite de estado não presente em $D$ | Aberto |
| GE-H9 | Paridade de benchmark | 140 tarefas do GameCraft-Bench via emissor Form-to-Godot | Taxa de aprovação contra submissões nativas do Godot | Taxa de aprovação inferior em entradas idênticas em comportamento | Aberto |

![Resumo empírico em dois painéis através da fronteira de determinismo. O painel esquerdo mostra a Zona Exata GE-H1 (0 divergências em 20,500 checkpoints SHA-256 ao longo de 25 células em arm64 macOS, aarch64 Linux e x86_64 Linux AMD/Intel) e os marcadores de divergência f64 entre ISAs da GE-H2 (t_div = 10 para o libm da Apple versus o sin/cos do GNU glibc, t_div = 406 para VFMADD em x86_64 versus FMADD em arm64 sem -ffast-math). O painel direito mostra as barras de PSNR mínimo da Zona de Tolerância GE-H3 para todos os 6 pares físicos de GPU (Apple Metal, AMD RADV Vulkan, Intel ANV Vulkan, NVIDIA Vulkan), entre 64,2 e 72,1 dB, bem acima do limiar de 40 dB, com diferenças de pixels de 1 a 2 LSB entre 1,3% e 9,3%.](/figures/game-engines/cross-gpu-tolerance.svg)

*Figura 3. Fronteira empírica entre `GE-H1`, `GE-H2` e `GE-H3`. O estado de simulação `Q32.32` a montante (`S`) apresenta `0 / 20,500` divergências de checkpoint `SHA-256` em cinco máquinas e três ISAs, ao passo que o `sin/cos` e o `FMA` em `f64` sem fixação divergem entre fronteiras de SO/ISA dentro de `10` a `406` ticks. A jusante de $\lambda(s_t)$, todas as quatro arquiteturas de GPU produzem digests `SHA-256` `RGBA8Unorm` distintos (diferenças de pixels de `1,3%`-`9,3%` de `1-2` LSB), mantendo-se estritamente acima de `64,1 dB` de `PSNR` e `0,99983` de `SSIM` (`measured_j = None`, `board_metered = false`).*

<div id="61-ge-h1-multi-isa-and-multi-os-100000-tick-determinism-q3232-integer-physics" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `GE-H1`: Multi-ISA e multi-OS determinismo de 100 000 ticks (`Q32.32` física inteira)

*Pré-registrado sob `PREREG_wave3_multi_isa_wgpu.json` (`SHA-256: 1721e5bdffaf...`). A telemetria separa estritamente os níveis `SATB` `L2` e `L3` `reported_j` (`L2`: Linux `/sys/class/powercap/intel-rapl:0/energy_uj` contadores de soquete/pacote e de núcleo; `L3`: macOS por-PID `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj`; `measured_j = None`, `board_metered = false`). Explorador interativo e JSON bruto: [`/living/game-engines/`](/living/game-engines/) ([`results.json`](/living/game-engines/results.json)).*

Um Formulário de arena de colisão elástica 2D com 16 corpos + 4 pickups e FSM de cooldown (`Q32.32` coordenadas fixas assinadas de 64 bits em `[-64, +64]`, produtos intermediários de `128` bits, raiz quadrada inteira por piso `isqrt_u128`, respawn diferido de pickups estruturais, vetor de estado canônico little-endian de `732` bytes) foi executado por `100,000` ticks em **cinco máquinas, três ISAs (`arm64`/`AArch64`, `x86_64`, `wasm32`), dois sistemas operacionais (`macOS 27.2.1`, `Ubuntu Linux 6.8 / 7.0`), e seis projeções de linguagem/compilador (`25` target × host cells)**:**

| Host (`ISA` · `OS`) | Projeção de destino | ms de parede / `100k` (média ± DP) | `ns / tick` | Canal de telemetria (`reported_j`) | `reported_j` / `100k` (J) | Pontos de verificação `SHA-256` verificados |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_native` (`rustc 1.100 -O`) | `22.333 ± 5.043` | `223.3` | `L3` por-PID `ri_energy_nj` | **`0.1028 ± 0.0247`** | `100 / 100` (`stride 1.000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `cpp20_clang_o3` (`Apple Clang 21`) | `21.022 ± 1.657` | `210.2` | `L3` por-PID `ri_energy_nj` | **`0.1090 ± 0.0134`** | `100 / 100` (`stride 1.000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_wasm32_node` (`Node v26.13`) | `84.300 ± 11.334` | `843.0` | `L3` por-PID `ri_energy_nj` | **`0.4480 ± 0.0881`** | `100 / 100` (`stride 1.000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `javascript_bigint_node` (`ES2024`) | `717.955 ± 36.304` | `7.179,6` | `L3` por-PID `ri_energy_nj` | **`4.4021 ± 0.4048`** | `100 / 100` (`stride 1.000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `python_3_13` (`CPython 3.13.14`) | `2.945,816 ± 284.033` | `29.458,2` | `L3` por-PID `ri_energy_nj` | **`13.5999 ± 1.9086`** | `100 / 100` (`stride 1.000`) |
| **Apple M3 Ultra** (`arm64` · `macOS 27.2.1`) | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | `L3` por-PID `ri_energy_nj` | **`0.0729` / `0.0755`** | `2 × 1.000 / 1.000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` - `266.8` | `L2` AMD RAPL pkg (núcleo `0.13`-`0.21 J`) | **`1.958` / `2.349` / `2.932`** | `3 × 1.000 / 1.000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1.347,80` / `2.546,42` | `1.452,9` - `25.464,2` | `L2` AMD RAPL pkg (núcleo `1.01`-`12.23 J`) | **`14.44` / `115.81` / `181.87`** | `3 × 1.000 / 1.000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` - `587.9` | `L2` Intel RAPL pkg (núcleo `1.64`-`2.68 J`) | **`2.062` / `1.888` / `3.026`** | `3 × 1.000 / 1.000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1.390,46` / `3.375,07` | `1.583,5` - `33.750,7` | `L2` Intel RAPL pkg (núcleo `5.65`-`124.90 J`) | **`6.89` / `60.79` / `149.48`** | `3 × 1.000 / 1.000` (`stride 100`) |
| **NVIDIA Jetson Thor** (`Armv9-A` `aarch64` · `Linux 6.8`) | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28` (`GCC`) - `4.407,89` (`Py`) | `392.8` - `44.078,9` | Apenas CPU (`reported_j = null`, GPU intocada) | `null` | `6 × 1.000 / 1.000` (`stride 100`) |

- **Veredito**: **`PASS_ZERO_MISMATCHES` (`0 / 20,500` checkpoints `SHA-256` verificados; `0 / 190,000` comparações pareadas com passo `100` entre as `20` células de rastro completo da Onda 3)**. Todos os alvos em todos os hosts produziram `2683c3f7cb8b...` no tick `100`, `21fa688e4ee8...` no tick `1.000`, `ea01ba793841...` no tick `50.000` e `82e404df6475d64d...` no tick `100.000`.
- **Escopo da telemetria e cobertura de sistemas operacionais**: Observe que `reported_j` de `L2` e de `L3` nunca devem ser confundidos. A `ri_energy_nj` de `L3` no Apple atribui a energia dos núcleos de CPU estritamente ao PID filho submetido ao benchmark (`0.073`-`0.109 J` para Rust e C++ nativos), enquanto `/sys/class/powercap/intel-rapl:0` no Linux (`L2`) integra a potência do pacote de todo o socket, incluindo todos os daemons de segundo plano (`1.89`-`2.06 J` no pacote contra `0.13`-`1.83 J` no subdomínio `core`). A compilação cruzada via `x86_64-w64-mingw32-g++` e `wine64` foi verificada e estava ausente nos runners Linux compartilhados, e o host Windows `x86_64` em hardware dedicado estava desligado durante a execução; a execução de PE para Windows permanece, portanto, não verificada em hardware dedicado, embora o alvo `wasm32-unknown-unknown`, independente do sistema operacional, tenha produzido resultados idênticos em macOS e Linux, tanto em `arm64` quanto em `x86_64`.

<div id="62-ge-h2-cross-isa-and-cross-os-25000-tick-floating-point-drift-ieee-754-f64" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `GE-H2`: Deriva de ponto flutuante de 25.000 ticks cruzando ISA e SO (`IEEE 754` `f64`)

Para testar se simulações `IEEE 754` `binary64` (`f64`) permanecem sincronizadas entre `x86_64` e `arm64`/`aarch64` quando `-ffast-math` está *proibido*, a arena caótica idêntica de 16 corpos foi avançada por `25,000` ticks (`~6.94` minutos a `60 Hz`), hashando bits canônicos `IEEE 754` (`t_div_ieee_bits`), posições quantizadas `10^-3` unidades da arena (`t_div_macro_1e3`) e estado de jogabilidade discreto (`t_div_gameplay`) a cada tick:

| Host / Alvo A | Host / Alvo B | Mecanismo de perturbação | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `arm64` macOS `Clang 21` (`f64_strict`) | AMD Zen 5 & Intel RPL `x86_64` Linux `Clang 21` / `GCC 15.2` | Algebra `f64` cruzamento ISA e SO + `sqrt`, `FMA` desligado (`-ffp-contract=off`, sem trig) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| `x86_64` Linux `glibc 2.43` (`f64_trig`) | `aarch64` Linux `glibc 2.39` (`f64_trig`) | Cruzamento ISA Linux GNU `glibc` `std::sin/cos` (`-ffp-contract=off`, sem `-ffast-math`) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **Cruzamento SO padrão `libm` `std::sin/cos` (`Apple libSystem` vs `GNU glibc`, sem `-ffast-math`)** | **`10`** (`0.17 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **Cruzamento ISA `FMA` reduzindo (`x86_64 VFMADD/VFNMADD` vs `AArch64 FMADD/FMSUB`, apenas algébrico, sem `-ffast-math`)** | **`406`** (`6.77 s`) | **`7,422`** | **`11,205`** (`186.8 s`) |
| **`x86_64` Linux `Node v22.22` (`f64_trig`)** | **`aarch64` Linux `Node v24.22` (`f64_trig`)** | **Cruzamento ISA Node.js V8 `Math.sin/cos` (`x86_64` vs `aarch64`)** | **`66`** (`1.10 s`) | **`7,617`** | **`10,093`** (`168.2 s`) |
| **`cpp_f64_strict` (`-ffp-contract=off`)** | **`cpp_f64_fma` / `-ffast-math`** | **Contração `FMA` no mesmo host (`-ffp-contract=off` vs `-ffp-contract=fast`)** | **`192`** (`3.20 s`) | **`5,927`-`6,576`** | **`8,869`-`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **Redução de precisão (`binary64` `f64` vs `binary32` `f32`)** | **`1`** | **`8`-`9`** | **`1,370`-`2,240`** |

Três descobertas nítidas entre-ISA emergem:

1. **IEEE 754-2008 `+`, `-`, `*`, `/` e `sqrt` com `FMA` desativado (`-ffp-contract=off`) são portáveis bit a bit entre `x86_64` e `arm64`/`aarch64`** (`0` incompatibilidades em `25.000` tiques entre `Clang`, `GCC`, `Rustc` e `V8`), porque as cinco operações são obrigadas a arredondar para `0,5` ULP.
2. **O `std::sin`/`std::cos` padrão de C++ quebra a determinística entre-SO no tique `10` (`0,17 s`) mesmo com `-ffp-contract=off -fno-fast-math`**: o `libm` `libSystem` da Apple e o `glibc` da GNU arredondam um impulso de direção de forma diferente em `1` ULP no tique `10`, o que colisões caóticas de 16 corpos amplificam em erro de posição `> 10^-3` no tique `5.900` e dessincronização discreta de pontuação/coleta no tique `9.798` (`163,3 s`).
3. **A contração `FMA` padrão do compilador (`-ffp-contract=fast`, sem `-ffast-math` nem qualquer trigonometria) quebra a determinística entre-ISA no tique `406` (`6,77 s`)**: enquanto AMD Zen 5 e Intel Raptor Lake concordam bit a bit em `x86_64` (`844172b5...`), e Apple M3 Ultra e Jetson Thor concordam bit a bit em `AArch64` (`deeb446c...`), o LLVM reduz expressões de multiplicação-subtração negada de forma diferente entre `x86_64` (`AVX2` `VFMADD`/`VFNMADD`) e `AArch64` (`NEON` `FMADD`/`FMSUB`), dessincronizando o jogo no tique `11.205`.

<div id="63-ge-h3-cross-gpu-headless-wgpu-metal--vulkan-rendering-tolerance" class="anchor-alias" aria-hidden="true"></div>

### 6.3 `GE-H3`: Tolerância de renderização `wgpu` headless entre GPUs (`Metal` / `Vulkan`)

Para testar empiricamente o lado direito da Figura 1, um benchmark headless `wgpu` (`v22.1.0`) em Rust, autocontido, denominado `ge_h3_wgpu_bench`, renderizou quatro instantâneos canônicos de simulação em `Q32.32` (`ticks 0, 250, 1.000, 10.000`) em framebuffers `RGBA8Unorm` de `512×512` (`262.144` pixels, `1.048.576` bytes/quadro). A renderização empregou um pipeline WGSL de duas passagens: um fundo procedural trigonométrico (radar/grade) seguido de `20` entidades SDF e esferas/toróides 3D iluminadas por Blinn-Phong, compostas por mistura alfa `SrcAlpha / OneMinusSrcAlpha` na ordem de declaração. Como referência, utilizou-se um rasterizador de software inteiro `CPU Q16.16`, sem qualquer operação em ponto flutuante.

| Adaptador A (`API` · Driver) | Adaptador B (`API` · Driver) | Média de pixels diferentes (`%`) | Máx. $|\Delta|$ (`0..255`) | MAE médio (`u8`) | RMSE médio (`u8`) | `PSNR` mínimo (`dB`) | `SSIM` mínimo | Critério `GE-H3` |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **Apple M3 Ultra (`Metal` 4)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `1,301%` | `2` | `0,00386` | `0,06215` | **`72,06`** | **`0,999986`** | **Aprovado** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Apple M3 Ultra (`Metal` 4)** | `3,103%` | `1` | `0,00788` | `0,08876` | **`69,09`** | **`0,999956`** | **Aprovado** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `3,774%` | `2` | `0,01022` | `0,10116` | **`67,97`** | **`0,999951`** | **Aprovado** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `6,553%` | `2` | `0,01735` | `0,13179` | **`65,64`** | **`0,999874`** | **Aprovado** |
| **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `8,280%` | `2` | `0,02149` | `0,14667` | **`64,79`** | **`0,999844`** | **Aprovado** |
| **Apple M3 Ultra (`Metal` 4)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `9,337%` | `2` | `0,02467` | `0,15720` | **`64,16`** | **`0,999833`** | **Aprovado** |
| GPUs físicas (`4` fornecedores) | `Mesa llvmpipe` (`LLVM 21.1.8` CPU `Vulkan`) | `1,541%` - `9,633%` | `2` - `3` | `0,00477` - `0,02601` | `0,06895` - `0,16173` | `63,86` - `70,87` | `0,999828` - `0,999984` | **Aprovado** |
| GPUs físicas (`4` fornecedores) | Referência inteira `CPU Q16.16` (sem ponto flutuante) | `20,400%` - `27,626%` | `2` | `0,05612` - `0,07864` | `0,23689` - `0,28068` | `59,13` - `60,58` | `0,999556` - `0,999693` | **Aprovado** |

- **Exatidão bit a bit falsificada, tolerância limitada confirmada (`24 / 24` pares de quadros de GPU física)**: Cada par de GPU física produziu digests brutos `RGBA8` `SHA-256` distintos (`0 / 24` correspondências bit a bit) devido a aproximações de hardware SFU `sin`/`cos`/`pow` e arredondamento de mesclagem ROP `unorm8`, porém **zero pixels em qualquer par de GPU física diferiram em mais de `2 / 255`** ($p(|\Delta| > 8) = 0.000000 \le 0.001$), `PSNR` excedeu `64.16 dB` (`> 40.0 dB` limiar), e `SSIM` excedeu `0.999833` (`> 0.999` limiar) em `0.31`-`2.80 ms` por quadro.  
- **Contraste com rasterizador de software**: O rasterizador de software inteiro `CPU Q16.16` de ponto zero alcançou `0` incompatibilidades de framebuffer `SHA-256` nos sistemas `Apple M3 Ultra` (`arm64`), `AMD Zen 5` (`x86_64`) e `Intel Raptor Lake` (`x86_64`) (`9c693a38...` no tick `0`, `ce3b2cec...` no tick `10,000`), e o `Mesa llvmpipe` (`LLVM 21.1.8`) coincidiu bit a bit entre hosts AMD e Intel `x86_64` (`ccb291f6...` no tick `0`), ilustrando que a divergência de pixels decorre especificamente da variabilidade de hardware do shader/ROP da GPU ao invés da projeção da cena $\lambda(s_t)$.

<div id="64-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Arena Jogável de Crono-Orçamento `Q32.32` Nativa de Joule (`/living/game-engines/`)

Ao unir o contrato exato de reprodução `Q32.32` deste estudo com a mecânica temporal nativa de energia de [Tempo como um Índice](/papers/time-as-an-index/) (Seção 9.2), o Instrumento 4 de [`/living/game-engines/`](/living/game-engines/) disponibiliza um mini-jogo jogável de navegação orbital determinística a `60 Hz` e defesa de coleta, executado em JavaScript `BigInt` (`0` operações de ponto flutuante dentro da simulação):

- **Fita de estado `SHA-256` ao vivo e reprodução determinística**: Cada tick atualiza um resumo de estado `SHA-256` rolante e registra eventos compactos de entrada do jogador de 1 byte em $D$; clicar em `Reproduzir e Verificar SHA-256` reexecuta toda a partida a partir de `(seed, D)` e verifica a igualdade bitwise do hash (`replayed_sha256 === live_sha256`).
- **Antevisão temporal e rebobinagem orçadas em joule (modelo de projeto `est_j`)**: Consultar trajetórias futuras (`Hellman Branch Preview`, simulando `3` ramos de direção candidatos `K` ticks à frente) ou rebobinar para um ponto de verificação causal persistente debita uma bateria explícita de microjoules (`µJ`) (`step_cost_uj` por tick especulativo mais custo de apagamento de ramo de Landauer quando futuros não escolhidos ou linhas temporais rebobinadas são descartadas), jogável via teclado, mouse/toque e controladores `WebXR` / `Gamepad` (incluindo Meta Quest Browser).

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. Marcadores de inviabilidade

1. **Renderização de hardware bit a bit entre GPUs: inviável (`0 / 24` correspondências de `SHA-256` entre `Metal`, `RADV`, `NVIDIA` e `ANV` em `GE-H3`), ao passo que a tolerância perceptual limitada (`PSNR > 64 dB`, `SSIM > 0,9998`, $\Delta_{\max} \le 2$) se mantém quando as saídas das GPUs nunca retroalimentam $S$.**
2. **Física exata entre plataformas com configurações padrão de ponto flutuante: inviável.** Mesmo *sem* `-ffast-math`, as funções `std::sin`/`std::cos` entre sistemas operacionais (`Apple libm` vs. `GNU glibc`) divergem no tick `10`, e a lowering de `FMA` entre ISAs (`x86_64` vs. `arm64` com `-ffp-contract=fast`) diverge no tick `406`, propagando-se em dessincronização da jogabilidade em `9.798`-`11.205` ticks (`GE-H2`).
3. **Computação em GPU dentro da simulação: inviável como exata; viável apenas com reduções determinísticas**, a um custo medido de cerca de 0,2% a 7,8% no hardware citado, e ainda sujeita à contração pelo compilador, a menos que seja protegida por instrução (SPIR-V NoContraction) em todos os alvos.
4. **Comportamento portável entre motores: não demonstrado em nenhuma fonte externa consultada; demonstrado no nível do núcleo de física 2D em `GE-H1`, em `25` células alvo × hospedeiro (`5` máquinas, `3` ISAs, `6` runtimes/compiladores), ao passo que as projeções para motores completos (`GE-H4`, `GE-H9`) permanecem em aberto.**
5. **Regras interpretadas com grande número de atores: restritas.** A medição do GameRule implica um teto próximo de 300 atores a 20 ms (`GE-H1` mostra ainda que o `int` do Python custa `73×`-`132×` o `reported_j` do Rust nativo em Intel, AMD e Apple Silicon); em escala, é necessária uma projeção nativa compilada ou WebAssembly.
6. **Motores proprietários e alvos Windows bare-metal como alvos exatos: não verificados.** O manual da Unity, conforme citado pelo GameRule, descarta garantias de ordenação; os catálogos de templates da Unity e da Unreal não puderam ser lidos (suas páginas são renderizadas no lado do cliente), não foi lida nenhuma fonte sobre a ordem de execução da Unreal, e a execução de `PE` em Windows bare-metal não esteve ativa no pool de executores Linux/macOS da Onda 3.

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. Fontes e limites

Todo o material acima foi lido integralmente na passagem citada, exceto: o artigo GameCraft-Bench (lido o resumo e o README do repositório), a página “about” do RCE (lida a página de resumo) e a história de imprensa da Capcom (um artigo). Estudos de casas companheiras citados para níveis de telemetria (`SATB`) e mecânicas de jogos temporais orçadas em joules são [Tempo como Índice](/papers/time-as-an-index/) e o [Plataforma de Avaliação Estratificada de Satisfação](/papers/satb-harness/) (`[mesma casa]`). Fontes consultadas mas não citadas como evidência: o [portal Ludii](https://ludii.games/), que descreve jogos como conjuntos estruturados de ludemes; o repositório hobby Game Grammar; e os READMEs do [PlayCanvas](https://github.com/playcanvas/engine), [Babylon.js](https://github.com/BabylonJS/Babylon.js) e [three.js](https://github.com/mrdoob/three.js), que descrevem bibliotecas de renderização ao invés de formatos de descrição de jogos.

Não lidos, detrás de paywall ou de outra forma indisponíveis: T. Schaul, “A Video Game Description Language for Model-based or Interactive Learning,” IEEE CIG 2013, doi:10.1109/CIG.2013.6633610; J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845. M. Ebner et al., “Towards a Video Game Description Language,” doi:10.4230/DFU.Vol6.12191.85, é acesso aberto mas não foi lido para este estudo.

Na Seção 6, `GE-H1`, `GE-H2` e `GE-H3` deixam `measured_j = None` e `board_metered = false` em todas as execuções (separando o `L3` do macOS por processo `ri_energy_nj` do `L2` Linux socket/core `RAPL` `reported_j`, e mantendo as mecânicas `est_j` da Chrono-Budget Arena estritamente analíticas). Execução Windows `PE` em bare-metal, renderização Direct3D 12 `wgpu` e emissores multi-engine (`GE-H4`-`GE-H9`) permanecem como trabalho aberto.
