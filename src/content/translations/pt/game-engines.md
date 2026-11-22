---
title: "Escrever um jogo uma vez e executá-lo em todo lugar: onde termina a reprodução exata e começa a tolerância"
deck: "Pode um jogo ser escrito uma única vez como uma máquina de estados verificada e projetado para vários motores e linguagens? Para regras e simulação, sim, sob aritmética estrita. Para pixels em diferentes hardwares gráficos, não: apenas concordância dentro de uma tolerância medida é alcançável."
lang: "pt"
source: "game-engines"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Este estudo pergunta se um jogo pode ser escrito uma única vez como uma máquina de estados verificada (uma Forma $P = (S, E, \delta, D, \lambda)$) e depois projetado para vários motores e linguagens. As fontes respondem: sim para regras de jogo e simulação sob disciplina numérica estrita; não para pixels idênticos bit a bit em diferentes hardwares gráficos, onde só é possível concordância baseada em tolerância, acompanhada de uma divisão em quatro camadas (simulação, script, cena e renderização), uma fronteira de determinismo e um plano de testes orientado por falseadores.

**Em palavras simples**

1. As regras de um jogo (quem se move, o que colide, quem vence) podem ser declaradas uma vez e reproduzidas com exatidão, desde que a aritmética seja fixada.
2. As imagens que um jogo desenha não podem ser tornadas idênticas em toda placa gráfica, mas podem ser verificadas para permanecer dentro de um erro medido.
3. Os formatos atuais de descrição de jogos cobrem cada um apenas uma fatia (shaders, cenas ou regras); quase nenhum verifica as costuras entre as fatias, e é nessa costura que este projeto concentra seu esforço.

*Texto completo em inglês: [/papers/game-engines/](/papers/game-engines/).*
