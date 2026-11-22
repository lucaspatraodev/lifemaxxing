/* =========================================================
   Lifemaxxing — biblioteca de exercícios (português)
   Cada item: [id da imagem, nome, grupo, equipamento, dicas[], erro comum, apelidos[]]
   Imagens (início e fim do movimento) do Free Exercise DB, domínio público (Unlicense):
   https://github.com/yuhonas/free-exercise-db
   ========================================================= */

const GRUPOS_EX = [
  ['peito', 'Peito'], ['costas', 'Costas'], ['ombros', 'Ombros'], ['biceps', 'Bíceps'], ['triceps', 'Tríceps'],
  ['quadriceps', 'Quadríceps'], ['posterior', 'Posterior'], ['gluteos', 'Glúteos'], ['panturrilha', 'Panturrilha'],
  ['abdomen', 'Abdômen'], ['trapezio', 'Trapézio'], ['antebraco', 'Antebraço'], ['cardio', 'Cardio'], ['funcional', 'Funcional']
];

const EXERCICIOS = [
  // ---------- Peito ----------
  ['Barbell_Bench_Press_-_Medium_Grip', 'Supino reto com barra', 'peito', 'Barra', ['Escápulas juntas e para baixo, peito alto', 'Desça a barra até a linha do mamilo', 'Cotovelos a uns 45° do tronco', 'Pés firmes: empurre o chão junto com a barra'], 'Quicar a barra no peito ou tirar o quadril do banco', ['Supino reto', 'Supino']],
  ['Dumbbell_Bench_Press', 'Supino reto com halteres', 'peito', 'Halteres', ['Halteres alinhados com o meio do peito', 'Desça até sentir alongar o peito', 'Suba juntando levemente os halteres', 'Punhos retos, em cima dos cotovelos'], 'Bater os halteres em cima e perder a tensão', ['Supino com halter']],
  ['Incline_Dumbbell_Press', 'Supino inclinado com halteres', 'peito', 'Halteres', ['Banco entre 30° e 45°', 'Desça até a parte alta do peito', 'Cotovelos um pouco abaixo da linha do ombro', 'Controle a descida em 2 segundos'], 'Banco muito inclinado: vira exercício de ombro', ['Supino inclinado com halter', 'Supino inclinado']],
  ['Barbell_Incline_Bench_Press_-_Medium_Grip', 'Supino inclinado com barra', 'peito', 'Barra', ['Banco a 30°', 'Barra desce na clavícula / parte alta do peito', 'Escápulas presas no banco', 'Suba em linha reta, sem jogar a barra para trás'], 'Arquear demais a lombar para empurrar', []],
  ['Decline_Barbell_Bench_Press', 'Supino declinado', 'peito', 'Barra', ['Pernas bem presas no apoio', 'Barra desce na parte baixa do peito', 'Movimento curto e controlado', 'Peça ajuda para tirar e devolver a barra'], 'Descer a barra no pescoço', []],
  ['Machine_Bench_Press', 'Supino máquina', 'peito', 'Máquina', ['Pegadores na linha do meio do peito', 'Costas inteiras no encosto', 'Empurre sem travar os cotovelos', 'Volte devagar até alongar'], 'Banco alto ou baixo demais: ajuste a altura', ['Chest press']],
  ['Smith_Machine_Incline_Bench_Press', 'Supino inclinado no Smith', 'peito', 'Smith', ['Banco a 30° bem centralizado', 'Barra toca a parte alta do peito', 'Trave o Smith girando a barra no fim', 'Cotovelos a 45°'], 'Banco desalinhado com o trilho', []],
  ['Dumbbell_Flyes', 'Crucifixo reto com halteres', 'peito', 'Halteres', ['Cotovelos levemente dobrados e fixos', 'Abra até sentir alongar, sem passar da linha do ombro', 'Feche como se abraçasse uma árvore', 'Carga moderada: o foco é o alongamento'], 'Dobrar e esticar os cotovelos (vira supino)', ['Crucifixo']],
  ['Incline_Dumbbell_Flyes', 'Crucifixo inclinado', 'peito', 'Halteres', ['Banco a 30°', 'Cotovelos fixos levemente dobrados', 'Desça em arco até a linha do peito', 'Aperte o peito em cima por 1 segundo'], 'Descer demais e forçar o ombro', []],
  ['Butterfly', 'Voador (peck deck)', 'peito', 'Máquina', ['Pegadores na altura do peito', 'Costas coladas no encosto', 'Feche apertando o peito, sem bater', 'Volte até alongar, devagar'], 'Ombros subindo e indo para frente', ['Peck deck', 'Voador']],
  ['Cable_Crossover', 'Crossover na polia', 'peito', 'Polia', ['Um pé à frente, tronco levemente inclinado', 'Cotovelos fixos, abraço em arco', 'Mãos se encontram na frente do quadril ou do peito', 'Volte devagar sentindo alongar'], 'Usar o peso do corpo para puxar', ['Crossover']],
  ['Pushups', 'Flexão de braço', 'peito', 'Peso do corpo', ['Mãos um pouco mais abertas que os ombros', 'Corpo em linha reta: abdômen e glúteo firmes', 'Desça até o peito quase tocar o chão', 'Cotovelos a 45°, não abertos em T'], 'Quadril caindo ou empinado', ['Flexão']],
  ['Push-Ups_With_Feet_Elevated', 'Flexão com pés elevados', 'peito', 'Peso do corpo', ['Pés num banco ou degrau', 'Corpo em prancha o tempo todo', 'Desça controlando', 'Foca a parte alta do peito'], 'Lombar afundando', []],
  ['Dips_-_Chest_Version', 'Paralelas para peito', 'peito', 'Paralelas', ['Tronco inclinado para frente', 'Desça até o ombro ficar na linha do cotovelo', 'Cotovelos um pouco abertos', 'Suba sem travar'], 'Descer fundo demais e forçar o ombro', ['Paralelas', 'Mergulho']],
  ['Bent-Arm_Dumbbell_Pullover', 'Pullover com halter', 'peito', 'Halter', ['Ombros apoiados no banco, quadril baixo', 'Cotovelos levemente dobrados', 'Leve o halter atrás da cabeça até alongar', 'Volte até a linha dos olhos'], 'Descer além do confortável para o ombro', ['Pullover']],

  // ---------- Costas ----------
  ['Wide-Grip_Lat_Pulldown', 'Puxada frontal aberta', 'costas', 'Polia', ['Pegada um pouco mais aberta que os ombros', 'Peito alto, leve inclinação para trás', 'Puxe a barra até o queixo/peito com os cotovelos', 'Suba devagar até esticar os braços'], 'Puxar com os braços e balançar o tronco', ['Puxada frontal', 'Pulldown', 'Puxada']],
  ['Close-Grip_Front_Lat_Pulldown', 'Puxada com pegada fechada', 'costas', 'Polia', ['Pegada na largura dos ombros', 'Cotovelos descem rente ao corpo', 'Aperte as costas embaixo', 'Controle a volta'], 'Jogar o corpo para trás', ['Puxada triângulo']],
  ['Pullups', 'Barra fixa', 'costas', 'Barra fixa', ['Pegada pronada, um pouco aberta', 'Comece com os braços esticados e ombros ativos', 'Suba até o queixo passar a barra', 'Desça inteiro e controlado'], 'Meia repetição e balanço com as pernas', ['Barra fixa', 'Pull-up']],
  ['Chin-Up', 'Barra fixa supinada', 'costas', 'Barra fixa', ['Palmas viradas para você', 'Peito em direção à barra', 'Desça até esticar', 'Use elástico se ainda não conseguir'], 'Chutar para subir', ['Chin-up']],
  ['Bent_Over_Barbell_Row', 'Remada curvada com barra', 'costas', 'Barra', ['Tronco a uns 45°, coluna neutra', 'Joelhos levemente dobrados', 'Puxe a barra até o umbigo', 'Aperte as escápulas no topo'], 'Arredondar a lombar ou levantar o tronco a cada repetição', ['Remada curvada']],
  ['One-Arm_Dumbbell_Row', 'Remada unilateral (serrote)', 'costas', 'Halter', ['Mão e joelho apoiados no banco', 'Costas retas, paralelas ao chão', 'Puxe o halter em direção ao quadril', 'Desça até alongar a costa'], 'Girar o tronco para subir mais peso', ['Serrote', 'Remada unilateral']],
  ['Seated_Cable_Rows', 'Remada baixa', 'costas', 'Polia', ['Coluna reta, peito alto', 'Puxe o triângulo até a barriga', 'Cotovelos rentes ao corpo', 'Volte deixando as escápulas abrirem, sem curvar'], 'Balançar o tronco para frente e para trás', ['Remada baixa', 'Remada sentada']],
  ['T-Bar_Row_with_Handle', 'Remada cavalinho', 'costas', 'Barra T', ['Peito para fora, coluna neutra', 'Joelhos dobrados, quadril para trás', 'Puxe até a barra tocar o peito baixo', 'Controle a descida'], 'Arredondar as costas', ['Remada T', 'Cavalinho']],
  ['Leverage_Iso_Row', 'Remada máquina', 'costas', 'Máquina', ['Peito apoiado no suporte', 'Puxe com os cotovelos para trás', 'Aperte as escápulas', 'Volte devagar'], 'Tirar o peito do apoio', ['Remada articulada']],
  ['Straight-Arm_Pulldown', 'Pulldown com braços estendidos', 'costas', 'Polia', ['Braços quase retos, cotovelos fixos', 'Leve a barra da altura dos olhos até as coxas', 'Tronco levemente inclinado', 'Sinta o dorsal trabalhando'], 'Dobrar os cotovelos e virar tríceps', ['Pulldown']],
  ['Inverted_Row', 'Remada invertida', 'costas', 'Peso do corpo', ['Corpo reto como prancha', 'Puxe o peito até a barra', 'Escápulas juntas no topo', 'Quanto mais deitado, mais difícil'], 'Quadril caindo', []],
  ['Barbell_Deadlift', 'Levantamento terra', 'costas', 'Barra', ['Barra colada na canela, no meio do pé', 'Coluna neutra, peito alto, olhar à frente', 'Empurre o chão com as pernas', 'Barra sobe raspando nas pernas; trave o quadril no topo'], 'Arredondar a lombar ou puxar com os braços', ['Terra', 'Deadlift']],
  ['Hyperextensions_Back_Extensions', 'Hiperextensão lombar', 'costas', 'Banco romano', ['Quadril na borda do apoio', 'Desça com a coluna neutra', 'Suba até o corpo ficar em linha reta', 'Contraia glúteo no topo'], 'Hiperestender (passar da linha reta)', ['Extensão lombar']],

  // ---------- Ombros ----------
  ['Dumbbell_Shoulder_Press', 'Desenvolvimento com halteres', 'ombros', 'Halteres', ['Sentado com as costas apoiadas', 'Halteres na altura das orelhas', 'Empurre para cima sem bater os halteres', 'Desça até o cotovelo passar um pouco a linha do ombro'], 'Arquear a lombar para empurrar', ['Desenvolvimento com halter', 'Desenvolvimento']],
  ['Barbell_Shoulder_Press', 'Desenvolvimento com barra', 'ombros', 'Barra', ['Pegada um pouco mais aberta que os ombros', 'Barra desce até a altura do queixo', 'Abdômen firme', 'Empurre em linha reta sobre a cabeça'], 'Descer atrás da nuca', []],
  ['Standing_Military_Press', 'Desenvolvimento militar em pé', 'ombros', 'Barra', ['Glúteo e abdômen contraídos', 'Barra sai da clavícula', 'Tire a cabeça do caminho e volte embaixo da barra', 'Trave em cima com a barra sobre o meio do pé'], 'Inclinar o tronco para trás', ['Militar']],
  ['Arnold_Dumbbell_Press', 'Desenvolvimento Arnold', 'ombros', 'Halteres', ['Comece com as palmas viradas para você', 'Gire as mãos enquanto sobe', 'Termine com as palmas para frente', 'Desça girando de volta'], 'Usar impulso das pernas', ['Arnold']],
  ['Leverage_Shoulder_Press', 'Desenvolvimento máquina', 'ombros', 'Máquina', ['Banco ajustado: pegador na altura do ombro', 'Costas apoiadas', 'Empurre sem travar o cotovelo', 'Volte controlando'], 'Banco baixo demais', []],
  ['Side_Lateral_Raise', 'Elevação lateral', 'ombros', 'Halteres', ['Cotovelos levemente dobrados', 'Suba até a linha do ombro', 'Lidere com os cotovelos, não com as mãos', 'Desça devagar'], 'Balançar o corpo e subir o trapézio', ['Elevação lateral']],
  ['Cable_Seated_Lateral_Raise', 'Elevação lateral na polia', 'ombros', 'Polia', ['Cabo passando na frente do corpo', 'Braço quase reto', 'Suba até a linha do ombro', 'Tensão constante, sem pausa embaixo'], 'Puxar com o trapézio', []],
  ['Front_Dumbbell_Raise', 'Elevação frontal', 'ombros', 'Halteres', ['Braços quase retos', 'Suba até a altura dos olhos', 'Alterne ou suba os dois juntos', 'Tronco parado'], 'Jogar o corpo para trás', ['Elevação frontal']],
  ['Seated_Bent-Over_Rear_Delt_Raise', 'Crucifixo inverso com halteres', 'ombros', 'Halteres', ['Sentado, tronco deitado sobre as coxas', 'Cotovelos levemente dobrados', 'Abra os braços para os lados', 'Aperte a parte de trás do ombro'], 'Juntar as escápulas e virar exercício de costas', ['Crucifixo inverso', 'Posterior de ombro']],
  ['Reverse_Flyes', 'Crucifixo inverso deitado', 'ombros', 'Halteres', ['Deitado de bruços no banco inclinado', 'Abra os braços em arco', 'Pausa de 1 segundo em cima', 'Carga leve'], 'Usar peso demais e perder a forma', []],
  ['Cable_Rear_Delt_Fly', 'Crucifixo inverso na polia', 'ombros', 'Polia', ['Cabos cruzados na altura do ombro', 'Abra os braços para trás', 'Cotovelos fixos', 'Volte devagar'], 'Encolher os ombros', ['Voador inverso']],
  ['Face_Pull', 'Face pull', 'ombros', 'Polia', ['Corda na altura do rosto', 'Puxe até o rosto abrindo as mãos', 'Cotovelos altos', 'Gire os ombros para fora no fim'], 'Puxar para o peito com os cotovelos baixos', []],
  ['Upright_Barbell_Row', 'Remada alta', 'ombros', 'Barra', ['Pegada na largura dos ombros', 'Suba a barra até o peito', 'Cotovelos acima das mãos', 'Pare na linha do ombro'], 'Subir acima do ombro e pinçar a articulação', ['Remada alta']],

  // ---------- Bíceps ----------
  ['Barbell_Curl', 'Rosca direta com barra', 'biceps', 'Barra', ['Cotovelos colados ao corpo', 'Suba sem mexer os ombros', 'Aperte o bíceps em cima', 'Desça até esticar quase inteiro'], 'Balançar o tronco para subir', ['Rosca direta']],
  ['EZ-Bar_Curl', 'Rosca com barra W', 'biceps', 'Barra W', ['Pegada nas curvas da barra', 'Cotovelos parados', 'Suba controlando', 'Desça em 2 segundos'], 'Cotovelos indo para frente', ['Rosca W']],
  ['Dumbbell_Bicep_Curl', 'Rosca alternada', 'biceps', 'Halteres', ['Gire a palma para cima enquanto sobe', 'Um braço de cada vez', 'Cotovelo fixo ao lado do corpo', 'Desça inteiro'], 'Girar o tronco', ['Rosca alternada']],
  ['Hammer_Curls', 'Rosca martelo', 'biceps', 'Halteres', ['Palmas viradas uma para a outra', 'Cotovelos parados', 'Suba até a altura do ombro', 'Trabalha braquial e antebraço'], 'Usar impulso', ['Martelo']],
  ['Incline_Dumbbell_Curl', 'Rosca inclinada', 'biceps', 'Halteres', ['Banco a 45°, braços pendurados', 'Cotovelo fica atrás do corpo', 'Suba sem trazer o cotovelo para frente', 'Ótimo alongamento embaixo'], 'Encurtar o movimento', []],
  ['Preacher_Curl', 'Rosca Scott', 'biceps', 'Barra', ['Axilas encaixadas no banco', 'Desça até quase esticar', 'Suba sem tirar o braço do apoio', 'Controle a descida'], 'Soltar o peso embaixo (risco de lesão)', ['Scott']],
  ['Concentration_Curls', 'Rosca concentrada', 'biceps', 'Halter', ['Sentado, cotovelo apoiado na parte interna da coxa', 'Suba girando o mindinho para fora', 'Aperte em cima', 'Desça devagar'], 'Mexer o ombro', ['Concentrada']],
  ['Cable_Hammer_Curls_-_Rope_Attachment', 'Rosca martelo na corda', 'biceps', 'Polia', ['Corda na polia baixa', 'Cotovelos fixos', 'Suba abrindo levemente a corda', 'Tensão constante'], 'Inclinar o corpo para trás', []],
  ['Machine_Bicep_Curl', 'Rosca máquina', 'biceps', 'Máquina', ['Cotovelo alinhado ao eixo da máquina', 'Suba controlado', 'Pausa em cima', 'Volte até esticar'], 'Banco mal ajustado', []],

  // ---------- Tríceps ----------
  ['Triceps_Pushdown_-_Rope_Attachment', 'Tríceps corda', 'triceps', 'Polia', ['Cotovelos colados no corpo', 'Empurre até esticar e abra a corda no fim', 'Só o antebraço se mexe', 'Volte até 90°'], 'Cotovelos subindo e descendo junto', ['Tríceps corda']],
  ['Triceps_Pushdown', 'Tríceps pulley (barra)', 'triceps', 'Polia', ['Cotovelos fixos ao lado do corpo', 'Estique inteiro embaixo', 'Tronco levemente inclinado', 'Volte devagar'], 'Usar o peso do corpo', ['Tríceps pulley', 'Tríceps barra']],
  ['Triceps_Pushdown_-_V-Bar_Attachment', 'Tríceps com barra V', 'triceps', 'Polia', ['Pegada neutra na barra V', 'Cotovelos fixos', 'Estique e aperte', 'Controle a volta'], 'Abrir os cotovelos', []],
  ['Cable_Rope_Overhead_Triceps_Extension', 'Tríceps francês na polia', 'triceps', 'Polia', ['De costas para a polia, corda atrás da cabeça', 'Cotovelos apontando para frente', 'Estique os braços à frente/cima', 'Ótimo para a cabeça longa'], 'Abrir os cotovelos para os lados', ['Tríceps francês']],
  ['Standing_Dumbbell_Triceps_Extension', 'Tríceps francês com halter', 'triceps', 'Halter', ['Halter segurado com as duas mãos atrás da cabeça', 'Cotovelos perto da cabeça', 'Estique para cima', 'Desça até alongar'], 'Arquear a lombar', ['Francês']],
  ['EZ-Bar_Skullcrusher', 'Tríceps testa', 'triceps', 'Barra W', ['Deitado, barra acima do peito', 'Dobre só os cotovelos, barra vai até a testa', 'Cotovelos apontando para cima', 'Estique sem travar'], 'Abrir os cotovelos', ['Testa', 'Tríceps testa']],
  ['Close-Grip_Barbell_Bench_Press', 'Supino fechado', 'triceps', 'Barra', ['Mãos na largura dos ombros', 'Cotovelos rentes ao corpo', 'Barra desce na parte baixa do peito', 'Empurre com o tríceps'], 'Mãos juntas demais (força o punho)', []],
  ['Dips_-_Triceps_Version', 'Paralelas para tríceps', 'triceps', 'Paralelas', ['Tronco reto, na vertical', 'Cotovelos para trás', 'Desça até 90°', 'Suba até esticar'], 'Descer demais', ['Paralelas tríceps']],
  ['Bench_Dips', 'Tríceps banco', 'triceps', 'Banco', ['Mãos na borda do banco', 'Costas rentes ao banco', 'Desça até 90° no cotovelo', 'Pernas dobradas para facilitar'], 'Ombros indo para frente', ['Mergulho no banco']],
  ['Tricep_Dumbbell_Kickback', 'Tríceps coice', 'triceps', 'Halter', ['Tronco inclinado, braço colado ao corpo', 'Cotovelo parado na altura do tronco', 'Estique o braço para trás', 'Aperte 1 segundo'], 'Balançar o braço', ['Coice']],
  ['Push-Ups_-_Close_Triceps_Position', 'Flexão fechada', 'triceps', 'Peso do corpo', ['Mãos embaixo do peito', 'Cotovelos rentes ao corpo', 'Corpo em prancha', 'Desça até quase tocar'], 'Abrir os cotovelos', ['Flexão diamante']],

  // ---------- Quadríceps ----------
  ['Barbell_Squat', 'Agachamento livre', 'quadriceps', 'Barra', ['Pés na largura dos ombros, pontas levemente para fora', 'Barra no trapézio, peito alto', 'Desça empurrando o quadril para trás e os joelhos para fora', 'Desça até pelo menos a coxa paralela, suba empurrando o chão'], 'Joelhos caindo para dentro ou calcanhar saindo do chão', ['Agachamento', 'Agachamento livre']],
  ['Front_Barbell_Squat', 'Agachamento frontal', 'quadriceps', 'Barra', ['Barra apoiada na frente dos ombros', 'Cotovelos altos', 'Tronco mais vertical', 'Desça fundo controlando'], 'Cotovelos caindo e a barra rolando', ['Front squat']],
  ['Goblet_Squat', 'Agachamento goblet', 'quadriceps', 'Kettlebell/halter', ['Peso segurado na frente do peito', 'Cotovelos entre os joelhos embaixo', 'Peito alto', 'Ótimo para aprender o agachamento'], 'Arredondar as costas', ['Goblet']],
  ['Smith_Machine_Squat', 'Agachamento no Smith', 'quadriceps', 'Smith', ['Pés um pouco à frente da barra', 'Desça até a coxa paralela', 'Costas retas', 'Trave o Smith ao terminar'], 'Pés muito atrás: força o joelho', []],
  ['Leg_Press', 'Leg press', 'quadriceps', 'Máquina', ['Pés na largura do quadril, no meio da plataforma', 'Desça até 90° sem tirar o quadril do banco', 'Empurre com o pé inteiro', 'Não trave os joelhos em cima'], 'Descer demais e tirar a lombar do encosto', ['Leg press', 'Leg 45']],
  ['Hack_Squat', 'Hack', 'quadriceps', 'Máquina', ['Costas inteiras no encosto', 'Pés no meio da plataforma', 'Desça fundo controlando', 'Suba sem travar'], 'Calcanhar saindo da plataforma', ['Hack machine']],
  ['Leg_Extensions', 'Cadeira extensora', 'quadriceps', 'Máquina', ['Joelho alinhado ao eixo da máquina', 'Estique inteiro e aperte 1 segundo', 'Desça devagar', 'Segure nos pegadores'], 'Jogar o peso e tirar o quadril do banco', ['Extensora', 'Cadeira extensora']],
  ['Dumbbell_Lunges', 'Avanço com halteres', 'quadriceps', 'Halteres', ['Passo largo à frente', 'Desça até o joelho de trás quase tocar o chão', 'Tronco reto', 'Empurre com o calcanhar da frente'], 'Joelho da frente caindo para dentro', ['Avanço', 'Afundo']],
  ['Barbell_Lunge', 'Avanço com barra', 'quadriceps', 'Barra', ['Barra no trapézio', 'Passo firme e controlado', 'Joelhos a 90°', 'Volte empurrando a perna da frente'], 'Passo curto demais', []],
  ['Bodyweight_Walking_Lunge', 'Avanço andando', 'quadriceps', 'Peso do corpo', ['Passos largos alternando as pernas', 'Joelho de trás quase toca o chão', 'Tronco ereto', 'Ritmo constante'], 'Perder o equilíbrio por passos estreitos', ['Passada']],
  ['Split_Squat_with_Dumbbells', 'Agachamento búlgaro', 'quadriceps', 'Halteres', ['Pé de trás apoiado num banco', 'Desça na vertical', 'Peso no calcanhar da frente', 'Tronco levemente inclinado foca glúteo'], 'Pé da frente muito perto do banco', ['Búlgaro']],
  ['Dumbbell_Step_Ups', 'Subida no banco', 'quadriceps', 'Halteres', ['Pé inteiro em cima do banco', 'Suba empurrando com a perna de cima', 'Não dê impulso com a de baixo', 'Desça controlando'], 'Impulsionar com a perna de trás', ['Step up']],

  // ---------- Posterior ----------
  ['Lying_Leg_Curls', 'Mesa flexora', 'posterior', 'Máquina', ['Joelho logo depois da borda do banco', 'Quadril colado no banco', 'Dobre até o calcanhar ir ao glúteo', 'Desça devagar'], 'Levantar o quadril', ['Mesa flexora', 'Flexora']],
  ['Seated_Leg_Curl', 'Cadeira flexora', 'posterior', 'Máquina', ['Coxa presa pelo apoio', 'Dobre o joelho ao máximo', 'Pausa e volte devagar', 'Pés relaxados'], 'Tirar a coxa do banco', ['Cadeira flexora']],
  ['Romanian_Deadlift', 'Stiff / terra romeno', 'posterior', 'Barra', ['Joelhos levemente dobrados e fixos', 'Leve o quadril para trás, barra rente às pernas', 'Desça até sentir alongar o posterior', 'Suba empurrando o quadril para frente'], 'Arredondar as costas para descer mais', ['Stiff', 'Terra romeno']],
  ['Stiff-Legged_Dumbbell_Deadlift', 'Stiff com halteres', 'posterior', 'Halteres', ['Halteres rentes às pernas', 'Quadril para trás', 'Coluna neutra', 'Desça até meia canela'], 'Dobrar demais os joelhos (vira terra)', []],
  ['Good_Morning', 'Bom dia', 'posterior', 'Barra', ['Barra no trapézio', 'Joelhos levemente dobrados', 'Incline o tronco levando o quadril para trás', 'Coluna reta o tempo todo'], 'Carga alta demais', ['Good morning']],
  ['Glute_Ham_Raise', 'Flexão nórdica', 'posterior', 'Banco/peso do corpo', ['Joelhos apoiados e pés presos', 'Desça o corpo reto bem devagar', 'Use as mãos para amortecer', 'Puxe de volta com o posterior'], 'Dobrar o quadril', ['Nórdica']],

  // ---------- Glúteos ----------
  ['Barbell_Hip_Thrust', 'Elevação pélvica', 'gluteos', 'Barra', ['Costas apoiadas no banco na altura das escápulas', 'Barra no quadril com proteção', 'Suba até o corpo ficar em linha reta', 'Queixo para baixo, aperte o glúteo 1 segundo'], 'Arquear a lombar em vez de subir com o quadril', ['Elevação pélvica', 'Hip thrust']],
  ['Barbell_Glute_Bridge', 'Ponte de glúteo', 'gluteos', 'Barra', ['Deitado no chão, joelhos dobrados', 'Barra sobre o quadril', 'Suba empurrando com os calcanhares', 'Aperte o glúteo em cima'], 'Empurrar com a ponta dos pés', ['Ponte']],
  ['Glute_Kickback', 'Coice de glúteo', 'gluteos', 'Peso do corpo', ['Quatro apoios, coluna neutra', 'Leve uma perna para trás e para cima', 'Joelho dobrado a 90°', 'Não gire o quadril'], 'Arquear a lombar', ['Coice']],
  ['Thigh_Abductor', 'Cadeira abdutora', 'gluteos', 'Máquina', ['Costas apoiadas', 'Abra as pernas controlando', 'Pausa de 1 segundo aberto', 'Volte devagar'], 'Bater o peso ao voltar', ['Abdutora']],
  ['Thigh_Adductor', 'Cadeira adutora', 'gluteos', 'Máquina', ['Costas apoiadas', 'Feche as pernas apertando', 'Volte controlando', 'Amplitude confortável'], 'Abrir demais no início', ['Adutora']],
  ['Pull_Through', 'Pull through na polia', 'gluteos', 'Polia', ['De costas para a polia, corda entre as pernas', 'Quadril para trás', 'Estenda o quadril apertando o glúteo', 'Braços só seguram'], 'Puxar com os braços', []],
  ['Single_Leg_Glute_Bridge', 'Ponte unilateral', 'gluteos', 'Peso do corpo', ['Uma perna estendida no ar', 'Suba com o calcanhar de apoio', 'Quadril alinhado', 'Pausa em cima'], 'Quadril caindo para um lado', []],

  // ---------- Panturrilha ----------
  ['Standing_Calf_Raises', 'Panturrilha em pé', 'panturrilha', 'Máquina', ['Ponta dos pés na borda', 'Desça até alongar bem', 'Suba o máximo e pause', 'Joelhos esticados (sem travar)'], 'Movimento curto e rápido', ['Panturrilha', 'Gêmeos']],
  ['Seated_Calf_Raise', 'Panturrilha sentado', 'panturrilha', 'Máquina', ['Apoio em cima das coxas', 'Desça até alongar', 'Suba pausando 1 segundo', 'Foco no sóleo'], 'Quicar embaixo', ['Sóleo']],
  ['Calf_Press_On_The_Leg_Press_Machine', 'Panturrilha no leg press', 'panturrilha', 'Máquina', ['Só a ponta dos pés na plataforma', 'Joelhos estendidos', 'Empurre e volte alongando', 'Não deixe a trava solta'], 'Dobrar os joelhos', []],

  // ---------- Abdômen ----------
  ['Crunches', 'Abdominal supra', 'abdomen', 'Peso do corpo', ['Lombar no chão', 'Suba enrolando a coluna, sem puxar o pescoço', 'Expire ao subir', 'Movimento curto e controlado'], 'Puxar a cabeça com as mãos', ['Abdominal', 'Supra']],
  ['Cable_Crunch', 'Abdominal na polia', 'abdomen', 'Polia', ['Ajoelhado, corda atrás da cabeça', 'Enrole a coluna levando os cotovelos aos joelhos', 'O quadril fica parado', 'Volte devagar'], 'Sentar sobre os calcanhares (puxar com o quadril)', ['Abdominal polia']],
  ['Plank', 'Prancha', 'abdomen', 'Peso do corpo', ['Cotovelos embaixo dos ombros', 'Corpo em linha reta', 'Glúteo e abdômen contraídos', 'Respire normalmente'], 'Quadril caindo ou muito alto', ['Prancha']],
  ['Side_Bridge', 'Prancha lateral', 'abdomen', 'Peso do corpo', ['Cotovelo embaixo do ombro', 'Quadril alto, corpo reto', 'Segure o tempo de cada lado', 'Olhar para frente'], 'Quadril caindo', ['Prancha lateral']],
  ['Hanging_Leg_Raise', 'Elevação de pernas na barra', 'abdomen', 'Barra fixa', ['Pendurado com os ombros ativos', 'Suba as pernas enrolando o quadril', 'Sem balançar', 'Desça devagar'], 'Balançar e subir só com o quadril', ['Elevação de pernas']],
  ['Flat_Bench_Lying_Leg_Raise', 'Elevação de pernas deitado', 'abdomen', 'Banco', ['Lombar colada no banco', 'Pernas quase retas', 'Suba até 90°', 'Desça sem tocar no banco'], 'Lombar descolando', ['Infra']],
  ['Russian_Twist', 'Giro russo', 'abdomen', 'Peso do corpo', ['Sentado, tronco inclinado para trás', 'Pés no chão (ou elevados para dificultar)', 'Gire o tronco de um lado ao outro', 'Movimento vem da cintura'], 'Mexer só os braços', []],
  ['Ab_Roller', 'Roda abdominal', 'abdomen', 'Roda', ['Ajoelhado, abdômen firme', 'Role à frente até onde mantiver a lombar neutra', 'Volte puxando com o abdômen', 'Aumente a distância aos poucos'], 'Lombar afundando', ['Rodinha']],
  ['Dead_Bug', 'Dead bug', 'abdomen', 'Peso do corpo', ['Deitado, braços e joelhos a 90° para cima', 'Estenda braço e perna opostos', 'Lombar sempre colada no chão', 'Alterne devagar'], 'Pressa e lombar subindo', []],
  ['Oblique_Crunches_-_On_The_Floor', 'Abdominal oblíquo', 'abdomen', 'Peso do corpo', ['Deitado de lado com joelhos dobrados', 'Suba o tronco de lado', 'Expire ao subir', 'Movimento curto'], 'Puxar o pescoço', ['Oblíquo']],
  ['Mountain_Climbers', 'Escalador', 'abdomen', 'Peso do corpo', ['Posição de prancha alta', 'Leve os joelhos ao peito alternando', 'Quadril baixo', 'Ritmo rápido e constante'], 'Quadril subindo', ['Mountain climber']],
  ['Pallof_Press', 'Pallof press', 'abdomen', 'Polia', ['De lado para a polia', 'Empurre o pegador à frente do peito', 'Não deixe o tronco girar', 'Segure 2 segundos'], 'Girar com o cabo', []],

  // ---------- Trapézio e antebraço ----------
  ['Barbell_Shrug', 'Encolhimento com barra', 'trapezio', 'Barra', ['Braços esticados', 'Suba os ombros em direção às orelhas', 'Pause 1 segundo', 'Sem girar os ombros'], 'Dobrar os cotovelos', ['Encolhimento']],
  ['Dumbbell_Shrug', 'Encolhimento com halteres', 'trapezio', 'Halteres', ['Halteres ao lado do corpo', 'Suba os ombros reto', 'Aperte em cima', 'Desça até alongar'], 'Movimento curto', []],
  ['Farmers_Walk', 'Caminhada do fazendeiro', 'antebraco', 'Halteres', ['Pesos pesados nas mãos', 'Peito alto, ombros para trás', 'Passos curtos e firmes', 'Aperte forte a pegada'], 'Curvar o tronco', ['Farmer walk']],
  ['Palms-Up_Barbell_Wrist_Curl_Over_A_Bench', 'Rosca de punho', 'antebraco', 'Barra', ['Antebraços apoiados no banco', 'Palmas para cima', 'Suba só o punho', 'Desça até alongar'], 'Levantar o antebraço do banco', ['Rosca punho']],
  ['Reverse_Barbell_Curl', 'Rosca inversa', 'antebraco', 'Barra', ['Pegada pronada', 'Cotovelos fixos', 'Suba controlado', 'Trabalha antebraço e braquial'], 'Punhos dobrando', []],

  // ---------- Cardio ----------
  ['Running_Treadmill', 'Corrida na esteira', 'cardio', 'Esteira', ['Aqueça 5 min caminhando', 'Passada curta, aterrissando embaixo do corpo', 'Braços a 90° balançando', 'Respiração ritmada'], 'Segurar no corrimão', ['Esteira', 'Corrida']],
  ['Walking_Treadmill', 'Caminhada inclinada', 'cardio', 'Esteira', ['Inclinação 8 a 12%', 'Ritmo em que dá para falar com esforço', 'Sem segurar no apoio', '20 a 40 min'], 'Segurar no painel (tira o trabalho)', ['Caminhada']],
  ['Bicycling_Stationary', 'Bicicleta ergométrica', 'cardio', 'Bike', ['Banco na altura do quadril', 'Joelho quase estica embaixo', 'Cadência constante', 'Varie com tiros de 30 s'], 'Banco baixo demais', ['Bike']],
  ['Rowing_Stationary', 'Remo ergômetro', 'cardio', 'Remo', ['Ordem: pernas, tronco, braços', 'Volta: braços, tronco, pernas', 'Costas retas', 'Força vem das pernas'], 'Puxar só com os braços', ['Remo']],
  ['Elliptical_Trainer', 'Elíptico', 'cardio', 'Elíptico', ['Postura ereta', 'Use braços e pernas', 'Resistência moderada', 'Pés inteiros nos pedais'], 'Apoiar o peso nos braços', ['Transport']],
  ['Stairmaster', 'Escada', 'cardio', 'Escada', ['Tronco ereto', 'Pé inteiro no degrau', 'Sem se apoiar no corrimão', 'Ritmo constante'], 'Inclinar sobre o painel', ['Simulador de escada']],
  ['Rope_Jumping', 'Pular corda', 'cardio', 'Corda', ['Saltos baixos na ponta dos pés', 'Giro vem dos punhos', 'Cotovelos perto do corpo', 'Comece com tiros de 30 s'], 'Saltar alto demais', ['Corda']],

  // ---------- Funcional ----------
  ['One-Arm_Kettlebell_Swings', 'Kettlebell swing', 'funcional', 'Kettlebell', ['Movimento de dobradiça do quadril, não agachamento', 'Explosão do quadril leva o peso', 'Braços só guiam', 'Peso sobe até a altura do peito'], 'Levantar com os braços', ['Swing']],
  ['Kettlebell_Thruster', 'Thruster', 'funcional', 'Kettlebell/halter', ['Agache com o peso nos ombros', 'Suba explodindo e empurre acima da cabeça', 'Um movimento contínuo', 'Abdômen firme'], 'Separar em dois movimentos', ['Thruster']],
  ['Box_Jump_Multiple_Response', 'Salto na caixa', 'funcional', 'Caixa', ['Braços ajudam no impulso', 'Aterrisse suave com os joelhos dobrados', 'Fique de pé em cima', 'Desça andando'], 'Caixa alta demais', ['Box jump']],
  ['Power_Clean', 'Power clean', 'funcional', 'Barra', ['Comece como no terra', 'Estenda quadril com explosão', 'Puxe o corpo para baixo da barra', 'Receba nos ombros com cotovelos altos'], 'Puxar com os braços cedo demais', ['Clean']],
  ['Push_Press', 'Push press', 'funcional', 'Barra', ['Barra nos ombros', 'Leve flexão de joelhos', 'Explosão das pernas leva a barra', 'Trave em cima'], 'Inclinar o tronco para trás', []],
  ['Kettlebell_Turkish_Get-Up_Squat_style', 'Levantamento turco', 'funcional', 'Kettlebell', ['Braço do peso sempre esticado', 'Olhe para o peso', 'Faça cada etapa devagar', 'Comece leve'], 'Pressa e perder o alinhamento do braço', ['Turkish get-up']],
  ['Sledgehammer_Swings', 'Marretada no pneu', 'funcional', 'Marreta', ['Pés afastados', 'Gire o quadril no golpe', 'Alterne os lados', 'Abdômen firme'], 'Golpear só com os braços', []]
];

// Fichas iniciais ligadas à biblioteca (id da imagem)
const ALIAS_EX = {};
EXERCICIOS.forEach((e) => { ALIAS_EX[e[1].toLowerCase()] = e[0]; (e[6] || []).forEach((a) => { if (!ALIAS_EX[a.toLowerCase()]) ALIAS_EX[a.toLowerCase()] = e[0]; }); });
