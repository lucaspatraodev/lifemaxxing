/* =========================================================
   Lifemaxxing — dados iniciais
   Tudo aqui é o ponto de partida. Quase tudo pode ser editado
   depois na tela de Ajustes (e fica salvo no localStorage).
   ========================================================= */

const DADOS_INICIAIS = {
  nome: 'Lucas',
  horaDormir: '23:30',
  metaAguaMl: 2300,        // meta diária de água
  garrafaMl: 767,          // 2,3 L em 3 garrafas (ajuste quando souber o tamanho real)
  fimDeSemanaSantos: 300,  // custo de um fim de semana de viagem (para o "custo real" do fast food)
  xpDiaBom: 50,
  pet: { nome: 'João Frango', imagem: '' },
  logo: 2,          // logo escolhido (1 a 5, ver logos.js)
  tema: 'escuro',   // 'escuro' ou 'claro' // galo surfista; a imagem pode ser trocada em Ajustes

  // Bônus de XP fora dos hábitos
  xpBonus: {
    recorde: 25,       // por recorde pessoal no treino
    maxRecordes: 2,    // até 2 recordes contam
    intensidade: 20,   // treino com intensidade 8+
    duracao: 20,       // treino com mais de 45 min
    sequencia7: 100,   // 7 dias bons seguidos
    semana3: 150       // 3 treinos na semana (conta na sexta)
  },

  // Divisão do dinheiro livre (depois de separar o delivery)
  potes: { xp: 0.40, semana: 0.30, bau: 0.15, desafio: 0.15 },
  // Economia (ver docs/ECONOMIA.md). O pote de XP enche quando a quinzena chega na meta:
  // meta = dias × (XP das obrigações + dia bom + bônus-alvo por dia). Farmar além disso não libera mais dinheiro.
  xpBonusAlvoDia: 150,

  delivery: { total: 60, ticket: 30, diasSeguidos: 4 },

  // Orçamento das duas quinzenas. "santos: true" marca a Caixa de viagem (liberada inteira no pagamento).
  orcamento: {
    d15: {
      entrada: 3000,
      fixos: [
        { id: 'invest', nome: 'Investimento', valor: 1000 },
        { id: 'academia', nome: 'Academia', valor: 150 },
        { id: 'claude', nome: 'Claude', valor: 130 },
        { id: 'playstation', nome: 'PlayStation', valor: 100 },
        { id: 'marmitas', nome: 'Marmitas (15)', valor: 325 },
        { id: 'mercado', nome: 'Frutas e mercado básico', valor: 60 },
        { id: 'santos', nome: 'Caixa de viagem', valor: 300, santos: true }
      ]
    },
    d30: {
      entrada: 3000,
      fixos: [
        { id: 'invest', nome: 'Investimento', valor: 1000 },
        { id: 'avo_contas', nome: 'Contas da avó', valor: 200 },
        { id: 'avo_celular', nome: 'Celular da avó', valor: 220 },
        { id: 'marmitas', nome: 'Marmitas (15)', valor: 325 },
        { id: 'mercado', nome: 'Frutas e mercado básico', valor: 60 },
        { id: 'santos', nome: 'Caixa de viagem', valor: 300, santos: true }
      ]
    }
  },

  // Hábitos. Cada hábito tem "partes" (ex.: 3 garrafas) e cada parte pertence a um período.
  // periodo: 'manha' | 'tarde' | 'noite' | 'todos'
  // especial: 'treino' ou 'surf' (registrados pela aba Treino)
  habitos: [
    { id: 'dentes', nome: 'Dentes', tipo: 'minimo', xp: 10, icone: 'tooth',
      partes: [{ periodo: 'noite', rotulo: 'Escovar os dentes' }],
      motivos: ['Dentes mais brancos: a escova tira a placa que mancha', 'Hálito fresco o dia todo', 'Gengiva firme, sem sangramento', 'Menos cárie e menos dentista', 'Boca saudável, menos inflamação no corpo'] },
    { id: 'skincare', nome: 'Skincare', tipo: 'minimo', xp: 15, icone: 'sparkle',
      partes: [{ periodo: 'noite', rotulo: 'Skincare' }],
      motivos: ['Pele limpa: menos cravos e espinhas', 'Hidratação deixa a pele lisa e firme', 'Barreira da pele forte, menos irritação', 'Menos manchas e linhas com o tempo', 'Rosto com cara de descansado'] },
    { id: 'agua', nome: 'Água', tipo: 'minimo', xp: 24, icone: 'drop',
      partes: [
        { periodo: 'manha', rotulo: 'Garrafa 1' },
        { periodo: 'tarde', rotulo: 'Garrafa 2' },
        { periodo: 'noite', rotulo: 'Garrafa 3' }
      ],
      motivos: ['Pele com mais viço, lábios menos secos', 'Mais energia: desidratação leve já cansa', 'Menos dor de cabeça', 'Rins e intestino funcionando melhor', 'Treino rende mais, menos cãibra'] },
    { id: 'frutas', nome: 'Frutas', tipo: 'minimo', xp: 16, icone: 'apple',
      partes: [
        { periodo: 'tarde', rotulo: 'Fruta 1' },
        { periodo: 'tarde', rotulo: 'Fruta 2' }
      ],
      motivos: ['Vitamina C ajuda a formar colágeno', 'Fibras: intestino em dia, barriga desinchada', 'Antioxidantes protegem a pele', 'Doce natural que tira a vontade de besteira', 'Coração e pressão mais saudáveis'] },
    { id: 'dormir', nome: 'Dormir', tipo: 'minimo', xp: 20, icone: 'moon',
      partes: [{ periodo: 'noite', rotulo: 'Dormir no horário' }],
      motivos: ['Pele se recupera à noite: menos olheiras', 'Músculo se reconstrói enquanto você dorme', 'Menos fome e vontade de doce no dia seguinte', 'Foco, memória e humor melhores', 'Imunidade mais forte'] },
    { id: 'sair', nome: 'Sair', tipo: 'minimo', xp: 15, icone: 'door',
      partes: [{ periodo: 'manha', rotulo: 'Sair de casa 15 min' }],
      motivos: ['Luz da manhã acerta o relógio do sono', 'Caminhar ativa a circulação e a disposição', 'Humor melhor, menos ansiedade', 'Sol na medida ajuda a vitamina D', 'Quebra o ciclo da toca'] },
    { id: 'quarto', nome: 'Quarto', tipo: 'minimo', xp: 40, icone: 'bed',
      partes: [
        { periodo: 'manha', rotulo: 'Arrumar o quarto' },
        { periodo: 'tarde', rotulo: 'Arrumar o quarto' }
      ],
      motivos: ['Menos poeira e ácaro: pele e respiração agradecem', 'Quarto em ordem, sono melhor', 'Menos bagunça, mente mais calma', 'Começa o dia com uma vitória', 'Disciplina pequena puxa as grandes'] },

    { id: 'celular', nome: 'Sem celular', tipo: 'minimo', xp: 60, icone: 'phoneoff',
      partes: [
        { periodo: 'manha', rotulo: '1h sem celular', duracaoMin: 60 },
        { periodo: 'tarde', rotulo: '1h sem celular', duracaoMin: 60 }
      ],
      motivos: ['Foco profundo volta em poucos minutos sem notificação', 'Menos cortisol e ansiedade', 'Olhos descansam, menos olheiras', 'Postura do pescoço agradece', 'Dopamina de volta para o que importa'] },

    { id: 'treino', nome: 'Treino', tipo: 'extra', xp: 100, icone: 'dumbbell', especial: 'treino',
      partes: [{ periodo: 'todos', rotulo: 'Treino' }],
      motivos: ['Corpo mais definido e postura melhor', 'Mais músculo, metabolismo mais rápido', 'Circulação dá viço à pele', 'Menos ansiedade, sono mais profundo', 'Ossos e articulações mais fortes'] },
    { id: 'sol', nome: 'Sol', tipo: 'extra', xp: 20, icone: 'sun',
      partes: [{ periodo: 'manha', rotulo: 'Sol 15 min' }],
      motivos: ['Vitamina D para ossos e imunidade', 'Cor saudável na pele, sem queimar', 'Luz natural ajuda a dormir melhor', 'Mais disposição e bom humor', 'Relógio biológico no lugar'] },
    { id: 'tela', nome: 'Menos tela', tipo: 'extra', xp: 30, icone: 'phoneoff',
      partes: [{ periodo: 'noite', rotulo: 'Menos tela (meta do dia)' }],
      motivos: ['Sono mais profundo sem luz de tela à noite', 'Olhos menos cansados, menos olheiras', 'Pescoço e postura agradecem', 'Mais foco, menos ansiedade', 'Tempo de volta para o que importa'] },
    { id: 'natureza', nome: 'Natureza', tipo: 'extra', xp: 40, icone: 'tree',
      partes: [{ periodo: 'todos', rotulo: 'Natureza' }],
      motivos: ['Cortisol mais baixo, menos estresse', 'Pressão e batimentos mais calmos', 'Humor melhor por dias', 'Cabeça descansada, mais criatividade', 'Movimento sem perceber'] },
    { id: 'estudar', nome: 'Estudar', tipo: 'extra', xp: 60, icone: 'book',
      partes: [{ periodo: 'todos', rotulo: 'Estudar 1h', duracaoMin: 60 }],
      motivos: ['Cérebro ativo envelhece melhor', 'Conhecimento vira renda', 'Foco treinado como músculo', 'Autoestima de quem evolui', 'Menos tempo no automático'] },
    { id: 'desenvolver', nome: 'Desenvolver', tipo: 'extra', xp: 60, icone: 'terminal',
      partes: [{ periodo: 'todos', rotulo: 'Desenvolver 1h', duracaoMin: 60 }],
      motivos: ['Projeto andando todo dia', 'Habilidade que paga as contas', 'Estado de fluxo reduz a ansiedade', 'Portfólio crescendo', 'Orgulho de construir algo seu'] },
    { id: 'surf', nome: 'Surf', tipo: 'extra', xp: 150, icone: 'wave', especial: 'surf',
      partes: [{ periodo: 'todos', rotulo: 'Sessão de surf' }],
      motivos: ['Remada define ombros e costas', 'Equilíbrio trabalha o corpo inteiro', 'Sol e mar levantam o humor', 'Gasta muita energia sem parecer treino', 'Foco total no presente'] }
  ],

  // Frases de exemplo (editáveis). imagem: dataURL opcional enviada em Ajustes.
  frases: [
    { texto: 'Não conte os dias. Faça os dias contarem.', autor: 'Muhammad Ali', imagem: '' },
    { texto: 'Você erra 100% dos chutes que não dá.', autor: 'Wayne Gretzky', imagem: '' },
    { texto: 'O melhor surfista lá fora é aquele que está se divertindo mais.', autor: 'Phil Edwards', imagem: '' },
    { texto: 'Eu errei mais de 9.000 arremessos na carreira. Falhei de novo e de novo. E é por isso que tenho sucesso.', autor: 'Michael Jordan', imagem: '' },
    { texto: 'Quanto mais difícil a vitória, maior a felicidade de vencer.', autor: 'Pelé', imagem: '' },
    { texto: 'Campeões continuam jogando até acertar.', autor: 'Billie Jean King', imagem: '' },
    { texto: 'Treinei quatro anos para correr nove segundos.', autor: 'Usain Bolt', imagem: '' },
    { texto: 'Coragem não é não ter medo. É não deixar o medo te parar.', autor: 'Bethany Hamilton', imagem: '' },
    { texto: 'No empenho e na dedicação não existe meio-termo. Ou você faz bem feito ou não faz.', autor: 'Ayrton Senna', imagem: '' },
    { texto: 'Se você tem medo de falhar, provavelmente vai falhar.', autor: 'Kobe Bryant', imagem: '' }
  ],

  // Fichas de musculação (cargas iniciais em kg)
  fichas: {
    A: { nome: 'Peito e tríceps', exercicios: [
      { nome: 'Supino reto', series: 4, reps: 10, carga: 40 },
      { nome: 'Supino inclinado com halter', series: 3, reps: 10, carga: 16 },
      { nome: 'Crucifixo', series: 3, reps: 12, carga: 12 },
      { nome: 'Tríceps corda', series: 3, reps: 12, carga: 20 }
    ] },
    B: { nome: 'Costas e bíceps', exercicios: [
      { nome: 'Puxada frontal', series: 4, reps: 10, carga: 45 },
      { nome: 'Remada curvada', series: 3, reps: 10, carga: 40 },
      { nome: 'Remada baixa', series: 3, reps: 12, carga: 40 },
      { nome: 'Rosca direta', series: 3, reps: 10, carga: 20 }
    ] },
    C: { nome: 'Pernas e ombros', exercicios: [
      { nome: 'Agachamento', series: 4, reps: 10, carga: 50 },
      { nome: 'Leg press', series: 3, reps: 12, carga: 120 },
      { nome: 'Desenvolvimento com halter', series: 3, reps: 10, carga: 14 },
      { nome: 'Elevação lateral', series: 3, reps: 12, carga: 8 }
    ] }
  }
};

// Níveis: [número, nome, XP total mínimo]
// Níveis: [número, nome, XP total mínimo] (escala para ~300-400 XP por dia)
const NIVEIS = [
  [1, 'Na toca', 0],
  [2, 'Saindo de casa', 1600],
  [3, 'Pegando sol', 3800],
  [4, 'Em movimento', 6600],
  [5, 'Corpo acordado', 10000],
  [6, 'Disciplinado', 14000],
  [7, 'Atleta de fim de semana', 18600],
  [8, 'Rato de praia', 23800],
  [9, 'Remador', 29600],
  [10, 'Surfista', 36000]
];
// Depois do nível 10 a contagem recomeça com uma estrela.
const CICLO_NIVEL = 43000;

// Desafios sorteados no dia do pagamento
const DESAFIOS = [
  { id: 'semfastfood', texto: '10 dias seguidos sem fast food', meta: 10 },
  { id: 'natureza', texto: '2 saídas na natureza', meta: 2 },
  { id: 'treinos', texto: '6 treinos na quinzena', meta: 6 },
  { id: 'diasbons', texto: '10 dias bons', meta: 10 },
  { id: 'agua', texto: '12 dias com toda a água', meta: 12 },
  { id: 'sol', texto: '8 dias pegando sol', meta: 8 }
];

// Baú do dia: o PRIMEIRO bônus de cada dia abre um baú (um por dia).
// O prêmio é múltiplo de uma base b = pote de baús ÷ (1,7 × dias da quinzena).
// Valor esperado por baú = 0,3×1b + 0,2×3b + 0,1×8b = 1,7b → a quinzena inteira paga, em média, exatamente o pote.
const BAU_CHANCES = [
  { mult: 0, p: 0.40 },
  { mult: 1, p: 0.30 },
  { mult: 3, p: 0.20 },
  { mult: 8, p: 0.10 }
];
const BAU_ESPERADO = 1.7;
// Baú de nível: 2b a 4b, também do pote de baús
const BAU_NIVEL = { min: 2, max: 4 };

// Tipos de treino
const TIPOS_TREINO = [
  { id: 'A', nome: 'Musculação A', icone: 'dumbbell' },
  { id: 'B', nome: 'Musculação B', icone: 'dumbbell' },
  { id: 'C', nome: 'Musculação C', icone: 'dumbbell' },
  { id: 'corrida', nome: 'Corrida', icone: 'run', cardio: true },
  { id: 'surf', nome: 'Surf', icone: 'wave', cardio: true },
  { id: 'skate', nome: 'Skate', icone: 'skate', cardio: true }
];

const CATEGORIAS_GASTO = ['Comida', 'Doce', 'Delivery', 'Lazer', 'Transporte', 'Outro'];
