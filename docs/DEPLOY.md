# Subir o Lifemaxxing (Vercel + Supabase)

Tempo: uns 20 minutos. Custo: zero (planos gratuitos da Vercel, do Supabase e do Gemini ou Groq).

```
Celular (PWA)  ──►  Vercel: arquivos do app + funções /api  ──►  Supabase (Postgres)
                                    │
                                    └──►  IA do coach: Gemini, Groq ou OpenAI
```

- O app (HTML, CSS e JS) é servido como site estático.
- `/api/login`, `/api/state` e `/api/chat` são funções Node da Vercel, sem dependências.
- O Supabase guarda o estado inteiro em uma linha (`jsonb`), com cópia automática das últimas 200 versões.
- As chaves (Supabase e IA) ficam só na Vercel. O navegador nunca vê nenhuma.

---

## 1. Supabase (banco)

1. Crie uma conta em [supabase.com](https://supabase.com) e clique em **New project**.
   - Nome: `lifemaxxing`. Região: **South America (São Paulo)**. Guarde a senha do banco.
2. No menu da esquerda, abra **SQL Editor › New query**.
3. Cole todo o conteúdo de [`supabase/schema.sql`](../supabase/schema.sql) e clique em **Run**. Deve aparecer "Success".
4. Abra **Project Settings › API Keys** e copie:
   - **Project URL** (ex.: `https://abcd1234.supabase.co`). Em alguns painéis ela fica em **Project Settings › Data API**.
   - A chave **secret** (`sb_secret_...`). Em projetos antigos ela aparece como **service_role** (começa com `eyJ`); serve também.

> A chave secreta dá acesso total ao banco. Nunca coloque ela no código nem mande para ninguém. Ela vai só nas variáveis da Vercel.

## 2. Chave de IA (pelo menos uma)

| IA | Custo | Onde pegar a chave | Variáveis |
| --- | --- | --- | --- |
| **Gemini** (Google) | Gratuito com limite diário | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | `GEMINI_API_KEY`, `GEMINI_MODEL` |
| **Groq** (Llama) | Gratuito com limite por minuto | [console.groq.com/keys](https://console.groq.com/keys) | `GROQ_API_KEY`, `GROQ_MODEL` |
| **OpenAI** | Pago por uso | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | `OPENAI_API_KEY`, `OPENAI_MODEL` |
| DeepSeek (extra) | Pago, bem barato | [platform.deepseek.com](https://platform.deepseek.com) | `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL` |
| OpenRouter (extra) | Tem modelos `:free` | [openrouter.ai/keys](https://openrouter.ai/keys) | `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (obrigatório) |

**Modelo:** cada IA usa um padrão (`gemini-2.5-flash`, `llama-3.3-70b-versatile`, `gpt-4o-mini`, `deepseek-chat`). Para usar outro, preencha a variável `..._MODEL` com o nome exato que aparece no painel do provedor. Por exemplo, um Gemini mais antigo e gratuito: copie o nome do modelo na lista do AI Studio e coloque em `GEMINI_MODEL`. Se o nome estiver errado, o coach avisa "Modelo não encontrado".

**Recomendação:** comece com **Gemini** e cadastre também **Groq** como reserva. Quando o limite gratuito de uma acabar, troque em **Ajustes › IA do coach** no app.

## 3. Vercel (app e funções)

1. Crie uma conta em [vercel.com](https://vercel.com) entrando com o GitHub.
2. **Add New… › Project** e importe o repositório `lifemaxxing`.
3. Configuração do projeto:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command** e **Output Directory:** deixe vazios
4. Abra **Environment Variables** e cadastre:

| Variável | Valor |
| --- | --- |
| `APP_PASSWORD` | A senha para entrar no app (use uma forte) |
| `SUPABASE_URL` | Project URL do passo 1 |
| `SUPABASE_SECRET_KEY` | Chave secreta do passo 1 |
| `GEMINI_API_KEY` | Chave do Gemini (se usar) |
| `GROQ_API_KEY` | Chave do Groq (se usar) |
| `OPENAI_API_KEY` | Chave da OpenAI (se usar) |
| `IA_PROVEDOR` | Qual IA usar por padrão: `gemini`, `groq`, `openai`, `deepseek` ou `openrouter` |

   As variáveis `..._MODEL` e `SESSION_SECRET` são opcionais. A lista completa está em [`.env.example`](../.env.example).

5. Clique em **Deploy**. Em menos de um minuto sai o link, tipo `lifemaxxing.vercel.app`.

Mudou alguma variável depois? Vá em **Deployments**, abra o último e clique em **Redeploy**: as funções só leem as variáveis novas depois disso.

Cada `git push` na `main` publica de novo sozinho.

## 4. Instalar no iPhone

1. Abra o link no **Safari**.
2. Entre com a senha (`APP_PASSWORD`).
3. Toque em **Compartilhar › Adicionar à Tela de Início**.
4. Abra pelo ícone: o app abre em tela cheia, sem a barra do Safari.

No Android (Chrome): menu ⋮ › **Instalar app**.

O login vale por 180 dias no aparelho. Para sair: **Ajustes › Sair deste aparelho**.

## 5. Primeiro uso

- Com o banco vazio, o app começa **valendo hoje**: data e horário reais, e o período (manhã, tarde, noite) segue o relógio.
- No primeiro acesso aparece **Registrar custos fixos**: confira os valores da quinzena e confirme.
- Os dias fecham sozinhos à meia-noite. Se você ficar dias sem abrir, o app fecha esses dias e mostra um resumo.
- O simulador continua disponível: **Ajustes › Modo › Abrir modo teste**. Ele apaga os dados reais, então use antes de começar de verdade.

## 6. Como os dados ficam salvos

- Cada mudança é salva no aparelho na hora e enviada ao Supabase cerca de 1 segundo depois.
- Sem internet, o app continua funcionando e envia quando a conexão volta.
- Dois aparelhos: vale o que salvou primeiro. Se o outro aparelho salvou antes, este recebe os dados dele e mostra um aviso.
- Cópias: cada gravação guarda a versão anterior na tabela `estado_backup` (últimas 200). Para voltar a uma delas, veja o final de `supabase/schema.sql`.

## 7. Rodar no computador (opcional)

```bash
npm i -g vercel
vercel link        # liga a pasta ao projeto da Vercel
vercel env pull .env.local
vercel dev         # abre em http://localhost:3000
```

Sem a Vercel, dá para abrir o `index.html` direto: o app roda só no navegador (modo teste, sem login, sem coach).

## Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| "APP_PASSWORD não configurada" | Faltou a variável, ou faltou o Redeploy depois de criar |
| "Servidor: Defina SUPABASE_URL..." | Faltam as variáveis do Supabase |
| "Supabase respondeu 404" | O `schema.sql` não rodou (a tabela `estado` não existe) |
| "Supabase respondeu 401" | Chave errada: use a **secret** ou **service_role**, não a publishable/anon |
| Coach: "Nenhuma IA configurada" | Nenhuma `..._API_KEY` cadastrada (ou faltou o Redeploy) |
| Coach: "Limite do plano gratuito" | Espere ou troque de IA em Ajustes › IA do coach |
| Coach: "Modelo não encontrado" | Nome errado em `..._MODEL` |
| App antigo depois de atualizar | Feche e abra de novo; o service worker pega a versão nova na segunda abertura |
