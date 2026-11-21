/* =========================================================
   Lifemaxxing — o pet: João Frango, galo surfista
   Desenho original em SVG (galo branco de óculos escuros numa
   prancha laranja). Em Ajustes dá para trocar por uma imagem sua.
   ========================================================= */
'use strict';

// Desenho do João Frango. "humor" muda o detalhe do rosto: 'de-boa', 'focado', 'festa'
function petSvg(humor = 'de-boa') {
  const boca = humor === 'festa'
    ? '<path d="M139 77 q7 5 13 0" fill="none" stroke="#7A2A12" stroke-width="2.4" stroke-linecap="round"/>'
    : humor === 'focado'
      ? '<path d="M140 78 h10" stroke="#7A2A12" stroke-width="2.4" stroke-linecap="round"/>'
      : '<path d="M140 77 q5 3 10 0" fill="none" stroke="#7A2A12" stroke-width="2.4" stroke-linecap="round"/>';
  return `<svg class="pet-svg" viewBox="0 0 200 200" role="img" aria-label="João Frango, o galo surfista">
  <defs>
    <linearGradient id="pet-agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14505B"/><stop offset="1" stop-color="#14505B" stop-opacity="0"/></linearGradient>
  </defs>
  <g class="pet-onda">
    <path d="M14 166 q20 -12 40 0 t40 0 t40 0 t40 0 q10 6 6 14 q-30 12 -86 12 q-56 0 -80 -12 q-4 -8 0 -14z" fill="url(#pet-agua)"/>
    <path d="M14 166 q20 -12 40 0 t40 0 t40 0 t40 0" fill="none" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round" opacity=".75"/>
    <path d="M30 182 q16 -6 32 0 t32 0 t32 0 t32 0" fill="none" stroke="#E8F4F1" stroke-width="1.6" stroke-linecap="round" opacity=".35"/>
  </g>
  <g class="pet-corpo">
    <g class="pet-prancha">
      <path d="M28 158 C 60 146, 140 146, 178 156 C 150 168, 60 170, 28 158 Z" fill="#FF6A1F"/>
      <path d="M44 157 C 80 151, 130 151, 164 156" fill="none" stroke="#FFE2C2" stroke-width="3" stroke-linecap="round"/>
      <circle cx="166" cy="156" r="2.6" fill="#7A2A12"/>
    </g>
    <path d="M88 132 l-4 22 M106 134 l3 20" stroke="#FFB43C" stroke-width="5" stroke-linecap="round"/>
    <path d="M80 154 h10 M105 154 h10" stroke="#FFB43C" stroke-width="5" stroke-linecap="round"/>
    <g class="pet-cauda">
      <path d="M66 104 C 40 88, 34 64, 46 50 C 52 72, 62 84, 74 92 Z" fill="#1C1C1F"/>
      <path d="M68 108 C 44 104, 30 86, 34 70 C 44 88, 56 96, 72 98 Z" fill="#FF6A1F"/>
      <path d="M70 112 C 50 116, 36 106, 34 94 C 46 104, 58 106, 72 104 Z" fill="#FF9A3C"/>
    </g>
    <ellipse cx="98" cy="110" rx="34" ry="30" fill="#F6F1EA"/>
    <path d="M78 104 C 86 122, 104 128, 118 118 C 106 116, 94 110, 86 98 Z" fill="#FF9A3C"/>
    <path d="M118 96 C 122 84, 124 76, 128 70" stroke="#F6F1EA" stroke-width="20" stroke-linecap="round"/>
    <circle cx="136" cy="64" r="19" fill="#F6F1EA"/>
    <path d="M124 48 c-2 -10 8 -12 9 -4 c2 -10 12 -8 10 1 c5 -6 12 -1 8 6 c-6 2 -18 2 -27 -3z" fill="#E8452C"/>
    <path d="M152 66 l16 5 l-16 5 z" fill="#FFB43C"/>
    <path d="M149 78 c3 0 5 4 3 9 c-4 1 -6 -4 -3 -9z" fill="#E8452C"/>
    <g class="pet-oculos">
      <rect x="128" y="57" width="22" height="11" rx="5" fill="#141414"/>
      <path d="M124 61 h5" stroke="#141414" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M132 60 l6 0" stroke="#FF9A3C" stroke-width="2" stroke-linecap="round" opacity=".9"/>
    </g>
    ${boca}
  </g>
</svg>`;
}

// Fala do pet conforme o dia
function petFala(cont, tot, bom, seq) {
  if (bom) return seq >= 3 ? `${seq} dias na crista!` : 'Dia bom, brother!';
  if (cont === 0) return 'Bora pra água?';
  if (tot - cont === 1) return 'Falta uma onda!';
  return 'Tá pegando onda!';
}
