/* =========================================================
   Lifemaxxing — animações (Motion · motion.dev)
   Toda animação do app passa por aqui. Sem a Motion, ou com
   "reduzir movimento" ligado no aparelho, o app funciona igual,
   só sem animar (cada função devolve false e o app segue).
   ========================================================= */
'use strict';

const FX = (() => {
  const M = window.Motion || null;
  const menosMovimento = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const ativo = !!(M && M.animate) && !menosMovimento;

  // Molas: rápidas e sem enrolar. A "física" é o que dá a sensação de app.
  const MOLA = { type: 'spring', stiffness: 520, damping: 34 };        // UI em geral
  const MOLA_SUAVE = { type: 'spring', stiffness: 280, damping: 30 };  // telas, listas, barras
  const MOLA_PULO = { type: 'spring', stiffness: 620, damping: 13 };   // conquistas (pop)
  const MOLA_FOLHA = { type: 'spring', stiffness: 420, damping: 38 };  // folhas que sobem
  const SAIDA = [0.16, 1, 0.3, 1];                                      // ease-out longo
  const CORES = ['#1756C8', '#3B7BF2', '#6FA0FF', '#0A0E17', '#BFD3FA'];

  const rnd = (a, b) => a + Math.random() * (b - a);
  const vazio = (el) => !el || (el.length !== undefined && el.length === 0);
  function anim(el, kf, op) {
    if (!ativo || vazio(el)) return null;
    try { return M.animate(el, kf, op); } catch (e) { return null; }
  }
  const fim = (a) => (a && a.finished ? a.finished.then(() => {}, () => {}) : Promise.resolve());
  const vibrar = (p) => { if (navigator.vibrate) navigator.vibrate(p); };

  // Segura a fila de modais enquanto uma celebração está na tela
  let ocupadoAte = 0;
  const segurar = (ms) => { ocupadoAte = Math.max(ocupadoAte, Date.now() + ms); };
  const espera = () => Math.max(0, ocupadoAte - Date.now());

  // Camada fixa para partículas e fichas voando
  let camada = null;
  function layer() {
    if (!camada || !camada.isConnected) {
      camada = document.createElement('div');
      camada.className = 'fx-camada';
      document.body.appendChild(camada);
    }
    return camada;
  }

  // Número que sobe (ou desce) até o valor final
  function contar(el, de, ate, formato, duracao = 0.9) {
    if (!el) return;
    if (!ativo || de === ate) { el.textContent = formato(ate); return; }
    el.textContent = formato(de);
    M.animate(de, ate, { duration: duracao, ease: SAIDA, onUpdate: (v) => { el.textContent = formato(v); } });
  }

  // Confete nas cores do app
  function confete(x, y, n = 28, forca = 160) {
    if (!ativo) return;
    const L = layer();
    for (let k = 0; k < n; k++) {
      const p = document.createElement('i');
      const w = rnd(5, 9);
      p.className = 'fx-conf' + (Math.random() < 0.35 ? ' redondo' : '');
      p.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${(w * rnd(1, 1.9)).toFixed(1)}px;background:${CORES[k % CORES.length]}`;
      L.appendChild(p);
      const ang = rnd(0, Math.PI * 2), dist = rnd(forca * 0.35, forca);
      const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist * 0.8 - rnd(40, 110);
      fim(anim(p, {
        x: [0, dx, dx * 1.15], y: [0, dy, dy + rnd(140, 240)],
        rotate: [0, rnd(-420, 420)], scale: [0.3, 1, 0.8], opacity: [1, 1, 0]
      }, { duration: rnd(1.1, 1.7), ease: [0.2, 0.7, 0.3, 1] })).then(() => p.remove());
    }
  }

  // Moedas "R$" subindo (dinheiro liberado ou sacado)
  function moedas(x, y, n = 9) {
    if (!ativo) return;
    const L = layer();
    for (let k = 0; k < n; k++) {
      const c = document.createElement('span');
      c.className = 'fx-moeda';
      c.textContent = 'R$';
      c.style.left = `${x}px`; c.style.top = `${y}px`;
      L.appendChild(c);
      const dx = rnd(-120, 120), dy = rnd(-220, -110);
      fim(anim(c, { x: [0, dx], y: [0, dy, dy + 40], scale: [0.2, 1.1, 0.9], rotate: [0, rnd(-30, 30)], opacity: [0, 1, 0] },
        { duration: rnd(0.9, 1.4), delay: k * 0.04, ease: SAIDA })).then(() => c.remove());
    }
  }

  const centro = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

  /* ---------- Telas ---------- */

  // Entrada ao trocar de aba: blocos em cascata e progresso enchendo
  function entrarTela(view) {
    if (!ativo) return false;
    const blocos = [...view.children].slice(0, 9);
    anim(blocos, { opacity: [0, 1], y: [16, 0] }, { ...MOLA_SUAVE, delay: M.stagger(0.04) });
    lista(view.querySelector('.tasks'), 0.12);
    progresso(view);
    return true;
  }

  // Linhas de uma lista entrando uma depois da outra
  function lista(box, inicio = 0) {
    if (!ativo || !box) return;
    const itens = [...box.children].slice(0, 12);
    anim(itens, { opacity: [0, 1], x: [-12, 0] }, { ...MOLA_SUAVE, delay: M.stagger(0.035, { startDelay: inicio }) });
  }

  // Tudo que é progresso cresce do zero: barras, metas, mapa, caminho, calendário, gráfico
  function progresso(view) {
    if (!ativo) return;
    view.querySelectorAll('.bar i, .desc-bar i, .tab-bar span').forEach((b) => {
      const w = b.style.width;
      if (w && parseFloat(w) > 0) anim(b, { width: ['0%', w] }, { ...MOLA_SUAVE, delay: 0.18 });
    });
    anim(view.querySelectorAll('.segs i.on'), { scaleX: [0, 1] }, { ...MOLA_SUAVE, delay: M.stagger(0.08, { startDelay: 0.2 }) });
    anim(view.querySelectorAll('.goodday .dot.on'), { scale: [0.5, 1] }, { ...MOLA_PULO, delay: M.stagger(0.05, { startDelay: 0.15 }) });
    anim(view.querySelectorAll('.wk i'), { scale: [0, 1] }, { ...MOLA_PULO, delay: M.stagger(0.05, { startDelay: 0.15 }) });
    anim(view.querySelectorAll('.map-row:not(.head) i'), { opacity: [0, 1], scale: [0.4, 1] }, { ...MOLA_SUAVE, delay: M.stagger(0.004, { startDelay: 0.2 }) });
    anim(view.querySelectorAll('.path'), { opacity: [0, 1], x: [-16, 0] }, { ...MOLA_SUAVE, delay: M.stagger(0.045, { startDelay: 0.15 }) });
    anim(view.querySelectorAll('.cal-d.on'), { scale: [0, 1] }, { ...MOLA_PULO, delay: M.stagger(0.04, { startDelay: 0.2 }) });
    anim(view.querySelectorAll('.pote .bar i'), { opacity: [0.4, 1] }, { duration: 0.6 });
    // gráfico de carga: a linha se desenha
    view.querySelectorAll('.chart .line').forEach((l) => {
      try {
        const len = l.getTotalLength();
        l.style.strokeDasharray = `${len}`;
        anim(l, { strokeDashoffset: [len, 0] }, { duration: 0.9, ease: SAIDA, delay: 0.2 });
      } catch (e) { /* sem SVG */ }
    });
    anim(view.querySelectorAll('.chart .pt'), { scale: [0, 1] }, { ...MOLA_PULO, delay: M.stagger(0.05, { startDelay: 0.5 }) });
    // dinheiro: valores grandes sobem do zero
    view.querySelectorAll('[data-contar]').forEach((el) => {
      const alvo = Number(el.dataset.contar);
      if (alvo > 0 && FX.formatoDinheiro) contar(el, 0, alvo, FX.formatoDinheiro, 1);
    });
  }

  // Pílula azul do menu deslizando para a aba ativa
  function nav(primeira) {
    const navEl = document.querySelector('.nav');
    if (!navEl) return;
    let ind = navEl.querySelector('.nav-ind');
    if (!ind) { ind = document.createElement('span'); ind.className = 'nav-ind'; navEl.prepend(ind); }
    const btn = navEl.querySelector('button.on');
    if (!btn) { ind.style.opacity = '0'; return; }
    const x = btn.offsetLeft + btn.offsetWidth / 2 - ind.offsetWidth / 2;
    if (!ativo || primeira) { ind.style.transform = `translateX(${x}px)`; ind.style.opacity = '1'; return; }
    anim(ind, { x, opacity: 1 }, MOLA);
  }

  // Chama da sequência tremulando
  function chama() {
    const f = document.querySelector('.streak.on .ic');
    anim(f, { scale: [1, 1.14, 0.96, 1.08, 1], rotate: [0, -7, 5, -3, 0] }, { duration: 2.2, repeat: Infinity, ease: 'easeInOut' });
  }

  // Toque: afunda e volta com mola
  function montarToque() {
    if (!ativo) return;
    const alvo = '.task, .btn:not([disabled]), .chip, .type, .dotw.treino, .banner, .fixo, .icon-btn, .tabs button, .seg button, .lv-chest, .santos-usar, .set-ok, .quote';
    document.addEventListener('pointerdown', (e) => {
      const el = e.target.closest(alvo);
      if (!el) return;
      anim(el, { scale: 0.96 }, { type: 'spring', stiffness: 900, damping: 40 });
      const solta = () => {
        anim(el, { scale: 1 }, MOLA_PULO);
        window.removeEventListener('pointerup', solta);
        window.removeEventListener('pointercancel', solta);
      };
      window.addEventListener('pointerup', solta);
      window.addEventListener('pointercancel', solta);
    }, { passive: true });
  }

  /* ---------- Conquistas ---------- */

  // Ficha "+N XP" voando da tarefa até a barra de nível
  function voarXp(origem, ganho) {
    const bar = document.getElementById('xpbar');
    const L = layer();
    const chip = document.createElement('div');
    chip.className = 'fx-xp';
    chip.textContent = `+${ganho} XP`;
    L.appendChild(chip);
    const x0 = origem ? origem.right - 70 : innerWidth / 2 - 30;
    const y0 = origem ? origem.top + origem.height / 2 - 14 : innerHeight / 2;
    let x1 = x0, y1 = 24;
    if (bar) { const t = bar.getBoundingClientRect(); x1 = t.left + t.width - 40; y1 = Math.max(16, t.top - 22); }
    chip.style.left = `${x0}px`; chip.style.top = `${y0}px`;
    const dx = x1 - x0, dy = y1 - y0;
    return fim(anim(chip, {
      x: [0, dx * 0.15, dx], y: [0, -46, dy],
      scale: [0.5, 1.2, 0.75], opacity: [0, 1, 1, 0]
    }, { duration: 0.85, ease: [0.45, 0, 0.2, 1] })).then(() => chip.remove());
  }

  // Barra de XP enchendo com mola; se passou de nível, enche até o fim e recomeça
  function encherBarra(antes, depois, formato) {
    const bar = document.getElementById('xpbar');
    const numEl = document.getElementById('xpnum');
    if (!bar) return;
    const alvo = `${depois.pct.toFixed(1)}%`;
    if (antes.chave === depois.chave) {
      anim(bar, { width: [`${antes.pct.toFixed(1)}%`, alvo] }, MOLA_SUAVE);
      contar(numEl, antes.atual, depois.atual, (v) => formato(v, depois.falta), 0.7);
    } else {
      fim(anim(bar, { width: [`${antes.pct.toFixed(1)}%`, '100%'] }, { duration: 0.45, ease: 'easeIn' })).then(() => {
        anim(bar, { width: ['0%', alvo] }, MOLA_SUAVE);
        contar(numEl, 0, depois.atual, (v) => formato(v, depois.falta), 0.7);
      });
    }
    anim(bar, { filter: ['brightness(1)', 'brightness(1.7)', 'brightness(1)'] }, { duration: 0.8, delay: 0.05 });
    anim(document.querySelector('.level'), { scale: [1, 1.025, 1] }, { ...MOLA_PULO, delay: 0.05 });
  }

  // Tarefa concluída: check com pulo, XP voando, barra enchendo, bolinha e dia bom
  function tarefaFeita(o) {
    if (!ativo) return false;
    const { h, i, origem, ganho, antes, depois, habitoCompletou, virouDiaBom, formatoXp } = o;
    const bar = document.getElementById('xpbar'), numEl = document.getElementById('xpnum');
    // segura a barra no valor antigo até a ficha chegar
    if (bar && ganho > 0) bar.style.width = `${antes.pct.toFixed(1)}%`;
    if (numEl && ganho > 0) numEl.textContent = formatoXp(antes.atual, antes.falta);
    const row = document.querySelector(`.task[data-h="${h}"][data-i="${i}"]`);
    if (row) {
      anim(row.querySelector('.task-ok'), { scale: [0, 1.3, 1], rotate: [-40, 0] }, MOLA_PULO);
      anim(row, { backgroundColor: ['#D3E2FC', '#F5F8FF'] }, { duration: 1, ease: SAIDA });
      anim(row.querySelector('.task-ic'), { scale: [1, 1.18, 1], rotate: [0, -8, 0] }, MOLA_PULO);
      anim(row.querySelectorAll('.task-seg i.on'), { scaleY: [1, 2, 1] }, { duration: 0.4, delay: M.stagger(0.05) });
    }
    segurar(1200);
    if (ganho > 0) voarXp(origem, ganho).then(() => encherBarra(antes, depois, formatoXp));
    if (habitoCompletou) bolinha(h);
    if (virouDiaBom) setTimeout(diaBom, 350);
    vibrar(12);
    return true;
  }

  // Bolinha do card Dia bom: pulo + anel
  function bolinha(hid) {
    const w = document.querySelector(`.dotw[data-h="${hid}"]`);
    if (!w) return;
    const dot = w.querySelector('.dot');
    anim(dot, { scale: [0.7, 1.28, 1] }, MOLA_PULO);
    const anel = document.createElement('span');
    anel.className = 'fx-anel';
    w.appendChild(anel);
    fim(anim(anel, { scale: [0.6, 2.1], opacity: [0.7, 0] }, { duration: 0.7, ease: SAIDA })).then(() => anel.remove());
    anim(document.querySelector('.goodday h2'), { scale: [1, 1.22, 1] }, MOLA_PULO);
  }

  // Dia bom completo: card pula, bolinhas fazem onda, confete
  function diaBom() {
    const card = document.querySelector('.goodday');
    if (!card) return;
    segurar(1800);
    anim(card, { scale: [1, 1.035, 1] }, MOLA_PULO);
    anim(card.querySelectorAll('.dot.on'), { y: [0, -10, 0] }, { duration: 0.5, delay: M.stagger(0.06), ease: 'easeInOut' });
    anim(card.querySelector('.pill'), { scale: [0.6, 1.15, 1] }, { ...MOLA_PULO, delay: 0.2 });
    const c = centro(card);
    confete(c.x, c.y - 10, 46, 190);
    vibrar([20, 40, 20]);
  }

  /* ---------- Folhas e modais ---------- */

  function folhaAbrir(ov) {
    if (!ativo) return false;
    const sheet = ov.querySelector('.sheet');
    ov.classList.add('fx', 'on');
    sheet.style.transform = 'translateY(100%)';
    anim(ov, { opacity: [0, 1] }, { duration: 0.2 });
    anim(sheet, { y: ['100%', '0%'] }, MOLA_FOLHA);
    anim([...sheet.children].slice(1, 8), { opacity: [0, 1], y: [14, 0] }, { ...MOLA_SUAVE, delay: M.stagger(0.03, { startDelay: 0.06 }) });
    return true;
  }
  function folhaFechar(ov) {
    if (!ativo) return null;
    const sheet = ov.querySelector('.sheet');
    anim(ov, { opacity: 0 }, { duration: 0.22 });
    return fim(anim(sheet, { y: '100%' }, { duration: 0.24, ease: [0.4, 0, 1, 1] }));
  }

  function modalAbrir(ov) {
    if (!ativo) return false;
    ov.classList.add('fx', 'on');
    anim(ov, { opacity: [0, 1] }, { duration: 0.22 });
    const card = ov.querySelector('.modal-card');
    if (card) {
      anim(card, { scale: [0.86, 1], y: [24, 0], opacity: [0, 1] }, { type: 'spring', stiffness: 420, damping: 24 });
      anim([...card.children], { opacity: [0, 1], y: [10, 0] }, { ...MOLA_SUAVE, delay: M.stagger(0.04, { startDelay: 0.08 }) });
    }
    return true;
  }
  function modalFechar(ov) {
    if (!ativo) return null;
    const card = ov.querySelector('.modal-card, .levelup');
    if (card) anim(card, { scale: 0.94, opacity: 0 }, { duration: 0.18 });
    return fim(anim(ov, { opacity: 0 }, { duration: 0.2 }));
  }

  // Baú surpresa: balança, abre e mostra o valor subindo
  function bau(ov, valor) {
    if (!ativo) return;
    const ch = ov.querySelector('.chest-anim'), h2 = ov.querySelector('h2.big');
    ch.style.animation = 'none';
    fim(anim(ch, { rotate: [0, -12, 10, -8, 6, -3, 0], scale: [0.6, 1, 1.05, 1] }, { duration: 0.8, ease: 'easeInOut' })).then(() => {
      anim(ch, { scale: [1, 1.25, 1] }, MOLA_PULO);
      if (valor > 0) {
        const c = centro(ch);
        moedas(c.x - 10, c.y - 10, 10);
        confete(c.x, c.y, 24, 140);
        contar(h2, 0, valor, FX.formatoDinheiro, 0.8);
        vibrar([15, 30, 15]);
      } else {
        anim(h2, { opacity: [0, 1], y: [8, 0] }, MOLA);
      }
    });
    if (valor > 0 && FX.formatoDinheiro) h2.textContent = FX.formatoDinheiro(0);
  }

  // Subiu de nível: raios girando, número com pulo, confete; baú balança até tocar
  function nivel(ov) {
    if (!ativo) return;
    ov.classList.add('fx', 'on');
    anim(ov, { opacity: [0, 1] }, { duration: 0.25 });
    const box = ov.querySelector('.levelup');
    const raios = document.createElement('div');
    raios.className = 'lv-raios';
    box.prepend(raios);
    anim(raios, { rotate: [0, 360] }, { duration: 26, repeat: Infinity, ease: 'linear' });
    anim(raios, { opacity: [0, 1], scale: [0.6, 1] }, { duration: 0.8, ease: SAIDA });
    const num = box.querySelector('.lv-num');
    num.style.animation = 'none';
    anim(num, { scale: [0.2, 1.18, 1], opacity: [0, 1, 1] }, { duration: 0.8, ease: [0.2, 1.5, 0.4, 1], delay: 0.15 });
    anim([...box.children].filter((c) => !c.classList.contains('lv-num') && !c.classList.contains('glow') && !c.classList.contains('lv-raios')),
      { opacity: [0, 1], y: [18, 0] }, { ...MOLA_SUAVE, delay: M.stagger(0.07, { startDelay: 0.35 }) });
    setTimeout(() => { const c = centro(num); confete(c.x, c.y, 60, 230); vibrar([30, 50, 30]); }, 450);
    const ch = box.querySelector('.lv-chest .chest-anim');
    if (ch) { ch.style.animation = 'none'; FX._bauLoop = anim(ch, { rotate: [0, -9, 9, -6, 6, 0] }, { duration: 0.7, repeat: Infinity, repeatDelay: 0.9 }); }
  }
  function abrirBauNivel(ov, total) {
    if (!ativo) return;
    if (FX._bauLoop) { FX._bauLoop.stop(); FX._bauLoop = null; }
    const ch = ov.querySelector('.lv-chest .chest-anim');
    anim(ch, { scale: [1, 1.35, 1], rotate: 0 }, MOLA_PULO);
    const c = centro(ch);
    moedas(c.x, c.y, 12);
    confete(c.x, c.y, 30, 160);
    const b = ov.querySelector('.lv-chest-tx b');
    if (b && total > 0) contar(b, 0, total, (v) => '+' + FX.formatoDinheiro(v), 0.9);
    anim(ov.querySelector('.lv-saldo'), { opacity: [0, 1], y: [12, 0] }, { ...MOLA_SUAVE, delay: 0.2 });
  }

  // Treino concluído: XP sobe e, com recorde, confete
  function treinoFeito(ov, total, recordes) {
    if (!ativo) return;
    const el = ov.querySelector('.xp-total');
    contar(el, 0, total, (v) => `+${Math.round(v)} XP`, 1);
    anim(el, { scale: [0.7, 1.12, 1] }, { ...MOLA_PULO, delay: 0.2 });
    if (recordes > 0) setTimeout(() => { const c = centro(el); confete(c.x, c.y, 36, 170); }, 300);
  }

  // Série marcada: check com pulo; recorde ganha destaque
  function serie(btn, recorde) {
    if (!ativo || !btn) return;
    anim(btn, { scale: [0.6, 1.2, 1] }, MOLA_PULO);
    if (recorde) {
      const pill = btn.closest('.ex').querySelector('.pill');
      anim(pill, { scale: [0.4, 1.2, 1], rotate: [-10, 0] }, MOLA_PULO);
      const c = centro(btn);
      confete(c.x, c.y, 18, 110);
      vibrar([15, 30, 15]);
    }
  }

  // Saque: moedas saindo do botão
  function saque(valor) {
    if (!ativo) return;
    const btn = document.querySelector('.hero.money .btn');
    const big = document.querySelector('.hero.money .money-big');
    if (btn) { const c = centro(btn); moedas(c.x, c.y - 10, 14); }
    if (big) anim(big, { scale: [1, 1.08, 1] }, MOLA_PULO);
    vibrar([20, 40, 20]);
  }

  // Timer de descanso entrando
  function descanso(el) { anim(el, { y: [90, 0], opacity: [0, 1] }, MOLA); }

  return {
    ativo, anim, contar, confete, moedas, espera, segurar, formatoDinheiro: null,
    entrarTela, lista, progresso, nav, chama, montarToque,
    tarefaFeita, bolinha, diaBom, folhaAbrir, folhaFechar, modalAbrir, modalFechar,
    bau, nivel, abrirBauNivel, treinoFeito, serie, saque, descanso
  };
})();
