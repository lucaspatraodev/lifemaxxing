// Conexões de IA. Cada provedor liga quando a chave dele existe nas variáveis de ambiente.
// Gemini usa a API própria do Google; os outros usam o formato compatível com OpenAI.
export const PROVEDORES = {
  gemini: { nome: 'Gemini', chave: 'GEMINI_API_KEY', modelo: 'GEMINI_MODEL', padrao: 'gemini-flash-latest', reserva: ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'], tipo: 'gemini', gratis: true },
  groq: { nome: 'Groq', chave: 'GROQ_API_KEY', modelo: 'GROQ_MODEL', padrao: 'llama-3.3-70b-versatile', tipo: 'openai', base: 'https://api.groq.com/openai/v1', gratis: true },
  openai: { nome: 'OpenAI', chave: 'OPENAI_API_KEY', modelo: 'OPENAI_MODEL', padrao: 'gpt-4o-mini', tipo: 'openai', base: 'https://api.openai.com/v1' },
  // extras no mesmo formato
  deepseek: { nome: 'DeepSeek', chave: 'DEEPSEEK_API_KEY', modelo: 'DEEPSEEK_MODEL', padrao: 'deepseek-chat', tipo: 'openai', base: 'https://api.deepseek.com' },
  openrouter: { nome: 'OpenRouter', chave: 'OPENROUTER_API_KEY', modelo: 'OPENROUTER_MODEL', padrao: null, tipo: 'openai', base: 'https://openrouter.ai/api/v1' }
};

const modeloDe = (p) => process.env[p.modelo] || p.padrao;

export function disponiveis() {
  return Object.entries(PROVEDORES)
    .filter(([, p]) => process.env[p.chave] && modeloDe(p))
    .map(([id, p]) => ({ id, nome: p.nome, modelo: modeloDe(p), gratis: !!p.gratis }));
}

export function escolher(pedido) {
  const lista = disponiveis();
  return lista.find((p) => p.id === pedido) || lista.find((p) => p.id === process.env.IA_PROVEDOR) || lista[0] || null;
}

// Lê um corpo SSE e devolve o conteúdo de cada linha "data:"
async function* eventosSSE(corpo) {
  const dec = new TextDecoder();
  let buf = '';
  for await (const pedaco of corpo) {
    buf += dec.decode(pedaco, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const linha = buf.slice(0, i).replace(/\r$/, '');
      buf = buf.slice(i + 1);
      if (linha.startsWith('data:')) { const d = linha.slice(5).trim(); if (d) yield d; }
    }
  }
}

async function checar(r, nome) {
  if (r.ok) return;
  let detalhe = '';
  try { detalhe = (await r.text()).slice(0, 400); } catch (e) { /* ignora */ }
  const e = new Error(`${nome} respondeu ${r.status}`);
  e.status = r.status; e.detalhe = detalhe;
  throw e;
}

// Conversa em streaming: devolve pedaços de texto conforme chegam
export async function* conversar(id, sistema, mensagens, signal) {
  const p = PROVEDORES[id];
  const chave = process.env[p.chave];
  const modelo = modeloDe(p);

  if (p.tipo === 'gemini') {
    // tenta o modelo configurado e, se ele não existir (404), os apelidos de reserva
    const modelos = [modelo, ...(p.reserva || [])].filter((m, i, a) => m && a.indexOf(m) === i);
    let r = null;
    for (const m of modelos) {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:streamGenerateContent?alt=sse`, {
        method: 'POST', signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': chave },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sistema }] },
          contents: mensagens.map((x) => ({ role: x.role === 'assistant' ? 'model' : 'user', parts: [{ text: x.content }] })),
          // limite alto: modelos que "pensam" gastam parte dele antes de escrever
          generationConfig: { temperature: 0.6, maxOutputTokens: 8192 }
        })
      });
      if (r.status !== 404) break;
    }
    await checar(r, p.nome);
    for await (const ev of eventosSSE(r.body)) {
      let j; try { j = JSON.parse(ev); } catch (e) { continue; }
      const t = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map((x) => x.text || '').join('');
      if (t) yield t;
    }
    return;
  }

  const cab = { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}` };
  if (id === 'openrouter') cab['X-Title'] = 'Lifemaxxing';
  const corpo = { model: modelo, stream: true, temperature: 0.6, messages: [{ role: 'system', content: sistema }, ...mensagens] };
  if (id === 'openai') corpo.max_completion_tokens = 8192; else corpo.max_tokens = 4096; // folga para modelos que raciocinam
  const r = await fetch(`${p.base}/chat/completions`, { method: 'POST', signal, headers: cab, body: JSON.stringify(corpo) });
  await checar(r, p.nome);
  for await (const ev of eventosSSE(r.body)) {
    if (ev === '[DONE]') return;
    let j; try { j = JSON.parse(ev); } catch (e) { continue; }
    const t = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
    if (t) yield t;
  }
}

// Mensagem de erro legível para o app
export function erroAmigavel(e, provedor) {
  const s = e && e.status;
  const varModelo = PROVEDORES[provedor] ? PROVEDORES[provedor].modelo : 'o modelo';
  if (s === 401 || s === 403) return `A chave da ${PROVEDORES[provedor].nome} foi recusada. Confira a variável na Vercel.`;
  if (s === 429) return 'Limite do plano gratuito atingido. Tente daqui a pouco ou troque de IA em Ajustes.';
  if (s === 404) return `Modelo não encontrado. Confira ${varModelo} na Vercel.`;
  if (s === 400) return 'A IA recusou o pedido (contexto grande demais ou modelo sem suporte). Limpe a conversa e tente de novo.';
  return 'A IA não respondeu. Tente de novo.';
}
