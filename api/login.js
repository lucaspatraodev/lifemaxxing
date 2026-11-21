// POST /api/login  { senha }  → define o cookie de sessão
import { criarCookie, senhaConfere } from './_lib/sessao.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  if (!process.env.APP_PASSWORD) return res.status(500).json({ erro: 'APP_PASSWORD não configurada na Vercel' });
  if (!senhaConfere((req.body || {}).senha)) {
    await new Promise((r) => setTimeout(r, 800)); // freia tentativas em sequência
    return res.status(401).json({ erro: 'Senha errada' });
  }
  res.setHeader('Set-Cookie', criarCookie());
  return res.status(200).json({ ok: true });
}
