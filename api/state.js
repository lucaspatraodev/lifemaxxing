// GET  /api/state           → { dados, versao }  (dados = null se o banco está vazio)
// PUT  /api/state { dados, versao } → { versao }  ou 409 com o estado atual se outro aparelho salvou antes
import { exigirLogin, temSenha } from './_lib/sessao.js';
import { lerEstado, gravarEstado } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (!exigirLogin(req, res)) return;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Login', temSenha() ? 'senha' : 'aberto');
  try {
    if (req.method === 'GET') {
      const e = await lerEstado();
      return res.status(200).json(e || { dados: null, versao: 0 });
    }
    if (req.method === 'PUT') {
      const { dados, versao } = req.body || {};
      if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return res.status(400).json({ erro: 'Envie { dados, versao }' });
      const r = await gravarEstado(dados, versao);
      if (r.conflito) return res.status(409).json(await lerEstado());
      return res.status(200).json(r);
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: e.message });
  }
}
