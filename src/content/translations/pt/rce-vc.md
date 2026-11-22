---
title: "RCE-VC: lei do controle de versão"
deck: "RCE-VC (uma referência de controle de versão separada da linguagem Reality Code Engine) admite cada alteração em um único estado canônico de repositório sem nomes ou a recusa com motivo registrado, além de ler e gravar histórico Git comum. Os marcos M0, M1 e M2 estão implementados no commit público 8bf9c9af. Os tempos reais desta página foram medidos nessa compilação (188 microssegundos contra 100,000 unidades em um núcleo). Os custos nos recibos vêm de uma tabela declarada; nenhum joule foi medido."
lang: "pt"
source: "rce-vc"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

RCE-VC é um projeto de controle de versão e uma pequena referência em Rust (`openIE-dev/rce-vc` no commit `8bf9c9af`). Muitos autores, pessoas ou programas, submetem alterações contra um estado compartilhado: uma verificação nomeada admite o resultado ou a alteração é recusada mantendo o motivo registrado, e os autores podem continuar no Git. A referência não é a linguagem Reality Code Engine, mas usa o mesmo enquadramento: uma Forma, um passo total determinístico, um registro encadeado por hash, chaves sem nomes e uma escada de engrenagens com um modelo por último.

**Em palavras simples**

1. Qualquer número de pessoas e programas pode escrever ao mesmo tempo. Uma alteração entra no histórico compartilhado quando uma verificação nomeada aceita o resultado; caso contrário fica de fora com o motivo anotado, independentemente de quem a escreveu.
2. Alterações que não tocam as mesmas dependências não precisam esperar umas pelas outras. Quando se sobrepõem, um preço declarado de antemão ordena os resultados aprovados e todo resultado aceito uma vez, inclusive conflitos resolvidos, é reutilizado; um modelo só é consultado após os passos mais baratos falharem.
3. A referência lê e grava histórico Git comum, de modo que ninguém precisa deixar o Git. Na compilação medida, admitir uma alteração ficou abaixo de dois décimos de milissegundo de algumas centenas até 100,000 unidades em um núcleo (188 microssegundos); os valores `est_uj` nos recibos são uma tabela declarada e nenhum joule foi medido.

*Texto completo em inglês: [/papers/rce-vc/](/papers/rce-vc/).*
