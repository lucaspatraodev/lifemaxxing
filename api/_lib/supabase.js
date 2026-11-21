// Acesso ao Supabase pela API REST (sem dependências).
// Guarda o estado inteiro do app em uma linha da tabela "estado" (jsonb),
// com número de versão para não sobrescrever mudanças de outro aparelho.
const TABELA = 'estado';
const ID = 'principal';

function cfg() {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) throw new Error('Defina SUPABASE_URL e SUPABASE_SECRET_KEY na Vercel');
  return { url: url.replace(/\/+$/, ''), chave };
}
function cabecalhos(chave, extra = {}) {
  const h = { apikey: chave, 'Content-Type': 'application/json', ...extra };
  if (chave.startsWith('eyJ')) h.Authorization = 'Bearer ' + chave; // chave service_role antiga (JWT)
  return h;
}
async function falha(r) {
  const e = new Error(`Supabase respondeu ${r.status}: ${(await r.text()).slice(0, 300)}`);
  e.status = r.status;
  return e;
}

export async function lerEstado() {
  const { url, chave } = cfg();
  const r = await fetch(`${url}/rest/v1/${TABELA}?id=eq.${ID}&select=dados,versao,atualizado_em`, { headers: cabecalhos(chave) });
  if (!r.ok) throw await falha(r);
  const linhas = await r.json();
  return linhas[0] || null;
}

// Grava se a versão do banco ainda for "versaoBase". Senão devolve { conflito: true }.
export async function gravarEstado(dados, versaoBase) {
  const { url, chave } = cfg();
  const base = Number(versaoBase) || 0;
  if (base === 0) {
    const r = await fetch(`${url}/rest/v1/${TABELA}`, {
      method: 'POST',
      headers: cabecalhos(chave, { Prefer: 'return=representation' }),
      body: JSON.stringify({ id: ID, dados, versao: 1 })
    });
    if (r.status === 409) return { conflito: true };
    if (!r.ok) throw await falha(r);
    const [linha] = await r.json();
    return { versao: linha.versao };
  }
  const r = await fetch(`${url}/rest/v1/${TABELA}?id=eq.${ID}&versao=eq.${base}`, {
    method: 'PATCH',
    headers: cabecalhos(chave, { Prefer: 'return=representation' }),
    body: JSON.stringify({ dados, versao: base + 1, atualizado_em: new Date().toISOString() })
  });
  if (!r.ok) throw await falha(r);
  const linhas = await r.json();
  return linhas.length ? { versao: linhas[0].versao } : { conflito: true };
}
