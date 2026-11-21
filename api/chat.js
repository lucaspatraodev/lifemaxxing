// GET  /api/chat → IAs configuradas
// POST /api/chat { provedor?, sistema, mensagens } → resposta em texto, em streaming
// O app manda o contexto completo (dados do usuário) em "sistema": a IA não roda queries.
import { exigirLogin } from './_lib/sessao.js';
import { disponiveis, escolher, conversar, erroAmigavel } from './_lib/ia.js';

const MAX_SISTEMA = 300000;

export default async function handler(req, res) {
  if (!exigirLogin(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const p = escolher();
    return res.status(200).json({ provedores: disponiveis(), padrao: p ? p.id : null });
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).end(); }

  const { provedor, sistema, mensagens } = req.body || {};
  const ok = typeof sistema === 'string' && sistema.length <= MAX_SISTEMA && Array.isArray(mensagens) && mensagens.length > 0 && mensagens.length <= 40
    && mensagens.every((m) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.length > 0 && m.content.length < 20000)
    && mensagens[mensagens.length - 1].role === 'user';
  if (!ok) return res.status(400).json({ erro: 'Pedido inválido' });

  const principal = escolher(provedor);
  if (!principal) return res.status(503).json({ erro: 'Nenhuma IA configurada. Adicione GEMINI_API_KEY, GROQ_API_KEY ou OPENAI_API_KEY na Vercel.' });
  // se a escolhida falhar antes de escrever, tenta as outras configuradas
  const fila = [principal, ...disponiveis().filter((x) => x.id !== principal.id)];

  const ctl = new AbortController();
  res.on('close', () => { if (!res.writableEnded) ctl.abort(); }); // o app parou ou fechou
  let escreveu = false, ultimoErro = null, ultimo = principal;
  for (const p of fila) {
    ultimo = p;
    try {
      for await (const t of conversar(p.id, sistema, mensagens, ctl.signal)) {
        if (!escreveu) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('X-Provedor', p.id);
          res.setHeader('X-Accel-Buffering', 'no');
          escreveu = true;
        }
        res.write(t);
      }
      if (escreveu) break;
      ultimoErro = Object.assign(new Error('resposta vazia'), { status: 0 });
    } catch (e) {
      if (ctl.signal.aborted) return res.end();
      console.error(p.id, e.message, e.detalhe || '');
      ultimoErro = e;
      if (escreveu) { res.write('\n\n[resposta interrompida]'); break; }
    }
  }
  if (!escreveu) {
    const msg = ultimoErro && ultimoErro.status === 0 ? 'A IA respondeu vazio. Tente de novo.' : erroAmigavel(ultimoErro, ultimo.id);
    return res.status(502).json({ erro: msg });
  }
  return res.end();
}
