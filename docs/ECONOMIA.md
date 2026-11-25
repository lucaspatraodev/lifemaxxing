# Economia do Lifemaxxing

Regra de ouro: **todo dinheiro é porcentagem do montante da quinzena**, com teto exato. Fazer mais missões nunca libera mais do que o previsto. O XP extra vai só para o nível.

## 1. Montante da quinzena

```
dinheiro livre = (entrada − fixos) × fator de dias + travado que sobrou da quinzena anterior
```

- **Fator de dias:** 1 numa quinzena cheia. Se o app começou no meio (adaptação), é dias que restam ÷ dias da quinzena.
- Os R$300 da **Caixa de viagem** são um fixo, liberado inteiro no dia do pagamento, fora deste cálculo.

O livre se divide assim:

| Pote | Parte | Com R$935 | Como libera |
| --- | --- | --- | --- |
| Delivery | R$60 fixos (× fator) | R$60 | 2 tickets de R$30, um a cada 4 dias bons seguidos |
| XP | 40% do resto | R$350 | por XP, até a meta (seção 3) |
| Terça e sexta | 30% do resto | R$262,50 | pelos dias bons, nos cortes da meia-noite |
| Baú | 15% do resto | R$131,25 | um baú por dia (seção 4) |
| Desafio | 15% do resto | R$131,25 | missão da quinzena cumprida |

A soma dos potes é exatamente o livre.

## 2. XP por missão (por dificuldade)

**Obrigações** (somam 205 XP por dia):

| Missão | XP | Por quê |
| --- | --- | --- |
| Dentes | 15 (3 × 5: manhã, tarde, noite) | fácil e rápida |
| Skincare | 15 | rápida, exige constância |
| Sair de casa 15 min | 15 | vencer a inércia |
| Frutas (2) | 16 (8 cada) | fácil |
| Dormir no horário | 20 | difícil à noite |
| Água (3 garrafas) | 24 (8 cada) | constância o dia todo |
| Arrumar o quarto (manhã e tarde) | 40 (20 cada) | chata |
| 1h sem celular (manhã e tarde) | 60 (30 cada) | a mais difícil; tem cronômetro |

**Dia bom** (todas as obrigações): +50 XP.

**Bônus** (opcionais, uma vez por dia cada):

| Bônus | XP |
| --- | --- |
| Sol 15 min | 20 |
| Menos tela | 30 |
| Natureza | 40 |
| Estudar 1h (cronômetro) | 60 |
| Desenvolver 1h (cronômetro) | 60 |
| Treino | 100, +25 por recorde (até 2), +20 com intensidade 8+, +20 acima de 45 min |
| Surf | 150, +20 com intensidade 8+, +20 acima de 45 min |

**Extras de rotina:** 3 treinos na semana (sexta a quinta) dão +150. A cada 7 dias bons seguidos, +100.

## 3. XP em dinheiro

```
dia ideal      = obrigações (205) + dia bom (50) + bônus-alvo (150) = 405 XP
meta da quinzena = dias úteis × dia ideal          (15 dias → 6.000 XP)
valor de 100 XP  = pote de XP × 100 ÷ meta         (R$350 → R$5,83)
liberado por XP  = mín(pote de XP, ⌊XP ÷ 100⌋ × valor de 100 XP)
```

Na prática:
- **Só obrigações perfeitas** (250 por dia) liberam 62,5% do pote de XP.
- **Obrigações e uns 150 XP de bônus por dia** liberam 100%.
- **Passou da meta:** o dinheiro não aumenta mais.

O bônus-alvo pode ser mudado em `xpBonusAlvoDia` (data.js).

## 4. Baú do dia

O **primeiro bônus de cada dia** abre um baú. Os outros bônus do mesmo dia dão só XP.

```
b = pote de baús ÷ (1,7 × dias úteis)        (R$131,25 em 15 dias → b = R$5,15)
prêmio: vazio 40% · 1b 30% · 3b 20% · 8b 10% (R$0 · R$5,15 · R$15,44 · R$41,18)
valor esperado por baú = 1,7b  →  15 baús pagam, em média, o pote inteiro
```

- **Baú de nível:** de 2b a 4b, do mesmo pote.
- **Pote acabou:** os baús param de pagar.

## 5. Terça e sexta, saque e teto

- **Cortes:** à meia-noite que começa a terça (paga os dias bons de sexta a segunda, 1 parte) e a sexta (paga os de terça a quinta, 2 partes). A sexta tem +20% com a semana toda boa e +20% com 3 treinos, sem passar do pote.
- **Saque:** um por terça e sexta, depois das obrigações da manhã. Pode ser total ou parcial.
- **Teto do saque:** sobe uma fatia por saque (terça 1, sexta 2) até 100% no último da quinzena. O que passar do teto fica para o próximo saque.

## 6. Fim da quinzena

- **Disponível não sacado** e tickets que sobraram passam para a próxima quinzena, como disponível.
- **Travado** soma no livre da próxima quinzena, que então tem potes maiores. Com mais montante, as missões valem mais.
- **Conta sempre fecha:** sacado + descontos + o que passa disponível + o que passa travado = livre + saldo anterior. Testado com centavos exatos.

## 7. Simulação (quinzena cheia, R$935)

| Perfil | XP | Liberado |
| --- | --- | --- |
| Só obrigações, todo dia | 3.950 | R$561 (60%) |
| Obrigações + 2 bônus/dia + treino dia sim, dia não | 5.960 | R$929 (99%) |
| Tudo, todo dia | 12.100 | R$935 (100%, teto) |

## Caixa bloqueada (punição por dano)

Cada dano registrado (fumar, beber, delivery) pode bloquear um valor fixo, configurável em Progresso › Danos › Configurar (padrão: fumar R$10, beber R$10, delivery R$0; opção "só acima da meta").

- O valor sai do montante desta quinzena, da parte que ainda não foi liberada: cada pote (XP, terça/sexta, baú, desafio) perde a sua fatia, na proporção do que ainda falta liberar. O valor por XP não muda; o pote só enche antes.
- O disponível para saque não muda. Nunca bloqueia mais do que falta liberar.
- O dinheiro não some. No fechamento da quinzena ele soma ao travado que passa (`travadoPassa`) e entra no livre da próxima quinzena.
- Apagar o registro do dano devolve o bloqueio dele.
- O caixa continua fechando em 0: entrada = sacado + descontos + carry + travadoPassa (com o bloqueado dentro).

## Desafios pessoais e o pote de desafios

- Você cria um desafio (o que vai fazer + quantos dias). Começa no dia em que cria e precisa ser marcado todo dia; um dia fechado sem marcação quebra o desafio.
- Surf vale 120 XP no total (antes 150): **90 para você e 30 para o pote de desafios** (`S.poteDesafios`). Bônus de intensidade e duração continuam sendo seus. Desfazer o surf tira os 30 do pote.
- O pote é uma reserva permanente: não zera no fim da quinzena e vai acumulando a cada surf.
- Completar um desafio paga `dias × 10 XP` do pote. Se o pote tiver menos, paga o que tem.
- O XP pago entra no XP da quinzena normalmente; como ele saiu do surf, a economia de dinheiro continua previsível.
