// Login opcional. Sem a variável APP_PASSWORD o app abre direto, sem senha.
// Com APP_PASSWORD, pede a senha uma vez e guarda a sessão num cookie assinado com HMAC.
import crypto from 'node:crypto';

const NOME = 'lm_sessao';
const DIAS = 180;

export const temSenha = () => !!process.env.APP_PASSWORD;

function segredo() {
  return process.env.SESSION_SECRET || process.env.APP_PASSWORD || 'lifemaxxing-sem-senha';
}
const assinar = (v) => crypto.createHmac('sha256', segredo()).update(v).digest('base64url');

export function criarCookie() {
  const v = `v1.${Date.now() + DIAS * 864e5}`;
  return `${NOME}=${v}.${assinar(v)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DIAS * 86400}`;
}
export const cookieSaida = () => `${NOME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

export function logado(req) {
  const par = String(req.headers.cookie || '').split(/;\s*/).find((x) => x.startsWith(NOME + '='));
  if (!par) return false;
  const val = par.slice(NOME.length + 1);
  const i = val.lastIndexOf('.');
  if (i < 0) return false;
  const v = val.slice(0, i), sig = Buffer.from(val.slice(i + 1)), ok = Buffer.from(assinar(v));
  if (sig.length !== ok.length || !crypto.timingSafeEqual(sig, ok)) return false;
  return Number(v.split('.')[1]) > Date.now();
}

// Compara a senha em tempo constante
export function senhaConfere(senha) {
  const certa = process.env.APP_PASSWORD || '';
  if (!certa) return false;
  const h = (s) => crypto.createHash('sha256').update(String(s)).digest();
  return crypto.timingSafeEqual(h(senha || ''), h(certa));
}

export function exigirLogin(req, res) {
  if (!temSenha() || logado(req)) return true;
  res.status(401).json({ erro: 'login' });
  return false;
}
