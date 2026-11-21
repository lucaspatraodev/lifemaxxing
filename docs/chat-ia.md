# Chat de IA (Coach) — abordagem

## O que o usuário vê

- Botão no centro do menu inferior. **Toque** abre, **arrastar para cima** abre seguindo o dedo; arrastar o cabeçalho para baixo fecha.
- Animação curta (cerca de 340 ms, curva com desaceleração), sem carregamento pesado: o painel já existe na página, só desliza.
- Sugestões prontas na tela vazia ("Como está minha quinzena?", "Onde estou gastando mais?").
- Resposta aparece enquanto é escrita (streaming), com botão de parar.
- Voz: botão de microfone quando o navegador oferece transcrição. No iPhone, o microfone do próprio teclado já funciona em qualquer campo.

## Como a IA conhece os dados: contexto completo, sem queries

O banco de um app pessoal é pequeno. Em vez de deixar a IA rodar SQL, **mandamos um retrato compacto de tudo a cada pergunta**:

| Bloco | Conteúdo |
| --- | --- |
| Regras | Como XP, dia bom, potes, saque e Caixa de Santos funcionam (texto fixo) |
| Agora | Data, nível, XP, sequência, hábitos (obrigação ou bônus) |
| Quinzena | Entrada, fixos, livre, liberado, disponível, sacado, travado, potes, desafio, tickets, gastos, saques |
| Dias | Uma linha por dia dos últimos 60: dia bom, XP, hábitos feitos, fast food |
| Treinos | Últimos 30, com séries (carga × reps), volume, intensidade, recordes |
| Histórico | Quinzenas fechadas e Caixa de Santos |

Tamanho estimado: 15 a 25 KB de texto (uns 5 a 8 mil tokens). Cabe com folga e custa pouco.

Vantagens: a IA não erra SQL, não precisa de acesso ao banco, não consegue alterar nada, e a resposta é rápida (uma única chamada).

No protótipo isso está em `contextoIA()` e `promptIA()` no `app.js`.

## Onde roda

**Vercel (versão de verdade):** `POST /api/chat` (`api/chat.js`).

1. O app monta o retrato (`promptIA()`) e envia junto com as últimas 12 mensagens.
2. A função escolhe a IA: a que você marcou em **Ajustes › IA do coach**, senão `IA_PROVEDOR`, senão a primeira com chave.
3. Chama a IA em streaming e repassa o texto conforme chega. A chave fica só na Vercel.
4. Conexões prontas (`api/_lib/ia.js`):
   - **Gemini**: API própria do Google (`streamGenerateContent`)
   - **Groq**: gratuito, modelos Llama, formato OpenAI
   - **OpenAI**
   - **DeepSeek** e **OpenRouter**: extras, também no formato OpenAI
5. Voz: transcrição do próprio navegador (`webkitSpeechRecognition`, funciona no Safari do iPhone), em português. O microfone do teclado também funciona.

**Protótipo publicado no claude.ai:** usa o Claude da sua conta pela capacidade `sample` da página.

**Arquivo aberto direto:** sem IA (mostra um aviso).

Configuração das chaves: [`DEPLOY.md`](DEPLOY.md).

## Quando o histórico crescer

Com anos de dados, as linhas diárias passam de 100 KB. Aí:

- Manter os últimos 60 a 90 dias em linhas e o resto como **resumos mensais** (médias, totais, recordes).
- Se precisar de detalhe antigo, dar à IA 2 ou 3 **ferramentas de leitura** fixas (ex.: `gastos_por_periodo(inicio, fim)`, `treinos_do_exercicio(nome)`), que rodam consultas nossas. Continua sem SQL livre e sem escrita.

## Decisões em aberto

- [ ] Arrastar para cima é o único gesto ou também tocar? (hoje: os dois)
- [ ] O coach pode **registrar** coisas por você ("marquei 2 garrafas")? Exigiria ferramentas de escrita com confirmação.
- [ ] Voz: a transcrição do navegador basta ou vale um serviço externo (ex.: Whisper) para mais precisão.
