// POST /api/login  { senha }  → define o cookie de sessão (só usado se APP_PASSWORD existir)
import { criarCookie, senhaConfere, temSenha } from './_lib/sessao.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  if (!temSenha()) return res.status(200).json({ ok: true, semSenha: true }); // sem senha configurada: entra direto
  if (!senhaConfere((req.body || {}).senha)) {
    await new Promise((r) => setTimeout(r, 800)); // freia tentativas em sequência
    return res.status(401).json({ erro: 'Senha errada' });
  }
  res.setHeader('Set-Cookie', criarCookie());
  return res.status(200).json({ ok: true });
}
