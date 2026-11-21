# Lifemaxxing — protótipo

App pessoal de hábitos, mobile-first, com ciclo quinzenal (dias 15 e 30): hábitos dão XP e o XP libera o dinheiro livre da quinzena.

Este é o **protótipo MVP**: HTML, CSS e JavaScript puro, sem framework e sem back-end. Tudo fica salvo no `localStorage` do navegador. A ideia é abrir no celular e simular várias quinzenas em uns 30 minutos.

## Arquivos

| Arquivo | O que tem |
| --- | --- |
| `index.html` | Estrutura da página, menu inferior e barra do simulador |
| `styles.css` | Visual (fundo claro, preto `#0A0E17`, azul `#1756C8`, Plus Jakarta Sans) |
| `data.js` | Dados iniciais: hábitos, motivos, orçamento, níveis, desafios, frases e fichas de treino |
| `app.js` | Toda a lógica: XP, níveis, potes de dinheiro, simulador, telas |
| `manifest.json`, `sw.js`, `icons/` | PWA (instalar na tela inicial e abrir offline) |

## Como abrir

- **No computador:** dê dois cliques no `index.html`. Funciona direto do arquivo.
- **No celular:** publique na Vercel (abaixo) e abra o link.

## Publicar na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) entrando com o GitHub.
2. Clique em **Add New… › Project** e importe o repositório `lifemaxxing`.
3. Em **Framework Preset** escolha **Other**. Deixe Build Command e Output Directory vazios.
4. Clique em **Deploy**. Em uns segundos sai um link do tipo `lifemaxxing.vercel.app`.

Cada `git push` publica de novo sozinho.

Sem GitHub: instale a CLI (`npm i -g vercel`), entre na pasta e rode `vercel`.

## Abrir no celular e instalar como app

1. Abra o link da Vercel no celular.
2. **iPhone (Safari):** Compartilhar › **Adicionar à Tela de Início**.
3. **Android (Chrome):** menu ⋮ › **Instalar app** (ou Adicionar à tela inicial).

Os dados ficam só naquele aparelho e naquele navegador.

## Como testar (modo teste)

A barra fina no topo é o simulador. O app inteiro usa a **data simulada**, que começa em **15/12/2026**.

- **Manhã / Tarde / Noite:** troca o período simulado (e as tarefas mostradas em Hoje).
- **Próximo dia:** fecha o dia (calcula dia bom, sequência, bônus, liberação de terça ou sexta, desafio) e avança a data. Na virada da quinzena mostra o resumo e sorteia o novo desafio.
- **+7:** preenche 7 dias com resultados aleatórios e fecha cada um.
- **↺:** reseta tudo.

O modo teste pode ser desligado em Ajustes. Com ele ligado, o treino sugere 50 minutos de duração se o cronômetro marcar menos de 10 (para não precisar esperar).

Roteiro rápido de 30 minutos:

1. Registre umas tarefas em Hoje (toque, leia os motivos, deslize para confirmar).
2. Complete os 6 mínimos e veja o +40 XP do dia bom.
3. Faça um treino completo na aba Treino (marque séries, use o timer, finalize com intensidade).
4. Registre um fast food e veja o custo real.
5. Clique em **Próximo dia** algumas vezes, depois **+7** até virar a quinzena.
6. Na terça ou sexta, vá em Grana e saque.
7. Veja Progresso e mexa em Ajustes (valores, hábitos, frases com imagem).

## Regras implementadas

**XP:** cada hábito mínimo vale 10 (dividido entre as partes, ex.: garrafas 3 + 3 + 4). Dia bom +40. Sol 20, menos tela 25, natureza 40, treino 100, surf 150. Treino: +25 por recorde (até 2), +20 com intensidade 8+, +20 acima de 45 min. 3 treinos na semana (sáb a sex) +150 ao fechar a sexta. 7 dias bons seguidos +100.

**Níveis:** de Na toca (0) a Surfista (9.000). Depois do 10, a contagem recomeça com uma estrela. Cada nível novo abre um baú de R$25 a R$50.

**Dinheiro livre** (entra todo travado; R$60 de delivery à parte, o resto dividido):

- **XP 40%:** R$13 a cada 100 XP da quinzena, até o teto.
- **Terça e sexta 30%:** terça vale 1 parte (dias bons de sáb a ter), sexta vale 2 partes (dias bons de qua a sex) +20% com a semana toda boa e +20% com 3 treinos. O valor da parte = pote ÷ (terças + 2 × sextas da quinzena). Nunca passa do pote.
- **Baú surpresa 15%:** cada extra rola um baú (vazio 40%, R$5 30%, R$15 20%, R$40 10%). O baú de nível também sai daqui.
- **Desafio 15%:** missão sorteada no pagamento; cumpriu, libera tudo na hora.
- **Delivery:** 2 tickets de R$30; cada um abre com 4 dias bons seguidos. Ticket liberado e não usado vira dinheiro livre no fim.
- **Saque:** só terças e sextas. O liberado vai para a carteira.
- **Fim da quinzena:** o que ficou travado vai para a Caixa de Santos. A carteira passa para a próxima quinzena.

## Em aberto (do documento)

- Tamanho da garrafa: está 767 ml (3 garrafas para 2,3 L). Mude em Ajustes › Garrafa; o número de garrafas se ajusta sozinho.
- Preço real das marmitas: editável em Ajustes › Orçamento.
- Lojinha de recompensas: não existe no protótipo; o dinheiro livre faz esse papel.
