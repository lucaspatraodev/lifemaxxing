# Colocar o Lifemaxxing no ar (Supabase + Vercel)

Tempo: uns 20 minutos. Custo: zero (planos gratuitos do Supabase, da Vercel e do Gemini ou Groq).

```
iPhone (app na Tela de Início)
        │
        ▼
Vercel ── arquivos do app (HTML, CSS, JS)
   │      funções /api: /api/state (dados) e /api/chat (coach)
   │
   ├──► Supabase (Postgres): guarda tudo
   └──► IA do coach: Gemini, Groq ou OpenAI
```

- As chaves do Supabase e da IA ficam só na Vercel. O navegador nunca vê nenhuma.
- **Sem senha:** o app abre direto. Quem tiver o link consegue abrir, então não compartilhe o endereço. Se um dia quiser proteger, veja "Senha (opcional)" no fim.

Ordem: **1. Supabase → 2. chave de IA → 3. Vercel → 4. iPhone**.

---

## 1. Supabase (o banco)

### 1.1 Criar o projeto

1. Entre em [supabase.com](https://supabase.com) e clique em **Start your project** (pode entrar com o GitHub).
2. Clique em **New project**.
3. Preencha:
   - **Name:** `lifemaxxing`
   - **Database Password:** clique em **Generate a password** e guarde num lugar seguro (o app não usa essa senha, mas o Supabase pede)
   - **Region:** **South America (São Paulo)**
4. Clique em **Create new project** e espere 1 a 2 minutos até ficar pronto.

### 1.2 Criar as tabelas

1. No menu da esquerda, abra **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo [`supabase/schema.sql`](../supabase/schema.sql) deste repositório, copie **tudo** e cole no editor.
4. Clique em **Run** (ou Ctrl/Cmd + Enter). Tem que aparecer **Success. No rows returned**.
5. Para conferir: abra **Table Editor** no menu. Devem aparecer as tabelas `estado` e `estado_backup` (vazias, o app preenche sozinho).

O que o `schema.sql` cria:

| Tabela | Para quê |
| --- | --- |
| `estado` | Uma linha com todos os seus dados (hábitos, XP, treinos, grana, conversa do coach) |
| `estado_backup` | Cópia automática de cada versão anterior (guarda as últimas 200) |

As duas ficam com RLS ligada e sem regras: ninguém de fora lê nada com a chave pública. Só a Vercel, com a chave secreta, acessa.

### 1.3 Copiar o endereço e a chave

1. Abra **Project Settings** (engrenagem no menu) e depois **Data API** (ou **API**).
2. Copie a **Project URL**, algo como `https://abcdefghijk.supabase.co`.
3. Abra **API Keys**.
4. Copie a chave **secret** (começa com `sb_secret_`). Se aparecer só o formato antigo, use a **service_role** (começa com `eyJ`).

> Use a **secret / service_role**. A **publishable / anon** não funciona (dá erro 401).
> Essa chave dá acesso total ao banco: guarde e cole só na Vercel.

---

## 2. Chave de IA do coach (pelo menos uma)

| IA | Custo | Onde pegar | Variável da chave |
| --- | --- | --- | --- |
| **Gemini** (Google) | Gratuito, com limite diário | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) › **Create API key** | `GEMINI_API_KEY` |
| **Groq** (Llama) | Gratuito, com limite por minuto | [console.groq.com/keys](https://console.groq.com/keys) › **Create API Key** | `GROQ_API_KEY` |
| **OpenAI** | Pago por uso | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | `OPENAI_API_KEY` |
| DeepSeek (extra) | Pago, barato | [platform.deepseek.com](https://platform.deepseek.com) | `DEEPSEEK_API_KEY` |
| OpenRouter (extra) | Tem modelos `:free` | [openrouter.ai/keys](https://openrouter.ai/keys) | `OPENROUTER_API_KEY` + `OPENROUTER_MODEL` |

**Recomendado:** Gemini como principal e Groq de reserva. Quando o limite gratuito de uma acabar, troque em **Ajustes › IA do coach**.

**Modelo:** cada IA tem um padrão (`gemini-flash-latest`, que aponta sempre para o Gemini Flash mais novo, `llama-3.3-70b-versatile`, `gpt-4o-mini`, `deepseek-chat`). Para outro modelo, cadastre a variável `GEMINI_MODEL` (ou `GROQ_MODEL`, `OPENAI_MODEL`...) com o nome **exato** que aparece no painel do provedor. Nome errado → o coach avisa "Modelo não encontrado".

---

## 3. Vercel (o app no ar)

### 3.1 Importar o repositório

1. Entre em [vercel.com](https://vercel.com) com o **GitHub** (Continue with GitHub).
2. Clique em **Add New… › Project**.
3. Ache o repositório **lifemaxxing** e clique em **Import**. Se ele não aparecer, clique em **Adjust GitHub App Permissions** e libere o repositório.
4. Em **Configure Project**:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build and Output Settings:** deixe tudo vazio (não tem build)

### 3.2 Variáveis de ambiente

Ainda na mesma tela, abra **Environment Variables** e adicione uma por uma (Key e Value, depois **Add**):

| Key | Value | Obrigatória? |
| --- | --- | --- |
| `SUPABASE_URL` | Project URL do passo 1.3 | Sim |
| `SUPABASE_SECRET_KEY` | Chave secret do passo 1.3 | Sim |
| `GEMINI_API_KEY` | Chave do Gemini | Pelo menos uma IA |
| `GROQ_API_KEY` | Chave do Groq | Opcional (reserva) |
| `OPENAI_API_KEY` | Chave da OpenAI | Opcional |
| `IA_PROVEDOR` | `gemini` (ou `groq`, `openai`, `deepseek`, `openrouter`) | Opcional |
| `GEMINI_MODEL` | Nome de outro modelo Gemini | Opcional |

A lista completa está em [`.env.example`](../.env.example).

### 3.3 Publicar

1. Clique em **Deploy** e espere menos de 1 minuto.
2. Clique em **Continue to Dashboard** e depois no endereço (ex.: `lifemaxxing.vercel.app` ou `lifemaxxing-seunome.vercel.app`).
3. O app abre direto no **Hoje**, valendo a partir de hoje.

**Para conferir se o banco ligou:** abra **Ajustes** no app. No bloco **Modo** deve aparecer "Salvo na nuvem". No Supabase, em **Table Editor › estado**, aparece uma linha `principal`.

**Para conferir o coach:** toque no botão azul do centro do menu e mande "Como está minha quinzena?".

### 3.4 Atualizações

- Cada `git push` na branch `main` publica de novo sozinho.
- **Mudou ou criou uma variável?** Vá em **Deployments**, clique nos três pontinhos do último deploy e em **Redeploy**. As funções só leem as variáveis novas depois disso.

---

## 4. Instalar no iPhone

1. Abra o endereço da Vercel no **Safari** (não funciona instalar pelo Chrome no iPhone).
2. Toque em **Compartilhar** (quadrado com seta para cima).
3. Role e toque em **Adicionar à Tela de Início** › **Adicionar**.
4. Abra pelo ícone novo: o app abre em tela cheia, sem a barra do Safari.

No Android: Chrome › menu ⋮ › **Instalar app**.

---

## Como funciona no dia a dia

- **Dados:** cada mudança é salva no celular na hora e enviada ao Supabase cerca de 1 segundo depois. Sem internet, o app continua funcionando e envia quando a conexão volta.
- **Começar no meio da quinzena (adaptação):** se o banco estiver vazio e você abrir o app no meio de uma quinzena, ela vira uma **quinzena de adaptação**. O dinheiro livre, o delivery, a meta de XP e o desafio ficam proporcionais aos dias que restam. Ex.: começando dia 21 (quinzena de 15 a 29), são 9 de 15 dias = 60%, então R$935 viram R$561. O pagamento do dia 15 já passou, então não aparece a tarefa de custos fixos. No dia 30 começa a primeira quinzena cheia, com o que sobrou travado somado.
- **Dias:** fecham sozinhos à meia-noite. Se ficar dias sem abrir, o app fecha esses dias e mostra um resumo.
- **Dois aparelhos:** vale o que salvou primeiro; o outro recebe os dados novos e mostra um aviso.
- **Backup:** cada gravação guarda a versão anterior em `estado_backup`. Para voltar a uma versão, veja o comando no final do `supabase/schema.sql`.
- **Modo teste:** em **Ajustes › Modo › Abrir modo teste** (apaga os dados reais e simula a partir de 15/12/2026). Para voltar: **Começar de verdade hoje**.

---

## Problemas comuns

| O que aparece | O que fazer |
| --- | --- |
| Toast "Servidor: Defina SUPABASE_URL..." | Faltam as variáveis do Supabase. Cadastre e faça **Redeploy** |
| "Supabase respondeu 401" | Chave errada: use a **secret** (`sb_secret_`) ou **service_role**, não a publishable/anon |
| "Supabase respondeu 404" | O `schema.sql` não rodou. Volte ao passo 1.2 |
| Ajustes diz "Salvo só neste aparelho" | O app não achou o `/api`. Confira se o deploy terminou e se está abrindo o endereço da Vercel |
| Coach: "Nenhuma IA configurada" | Falta `GEMINI_API_KEY` (ou outra) ou o **Redeploy** |
| Coach: "Limite do plano gratuito" | Espere ou troque de IA em **Ajustes › IA do coach** |
| Coach: "Modelo não encontrado" | Nome errado em `GEMINI_MODEL` (ou na variável da IA usada) |
| App com versão antiga depois de atualizar | Feche o app e abra de novo; a versão nova entra na segunda abertura |

Para ver erros detalhados: Vercel › seu projeto › **Logs**.

---

## Senha (opcional)

Se um dia quiser que o app peça senha:

1. Na Vercel, crie a variável `APP_PASSWORD` com a senha que quiser.
2. Faça **Redeploy**.
3. Na próxima abertura o app pede a senha uma vez; o aparelho fica lembrado por 180 dias. Em **Ajustes** aparece **Sair deste aparelho**.

Para tirar a senha, apague a variável e faça Redeploy.

---

## Rodar no computador (opcional)

```bash
npm i -g vercel
vercel link              # liga a pasta ao projeto da Vercel
vercel env pull .env.local
vercel dev               # abre em http://localhost:3000
```

Sem a Vercel, dá para abrir o `index.html` direto no navegador: o app roda só no navegador, em modo teste, sem coach.
