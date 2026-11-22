---
title: "RCE Compile: uma lei da compilação, testada como forma normal contra compiladores reais"
deck: "RCE Compile (um projeto de pesquisa no repositório do Reality Code Engine) pergunta se uma única afirmação sobre o que é compilação vale para todo compilador, independentemente do próprio Reality Code Engine. Verificada contra doze famílias de compiladores, a candidata sustenta-se como padrão pelo qual medir um compilador, não como descrição do que os compiladores fazem hoje. Este estudo apresenta esse padrão de sete partes, as evidências a favor e contra cada uma, um substituto mensurável para sua função de convergência, sete hipóteses com falseadores e os três experimentos executados até agora: comparações byte a byte em três máquinas, contagens de apagamento e comprimento de descrição em 96 compilações sem medidor de energia e um hash sem nomes sem falsos positivos em 16 pequenos núcleos e 4 programas."
lang: "pt"
source: "rce-compile"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

RCE Compile investiga se uma única Lei da Compilação vale para qualquer compilador independentemente do Reality Code Engine (RCE). O enunciado candidato diz que compilar é rebaixar preservando o significado entre representações canônicas, ordenado por um custo cujo piso é o limite de Landauer e cujo alvo é o menor programa equivalente, controlado por verificação e composto por reutilização. Testado contra doze famílias de compiladores de produção, falha como descrição: nenhum compilador avaliado calcula hash de uma representação sem nomes, o rebaixamento não é total nem provado preservar o significado em geral, e nenhum contabiliza energia. Reescritas três cláusulas, mantém-se como forma normal normativa com dois limites, duas contagens computáveis no lugar da função de convergência, sete hipóteses falseáveis e três experimentos iniciais.

**Em palavras simples**

1. A questão é se todos os compiladores obedecem a uma só regra. Os compiladores reais não obedecem, por isso a regra é reformulada como um padrão de sete partes contra o qual qualquer compilador pode ser medido; nenhum acompanha energia nem prova que traduz todo programa corretamente.
2. Os limites físicos e matemáticos da regra original são reais, mas não podem ser computados como enunciados, sendo substituídos por duas quantidades contáveis comparáveis a um medidor de energia.
3. Uma parte ausente nos compiladores avaliados foi construída e testada: uma impressão digital do programa compilado que ignora os nomes internos. Em 16 pequenos núcleos e 4 programas, ela reconheceu cópias renomeadas com mais frequência do que chaves de bytes brutos ou texto-fonte, sem jamais atribuir a mesma impressão digital a dois núcleos que calculam coisas diferentes.

*Texto completo em inglês: [/papers/rce-compile/](/papers/rce-compile/).*
