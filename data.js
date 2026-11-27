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
  // Danos: metas por semana (seg a dom). Delivery segue os tickets da quinzena.
  danos: { beber: 2, fumar: 4 },
  // Desafios pessoais: cada surf manda 30 XP para o pote; completar um desafio paga XP do pote
  desafios: { xpDoSurf: 30, xpPorDia: 10 },
  // Caixa bloqueada: punição por dano. Sai do livre desta quinzena e só volta na próxima.
  bloqueio: { ativo: true, soAcimaMeta: false, valores: { fumar: 10, beber: 10, delivery: 0 } },
  // Categorias de gasto (dá para criar novas no registro de gasto e apagar em Ajustes)
  categorias: ['Comida', 'Doce', 'Delivery', 'Bebida', 'Fumo', 'Lazer', 'Transporte', 'Roupa', 'Outro'],

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
    { id: 'dentes', nome: 'Dentes', tipo: 'minimo', xp: 15, icone: 'tooth',
      partes: [
        { periodo: 'manha', rotulo: 'Escovar os dentes' },
        { periodo: 'tarde', rotulo: 'Escovar os dentes' },
        { periodo: 'noite', rotulo: 'Escovar os dentes' }
      ],
      motivos: ['Sorriso mais branco e bonito', 'Hálito fresco para chegar perto de qualquer um', 'Gengiva rosada, sem sangrar', 'Confiança para sorrir nas fotos', 'Boca limpa e leve antes de dormir'] },
    { id: 'skincare', nome: 'Skincare', tipo: 'minimo', xp: 15, icone: 'sparkle',
      partes: [{ periodo: 'noite', rotulo: 'Skincare' }],
      motivos: ['Pele lisa, sem cravos e espinhas', 'Rosto com cara de descansado', 'Viço e brilho saudável', 'Menos manchas e linhas com o tempo', 'Sensação de se cuidar antes de dormir'] },
    { id: 'agua', nome: 'Água', tipo: 'minimo', xp: 24, icone: 'drop',
      partes: [
        { periodo: 'manha', rotulo: 'Garrafa 1' },
        { periodo: 'tarde', rotulo: 'Garrafa 2' },
        { periodo: 'noite', rotulo: 'Garrafa 3' }
      ],
      motivos: ['Pele com viço e lábios macios', 'Mais disposição: sede leve já dá cansaço', 'Rosto menos inchado, olhar mais vivo', 'Cabeça leve, sem dor de cabeça', 'Treino com mais força e pump'] },
    { id: 'frutas', nome: 'Frutas', tipo: 'minimo', xp: 16, icone: 'apple',
      partes: [
        { periodo: 'tarde', rotulo: 'Fruta 1' },
        { periodo: 'tarde', rotulo: 'Fruta 2' }
      ],
      motivos: ['Pele mais bonita: vitamina C forma colágeno', 'Barriga desinchada e corpo leve', 'Energia limpa, sem pico e queda', 'Menos vontade de besteira', 'Cabelo e unhas mais fortes'] },
    { id: 'dormir', nome: 'Dormir', tipo: 'minimo', xp: 20, icone: 'moon',
      partes: [{ periodo: 'noite', rotulo: 'Dormir no horário' }],
      motivos: ['Acordar sem olheiras e com o rosto desinchado', 'Músculo cresce enquanto você dorme', 'Disposição de sobra amanhã', 'Humor leve, menos irritação', 'Menos fome de doce no dia seguinte'] },
    { id: 'sair', nome: 'Sair', tipo: 'minimo', xp: 15, icone: 'door',
      partes: [{ periodo: 'manha', rotulo: 'Sair de casa 15 min' }],
      motivos: ['Luz da manhã dá disposição na hora', 'Pegar no sono mais fácil à noite', 'Humor lá em cima', 'Pele com cor de quem vive lá fora', 'Sair da toca já é uma vitória'] },
    { id: 'quarto', nome: 'Quarto', tipo: 'minimo', xp: 40, icone: 'bed',
      partes: [
        { periodo: 'manha', rotulo: 'Arrumar o quarto' },
        { periodo: 'tarde', rotulo: 'Arrumar o quarto' }
      ],
      motivos: ['Acordar num lugar que dá orgulho', 'Mente leve, sem bagunça em volta', 'Sono melhor num quarto em ordem', 'Menos poeira: pele e respiração agradecem', 'Primeira vitória do dia'] },

    { id: 'celular', nome: 'Sem celular', tipo: 'minimo', xp: 60, icone: 'phoneoff',
      partes: [
        { periodo: 'manha', rotulo: '1h sem celular', duracaoMin: 60 },
        { periodo: 'tarde', rotulo: '1h sem celular', duracaoMin: 60 }
      ],
      motivos: ['Cabeça leve e foco de volta', 'Olhar descansado, menos olheiras', 'Postura melhor, sem pescoço para frente', 'Menos ansiedade e comparação', 'Sensação de estar no controle do dia'] },

    { id: 'treino', nome: 'Treino', tipo: 'extra', xp: 100, icone: 'dumbbell', especial: 'treino',
      partes: [{ periodo: 'todos', rotulo: 'Treino' }],
      motivos: ['Corpo mais definido e ombros largos', 'Postura de quem se cuida', 'Pele corada pela circulação', 'Sono profundo e cabeça leve', 'Confiança que aparece no espelho'] },
    { id: 'sol', nome: 'Sol', tipo: 'extra', xp: 20, icone: 'sun',
      partes: [{ periodo: 'manha', rotulo: 'Sol 15 min' }],
      motivos: ['Pele com cor saudável, sem queimar', 'Disposição e bom humor na hora', 'Sono melhor à noite', 'Mais vitamina D: ossos e defesa fortes', 'Cara de verão o ano todo'] },
    { id: 'tela', nome: 'Menos tela', tipo: 'extra', xp: 30, icone: 'phoneoff',
      partes: [{ periodo: 'noite', rotulo: 'Menos tela (meta do dia)' }],
      motivos: ['Dormir rápido e acordar descansado', 'Olhos menos cansados e vermelhos', 'Menos olheiras de manhã', 'Cabeça calma antes de deitar', 'Pescoço relaxado, postura melhor'] },
    { id: 'natureza', nome: 'Natureza', tipo: 'extra', xp: 40, icone: 'tree',
      partes: [{ periodo: 'todos', rotulo: 'Natureza' }],
      motivos: ['Estresse lá embaixo, cabeça leve', 'Rosto mais relaxado', 'Humor bom por dias', 'Ideias novas e criatividade', 'Sensação de liberdade'] },
    { id: 'estudar', nome: 'Estudar', tipo: 'extra', xp: 60, icone: 'book',
      partes: [{ periodo: 'todos', rotulo: 'Estudar 1h', duracaoMin: 60 }],
      motivos: ['Orgulho de evoluir todo dia', 'Mente afiada e rápida', 'Confiança para falar de qualquer assunto', 'Foco que vira hábito', 'Fim de dia leve, sem culpa'] },
    { id: 'desenvolver', nome: 'Desenvolver', tipo: 'extra', xp: 60, icone: 'terminal',
      partes: [{ periodo: 'todos', rotulo: 'Desenvolver 1h', duracaoMin: 60 }],
      motivos: ['Orgulho de construir algo seu', 'Cabeça no fluxo, ansiedade some', 'Habilidade que vira renda', 'Projeto andando todo dia', 'Sensação de dia bem aproveitado'] },
    { id: 'surf', nome: 'Surf', tipo: 'extra', xp: 120, icone: 'wave', especial: 'surf',
      partes: [{ periodo: 'todos', rotulo: 'Sessão de surf' }],
      motivos: ['Ombros e costas definidos pela remada', 'Pele bronzeada de mar', 'Cabeça zerada depois do mar', 'Corpo inteiro trabalhando sem perceber', 'Felicidade pura na onda'] }
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
    A: { titulo: 'Musculação A', nome: 'Peito e tríceps', exercicios: [
      { nome: 'Supino reto', series: 4, reps: 10, carga: 40 },
      { nome: 'Supino inclinado com halter', series: 3, reps: 10, carga: 16 },
      { nome: 'Crucifixo', series: 3, reps: 12, carga: 12 },
      { nome: 'Tríceps corda', series: 3, reps: 12, carga: 20 }
    ] },
    B: { titulo: 'Musculação B', nome: 'Costas e bíceps', exercicios: [
      { nome: 'Puxada frontal', series: 4, reps: 10, carga: 45 },
      { nome: 'Remada curvada', series: 3, reps: 10, carga: 40 },
      { nome: 'Remada baixa', series: 3, reps: 12, carga: 40 },
      { nome: 'Rosca direta', series: 3, reps: 10, carga: 20 }
    ] },
    C: { titulo: 'Musculação C', nome: 'Pernas e ombros', exercicios: [
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
  { id: 'semfastfood', texto: '10 dias seguidos sem delivery', meta: 10 },
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

const CATEGORIAS_GASTO = ['Comida', 'Doce', 'Delivery', 'Bebida', 'Fumo', 'Lazer', 'Transporte', 'Roupa', 'Outro'];

// Danos: coisas ruins para a saúde que você registra e controla por meta
const TIPOS_DANO = [
  { id: 'delivery', nome: 'Delivery', icone: 'burger', categoria: 'Delivery', periodo: 'quinzena' },
  { id: 'beber', nome: 'Beber', icone: 'glass', categoria: 'Bebida', periodo: 'semana' },
  { id: 'fumar', nome: 'Fumar', icone: 'leaf', categoria: 'Fumo', periodo: 'semana' }
];

// Frutas para o plano da quinzena (Dieta). Benefícios: aparência e como você se sente.
const FRUTAS = [
  { id: 'maca', nome: 'Maçã', ben: ['Fibras que desincham a barriga', 'Saciedade: segura a fome até a próxima refeição', 'Pele mais limpa com antioxidantes', 'Energia estável, sem pico de açúcar', 'Hálito fresco e dentes mais limpos ao mastigar'] },
  { id: 'banana', nome: 'Banana', ben: ['Energia rápida antes do treino', 'Potássio: menos cãibra e mais disposição', 'Humor melhor (ajuda a formar serotonina)', 'Sono mais tranquilo à noite', 'Doce natural que tira a vontade de besteira'] },
  { id: 'laranja', nome: 'Laranja', ben: ['Vitamina C forma colágeno: pele firme', 'Imunidade em dia', 'Hidrata junto com a água', 'Ajuda a absorver ferro: menos cansaço', 'Pele com viço'] },
  { id: 'mexerica', nome: 'Mexerica', ben: ['Vitamina C para a pele', 'Fácil de levar e comer em qualquer lugar', 'Hidratação e frescor', 'Imunidade forte', 'Doce leve, poucas calorias'] },
  { id: 'mamao', nome: 'Mamão', ben: ['Barriga desinchada e intestino leve', 'Pele com brilho (betacaroteno)', 'Digestão mais leve depois das refeições', 'Vitamina C e A para a pele', 'Poucas calorias, muita saciedade'] },
  { id: 'abacaxi', nome: 'Abacaxi', ben: ['Bromelina ajuda a digerir e desinchar', 'Vitamina C para a pele', 'Hidrata e refresca', 'Recuperação melhor depois do treino', 'Doce natural'] },
  { id: 'melancia', nome: 'Melancia', ben: ['Muita água: hidrata a pele', 'Rosto menos inchado', 'Refresca no calor', 'Licopeno protege a pele do sol', 'Quase sem calorias'] },
  { id: 'melao', nome: 'Melão', ben: ['Hidratação e pele macia', 'Leve, não pesa', 'Potássio para a disposição', 'Betacaroteno para a pele', 'Doce com poucas calorias'] },
  { id: 'morango', nome: 'Morango', ben: ['Muito vitamina C: pele firme', 'Antioxidantes contra o envelhecimento', 'Dentes mais brancos (ácido málico)', 'Poucas calorias', 'Bom humor e cara de sobremesa'] },
  { id: 'uva', nome: 'Uva', ben: ['Antioxidantes para a pele', 'Circulação melhor', 'Lanche prático', 'Energia rápida', 'Coração protegido'] },
  { id: 'manga', nome: 'Manga', ben: ['Pele com brilho (vitamina A)', 'Vitamina C e colágeno', 'Energia para o dia', 'Intestino em dia', 'Doce que mata a vontade de sobremesa'] },
  { id: 'pera', nome: 'Pera', ben: ['Muita fibra: barriga leve', 'Saciedade longa', 'Hidratação', 'Energia estável', 'Fácil de digerir'] },
  { id: 'kiwi', nome: 'Kiwi', ben: ['Mais vitamina C que a laranja', 'Pele firme e com viço', 'Sono melhor (comer à noite)', 'Digestão leve', 'Imunidade forte'] },
  { id: 'goiaba', nome: 'Goiaba', ben: ['Campeã de vitamina C: colágeno e pele firme', 'Muita fibra e saciedade', 'Imunidade', 'Licopeno protege a pele', 'Poucas calorias'] },
  { id: 'abacate', nome: 'Abacate', ben: ['Gordura boa: pele e cabelo hidratados', 'Saciedade de horas', 'Ajuda a absorver vitaminas', 'Potássio e disposição', 'Hormônios em dia'] },
  { id: 'maracuja', nome: 'Maracujá', ben: ['Ajuda a relaxar e dormir', 'Vitamina C e A', 'Fibras para o intestino', 'Menos ansiedade', 'Refresca'] },
  { id: 'pessego', nome: 'Pêssego', ben: ['Pele bonita (betacaroteno)', 'Hidrata', 'Leve e doce', 'Fibras', 'Antioxidantes'] },
  { id: 'ameixa', nome: 'Ameixa', ben: ['Intestino funcionando', 'Barriga desinchada', 'Antioxidantes', 'Ossos fortes', 'Doce natural'] },
  { id: 'mirtilo', nome: 'Mirtilo', ben: ['Antioxidantes que protegem a pele', 'Memória e foco', 'Recuperação do treino', 'Poucas calorias', 'Visão protegida'] },
  { id: 'caqui', nome: 'Caqui', ben: ['Pele com brilho (vitamina A)', 'Muita fibra', 'Energia', 'Saciedade', 'Doce de sobremesa'] },
  { id: 'acerola', nome: 'Acerola', ben: ['Vitamina C altíssima: colágeno', 'Pele com viço', 'Imunidade forte', 'Refresca', 'Poucas calorias'] }
];

// Modelos de desafio com uma melhoria para cada dia (texto cuidadoso: "costuma", sem prometer)
const MODELOS_DESAFIO = [
  { id: 'limpo', nome: 'Sem crack e sem maconha', dias: 15,
    apoio: 'Fissura vem em ondas de 15 a 30 minutos e passa. Se apertar: CVV 188 (24h, grátis). Tratamento sem custo: CAPS AD da sua cidade (SUS).',
    melhorias: [
      'Coração e pressão começam a voltar ao ritmo normal. O corpo já está limpando a droga.',
      'O apetite começa a voltar e o corpo pede água e comida de verdade. Sono pode estar agitado: é normal e passa.',
      'O crack já saiu do sangue. Os pulmões começam a se limpar da fumaça. Se a fissura bater forte hoje, é o pico: segura.',
      'Respiração mais solta e menos tosse. A irritação da falta da maconha costuma começar a baixar a partir daqui.',
      'O sono profundo começa a voltar. Sonhos fortes e vívidos são sinal de que o cérebro está se recuperando.',
      'Humor mais estável, menos daquela ansiedade de ressaca. Você já passou da parte mais difícil.',
      'Uma semana limpo. Pele menos opaca, rosto menos abatido, apetite e hidratação melhores.',
      'A memória de curto prazo começa a melhorar: lembrar das coisas fica mais fácil.',
      'Energia mais estável durante o dia, sem os picos e quedas.',
      'O foco melhora e a vontade de fazer as coisas começa a voltar. O cérebro está reajustando a dopamina.',
      'Olhos menos vermelhos e menos olheiras. Dá para ver a diferença no espelho.',
      'Fôlego e recuperação melhores: o treino e o surf rendem mais.',
      'Mais controle do dinheiro e do tempo. Some o que você teria gastado nesses dias.',
      'Sono mais regular e sonhos mais calmos. Acordar fica mais fácil.',
      'Duas semanas limpo. As fissuras ficam mais raras e mais fracas. Você provou que consegue: continua.'
    ] }
];
