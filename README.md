# Lifemaxxing

App pessoal de hábitos, mobile-first, com ciclo **quinzenal** (dias 15 e 30): as obrigações e os bônus dão XP, e o XP libera o dinheiro livre da quinzena. Tem treino, grana, progresso e um coach de IA que conhece todos os seus dados.

- **Para subir (Vercel + Supabase + IA):** [`docs/DEPLOY.md`](docs/DEPLOY.md)
- **Telas:** [`design/`](design/README.md)
- **Como o coach de IA funciona:** [`docs/chat-ia.md`](docs/chat-ia.md)

## Stack

HTML, CSS e JavaScript puro (sem framework e sem build), instalável como PWA. Funções Node na pasta `/api` da Vercel, sem dependências. Banco Postgres no Supabase.

```
index.html, styles.css, app.js, data.js   o app
manifest.json, sw.js, icons/              PWA (ícone, tela cheia, offline)
api/login.js                              login por senha (APP_PASSWORD)
api/state.js                              lê e grava o estado no Supabase
api/chat.js                               coach de IA em streaming
api/_lib/                                 sessão, Supabase e conexões de IA
supabase/schema.sql                       tabelas e backup automático
docs/                                     deploy e abordagem do chat
design/                                   pacote de telas
```

## Três jeitos de rodar

| Onde | Dados | Data | Coach |
| --- | --- | --- | --- |
| **Vercel** (de verdade) | Supabase + cópia no aparelho | Real | Gemini, Groq ou OpenAI (+ DeepSeek, OpenRouter) |
| Arquivo `index.html` aberto direto | Só no navegador | Modo teste | Sem IA |
| Artifact no claude.ai (protótipo) | Só no navegador | Modo teste | Claude da sua conta |

Na Vercel o app começa **valendo hoje**. O modo teste (data simulada, Próximo dia, +7, Resetar) fica em **Ajustes › Modo**.

## Telas e funções

- **Hoje:** card Dia bom com as 6 obrigações e o Treino (que não conta para o dia bom). Abaixo, **Obrigações** por período (manhã, tarde, noite) e **Bônus** (opcionais, valem mais), com **Adicionar bônus** para criar hobbies como ler um livro.
- **Registrar:** folha com motivos, XP, quanto vale e quanto libera em reais, e deslizar para confirmar.
- **Treino:** fichas A, B e C, corrida, surf e skate, séries com carga e reps, última vez, recordes, timer de descanso. Ao finalizar mostra XP e quanto vale e libera em reais.
- **Grana › Resumo:** disponível para saque, já sacado, travado e montante. Sacar tira o valor do montante. Insights e histórico de gastos e saques, potes, tickets de delivery, Caixa de Santos.
- **Grana › Fixos:** fixos da quinzena editáveis, com "pago". Em todo dia 15 e 30 abre a folha para registrar.
- **Progresso:** sequência, médias de 30 dias, mapa de 14 dias, caminho até Surfista, quinzenas fechadas.
- **Coach:** botão no centro do menu. Toque ou arraste para cima. Responde em streaming, com voz pelo navegador.
- **Ajustes:** nome, horário de dormir, garrafa, hábitos, orçamento padrão, IA do coach, frases do dia com imagem, modo.

## Regras

**XP:** cada obrigação vale 10 (dividido entre as partes, ex.: garrafas 3 + 3 + 4). Dia bom +40. Sol 20, menos tela 25, natureza 40, treino 100, surf 150, bônus criados com o XP que você escolher. Treino: +25 por recorde (até 2), +20 com intensidade 8+, +20 acima de 45 min. 3 treinos na semana (sáb a sex) +150 ao fechar a sexta. 7 dias bons seguidos +100.

**Níveis:** de Na toca (0) a Surfista (9.000). Depois do 10, a contagem recomeça com uma estrela. Cada nível novo abre um baú de R$25 a R$50.

**Dinheiro livre** (entra todo travado; R$60 de delivery à parte, o resto dividido):

- **XP 40%:** R$13 a cada 100 XP da quinzena, até o teto.
- **Terça e sexta 30%:** terça vale 1 parte (dias bons de sáb a ter), sexta 2 partes (dias bons de qua a sex) +20% com a semana toda boa e +20% com 3 treinos.
- **Baú surpresa 15%:** cada bônus registrado rola um baú (vazio 40%, R$5 30%, R$15 20%, R$40 10%). O baú de nível também sai daqui.
- **Desafio 15%:** missão sorteada no pagamento; cumpriu, libera tudo.
- **Delivery:** 2 tickets de R$30; cada um abre com 4 dias bons seguidos. O que sobrar vira disponível no fim.
- **Saque:** só terças e sextas, e tira o valor do montante. Fast food sem ticket é descontado do montante; os outros gastos são registro do que você gastou com o que já sacou.
- **Fim da quinzena:** o travado vai para a Caixa de Santos; o disponível não sacado passa para a próxima.

## Em aberto

- Tamanho da garrafa: está 767 ml (3 garrafas para 2,3 L). Mude em Ajustes; o número de garrafas se ajusta sozinho.
- Preço real das marmitas: Grana › Fixos (só a quinzena) ou Ajustes › Orçamento (padrão).
- Treino contar ou não para o dia bom (hoje não conta).
