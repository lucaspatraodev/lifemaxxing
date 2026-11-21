/* =========================================================
   Lifemaxxing — logos do João Frango (traço laranja, fundo preto)
   5 opções. A escolhida fica em Ajustes › Logo (S.config.logo).
   Desenhos originais do galo surfista do app.
   ========================================================= */
'use strict';

const LOGO_COR = '#FF7A1A';

// Partes reaproveitadas (coordenadas num quadro de 512)
const LOGO_PARTES = {
  // cabeça de perfil olhando para a direita, com óculos, bico e barbela
  cabeca: (s = 1, dx = 0, dy = 0) => `<g transform="translate(${dx} ${dy}) scale(${s})">
    <path d="M178 182c-8-44 36-58 48-24c6-44 56-44 58-4c24-28 66-10 50 28"/>
    <path d="M334 230c4-52-34-82-86-80c-58 2-96 44-92 104c3 46 34 80 76 88"/>
    <path d="M334 236l70 24l-70 26"/>
    <path d="M334 286c18 4 26 28 10 52c-22-4-26-34-10-52"/>
    <rect x="226" y="214" width="112" height="46" rx="22"/>
    <path d="M190 228l36 8"/>
    <path d="M226 342c-6 40 2 72 22 96M310 300c20 40 22 90 4 138"/>
  </g>`,
  onda: (y = 0, s = 1) => `<g transform="translate(0 ${y}) scale(${s})"><path d="M80 420c34-30 66-30 100 0s66 30 100 0s66-30 100 0s50 26 52 8"/></g>`
};

function logoSvg(n = 1, tam = 64) {
  const fundo = '<rect width="512" height="512" rx="116" fill="#0A0A0A"/>';
  const g = (corpo, sw = 16) => `<g fill="none" stroke="${LOGO_COR}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${corpo}</g>`;
  let corpo = '';
  if (n === 1) {
    // Perfil: cabeça de óculos, limpa
    corpo = g(LOGO_PARTES.cabeca(1, 0, 0));
  } else if (n === 2) {
    // Na prancha: corpo inteiro em pé sobre a prancha
    corpo = g(`
      <path d="M70 404c80-30 290-30 380-6c-80 32-300 34-380 6z"/>
      <path d="M118 400c90-14 210-14 300-2"/>
      <path d="M224 338l-10 56M272 344l8 52M200 396h28M268 396h28"/>
      <path d="M170 262c-60-36-74-98-46-132c12 54 36 84 66 102"/>
      <path d="M172 278c-56-8-90-50-84-92c26 44 56 62 92 68"/>
      <ellipse cx="250" cy="282" rx="86" ry="76"/>
      <path d="M202 270c20 44 66 60 102 36"/>
      <path d="M302 240c12-30 20-48 28-62"/>
      <circle cx="348" cy="160" r="48"/>
      <path d="M316 116c-6-26 22-32 26-10c4-26 32-22 30 2c14-14 34-2 24 18"/>
      <path d="M392 158l42 14l-42 14"/>
      <rect x="326" y="140" width="58" height="26" rx="12"/>
    `, 13);
  } else if (n === 3) {
    // Cabeça sobre a onda
    corpo = g(LOGO_PARTES.cabeca(0.78, 52, -6) + '<path d="M86 410c34-28 66-28 100 0s66 28 100 0s66-28 100 0s44 22 40 6"/>');
  } else if (n === 4) {
    // De frente: cabeça redonda, crista, óculos escuros e bico
    corpo = g(`
      <path d="M190 156c-6-46 46-60 60-22c10-46 70-46 70 0c30-30 80-6 64 40"/>
      <circle cx="256" cy="266" r="112"/>
      <path d="M150 248h212"/>
      <rect x="168" y="230" width="76" height="46" rx="22"/>
      <rect x="268" y="230" width="76" height="46" rx="22"/>
      <path d="M232 306l24 34l24-34z"/>
      <path d="M246 352c0 26 20 34 20 0"/>
    `, 16);
  } else {
    // Selo: anel com a cabeça e a onda dentro
    corpo = g(`<circle cx="256" cy="256" r="196"/>` + LOGO_PARTES.cabeca(0.62, 92, 70) + '<path d="M120 372c26-22 52-22 78 0s52 22 78 0s52-22 78 0s34 18 34 4"/>', 15);
  }
  return `<svg viewBox="0 0 512 512" width="${tam}" height="${tam}" role="img" aria-label="Logo do Lifemaxxing">${fundo}${corpo}</svg>`;
}

const LOGO_NOMES = ['Perfil', 'Na prancha', 'Sobre a onda', 'De frente', 'Selo'];
