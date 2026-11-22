---
title: "\"IA\" lê humano: codificação em linguagem humana na velocidade da máquina e o custo de energia"
deck: "Trabalho em andamento. Por que tanto do que as máquinas trocam é escrito para pessoas, quanto isso custa hoje em bytes, tokens e tempo, e como o custo de energia será medido."
lang: "pt"
source: "ai-reads-human"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Agentes de software trocam dados em formatos feitos para leitura humana, como JSON, YAML, Markdown, XML e CSV. Nomeamos imposto de impedância o trabalho extra que isso causa, definimo-lo com unidades e medimos duas de suas partes em um corpus reproduzível de 20,000 registros: tempo de análise sintática e contagem de tokens. Uma primeira tentativa de medição de energia em dois notebooks (seção 5b) não conseguiu separar nenhuma energia líquida de análise da potência de fundo, portanto nenhuma afirmação em joules é feita.

**Em palavras simples**

1. Computadores e pessoas costumam usar o mesmo formato escrito: ele é fácil para as pessoas lerem, mas obriga o computador a fazer trabalho extra ao lê-lo de volta.
2. Em nossos dados de teste, os mesmos registros levaram cerca de 8 vezes mais tempo para serem lidos como JSON (leitor nativo do Python) e cerca de 735 vezes mais como YAML do que como um layout binário fixo; lido por um modelo de IA, YAML usou cerca de 2.2 vezes mais tokens que CSV.
3. Medimos tempo e contagens de tokens; também tentamos medir energia em dois notebooks, mas o sinal foi pequeno demais para separar do consumo de fundo, de modo que esta página não faz nenhuma afirmação sobre quantos joules são economizados.

*Texto completo em inglês: [/papers/ai-reads-human/](/papers/ai-reads-human/).*
