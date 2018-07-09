'use strict';

const firstCard = process.argv[2]
  .split(',')
  .map(curNumb => parseInt(curNumb));

const secondCard = process.argv[3]
  .split(',')
  .map(curNumb => parseInt(curNumb));

if (!(firstCard) || !(secondCard)) {
  process.exit(1);
}

const cards = [];
for (let suit = 1; suit < 5; suit++) {
  for (let card = 0; card < 13; card++) {
    if (
      (card !== firstCard[0] || suit !== firstCard[1]) &&
      (card !== secondCard[0] || suit !== secondCard[1])
    ) cards.push([card, suit]);
  }
} // now in the array are 50 cards (without firstCard and secondCard)

for (let i1 = 0; i1 < 46; i1++) {
  for (let i2 = i1 + 1; i2 < 47; i2++) {
    for (let i3 = i2 + 1; i3 < 48; i3++) {
      for (let i4 = i3 + 1; i4 < 49; i4++) {
        for (let i5 = i4 + 1; i5 < 50; i5++) {
          const commonCard = new Map([
            [cards[i1][0] + 13 * (cards[i1][1] - 1), cards[i1][1]],
            [cards[i2][0] + 13 * (cards[i2][1] - 1), cards[i2][1]],
            [cards[i3][0] + 13 * (cards[i3][1] - 1), cards[i3][1]],
            [cards[i4][0] + 13 * (cards[i4][1] - 1), cards[i4][1]],
            [cards[i5][0] + 13 * (cards[i5][1] - 1), cards[i5][1]],
          ]);
          let commonGrade = 0;
          const dignities = [...commonCard.keys()]
            .map(curDignity => curDignity % 13)
            .sort((first, second) => first - second);
          const suitCount = new Set(commonCard.values()).size;
          if ( // royal flash
            suitCount === 1 &&
            dignities.reduce((prev, cur) => prev + cur) === 50
          // 50 = 8 + 9 + 10 + 11 + 12 - summ cards for royal flash
          ) {
            // TODO: обработка
            continue; // ничья
          } else if (suitCount === 1) { // streat flash
            const dignitiesCopy = dignities.slice();
            if (dignitiesCopy[4] === 12) {
              dignitiesCopy.unshift(-1);
              dignitiesCopy.pop();
            }
            if (dignitiesCopy.reduce((prev, cur) => prev + cur) === dignitiesCopy[0] * 5 + 10) { // 10 = 0 + 1 + 2 + 3 + 4
              commonGrade = 87 + dignitiesCopy[4]; // 87 + 3 = 90 (3 is index of card fifth, 90 - start of streat flash grades)
              // TODO: у нас стрит флеш
              continue;
            }
          }
          if ( // kare
            new Set(dignities.slice(0, 4)).size === 1 ||
            new Set(dignities.slice(1)).size === 1
          ) {
            // TODO: обработка
            continue; // ничья
          } else if (new Set(dignities).size === 2) { // full house
            commonGrade = 64 + dignities[2]; // 64 - start of full house grades
            const kiker = dignities[1] === dignities[2] ? dignities[3] : dignities[1];
            continue;
            // TODO: у нас фулхаус
          } else if (suitCount === 1) { // flash
            commonGrade = 51 + dignities[4]; // 51 = 56 - 5 (56 - start of flash grades, 5 - the minimum possible high card in a flush (seven))
            const firstKiker = dignities[3];
            const secondKiker = dignities[2];
            const thirdKiker = dignities[1];
            const fourthKiker = dignities[0];
            // TODO: у нас флеш
          } else { // streat
            const dignitiesCopy = dignities.slice();
            if (dignitiesCopy[4] === 12 && dignitiesCopy[3] !== 11) {
              dignitiesCopy.unshift(-1);
              dignitiesCopy.pop();
            }
            let continueFlag = false;
            for (let curDignityIndex = 0; curDignityIndex < 4; curDignityIndex++) {
              if (dignitiesCopy[curDignityIndex] + 1 !== dignitiesCopy[curDignityIndex + 1]) {
                break;
              }
              if (curDignityIndex === 3) {
                commonGrade = 43 + dignitiesCopy[4];
                continueFlag = true;
                // TODO: у нас стрит
              }
            }
            if (continueFlag) continue;
          }
          if (dignities[2] === dignities[0]) { // set 0 = 1 = 2
            commonGrade = 33 + dignities[2];
            const firstKiker = Math.max(dignities[3], dignities[4]);
            const secondKiker = Math.min(dignities[3], dignities[4]);
            // TODO: у нас сет
            continue;
          } else if (dignities[3] === dignities[1]) { // set 1 = 2 = 3
            commonGrade = 33 + dignities[2];
            const firstKiker = Math.max(dignities[0], dignities[4]);
            const secondKiker = Math.min(dignities[0], dignities[4]);
            // TODO: у нас сет
            continue;
          } else if (dignities[4] === dignities[2]) { // set 2 = 3 = 4
            commonGrade = 33 + dignities[2];
            const firstKiker = Math.max(dignities[0], dignities[1]);
            const secondKiker = Math.min(dignities[0], dignities[1]);
            // TODO: у нас сет
            continue;
          } else if (new Set(dignities).size === 3) { // 2 pairs
            commonGrade = 20 + dignities[3]; // 20 = 21 - 1 (21 - start of 2 pairs grades, 1 - min index of max pair)
            const firstKiker = dignities[1];
            const secondKiker = dignities[4] !== dignities[3] ? dignities[4] :
              dignities[0] !== dignities[1] ? dignities[0] : dignities[2];
            // TODO: у нас две пары
            continue;
          } else if (new Set(dignities).size === 4) { // pair
            for (let curIndex = 0; curIndex < 4; curIndex++) {
              if (dignities[curIndex] === dignities[curIndex + 1]) {
                commonGrade = 8 + dignities[curIndex]; // 8 - start of pair grades
                dignities.splice(curIndex, 2);
                break;
              }
            }
            const firstKiker = dignities[2];
            const secondKiker = dignities[1];
            const thirdKiker = dignities[0];
            // TODO: у нас пара
            continue;
          } else { // high card
            commonGrade = dignities[4] - 5; // 5 - 5 = 0 (5 - the lowest possible high card, 0 - start of hight card grades)
            const firstKiker = dignities[3];
            const secondKiker = dignities[2];
            const thirdKiker = dignities[1];
            const fourthKiker = dignities[0];
            // TODO: у нас старшая карта
          }

          
          
        }
      }
    }
  }
}

function confrontation(
  index1, index2, index3, index4, index5,
  commonGrade,
  firstKiker = 0,
  secondKiker = 0,
  thirdKiker = 0,
  fourthKiker = 0
) {
  const remainingCards = cards.slice();
  remainingCards.splice(index5, 1);
  remainingCards.splice(index4, 1);
  remainingCards.splice(index3, 1);
  remainingCards.splice(index2, 1);
  remainingCards.splice(index1, 1);
  for (const enemyFirstCardString in remainingCards.slice(0, -1)) {
    const enemyFirstCard = parseInt(enemyFirstCardString);
    for (let enemySecondCard = enemyFirstCard + 1; enemySecondCard < 50; enemySecondCard++) {
      // известны 7 + 2 карт

      // start remaining

    }
  }
  
}
