---
title: "RCE-VC: lei do controle de versão"
deck: "RCE-VC (uma referência de controle de versão, separada da linguagem Reality Code Engine) admite cada alteração em um estado canônico de repositório ou a recusa com um motivo registrado, divide arquivos Rust e Python em itens de nível superior sem nome e lê e escreve histórico Git ordinário. Os marcos M0, M1 e M2 estão implementados no commit público aba99fce (49 testes offline). A 100.000 unidades em Apple M5 Max, a admissão leva de 69,7 a 73,6 microssegundos e de 317 a 365 microjoules de energia rusage do kernel por processo (reported_j; measured_j está indefinido)."
lang: "pt"
source: "rce-vc"
complete: true
---

<div id="rce-vc-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

*Revisão af57f48, 22 de novembro de 2026. Implementação de referência: [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) em [`aba99fcec4414a32bff30ab075668350d3fb80bf`](https://github.com/openIE-dev/rce-vc/tree/aba99fcec4414a32bff30ab075668350d3fb80bf) (13 de novembro de 2026), atualizando a árvore inicial `8bf9c9af` com a divisão de itens de nível superior em Rust/Python do `rcevc-keys`, a fronteira `rcevc-core::assure` (`49` testes offline) e as medições de admissão `reported_j` em Apple M5 Max registradas em 22 de novembro de 2026.*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

RCE-VC é um design de controle de versão e uma pequena referência em Rust. Muitos escritores, pessoas ou programas, submetem alterações a um estado compartilhado. Uma verificação nomeada aceita o resultado, ou a alteração é recusada e o motivo é mantido. Os escritores podem permanecer no Git. A referência não é a linguagem Reality Code Engine. Ela usa a mesma estrutura: um Form, um passo total, um log hash-chained, chaves name-free e uma escada de gears com um model last.

**Em palavras simples**

1. Qualquer número de pessoas e programas pode escrever simultaneamente. Uma alteração entra no histórico compartilhado quando uma verificação nomeada aceita o resultado. Se a verificação não o aceita, a alteração permanece fora e o motivo é registrado. Quem a escreveu não decide.  
2. Alterações que não tocam nas mesmas coisas não precisam esperar uma pela outra. Quando se sobrepõem, um preço registrado antecipadamente classifica os resultados que passam, e um resultado que foi aceito uma vez, inclusive um conflito resolvido, é reutilizado. Um modelo é consultado somente depois que as etapas mais baratas falham, e sua resposta ainda deve passar pela verificação.  
3. A referência lê e grava o histórico Git ordinário e agora divide arquivos Rust e Python em itens de nível superior sem nome (`rcevc-keys`), de modo que um escritor não precise sair do Git. Em `aba99fce` no Apple M5 Max, admitir uma alteração contra um repositório de 100,000-unit repository levou `69.7-73.6 µs` e `317-365 µJ` no kernel de processo por-sistema operacional `ri_energy_nj` (`reported_j`). Os campos de recibo `est_uj` permanecem uma tabela inteira declarada (`424,153 µJ` média na mesma carga de trabalho), e nenhum trilho de hardware externo ou monitor de parede foi conectado (`measured_j = None`, `board_metered = false`).

<div id="terms-and-labels" class="anchor-alias" aria-hidden="true"></div>

## Termos e rótulos

<ul id="terms">
<li>SHA: SHA-256, a função de hash que a referência usa para chaves, resumos de conteúdo e o registro</li>
<li>BLAKE3: uma função de hash criptográfica nomeada como alvo de projeto para chaves internas; a referência ainda não a utiliza</li>
<li>HAMT: hash array mapped trie, o mapa persistente que mantém o estado do repositório</li>
<li>UTF: UTF-8, a codificação de texto aceita pelo mapeamento de arquivos do Git</li>
<li>MSRV: versão mínima suportada do Rust (`1.85` para `rcevc-core` e `rcevc-proj-git`, `1.90` para `rcevc-keys`)</li>
<li>CI: integração contínua (`cargo test --locked --offline --all-targets` em `rustc 1.100.0`)</li>
<li>CAS: atualização de referência por comparação e troca (`CasRef` e `GitDir::compare_and_swap_ref`)</li>
<li>FIPS: Federal Information Processing Standards; as verificações do SHA-256 utilizam os vetores da FIPS 180-4</li>
<li>RFC: Request for Comments; o código de descompressão segue a RFC 1950 e a RFC 1951</li>
<li>SATB, CPU, GPU, PID, SMC, SoC: disciplina de telemetria do Satiation Benchmark, unidade central de processamento, unidade de processamento gráfico, identificador de processo, System Management Controller e sistema em chip (system-on-chip)</li>
<li>VC1, VC2, VC3, VC4, VC5: as cinco proposições testadas pela referência, nomeadas com seus testes adiante</li>
<li>CONGRA: um corpus citado nas notas do projeto para uma reexecução futura; o nome não é expandido nesta página</li>
<li>README: o arquivo de visão geral distribuído no repositório de referência</li>
</ul>

Três rótulos permanecem distintos nesta página em toda a telemetria do chip completo (L2) e por processo (L3):

- **Measured (tempo de parede e contagens)** significa um tempo de relógio de parede, contagem de instruções ou contagem de caminhos a partir da compilação de lançamento (`aba99fce` no Apple M5 Max, e a linha de base do README impressa em `8bf9c9af`).
- **Reported (`reported_j`: contadores L2 e L3)** significa uma leitura de contador do sistema operacional ou no chip no Apple M5 Max (`macOS 27.2.1`): `IOReport` de todo o chip via `macmon` (L2, rótulo de host compartilhado `A2`, controlado pelo Falsifier 6 em `<= 5.0%` de deriva pré/pós ociosidade) e kernel por PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (L3, rótulo `D`). Nenhum trilho de hardware externo ou sonda de energia de tomada foi conectado (`measured_j = None`, `board_metered = false`).
- **Stated (`est_uj` / `est_j`)** significa a tabela de custos inteiros padrão copiada nos recibos dentro de `rcevc-core`. É uma tabela analítica escrita no código-fonte, nunca um contador ou leitura de medidor de parede.

<div id="1-what-the-reference-is-and-what-it-is-not" class="anchor-alias" aria-hidden="true"></div>

## 1. O que é a referência, e o que ela não é

O objetivo do projeto é uma história que muitos humanos e agentes possam escrever ao mesmo tempo, sem pedir a um escritor que pare de usar o Git. O enquadramento nas notas do projeto é que ramificação, comparação de diferenças e fusão em uma única linha principal constituem uma interface antiga, que a compatibilidade é o que mantém essa interface no lugar, e que uma regra determinística deve decidir onde quer que uma regra possa, com um modelo por último.

O Reality Code Engine (RCE) é uma linguagem de programação estudada em seu próprio artigo neste site. O RCE-VC não é construído sobre essa linguagem. Ele não analisa programas RCE, não os emite e não chama o verificador RCE. O que compartilha é o enquadramento: uma Forma para o repositório, um passo determinístico total chamado δ, um registo encadeado por hash cuja dobra é o estado, chaves sem nome e uma escada de engrenagens na qual um modelo executa por último e não é confiável.

No commit `aba99fce` (`13 November 2026`), o espaço de trabalho público está na versão 0.1.0 e contém **três** crates:

1. `rcevc-core` é o núcleo determinístico: sem relógio, sem aleatoriedade, sem E/S, sem dependências e com `#![forbid(unsafe_code)]` (MSRV `1.85`). Ele agora também inclui `rcevc-core::assure`, um limite de garantia que assegura que uma ação verificada seja cunhada apenas a partir de um resultado já presente no registo desse repositório e se aplique apenas à cabeça e ao portão contra os quais foi verificada, enquanto `CasRef` repete um identificador de operação para que o alvo idêntico de outro escritor nunca seja confundido com sucesso.
2. `rcevc-keys` divide ficheiros de origem Rust (`.rs`) e Python (`.py`) em itens de nível superior usando `tree-sitter 0.27.2`, `tree-sitter-rust 0.24.2` e `tree-sitter-python 0.25.0` vendidos (MSRV `1.90`, construído offline a partir de `vendor/` com um compilador C e zero buscas de rede). O identificador de cada item é a chave sem nome do núcleo de um corpo de token normalizado, invariante a renomeações de itens, espaços em branco e comentários, enquanto os bytes originais exatos permanecem em `parts` para que `project` os concatene de volta sem perdas; caminhos não `.rs`/`.py` ou árvores de erro de análise revertem de forma limpa para uma folha sobre os bytes originais.
3. `rcevc-proj-git` é a projeção Git (`#![forbid(unsafe_code)]`, MSRV `1.85`), que carrega seu próprio código SHA-1, zlib e objeto Git, além de `GitDir::compare_and_swap_ref`, de modo que o núcleo permaneça livre de dependências.

A CI executa `cargo test --locked --offline --all-targets` e `cargo clippy --locked --offline --all-targets -- -D warnings` em `rustc 1.100.0`, executando **49 testes offline** (`29` em `rcevc-core`, `8` em `rcevc-keys` e `12` em `rcevc-proj-git`, verificados contra `git 2.43`). Proposições numeradas após VC5 não são enunciadas nesta página.

<div id="2-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

## 2. Lei do controle de versão

A referência enuncia a lei da seguinte forma. O mesmo parágrafo abre o README do repositório e a documentação do crate. Ele é citado aqui uma única vez.

> O controle de versão é a admissão de mudanças em um estado canônico e sem nomes do repositório. Cada mudança é admitida somente quando um verificador nomeado aceita o estado posterior sob um contrato declarado, ou é recusada com um motivo registrado; mudanças cujos fechamentos de dependência não satisfazem essa condição são admitidas sem coordenação; entre as integrações admissíveis, um custo declarado ordena os candidatos; e todo resultado aceito, inclusive todo conflito resolvido, é reutilizado.

O restante desta página descreve o que a referência em `aba99fce` implementa, o que foi medido sobre ela e o que ela ainda não faz. O enunciado é o padrão para o qual a referência foi construída. Não é um relato de que ferramentas de controle de versão existentes já se comportam dessa forma.

<div id="3-quantities" class="anchor-alias" aria-hidden="true"></div>

## 3. Quantidades

Uma **unidade** é um corpo de texto e uma lista de slots de dependência. Se a lista de dependências estiver vazia, a unidade é uma folha e o corpo é texto literal, de modo que um cifrão em um script de shell permanece um cifrão. Se a lista não estiver vazia, um cifrão seguido de um índice seleciona aquela dependência, e dois cifrões representam um cifrão literal.

A **chave** de uma unidade é uma identidade livre de nomes. Uma renomeação altera a qual slot um nome está vinculado. Ela não altera a chave. A referência define

$$
\mathrm{key}(u) = H(\texttt{rcevc/unit/v1},\; \mathrm{body}(u),\; \mathrm{key}(d_0), \ldots, \mathrm{key}(d_{m-1}))
$$

onde $H$ é SHA-256 por meio de um codificador versionado e separado por domínio, e $d_i$ são as unidades de dependência. O **resumo de conteúdo**, que o trie hasheia, é um valor diferente: $H(\mathrm{body}, \text{dependency names})$.

Um **rascunho** é um mapa não validado, usado para gênese e para qualquer coisa lida de fora. Selar um rascunho o verifica e produz um **estado**. Um estado é bem formado: as dependências são resolvidas, todo índice em um corpo está vinculado e o grafo de dependências não possui ciclo. Ele mantém três mapas persistentes. O mapa de unidades é um HAMT de Merkle. O mapa de chaves e o índice de dependências reversas são persistentes e não fazem parte da raiz de Merkle. Clonar um estado e ler sua raiz são $O(1)$. Dois estados são iguais quando suas raízes são iguais. Um diff percorre apenas subárvores cujos hashes diferem, de modo que seu custo segue a diferença, e não o tamanho do repositório. Dependentes cuja chave mudou, mas cuja própria unidade não mudou, são intencionalmente omitidos do diff. O fecho, definido abaixo, carrega esses dependentes. Colocá-los no diff transformaria um dependente compartilhado em um falso conflito.

Uma **edição** altera slots e valida uma vez no final, sobre o fecho de dependências reversas dos slots tocados. Estados dentro de uma edição podem estar mal formados. Isso é intencional, por exemplo uma exclusão seguida de uma inserção.

Uma **alteração** carrega um rótulo opaco de escritor, um estado base, um nível, uma lista de operações e uma mensagem. As operações são inserção, exclusão e renomeação. Os níveis são somente-nomes, errata, alteração de significado e alteração de interface. O nível somente-nomes é verificado pelo kernel: o multiconjunto de chaves deve permanecer inalterado. O identificador da alteração cobre todos os campos. A mensagem é a intenção declarada, por exemplo o assunto de um commit. A admissão não a lê, e ela não depende do rótulo de escritor.

Para uma alteração $c$ contra um estado $s$,

$$
\mathrm{writes}(c, s) = \mathrm{diff}(s,\; \mathrm{apply}(s, c)).
$$

As leituras são as dependências das inserções e as origens das renomeações. O fecho de $c$ em um estado e no pós-estado são as escritas, os dependentes antes, os dependentes depois e as leituras. Duas alterações comutam em $s$ quando as escritas de cada uma não intersectam o fecho da outra:

$$
\mathrm{commutes}(a, b, s) \iff \mathrm{writes}(a) \cap \mathrm{closure}(b) = \emptyset \;\land\; \mathrm{writes}(b) \cap \mathrm{closure}(a) = \emptyset.
$$

O teste de referência verifica que mudanças comutativas produzem a mesma raiz em qualquer ordem.

O passo **δ** é `submit`. Ele é total sobre a entrada do usuário. Retorna uma aceitação com um recibo, ou uma recusa com um motivo, e acrescenta uma entrada de log encadeada por hash em ambos os casos. O head é o fold desse log. O replay verifica a cadeia e reintegra cada entrada. Ele usa a resolução registrada para um conflito. Não chama um proponente. Verifica cada raiz de pré-estado, cada raiz de pós-estado e cada motivo de recusa.

<div id="4-the-repository-form" class="anchor-alias" aria-hidden="true"></div>

## 4. A forma do repositório

O README alinha a forma implementada como nove partes, mais o separador de itens `rcevc-keys` e a fronteira `rcevc-core::assure`.

| Parte | Onde | O que faz |
|---|---|---|
| R, chaves sem nome | `model.rs`, `rcevc-keys` | Chaves como acima; `rcevc-keys` divide ficheiros `.rs` e `.py` em itens de nível superior com projeção de bytes sem perdas. Uma renomeação não altera nenhuma chave. |
| S, estado persistente | `hamt.rs`, `model.rs` | HAMT de Merkle. Clonagem e raiz em $O(1)$, diferença no tamanho da diferença, forma canónica de trie. As chaves e o índice de dependências inversas atualizam-se na edição, não no repositório inteiro. |
| Δ, alterações tipadas | `change.rs` | Inserção, eliminação e renomeação contra uma base declarada, com um nível declarado. A verificação só de nomes é feita pelo núcleo. |
| X, comutação | `change.rs` | As escritas são a diferença real. O fecho adiciona dependentes antes e depois, e leituras. Fechos disjuntos comutam. |
| K e G, verificador e portão | `gate.rs` | Cada verificador declara uma classe de propriedade, uma assunção de ligação, uma base de confiança, uma autoridade, um âmbito e um resumo. |
| δ, a escada | `repo.rs`, `assure.rs` | Pesquisa, comutação, fusão estrutural, revalidação, proponente, mais garantia de referência CAS (`CasRef`). O portão é executado em todos os caminhos. |
| D, o registo | `repo.rs` | Entradas encadeadas por hash. A cabeça é a dobra. A reprodução reconstrói-o sem proponente. |
| U, reutilização | `repo.rs` | Uma resolução é armazenada sob uma assinatura de conflito sem nome, e apenas depois de o portão a ter aceite. |
| C, custo | `repo.rs` | A tabela declarada por degrau (`est_uj`). Os recibos transportam a soma. |

A autoridade de um verificador é uma de fixada, reproduzida, provada, derivada ou inferida. O seu âmbito é um de três. **Unidade**: reverifica unidades na delta. **Fecho**: o veredicto depende da unidade e das suas dependências transitivas, pelo que o portão também reverifica os dependentes. **Global**: verifica todo o estado. Se a cabeça anterior passou e o âmbito declarado for verdadeiro, uma reverificação com âmbito corresponde a uma verificação completa. O teste `delta_gate_agrees_with_full_gate` regista essa concordância em mais de 600 ensaios, com mais de 100 recusas. Um verificador que minta sobre o seu âmbito viola a VC2. O âmbito é de confiança. Nada nesta versão o impõe ocultando o resto do estado.

O resumo do portão abrange a declaração de cada verificador, e esse resumo alimenta o hash de génese. A forma da trie é canónica: um prefixo não contém nada, uma única folha ou um ramo de duas ou mais chaves. As raízes não dependem da ordem pela qual a história chegou. Tudo o que é submetido a hash passa pelo codificador com uma etiqueta de domínio versionada da forma `rcevc/<thing>/vN`. Alterar o que uma etiqueta abrange implica incrementar a versão.

<div id="5-the-transition" class="anchor-alias" aria-hidden="true"></div>

## 5. A transição

O `submit` sempre segue um dos seguintes caminhos. Os nomes das engrenagens são os que estão escritos no recibo.

1. **G0, pesquisa.** O mesmo identificador de alteração contra a mesma cabeça, já recusado, devolve a recusa armazenada. O custo declarado dessa nova tentativa é apenas a linha G0. O teste `g0_identical_retry_costs_one_lookup` registra isso.
2. **Base.** O instantâneo base deve existir, caso contrário o motivo é uma base desconhecida. A aplicação das operações a essa base deve ser bem-sucedida, caso contrário o motivo é um erro de aplicação ou uma unidade mal formada. Uma reivindicação apenas de nome que não deixa o multiconjunto de chaves inalterado é recusada.
3. **G1, comutação.** Seja o conjunto movido a diferença da base para a cabeça atual. Se o fecho da alteração, na base e na cabeça, não intersecta esse conjunto, a alteração é aplicada diretamente à cabeça. Sem fusão.
4. **G2, fusão estrutural.** Caso contrário, a referência funde, slot por slot, sobre a união do que se moveu na cabeça e do que a própria alteração alterou. Um lado inalterado: tomar o outro lado. Ambos os lados iguais: tomar qualquer um. Qualquer outro slot é um conflito.
5. **Conflito.** A assinatura é $H(\mathrm{key}_{base}, \mathrm{key}_{head}, \mathrm{key}_{theirs})$, que não utiliza o nome do slot. A reutilização G0 devolve uma resolução armazenada para essa assinatura. Se nenhuma estiver armazenada, G4 pergunta ao proponente. Se não houver proponente, ou se ele não devolver nada, a alteração é recusada com os slots em conflito. Durante a reprodução, a resolução registrada é utilizada e o proponente não é chamado.
6. **G3, revalidação.** A atribuição fundida é construída sobre a cabeça com uma verificação de boa formação. Se essa verificação falhar, a alteração é recusada por ser mal formada.
7. **Portão, em todos os caminhos, inclusive G1.** O candidato e a diferença da cabeça atual são entregues ao portão. Um verificador que falhar recusa a alteração e nomeia o verificador.
8. **Aceitar.** As resoluções do proponente são copiadas para o armazém de reutilização apenas agora. O novo cabeçalho é instantaneado. O recibo registra as engrenagens utilizadas, as evidências do portão, as resoluções e `est_uj`.

As recusas também são registadas. A cabeça não se move.

<div id="6-propositions-the-tests-hold" class="anchor-alias" aria-hidden="true"></div>

## 6. Proposições sustentadas pelos testes

Em `aba99fce`, `cargo test --offline` executa 49 testes (`29` no núcleo, `8` em chaves e `12` no git), que correspondem às proposições abaixo:

| Afirmação | Teste nomeado no repositório |
|---|---|
| VC1, totalidade, sem limbo: toda submissão é aceita ou recusada com um motivo, e registrada no log | `vc1_every_submission_is_accepted_or_refused_and_logged` |
| VC2, verde por indução: toda cabeça está bem formada e passa pelo portão | `vc2_every_head_is_well_formed_and_passes_the_gate` (400 submissões aleatórias, bases defasadas, mudanças envenenadas) |
| VC3, comutação implica o mesmo resultado em qualquer ordem | `vc3_commutation_implies_order_independence` (3.000 ensaios aleatórios, mais de 500 pares comutativos) e `vc3_disjoint_writers_integrate_at_g1_in_either_order` |
| VC4, um conflito semântico é detectado mesmo quando o texto não conflita | `vc4_identical_edits_merge_and_semantic_conflicts_are_caught_at_g3` (uma mudança de aridade contra um novo chamador) |
| VC5, um conflito resolvido é reutilizado por sua assinatura independente de nomes | `vc5_resolved_conflicts_are_reused_by_name_free_signature` |
| Um resultado de modelo é um candidato | `model_output_is_a_candidate_never_trusted` |
| O estado é o fold do log | `replay_reproduces_head_without_any_proposer` |
| Uma renomeação não altera nenhuma chave, e a verificação apenas por nome é realizada | `renames_change_no_keys_and_name_only_is_verified` |
| Novas tentativas idempotentes em G0 custam uma consulta | `g0_identical_retry_costs_one_lookup` |
| O portão restrito concorda com um portão completo | `delta_gate_agrees_with_full_gate` (600 ensaios, mais de 100 recusas) |
| Snapshots não são afetados por edições posteriores; o cálculo incremental coincide com o cálculo do zero | `snapshots_share_structure_and_diff_is_exact`, testes HAMT em `hamt.rs` |
| SHA-256 coincide com os vetores publicados | vetores FIPS 180-4 em `hash.rs` |

O teste de VC5 aceita um conflito por meio do proponente e, em seguida, submete o mesmo conflito sob outro nome de slot. A segunda aceitação utiliza a marcha de consulta G0, não utiliza G4, não chama o proponente novamente e tem `est_uj` menor que um centésimo do recibo do caminho do proponente. Essa razão é uma comparação entre custos declarados nos recibos.

Um teste separado fornece ao proponente um resultado envenenado. O portão o recusa, a cabeça permanece inalterada e a resolução recusada não é armazenada para reutilização.

<div id="7-measured-wall-time" class="anchor-alias" aria-hidden="true"></div>

## 7. Tempo de parede medido

A carga de trabalho, como o exemplo do enxame implementa: cada escritor em uma rodada submete contra o cabeçalho inicial daquela rodada, de modo que submissões posteriores na rodada ficam desatualizadas. Um escritor a cada cinco edita o módulo quente (`below(5) == 0`). Uma submissão a cada cinquenta contém um token proibido (`below(50) == 0`), que corresponde à taxa de veneno de 2% que o README indica. O proponente no exemplo é um substituto determinístico que une os dois corpos. Não é um modelo aprendido. O exemplo armazena 10 unidades em cada módulo. A semente fixa no exemplo é `0x5eed`.

<div id="71-path-shares-at-400-units" class="anchor-alias" aria-hidden="true"></div>

### 7.1 Participações de caminhos em 400 unidades

A tabela de caminhos do README é o enxame padrão: 64 escritores, 20 rodadas, 40 módulos, 400 unidades, 1.280 submissões. As participações são de todas as submissões.

| Caminho | Participação |
|---|---:|
| Aceito em G1 (comutado, sem fusão) | 57,0% |
| Aceito em G2, depois G3 (fusão estrutural, revalidado) | 27,3% |
| Aceito em G2, depois G4, depois G3 (conflito, proponente, revalidado) | 13,8% |
| Recusado pelo portão | 1,9% |

As quatro participações somam 100. Toda recusa foi uma alteração envenenada, incluindo 6 saídas de proponente que herdaram o veneno. 1.259 das 1.280 submissões estavam em uma base obsoleta, e 98,1% dessas submissões obsoletas foram admitidas sem rebase do escritor. O exemplo realizou 182 chamadas de proponente. A reprodução desde a gênese, sem proponente, reproduziu a mesma cabeça.

![Caminhos de admissão e tempos de parede medidos na compilação de referência](/figures/rce-vc/swarm-and-timing.svg)

*Figura 1. Participações de caminhos medidas para o enxame de 400 unidades e 20 rodadas, e tempo de parede medido por submissão para as execuções de temporização de 5 rodadas na compilação de referência de linha de base. Release, um núcleo. Os custos de recebimento declarados não estão nesta figura.*

<div id="72-integration-cost-against-repository-size" class="anchor-alias" aria-hidden="true"></div>

### 7.2 Custo de integração em função do tamanho do repositório

A tabela de tempos do README corresponde ao mesmo tipo de carga de trabalho, com 64 escritores e 5 rodadas, mesma semente, build de release, em um único núcleo. A célula indica o tempo de parede medido por submissão. M0 é o estado anterior, que clonava mapas. M1 é o estado persistente de Merkle.

| Unidades | Módulos | M0, mapas clonados | M1, estado persistente (host do README) | Razão apresentada no README |
|---:|---:|---:|---:|---:|
| 400 | 40 | 2.103 µs | 98 µs | 21 vezes |
| 4.000 | 400 | 27.536 µs | 105 µs | 262 vezes |
| 40.000 | 4.000 | não executado | 136 µs | |
| 100.000 | 10.000 | não executado | 188 µs | |

A linha de 100.000 unidades corresponde ao exemplo invocado como `swarm -- 64 5 10000`: 64 escritores, 5 rodadas e 10.000 módulos. M0 cresceu com o tamanho do repositório, enquanto M1 permaneceu praticamente constante. O aumento restante decorre da profundidade do trie e da quantidade de alterações dentro de uma rodada, pois os snapshots compartilham estrutura, o diff e o portão de verificação ignoram subárvores iguais, uma edição recalcula a chave apenas das unidades editadas e de seus dependentes, e o portão reverifica o escopo declarado do delta.

<div id="73-measured-wall-time-and-on-chip-reported_j-at-100000-units-commit-aba99fce" class="anchor-alias" aria-hidden="true"></div>

### 7.3 Tempo de parede medido e `reported_j` no chip a 100,000 unidades (commit `aba99fce`)

Em 22 de novembro de 2026, `openIE-dev/rce-vc` no commit `aba99fce` (`rustc 1.100.0`, compilação de release) foi executado e instrumentado no Apple M5 Max (`macOS 27.2.1` `arm64`) sob o harness de `reported_j` de canal duplo SATB: `IOReport` de chip completo via `macmon` (L2, rótulo `A2`, Falsifier 6 `<= 5.0%` porta de deriva ociosa) emparelhado com o kernel por PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (L3, rótulo `D`), a `100,000` unidades (`10,000` módulos × `10` unidades):

| `100,000`-unidade de carga de trabalho (aba99fce, Apple M5 Max) | Admissões / ensaio | Ensaios | Tempo de parede mediano / admissão | Mediana L3 `reported_j` / admissão | Instruções / admissão | `CostTable` `est_uj` declarado / admissão |
|---|---:|---:|---:|---:|---:|---:|
| **README swarm (`64` escritores × `5` rodadas)** | `320` (`315` ace, `5` ref) | `5` | **`69.69 µs`** (`63.5-84.1 µs`) | **`365.35 µJ`** (`346.4-395.7 µJ`) | `1,147,137` | `438,530.4 µJ` |
| **Janela sustentada (`64` escritores × `500` rodadas)** | `32,000` (`31,357` ace, `643` ref) | `3` | **`73.56 µs`** (`69.3-75.7 µs`) | **`317.21 µJ`** (`278.9-369.0 µJ`) | `1,153,976` | `424,152.7 µJ` |

- **Gênese e detalhamento de caminho**: Construir o estado gênese Merkle HAMT de `100,000` unidades demorou uma mediana **`1.244 s`** uma única vez (`5` ensaios). Na execução sustentada de `32,000` submissões (`2.35 s` janela), `26,103` submissões (`81.6%`) foram admitidas em `G1Commute`, `2,594` (`8.1%`) em `G2Structural > G3Revalidate`, `2,660` (`8.3%`) via `G4Proposer` com `2,660` assinaturas de conflito promovidas para reutilização, e `643` (`2.0%`) submissões envenenadas foram recusadas (`30,857` de `31,490` submissões obsoletas = `98.0%` admitidas sem rebase de escritor).
- **Consistência L2 vs L3 e Falsifier 6**: Nos dois ensaios sustentados que passaram o Falsifier 6 (`2.67%` e `1.22%` deriva ociosa), a energia marginal líquida do `IOReport` de chip inteiro L2 foi `9.22 J` e `4.66 J` (`288.2 µJ` e `145.6 µJ`/admissão) ao lado do `ri_energy_nj` L3 por PID de `11.81 J` e `8.92 J` (`369.0 µJ` e `278.9 µJ`/admissão), enquanto o ensaio do meio (`7.28% > 5.0%` deriva ociosa de trabalhos host concorrentes) teve sua subtração líquida L2 automaticamente invalidada pelo Falsifier 6. Observe que o placeholder `CostTable` (`424-439 mJ`/admissão) superestima a admissão apenas de CPU em cerca de três ordens de magnitude porque sua entrada `Proposer` de `5,000,000 µJ` (`5 J`) prevê um proponente neural em vez da substituição determinística do exemplo (`measured_j = None`, `board_metered = false`).

<div id="8-stated-cost-on-receipts" class="anchor-alias" aria-hidden="true"></div>

## 8. Custo declarado nos recibos

A tabela padrão em `CostTable` em `aba99fce`, em microjoules, permanece um preço declarado por linha dentro dos recibos do repositório:

| Linha | O que a adiciona | µJ declarado |
|---|---|---:|
| G0 | Cobrada no início de toda tentativa. Cobrada novamente para cada assinatura de conflito reutilizada. Uma recusa memoizada é apenas esta linha. | 1 |
| G1 | Cobrada quando a tentativa atinge o teste de comutação | 10 |
| G2 | Cobrada quando a tentativa realiza a fusão estrutural | 100 |
| Checker | Cobrada uma vez por verificador, em todo caminho que atinge o portão, incluindo G1 | 1.000 |
| Proposer | Cobrada uma vez por chamada ao propositor | 5.000.000 |

G3 é escrita no caminho e não possui linha própria. O `est_uj` de um recibo é a soma das linhas que a tentativa adicionou. Substituir esta tabela por `measured_j` de trilho de hardware é o marco M6 e permanece aberto; a Seção 7.3 fornece a primeira calibração de `reported_j` do sistema operacional (`317-365 µJ` por admissão de `100.000` unidades com um propositor substituto determinístico).

<div id="9-the-git-projection" class="anchor-alias" aria-hidden="true"></div>

## 9. A projeção Git

A projeção corresponde ao marco M2, em `rcevc-proj-git`. Uma unidade folha é representada pelos bytes do arquivo. Uma unidade com dependências é escrita como um arquivo com um cabeçalho curto, que a referência trata como uma bijeção sobre arquivos UTF-8:

```
#rcevc-unit v1
#dep <slot>
#body
<body>
```

Uma linha `#dep` é escrita para cada dependência.

**Out.** `export` escreve um commit em `main` para cada entrada aceita. O autor é o rótulo do escritor. O assunto é a mensagem de mudança, ou uma linha nomeando o identificador da mudança e as engrenagens se a mensagem estiver vazia. Cada commit aceito contém os trailers `RCE-VC-Change`, `RCE-VC-Pre`, `RCE-VC-Post`, `RCE-VC-Path`, `RCE-VC-Evidence`, `RCE-VC-Resolved`, `RCE-VC-Est-uJ` e `RCE-VC-Entry`. `RCE-VC-Est-uJ` é a soma de microjoules declarada, não uma medição. A referência `refs/rcevc/log` tem um commit por entrada de log, incluídas recusas, e um commit de recusa também contém `RCE-VC-Reason`. Dado o mesmo log e a mesma base de tempo, `export` produz os mesmos identificadores de commit.

**In.** `ingest` percorre os commits pais a partir de um tip até encontrar um commit cujo trailer `RCE-VC-Post` seja um snapshot. Esse snapshot é a base. A árvore do tip torna-se uma mudança, inclusão e exclusão, contra essa base. Se o multiconjunto de conteúdo permanecer inalterado, o nível é somente-nome. O branch é a proposta. A escada decide. O escritor não é solicitado a fazer rebase.

O README registra essas verificações contra o git 2.43, em `tests/git_interop.rs` (`12` testes em `rcevc-proj-git` no `aba99fce`):

| Verificação | Resultado registrado no README |
|---|---|
| `git fsck --full --strict` na história exportada | limpo |
| Todo commit em `main` reimporta para a raiz em seu trailer `RCE-VC-Post` | sim |
| Dois exportes do mesmo log em diretórios diferentes | identificadores de commit idênticos |
| O analisador de trailers do Git lê os recibos | sim |
| Dois commits Git simples em um branch cuja base ficou obsoleta | ingestão como uma mudança, admitida em G1, `main` avança |
| Objetos que o Git escreveu, incluindo deflate dinâmico-Huffman | lido |
| Um commit Git simples que contém um token proibido | recusado, registrado em `refs/rcevc/log`, `main` não avançou |

Limites desta projeção, conforme declarados no README: apenas objetos soltos e referências soltas; modo de arquivo 100644 na saída, de modo que o bit executável ainda não é um atributo unitário; symlinks, submódulos e arquivos não-UTF-8 são recusados com uma razão em vez de serem adivinhados.

O projeto menciona o nome Mergiraf, uma mesclagem estruturada que usa tree-sitter, como trabalho voltado a arquivos estruturados por análise sintática. Isso é uma observação de convergência. Esta página não avalia a referência em relação a ele, nem avalia a referência em relação a qualquer outro sistema de controle de versão.

<div id="10-limits-of-this-version" class="anchor-alias" aria-hidden="true"></div>

## 10. Limites desta versão

No commit `aba99fce`:

1. `rcevc-keys` divide arquivos Rust (`.rs`) e Python (`.py`) em itens de nível superior (com dependências apontando apenas para itens anteriores no mesmo arquivo), mas a divisão de TypeScript e uma avaliação de ida e volta de 50 pacotes / 1.000 repositórios ainda não foram realizadas; outros tipos de arquivo permanecem como unidades-folha de arquivo inteiro.
2. O armazenamento Git usa objetos soltos e referências soltas. Não há packfiles nem referências compactadas. A exportação escreve apenas o modo 100644. Links simbólicos, submódulos e arquivos não-UTF-8 são recusados.
3. Cada commit exportado reconstrói toda a árvore.
4. Os conjuntos de dependências reversas são clonados quando são atualizados. Uma unidade com muitos dependentes torna essa atualização grande.
5. O cálculo de chaves é recursivo. Uma cadeia de dependências com mais de cerca de 10.000 unidades pode causar estouro de pilha.
6. Uma raiz de conteúdo completo é linear no número de unidades. A ingestão a utiliza apenas para estimar o nível somente-nome. A verificação somente-nome do kernel percorre o diff.
7. Os snapshots são mantidos em memória, sem política de retenção e sem armazenamento separado.
8. `submit` é single-threaded (`CasRef` protege trocas de referências, enquanto `submit` admite alterações comutativas sequencialmente). Arrendamentos não são construídos.
9. Um verificador é confiado para dizer a verdade sobre seu escopo (o sandboxing Wasmtime M3 ainda não foi construído).
10. O `reported_j` on-chip (`317-365 µJ` por admissão de `100,000` unidades) foi registrado externamente via kernel `ri_energy_nj`, enquanto os campos de recibo no repositório ainda carregam a tabela `est_uj` declarada e o trilho de hardware externo `measured_j` (M6) permanece aberto (`measured_j = None`, `board_metered = false`).

<div id="11-next-work" class="anchor-alias" aria-hidden="true"></div>

## 11. Próximos trabalhos

- **Concluir M1 (expansão de `rcevc-keys` e ida e volta sobre corpus).** Adicionar a gramática de TypeScript junto às de Rust e Python, oferecer suporte a dependências de itens entre arquivos e verificar ida e volta byte a byte em pelo menos 50 crates e pacotes reais, com edições independentes em funções distintas de um mesmo arquivo comutando em G1.
- **Concluir M2 (chaves internas em BLAKE3 e packfiles com `gix`).** Migrar o hashing interno para BLAKE3 (mantendo os vetores SHA-256 da FIPS 180-4 como teste próprio e atualizando as tags de domínio) e migrar o armazenamento de objetos Git para `gix` (`gitoxide`) para packfiles e referências empacotadas, seguido de uma ida e volta sobre o histórico de 1.000 repositórios.
- **M3 (`rcevc-gate` sobre Wasmtime).** Executar os verificadores como módulos WebAssembly determinísticos, com limite de combustível (fuel) e digests fixados, de modo que o escopo declarado seja imposto expondo apenas a fatia declarada.
- **M4 (arrendamentos e canal monotônico).** Streaming concorrente de mudanças monotônicas sem coordenação.
- **M5 (reprodução de corpora de conflito).** Reproduzir Merge-Bench, CONGRA e AgenticFlict através da escada, contabilizando as resoluções em G0, G1, G2, G3 e G4.
- **M6 (`rcevc-meter`).** Substituir `est_uj` por `reported_j` calibrado e `measured_j` medido por trilhos de hardware externos.

<div id="12-copyright-and-license" class="anchor-alias" aria-hidden="true"></div>

## 12. Direitos autorais e licença

Direitos autorais 2026 Open Interface Engineering, Inc.

A implementação de referência em [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) no commit `aba99fcec4414a32bff30ab075668350d3fb80bf` (`13 November 2026`) está sob a Licença Apache, Versão 2.0. O arquivo de licença naquela árvore indica os direitos autorais como Open Interface Engineering, Inc., e o manifesto do crate define `license = "Apache-2.0"`. Esta página é o texto de estudo para essa referência.
