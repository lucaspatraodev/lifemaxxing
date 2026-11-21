/* =========================================================
   Lifemaxxing — protótipo
   HTML, CSS e JS puro. Tudo salvo no localStorage.
   O app inteiro usa a DATA SIMULADA (S.sim.data), nunca a data real.
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. Utilitários
   --------------------------------------------------------- */
const $ = (s, r = document) => r.querySelector(s);
const CHAVE = 'lifemaxxing_v1';
const clone = (o) => JSON.parse(JSON.stringify(o));
const uid = () => Math.random().toString(36).slice(2, 10);
const soma = (arr) => arr.reduce((a, b) => a + (Number(b) || 0), 0);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rand = (n) => Math.floor(Math.random() * n);

// Dinheiro: "R$13" ou "R$43,75"
function brl(v) {
  const c = Math.round((Number(v) || 0) * 100) / 100;
  const neg = c < 0;
  const a = Math.abs(c);
  const txt = a.toLocaleString('pt-BR', { minimumFractionDigits: Number.isInteger(a) ? 0 : 2, maximumFractionDigits: 2 });
  return (neg ? '−R$' : 'R$') + txt;
}
const num = (v) => Math.round(v).toLocaleString('pt-BR');

// Datas sempre como texto 'AAAA-MM-DD' (meio-dia local, sem problema de fuso)
const isoDe = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
function paraData(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); }
function paraIso(dt) { return isoDe(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()); }
function somaDias(iso, n) { const d = paraData(iso); d.setDate(d.getDate() + n); return paraIso(d); }
const diaSemana = (iso) => paraData(iso).getDay(); // 0 dom ... 6 sáb
const diasNoMes = (y, m) => new Date(y, m, 0).getDate(); // m de 1 a 12
const entre = (iso, a, b) => iso >= a && iso <= b;
function intervalo(a, b) { const r = []; for (let d = a; d <= b; d = somaDias(d, 1)) r.push(d); return r; }
const minIso = (a, b) => (a < b ? a : b);

const SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const SEMANA_CURTA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const SEMANA_LETRA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const PERIODOS = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite' };

function dataLonga(iso) { const d = paraData(iso); return `${SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; }
function dataCurta(iso) { const d = paraData(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`; }

/* ---------------------------------------------------------
   2. Ícones SVG de traço
   --------------------------------------------------------- */
const IC = {
  tooth: '<path d="M7.5 3.5c-2.3 0-4 1.7-4 4.2 0 2 .9 3.5 1.4 5.4.6 2.5.9 7.4 2.8 7.4 1.6 0 1.7-4.6 2.6-6 .6-.9 2.8-.9 3.4 0 .9 1.4 1 6 2.6 6 1.9 0 2.2-4.9 2.8-7.4.5-1.9 1.4-3.4 1.4-5.4 0-2.5-1.7-4.2-4-4.2-1.8 0-2.6 1-4.5 1s-2.7-1-4.5-1z"/>',
  drop: '<path d="M12 3.5s6 6.3 6 10.8a6 6 0 0 1-12 0C6 9.8 12 3.5 12 3.5z"/>',
  sparkle: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  apple: '<path d="M12 7.5c-2.6-1.6-7-1-7 4.3 0 4.2 2.8 8.7 5 8.7 1 0 1.3-.5 2-.5s1 .5 2 .5c2.2 0 5-4.5 5-8.7 0-5.3-4.4-5.9-7-4.3z"/><path d="M12 7.5c0-2.3 1-3.8 3-4.5"/>',
  moon: '<path d="M19.5 14.8A8 8 0 1 1 9.2 4.5a6.4 6.4 0 0 0 10.3 10.3z"/>',
  door: '<path d="M6 21V4.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V21"/><path d="M3.5 21h17"/><path d="M14.5 12.5h.01"/>',
  dumbbell: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  phoneoff: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M3.5 3.5l17 17"/>',
  tree: '<path d="M12 21v-4.5"/><path d="M12 3l-6 8h3.2L6 16.5h12L14.8 11H18z"/>',
  wave: '<path d="M2.5 15c2.4-3 4.4-3 6.4 0s4 3 6.2 0 4.2-3 6.4 0"/><path d="M5 10.5C6.5 6.3 9.6 4.5 13 5.2c-2.3 1.2-3 3.2-2 5.3"/>',
  flame: '<path d="M12 3c.8 3.2 5.5 5.2 5.5 10.2a5.5 5.5 0 0 1-11 0c0-2.4 1.2-4 2.3-5 0 2 1 3.2 2.2 3.2 0-3.2-1-5.4 1-8.4z"/>',
  sliders: '<path d="M4 6.5h9M17 6.5h3M4 12h3M11 12h9M4 17.5h11M19 17.5h1"/><circle cx="15" cy="6.5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  home: '<path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10.5h18M16 15h1.5"/><path d="M6 6l9-2.5 1.5 2.5"/>',
  chart: '<path d="M4 20V11M10 20V5M16 20v-6M21.5 20h-19"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  next: '<path d="M9 5l7 7-7 7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/>',
  trophy: '<path d="M8 4.5h8v5a4 4 0 0 1-8 0z"/><path d="M8 6.5H5a3 3 0 0 0 3 3.5M16 6.5h3a3 3 0 0 1-3 3.5M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z"/>',
  chest: '<rect x="3.5" y="10" width="17" height="10" rx="2"/><path d="M3.5 10a8.5 5.5 0 0 1 17 0M3.5 13.5h17"/><rect x="10.5" y="12" width="3" height="3.5" rx="1"/>',
  burger: '<path d="M4.5 11a7.5 5.5 0 0 1 15 0z"/><path d="M3.5 14.5h17"/><path d="M5 17.5h14a1.5 1.5 0 0 1-1.5 2h-11A1.5 1.5 0 0 1 5 17.5z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  unlock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 7.7-1.5"/>',
  ticket: '<path d="M3.5 8.5a2 2 0 0 0 0 4v3.5a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-3.5a2 2 0 0 1 0-4V5a1 1 0 0 0-1-1h-15a1 1 0 0 0-1 1z" transform="translate(0 1.5)"/><path d="M14.5 5.5v13" stroke-dasharray="2 2.2"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  run: '<circle cx="14.5" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2.5V21M6.5 11.5l3-3.5h4l2.5 3.5 2.5 1M10 13.5l1-5.5"/>',
  skate: '<path d="M3.5 13.5h17a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5z"/><circle cx="7.5" cy="19" r="1.6"/><circle cx="16.5" cy="19" r="1.6"/>',
  reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/>',
  play: '<path d="M7 5v14l12-7z"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-9 8.5"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
  bolt: '<path d="M13 2.5 5 13.5h6.5l-1 8 8-11h-6.5z"/>',
  dot: '<circle cx="12" cy="12" r="5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  book: '<path d="M4.5 5.5A2 2 0 0 1 6.5 3.5H19v15H6.5a2 2 0 0 0-2 2z"/><path d="M4.5 20.5v-15M19 18.5v2H6.5"/>'
};
const ICONES_HABITO = ['dot', 'tooth', 'sparkle', 'drop', 'apple', 'moon', 'door', 'sun', 'phoneoff', 'tree', 'wave', 'dumbbell', 'heart', 'book', 'bolt', 'run'];
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || IC.dot}</svg>`;

/* ---------------------------------------------------------
   3. Estado (localStorage)
   --------------------------------------------------------- */
let S; // estado salvo
// Estado só da interface (não é salvo)
const UI = { aba: 'hoje', periodoAba: null, exercicio: null, descanso: null, simAberta: true };

const DATA_TESTE = '2026-12-15'; // o modo teste sempre começa aqui
const hojeReal = () => paraIso(new Date());
function periodoReal() { const h = new Date().getHours(); return h < 12 ? 'manha' : h < 18 ? 'tarde' : 'noite'; }

// teste = simulador (data inventada, botões de avançar dia). Sem teste = data e hora reais.
function estadoInicial(config, data, teste) {
  return {
    v: 1,
    config: config ? clone(config) : clone(DADOS_INICIAIS),
    sim: { data, periodo: teste ? 'manha' : periodoReal(), teste },
    inicioApp: data,
    dias: {},        // { 'AAAA-MM-DD': { feitos: {'agua:0': true}, fastfood: [], fechado, bom } }
    xpLog: [],       // cada ganho de XP: { id, data, xp, rotulo }
    nivelMax: 1,     // maior nível já alcançado (estrelas*10 + nível), para não repetir o baú
    treinos: [],
    treinoAtivo: null,
    historico: [],   // quinzenas fechadas
    santos: 0,       // Caixa de viagem: recebe o fixo de R$300 em cada dia de pagamento
    santosUsos: [],  // o que foi usado da caixa (hospedagem, passagem...)
    quinzena: null
  };
}

// Lê o estado salvo no aparelho (true se havia)
function lerLocal() {
  try { const raw = localStorage.getItem(CHAVE); if (raw) { S = JSON.parse(raw); return true; } } catch (e) { /* ignora */ }
  return false;
}

// Começa do zero: em teste (data simulada) ou de verdade (hoje). Pode manter os ajustes.
function recomecar(teste, manterConfig) {
  const cfg = manterConfig && S ? S.config : null;
  S = estadoInicial(cfg, teste ? DATA_TESTE : hojeReal(), teste);
  S.quinzena = abrirQuinzena(S.sim.data);
  salvar();
}

function salvarLocal() {
  try { localStorage.setItem(CHAVE, JSON.stringify(S)); }
  catch (e) { toast('Não deu para salvar (armazenamento cheio?)'); }
}
// Salva no aparelho e, com servidor, agenda o envio para o Supabase
function salvar() {
  salvarLocal();
  if (NUVEM.ativo) marcarPendente();
}

/* ---------------------------------------------------------
   4. Hábitos e dias
   --------------------------------------------------------- */
const habitos = () => S.config.habitos;
const habito = (id) => habitos().find((h) => h.id === id);
const minimos = () => habitos().filter((h) => h.tipo === 'minimo');
const extras = () => habitos().filter((h) => h.tipo === 'extra');
const VAZIO = { feitos: {}, fastfood: [], fechado: false, bom: false };

// dia(): cria o registro do dia; diaLer(): só lê (não cria)
function dia(iso) { return S.dias[iso] || (S.dias[iso] = { feitos: {}, fastfood: [], fechado: false, bom: false }); }
const diaLer = (iso) => S.dias[iso] || VAZIO;

const chaveParte = (h, i) => `${h.id}:${i}`;
const parteFeita = (iso, h, i) => !!diaLer(iso).feitos[chaveParte(h, i)];
const partesFeitas = (iso, h) => h.partes.filter((_, i) => parteFeita(iso, h, i)).length;
const habitoFeito = (iso, h) => !!h && h.partes.length > 0 && partesFeitas(iso, h) === h.partes.length;
const habitoFeitoId = (iso, id) => habitoFeito(iso, habito(id));
const contMinimos = (iso) => minimos().filter((h) => habitoFeito(iso, h)).length;
function diaBom(iso) { const m = minimos(); return m.length > 0 && m.every((h) => habitoFeito(iso, h)); }
// Dia fechado usa o resultado gravado; dia aberto calcula na hora
function ehBom(iso) { const d = S.dias[iso]; if (!d) return false; return d.fechado ? d.bom : diaBom(iso); }

// XP de cada parte: o XP do hábito é dividido entre as partes (água: 3 + 3 + 4)
function parteXp(h, i) {
  const n = h.partes.length;
  const base = Math.floor(h.xp / n);
  return i === n - 1 ? h.xp - base * (n - 1) : base;
}

// Lista de tarefas de um período
function tarefasDoPeriodo(p) {
  const lista = [];
  const ordem = [...minimos(), ...extras()];
  ordem.forEach((h) => h.partes.forEach((pt, i) => {
    if (pt.periodo === p || pt.periodo === 'todos') lista.push({ h, i, pt });
  }));
  return lista;
}

// Água: o número de garrafas sai da meta e do tamanho da garrafa
function reconstruirAgua() {
  const h = habito('agua'); if (!h) return;
  const n = Math.max(1, Math.ceil(S.config.metaAguaMl / Math.max(100, S.config.garrafaMl)));
  h.partes = Array.from({ length: n }, (_, i) => ({
    periodo: i < n / 3 ? 'manha' : i < (2 * n) / 3 ? 'tarde' : 'noite',
    rotulo: `Garrafa ${i + 1}`
  }));
}

// Sequência de dias bons terminando hoje (se hoje já está bom) ou ontem
function sequencia(iso) {
  let d = ehBom(iso) ? iso : somaDias(iso, -1);
  let n = 0;
  while (d >= S.inicioApp && ehBom(d)) { n++; d = somaDias(d, -1); }
  return n;
}
function maiorSequencia() {
  let best = 0, run = 0;
  intervalo(S.inicioApp, S.sim.data).forEach((d) => { if (ehBom(d)) { run++; best = Math.max(best, run); } else if (d !== S.sim.data) run = 0; });
  return best;
}

/* ---------------------------------------------------------
   5. XP e níveis
   --------------------------------------------------------- */
function addXp(id, data, xp, rotulo) {
  if (!xp || S.xpLog.some((e) => e.id === id)) return 0;
  S.xpLog.push({ id, data, xp, rotulo });
  return xp;
}
function removeXp(id) { S.xpLog = S.xpLog.filter((e) => e.id !== id); }
const xpTotal = () => soma(S.xpLog.map((e) => e.xp));
const xpEntre = (a, b) => soma(S.xpLog.filter((e) => entre(e.data, a, b)).map((e) => e.xp));
const xpDoDia = (iso) => xpEntre(iso, iso);

function nivelInfo(xp) {
  const estrelas = Math.floor(xp / CICLO_NIVEL);
  const r = xp % CICLO_NIVEL;
  let i = 0;
  NIVEIS.forEach((n, k) => { if (r >= n[2]) i = k; });
  const [nivel, nome, min] = NIVEIS[i];
  const prox = i < NIVEIS.length - 1 ? NIVEIS[i + 1][2] : CICLO_NIVEL;
  return { estrelas, nivel, nome, atual: r - min, falta: prox - min, pct: ((r - min) / (prox - min)) * 100, chave: estrelas * 10 + nivel };
}

// Confere se subiu de nível. Cada nível novo abre um baú: uma fatia do pote de baús.
function checarNivel() {
  const n = nivelInfo(xpTotal());
  const subidas = [];
  while (S.nivelMax < n.chave) {
    S.nivelMax++;
    const pb = S.quinzena.potes.bau;
    const valor = Math.round(pb * (BAU_NIVEL.min + Math.random() * (BAU_NIVEL.max - BAU_NIVEL.min)));
    const pago = pagarBau(valor, 'nivel', 'Baú de nível', null);
    subidas.push({ chave: S.nivelMax, valor: pago });
  }
  if (subidas.length) salvar();
  return subidas;
}

/* ---------------------------------------------------------
   6. Quinzena e dinheiro
   --------------------------------------------------------- */
const pagamento30 = (y, m) => Math.min(30, diasNoMes(y, m)); // fevereiro paga no último dia

function inicioQuinzena(iso) {
  const d = paraData(iso), y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
  const p30 = pagamento30(y, m);
  if (dd >= p30) return { inicio: isoDe(y, m, p30), tipo: '30' };
  if (dd >= 15) return { inicio: isoDe(y, m, 15), tipo: '15' };
  const [py, pm] = m === 1 ? [y - 1, 12] : [y, m - 1];
  return { inicio: isoDe(py, pm, pagamento30(py, pm)), tipo: '30' };
}
function proximoPagamento(inicio, tipo) {
  const d = paraData(inicio), y = d.getFullYear(), m = d.getMonth() + 1;
  if (tipo === '15') return isoDe(y, m, pagamento30(y, m));
  const [ny, nm] = m === 12 ? [y + 1, 1] : [y, m + 1];
  return isoDe(ny, nm, 15);
}

function abrirQuinzena(iso) {
  const { inicio, tipo } = inicioQuinzena(iso);
  const fim = somaDias(proximoPagamento(inicio, tipo), -1);
  const orc = S.config.orcamento['d' + tipo];
  const q = {
    inicio, fim, tipo,
    entrada: orc.entrada,
    fixos: orc.fixos.map((f) => ({ ...f, pago: false })),
    liberacoes: [],   // { id, data, tipo: terca|sexta|bau|nivel|desafio|ticket, valor, rotulo, ref }
    sacado: 0, saques: [], gastos: [],
    ticketsUsados: 0, saldoAnterior: 0,
    desafio: { ...DESAFIOS[rand(DESAFIOS.length)], concluido: false },
    fixosOk: false,   // vira true quando você confirma os custos fixos do dia de pagamento
    fechada: false
  };
  calcularPotes(q);
  S.santos += santosFixo(q);
  return q;
}
const santosFixo = (q) => soma(q.fixos.filter((f) => f.santos).map((f) => f.valor));

// Divide o dinheiro livre: delivery à parte e o resto nos potes
function calcularPotes(q) {
  // dinheiro livre = entrada − fixos + o que ficou travado na quinzena anterior
  q.livre = Math.max(0, q.entrada - soma(q.fixos.map((f) => f.valor))) + (q.travadoAnterior || 0);
  q.delivery = Math.min(S.config.delivery.total, q.livre);
  const resto = q.livre - q.delivery;
  const p = S.config.potes;
  q.potes = { xp: resto * p.xp, semana: resto * p.semana, bau: resto * p.bau, desafio: resto * p.desafio };
  // Pote de terça e sexta: cada dia da quinzena vale um pedaço. Os 4 dias que fecham no
  // corte de terça (sex a seg) somam 1 parte; os 3 que fecham no corte de sexta (ter a qui) somam 2.
  const pesoTotal = soma(intervalo(q.inicio, q.fim).map(pesoDia));
  q.valorPeso = pesoTotal ? q.potes.semana / pesoTotal : 0;
}

// Corte = meia-noite que começa a terça ou a sexta. Cada dia entra em um corte só.
const PESO_TERCA = 1, PESO_SEXTA = 2;
function pesoDia(iso) { return [2, 3, 4].includes(diaSemana(iso)) ? PESO_SEXTA / 3 : PESO_TERCA / 4; }
// Dia de saque cujo corte fecha esse dia (sex, sáb, dom, seg → terça; ter, qua, qui → sexta)
function saqueDoDia(iso) { const w = diaSemana(iso); return somaDias(iso, w === 2 ? 3 : w === 3 ? 2 : w === 4 ? 1 : w === 5 ? 4 : w === 6 ? 3 : w === 0 ? 2 : 1); }
// Dias que fecham no corte de um dia de saque
function janelaDoSaque(isoSaque) { const n = diaSemana(isoSaque) === 2 ? 4 : 3; return intervalo(somaDias(isoSaque, -n), somaDias(isoSaque, -1)); }
// Saques (terças e sextas) dentro da quinzena
const saquesDaQuinzena = (q) => intervalo(q.inicio, q.fim).filter((d) => diaDeSaque(d));

const somaLib = (q, tipos) => soma(q.liberacoes.filter((l) => !tipos || tipos.includes(l.tipo)).map((l) => l.valor));
const xpQuinzena = (q) => xpEntre(q.inicio, q.fim);
// Quanto vale cada 100 XP nesta quinzena (sempre proporcional ao pote de XP)
function taxaXp(q = S.quinzena) {
  const meta = S.config.metaXpQuinzena || 2700;
  return { xp: 100, valor: Math.round(((q.potes.xp * 100) / meta) * 100) / 100, meta };
}
const bauMax = (q = S.quinzena) => Math.round(q.potes.bau * Math.max(...BAU_CHANCES.map((c) => c.pct)));
function liberadoXp(q, xpExtra = 0) {
  const r = taxaXp(q);
  return Math.min(q.potes.xp, Math.floor((xpQuinzena(q) + xpExtra) / r.xp) * r.valor);
}
const treinosEntre = (a, b) => S.treinos.filter((t) => entre(t.data, a, b)).length;

// Liberação do corte de um dia de saque: dias bons da janela × valor de cada dia.
// Sexta ganha +20% com a semana toda boa (sex a qui) e +20% com 3 treinos nessa semana.
// Nunca passa do que sobra no pote.
function calcSemanal(q, isoSaque) {
  const sexta = diaSemana(isoSaque) === 5;
  const dias = janelaDoSaque(isoSaque).filter((d) => entre(d, q.inicio, q.fim));
  const bons = dias.filter(ehBom);
  const cheio = soma(dias.map(pesoDia)) * q.valorPeso;
  let base = soma(bons.map(pesoDia)) * q.valorPeso;
  let bonusSemana = false, bonusTreino = false;
  if (sexta) {
    const semana = intervalo(somaDias(isoSaque, -7), somaDias(isoSaque, -1)).filter((d) => d >= S.inicioApp);
    bonusSemana = semana.length > 0 && semana.every(ehBom);
    bonusTreino = treinosEntre(somaDias(isoSaque, -7), somaDias(isoSaque, -1)) >= 3;
    base *= 1 + (bonusSemana ? 0.2 : 0) + (bonusTreino ? 0.2 : 0);
  }
  const restante = q.potes.semana - somaLib(q, ['terca', 'sexta']);
  return { valor: Math.max(0, Math.min(restante, base)), bons: bons.length, total: dias.length, bonusSemana, bonusTreino, cheio };
}

// Teto do saque: a cada terça (1) e sexta (2) o teto acumulado sobe uma fatia do montante.
// No último saque da quinzena chega a 100%. Assim o dinheiro sai aos poucos e o caixa nunca falta.
function tetoAcumulado(q, iso) {
  const saques = saquesDaQuinzena(q);
  const peso = (d) => (diaSemana(d) === 2 ? PESO_TERCA : PESO_SEXTA);
  const total = soma(saques.map(peso));
  const ate = soma(saques.filter((d) => d <= iso).map(peso));
  return total ? (q.livre + q.saldoAnterior) * (ate / total) : q.livre + q.saldoAnterior;
}
const proximoSaque = (iso) => { for (let d = iso, k = 0; k < 7; k++, d = somaDias(d, 1)) if (diaDeSaque(d)) return d; return iso; };
// Obrigações da manhã feitas (libera o saque do dia)
function manhaFeita(iso) {
  const lista = tarefasDoPeriodo('manha').filter((t) => t.h.tipo === 'minimo');
  return { feitas: lista.filter((t) => parteFeita(iso, t.h, t.i)).length, total: lista.length, ok: lista.every((t) => parteFeita(iso, t.h, t.i)) };
}

// Tickets de delivery: cada 4 dias bons seguidos abre um
function ticketsInfo(q) {
  const maxT = Math.floor(q.delivery / S.config.delivery.ticket);
  const N = S.config.delivery.diasSeguidos;
  let run = 0, t = 0;
  intervalo(q.inicio, minIso(S.sim.data, q.fim)).forEach((d) => {
    if (ehBom(d)) { run++; if (run === N) { t++; run = 0; } }
    else if (d !== S.sim.data) run = 0;
  });
  const liberados = Math.min(maxT, t);
  return { max: maxT, liberados, usados: q.ticketsUsados, disponiveis: Math.max(0, liberados - q.ticketsUsados), run: liberados >= maxT ? N : run };
}

// Resumo do dinheiro da quinzena.
// Liberado e não sacado = disponível para saque. Sacar tira o valor do montante.
// Fast food sem ticket é descontado direto do montante (primeiro do disponível, depois do travado).
// Os outros gastos são só registro (saem do que você já sacou).
function financas(q = S.quinzena) {
  const xp = liberadoXp(q);
  const outros = somaLib(q);
  const pend = 0; // tudo de terça e sexta já é liberado no corte da meia-noite
  const liberado = xp + outros;
  const t = ticketsInfo(q);
  const descontos = soma(q.gastos.filter((g) => g.descontado).map((g) => g.valor));
  const gastos = soma(q.gastos.map((g) => g.valor));
  const entra = liberado + q.saldoAnterior;
  const excesso = Math.max(0, q.sacado + descontos - entra);
  return {
    xp, pend, liberado, descontos, gastos, tickets: t,
    sacado: q.sacado,
    disponivel: Math.max(0, entra - q.sacado - descontos),
    travado: Math.max(0, q.livre - liberado - t.liberados * S.config.delivery.ticket - excesso),
    montante: Math.max(0, q.livre + q.saldoAnterior - q.sacado - descontos),
    ...infoSaque(q, Math.max(0, entra - q.sacado - descontos), descontos)
  };
}

function gastosPorCategoria(q) {
  const m = {};
  q.gastos.forEach((g) => { m[g.categoria] = (m[g.categoria] || 0) + g.valor; });
  return m;
}

// Insights curtos sobre os gastos da quinzena
function insightsGastos(q) {
  const dias = intervalo(q.inicio, minIso(S.sim.data, q.fim)).length;
  const total = soma(q.gastos.map((g) => g.valor));
  const cats = Object.entries(gastosPorCategoria(q)).sort((a, b) => b[1] - a[1]);
  const ff = intervalo(q.inicio, minIso(S.sim.data, q.fim)).flatMap((d) => diaLer(d).fastfood);
  const ffValor = soma(ff.map((x) => x.valor));
  const ant = S.historico.find((h) => h.inicio < q.inicio);
  return { dias, total, porDia: dias ? total / dias : 0, cats, ff: ff.length, ffValor, anterior: ant ? ant.gastos : null };
}

// Saque do dia (único): disponível até o teto, só depois da manhã feita
function infoSaque(q, disponivel, descontos) {
  const iso = S.sim.data;
  const hojeSaque = diaDeSaque(iso) && entre(iso, q.inicio, q.fim);
  const dataSaque = hojeSaque ? iso : proximoSaque(somaDias(iso, 1));
  const naQuinzena = entre(dataSaque, q.inicio, q.fim);
  const teto = naQuinzena ? Math.max(0, tetoAcumulado(q, dataSaque) - q.sacado - descontos) : disponivel;
  const sacadoHoje = q.saques.find((x) => x.data === iso);
  const manha = manhaFeita(iso);
  const valorSaque = Math.max(0, Math.min(disponivel, teto));
  return {
    hojeSaque, dataSaque, teto, manha, valorSaque,
    sacouHoje: sacadoHoje ? sacadoHoje.valor : 0,
    paraDepois: Math.max(0, disponivel - valorSaque),  // passou do teto: fica para o próximo saque
    podeSacar: hojeSaque && !sacadoHoje && manha.ok && valorSaque > 0
  };
}

// Recalcula a quinzena depois de mudar entrada ou fixos (e acerta a Caixa de viagem)
function mudarQuinzena(q, mudar) {
  const antes = santosFixo(q);
  mudar();
  calcularPotes(q);
  S.santos += santosFixo(q) - antes;
  salvar();
}

const diaDeSaque = (iso) => [2, 5].includes(diaSemana(iso));

// Baú: paga do pote de baús até ele acabar
function pagarBau(valor, tipo, rotulo, ref) {
  const q = S.quinzena;
  const resto = q.potes.bau - somaLib(q, ['bau', 'nivel']);
  const v = Math.max(0, Math.min(valor, Math.floor(resto * 100) / 100));
  if (v > 0) q.liberacoes.push({ id: uid(), data: S.sim.data, tipo, valor: v, rotulo, ref });
  return v;
}
// Rola o baú surpresa de um extra. Retorna null se o pote acabou.
function rolarBau(rotulo, ref) {
  const q = S.quinzena;
  if (q.potes.bau - somaLib(q, ['bau', 'nivel']) <= 0) return null;
  let r = Math.random(), valor = 0;
  for (const c of BAU_CHANCES) { if (r < c.p) { valor = Math.round(c.pct * q.potes.bau); break; } r -= c.p; }
  return valor ? pagarBau(valor, 'bau', 'Baú · ' + rotulo, ref) : 0;
}

// Desafio da quinzena
function progressoDesafio(q) {
  const dias = intervalo(q.inicio, minIso(S.sim.data, q.fim));
  switch (q.desafio.id) {
    case 'semfastfood': {
      let run = 0, best = 0;
      dias.forEach((d) => {
        const dd = S.dias[d];
        if (dd && dd.fastfood.length) { run = 0; return; }
        if (dd && dd.fechado) { run++; best = Math.max(best, run); }
      });
      return best;
    }
    case 'natureza': return dias.filter((d) => habitoFeitoId(d, 'natureza')).length;
    case 'treinos': return treinosEntre(q.inicio, q.fim);
    case 'diasbons': return dias.filter(ehBom).length;
    case 'agua': return dias.filter((d) => habitoFeitoId(d, 'agua')).length;
    case 'sol': return dias.filter((d) => habitoFeitoId(d, 'sol')).length;
    default: return 0;
  }
}
function checarDesafio() {
  const q = S.quinzena;
  if (q.desafio.concluido) return false;
  if (progressoDesafio(q) >= q.desafio.meta) {
    q.desafio.concluido = true;
    q.liberacoes.push({ id: uid(), data: S.sim.data, tipo: 'desafio', valor: q.potes.desafio, rotulo: 'Desafio: ' + q.desafio.texto });
    return true;
  }
  return false;
}

/* ---------------------------------------------------------
   7. Ações de registro
   --------------------------------------------------------- */
function registrarParte(h, i) {
  const iso = S.sim.data, d = dia(iso);
  const antes = xpTotal();
  d.feitos[chaveParte(h, i)] = true;
  addXp(`p:${iso}:${h.id}:${i}`, iso, parteXp(h, i), h.partes[i].rotulo || h.nome);
  if (h.tipo === 'minimo' && diaBom(iso)) addXp(`bom:${iso}`, iso, S.config.xpDiaBom, 'Dia bom');
  const bau = h.tipo === 'extra' ? rolarBau(h.nome, `p:${iso}:${h.id}:${i}`) : null;
  const desafio = checarDesafio();
  salvar();
  return { ganho: xpTotal() - antes, bau, desafio };
}

function desfazerParte(h, i) {
  const iso = S.sim.data, d = dia(iso);
  delete d.feitos[chaveParte(h, i)];
  const ref = `p:${iso}:${h.id}:${i}`;
  removeXp(ref);
  if (!diaBom(iso)) removeXp(`bom:${iso}`);
  S.quinzena.liberacoes = S.quinzena.liberacoes.filter((l) => l.ref !== ref);
  salvar();
}

// Remove os treinos de hoje de um tipo (desfazer pelo Hoje)
function desfazerTreinosHoje(hid) {
  const iso = S.sim.data;
  const remover = S.treinos.filter((t) => t.data === iso && (hid === 'surf') === (t.tipo === 'surf'));
  remover.forEach((t) => {
    removeXp('t:' + t.id);
    S.quinzena.liberacoes = S.quinzena.liberacoes.filter((l) => l.ref !== 't:' + t.id);
  });
  S.treinos = S.treinos.filter((t) => !remover.includes(t));
  delete dia(iso).feitos[hid + ':0'];
  salvar();
}

// Fast food: usa ticket se houver, senão sai do dinheiro livre
function registrarFastFood(valor) {
  const q = S.quinzena, iso = S.sim.data;
  const t = ticketsInfo(q);
  let usouTicket = false, doBolso = valor;
  if (t.disponiveis > 0) {
    usouTicket = true;
    q.ticketsUsados++;
    doBolso = Math.max(0, valor - S.config.delivery.ticket);
  }
  dia(iso).fastfood.push({ valor, ticket: usouTicket });
  if (doBolso > 0) q.gastos.push({ id: uid(), data: iso, valor: doBolso, categoria: 'Delivery', descontado: true, nota: usouTicket ? 'Fast food (resto do ticket)' : 'Fast food' });
  salvar();
  return { usouTicket, doBolso };
}

// Saque total ou parcial: o que não sacar fica para o próximo saque
function sacar(valor) {
  const q = S.quinzena, f = financas(q);
  if (!f.podeSacar) return 0;
  const max = Math.round(f.valorSaque * 100) / 100;
  const v = Math.min(max, Math.round((valor === undefined ? max : Number(valor) || 0) * 100) / 100);
  if (!(v > 0)) return 0;
  q.sacado += v;
  q.saques.push({ id: uid(), data: S.sim.data, valor: v });
  salvar();
  return v;
}

/* ---------------------------------------------------------
   8. Treinos
   --------------------------------------------------------- */
function melhorAnterior(nome, excluirId) {
  let best = null;
  S.treinos.forEach((t) => {
    if (t.id === excluirId) return;
    (t.exercicios || []).forEach((e) => {
      if (e.nome !== nome) return;
      e.series.forEach((s) => {
        if (!s.feito || !(s.kg > 0)) return;
        if (!best || s.kg > best.kg || (s.kg === best.kg && s.reps > best.reps)) best = { kg: s.kg, reps: s.reps };
      });
    });
  });
  return best;
}
function ultimaSessaoEx(nome) {
  for (let k = S.treinos.length - 1; k >= 0; k--) {
    const e = (S.treinos[k].exercicios || []).find((x) => x.nome === nome);
    if (e && e.series.some((s) => s.feito)) return { data: S.treinos[k].data, series: e.series.filter((s) => s.feito) };
  }
  return null;
}
// Índice da série que é recorde nesse exercício (ou -1)
function serieRecorde(ex, excluirId) {
  const prev = melhorAnterior(ex.nome, excluirId);
  if (!prev) return -1;
  let idx = -1, top = null;
  ex.series.forEach((s, i) => {
    if (!s.feito || !(s.kg > 0)) return;
    if (!top || s.kg > top.kg || (s.kg === top.kg && s.reps > top.reps)) { top = s; idx = i; }
  });
  if (top && (top.kg > prev.kg || (top.kg === prev.kg && top.reps > prev.reps))) return idx;
  return -1;
}

function calcXpTreino(t) {
  const b = S.config.xpBonus;
  const base = t.tipo === 'surf' ? (habito('surf') || { xp: 150 }).xp : (habito('treino') || { xp: 100 }).xp;
  const nPrs = (t.exercicios || []).filter((e) => serieRecorde(e, t.id) >= 0).length;
  const prs = Math.min(b.maxRecordes, nPrs) * b.recorde;
  const intens = t.intensidade >= 8 ? b.intensidade : 0;
  const dur = t.duracao > 45 ? b.duracao : 0;
  const volume = soma((t.exercicios || []).flatMap((e) => e.series.filter((s) => s.feito).map((s) => s.kg * s.reps)));
  return { base, prs, nPrs, intens, dur, total: base + prs + intens + dur, volume };
}

function iniciarTreino(tipo) {
  const tt = TIPOS_TREINO.find((x) => x.id === tipo);
  const ficha = S.config.fichas[tipo];
  const exercicios = ficha ? ficha.exercicios.map((e) => {
    const ult = ultimaSessaoEx(e.nome);
    const series = ult
      ? ult.series.map((s) => ({ kg: s.kg, reps: s.reps, feito: false }))
      : Array.from({ length: e.series }, () => ({ kg: e.carga, reps: e.reps, feito: false }));
    return { nome: e.nome, series };
  }) : [];
  S.treinoAtivo = { id: uid(), tipo, nome: tt.nome, sub: ficha ? ficha.nome : '', inicio: Date.now(), exercicios, distancia: '', notas: '' };
  salvar();
}

function finalizarTreino(t) {
  const iso = S.sim.data;
  t.data = iso;
  // limpa a flag de recorde e marca de novo comparando com o histórico
  (t.exercicios || []).forEach((e) => { const k = serieRecorde(e, t.id); e.series.forEach((s, i) => { s.pr = i === k; }); });
  const c = calcXpTreino(t);
  t.xp = c.total; t.volume = c.volume; t.prs = c.nPrs;
  S.treinos.push(t);
  addXp('t:' + t.id, iso, c.total, t.nome);
  const hid = t.tipo === 'surf' ? 'surf' : 'treino';
  if (habito(hid)) dia(iso).feitos[hid + ':0'] = t.id;
  const bau = rolarBau(t.nome, 't:' + t.id);
  const desafio = checarDesafio();
  salvar();
  return { c, bau, desafio };
}

// Treino rápido (pelo Hoje ou pelo simulador)
function treinoRapido(tipo) {
  const surf = tipo === 'surf';
  return finalizarTreino({ id: uid(), tipo: surf ? 'surf' : 'rapido', nome: surf ? 'Surf' : 'Treino rápido', sub: '', exercicios: [], duracao: surf ? 60 : 50, intensidade: 7 });
}

// Treino aleatório (só para o simulador)
function treinoAleatorio() {
  const ultimo = [...S.treinos].reverse().find((t) => ['A', 'B', 'C'].includes(t.tipo));
  const tipo = !ultimo ? 'A' : { A: 'B', B: 'C', C: 'A' }[ultimo.tipo];
  const ficha = S.config.fichas[tipo];
  const exercicios = ficha.exercicios.map((e) => {
    const m = melhorAnterior(e.nome);
    let kg = m ? m.kg : e.carga;
    if (m && Math.random() < 0.25) kg += kg >= 20 ? 2.5 : 1;
    return { nome: e.nome, series: Array.from({ length: e.series }, (_, k) => ({ kg, reps: e.reps - (k === e.series - 1 && Math.random() < 0.5 ? 2 : 0), feito: true })) };
  });
  return finalizarTreino({ id: uid(), tipo, nome: 'Musculação ' + tipo, sub: ficha.nome, exercicios, duracao: 35 + rand(35), intensidade: 5 + rand(5) });
}

/* ---------------------------------------------------------
   9. Simulador: fechar dia, pular dias, fechar quinzena
   --------------------------------------------------------- */
function fecharDia() {
  const iso = S.sim.data, d = dia(iso), q = S.quinzena;
  const w = diaSemana(iso), b = S.config.xpBonus;
  const res = { data: iso, msgs: [] };
  d.bom = diaBom(iso);
  d.fechado = true;
  res.bom = d.bom;
  res.cont = contMinimos(iso);
  res.seq = sequencia(iso);
  if (d.bom && res.seq > 0 && res.seq % 7 === 0) {
    addXp(`s7:${iso}`, iso, b.sequencia7, '7 dias bons seguidos');
    res.msgs.push(`${res.seq} dias bons seguidos: +${b.sequencia7} XP`);
  }
  // Corte da meia-noite: fechando segunda (vira terça) ou quinta (vira sexta)
  if (w === 4) {
    const n = treinosEntre(somaDias(iso, -6), iso);
    if (n >= 3) { addXp(`w3:${iso}`, iso, b.semana3, '3 treinos na semana'); res.msgs.push(`${n} treinos na semana (sex a qui): +${b.semana3} XP`); }
  }
  if (w === 1 || w === 4) {
    const isoSaque = somaDias(iso, 1);
    const c = calcSemanal(q, isoSaque);
    if (c.valor > 0) q.liberacoes.push({ id: uid(), data: iso, tipo: w === 1 ? 'terca' : 'sexta', valor: c.valor, rotulo: w === 1 ? 'Corte de terça' : 'Corte de sexta' });
    res.semanal = { ...c, dia: w === 1 ? 'Terça' : 'Sexta' };
  }
  if (checarDesafio()) res.msgs.push('Desafio cumprido: ' + q.desafio.texto);
  res.xp = xpDoDia(iso);

  // avança a data
  const prox = somaDias(iso, 1);
  S.sim.data = prox;
  S.sim.periodo = 'manha';
  UI.periodoAba = null;
  if (prox > q.fim) {
    res.quinzena = fecharQuinzena();
    S.quinzena = abrirQuinzena(prox);
    S.quinzena.saldoAnterior = res.quinzena.carry;
    S.quinzena.travadoAnterior = res.quinzena.travadoPassa; // continua travado e volta para os potes
    calcularPotes(S.quinzena);
    res.novaQuinzena = S.quinzena;
  }
  res.subidas = checarNivel();
  salvar();
  return res;
}

// Fecha a quinzena: tickets que sobraram viram disponível; o travado passa para a próxima quinzena
function fecharQuinzena() {
  const q = S.quinzena;
  // dias depois do último corte (a quinzena acabou no meio de uma janela): corte parcial agora
  if (![1, 4].includes(diaSemana(q.fim))) {
    const isoSaque = saqueDoDia(q.fim);
    const c = calcSemanal(q, isoSaque);
    if (c.valor > 0) q.liberacoes.push({ id: uid(), data: q.fim, tipo: diaSemana(isoSaque) === 2 ? 'terca' : 'sexta', valor: c.valor, rotulo: 'Corte do fim da quinzena' });
  }
  const t = ticketsInfo(q);
  // ticket liberado e não usado vira dinheiro livre (passa para a próxima como disponível)
  const sobra = Math.max(0, t.liberados - q.ticketsUsados) * S.config.delivery.ticket;
  const f = financas(q);
  const passaTravado = Math.round(f.travado * 100) / 100;
  q.fechada = true;
  const resumo = {
    inicio: q.inicio, fim: q.fim, tipo: q.tipo, livre: q.livre,
    liberado: f.liberado + sobra, sacado: q.sacado, travadoPassa: passaTravado, santos: santosFixo(q), gastos: f.gastos, xp: xpQuinzena(q),
    porCategoria: gastosPorCategoria(q),
    diasBons: intervalo(q.inicio, q.fim).filter(ehBom).length, dias: intervalo(q.inicio, q.fim).length,
    desafio: q.desafio.texto, desafioOk: q.desafio.concluido,
    carry: Math.round((f.disponivel + sobra) * 100) / 100
  };
  S.historico.unshift(resumo);
  return resumo;
}

// Preenche o dia atual com um resultado aleatório (para testar rápido)
function preencherAleatorio() {
  const iso = S.sim.data, w = diaSemana(iso);
  const fimDeSemana = w === 0 || w === 6;
  const sorte = Math.random(); // dia bom, médio ou ruim
  const p = sorte < 0.55 ? 1 : sorte < 0.85 ? 0.8 : 0.5;
  minimos().forEach((h) => {
    if (habitoFeito(iso, h)) return;
    const fazer = Math.random() < p;
    h.partes.forEach((_, i) => { if (!parteFeita(iso, h, i) && (fazer || Math.random() < 0.3)) registrarParte(h, i); });
  });
  const chance = { sol: 0.5, tela: 0.4, natureza: fimDeSemana ? 0.4 : 0.1 };
  extras().forEach((h) => {
    if (h.especial || habitoFeito(iso, h)) return;
    if (Math.random() < (chance[h.id] ?? 0.2)) h.partes.forEach((_, i) => registrarParte(h, i));
  });
  if (!fimDeSemana && !habitoFeitoId(iso, 'treino') && Math.random() < 0.55) treinoAleatorio();
  if (fimDeSemana && habito('surf') && !habitoFeitoId(iso, 'surf') && Math.random() < 0.3) treinoRapido('surf');
  if (Math.random() < 0.1) registrarFastFood(25 + rand(30));
}

/* ---------------------------------------------------------
   10. Frase do dia
   --------------------------------------------------------- */
function fraseDoDia(iso) {
  const fs = S.config.frases;
  if (!fs.length) return null;
  let h = 0;
  for (const c of iso) h = (h * 31 + c.charCodeAt(0)) % 100003;
  return fs[h % fs.length];
}
const iniciais = (nome) => String(nome || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/* ---------------------------------------------------------
   11. Componentes de interface: folhas, modais, toast, deslizar
   --------------------------------------------------------- */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.classList.add('sai'), 2400);
  setTimeout(() => el.remove(), 2900);
}

// Folha que sobe da parte de baixo
function abrirFolha(html, aoMontar) {
  fecharFolha(true);
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.id = 'folha';
  ov.innerHTML = `<div class="sheet" role="dialog"><div class="grab"></div>${html}</div>`;
  ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('[data-fechar]')) fecharFolha(); });
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('on'));
  if (aoMontar) aoMontar(ov.querySelector('.sheet'));
}
function fecharFolha(imediato) {
  const ov = $('#folha');
  if (!ov) return;
  ov.id = '';
  if (imediato) { ov.remove(); return; }
  ov.classList.remove('on');
  setTimeout(() => { ov.remove(); rodarFila(); }, 260);
}

// Fila de modais (baú, nível, resumo do dia...) mostrados um depois do outro
const fila = [];
let modalAberto = false;
function rodarFila() {
  if (modalAberto || $('#folha') || !fila.length) return;
  fila.shift()();
}
function abrirModal(html, classe = '', aoMontar) {
  modalAberto = true;
  const ov = document.createElement('div');
  ov.className = 'modal ' + classe;
  ov.innerHTML = html;
  ov.addEventListener('click', (e) => { if (e.target.closest('[data-fechar]')) fecharModal(ov); });
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('on'));
  if (aoMontar) aoMontar(ov);
}
function fecharModal(ov) {
  ov.classList.remove('on');
  setTimeout(() => { ov.remove(); modalAberto = false; render(); rodarFila(); }, 240);
}

// Confirmação dentro do app (o confirm() do navegador não funciona em todo lugar)
function confirmar(msg, textoOk, aoConfirmar) {
  abrirModal(`
    <div class="modal-card">
      <h2 class="confirma">${esc(msg)}</h2>
      <div class="row2"><button class="btn ghost" data-fechar>Voltar</button><button class="btn danger" data-s="ok">${esc(textoOk)}</button></div>
    </div>`, '', (ov) => ov.querySelector('[data-s="ok"]').addEventListener('click', () => { fecharModal(ov); aoConfirmar(); }));
}

// Botão de deslizar para confirmar
function slideHtml(txt = 'Deslize para confirmar') {
  return `<div class="slide" data-slide><div class="slide-fill"></div><span class="slide-txt">${esc(txt)}</span><div class="slide-knob">${ic('arrow')}</div></div>`;
}
function montarSlide(raiz, aoConfirmar) {
  const el = raiz.querySelector('[data-slide]');
  if (!el) return;
  const knob = el.querySelector('.slide-knob'), fill = el.querySelector('.slide-fill');
  let x0 = null, dx = 0, max = 0, feito = false;
  const set = (v) => { knob.style.transform = `translateX(${v}px)`; fill.style.width = `${v + 28}px`; };
  knob.addEventListener('pointerdown', (e) => {
    if (feito) return;
    x0 = e.clientX; max = el.clientWidth - knob.offsetWidth - 8;
    knob.setPointerCapture(e.pointerId); el.classList.add('arrastando');
  });
  knob.addEventListener('pointermove', (e) => { if (x0 === null) return; dx = Math.max(0, Math.min(max, e.clientX - x0)); set(dx); });
  const solta = () => {
    if (x0 === null) return;
    x0 = null; el.classList.remove('arrastando');
    if (dx >= max * 0.85) { feito = true; set(max); el.classList.add('ok'); if (navigator.vibrate) navigator.vibrate(20); setTimeout(aoConfirmar, 140); }
    else { dx = 0; set(0); }
  };
  knob.addEventListener('pointerup', solta);
  knob.addEventListener('pointercancel', solta);
  // Acessibilidade: Enter no botão também confirma
  knob.tabIndex = 0;
  knob.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !feito) { feito = true; aoConfirmar(); } });
}

// Animação do XP subindo
function animarXp(antes, ganho) {
  if (UI.aba !== 'hoje' || ganho <= 0) return;
  const bar = $('#xpbar');
  if (bar) {
    const alvo = bar.style.width;
    bar.style.transition = 'none';
    bar.style.width = (antes.chave === nivelInfo(xpTotal()).chave ? antes.pct : 0) + '%';
    void bar.offsetWidth;
    bar.style.transition = '';
    requestAnimationFrame(() => { bar.style.width = alvo; });
  }
  const alvoNum = $('#xpnum');
  if (alvoNum) {
    const fim = nivelInfo(xpTotal());
    const ini = antes.chave === fim.chave ? antes.atual : 0;
    const t0 = performance.now();
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / 700);
      alvoNum.textContent = `${num(ini + (fim.atual - ini) * k)} / ${num(fim.falta)} XP`;
      if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }
  const box = $('.level');
  if (box) {
    const f = document.createElement('div');
    f.className = 'xp-float';
    f.textContent = `+${ganho} XP`;
    box.appendChild(f);
    setTimeout(() => f.remove(), 1300);
  }
}

/* ---------------------------------------------------------
   12. Telas
   --------------------------------------------------------- */
function render() {
  renderSimBar();
  const telas = { hoje: renderHoje, treino: renderTreino, grana: renderGrana, progresso: renderProgresso, ajustes: renderAjustes };
  const view = $('#view');
  view.innerHTML = telas[UI.aba]();
  if (UI.ultimaAba !== UI.aba) { // transição curta ao trocar de aba
    view.classList.remove('entra'); void view.offsetWidth; view.classList.add('entra');
    UI.ultimaAba = UI.aba;
  }
  document.querySelectorAll('.nav button').forEach((b) => b.classList.toggle('on', b.dataset.aba === UI.aba || (UI.aba === 'ajustes' && b.dataset.aba === 'hoje')));
  renderDescanso();
}

// --- Barra do simulador ---
function renderSimBar() {
  const bar = $('#simbar');
  document.body.classList.toggle('teste', !!S.sim.teste);
  if (!S.sim.teste) { bar.innerHTML = ''; return; }
  const q = S.quinzena, iso = S.sim.data;
  const nDia = intervalo(q.inicio, iso).length, nTot = intervalo(q.inicio, q.fim).length;
  bar.innerHTML = `
    <div class="sim-info"><span class="sim-tag">Teste</span><b>${SEMANA_CURTA[diaSemana(iso)]} ${dataCurta(iso)}</b><span class="sim-q">dia ${nDia} de ${nTot}</span></div>
    <div class="sim-ctl">
      <div class="seg mini">${Object.keys(PERIODOS).map((p) => `<button data-a="periodo" data-p="${p}" class="${S.sim.periodo === p ? 'on' : ''}">${PERIODOS[p]}</button>`).join('')}</div>
      <button class="sim-btn pri" data-a="proximoDia">Próximo dia</button>
      <button class="sim-btn" data-a="pular7" title="Pular 7 dias">+7</button>
      <button class="sim-btn" data-a="reset" title="Resetar tudo" aria-label="Resetar tudo">${ic('reset')}</button>
    </div>`;
}

// --- Hoje ---
function renderHoje() {
  const iso = S.sim.data, n = nivelInfo(xpTotal()), seq = sequencia(iso), fr = fraseDoDia(iso);
  const cont = contMinimos(iso), tot = minimos().length, bom = diaBom(iso);
  const p = UI.periodoAba || S.sim.periodo;
  const f = financas();
  const estrelas = n.estrelas ? ' ' + Array.from({ length: n.estrelas }, () => ic('star', 'star')).join('') : '';

  const quote = fr ? `
    <div class="quote ${UI.fraseAberta ? 'aberta' : ''}" data-a="frase" role="button" aria-label="Ver a frase inteira">
      <div class="quote-img">${fr.imagem ? `<img src="${fr.imagem}" alt="">` : `<span>${esc(iniciais(fr.autor))}</span>`}</div>
      <div><p>“${esc(fr.texto)}”</p><span>${esc(fr.autor)}</span></div>
    </div>` : '';

  // Obrigações (mínimos) seguem o período; bônus aparecem o dia todo
  const linha = ({ h, i, pt }) => {
    const feito = parteFeita(iso, h, i);
    const multi = h.partes.length > 1;
    const xp = h.especial ? `${h.xp}+` : parteXp(h, i);
    const sub = h.especial ? (h.especial === 'treino' ? 'Abre o treino ou registra rápido' : 'Sessão de surf')
      : h.id === 'dormir' ? `Até ${S.config.horaDormir}`
      : multi ? `${h.nome} · ${i + 1} de ${h.partes.length}` : (h.tipo === 'extra' ? (h.motivos[0] ? `${h.motivos[0]} · chance de baú` : 'Chance de baú') : (h.motivos[0] || ''));
    return `
      <button class="task ${feito ? 'done' : ''} ${h.tipo}" data-a="tarefa" data-h="${h.id}" data-i="${i}">
        <span class="task-ic">${ic(h.icone)}</span>
        <span class="task-tx"><b>${esc(pt.rotulo || h.nome)}</b><small>${esc(sub)}</small></span>
        ${feito ? `<span class="task-ok">${ic('check')}</span>` : `<span class="task-xp">+${xp} XP</span>`}
      </button>`;
  };
  const obrigacoes = tarefasDoPeriodo(p).filter((t) => t.h.tipo === 'minimo');
  const bonus = extras().flatMap((h) => h.partes.map((pt, i) => ({ h, i, pt })));
  const bonusFeitos = bonus.filter((t) => parteFeita(iso, t.h, t.i)).length;

  const saque = f.hojeSaque ? `
    <button class="card banner ${f.podeSacar ? '' : 'dark'}" data-a="ir" data-aba="grana">
      <span class="banner-ic">${ic(f.sacouHoje ? 'check' : f.manha.ok ? 'unlock' : 'lock')}</span>
      <span><span class="eyebrow">Dia de saque</span><b>${f.sacouHoje ? `Saque feito: ${brl(f.sacouHoje)}` : f.manha.ok ? `${brl(f.valorSaque)} para sacar` : `Feche a manhã para sacar ${brl(f.valorSaque)}`}</b></span>
      ${ic('next')}
    </button>` : '';

  // Dia de pagamento (15 e 30): a tarefa de registrar os custos fixos aparece só nesse dia
  const q = S.quinzena;
  const pagamentoHoje = iso === q.inicio;
  const tarefaFixos = pagamentoHoje ? `
      <button class="task pagamento ${q.fixosOk ? 'done' : ''}" data-a="abrirFixos">
        <span class="task-ic">${ic('calendar')}</span>
        <span class="task-tx"><b>Registrar custos fixos</b><small>Dia de pagamento · dia ${q.tipo}</small></span>
        ${q.fixosOk ? `<span class="task-ok">${ic('check')}</span>` : '<span class="task-xp hoje">Hoje</span>'}
      </button>` : '';

  return `
  <header class="hero compacto">
    <div class="hero-top"><span class="eyebrow light">${dataLonga(iso)}</span>
      <button class="icon-btn" data-a="ir" data-aba="ajustes" aria-label="Ajustes">${ic('sliders')}</button></div>
    <div class="hero-linha">
      <h1>Bora, ${esc(S.config.nome)}</h1>
      <div class="streak ${seq ? 'on' : ''}">${ic('flame')}<b>${seq}</b> ${seq === 1 ? 'dia bom' : 'dias bons'}</div>
    </div>
    ${quote}
    <div class="level">
      <div class="level-row">
        <div><span class="eyebrow light">Nível ${n.nivel}${estrelas}</span> <b>${esc(n.nome)}</b></div>
        <span class="xpnum" id="xpnum">${num(n.atual)} / ${num(n.falta)} XP</span>
      </div>
      <div class="bar"><i id="xpbar" style="width:${n.pct.toFixed(1)}%"></i></div>
    </div>
  </header>

  <section class="card goodday compacto ${bom ? 'complete' : ''}">
    <div class="card-head">
      <div class="gd-tt"><span class="eyebrow">Dia bom</span><h2>${cont} <small>de ${tot}</small></h2></div>
      <span class="pill ${bom ? 'blue' : ''}">${bom ? `+${S.config.xpDiaBom} XP ganhos` : `+${S.config.xpDiaBom} XP com ${tot} de ${tot}`}</span>
    </div>
    <div class="dots" style="grid-template-columns:repeat(${minimos().length + (habito('treino') ? 1 : 0)},1fr)">${minimos().map((h) => {
      const feito = habitoFeito(iso, h), parc = partesFeitas(iso, h) / h.partes.length;
      return `<div class="dotw"><span class="dot ${feito ? 'on' : ''}" style="--p:${(parc * 100).toFixed(0)}">${ic(h.icone)}</span><small>${esc(h.nome)}</small></div>`;
    }).join('')}${habito('treino') ? `<button class="dotw treino" data-a="tarefa" data-h="treino" data-i="0" aria-label="Treino">
      <span class="dot extra ${habitoFeitoId(iso, 'treino') ? 'on' : ''}" style="--p:0">${ic('dumbbell')}</span><small>Treino</small></button>` : ''}</div>
  </section>

  <div class="tabs topo" aria-label="Obrigações por período">${Object.keys(PERIODOS).map((k) => {
    const lista = tarefasDoPeriodo(k).filter((t) => t.h.tipo === 'minimo');
    const feitas = lista.filter((t) => parteFeita(iso, t.h, t.i)).length;
    return `<button class="${k === p ? 'on' : ''} ${lista.length && feitas === lista.length ? 'completo' : ''}" data-a="abaPeriodo" data-p="${k}">${PERIODOS[k]} <span class="tab-n">${feitas}/${lista.length}</span></button>`;
  }).join('')}</div>
  <section class="tasks obrigacoes">${tarefaFixos}${obrigacoes.map(linha).join('') || '<p class="vazio">Nada neste período.</p>'}</section>

  ${saque}

  <div class="sec-row"><h3 class="sec">Bônus <span class="sec-n">· opcionais, valem mais</span></h3><span class="sec-n">${bonusFeitos} hoje</span></div>
  <section class="tasks bonus">${bonus.map(linha).join('')}
    <button class="task add-bonus" data-a="novoBonus"><span class="task-ic">${ic('plus')}</span><span class="task-tx"><b>Adicionar bônus</b><small>Hobbies e coisas boas que não são obrigação</small></span></button>
  </section>

  <button class="card ff" data-a="fastfood">
    <span class="task-ic">${ic('burger')}</span>
    <span class="task-tx"><b>Registrar fast food</b><small>${f.tickets.disponiveis ? `${f.tickets.disponiveis} ticket de delivery disponível` : 'Sai do dinheiro livre'}</small></span>
    ${ic('next')}
  </button>`;
}

// --- Folha de registro de tarefa ---
function abrirTarefa(hid, i) {
  const h = habito(hid), iso = S.sim.data;
  if (!h) return;
  if (h.especial) return abrirEspecial(h);
  const pt = h.partes[i];
  if (parteFeita(iso, h, i)) {
    return abrirFolha(`
      <div class="sheet-head"><span class="sheet-ic done">${ic(h.icone)}</span><div><span class="eyebrow">Feito hoje</span><h3>${esc(pt.rotulo || h.nome)}</h3></div></div>
      <p class="muted">Marcou sem querer? Desfazer tira o XP${h.tipo === 'extra' ? ' e o baú' : ''} desta tarefa.</p>
      <div class="row2"><button class="btn ghost" data-fechar>Manter</button><button class="btn danger" data-s="desfazer">Desfazer</button></div>`,
    (el) => el.querySelector('[data-s="desfazer"]').addEventListener('click', () => { desfazerParte(h, i); fecharFolha(); render(); }));
  }
  const q = S.quinzena, xp = parteXp(h, i), r = taxaXp(q);
  const vale = (xp * r.valor) / r.xp;
  const agora = liberadoXp(q, xp) - liberadoXp(q);
  const faltam = r.xp - (xpQuinzena(q) % r.xp);
  const tetoXp = liberadoXp(q) >= q.potes.xp;
  const viraBom = h.tipo === 'minimo' && !diaBom(iso) && minimos().every((m) => m === h ? partesFeitas(iso, m) === h.partes.length - 1 : habitoFeito(iso, m));
  const multi = h.partes.length > 1 ? `<span class="pill">${h.partes.length > 1 ? `${partesFeitas(iso, h) + 1} de ${h.partes.length}` : ''}</span>` : '';

  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic">${ic(h.icone)}</span>
      <div><span class="eyebrow">${h.tipo === 'minimo' ? 'Mínimo do dia bom' : 'Extra'}</span><h3>${esc(pt.rotulo || h.nome)}</h3></div>${multi}</div>
    <ul class="motivos">${h.motivos.map((m) => `<li>${ic('check')}<span>${esc(m)}</span></li>`).join('')}</ul>
    <div class="stats3">
      <div><span class="eyebrow">Ganha</span><b>+${xp} XP</b></div>
      <div><span class="eyebrow">Vale</span><b>${brl(vale)}</b></div>
      <div><span class="eyebrow">Libera agora</span><b>${tetoXp ? '—' : brl(agora)}</b></div>
    </div>
    <p class="nota">${tetoXp ? 'O pote de XP desta quinzena já está cheio.' : agora > 0 ? `Fecha mais 100 XP: libera ${brl(r.valor)} na hora.` : `${brl(r.valor)} a cada ${r.xp} XP. Faltam ${faltam} XP para o próximo.`}
      ${viraBom ? `<br><b>Esse fecha o dia bom: +${S.config.xpDiaBom} XP.</b>` : ''}${h.tipo === 'extra' ? '<br>Pode abrir um baú surpresa.' : ''}</p>
    ${slideHtml()}`,
  (el) => montarSlide(el, () => confirmarTarefa(h, i)));
}

function confirmarTarefa(h, i) {
  const antes = nivelInfo(xpTotal());
  const r = registrarParte(h, i);
  if (r.bau !== null && r.bau !== undefined) fila.push(() => modalBau(r.bau));
  const sub = checarNivel();
  if (sub.length) fila.push(() => modalNivel(sub));
  if (r.desafio) toast('Desafio da quinzena cumprido!');
  fecharFolha();
  render();
  animarXp(antes, r.ganho);
}

// Quanto um ganho de XP vale e libera em reais (usado no treino)
function blocoDinheiro(xp) {
  const q = S.quinzena, r = taxaXp(q);
  const cheio = liberadoXp(q) >= q.potes.xp;
  const agora = liberadoXp(q, xp) - liberadoXp(q);
  return `<div class="money-box">
      <div><span class="eyebrow">Vale</span><b>${brl((xp * r.valor) / r.xp)}</b></div>
      <div><span class="eyebrow">Libera agora</span><b>${cheio ? '—' : brl(agora)}</b></div>
      <small>${cheio ? 'Pote de XP da quinzena cheio.' : `${brl(r.valor)} a cada ${r.xp} XP nesta quinzena.`} Pode abrir um baú surpresa de até ${brl(bauMax())}.</small>
    </div>`;
}

// Treino e surf no Hoje
function abrirEspecial(h) {
  const iso = S.sim.data, feito = habitoFeito(iso, h);
  const deHoje = S.treinos.filter((t) => t.data === iso && (h.id === 'surf') === (t.tipo === 'surf'));
  const surf = h.id === 'surf';
  const b = S.config.xpBonus;
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic ${feito ? 'done' : ''}">${ic(h.icone)}</span><div><span class="eyebrow">Extra</span><h3>${surf ? 'Sessão de surf' : 'Treino'}</h3></div></div>
    <ul class="motivos">${h.motivos.map((m) => `<li>${ic('check')}<span>${esc(m)}</span></li>`).join('')}</ul>
    ${deHoje.length ? `<div class="lista-mini">${deHoje.map((t) => `<div><b>${esc(t.nome)}</b><span>${t.duracao} min · +${t.xp} XP</span></div>`).join('')}</div>` : ''}
    <p class="nota">${h.xp} XP base. +${b.intensidade} com intensidade 8+, +${b.duracao} acima de 45 min${surf ? '' : `, +${b.recorde} por recorde (até ${b.maxRecordes})`}.</p>
    <button class="btn" data-s="abrir">${ic(surf ? 'wave' : 'dumbbell')} ${surf ? 'Abrir sessão no Treino' : 'Abrir treino completo'}</button>
    ${feito ? '' : blocoDinheiro(h.xp + b.duracao)}
    ${feito ? `<button class="btn ghost danger-tx" data-s="desfazer">Desfazer ${surf ? 'surf' : 'treino'} de hoje</button>` : `<p class="eyebrow center">ou registro rápido (${surf ? 60 : 50} min, intensidade 7 · +${h.xp + b.duracao} XP)</p>${slideHtml(surf ? 'Deslize: surf rápido' : 'Deslize: treino rápido')}`}`,
  (el) => {
    el.querySelector('[data-s="abrir"]').addEventListener('click', () => {
      fecharFolha(); UI.aba = 'treino';
      if (!S.treinoAtivo) iniciarTreino(surf ? 'surf' : (proximaFicha()));
      render(); window.scrollTo(0, 0);
    });
    const d = el.querySelector('[data-s="desfazer"]');
    if (d) d.addEventListener('click', () => { desfazerTreinosHoje(h.id); fecharFolha(); render(); });
    montarSlide(el, () => {
      const antes = nivelInfo(xpTotal()), x0 = xpTotal();
      const r = treinoRapido(surf ? 'surf' : 'rapido');
      if (r.bau !== null) fila.push(() => modalBau(r.bau));
      const sub = checarNivel(); if (sub.length) fila.push(() => modalNivel(sub));
      if (r.desafio) toast('Desafio da quinzena cumprido!');
      fecharFolha(); render(); animarXp(antes, xpTotal() - x0);
    });
  });
}
function proximaFicha() {
  const ultimo = [...S.treinos].reverse().find((t) => ['A', 'B', 'C'].includes(t.tipo));
  return !ultimo ? 'A' : { A: 'B', B: 'C', C: 'A' }[ultimo.tipo];
}

// Fast food
function abrirFastFood() {
  const t = ticketsInfo(S.quinzena), ticket = S.config.delivery.ticket, fds = S.config.fimDeSemanaSantos;
  const desafioFF = S.quinzena.desafio.id === 'semfastfood' && !S.quinzena.desafio.concluido;
  let valor = 35;
  const info = () => {
    const pct = fds ? Math.round((valor / fds) * 100) : 0;
    const bolso = t.disponiveis ? Math.max(0, valor - ticket) : valor;
    return `<div class="custo"><b>${brl(valor)}</b><span>= ${pct}% de um fim de semana de viagem</span></div>
      <p class="nota">${t.disponiveis ? `Usa 1 ticket de delivery (${brl(ticket)}).${bolso ? ` ${brl(bolso)} saem do dinheiro livre.` : ''}` : `Sem ticket liberado: ${brl(valor)} saem do dinheiro livre.`}
      ${desafioFF ? '<br><b>Quebra o desafio “10 dias seguidos sem fast food”.</b>' : ''}</p>`;
  };
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic warn">${ic('burger')}</span><div><span class="eyebrow">Custo real</span><h3>Fast food</h3></div></div>
    <div class="chips" data-s="valores">${[20, 35, 50, 70].map((v) => `<button class="chip ${v === valor ? 'on' : ''}" data-v="${v}">${brl(v)}</button>`).join('')}
      <input class="chip-in" type="number" inputmode="decimal" placeholder="Outro" min="1"></div>
    <div data-s="info">${info()}</div>
    <div class="row2"><button class="btn ghost" data-fechar>Desistir</button><button class="btn dark" data-s="ok">Registrar</button></div>`,
  (el) => {
    const atualiza = () => { el.querySelector('[data-s="info"]').innerHTML = info(); };
    el.querySelector('[data-s="valores"]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      valor = Number(b.dataset.v);
      el.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b));
      atualiza();
    });
    el.querySelector('.chip-in').addEventListener('input', (e) => {
      const v = Number(e.target.value); if (v > 0) { valor = v; el.querySelectorAll('.chip').forEach((c) => c.classList.remove('on')); atualiza(); }
    });
    el.querySelector('[data-s="ok"]').addEventListener('click', () => {
      const r = registrarFastFood(valor);
      fecharFolha(); render();
      toast(r.usouTicket ? 'Ticket de delivery usado' : `${brl(r.doBolso)} saíram do dinheiro livre`);
    });
  });
}

// --- Modais ---
function modalBau(valor) {
  abrirModal(`
    <div class="modal-card center">
      <div class="chest-anim ${valor ? 'cheio' : ''}">${ic('chest')}</div>
      <span class="eyebrow">Baú surpresa</span>
      <h2 class="big">${valor ? brl(valor) : 'Vazio'}</h2>
      <p class="muted">${valor ? 'Liberado no dinheiro da quinzena.' : `Desta vez não veio nada. O próximo pode ter ${brl(bauMax())}.`}</p>
      <button class="btn" data-fechar>Boa</button>
    </div>`);
}

function modalNivel(subidas) {
  const n = nivelInfo(xpTotal());
  const total = soma(subidas.map((s) => s.valor));
  abrirModal(`
    <div class="levelup">
      <div class="glow"></div>
      <span class="eyebrow light">Subiu de nível</span>
      <div class="lv-num">${n.nivel}</div>
      <h2>${esc(n.nome)}${n.estrelas ? ' ' + ic('star', 'star') : ''}</h2>
      <button class="lv-chest" data-s="abrirBau">
        <span class="chest-anim">${ic('chest')}</span>
        <span class="lv-chest-tx"><span class="eyebrow light">Baú de nível${subidas.length > 1 ? ` ×${subidas.length}` : ''}</span><b>Toque para abrir</b></span>
      </button>
      <div class="lv-saldo" hidden><span class="eyebrow light">Disponível para saque</span><b>${brl(financas().disponivel)}</b><small>Saque às terças e sextas</small></div>
      <button class="btn light" data-fechar>Continuar</button>
    </div>`, 'full', (ov) => {
    ov.querySelector('[data-s="abrirBau"]').addEventListener('click', (e) => {
      const b = e.currentTarget;
      if (b.classList.contains('aberto')) return;
      b.classList.add('aberto');
      b.querySelector('.lv-chest-tx').innerHTML = `<span class="eyebrow light">Baú de nível</span><b>${total ? '+' + brl(total) : 'Pote de baús vazio'}</b>`;
      ov.querySelector('.lv-saldo').hidden = false;
      if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    });
  });
}

function modalResumoDia(r) {
  const sem = r.semanal;
  const linhas = [];
  if (sem) linhas.push(`<li>${ic('wallet')}<span>Corte de ${sem.dia.toLowerCase()}: ${sem.bons} de ${sem.total} dias bons → <b>${brl(sem.valor)}</b> liberados${sem.bonusSemana ? ' · semana toda boa +20%' : ''}${sem.bonusTreino ? ' · 3 treinos +20%' : ''}. Saque depois da manhã.</span></li>`);
  r.msgs.forEach((m) => linhas.push(`<li>${ic('bolt')}<span>${esc(m)}</span></li>`));
  abrirModal(`
    <div class="modal-card">
      <span class="eyebrow">Dia fechado · ${SEMANA_CURTA[diaSemana(r.data)]} ${dataCurta(r.data)}</span>
      <h2>${r.bom ? 'Dia bom' : `${r.cont} de ${minimos().length}`}</h2>
      <div class="stats3">
        <div><span class="eyebrow">XP do dia</span><b>+${num(r.xp)}</b></div>
        <div><span class="eyebrow">Sequência</span><b>${r.seq}</b></div>
        <div><span class="eyebrow">Hoje</span><b>${SEMANA_CURTA[diaSemana(S.sim.data)]} ${dataCurta(S.sim.data)}</b></div>
      </div>
      ${linhas.length ? `<ul class="motivos">${linhas.join('')}</ul>` : `<p class="muted">${r.bom ? 'Tudo do mínimo feito. Bora repetir.' : 'Amanhã é outro dia. O mínimo é pouco: 6 coisas.'}</p>`}
      <button class="btn" data-fechar>Começar ${SEMANA[diaSemana(S.sim.data)]}</button>
    </div>`);
}

function modalPagamento(resumo, q) {
  abrirModal(`
    <div class="modal-card">
      <span class="eyebrow">Dia de pagamento · dia ${q.tipo}</span>
      <h2>Nova quinzena</h2>
      <div class="lista-mini">
        <div><b>Quinzena passada</b><span>${resumo.diasBons} de ${resumo.dias} dias bons</span></div>
        <div><b>Liberado</b><span>${brl(resumo.liberado)} de ${brl(resumo.livre)}</span></div>
        <div><b>Passou travado para esta quinzena</b><span>${brl(resumo.travadoPassa || 0)}</span></div>
        <div><b>Desafio</b><span>${resumo.desafioOk ? 'cumprido' : 'não cumprido'}</span></div>
      </div>
      <div class="lista-mini">
        <div><b>Entrada</b><span>${brl(q.entrada)}</span></div>
        <div><b>Fixos</b><span>${brl(q.entrada - q.livre)}</span></div>
        <div><b>Dinheiro livre (travado)</b><span>${brl(q.livre)}${q.travadoAnterior ? ` (com ${brl(q.travadoAnterior)} da anterior)` : ''}</span></div>
        <div><b>Caixa de viagem</b><span>+${brl(santosFixo(q))} liberados hoje</span></div>
      </div>
      <div class="desafio-box">${ic('target')}<div><span class="eyebrow">Desafio sorteado</span><b>${esc(q.desafio.texto)}</b><small>Cumpriu, libera ${brl(q.potes.desafio)}</small></div></div>
      <button class="btn" data-fechar>Registrar custos fixos</button>
    </div>`);
}

function modalPulo(r) {
  abrirModal(`
    <div class="modal-card">
      <span class="eyebrow">${esc(r.titulo || 'Simulação · 7 dias')}</span>
      <h2>${r.bons} de ${r.dias || 7} dias bons</h2>
      <div class="stats3">
        <div><span class="eyebrow">XP</span><b>+${num(r.xp)}</b></div>
        <div><span class="eyebrow">Treinos</span><b>${r.treinos}</b></div>
        <div><span class="eyebrow">Fast food</span><b>${r.ff}</b></div>
      </div>
      ${r.msgs.length ? `<ul class="motivos">${r.msgs.map((m) => `<li>${ic('bolt')}<span>${esc(m)}</span></li>`).join('')}</ul>` : ''}
      <button class="btn" data-fechar>Ver</button>
    </div>`);
}

// --- Treino ---
function renderTreino() {
  return S.treinoAtivo ? renderTreinoAtivo() : renderTreinoInicio();
}

// Semana do treino: sexta a quinta (o bônus conta no corte de sexta)
function semanaTreino(iso) {
  const w = diaSemana(iso);
  const ini = somaDias(iso, -((w + 2) % 7)); // volta até a sexta
  return { ini, fim: somaDias(ini, 6) };
}

function renderTreinoInicio() {
  const iso = S.sim.data, sem = semanaTreino(iso), n = treinosEntre(sem.ini, sem.fim);
  const tipos = TIPOS_TREINO.map((t) => {
    const ficha = S.config.fichas[t.id];
    return `<button class="type" data-a="iniciarTreino" data-t="${t.id}">${ic(t.icone)}<b>${esc(t.nome)}</b><small>${ficha ? esc(ficha.nome) : t.id === 'surf' ? '150 XP' : 'Cardio'}</small></button>`;
  }).join('');

  // calendário do mês simulado
  const d = paraData(iso), y = d.getFullYear(), m = d.getMonth() + 1;
  const pri = isoDe(y, m, 1), nd = diasNoMes(y, m), off = diaSemana(pri);
  const dias = new Set(S.treinos.map((t) => t.data));
  let cal = SEMANA_LETRA.map((l) => `<span class="cal-h">${l}</span>`).join('') + '<span></span>'.repeat(off);
  for (let k = 1; k <= nd; k++) {
    const di = isoDe(y, m, k);
    cal += `<span class="cal-d ${dias.has(di) ? 'on' : ''} ${di === iso ? 'hoje' : ''}">${k}</span>`;
  }

  const hist = [...S.treinos].reverse().slice(0, 6).map((t) => `
    <div class="hist"><span class="task-ic">${ic(t.tipo === 'surf' ? 'wave' : t.tipo === 'corrida' ? 'run' : t.tipo === 'skate' ? 'skate' : 'dumbbell')}</span>
      <span class="task-tx"><b>${esc(t.nome)}</b><small>${dataCurta(t.data)} · ${t.duracao} min${t.volume ? ` · ${num(t.volume)} kg` : ''}${t.distancia ? ` · ${esc(t.distancia)} km` : ''}${t.prs ? ` · ${t.prs} recorde${t.prs > 1 ? 's' : ''}` : ''}</small></span>
      <span class="task-xp">+${t.xp}</span></div>`).join('');

  return `
  <div class="page-head"><span class="eyebrow">${dataLonga(iso)}</span><h1>Treino</h1></div>
  <section class="card">
    <div class="card-head"><div><span class="eyebrow">Meta da semana · sex a qui</span><h2>${n} <small>de 3 treinos</small></h2></div><span class="pill ${n >= 3 ? 'blue' : ''}">${n >= 3 ? 'Bônus garantido' : `+${S.config.xpBonus.semana3} XP no corte de sexta`}</span></div>
    <div class="segs">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('')}</div>
  </section>
  <h3 class="sec">Começar</h3>
  <div class="types">${tipos}</div>
  <h3 class="sec">${MESES[m - 1]}</h3>
  <section class="card"><div class="cal">${cal}</div></section>
  ${renderGraficoCarga()}
  <h3 class="sec">Histórico</h3>
  <section class="card list">${hist || '<p class="vazio">Nenhum treino ainda. O primeiro vale 100 XP.</p>'}</section>`;
}

// Carga por exercício (melhor série de cada sessão)
function renderGraficoCarga() {
  const nomes = Object.values(S.config.fichas).flatMap((f) => f.exercicios.map((e) => e.nome));
  if (!UI.exercicio || !nomes.includes(UI.exercicio)) UI.exercicio = nomes[0];
  const pts = [];
  S.treinos.forEach((t) => (t.exercicios || []).forEach((e) => {
    if (e.nome !== UI.exercicio) return;
    const kg = Math.max(0, ...e.series.filter((s) => s.feito).map((s) => s.kg));
    if (kg > 0) pts.push({ data: t.data, kg });
  }));
  const ult = pts.slice(-12);
  let svg = '<p class="vazio">Sem registros desse exercício ainda.</p>';
  if (ult.length) {
    const W = 320, H = 120, P = 18;
    const min = Math.min(...ult.map((p) => p.kg)), max = Math.max(...ult.map((p) => p.kg));
    const span = max - min || 1;
    const x = (k) => (ult.length === 1 ? W / 2 : P + (k * (W - 2 * P)) / (ult.length - 1));
    const yy = (kg) => H - P - ((kg - min) / span) * (H - 2 * P - 10);
    const linha = ult.map((p, k) => `${x(k).toFixed(1)},${yy(p.kg).toFixed(1)}`).join(' ');
    svg = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Carga de ${esc(UI.exercicio)}">
      <line x1="${P}" y1="${H - P + 4}" x2="${W - P}" y2="${H - P + 4}" class="axis"/>
      <polyline points="${linha}" class="line"/>
      ${ult.map((p, k) => `<circle cx="${x(k).toFixed(1)}" cy="${yy(p.kg).toFixed(1)}" r="${k === ult.length - 1 ? 4.5 : 3}" class="pt ${k === ult.length - 1 ? 'last' : ''}"/>`).join('')}
      <text x="${x(ult.length - 1).toFixed(1)}" y="${(yy(ult[ult.length - 1].kg) - 10).toFixed(1)}" text-anchor="${ult.length === 1 ? 'middle' : 'end'}" class="lbl">${String(ult[ult.length - 1].kg).replace('.', ',')} kg</text>
    </svg>
    <div class="chart-foot"><span>${dataCurta(ult[0].data)}</span><span>Melhor: ${String(max).replace('.', ',')} kg</span><span>${dataCurta(ult[ult.length - 1].data)}</span></div>`;
  }
  return `<h3 class="sec">Carga por exercício</h3>
  <section class="card">
    <div class="chips scroll">${nomes.map((nm) => `<button class="chip ${nm === UI.exercicio ? 'on' : ''}" data-a="exercicio" data-n="${esc(nm)}">${esc(nm)}</button>`).join('')}</div>
    ${svg}
  </section>`;
}

function fmtTempo(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(ss).padStart(2, '0');
}

function renderTreinoAtivo() {
  const t = S.treinoAtivo;
  const tt = TIPOS_TREINO.find((x) => x.id === t.tipo) || {};
  const exs = t.exercicios.map((e, ei) => {
    const ult = ultimaSessaoEx(e.nome);
    const pr = serieRecorde(e, t.id);
    return `
    <section class="card ex">
      <div class="ex-head"><b>${esc(e.nome)}</b>${pr >= 0 ? `<span class="pill blue">${ic('trophy')} Recorde</span>` : ''}</div>
      <small class="muted">${ult ? `Última (${dataCurta(ult.data)}): ${ult.series.map((s) => `${String(s.kg).replace('.', ',')}×${s.reps}`).join(' · ')}` : 'Primeira vez: sem histórico'}</small>
      <div class="sets">
        <div class="set head"><span>#</span><span>kg</span><span>reps</span><span></span></div>
        ${e.series.map((s, si) => `
        <div class="set ${s.feito ? 'feito' : ''} ${si === pr ? 'pr' : ''}">
          <span>${si + 1}</span>
          <input type="number" inputmode="decimal" step="0.5" value="${s.kg}" data-serie="${ei}|${si}|kg" aria-label="Carga">
          <input type="number" inputmode="numeric" value="${s.reps}" data-serie="${ei}|${si}|reps" aria-label="Repetições">
          <button class="set-ok" data-a="serie" data-e="${ei}" data-s="${si}" aria-label="Série feita">${ic('check')}</button>
        </div>`).join('')}
      </div>
      <button class="link" data-a="addSerie" data-e="${ei}">${ic('plus')} Série</button>
    </section>`;
  }).join('');

  const cardio = tt.cardio ? `
    <section class="card form">
      ${t.tipo !== 'surf' ? `<label>Distância (km)<input type="number" inputmode="decimal" step="0.1" value="${esc(t.distancia)}" data-campo="distancia"></label>` : ''}
      <label>Notas<input type="text" value="${esc(t.notas)}" data-campo="notas" placeholder="${t.tipo === 'surf' ? 'Ondas, pico, prancha...' : 'Como foi'}"></label>
    </section>` : '';

  return `
  <section class="hero small">
    <div class="hero-top"><span class="eyebrow light">${esc(t.nome)}${t.sub ? ' · ' + esc(t.sub) : ''}</span><button class="icon-btn" data-a="cancelarTreino" aria-label="Cancelar treino">${ic('x')}</button></div>
    <div class="crono" id="crono">${fmtTempo(Date.now() - t.inicio)}</div>
    <div class="row2">
      <div class="seg mini dark">${[60, 90, 120].map((s) => `<button data-a="descanso" data-seg="${s}" class="${(UI.ultimoDescanso || 90) === s ? 'on' : ''}">${s}s</button>`).join('')}</div>
      <button class="btn light" data-a="finalizarTreino">Finalizar</button>
    </div>
  </section>
  ${exs}${cardio}
  <p class="nota center">Marque cada série feita: o timer de descanso começa sozinho.</p>`;
}

function renderDescanso() {
  const el = $('#descanso');
  const d = UI.descanso;
  if (!d || UI.aba !== 'treino' || !S.treinoAtivo) { el.hidden = true; return; }
  const rest = d.fim - Date.now();
  el.hidden = false;
  if (rest <= 0) {
    el.innerHTML = `<b>Bora pra próxima série</b><button data-a="pularDescanso">Ok</button>`;
    return;
  }
  el.innerHTML = `<span class="eyebrow light">Descanso</span><b>${fmtTempo(rest)}</b>
    <div class="desc-bar"><i style="width:${(100 * rest) / (d.total * 1000)}%"></i></div>
    <button data-a="maisDescanso">+15s</button><button data-a="pularDescanso">Pular</button>`;
}

function iniciarDescanso(seg) {
  UI.descanso = { fim: Date.now() + seg * 1000, total: seg, avisou: false };
  renderDescanso();
}

// Finalizar treino: intensidade e duração
function abrirFinalizar() {
  const t = S.treinoAtivo;
  const min = Math.round((Date.now() - t.inicio) / 60000);
  t.duracao = min >= 10 ? min : (S.sim.teste ? 50 : Math.max(1, min));
  t.intensidade = t.intensidade || 7;
  const resumo = () => {
    const c = calcXpTreino(t);
    return `<div class="stats3">
        <div><span class="eyebrow">Duração</span><b>${t.duracao} min</b></div>
        <div><span class="eyebrow">Volume</span><b>${num(c.volume)} kg</b></div>
        <div><span class="eyebrow">XP</span><b>+${c.total}</b></div>
      </div>
      ${blocoDinheiro(c.total)}
      <ul class="xp-break">
        <li><span>Treino</span><b>${c.base}</b></li>
        ${c.nPrs ? `<li><span>${c.nPrs} recorde${c.nPrs > 1 ? 's' : ''}${c.nPrs > S.config.xpBonus.maxRecordes ? ` (contam ${S.config.xpBonus.maxRecordes})` : ''}</span><b>+${c.prs}</b></li>` : ''}
        <li class="${c.intens ? '' : 'off'}"><span>Intensidade 8+</span><b>+${S.config.xpBonus.intensidade}</b></li>
        <li class="${c.dur ? '' : 'off'}"><span>Mais de 45 min</span><b>+${S.config.xpBonus.duracao}</b></li>
      </ul>`;
  };
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic">${ic('trophy')}</span><div><span class="eyebrow">Finalizar</span><h3>${esc(t.nome)}</h3></div></div>
    <span class="eyebrow">Intensidade</span>
    <div class="chips grid10" data-s="int">${Array.from({ length: 10 }, (_, k) => `<button class="chip ${k + 1 === t.intensidade ? 'on' : ''}" data-v="${k + 1}">${k + 1}</button>`).join('')}</div>
    <label class="inline">Duração (min)<input type="number" inputmode="numeric" min="1" value="${t.duracao}" data-s="dur"></label>
    ${S.sim.teste && min < 10 ? '<p class="nota">Modo teste: duração sugerida de 50 min. Ajuste se quiser.</p>' : ''}
    <div data-s="resumo">${resumo()}</div>
    ${slideHtml('Deslize para finalizar')}`,
  (el) => {
    const up = () => { el.querySelector('[data-s="resumo"]').innerHTML = resumo(); };
    el.querySelector('[data-s="int"]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      t.intensidade = Number(b.dataset.v);
      el.querySelectorAll('[data-s="int"] .chip').forEach((c) => c.classList.toggle('on', c === b));
      up();
    });
    el.querySelector('[data-s="dur"]').addEventListener('input', (e) => { t.duracao = Math.max(1, Number(e.target.value) || 1); up(); });
    montarSlide(el, () => {
      const treino = S.treinoAtivo;
      S.treinoAtivo = null;
      UI.descanso = null;
      const lib0 = liberadoXp(S.quinzena);
      const r = finalizarTreino(treino);
      const liberou = liberadoXp(S.quinzena) - lib0 + (r.bau || 0);
      fila.push(() => modalTreinoFeito(treino, r.c, liberou));
      if (r.bau !== null) fila.push(() => modalBau(r.bau));
      const sub = checarNivel(); if (sub.length) fila.push(() => modalNivel(sub));
      if (r.desafio) toast('Desafio da quinzena cumprido!');
      fecharFolha(); render();
    });
  });
}

function modalTreinoFeito(t, c, liberou = 0) {
  abrirModal(`
    <div class="modal-card">
      <span class="eyebrow">Treino concluído</span>
      <h2>${esc(t.nome)}</h2>
      <div class="stats3">
        <div><span class="eyebrow">Duração</span><b>${t.duracao} min</b></div>
        <div><span class="eyebrow">Volume</span><b>${num(c.volume)} kg</b></div>
        <div><span class="eyebrow">Intensidade</span><b>${t.intensidade}/10</b></div>
      </div>
      <div class="xp-total">+${c.total} XP</div>
      <p class="muted center">${liberou > 0 ? `Liberou <b>${brl(liberou)}</b> na quinzena (incluindo baú)` : `Vale ${brl((c.total * taxaXp().valor) / 100)} rumo à próxima liberação`}</p>
      ${c.nPrs ? `<p class="muted center">${ic('trophy')} ${c.nPrs} recorde${c.nPrs > 1 ? 's' : ''} pessoal${c.nPrs > 1 ? 'is' : ''}</p>` : ''}
      <button class="btn" data-fechar>Fechar</button>
    </div>`);
}

// --- Grana ---
function renderGrana() {
  const q = S.quinzena;
  const abas = `<div class="seg grana-abas">${[['resumo', 'Resumo'], ['fixos', 'Fixos']].map(([k, n]) => `<button class="${(UI.granaAba || 'resumo') === k ? 'on' : ''}" data-a="granaAba" data-k="${k}">${n}${k === 'fixos' && !q.fixosOk && S.sim.data === q.inicio ? ' <i class="dot-alerta"></i>' : ''}</button>`).join('')}</div>`;
  return `
  <div class="page-head"><span class="eyebrow">Quinzena ${dataCurta(q.inicio)} a ${dataCurta(q.fim)}</span><h1>Grana</h1></div>
  ${abas}
  ${(UI.granaAba || 'resumo') === 'fixos' ? renderGranaFixos() : renderGranaResumo()}`;
}

function renderGranaResumo() {
  const q = S.quinzena, f = financas(q), iso = S.sim.data, cfg = S.config;
  const total = q.livre + q.saldoAnterior || 1;
  const pSac = Math.min(100, ((f.sacado + f.descontos) / total) * 100);
  const pDisp = Math.min(100 - pSac, (f.disponivel / total) * 100);

  // insights dos gastos
  const ins = insightsGastos(q);
  const top = ins.cats[0];
  const fds = cfg.fimDeSemanaSantos;
  const dif = ins.anterior === null ? null : ins.total - ins.anterior;
  const insights = `
    <div class="ins">
      <div><span class="eyebrow">Na quinzena</span><b>${brl(ins.total)}</b><small>${brl(ins.porDia)} por dia</small></div>
      <div><span class="eyebrow">Mais gasto em</span><b>${top ? esc(top[0]) : '—'}</b><small>${top ? `${Math.round((top[1] / ins.total) * 100)}% do total` : 'sem gastos ainda'}</small></div>
      <div><span class="eyebrow">Fast food</span><b>${ins.ff}×</b><small>${ins.ff ? `${brl(ins.ffValor)} = ${fds ? Math.round((ins.ffValor / fds) * 100) : 0}% de uma viagem` : 'nenhum na quinzena'}</small></div>
      <div><span class="eyebrow">Vs. anterior</span><b class="${dif > 0 ? 'neg' : ''}">${dif === null ? '—' : (dif > 0 ? '+' : dif < 0 ? '−' : '') + brl(Math.abs(dif))}</b><small>${dif === null ? 'primeira quinzena' : dif > 0 ? 'gastou mais' : dif < 0 ? 'gastou menos' : 'igual'}</small></div>
    </div>
    ${ins.cats.length > 1 ? `<div class="cat-bar">${ins.cats.map(([c, v], k) => `<i style="flex:${v};opacity:${Math.max(0.3, 1 - k * 0.18)}" title="${esc(c)}"></i>`).join('')}</div>
      <div class="cat-leg">${ins.cats.slice(0, 4).map(([c, v], k) => `<span><i style="opacity:${Math.max(0.3, 1 - k * 0.18)}"></i>${esc(c)} ${brl(v)}</span>`).join('')}</div>` : ''}`;

  // histórico: gastos e saques juntos
  const itens = [
    ...q.gastos.map((g) => ({ ...g, k: 'gasto' })),
    ...q.saques.map((s) => ({ ...s, k: 'saque' }))
  ].sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
  const mostrar = UI.histTudo ? itens : itens.slice(0, 5);
  const hist = mostrar.map((g) => g.k === 'saque'
    ? `<div class="hist"><span class="hist-ic saque">${ic('wallet')}</span><span class="task-tx"><b>Saque</b><small>${dataCurta(g.data)} · saiu do montante</small></span><span class="pos">${brl(g.valor)}</span></div>`
    : `<div class="hist"><span class="hist-ic">${ic(g.categoria === 'Delivery' ? 'burger' : 'wallet')}</span><span class="task-tx"><b>${esc(g.categoria)}</b><small>${dataCurta(g.data)}${g.nota ? ' · ' + esc(g.nota) : ''}${g.descontado ? ' · descontado' : ''}</small></span><span class="neg">−${brl(g.valor)}</span>
       <button class="icon-sm" data-a="apagarGasto" data-id="${g.id}" aria-label="Apagar gasto">${ic('x')}</button></div>`).join('');

  // potes
  const libSem = somaLib(q, ['terca', 'sexta']);
  const libBau = somaLib(q, ['bau', 'nivel']);
  const r = taxaXp(q), xpQ = xpQuinzena(q);
  const desProg = progressoDesafio(q);
  const pote = (icone, nome, lib, cap, sub) => `
    <div class="pote"><span class="task-ic">${ic(icone)}</span>
      <div class="pote-tx"><div class="pote-top"><b>${nome}</b><span>${brl(lib)} <small>de ${brl(cap)}</small></span></div>
      <div class="bar thin"><i style="width:${cap ? Math.min(100, (lib / cap) * 100) : 0}%"></i></div><small>${sub}</small></div></div>`;

  // próximas liberações
  const prox = [];
  for (let k = 0, d = iso; k < 8 && d <= q.fim; k++, d = somaDias(d, 1)) {
    const w = diaSemana(d);
    if (w !== 2 && w !== 5) continue;
    if (d === iso && diaLer(d).fechado) continue;
    const c = calcSemanal(q, d);
    const teto = Math.max(0, tetoAcumulado(q, d) - f.sacado - f.descontos);
    prox.push(`<div><b>${w === 2 ? 'Terça' : 'Sexta'} ${dataCurta(d)}${d === iso ? ' · hoje' : ''}</b><span>${d === iso ? `teto ${brl(f.teto)}` : `corte até ${brl(Math.min(c.cheio * (w === 5 ? 1.4 : 1), q.potes.semana - somaLib(q, ['terca', 'sexta'])))} · teto ${brl(teto)}`}</span></div>`);
    if (prox.length >= 2) break;
  }
  if (!q.desafio.concluido) prox.push(`<div><b>Desafio</b><span>${brl(q.potes.desafio)} · ${Math.min(desProg, q.desafio.meta)}/${q.desafio.meta}</span></div>`);
  if (f.tickets.liberados < f.tickets.max) prox.push(`<div><b>Ticket de delivery</b><span>${f.tickets.run}/${cfg.delivery.diasSeguidos} dias bons seguidos</span></div>`);

  const tickets = Array.from({ length: f.tickets.max }, (_, k) => {
    const st = k < f.tickets.usados ? 'usado' : k < f.tickets.liberados ? 'livre' : 'travado';
    return `<div class="ticket ${st}">${ic(st === 'travado' ? 'lock' : 'ticket')}<span>${brl(cfg.delivery.ticket)}</span><small>${st === 'usado' ? 'usado' : st === 'livre' ? 'liberado' : `${cfg.delivery.diasSeguidos} dias bons`}</small></div>`;
  }).join('');

  return `
  <section class="hero money">
    <span class="eyebrow light">${f.hojeSaque ? 'Saque de hoje' : `Próximo saque · ${SEMANA[diaSemana(f.dataSaque)]} ${dataCurta(f.dataSaque)}`}</span>
    <div class="money-big">${brl(f.sacouHoje || f.valorSaque)}</div>
    ${f.sacouHoje && f.valorSaque > 0 ? `<p class="money-nota">${brl(f.disponivel)} ficaram para o próximo saque.</p>` : ''}
    <p class="money-nota">${f.sacouHoje ? 'Saque de hoje feito. O que liberar agora fica para o próximo.'
      : f.hojeSaque ? (f.manha.ok ? 'Um saque por dia de saque: tudo ou só uma parte. O que ficar, e o que passar do teto, soma no próximo.' : `Complete as obrigações da manhã (${f.manha.feitas} de ${f.manha.total}) para liberar. O XP da manhã ainda entra, até o teto.`)
      : `Acumulado até agora. Fecha no corte de ${SEMANA[diaSemana(somaDias(f.dataSaque, -1))]} à meia-noite.`}
      ${f.paraDepois > 0 && !f.sacouHoje ? `<br>Teto deste saque: ${brl(f.teto)} · ${brl(f.paraDepois)} ficam para o próximo.` : ''}</p>
    <div class="money-row">
      <div><span class="eyebrow light">Já sacado</span><b>${brl(f.sacado)}</b></div>
      <div><span class="eyebrow light">Travado</span><b>${brl(f.travado)}</b></div>
      <div><span class="eyebrow light">Montante</span><b>${brl(f.montante)}</b></div>
    </div>
    <div class="bar duo"><i class="sac" style="width:${pSac.toFixed(1)}%"></i><i style="width:${pDisp.toFixed(1)}%"></i></div>
    <div class="bar-leg"><span><i class="sac"></i>Sacado</span><span><i></i>Liberado</span><span><i class="trav"></i>Travado</span></div>
    <button class="btn ${f.podeSacar ? 'light' : 'off'}" data-a="sacar" ${f.podeSacar ? '' : 'disabled'}>${f.podeSacar ? `Sacar (até ${brl(f.valorSaque)})`
      : f.sacouHoje ? `${ic('check')} Saque de hoje feito`
      : f.hojeSaque ? (f.manha.ok ? 'Nada liberado ainda' : `${ic('lock')} Feche a manhã para sacar`)
      : `Saque na ${SEMANA[diaSemana(f.dataSaque)]} ${dataCurta(f.dataSaque)}`}</button>
  </section>

  <button class="btn dark add" data-a="gasto">${ic('plus')} Gasto</button>

  <h3 class="sec">Gastos</h3>
  <section class="card">${insights}</section>

  <h3 class="sec">Histórico</h3>
  <section class="card list">${hist || '<p class="vazio">Nenhum gasto ou saque nesta quinzena.</p>'}
    ${itens.length > 5 ? `<button class="link" data-a="histTudo">${UI.histTudo ? 'Mostrar menos' : `Ver tudo (${itens.length})`}</button>` : ''}</section>

  <h3 class="sec">Próximas liberações</h3>
  <section class="card lista-mini">${prox.join('') || '<p class="vazio">Fim da quinzena chegando.</p>'}</section>

  <h3 class="sec">Potes · ${brl(f.liberado)} liberados</h3>
  <section class="card list">
    ${pote('bolt', 'XP', f.xp, q.potes.xp, f.xp >= q.potes.xp ? 'Pote cheio' : `${num(xpQ)} XP na quinzena · faltam ${r.xp - (xpQ % r.xp)} XP para +${brl(r.valor)}`)}
    ${pote('calendar', 'Terça e sexta', libSem, q.potes.semana, `Corte de terça (sex a seg) e de sexta (ter a qui), à meia-noite`)}
    ${pote('chest', 'Baú surpresa', libBau, q.potes.bau, 'Cada extra pode abrir um baú')}
    ${pote('target', 'Desafio', q.desafio.concluido ? q.potes.desafio : 0, q.potes.desafio, `${esc(q.desafio.texto)} · ${q.desafio.concluido ? 'cumprido' : `${Math.min(desProg, q.desafio.meta)} de ${q.desafio.meta}`}`)}
  </section>

  <h3 class="sec">Delivery</h3>
  <section class="card"><div class="tickets">${tickets}</div>
    <p class="nota">Cada ticket abre com ${cfg.delivery.diasSeguidos} dias bons seguidos. O que sobrar vira disponível para saque no fim.</p></section>

  <section class="card santos">
    <span class="task-ic">${ic('wave')}</span>
    <div class="task-tx"><span class="eyebrow">Caixa de viagem</span><b>${brl(S.santos)}</b><small>+${brl(santosFixo(q))} liberados no dia do pagamento (${dataCurta(q.inicio)}). Para hospedagem e os custos mais pesados; o resto vem dos saques.</small></div>
    <button class="santos-usar" data-a="usarSantos">Usar</button>
  </section>`;
}

// Editor dos fixos da quinzena atual (usado na aba Fixos e na folha do dia de pagamento)
function fixosEditorHtml() {
  const q = S.quinzena;
  return `
    <label class="inline">Entrada<input type="number" inputmode="decimal" value="${q.entrada}" data-qf="entrada" id="qf-entrada"></label>
    ${q.fixos.map((fx, i) => `
      <div class="fixo-ed q">
        <button class="check-box ${fx.pago ? 'on' : ''}" data-a="pagarFixo" data-k="${i}" aria-label="Pago">${ic('check')}</button>
        <input type="text" value="${esc(fx.nome)}" data-qf="${i}|nome" id="qf-${i}-n" aria-label="Nome">
        <input type="number" inputmode="decimal" value="${fx.valor}" data-qf="${i}|valor" id="qf-${i}-v" aria-label="Valor">
        <button class="icon-sm" data-a="qRemFixo" data-i="${i}" aria-label="Remover">${ic('x')}</button>
      </div>`).join('')}
    <button class="link" data-a="qAddFixo">${ic('plus')} Fixo</button>
    <div class="fixo total"><span class="task-tx"><b>Dinheiro livre</b><small>entrada menos fixos${q.travadoAnterior ? ` + ${brl(q.travadoAnterior)} travados da anterior` : ''}</small></span><b data-livre>${brl(q.livre)}</b></div>`;
}

function renderGranaFixos() {
  const q = S.quinzena;
  const pagos = q.fixos.filter((f) => f.pago).length;
  return `
  ${q.fixosOk || S.sim.data !== q.inicio ? '' : `<section class="card aviso">${ic('calendar')}<div><b>Dia de pagamento</b><small>Confira quanto foi cada fixo nesta quinzena e confirme.</small></div></section>`}
  <section class="card form" data-fixos>${fixosEditorHtml()}</section>
  <p class="nota">Vale só para esta quinzena (${dataCurta(q.inicio)} a ${dataCurta(q.fim)}). Marque cada fixo quando pagar: ${pagos} de ${q.fixos.length} pagos.</p>
  ${q.fixosOk ? '' : `<button class="btn" data-a="confirmarFixos">Confirmar fixos</button>`}
  <button class="btn ghost" data-a="fixosPadrao">Usar como padrão nas quinzenas do dia ${q.tipo}</button>`;
}

function abrirFixosFolha() {
  const q = S.quinzena;
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic">${ic('calendar')}</span><div><span class="eyebrow">Dia de pagamento · dia ${q.tipo}</span><h3>Custos fixos</h3></div></div>
    <p class="nota">Confira quanto foi cada fixo nestes 15 dias. O dinheiro livre da quinzena sai daqui e entra travado.</p>
    <div class="form" data-fixos>${fixosEditorHtml()}</div>
    <button class="btn" data-a="confirmarFixos">Confirmar fixos</button>`);
}
// Redesenha o editor de fixos onde ele estiver aberto
function atualizarFixos() {
  document.querySelectorAll('#folha [data-fixos]').forEach((el) => { el.innerHTML = fixosEditorHtml(); });
}

function abrirGasto() {
  let valor = null;
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic">${ic('wallet')}</span><div><span class="eyebrow">Dois toques</span><h3>Novo gasto</h3></div></div>
    <p class="nota">Registro do que você gastou com o dinheiro já sacado. Entra no histórico e nos insights.</p>
    <span class="eyebrow">1. Valor</span>
    <div class="chips" data-s="v">${[10, 20, 35, 50, 100].map((v) => `<button class="chip" data-v="${v}">${brl(v)}</button>`).join('')}
      <input class="chip-in" type="number" inputmode="decimal" placeholder="Outro" min="1"></div>
    <span class="eyebrow">2. Categoria</span>
    <div class="chips cats off" data-s="c">${CATEGORIAS_GASTO.map((c) => `<button class="chip" data-c="${c}">${c}</button>`).join('')}</div>`,
  (el) => {
    const cats = el.querySelector('[data-s="c"]');
    const escolhe = (v) => { valor = v; cats.classList.toggle('off', !(v > 0)); };
    el.querySelector('[data-s="v"]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      el.querySelectorAll('[data-s="v"] .chip').forEach((c) => c.classList.toggle('on', c === b));
      escolhe(Number(b.dataset.v));
    });
    el.querySelector('.chip-in').addEventListener('input', (e) => { el.querySelectorAll('[data-s="v"] .chip').forEach((c) => c.classList.remove('on')); escolhe(Number(e.target.value)); });
    cats.addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]'); if (!b || !(valor > 0)) return;
      S.quinzena.gastos.push({ id: uid(), data: S.sim.data, valor, categoria: b.dataset.c });
      salvar(); fecharFolha(); render();
      toast(`${brl(valor)} em ${b.dataset.c}`);
    });
  });
}

// --- Progresso ---
function renderProgresso() {
  const iso = S.sim.data, xp = xpTotal(), n = nivelInfo(xp);
  const seq = sequencia(iso);
  // últimos 7 dias
  const sete = intervalo(somaDias(iso, -6), iso).map((d) => {
    const st = d < S.inicioApp ? 'fora' : ehBom(d) ? 'on' : d === iso ? 'hoje' : diaLer(d).fechado ? 'off' : 'fora';
    return `<div class="wk ${st}"><span>${SEMANA_LETRA[diaSemana(d)]}</span><i>${st === 'on' ? ic('check') : ''}</i></div>`;
  }).join('');

  // caminho até Surfista
  const r = xp % CICLO_NIVEL;
  const caminho = NIVEIS.map(([nv, nome, min]) => {
    const st = nv < n.nivel ? 'ok' : nv === n.nivel ? 'atual' : 'prox';
    return `<div class="path ${st}"><span class="path-n">${st === 'ok' ? ic('check') : nv}</span><div><b>${esc(nome)}</b><small>${st === 'prox' ? `faltam ${num(min - r)} XP` : st === 'atual' ? `${num(n.atual)} de ${num(n.falta)} XP` : `${num(min)} XP`}</small></div></div>`;
  }).join('');

  // mapa de 14 dias
  const dias14 = intervalo(somaDias(iso, -13), iso);
  const mapa = habitos().map((h) => `
    <div class="map-row"><span class="map-lbl">${esc(h.nome)}</span>${dias14.map((d) => {
      const fr = partesFeitas(d, h) / h.partes.length;
      return `<i class="${fr >= 1 ? 'on' : fr > 0 ? 'meio' : ''} ${d < S.inicioApp ? 'fora' : ''}"></i>`;
    }).join('')}</div>`).join('');
  const mapaHead = `<div class="map-row head"><span class="map-lbl"></span>${dias14.map((d) => `<span>${paraData(d).getDate()}</span>`).join('')}</div>`;

  // médias dos últimos 30 dias (dias que já existem)
  const d30 = intervalo(somaDias(iso, -29), iso).filter((d) => d >= S.inicioApp && (diaLer(d).fechado || d === iso));
  const ag = habito('agua');
  const litros = ag && d30.length ? soma(d30.map((d) => partesFeitas(d, ag))) * S.config.garrafaMl / 1000 / d30.length : 0;
  const treinos30 = treinosEntre(somaDias(iso, -29), iso);
  let fruta = 0;
  for (let d = habitoFeitoId(iso, 'frutas') ? iso : somaDias(iso, -1); d >= S.inicioApp && habitoFeitoId(d, 'frutas'); d = somaDias(d, -1)) fruta++;
  const bons30 = d30.filter(ehBom).length;

  const hist = S.historico.map((h) => `<div><b>${dataCurta(h.inicio)} a ${dataCurta(h.fim)}</b><span>${h.diasBons}/${h.dias} bons · ${brl(h.liberado)} liberados${h.travadoPassa ? ` · ${brl(h.travadoPassa)} passaram` : ''}</span></div>`).join('');

  return `
  <div class="page-head"><span class="eyebrow">${num(xp)} XP no total</span><h1>Progresso</h1></div>
  <section class="card">
    <div class="card-head"><div><span class="eyebrow">Sequência</span><h2>${seq} <small>${seq === 1 ? 'dia' : 'dias'} · melhor ${maiorSequencia()}</small></h2></div>${ic('flame', 'flame-big')}</div>
    <div class="week">${sete}</div>
  </section>

  <h3 class="sec">Médias de 30 dias</h3>
  <div class="grid2">
    <div class="card stat"><span class="eyebrow">Água por dia</span><b>${litros.toFixed(1).replace('.', ',')} L</b><small>meta ${(S.config.metaAguaMl / 1000).toFixed(1).replace('.', ',')} L</small></div>
    <div class="card stat"><span class="eyebrow">Treinos</span><b>${treinos30}</b><small>nos últimos 30 dias</small></div>
    <div class="card stat"><span class="eyebrow">Fruta seguida</span><b>${fruta}</b><small>${fruta === 1 ? 'dia' : 'dias'} com 2 frutas</small></div>
    <div class="card stat"><span class="eyebrow">Dias bons</span><b>${bons30}<small>/${d30.length}</small></b><small>${d30.length ? Math.round((bons30 / d30.length) * 100) : 0}% dos dias</small></div>
  </div>

  <h3 class="sec">Últimos 14 dias</h3>
  <section class="card map">${mapaHead}${mapa}</section>

  <h3 class="sec">Caminho até Surfista${n.estrelas ? ` · ${n.estrelas} estrela${n.estrelas > 1 ? 's' : ''}` : ''}</h3>
  <section class="card paths">${caminho}</section>

  ${hist ? `<h3 class="sec">Quinzenas fechadas</h3><section class="card lista-mini">${hist}</section>` : ''}`;
}

// --- Ajustes ---
function renderAjustes() {
  const c = S.config;
  const hab = habitos().map((h) => `
    <button class="hist" data-a="editarHabito" data-h="${h.id}"><span class="task-ic">${ic(h.icone)}</span>
      <span class="task-tx"><b>${esc(h.nome)}</b><small>${h.tipo === 'minimo' ? 'Mínimo' : 'Extra'} · ${h.xp} XP · ${h.partes.map((p) => PERIODOS[p.periodo] || 'Todos').join(', ')}</small></span>${ic('next')}</button>`).join('');

  const orc = (k, rot) => {
    const o = c.orcamento[k];
    return `<section class="card form">
      <div class="card-head"><div><span class="eyebrow">${rot}</span><h2>${brl(o.entrada - soma(o.fixos.map((f) => f.valor)))} <small>livre</small></h2></div></div>
      <label class="inline">Entrada<input type="number" inputmode="decimal" value="${o.entrada}" data-orc="${k}|entrada"></label>
      ${o.fixos.map((f, i) => `<div class="fixo-ed"><input type="text" value="${esc(f.nome)}" data-orc="${k}|${i}|nome" aria-label="Nome"><input type="number" inputmode="decimal" value="${f.valor}" data-orc="${k}|${i}|valor" aria-label="Valor"><button class="icon-sm" data-a="removerFixo" data-k="${k}" data-i="${i}" aria-label="Remover">${ic('x')}</button></div>`).join('')}
      <button class="link" data-a="addFixo" data-k="${k}">${ic('plus')} Fixo</button>
    </section>`;
  };

  const frases = c.frases.map((f, i) => `
    <button class="hist" data-a="editarFrase" data-i="${i}"><span class="quote-img sm">${f.imagem ? `<img src="${f.imagem}" alt="">` : `<span>${esc(iniciais(f.autor))}</span>`}</span>
    <span class="task-tx"><b>${esc(f.texto)}</b><small>${esc(f.autor)}</small></span></button>`).join('');

  const p = c.potes, b = c.xpBonus;
  return `
  <div class="page-head row"><button class="icon-btn dark" data-a="ir" data-aba="hoje" aria-label="Voltar">${ic('back')}</button><div><span class="eyebrow">Configuração</span><h1>Ajustes</h1></div></div>

  <h3 class="sec">Você</h3>
  <section class="card form">
    <label class="inline">Nome<input type="text" value="${esc(c.nome)}" data-cfg="nome"></label>
    <label class="inline">Horário de dormir<input type="time" value="${esc(c.horaDormir)}" data-cfg="horaDormir"></label>
    <label class="inline">Garrafa (ml)<input type="number" inputmode="numeric" value="${c.garrafaMl}" data-cfg="garrafaMl" data-num></label>
    <label class="inline">Meta de água (ml)<input type="number" inputmode="numeric" value="${c.metaAguaMl}" data-cfg="metaAguaMl" data-num></label>
    <label class="inline">Fim de semana de viagem (custo)<input type="number" inputmode="decimal" value="${c.fimDeSemanaSantos}" data-cfg="fimDeSemanaSantos" data-num></label>
  </section>

  <h3 class="sec">Modo</h3>
  <section class="card form">
    <div class="modo"><b>${S.sim.teste ? 'Modo teste' : 'Valendo'}</b><small>${S.sim.teste ? 'Data simulada e botões para avançar os dias.' : `Data e hora reais desde ${dataCurta(S.inicioApp)}.`}${NUVEM.ativo ? ' Salvo na nuvem.' : ' Salvo só neste aparelho.'}</small></div>
    ${S.sim.teste ? '<button class="btn" data-a="comecarDeVerdade">Começar de verdade hoje</button>' : '<button class="btn ghost" data-a="abrirModoTeste">Abrir modo teste</button>'}
  </section>

  ${CHAT.provedores && CHAT.provedores.length ? `
  <h3 class="sec">IA do coach</h3>
  <section class="card list">
    ${[{ id: '', nome: 'Padrão do servidor', modelo: (CHAT.provedores.find((x) => x.id === CHAT.padrao) || {}).nome || '' }, ...CHAT.provedores].map((x) => `
      <button class="fixo ${(S.config.iaProvedor || '') === x.id ? 'pago' : ''}" data-a="iaProvedor" data-id="${x.id}">
        <span class="check-box">${ic('check')}</span><span class="task-tx"><b>${esc(x.nome)}</b><small>${esc(x.modelo)}${x.gratis ? ' · gratuito' : ''}</small></span>
      </button>`).join('')}
  </section>` : ''}

  <h3 class="sec">Hábitos</h3>
  <section class="card list">${hab}<button class="link" data-a="editarHabito" data-h="">${ic('plus')} Novo hábito</button></section>

  <h3 class="sec">Orçamento</h3>
  <p class="nota">Padrão usado quando cada quinzena abre. Para mudar só a quinzena atual, use Grana › Fixos.</p>
  ${orc('d15', 'Quinzena do dia 15')}
  ${orc('d30', 'Quinzena do dia 30')}
  <section class="card form">
    <label class="inline">Delivery por quinzena<input type="number" value="${c.delivery.total}" data-cfg="delivery.total" data-num></label>
    <label class="inline">Valor do ticket<input type="number" value="${c.delivery.ticket}" data-cfg="delivery.ticket" data-num></label>
    <label class="inline">Dias bons para 1 ticket<input type="number" value="${c.delivery.diasSeguidos}" data-cfg="delivery.diasSeguidos" data-num></label>
  </section>

  <h3 class="sec">Regras</h3>
  <section class="card lista-mini regras">
    <div><b>Dia bom (todos os mínimos)</b><span>+${c.xpDiaBom} XP</span></div>
    <div><b>Recorde no treino (até ${b.maxRecordes})</b><span>+${b.recorde} cada</span></div>
    <div><b>Intensidade 8+ / mais de 45 min</b><span>+${b.intensidade} / +${b.duracao}</span></div>
    <div><b>3 treinos na semana (sex a qui)</b><span>+${b.semana3} XP no corte de sexta</span></div>
    <div><b>7 dias bons seguidos</b><span>+${b.sequencia7} XP</span></div>
    <div><b>Potes do dinheiro livre</b><span>XP ${p.xp * 100}% · terça/sexta ${p.semana * 100}% · baú ${p.bau * 100}% · desafio ${p.desafio * 100}%</span></div>
    <div><b>XP em dinheiro</b><span>${brl(taxaXp().valor)} a cada 100 XP nesta quinzena. O pote de XP enche com ${num(c.metaXpQuinzena || 2700)} XP, então o valor sobe quando o montante cresce.</span></div>
    <div><b>Baús</b><span>Fatias do pote de baús: até ${brl(bauMax())} por bônus nesta quinzena</span></div>
    <div><b>Corte</b><span>Meia-noite que começa a terça (dias bons de sex a seg) e a sexta (ter a qui). O valor do saque fecha aí.</span></div>
    <div><b>Saque</b><span>Um por terça e sexta, depois das obrigações da manhã. O XP da manhã ainda entra.</span></div>
    <div><b>Teto do saque</b><span>Sobe aos poucos: terça 1 fatia, sexta 2 fatias do montante; 100% no último saque. O excedente vai para o próximo.</span></div>
    <div><b>Não liberado no fim</b><span>Continua travado e soma no dinheiro livre da próxima quinzena</span></div>
    <div><b>Caixa de viagem</b><span>Custo fixo (R$300), liberado inteiro no dia do pagamento, para hospedagem e os custos mais pesados</span></div>
  </section>

  <h3 class="sec">Frases · uma por dia</h3>
  <section class="card list">${frases}<button class="link" data-a="editarFrase" data-i="-1">${ic('plus')} Nova frase</button></section>

  ${S.sim.teste ? `<button class="btn ghost danger-tx" data-a="reset">${ic('reset')} Resetar tudo</button>` : ''}
  ${NUVEM.ativo ? '<button class="btn ghost" data-a="sair">Sair deste aparelho</button>' : ''}
  <p class="nota center">Lifemaxxing · ${NUVEM.ativo ? 'dados no Supabase e neste aparelho' : 'dados só neste aparelho'}</p>`;
}

function abrirEditarHabito(id) {
  const novo = !id;
  const h = novo ? { id: 'c_' + uid(), nome: '', tipo: 'extra', xp: 20, icone: 'dot', partes: [{ periodo: 'manha', rotulo: '' }], motivos: [] } : habito(id);
  const especial = !!h.especial;
  const opPer = (v) => ['manha', 'tarde', 'noite', 'todos'].map((p) => `<option value="${p}" ${p === v ? 'selected' : ''}>${PERIODOS[p] || 'Todos'}</option>`).join('');
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic">${ic(h.icone)}</span><div><span class="eyebrow">${novo ? 'Novo' : 'Editar'} hábito</span><h3>${esc(h.nome) || 'Hábito'}</h3></div></div>
    <div class="form">
      <label>Nome<input type="text" data-f="nome" value="${esc(h.nome)}"></label>
      <div class="row2">
        <label>Tipo<select data-f="tipo" ${especial ? 'disabled' : ''}><option value="minimo" ${h.tipo === 'minimo' ? 'selected' : ''}>Mínimo</option><option value="extra" ${h.tipo === 'extra' ? 'selected' : ''}>Extra</option></select></label>
        <label>XP<input type="number" inputmode="numeric" data-f="xp" value="${h.xp}"></label>
      </div>
      ${h.partes.map((pt, i) => `<div class="row2"><label>${h.partes.length > 1 ? 'Parte ' + (i + 1) : 'Rótulo'}<input type="text" data-parte="${i}|rotulo" value="${esc(pt.rotulo)}"></label><label>Período<select data-parte="${i}|periodo">${opPer(pt.periodo)}</select></label></div>`).join('')}
      ${h.id === 'agua' ? '<p class="nota">O número de garrafas muda com o tamanho da garrafa (Ajustes › Você).</p>' : ''}
      <label>Ícone<div class="chips icons">${ICONES_HABITO.map((n) => `<button type="button" class="chip ${n === h.icone ? 'on' : ''}" data-ic="${n}">${ic(n)}</button>`).join('')}</div></label>
      <label>Porquê (um por linha)<textarea rows="3" data-f="motivos">${esc(h.motivos.join('\n'))}</textarea></label>
    </div>
    <div class="row2">${!novo && !especial ? `<button class="btn ghost danger-tx" data-s="apagar">Apagar</button>` : '<button class="btn ghost" data-fechar>Cancelar</button>'}<button class="btn" data-s="salvar">Salvar</button></div>`,
  (el) => {
    let icone = h.icone;
    el.querySelector('.icons').addEventListener('click', (e) => {
      const b = e.target.closest('[data-ic]'); if (!b) return;
      icone = b.dataset.ic; el.querySelectorAll('.icons .chip').forEach((c) => c.classList.toggle('on', c === b));
    });
    el.querySelector('[data-s="salvar"]').addEventListener('click', () => {
      const v = (f) => el.querySelector(`[data-f="${f}"]`).value;
      h.nome = v('nome').trim() || 'Hábito';
      if (!especial) h.tipo = v('tipo');
      h.xp = Math.max(0, Number(v('xp')) || 0);
      h.icone = icone;
      h.motivos = v('motivos').split('\n').map((s) => s.trim()).filter(Boolean);
      el.querySelectorAll('[data-parte]').forEach((inp) => { const [i, k] = inp.dataset.parte.split('|'); h.partes[i][k] = inp.value; });
      if (novo) S.config.habitos.push(h);
      salvar(); fecharFolha(); render();
    });
    const ap = el.querySelector('[data-s="apagar"]');
    if (ap) ap.addEventListener('click', () => confirmar(`Apagar o hábito ${h.nome}?`, 'Apagar', () => {
      S.config.habitos = S.config.habitos.filter((x) => x.id !== h.id);
      salvar(); fecharFolha(); render();
    }));
  });
}

function abrirEditarFrase(i) {
  const nova = i < 0;
  const f = nova ? { texto: '', autor: '', imagem: '' } : S.config.frases[i];
  let imagem = f.imagem;
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic">${ic('book')}</span><div><span class="eyebrow">Biblioteca</span><h3>${nova ? 'Nova frase' : 'Editar frase'}</h3></div></div>
    <div class="form">
      <label>Frase<textarea rows="3" data-f="texto">${esc(f.texto)}</textarea></label>
      <label>Autor<input type="text" data-f="autor" value="${esc(f.autor)}"></label>
      <div class="img-up"><span class="quote-img lg" data-s="prev">${imagem ? `<img src="${imagem}" alt="">` : ic('image')}</span>
        <label class="btn ghost">Escolher imagem<input type="file" accept="image/*" hidden data-s="file"></label>
        <button class="link" data-s="semimg">Sem imagem</button></div>
    </div>
    <div class="row2">${nova ? '<button class="btn ghost" data-fechar>Cancelar</button>' : '<button class="btn ghost danger-tx" data-s="apagar">Apagar</button>'}<button class="btn" data-s="salvar">Salvar</button></div>`,
  (el) => {
    const prev = el.querySelector('[data-s="prev"]');
    el.querySelector('[data-s="file"]').addEventListener('change', (e) => {
      const file = e.target.files[0]; if (!file) return;
      reduzirImagem(file, 240).then((url) => { imagem = url; prev.innerHTML = `<img src="${url}" alt="">`; });
    });
    el.querySelector('[data-s="semimg"]').addEventListener('click', () => { imagem = ''; prev.innerHTML = ic('image'); });
    el.querySelector('[data-s="salvar"]').addEventListener('click', () => {
      const texto = el.querySelector('[data-f="texto"]').value.trim();
      if (!texto) return toast('Escreva a frase');
      const obj = { texto, autor: el.querySelector('[data-f="autor"]').value.trim(), imagem };
      if (nova) S.config.frases.push(obj); else S.config.frases[i] = obj;
      salvar(); fecharFolha(); render();
    });
    const ap = el.querySelector('[data-s="apagar"]');
    if (ap) ap.addEventListener('click', () => { S.config.frases.splice(i, 1); salvar(); fecharFolha(); render(); });
  });
}

// Reduz a imagem para caber no localStorage
function reduzirImagem(file, lado) {
  return new Promise((ok) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, lado / Math.min(img.width, img.height));
        const w = Math.round(img.width * k), h = Math.round(img.height * k);
        const cv = document.createElement('canvas');
        cv.width = Math.min(w, lado); cv.height = Math.min(h, lado);
        cv.getContext('2d').drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
        ok(cv.toDataURL('image/jpeg', 0.8));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

// Folha de saque: tudo ou só uma parte
function abrirSacar() {
  const f = financas();
  if (!f.podeSacar) return;
  const max = Math.round(f.valorSaque * 100) / 100;
  let valor = max;
  const prox = proximoSaque(somaDias(S.sim.data, 1));
  const info = () => `<div class="custo"><b>${brl(valor)}</b><span class="azul">${valor < max ? `${brl(max - valor)} ficam para ${SEMANA[diaSemana(prox)]} ${dataCurta(prox)}` : 'saque total'}</span></div>`;
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic">${ic('wallet')}</span><div><span class="eyebrow">Saque de hoje · até ${brl(max)}</span><h3>Quanto sacar?</h3></div></div>
    <div class="chips" data-s="op">
      <button class="chip on" data-v="${max}">Tudo</button>
      <button class="chip" data-v="${Math.round(max / 2 * 100) / 100}">Metade</button>
      <input class="chip-in" type="number" inputmode="decimal" placeholder="Outro" min="1" max="${max}" id="sq-valor">
    </div>
    <div data-s="info">${info()}</div>
    <p class="nota">Um saque por dia de saque. O que você deixar soma com o que liberar até o próximo saque.</p>
    ${slideHtml('Deslize para sacar')}`,
  (el) => {
    const up = () => { el.querySelector('[data-s="info"]').innerHTML = info(); };
    el.querySelector('[data-s="op"]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      valor = Number(b.dataset.v); el.querySelector('#sq-valor').value = '';
      el.querySelectorAll('[data-s="op"] .chip').forEach((c) => c.classList.toggle('on', c === b)); up();
    });
    el.querySelector('#sq-valor').addEventListener('input', (e) => {
      const v = Number(e.target.value);
      if (v > 0) { valor = Math.min(max, v); el.querySelectorAll('[data-s="op"] .chip').forEach((c) => c.classList.remove('on')); up(); }
    });
    montarSlide(el, () => {
      const v = sacar(valor);
      fecharFolha(); render();
      if (v) toast(v < max ? `${brl(v)} sacados. ${brl(max - v)} ficam para o próximo saque.` : `${brl(v)} sacados. Saíram do montante.`);
    });
  });
}

// Registrar uso da Caixa de viagem (hospedagem, passagem...)
function abrirUsarSantos() {
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic">${ic('wave')}</span><div><span class="eyebrow">Caixa de viagem · ${brl(S.santos)}</span><h3>Usar da caixa</h3></div></div>
    <div class="form">
      <label>Valor<input type="number" inputmode="decimal" id="us-valor" placeholder="300"></label>
      <label>Para quê<input type="text" id="us-nota" placeholder="Hospedagem, passagem..."></label>
    </div>
    ${(S.santosUsos || []).length ? `<div class="lista-mini">${S.santosUsos.slice(-4).reverse().map((u) => `<div><b>${esc(u.nota || 'Uso')}</b><span>${dataCurta(u.data)} · −${brl(u.valor)}</span></div>`).join('')}</div>` : ''}
    <button class="btn" data-s="ok">Registrar</button>`,
  (el) => el.querySelector('[data-s="ok"]').addEventListener('click', () => {
    const v = Number(el.querySelector('#us-valor').value);
    if (!(v > 0)) return toast('Coloque o valor');
    S.santosUsos = S.santosUsos || [];
    S.santosUsos.push({ id: uid(), data: S.sim.data, valor: v, nota: el.querySelector('#us-nota').value.trim() });
    S.santos -= v;
    salvar(); fecharFolha(); render(); toast(`${brl(v)} usados da Caixa de viagem`);
  }));
}

/* ---------------------------------------------------------
   12b. Novo bônus (hábito opcional criado por você)
   --------------------------------------------------------- */
function abrirNovoBonus() {
  let xp = 20, icone = 'book';
  abrirFolha(`
    <div class="sheet-head"><span class="sheet-ic" data-s="ic">${ic(icone)}</span><div><span class="eyebrow">Bônus · opcional</span><h3>Novo bônus</h3></div></div>
    <div class="form">
      <label>O que é<input type="text" id="nb-nome" placeholder="Ler um livro" maxlength="40"></label>
      <span class="eyebrow">XP</span>
      <div class="chips" data-s="xp">${[10, 20, 30, 40, 60].map((v) => `<button class="chip ${v === xp ? 'on' : ''}" data-v="${v}">${v} XP</button>`).join('')}</div>
      <span class="eyebrow">Ícone</span>
      <div class="chips icons" data-s="icones">${ICONES_HABITO.map((n) => `<button type="button" class="chip ${n === icone ? 'on' : ''}" data-ic="${n}">${ic(n)}</button>`).join('')}</div>
      <label>Por que é bom (opcional, um por linha)<textarea rows="2" id="nb-motivos" placeholder="Desliga a cabeça do celular"></textarea></label>
    </div>
    <p class="nota">Bônus não conta para o dia bom. Dá XP, libera dinheiro e pode abrir um baú surpresa.</p>
    <button class="btn" data-s="salvar">Adicionar bônus</button>`,
  (el) => {
    el.querySelector('[data-s="xp"]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      xp = Number(b.dataset.v);
      el.querySelectorAll('[data-s="xp"] .chip').forEach((c) => c.classList.toggle('on', c === b));
    });
    el.querySelector('[data-s="icones"]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-ic]'); if (!b) return;
      icone = b.dataset.ic;
      el.querySelectorAll('[data-s="icones"] .chip').forEach((c) => c.classList.toggle('on', c === b));
      el.querySelector('[data-s="ic"]').innerHTML = ic(icone);
    });
    el.querySelector('[data-s="salvar"]').addEventListener('click', () => {
      const nome = el.querySelector('#nb-nome').value.trim();
      if (!nome) { el.querySelector('#nb-nome').focus(); return toast('Dê um nome ao bônus'); }
      S.config.habitos.push({
        id: 'c_' + uid(), nome, tipo: 'extra', xp, icone,
        partes: [{ periodo: 'todos', rotulo: nome }],
        motivos: el.querySelector('#nb-motivos').value.split('\n').map((s) => s.trim()).filter(Boolean)
      });
      salvar(); fecharFolha(); render();
      toast(`Bônus “${nome}” adicionado`);
    });
  });
}

/* ---------------------------------------------------------
   12c. Chat de IA (coach)
   A IA recebe um resumo compacto de TODOS os dados a cada pergunta
   (sem queries). Na versão publicada no claude.ai usa o Claude da
   própria conta; fora de lá mostra como ligar (docs/chat-ia.md).
   --------------------------------------------------------- */
const CHAT = { turnos: [], enviando: null, sample: undefined, dictation: undefined, base: '' };
const r2 = (v) => Math.round(v * 100) / 100;

async function iniciarIA() {
  CHAT.turnos = Array.isArray(S.chat) ? S.chat : [];
  if (NUVEM.ativo) {
    // Vercel: a IA roda em /api/chat (Gemini, Groq, OpenAI...). Voz pelo navegador.
    CHAT.sample = null;
    CHAT.servidor = true;
    CHAT.dictation = ditadoNavegador();
    registrarDitado(CHAT.dictation);
    try {
      const r = await fetch('/api/chat', { credentials: 'same-origin' });
      if (r.ok) { const j = await r.json(); CHAT.provedores = j.provedores; CHAT.padrao = j.padrao; }
    } catch (e) { /* offline */ }
    if ($('#chat')) { renderChatBarra(); renderChatCabecalho(); }
    return;
  }
  if (!window.claude || !window.claude.use) { CHAT.sample = null; CHAT.dictation = null; return; }
  try { CHAT.sample = await window.claude.use('sample'); } catch (e) { CHAT.sample = null; }
  try { CHAT.dictation = await window.claude.use('dictation'); } catch (e) { CHAT.dictation = null; }
  registrarDitado(CHAT.dictation);
  if ($('#chat')) renderChatBarra();
}

function registrarDitado(d) {
  if (d) {
    d.onPartial(({ text }) => { const t = $('#chat-in'); if (t) { t.value = (CHAT.base + ' ' + text).trim(); autoAltura(t); } });
    d.onFinal(({ text }) => { CHAT.base = (CHAT.base + ' ' + text).trim(); const t = $('#chat-in'); if (t) { t.value = CHAT.base; autoAltura(t); } });
    d.onState(({ state }) => { const b = $('#chat-mic'); if (b) b.classList.toggle('ouvindo', state === 'listening'); });
  }
}

// Voz pelo próprio navegador (Safari do iPhone e Chrome têm). Mesma interface do ditado do claude.ai.
function ditadoNavegador() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  let rec = null, cbP = () => {}, cbF = () => {}, cbS = () => {};
  return {
    onPartial(f) { cbP = f; }, onFinal(f) { cbF = f; }, onState(f) { cbS = f; },
    start() {
      return new Promise((ok, nao) => {
        try {
          rec = new SR();
          rec.lang = 'pt-BR'; rec.interimResults = true; rec.continuous = true;
          rec.onresult = (e) => {
            let parcial = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              const r = e.results[i];
              if (r.isFinal) cbF({ text: r[0].transcript.trim() }); else parcial += r[0].transcript;
            }
            cbP({ text: parcial.trim() });
          };
          rec.onend = () => cbS({ state: 'idle' });
          rec.onerror = (e) => { cbS({ state: 'idle' }); if (e.error === 'not-allowed') nao({ code: 'not_granted' }); };
          rec.start(); cbS({ state: 'listening' }); ok();
        } catch (e) { nao({ code: 'erro' }); }
      });
    },
    stop() { try { if (rec) rec.stop(); } catch (e) { /* ignora */ } return Promise.resolve(); }
  };
}

// Nome da IA no cabeçalho do chat
function renderChatCabecalho() {
  const el = $('.chat-tt small'); if (!el) return;
  if (CHAT.servidor && CHAT.provedores) {
    const id = S.config.iaProvedor || CHAT.padrao;
    const p = CHAT.provedores.find((x) => x.id === id) || CHAT.provedores[0];
    el.textContent = p ? `${p.nome} · lê seus hábitos, treinos e grana` : 'Nenhuma IA configurada no servidor';
  }
}

// Envia para /api/chat e lê a resposta em streaming
async function perguntarServidor(hist, resp, signal) {
  const r = await fetch('/api/chat', {
    method: 'POST', credentials: 'same-origin', signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provedor: S.config.iaProvedor || null, sistema: promptIA(), mensagens: hist })
  });
  if (!r.ok) {
    let j = {}; try { j = await r.json(); } catch (e) { /* ignora */ }
    throw { code: r.status === 401 ? 'login' : 'servidor', message: j.erro || `Erro ${r.status}` };
  }
  const leitor = r.body.getReader(), dec = new TextDecoder();
  let txt = '';
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    txt += dec.decode(value, { stream: true });
    resp.pensando = false; resp.content = txt; atualizarUltima();
  }
  return txt;
}

// Tudo o que a IA sabe: um retrato compacto do app
function contextoIA() {
  const iso = S.sim.data, q = S.quinzena, f = financas(q), n = nivelInfo(xpTotal());
  const hab = habitos();
  const ini = somaDias(iso, -59) > S.inicioApp ? somaDias(iso, -59) : S.inicioApp;
  const dias = intervalo(ini, iso).map((d) => {
    const dd = diaLer(d);
    const feitos = hab.filter((h) => habitoFeito(d, h)).map((h) => h.id);
    const parc = hab.filter((h) => !habitoFeito(d, h) && partesFeitas(d, h) > 0).map((h) => `${h.id}(${partesFeitas(d, h)}/${h.partes.length})`);
    return `${d} ${SEMANA_CURTA[diaSemana(d)]} | ${ehBom(d) ? 'DIA BOM' : 'não'} | ${xpDoDia(d)} XP | feitos: ${feitos.join(',') || 'nada'}`
      + (parc.length ? ` | parcial: ${parc.join(',')}` : '')
      + (dd.fastfood.length ? ` | fast food: ${dd.fastfood.map((x) => brl(x.valor) + (x.ticket ? ' (ticket)' : '')).join(', ')}` : '')
      + (d === iso ? ' | HOJE (em andamento)' : '');
  });
  const dados = {
    hoje: `${dataLonga(iso)} (${iso}), período ${PERIODOS[S.sim.periodo]}`,
    nivel: `${n.nivel} ${n.nome}${n.estrelas ? ` (${n.estrelas} estrela)` : ''}, ${n.atual}/${n.falta} XP no nível, ${xpTotal()} XP no total`,
    sequenciaDiasBons: sequencia(iso), melhorSequencia: maiorSequencia(),
    habitos: hab.map((h) => ({ id: h.id, nome: h.nome, tipo: h.tipo === 'minimo' ? 'obrigação' : 'bônus', xp: h.xp, partes: h.partes.length })),
    quinzena: {
      periodo: `${q.inicio} a ${q.fim} (pagamento do dia ${q.tipo})`, entrada: q.entrada,
      fixos: q.fixos.map((x) => ({ nome: x.nome, valor: x.valor, pago: !!x.pago })), fixosConfirmados: !!q.fixosOk,
      dinheiroLivre: q.livre, travadoQueVeioDaAnterior: q.travadoAnterior || 0, liberado: r2(f.liberado), disponivelParaSaque: r2(f.disponivel), jaSacado: r2(f.sacado),
      travado: r2(f.travado), montanteRestante: r2(f.montante), saldoQueVeioDaAnterior: q.saldoAnterior,
      potes: { xp: [r2(f.xp), r2(q.potes.xp)], tercaESexta: [r2(somaLib(q, ['terca', 'sexta'])), r2(q.potes.semana)], bau: [r2(somaLib(q, ['bau', 'nivel'])), r2(q.potes.bau)], desafio: [q.desafio.concluido ? r2(q.potes.desafio) : 0, r2(q.potes.desafio)] },
      saque: { hojeEDiaDeSaque: f.hojeSaque, proximoSaque: f.dataSaque, valorDoSaque: r2(f.valorSaque), tetoDoSaque: r2(f.teto), ficaParaDepois: r2(f.paraDepois), jaSacouHoje: f.sacouHoje, manhaFeita: `${f.manha.feitas}/${f.manha.total}` },
      desafio: { texto: q.desafio.texto, progresso: Math.min(progressoDesafio(q), q.desafio.meta), meta: q.desafio.meta, cumprido: q.desafio.concluido },
      ticketsDelivery: { liberados: f.tickets.liberados, usados: f.tickets.usados, de: f.tickets.max, diasBonsSeguidosAgora: f.tickets.run },
      gastos: q.gastos.map((g) => ({ data: g.data, valor: g.valor, categoria: g.categoria, nota: g.nota || undefined, descontadoDoMontante: !!g.descontado })),
      saques: q.saques.map((s) => ({ data: s.data, valor: r2(s.valor) })),
      liberacoes: q.liberacoes.map((l) => ({ data: l.data, tipo: l.tipo, valor: r2(l.valor) }))
    },
    quinzenasFechadas: S.historico,
    caixaDeViagem: { saldo: r2(S.santos), usos: S.santosUsos || [] },
    treinos: S.treinos.slice(-30).map((t) => ({
      data: t.data, nome: t.nome, minutos: t.duracao, intensidade: t.intensidade, volumeKg: t.volume, recordes: t.prs, xp: t.xp,
      series: (t.exercicios || []).map((e) => `${e.nome}: ${e.series.filter((s) => s.feito).map((s) => `${s.kg}kg×${s.reps}`).join(' ')}`)
    }))
  };
  return { dados, dias };
}

function promptIA() {
  const c = S.config, { dados, dias } = contextoIA();
  return `Você é o coach do Lifemaxxing, o app pessoal de hábitos de ${c.nome}. Responda em português do Brasil, curto e direto (2 a 6 frases, ou uma lista curta), como um amigo que treina junto. Sem emoji. Use só os dados abaixo; se faltar um dado, diga que não tem. Dinheiro em R$. Você não altera nada no app: se pedirem para registrar algo, diga onde tocar.

Como o app funciona: dia bom = todas as obrigações feitas (+${c.xpDiaBom} XP). Bônus são opcionais e valem mais. Tudo é porcentagem do montante da quinzena (entrada menos fixos, mais o que sobrou travado da anterior): cada 100 XP libera ${brl(taxaXp().valor)} nesta quinzena (o pote de XP enche com ${c.metaXpQuinzena || 2700} XP). À meia-noite que começa a terça há um corte que libera pelos dias bons de sexta a segunda (1 parte); à meia-noite que começa a sexta, pelos dias bons de terça a quinta (2 partes, +20% com a semana toda boa e +20% com 3 treinos de sexta a quinta). Cada bônus pode abrir um baú (vazio ou uma fatia do pote de baús, até ${brl(bauMax())}). Subir de nível dá um baú de 19% a 38% do pote de baús. Desafio cumprido libera o pote inteiro. ${c.delivery.diasSeguidos} dias bons seguidos liberam um ticket de delivery de ${brl(c.delivery.ticket)}. Saque: um único por terça e sexta, total ou parcial (o que não sacar fica para o próximo saque), liberado depois de completar as obrigações da manhã; o XP da manhã ainda entra. Cada saque tem um teto que sobe aos poucos na quinzena (terça vale 1 fatia e sexta 2 do montante, 100% no último saque); o que passar do teto fica para o próximo saque. Sacar tira o valor do montante. No fim da quinzena o que ficou travado passa para a próxima quinzena (soma no dinheiro livre dela). A Caixa de viagem é um custo fixo (R$300 por quinzena), liberado inteiro no dia do pagamento para hospedagem e custos pesados de viagem; o saldo dela é caixaDeViagem.

DADOS (JSON):
${JSON.stringify(dados)}

DIAS (mais antigo primeiro):
${dias.join('\n')}`;
}

function erroIA(code) {
  if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(code)) return 'Esta página não tem permissão para usar o Claude. Libere em Permissões, no menu do artifact.';
  if (code === 'rate_limited') return 'Muitas perguntas seguidas. Espere um pouco e tente de novo.';
  if (code === 'session_expired') return 'Sua sessão expirou. Entre de novo no claude.ai.';
  if (code === 'refused') return 'O Claude não respondeu isso. Tente perguntar de outro jeito.';
  if (code === 'prompt_too_large') return 'Contexto grande demais. Limpe a conversa e tente de novo.';
  return 'A conexão falhou. Envie de novo.';
}

// Markdown leve: **negrito**, listas com "-" e quebras de linha
function mdLeve(t) {
  const out = [];
  let lista = null;
  String(t).split('\n').forEach((l) => {
    const m = l.match(/^\s*(?:[-•*]|\d+[.)])\s+(.*)$/);
    const fmt = (x) => esc(x).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    if (m) { if (!lista) { lista = []; out.push(lista); } lista.push(`<li>${fmt(m[1])}</li>`); }
    else { lista = null; if (l.trim()) out.push(`<p>${fmt(l)}</p>`); }
  });
  return out.map((x) => (Array.isArray(x) ? `<ul>${x.join('')}</ul>` : x)).join('');
}

const SUGESTOES = ['Como está minha quinzena?', 'Quanto posso liberar na sexta?', 'Onde estou gastando mais?', 'O que falta hoje para o dia bom?', 'Como evoluiu meu supino?'];

function chatHtml() {
  return `
    <div class="chat-back" data-chat="fechar"></div>
    <section class="chat" role="dialog" aria-label="Coach">
      <header class="chat-head" data-chat="arrasto">
        <div class="grab"></div>
        <div class="chat-head-row">
          <span class="chat-av">${ic('sparkle')}</span>
          <div class="chat-tt"><b>Coach</b><small>Vê seus hábitos, treinos e grana</small></div>
          <button class="icon-sm" data-chat="limpar" aria-label="Limpar conversa">${ic('trash')}</button>
          <button class="icon-sm" data-chat="fechar" aria-label="Fechar">${ic('x')}</button>
        </div>
      </header>
      <div class="chat-msgs" id="chat-msgs"></div>
      <div class="chat-bar" id="chat-bar"></div>
    </section>`;
}

function renderChatMsgs() {
  const box = $('#chat-msgs'); if (!box) return;
  if (!CHAT.turnos.length) {
    box.innerHTML = `<div class="chat-vazio">
      <span class="chat-av lg">${ic('sparkle')}</span>
      <b>Pergunte sobre você</b>
      <p>O coach lê seus últimos 60 dias, treinos, gastos e a quinzena inteira.</p>
      <div class="chips sug">${SUGESTOES.map((s) => `<button class="chip" data-chat="sug">${esc(s)}</button>`).join('')}</div>
    </div>`;
    return;
  }
  box.innerHTML = CHAT.turnos.map((t, k) => `<div class="msg ${t.role === 'user' ? 'eu' : 'ia'} ${t.erro ? 'erro' : ''}" data-k="${k}">${t.pensando ? '<span class="pensando"><i></i><i></i><i></i></span>' : t.role === 'user' ? esc(t.content) : mdLeve(t.content)}</div>`).join('');
  box.scrollTop = box.scrollHeight;
}
function atualizarUltima() {
  const box = $('#chat-msgs'); if (!box) return;
  const k = CHAT.turnos.length - 1, el = box.querySelector(`[data-k="${k}"]`);
  if (!el) return renderChatMsgs();
  el.innerHTML = mdLeve(CHAT.turnos[k].content);
  box.scrollTop = box.scrollHeight;
}

function renderChatBarra() {
  const bar = $('#chat-bar'); if (!bar) return;
  const valor = $('#chat-in') ? $('#chat-in').value : '';
  const semIA = CHAT.sample === null;
  bar.innerHTML = `
    ${semIA && !CHAT.servidor ? '<p class="chat-aviso">Sem IA aqui. Na Vercel o coach usa Gemini, Groq ou OpenAI (docs/DEPLOY.md).</p>' : ''}
    <div class="chat-input">
      ${CHAT.dictation ? `<button class="chat-btn" id="chat-mic" data-chat="mic" aria-label="Falar">${ic('mic')}</button>` : ''}
      <textarea id="chat-in" rows="1" placeholder="Pergunte qualquer coisa" enterkeyhint="send">${esc(valor)}</textarea>
      <button class="chat-btn envia ${CHAT.enviando ? 'parar' : ''}" data-chat="${CHAT.enviando ? 'parar' : 'enviar'}" aria-label="${CHAT.enviando ? 'Parar' : 'Enviar'}">${CHAT.enviando ? '<i class="sq"></i>' : ic('arrow')}</button>
    </div>`;
  const t = $('#chat-in');
  t.addEventListener('input', () => autoAltura(t));
  t.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarChat(t.value); } });
}
function autoAltura(t) { t.style.height = 'auto'; t.style.height = Math.min(120, t.scrollHeight) + 'px'; }

async function enviarChat(texto) {
  texto = String(texto || '').trim();
  if (!texto || CHAT.enviando) return;
  if (CHAT.dictation) { try { CHAT.dictation.stop(); } catch (e) { /* ignora */ } }
  CHAT.base = '';
  CHAT.turnos.push({ role: 'user', content: texto });
  const resp = { role: 'assistant', content: '', pensando: true };
  CHAT.turnos.push(resp);
  const ctl = new AbortController();
  CHAT.enviando = ctl;
  if ($('#chat-in')) $('#chat-in').value = '';
  renderChatMsgs(); renderChatBarra();

  if (CHAT.servidor) {
    const hist = CHAT.turnos.filter((t) => t !== resp && !t.erro && !t.pensando).slice(-12);
    try {
      resp.content = (await perguntarServidor(hist, resp, ctl.signal)) || 'Sem resposta.';
    } catch (e) {
      resp.pensando = false;
      if (e && e.name === 'AbortError') resp.content = resp.content || 'Parado.';
      else if (e && e.code === 'login') { resp.erro = true; resp.content = 'Sua sessão expirou. Entre de novo.'; }
      else if (e && e.code === 'servidor') { resp.erro = true; resp.content = e.message; }
      else { resp.erro = true; resp.content = (resp.content ? resp.content + '\n\n' : '') + 'Sem conexão. Envie de novo quando a internet voltar.'; }
    }
  } else if (!CHAT.sample) {
    resp.pensando = false; resp.erro = true;
    resp.content = CHAT.sample === undefined ? 'Conectando ao Claude. Tente de novo em alguns segundos.' : 'Aqui ainda não tem IA ligada. Publique na Vercel com uma chave de IA (veja docs/DEPLOY.md).';
  } else {
    // conversa curta: instruções + dados sempre na frente, e as últimas trocas
    const hist = CHAT.turnos.filter((t) => t !== resp && !t.erro && !t.pensando).slice(-12);
    try {
      const { text } = await CHAT.sample([{ role: 'user', content: promptIA() }, ...hist], {
        cache: false, modelTier: 'quick', signal: ctl.signal,
        onText: ({ text: tx }) => { resp.pensando = false; resp.content = tx; atualizarUltima(); }
      });
      resp.content = text;
    } catch (e) {
      resp.pensando = false;
      if (e && e.code === 'cancelled') resp.content = (e.text || '') || 'Parado.';
      else { resp.erro = true; resp.content = (e && e.text ? e.text + '\n\n' : '') + erroIA(e && e.code); }
    }
  }
  resp.pensando = false;
  CHAT.enviando = null;
  S.chat = CHAT.turnos.filter((t) => !t.pensando).slice(-40);
  salvar();
  renderChatMsgs(); renderChatBarra();
}

// Abre/fecha com animação. Arrastar o botão central para cima abre seguindo o dedo.
function montarChat() {
  if ($('#chat')) return $('#chat');
  const ov = document.createElement('div');
  ov.id = 'chat';
  ov.className = 'chat-ov';
  ov.innerHTML = chatHtml();
  document.body.appendChild(ov);
  renderChatMsgs(); renderChatBarra(); renderChatCabecalho();
  ov.addEventListener('click', (e) => {
    const a = e.target.closest('[data-chat]'); if (!a) return;
    const k = a.dataset.chat;
    if (k === 'fechar') fecharChat();
    else if (k === 'enviar') enviarChat($('#chat-in').value);
    else if (k === 'parar') { if (CHAT.enviando) CHAT.enviando.abort(); }
    else if (k === 'sug') enviarChat(a.textContent);
    else if (k === 'limpar') { if (CHAT.enviando) CHAT.enviando.abort(); CHAT.turnos = []; S.chat = []; salvar(); renderChatMsgs(); }
    else if (k === 'mic') {
      const d = CHAT.dictation; if (!d) return;
      if (a.classList.contains('ouvindo')) { d.stop().catch(() => {}); return; }
      CHAT.base = $('#chat-in').value.trim();
      d.start().catch((err) => { if (err && err.code === 'not_granted') { CHAT.dictation = null; renderChatBarra(); } });
    }
  });
  // arrastar o cabeçalho para baixo fecha
  const head = ov.querySelector('[data-chat="arrasto"]');
  let y0 = null;
  head.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; y0 = e.clientY; ov.classList.add('arrastando'); head.setPointerCapture(e.pointerId); });
  head.addEventListener('pointermove', (e) => { if (y0 === null) return; posChat(Math.max(0, e.clientY - y0) / ov.querySelector('.chat').offsetHeight); });
  const solta = (e) => {
    if (y0 === null) return;
    const dy = e.clientY - y0; y0 = null; ov.classList.remove('arrastando');
    if (dy > 90) fecharChat(); else posChat(0);
  };
  head.addEventListener('pointerup', solta); head.addEventListener('pointercancel', solta);
  return ov;
}
// p = 0 aberto, 1 fechado
function posChat(p) {
  const ov = $('#chat'); if (!ov) return;
  ov.querySelector('.chat').style.transform = `translateY(${(p * 100).toFixed(2)}%)`;
  ov.querySelector('.chat-back').style.opacity = String(1 - p);
}
function abrirChat() {
  const ov = montarChat();
  ov.classList.add('on');
  document.body.classList.add('chat-aberto');
  requestAnimationFrame(() => { posChat(0); });
  if (navigator.vibrate) navigator.vibrate(12);
}
function fecharChat() {
  const ov = $('#chat'); if (!ov) return;
  if (document.activeElement) document.activeElement.blur();
  posChat(1);
  document.body.classList.remove('chat-aberto');
  setTimeout(() => { if (!document.body.classList.contains('chat-aberto')) ov.classList.remove('on'); }, 280);
}

function montarBotaoIA() {
  const b = $('#nav-ia'); if (!b) return;
  let y0 = null, p = 1;
  b.addEventListener('pointerdown', (e) => {
    y0 = e.clientY; p = 1;
    b.setPointerCapture(e.pointerId);
    const ov = montarChat();
    ov.classList.add('on', 'arrastando');
    posChat(1);
  });
  b.addEventListener('pointermove', (e) => {
    if (y0 === null) return;
    const dy = y0 - e.clientY;
    p = 1 - Math.max(0, Math.min(1, dy / 260));
    posChat(p);
  });
  const solta = (e) => {
    if (y0 === null) return;
    const dy = y0 - e.clientY; y0 = null;
    $('#chat').classList.remove('arrastando');
    if (Math.abs(dy) < 8 || p < 0.75) abrirChat(); // toque simples ou arrasto para cima
    else fecharChat();
  };
  b.addEventListener('pointerup', solta);
  b.addEventListener('pointercancel', solta);
  b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirChat(); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('chat-aberto')) fecharChat(); });
}

/* ---------------------------------------------------------
   13. Ações (cliques com data-a)
   --------------------------------------------------------- */
const acoes = {
  ir(el) { UI.aba = el.dataset.aba; render(); window.scrollTo(0, 0); },
  periodo(el) { S.sim.periodo = el.dataset.p; UI.periodoAba = null; salvar(); render(); },
  abaPeriodo(el) { UI.periodoAba = el.dataset.p; render(); },
  frase() { UI.fraseAberta = !UI.fraseAberta; render(); },
  tarefa(el) { abrirTarefa(el.dataset.h, Number(el.dataset.i)); },
  fastfood() { abrirFastFood(); },
  novoBonus() { abrirNovoBonus(); },
  usarSantos() { abrirUsarSantos(); },

  proximoDia() {
    if (S.treinoAtivo) return toast('Finalize ou cancele o treino antes');
    const r = fecharDia();
    fila.push(() => modalResumoDia(r));
    if (r.quinzena) { fila.push(() => modalPagamento(r.quinzena, r.novaQuinzena)); fila.push(() => abrirFixosFolha()); }
    if (r.subidas.length) fila.push(() => modalNivel(r.subidas));
    render(); rodarFila();
  },
  pular7() {
    if (S.treinoAtivo) return toast('Finalize ou cancele o treino antes');
    const xp0 = xpTotal(), t0 = S.treinos.length;
    const r = { bons: 0, xp: 0, treinos: 0, ff: 0, msgs: [] };
    const subidas = [];
    let ultimaQ = null;
    for (let k = 0; k < 7; k++) {
      preencherAleatorio();
      r.ff += diaLer(S.sim.data).fastfood.length;
      const d = fecharDia();
      if (d.bom) r.bons++;
      subidas.push(...d.subidas);
      if (d.quinzena) { ultimaQ = d; r.msgs.push(`Quinzena fechada: ${brl(d.quinzena.liberado)} liberados, ${brl(d.quinzena.travadoPassa)} passaram travados`); }
      // os baús de nível que saem no meio do pulo são somados na tela de nível
    }
    r.xp = xpTotal() - xp0;
    r.treinos = S.treinos.length - t0;
    fila.push(() => modalPulo(r));
    if (ultimaQ) { fila.push(() => modalPagamento(ultimaQ.quinzena, ultimaQ.novaQuinzena)); fila.push(() => abrirFixosFolha()); }
    if (subidas.length) fila.push(() => modalNivel(subidas));
    render(); rodarFila();
  },
  reset() {
    confirmar('Resetar tudo? Apaga hábitos, treinos, grana e ajustes deste aparelho.', 'Resetar', () => {
      UI.aba = 'hoje'; UI.descanso = null;
      recomecar(true, false); render(); window.scrollTo(0, 0);
      toast('Tudo zerado. Começando em 15/12/2026.');
    });
  },
  comecarDeVerdade() {
    confirmar('Começar de verdade hoje? Apaga os dados de teste e mantém seus ajustes (hábitos, orçamento, frases).', 'Começar', () => {
      UI.aba = 'hoje'; recomecar(false, true); render(); window.scrollTo(0, 0); toast('Valendo! Começou hoje.');
    });
  },
  abrirModoTeste() {
    confirmar('Abrir o modo teste? Apaga seus dados reais e começa a simulação em 15/12/2026. Os ajustes ficam.', 'Apagar e testar', () => {
      UI.aba = 'hoje'; recomecar(true, true); render(); window.scrollTo(0, 0);
    });
  },
  sair() { fetch('/api/logout', { method: 'POST' }).finally(() => { try { localStorage.removeItem(CHAVE); localStorage.removeItem(CHAVE_V); localStorage.removeItem(CHAVE_P); } catch (e) { /* ignora */ } location.reload(); }); },
  iaProvedor(el) { S.config.iaProvedor = el.dataset.id || null; salvar(); render(); },

  // treino
  iniciarTreino(el) { iniciarTreino(el.dataset.t); render(); window.scrollTo(0, 0); },
  cancelarTreino() { confirmar('Cancelar este treino? Nada será salvo.', 'Cancelar treino', () => { S.treinoAtivo = null; UI.descanso = null; salvar(); render(); }); },
  finalizarTreino() {
    const t = S.treinoAtivo;
    const tt = TIPOS_TREINO.find((x) => x.id === t.tipo) || {};
    if (!tt.cardio && !t.exercicios.some((e) => e.series.some((s) => s.feito))) return toast('Marque pelo menos uma série feita');
    abrirFinalizar();
  },
  serie(el) {
    const s = S.treinoAtivo.exercicios[el.dataset.e].series[el.dataset.s];
    s.feito = !s.feito;
    salvar(); render();
    if (s.feito) iniciarDescanso(UI.ultimoDescanso || 90);
  },
  addSerie(el) {
    const e = S.treinoAtivo.exercicios[el.dataset.e];
    const u = e.series[e.series.length - 1] || { kg: 0, reps: 10 };
    e.series.push({ kg: u.kg, reps: u.reps, feito: false });
    salvar(); render();
  },
  descanso(el) { UI.ultimoDescanso = Number(el.dataset.seg); render(); iniciarDescanso(UI.ultimoDescanso); },
  maisDescanso() { if (UI.descanso) { UI.descanso.fim += 15000; UI.descanso.total += 15; renderDescanso(); } },
  pularDescanso() { UI.descanso = null; renderDescanso(); },
  exercicio(el) { UI.exercicio = el.dataset.n; render(); },

  // grana
  sacar() { abrirSacar(); },
  gasto() { abrirGasto(); },
  apagarGasto(el) { S.quinzena.gastos = S.quinzena.gastos.filter((g) => g.id !== el.dataset.id); salvar(); render(); },
  pagarFixo(el) { const f = S.quinzena.fixos[el.dataset.k]; f.pago = !f.pago; salvar(); render(); atualizarFixos(); },
  granaAba(el) { UI.granaAba = el.dataset.k; render(); },
  histTudo() { UI.histTudo = !UI.histTudo; render(); },
  abrirFixos() { abrirFixosFolha(); },
  confirmarFixos() { S.quinzena.fixosOk = true; salvar(); fecharFolha(); render(); toast('Fixos da quinzena registrados'); },
  qAddFixo() { const q = S.quinzena; mudarQuinzena(q, () => q.fixos.push({ id: 'f_' + uid(), nome: 'Novo fixo', valor: 0, pago: false })); render(); atualizarFixos(); },
  qRemFixo(el) { const q = S.quinzena; mudarQuinzena(q, () => q.fixos.splice(Number(el.dataset.i), 1)); render(); atualizarFixos(); },
  fixosPadrao() {
    const q = S.quinzena;
    S.config.orcamento['d' + q.tipo] = { entrada: q.entrada, fixos: q.fixos.map(({ pago, ...f }) => ({ ...f })) };
    salvar(); toast(`Padrão das quinzenas do dia ${q.tipo} atualizado`);
  },

  // ajustes
  editarHabito(el) { abrirEditarHabito(el.dataset.h); },
  editarFrase(el) { abrirEditarFrase(Number(el.dataset.i)); },
  addFixo(el) { S.config.orcamento[el.dataset.k].fixos.push({ id: 'f_' + uid(), nome: 'Novo fixo', valor: 0 }); salvar(); render(); },
  removerFixo(el) { S.config.orcamento[el.dataset.k].fixos.splice(Number(el.dataset.i), 1); salvar(); render(); }
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]');
  if (!el || el.tagName === 'INPUT' && el.type !== 'checkbox') return;
  const fn = acoes[el.dataset.a];
  if (fn) fn(el, e);
});

// Inputs: séries do treino, campos de cardio, ajustes e orçamento (salvam sem redesenhar)
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.serie) {
    const [ei, si, k] = el.dataset.serie.split('|');
    S.treinoAtivo.exercicios[ei].series[si][k] = Math.max(0, Number(String(el.value).replace(',', '.')) || 0);
    salvar(); // sem render: mantém o foco no próximo campo
  } else if (el.dataset.campo && S.treinoAtivo) {
    S.treinoAtivo[el.dataset.campo] = el.value; salvar();
  } else if (el.dataset.cfg) {
    const path = el.dataset.cfg.split('.');
    let o = S.config;
    while (path.length > 1) o = o[path.shift()];
    o[path[0]] = el.dataset.num !== undefined ? Math.max(0, Number(el.value) || 0) : el.value;
    if (['garrafaMl', 'metaAguaMl'].includes(path[0])) reconstruirAgua();
    if (el.dataset.cfg.startsWith('delivery')) calcularPotes(S.quinzena);
    salvar(); render();
  } else if (el.dataset.orc) {
    const [k, a, b] = el.dataset.orc.split('|');
    const o = S.config.orcamento[k];
    if (a === 'entrada') o.entrada = Math.max(0, Number(el.value) || 0);
    else o.fixos[a][b] = b === 'valor' ? Math.max(0, Number(el.value) || 0) : el.value;
    salvar(); render();
  } else if (el.dataset.qf) {
    // fixos da quinzena atual (Grana › Fixos): salva sem redesenhar para não perder o foco
    const q = S.quinzena, [a, b] = el.dataset.qf.split('|');
    mudarQuinzena(q, () => {
      if (a === 'entrada') q.entrada = Math.max(0, Number(el.value) || 0);
      else q.fixos[a][b] = b === 'valor' ? Math.max(0, Number(el.value) || 0) : el.value;
    });
    document.querySelectorAll('[data-livre]').forEach((x) => { x.textContent = brl(q.livre); });
  }
});

/* ---------------------------------------------------------
   14. Relógio (cronômetro e descanso)
   --------------------------------------------------------- */
setInterval(() => {
  if (S && UI.aba === 'treino' && S.treinoAtivo) {
    const c = $('#crono');
    if (c) c.textContent = fmtTempo(Date.now() - S.treinoAtivo.inicio);
    if (UI.descanso) {
      if (UI.descanso.fim <= Date.now() && !UI.descanso.avisou) {
        UI.descanso.avisou = true;
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
      renderDescanso();
    }
  }
}, 500);


/* ---------------------------------------------------------
   15. Nuvem (Vercel + Supabase)
   Na Vercel o app guarda tudo no Supabase por /api/state, com uma cópia
   no aparelho para abrir na hora e funcionar sem internet.
   Abrindo o arquivo direto ou no claude.ai, fica só no aparelho.
   --------------------------------------------------------- */
const CHAVE_V = 'lifemaxxing_versao';    // versão do banco que o aparelho conhece
const CHAVE_P = 'lifemaxxing_pendente';  // há mudanças ainda não enviadas
const NUVEM = { ativo: false, versao: 0, pendente: false, timer: null, enviando: false };
const ls = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignora */ } },
  del: (k) => { try { localStorage.removeItem(k); } catch (e) { /* ignora */ } }
};
const podeTerServidor = () => location.protocol.startsWith('http') && !window.claude;

function marcarPendente() {
  NUVEM.pendente = true;
  ls.set(CHAVE_P, '1');
  clearTimeout(NUVEM.timer);
  NUVEM.timer = setTimeout(enviarAgora, 1200);
}

async function enviarAgora() {
  if (!NUVEM.ativo || NUVEM.enviando || !NUVEM.pendente) return;
  NUVEM.enviando = true;
  NUVEM.pendente = false;
  try {
    const r = await fetch('/api/state', {
      method: 'PUT', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dados: S, versao: NUVEM.versao })
    });
    if (r.ok) {
      NUVEM.versao = (await r.json()).versao;
      ls.set(CHAVE_V, String(NUVEM.versao));
      if (!NUVEM.pendente) ls.del(CHAVE_P);
    } else if (r.status === 409) {
      // outro aparelho salvou antes: fica a versão do banco
      const j = await r.json();
      S = j.dados; migrar(); NUVEM.versao = j.versao; NUVEM.pendente = false;
      ls.set(CHAVE_V, String(j.versao)); ls.del(CHAVE_P);
      salvarLocal(); CHAT.turnos = Array.isArray(S.chat) ? S.chat : [];
      render(); toast('Atualizado com os dados do outro aparelho');
    } else if (r.status === 401) {
      NUVEM.pendente = true; telaLogin();
    } else {
      NUVEM.pendente = true;
    }
  } catch (e) {
    NUVEM.pendente = true; // sem internet: tenta de novo depois
  }
  NUVEM.enviando = false;
  if (NUVEM.pendente) { clearTimeout(NUVEM.timer); NUVEM.timer = setTimeout(enviarAgora, 15000); }
}

// Consulta o servidor. Devolve 'local' (sem servidor), 'login', 'ok' ou 'offline'.
async function conectarNuvem() {
  if (!podeTerServidor()) return 'local';
  let r;
  try { r = await fetch('/api/state', { credentials: 'same-origin', cache: 'no-store' }); }
  catch (e) { return ls.get('lifemaxxing_nuvem') ? 'offline' : 'local'; }
  if (r.status === 401) return 'login';
  const tipo = r.headers.get('content-type') || '';
  if (r.status === 404 || !tipo.includes('json')) return 'local'; // hospedagem sem /api
  if (!r.ok) {
    let j = {}; try { j = await r.json(); } catch (e) { /* ignora */ }
    toast(j.erro ? 'Servidor: ' + j.erro : 'Servidor fora do ar. Usando os dados do aparelho.');
    return ls.get('lifemaxxing_nuvem') ? 'offline' : 'local';
  }
  const j = await r.json();
  NUVEM.ativo = true;
  ls.set('lifemaxxing_nuvem', '1');
  const vLocal = Number(ls.get(CHAVE_V) || 0), pendente = ls.get(CHAVE_P) === '1';
  if (!j.dados) {
    // banco vazio: começa valendo hoje (mantém ajustes de um teste anterior, se houver)
    recomecarDaNuvem();
  } else if (pendente && S && vLocal === j.versao) {
    NUVEM.versao = j.versao; marcarPendente(); // o aparelho tem mudanças novas em cima da mesma versão
  } else {
    S = j.dados; NUVEM.versao = j.versao;
    ls.set(CHAVE_V, String(j.versao)); ls.del(CHAVE_P);
    salvarLocal();
  }
  return 'ok';
}
function recomecarDaNuvem() {
  const manter = !!S;
  recomecar(false, manter);
  NUVEM.versao = 0;
  marcarPendente();
}

// Tela de login (senha definida em APP_PASSWORD na Vercel)
function telaLogin(erro) {
  document.body.classList.add('login');
  $('#simbar').innerHTML = '';
  $('#view').innerHTML = `
    <div class="login-box">
      <div class="login-logo">${ic('wave')}</div>
      <h1>Lifemaxxing</h1>
      <p>Entre com a sua senha.</p>
      <form id="f-login" autocomplete="on">
        <input type="password" id="senha" name="password" autocomplete="current-password" placeholder="Senha" required>
        <button class="btn" type="submit">Entrar</button>
        <p class="login-erro" role="alert">${erro ? esc(erro) : ''}</p>
      </form>
    </div>`;
  $('#f-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true; btn.textContent = 'Entrando...';
    try {
      const r = await fetch('/api/login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senha: $('#senha').value }) });
      if (r.ok) { document.body.classList.remove('login'); iniciar(); return; }
      const j = await r.json().catch(() => ({}));
      telaLogin(j.erro || 'Não deu para entrar');
    } catch (err) { telaLogin('Sem internet'); }
  });
  setTimeout(() => { const s = $('#senha'); if (s) s.focus(); }, 50);
}

/* ---------------------------------------------------------
   16. Relógio real (fora do modo teste)
   Fecha os dias que passaram, acompanha manhã/tarde/noite.
   --------------------------------------------------------- */
function sincronizarRelogio() {
  if (!S || S.sim.teste) return false;
  let mudou = false;
  const hoje = hojeReal();
  if (S.sim.data < hoje) {
    const res = [];
    while (S.sim.data < hoje && res.length < 400) res.push(fecharDia());
    const ultimo = res[res.length - 1];
    if (res.length === 1) fila.push(() => modalResumoDia(ultimo));
    else {
      const xp = soma(res.map((r) => r.xp));
      fila.push(() => modalPulo({ titulo: `Você ficou ${res.length} dias sem abrir`, dias: res.length, bons: res.filter((r) => r.bom).length, xp, treinos: 0, ff: 0, msgs: res.flatMap((r) => r.msgs).slice(-4) }));
    }
    const q = [...res].reverse().find((r) => r.quinzena);
    if (q) { fila.push(() => modalPagamento(q.quinzena, q.novaQuinzena)); fila.push(() => abrirFixosFolha()); }
    const sub = res.flatMap((r) => r.subidas);
    if (sub.length) fila.push(() => modalNivel(sub));
    mudou = true;
  }
  const p = periodoReal();
  if (S.sim.periodo !== p) { S.sim.periodo = p; UI.periodoAba = null; mudou = true; }
  if (mudou) salvar();
  return mudou;
}
function telaLivre() { return !$('#folha') && !modalAberto && !document.body.classList.contains('chat-aberto') && !document.body.classList.contains('login'); }

/* ---------------------------------------------------------
   17. Início
   --------------------------------------------------------- */
// Atualiza dados salvos por versões antigas
function migrar() {
  if (!S) return;
  const renomear = (f) => { if (f && f.nome === 'Caixa de Santos') f.nome = 'Caixa de viagem'; };
  Object.values(S.config.orcamento || {}).forEach((o) => (o.fixos || []).forEach(renomear));
  if (S.quinzena) (S.quinzena.fixos || []).forEach(renomear);
  if (!S.config.metaXpQuinzena) S.config.metaXpQuinzena = 2700;
  if (!S.santosUsos) S.santosUsos = [];
}

let jaMontou = false;
function posCarregar() {
  migrar();
  sincronizarRelogio();
  render();
  if (!jaMontou) { montarBotaoIA(); jaMontou = true; }
  iniciarIA();
  rodarFila();
}

async function iniciar() {
  const temCache = lerLocal();
  if (!podeTerServidor()) { if (!temCache) recomecar(true, false); posCarregar(); return; }
  // Na web: mostra o que está no aparelho na hora e confere o servidor em seguida
  if (temCache) posCarregar(); else $('#view').innerHTML = '<div class="splash">' + ic('wave') + '</div>';
  const modo = await conectarNuvem();
  if (modo === 'login') return telaLogin();
  if (modo === 'offline') NUVEM.ativo = true;
  if (!S) recomecar(modo === 'local', false);
  posCarregar();
}
iniciar();

// Volta ao app: confere a data, o período e envia o que ficou pendente
document.addEventListener('visibilitychange', () => {
  if (!S) return;
  if (document.visibilityState === 'hidden') { enviarAgora(); return; }
  if (sincronizarRelogio() && telaLivre()) { render(); rodarFila(); }
  // busca mudanças feitas em outro aparelho (só com a tela livre, para não trocar dados no meio de um registro)
  if (NUVEM.ativo && !NUVEM.pendente && telaLivre()) conectarNuvem().then((m) => { if (m === 'ok' && telaLivre()) { CHAT.turnos = Array.isArray(S.chat) ? S.chat : []; render(); } });
});
setInterval(() => { if (S && sincronizarRelogio() && telaLivre()) { render(); rodarFila(); } }, 60000);
window.addEventListener('online', () => { if (NUVEM.pendente) enviarAgora(); });

// Service worker só funciona em http(s) (na Vercel). Abrindo o arquivo direto, é ignorado.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
