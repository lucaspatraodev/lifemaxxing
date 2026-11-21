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
  xpDiaBom: 40,

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
  // O pote de XP enche quando a quinzena chega nesta meta. Com R$350 no pote, cada 100 XP vale ~R$13;
  // se o montante for maior (sobrou da quinzena anterior), cada 100 XP vale mais.
  metaXpQuinzena: 2700,

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
      motivos: ['Menos cárie e gengiva saudável', 'Hálito bom o dia todo', 'Fecha a noite com um ritual simples'] },
    { id: 'skincare', nome: 'Skincare', tipo: 'minimo', xp: 10, icone: 'sparkle',
      partes: [{ periodo: 'noite', rotulo: 'Skincare' }],
      motivos: ['Pele mais limpa e firme', 'Menos espinha e oleosidade', 'Cinco minutos de cuidado com você'] },
    { id: 'agua', nome: 'Água', tipo: 'minimo', xp: 10, icone: 'drop',
      partes: [
        { periodo: 'manha', rotulo: 'Garrafa 1' },
        { periodo: 'tarde', rotulo: 'Garrafa 2' },
        { periodo: 'noite', rotulo: 'Garrafa 3' }
      ],
      motivos: ['Pele melhor', 'Mais energia e foco', 'Menos dor de cabeça'] },
    { id: 'frutas', nome: 'Frutas', tipo: 'minimo', xp: 10, icone: 'apple',
      partes: [
        { periodo: 'tarde', rotulo: 'Fruta 1' },
        { periodo: 'tarde', rotulo: 'Fruta 2' }
      ],
      motivos: ['Fibra e vitaminas de verdade', 'Doce que não te derruba', 'Intestino em dia'] },
    { id: 'dormir', nome: 'Dormir', tipo: 'minimo', xp: 10, icone: 'moon',
      partes: [{ periodo: 'noite', rotulo: 'Dormir no horário' }],
      motivos: ['Músculo se recupera dormindo', 'Humor e foco no dia seguinte', 'Menos vontade de besteira'] },
    { id: 'sair', nome: 'Sair', tipo: 'minimo', xp: 10, icone: 'door',
      partes: [{ periodo: 'manha', rotulo: 'Sair de casa 15 min' }],
      motivos: ['Luz natural acerta o sono', 'Quebra o ciclo da toca', 'Cabeça mais leve'] },

    { id: 'treino', nome: 'Treino', tipo: 'extra', xp: 100, icone: 'dumbbell', especial: 'treino',
      partes: [{ periodo: 'todos', rotulo: 'Treino' }],
      motivos: ['Força e postura', 'Ansiedade lá embaixo', 'Corpo pronto para o surf'] },
    { id: 'sol', nome: 'Sol', tipo: 'extra', xp: 20, icone: 'sun',
      partes: [{ periodo: 'manha', rotulo: 'Sol 15 min' }],
      motivos: ['Vitamina D', 'Relógio biológico no lugar', 'Disposição logo cedo'] },
    { id: 'tela', nome: 'Menos tela', tipo: 'extra', xp: 25, icone: 'phoneoff',
      partes: [{ periodo: 'noite', rotulo: 'Menos tela (meta do dia)' }],
      motivos: ['Sono mais profundo', 'Mais tempo para o que importa', 'Menos comparação'] },
    { id: 'natureza', nome: 'Natureza', tipo: 'extra', xp: 40, icone: 'tree',
      partes: [{ periodo: 'todos', rotulo: 'Natureza' }],
      motivos: ['Derruba o estresse', 'Recarrega a cabeça', 'Lembra por que vale a pena'] },
    { id: 'surf', nome: 'Surf', tipo: 'extra', xp: 150, icone: 'wave', especial: 'surf',
      partes: [{ periodo: 'todos', rotulo: 'Sessão de surf' }],
      motivos: ['É o objetivo final', 'Cardio e remada de verdade', 'Pura liberdade'] }
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
const NIVEIS = [
  [1, 'Na toca', 0],
  [2, 'Saindo de casa', 400],
  [3, 'Pegando sol', 950],
  [4, 'Em movimento', 1650],
  [5, 'Corpo acordado', 2500],
  [6, 'Disciplinado', 3500],
  [7, 'Atleta de fim de semana', 4650],
  [8, 'Rato de praia', 5950],
  [9, 'Remador', 7400],
  [10, 'Surfista', 9000]
];
// Depois do nível 10 a contagem recomeça com uma estrela.
// O "nível 11" pediria 1.750 XP depois do 10 (150 a mais que o degrau anterior).
const CICLO_NIVEL = 10750;

// Desafios sorteados no dia do pagamento
const DESAFIOS = [
  { id: 'semfastfood', texto: '10 dias seguidos sem fast food', meta: 10 },
  { id: 'natureza', texto: '2 saídas na natureza', meta: 2 },
  { id: 'treinos', texto: '6 treinos na quinzena', meta: 6 },
  { id: 'diasbons', texto: '10 dias bons', meta: 10 },
  { id: 'agua', texto: '12 dias com toda a água', meta: 12 },
  { id: 'sol', texto: '8 dias pegando sol', meta: 8 }
];

// Baú surpresa: cada bônus rola um baú. O prêmio é uma fatia do pote de baús da quinzena
// (com R$131 no pote: vazio, ~R$5, ~R$15 ou ~R$40). Montante maior, baú maior.
const BAU_CHANCES = [
  { pct: 0, p: 0.40 },
  { pct: 0.04, p: 0.30 },
  { pct: 0.11, p: 0.20 },
  { pct: 0.30, p: 0.10 }
];
// Baú de nível: entre 19% e 38% do pote de baús (~R$25 a R$50 com R$131 no pote)
const BAU_NIVEL = { min: 0.19, max: 0.38 };

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
