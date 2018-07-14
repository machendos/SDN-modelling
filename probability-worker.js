'use strict';

const combinationBySevenCards = require(__dirname + '/seven-grade.js');

const userFirstCard = process.argv[2]
  .split(',')
  .map(curNumb => parseInt(curNumb));

const userSecondCard = process.argv[3]
  .split(',')
  .map(curNumb => parseInt(curNumb));

const commonStart = parseInt(process.argv[4]);
const commonFinish = parseInt(process.argv[5]);

const cards = [];
for (let suit = 1; suit < 5; suit++) {
  for (let card = 0; card < 13; card++) {
    cards.push([card, suit]);
  }
}

for (
  let curCardIndex = 0, curIteration = 0;
  curIteration < 49;
  curCardIndex++, curIteration++) {
  if (
    (cards[curCardIndex][0] === userFirstCard[0] &&
      cards[curCardIndex][1] === userFirstCard[1]) ||
    (cards[curCardIndex][0] === userSecondCard[0] &&
      cards[curCardIndex][1] === userSecondCard[1])
  ) {
    cards.splice(curCardIndex, 1);
    curCardIndex--;
  }
}

let winCount = 0;
let gameCount = 0;
for (let i1 = commonStart; i1 < commonFinish + 1; i1++) {
  for (let i2 = i1 + 1; i2 < 47; i2++) {
    for (let i3 = i2 + 1; i3 < 48; i3++) {
      for (let i4 = i3 + 1; i4 < 49; i4++) {
        for (let i5 = i4 + 1; i5 < 50; i5++) {
          const userAndCommonCard = [
            [cards[i1][0], cards[i1][1]],
            [cards[i2][0], cards[i2][1]],
            [cards[i3][0], cards[i3][1]],
            [cards[i4][0], cards[i4][1]],
            [cards[i5][0], cards[i5][1]],
            [userFirstCard[0], userFirstCard[1]],
            [userSecondCard[0], userSecondCard[1]]
          ];
          const [
            userGrade,
            userFirstKiker = 0,
            userSecondKiker = 0,
            userThirdKiker = 0,
            userFouthKiker = 0
          ] = combinationBySevenCards(userAndCommonCard);
          const remainingCards = cards.slice();
          remainingCards.splice(i5, 1);
          remainingCards.splice(i4, 1);
          remainingCards.splice(i3, 1);
          remainingCards.splice(i2, 1);
          remainingCards.splice(i1, 1);
          for (let enemyFirstCard = 0; enemyFirstCard < 44; enemyFirstCard++) {
            for (
              let enemySecondCard = enemyFirstCard + 1;
              enemySecondCard < 45;
              enemySecondCard++
            ) {
              const enemyAndCommonCard = [
                [cards[i1][0], cards[i1][1]],
                [cards[i2][0], cards[i2][1]],
                [cards[i3][0], cards[i3][1]],
                [cards[i4][0], cards[i4][1]],
                [cards[i5][0], cards[i5][1]],
                [
                  remainingCards[enemySecondCard][0],
                  remainingCards[enemySecondCard][1]
                ],
                [
                  remainingCards[enemyFirstCard][0],
                  remainingCards[enemyFirstCard][1]
                ]
              ];
              const [
                enemyGrade,
                enemyFirstKiker = 0,
                enemySecondKiker = 0,
                enemyThirdKiker = 0,
                enemyFouthKiker = 0
              ] = combinationBySevenCards(enemyAndCommonCard);

              if (userGrade > enemyGrade) {
                winCount++;
                gameCount++;
              } else if (userGrade < enemyGrade) {
                gameCount++;
              } else if (userFirstKiker > enemyFirstKiker) {
                winCount++;
                gameCount++;
              } else if (userFirstKiker < enemyFirstKiker) {
                gameCount++;
              } else if (userSecondKiker > enemySecondKiker) {
                winCount++;
                gameCount++;
              } else if (userSecondKiker < enemySecondKiker) {
                gameCount++;
              } else if (userThirdKiker > enemyThirdKiker) {
                winCount++;
                gameCount++;
              } else if (userThirdKiker < enemyThirdKiker) {
                gameCount++;
              } else if (userFouthKiker > enemyFouthKiker) {
                winCount++;
                gameCount++;
              } else if (userFouthKiker < enemyFouthKiker) {
                gameCount++;
              } else {
                winCount += 0.5;
                gameCount++;
              }
            }
          }
        }
      }
    }
  }
}

process.send(winCount / gameCount);
