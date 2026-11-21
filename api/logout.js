// POST /api/logout → apaga o cookie
import { cookieSaida } from './_lib/sessao.js';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', cookieSaida());
  return res.status(200).json({ ok: true });
}
