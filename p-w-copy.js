'use strict';

const userFirstCard = process.argv[2]
  .split(',')
  .map(curNumb => parseInt(curNumb));

const userSecondCard = process.argv[3]
  .split(',')
  .map(curNumb => parseInt(curNumb));

if (!(userFirstCard) || !(userSecondCard)) {
  process.exit(1);
}

const cards = [];
for (let suit = 1; suit < 5; suit++) {
  for (let card = 0; card < 13; card++) {
    cards.push([card, suit]);
  }
}

const i5 = 2; const i4 = 31; const i3 = 33;

const commonFirstCard = cards[i3];
const commonSecondCard = cards[i4];
const commonThirdCard = cards[i5];
cards.splice(i3, 1);
cards.splice(i4, 1);
cards.splice(i5, 1);

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

console.log(cards);

let winCount = 0;
let gameCount = 0;
for (let i1 = 0; i1 < 46; i1++) {
  for (let i2 = i1 + 1; i2 < 47; i2++) {
//     for (let i3 = i2 + 1; i3 < 48; i3++) {
      // for (let i4 = i3 + 1; i4 < 49; i4++) {
      //   for (let i5 = i4 + 1; i5 < 50; i5++) {
          const userAndCommonCard = [
            [cards[i1][0], cards[i1][1]],
            [cards[i2][0], cards[i2][1]],
            // [cards[i3][0], cards[i3][1]],
            // [cards[i4][0], cards[i4][1]],
            // [cards[i5][0], cards[i5][1]],
            commonFirstCard,
            commonSecondCard,
            commonThirdCard,
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
          // remainingCards.splice(i5, 1);
          // remainingCards.splice(i4, 1);
          // remainingCards.splice(i3, 1);
          remainingCards.splice(i2, 1);
          remainingCards.splice(i1, 1);
          for (let enemyFirstCard = 0; enemyFirstCard < 44; enemyFirstCard++) {
            for (let enemySecondCard = enemyFirstCard + 1; enemySecondCard < 45; enemySecondCard++) {
              const enemyAndCommonCard = [
                [cards[i1][0], cards[i1][1]],
                [cards[i2][0], cards[i2][1]],
                // [cards[i3][0], cards[i3][1]],
                // [cards[i4][0], cards[i4][1]],
                // [cards[i5][0], cards[i5][1]],
                commonFirstCard,
                commonSecondCard,
                commonThirdCard,
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
//     }
//   }
// }

console.log('ОТВЕТ:', winCount / gameCount);

// // const testMap = [
// //   1, 2, 45, 16, 50, 49, 51
// // ];

// // const tempWrapper = iS =>
// //   combinationBySevenCards(iS.map(i => [i % 13, Math.floor(i / 13) + 1]));

// // console.log(tempWrapper(testMap));

function combinationBySevenCards(cards) {
  const dignities = cards
    .map(curCard => curCard[0])
    .sort((first, second) => first - second);
  const suitCount = new Set(cards.map(curCards => curCards[1])).size; // TODO: needed?

  // Royal Flush
  const suits = new Array(4).fill(0);
  for (const curCard of cards) {
    suits[curCard[1] - 1]++;
  }
  const maxSuitCount = Math.max(...suits);
  const maxSuit = suits.indexOf(maxSuitCount) + 1;
  if (cards.reduce((counter, cur) => {
    if (cur[1] === maxSuit && cur[0] > 7) {
      return ++counter;
    }
    return counter;
  }, 0) === 5) {
    return [ 99 ]; // royal-flush grade
  }

  // Straight Flush
  if (maxSuitCount > 4) {
    const necessaryDignities = cards
      .filter(curCard => curCard[1] === maxSuit)
      .map(curCard => curCard[0])
      .sort((first, second) => second - first);
    if (necessaryDignities[0] === 12) {
      necessaryDignities.push(-1);
    }
    let counter = 0;
    for (
      let curDignityIndex = 0;
      curDignityIndex < necessaryDignities.length - 1;
      curDignityIndex++
    ) {
      if (
        necessaryDignities[curDignityIndex] - 1 !==
        necessaryDignities[curDignityIndex + 1]
      ) {
        counter = 0;
      } else {
        counter++;
      }
      if (counter === 4) {
        return [ 90 + necessaryDignities[curDignityIndex] ];
      }
    }
  }

  // Four of a Kind
  const dignitiesCounts = new Array(13).fill(0);
  for (const curDignity of dignities) {
    dignitiesCounts[curDignity]++;
  }
  if (dignitiesCounts.includes(4)) {
    return [ 77 + dignitiesCounts.indexOf(4) ];
  }

  // Full House
  if (dignitiesCounts.includes(3)) {
    const grade = 64 + dignitiesCounts.lastIndexOf(3);
    if (dignitiesCounts.includes(2)) {
      const firstKiker = dignitiesCounts.lastIndexOf(2);
      return [grade, firstKiker];
    } else if (
      dignitiesCounts.lastIndexOf(3, dignitiesCounts.lastIndexOf(3) - 1) !== -1
    ) {
      const firstKiker = dignitiesCounts.indexOf(3);
      return [ grade, firstKiker ];
    }
  }

  //  Flush
  if (maxSuitCount > 4) {
    const necessaryDignities = cards
      .filter(curCard => curCard[1] === maxSuit)
      .map(curCard => curCard[0])
      .sort((first, second) => second - first);
    return [
      51 + necessaryDignities[0],
      necessaryDignities[1],
      necessaryDignities[2],
      necessaryDignities[3],
      necessaryDignities[4]
    ];
  }

  // Straight
  const dignitiesCopy = dignities.slice().reverse();
  if (dignitiesCopy[0] === 12) {
    dignitiesCopy.push(-1);
  }
  let counter = 0;
  for (
    let curDignityIndex = 0;
    curDignityIndex < dignitiesCopy.length - 1;
    curDignityIndex++
  ) {
    if (dignitiesCopy[curDignityIndex] === dignitiesCopy[curDignityIndex + 1]) {
      continue;
    }
    if (
      dignitiesCopy[curDignityIndex] - 1 !== dignitiesCopy[curDignityIndex + 1]
    ) {
      counter = 0;
    } else {
      counter++;
    }
    if (counter === 4) {
      return [ 46 + dignitiesCopy[curDignityIndex] ];
    }
  }

  // Set
  if (dignitiesCounts.includes(3)) {
    const grade = 33 + dignitiesCounts.indexOf(3);
    const firstKiker = dignitiesCounts.lastIndexOf(1);
    const secondKiker = dignitiesCounts.lastIndexOf(1, firstKiker - 1);
    return [
      grade,
      firstKiker,
      secondKiker
    ];
  }

  // Two pair
  if (dignitiesCounts.includes(2)) {
    const grade = 20 + dignitiesCounts.lastIndexOf(2);
    if (dignitiesCounts.lastIndexOf(2, dignitiesCounts.lastIndexOf(2) - 1) !== -1) {
      const firstKiker = dignitiesCounts.lastIndexOf(2, dignitiesCounts.lastIndexOf(2) - 1);
      if (dignitiesCounts.lastIndexOf(2, firstKiker - 1) !== -1) {
        dignitiesCounts[dignitiesCounts.lastIndexOf(2, firstKiker - 1)] = 1;
      }
      const secondKiker = dignitiesCounts.lastIndexOf(1);
      return [
        grade,
        firstKiker,
        secondKiker
      ];
    }
  }

  // One pair
  if (dignitiesCounts.includes(2)) {
    const grade = 8 + dignitiesCounts.lastIndexOf(2);
    const firstKiker = dignitiesCounts.lastIndexOf(1);
    dignitiesCounts[dignitiesCounts.lastIndexOf(1)] = 0;
    const secondKiker = dignitiesCounts.lastIndexOf(1);
    dignitiesCounts[dignitiesCounts.lastIndexOf(1)] = 0;
    const thirdKiker = dignitiesCounts.lastIndexOf(1);
    return [
      grade,
      firstKiker,
      secondKiker,
      thirdKiker
    ];
  }

  // High Card
  const grade = dignitiesCounts.lastIndexOf(1) - 5;
  dignitiesCounts[dignitiesCounts.lastIndexOf(1)] = 0;
  const firstKiker = dignitiesCounts.lastIndexOf(1);
  const secondKiker = dignitiesCounts.lastIndexOf(1, firstKiker - 1);
  const thirdKiker = dignitiesCounts.lastIndexOf(1, secondKiker - 1);
  const fouthKiker = dignitiesCounts.lastIndexOf(1, thirdKiker - 1);
  return [
    grade,
    firstKiker,
    secondKiker,
    thirdKiker,
    fouthKiker
  ];

//   } else if (suitCount === 1) { // streat flash
//     const dignitiesCopy = dignities.slice();
//     if (dignitiesCopy[4] === 12) {
//       dignitiesCopy.unshift(-1);
//       dignitiesCopy.pop();
//     }
//     if (dignitiesCopy.reduce((prev, cur) => prev + cur) === dignitiesCopy[0] * 5 + 10) { // 10 = 0 + 1 + 2 + 3 + 4
//       commonGrade = 87 + dignitiesCopy[4]; // 87 + 3 = 90 (3 is index of card fifth, 90 - start of streat flash grades)
//       // TODO: у нас стрит флеш
//       continue;
//     }
//   }
//   if ( // kare
//     new Set(dignities.slice(0, 4)).size === 1 ||
//     new Set(dignities.slice(1)).size === 1
//   ) {
//     // TODO: обработка
//     continue; // ничья
//   } else if (new Set(dignities).size === 2) { // full house
//     commonGrade = 64 + dignities[2]; // 64 - start of full house grades
//     const kiker = dignities[1] === dignities[2] ? dignities[3] : dignities[1];
//     continue;
//     // TODO: у нас фулхаус
//   } else if (suitCount === 1) { // flash
//     commonGrade = 51 + dignities[4]; // 51 = 56 - 5 (56 - start of flash grades, 5 - the minimum possible high card in a flush (seven))
//     const firstKiker = dignities[3];
//     const secondKiker = dignities[2];
//     const thirdKiker = dignities[1];
//     const fourthKiker = dignities[0];
//     // TODO: у нас флеш
//   } else { // streat
//     const dignitiesCopy = dignities.slice();
//     if (dignitiesCopy[4] === 12 && dignitiesCopy[3] !== 11) {
//       dignitiesCopy.unshift(-1);
//       dignitiesCopy.pop();
//     }
//     let continueFlag = false;
//     for (let curDignityIndex = 0; curDignityIndex < 4; curDignityIndex++) {
//       if (dignitiesCopy[curDignityIndex] + 1 !== dignitiesCopy[curDignityIndex + 1]) {
//         break;
//       }
//       if (curDignityIndex === 3) {
//         commonGrade = 43 + dignitiesCopy[4];
//         continueFlag = true;
//         // TODO: у нас стрит
//       }
//     }
//     if (continueFlag) continue;
//   }
//   if (dignities[2] === dignities[0]) { // set 0 = 1 = 2
//     commonGrade = 33 + dignities[2];
//     const firstKiker = Math.max(dignities[3], dignities[4]);
//     const secondKiker = Math.min(dignities[3], dignities[4]);
//     // TODO: у нас сет
//     continue;
//   } else if (dignities[3] === dignities[1]) { // set 1 = 2 = 3
//     commonGrade = 33 + dignities[2];
//     const firstKiker = Math.max(dignities[0], dignities[4]);
//     const secondKiker = Math.min(dignities[0], dignities[4]);
//     // TODO: у нас сет
//     continue;
//   } else if (dignities[4] === dignities[2]) { // set 2 = 3 = 4
//     commonGrade = 33 + dignities[2];
//     const firstKiker = Math.max(dignities[0], dignities[1]);
//     const secondKiker = Math.min(dignities[0], dignities[1]);
//     // TODO: у нас сет
//     continue;
//   } else if (new Set(dignities).size === 3) { // 2 pairs
//     commonGrade = 20 + dignities[3]; // 20 = 21 - 1 (21 - start of 2 pairs grades, 1 - min index of max pair)
//     const firstKiker = dignities[1];
//     const secondKiker = dignities[4] !== dignities[3] ? dignities[4] :
//       dignities[0] !== dignities[1] ? dignities[0] : dignities[2];
//     // TODO: у нас две пары
//     continue;
//   } else if (new Set(dignities).size === 4) { // pair
//     for (let curIndex = 0; curIndex < 4; curIndex++) {
//       if (dignities[curIndex] === dignities[curIndex + 1]) {
//         commonGrade = 8 + dignities[curIndex]; // 8 - start of pair grades
//         dignities.splice(curIndex, 2);
//         break;
//       }
//     }
//     const firstKiker = dignities[2];
//     const secondKiker = dignities[1];
//     const thirdKiker = dignities[0];
//     // TODO: у нас пара
//     continue;
//   } else { // high card
//     commonGrade = dignities[4] - 5; // 5 - 5 = 0 (5 - the lowest possible high card, 0 - start of hight card grades)
//     const firstKiker = dignities[3];
//     const secondKiker = dignities[2];
//     const thirdKiker = dignities[1];
//     const fourthKiker = dignities[0];
//     // TODO: у нас старшая карта
//   }
}
