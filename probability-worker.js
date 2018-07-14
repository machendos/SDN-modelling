'use strict';

const cpus = require('os').cpus().length;
const cp = require('child_process');


// const userFirstCard = process.argv[2]
// .split(',')
// .map(curNumb => parseInt(curNumb));

// const userSecondCard = process.argv[3]
// .split(',')
// .map(curNumb => parseInt(curNumb));

const summa = 0;

// if (!(userFirstCard) || !(userSecondCard)) {
//   process.exit(1);
// }

for (let cpu = 1; cpu <= cpus; cpu++) {
  const chPr = cp.fork(__dirname + '/worker.js', [
    process.argv[2],
    process.argv[3],
    (cpu - 1) * 3,
    cpu * 3 - cpu === 16 ? 2 : 1
  ]);
  chPr.on('message', (msg) => summa + msg);
}

console.log('ОТВЕТ:', summa);

// const cards = [];
// for (let suit = 1; suit < 5; suit++) {
//   for (let card = 0; card < 13; card++) {
//     cards.push([card, suit]);
//   }
// }

// for (
//   let curCardIndex = 0, curIteration = 0;
//   curIteration < 49;
//   curCardIndex++, curIteration++) {
//   if (
//     (cards[curCardIndex][0] === userFirstCard[0] &&
//       cards[curCardIndex][1] === userFirstCard[1]) ||
//     (cards[curCardIndex][0] === userSecondCard[0] &&
//       cards[curCardIndex][1] === userSecondCard[1])
//   ) {
//     cards.splice(curCardIndex, 1);
//     curCardIndex--;
//   }
// }

// let winCount = 0;
// let gameCount = 0;
// for (let i1 = 0; i1 < 46; i1++) {
//   for (let i2 = i1 + 1; i2 < 47; i2++) {
//     for (let i3 = i2 + 1; i3 < 48; i3++) {
//       for (let i4 = i3 + 1; i4 < 49; i4++) {
//         for (let i5 = i4 + 1; i5 < 50; i5++) {
//           const userAndCommonCard = [
//             [cards[i1][0], cards[i1][1]],
//             [cards[i2][0], cards[i2][1]],
//             [cards[i3][0], cards[i3][1]],
//             [cards[i4][0], cards[i4][1]],
//             [cards[i5][0], cards[i5][1]],
//             [userFirstCard[0], userFirstCard[1]],
//             [userSecondCard[0], userSecondCard[1]]
//           ];
//           const [
//             userGrade,
//             userFirstKiker = 0,
//             userSecondKiker = 0,
//             userThirdKiker = 0,
//             userFouthKiker = 0
//           ] = combinationBySevenCards(userAndCommonCard);
//           const remainingCards = cards.slice();
//           remainingCards.splice(i5, 1);
//           remainingCards.splice(i4, 1);
//           remainingCards.splice(i3, 1);
//           remainingCards.splice(i2, 1);
//           remainingCards.splice(i1, 1);
//           for (let enemyFirstCard = 0; enemyFirstCard < 44; enemyFirstCard++) {
//             for (let enemySecondCard = enemyFirstCard + 1; enemySecondCard < 45; enemySecondCard++) {
//               const enemyAndCommonCard = [
//                 [cards[i1][0], cards[i1][1]],
//                 [cards[i2][0], cards[i2][1]],
//                 [cards[i3][0], cards[i3][1]],
//                 [cards[i4][0], cards[i4][1]],
//                 [cards[i5][0], cards[i5][1]],
//                 [
//                   remainingCards[enemySecondCard][0],
//                   remainingCards[enemySecondCard][1]
//                 ],
//                 [
//                   remainingCards[enemyFirstCard][0],
//                   remainingCards[enemyFirstCard][1]
//                 ]
//               ];
//               const [
//                 enemyGrade,
//                 enemyFirstKiker = 0,
//                 enemySecondKiker = 0,
//                 enemyThirdKiker = 0,
//                 enemyFouthKiker = 0
//               ] = combinationBySevenCards(enemyAndCommonCard);

//               if (userGrade > enemyGrade) {
//                 winCount++;
//                 gameCount++;
//               } else if (userGrade < enemyGrade) {
//                 gameCount++;
//               } else if (userFirstKiker > enemyFirstKiker) {
//                 winCount++;
//                 gameCount++;
//               } else if (userFirstKiker < enemyFirstKiker) {
//                 gameCount++;
//               } else if (userSecondKiker > enemySecondKiker) {
//                 winCount++;
//                 gameCount++;
//               } else if (userSecondKiker < enemySecondKiker) {
//                 gameCount++;
//               } else if (userThirdKiker > enemyThirdKiker) {
//                 winCount++;
//                 gameCount++;
//               } else if (userThirdKiker < enemyThirdKiker) {
//                 gameCount++;
//               } else if (userFouthKiker > enemyFouthKiker) {
//                 winCount++;
//                 gameCount++;
//               } else if (userFouthKiker < enemyFouthKiker) {
//                 gameCount++;
//               } else {
//                 winCount += 0.5;
//                 gameCount++;
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

// console.log('ОТВЕТ:', winCount / gameCount);

// function combinationBySevenCards(cards) {
//   const dignities = cards
//     .map(curCard => curCard[0])
//     .sort((first, second) => first - second);
//   const suitCount = new Set(cards.map(curCards => curCards[1])).size; // TODO: needed?

//   // Royal Flush
//   const suits = new Array(4).fill(0);
//   for (const curCard of cards) {
//     suits[curCard[1] - 1]++;
//   }
//   const maxSuitCount = Math.max(...suits);
//   const maxSuit = suits.indexOf(maxSuitCount) + 1;
//   if (cards.reduce((counter, cur) => {
//     if (cur[1] === maxSuit && cur[0] > 7) {
//       return ++counter;
//     }
//     return counter;
//   }, 0) === 5) {
//     return [ 99 ];
//   }

//   // Straight Flush
//   if (maxSuitCount > 4) {
//     const necessaryDignities = cards
//       .filter(curCard => curCard[1] === maxSuit)
//       .map(curCard => curCard[0])
//       .sort((first, second) => second - first);
//     if (necessaryDignities[0] === 12) {
//       necessaryDignities.push(-1);
//     }
//     let counter = 0;
//     for (
//       let curDignityIndex = 0;
//       curDignityIndex < necessaryDignities.length - 1;
//       curDignityIndex++
//     ) {
//       if (
//         necessaryDignities[curDignityIndex] - 1 !==
//         necessaryDignities[curDignityIndex + 1]
//       ) {
//         counter = 0;
//       } else {
//         counter++;
//       }
//       if (counter === 4) {
//         return [ 90 + necessaryDignities[curDignityIndex] ];
//       }
//     }
//   }

//   // Four of a Kind
//   const dignitiesCounts = new Array(13).fill(0);
//   for (const curDignity of dignities) {
//     dignitiesCounts[curDignity]++;
//   }
//   if (dignitiesCounts.includes(4)) {
//     return [ 77 + dignitiesCounts.indexOf(4) ];
//   }

//   // Full House
//   if (dignitiesCounts.includes(3)) {
//     const grade = 64 + dignitiesCounts.lastIndexOf(3);
//     if (dignitiesCounts.includes(2)) {
//       const firstKiker = dignitiesCounts.lastIndexOf(2);
//       return [grade, firstKiker];
//     } else if (
//       dignitiesCounts.lastIndexOf(3, dignitiesCounts.lastIndexOf(3) - 1) !== -1
//     ) {
//       const firstKiker = dignitiesCounts.indexOf(3);
//       return [ grade, firstKiker ];
//     }
//   }

//   //  Flush
//   if (maxSuitCount > 4) {
//     const necessaryDignities = cards
//       .filter(curCard => curCard[1] === maxSuit)
//       .map(curCard => curCard[0])
//       .sort((first, second) => second - first);
//     return [
//       51 + necessaryDignities[0],
//       necessaryDignities[1],
//       necessaryDignities[2],
//       necessaryDignities[3],
//       necessaryDignities[4]
//     ];
//   }

//   // Straight
//   const dignitiesCopy = dignities.slice().reverse();
//   if (dignitiesCopy[0] === 12) {
//     dignitiesCopy.push(-1);
//   }
//   let counter = 0;
//   for (
//     let curDignityIndex = 0;
//     curDignityIndex < dignitiesCopy.length - 1;
//     curDignityIndex++
//   ) {
//     if (dignitiesCopy[curDignityIndex] === dignitiesCopy[curDignityIndex + 1]) {
//       continue;
//     }
//     if (
//       dignitiesCopy[curDignityIndex] - 1 !== dignitiesCopy[curDignityIndex + 1]
//     ) {
//       counter = 0;
//     } else {
//       counter++;
//     }
//     if (counter === 4) {
//       return [ 46 + dignitiesCopy[curDignityIndex] ];
//     }
//   }

//   // Set
//   if (dignitiesCounts.includes(3)) {
//     const grade = 33 + dignitiesCounts.indexOf(3);
//     const firstKiker = dignitiesCounts.lastIndexOf(1);
//     const secondKiker = dignitiesCounts.lastIndexOf(1, firstKiker - 1);
//     return [
//       grade,
//       firstKiker,
//       secondKiker
//     ];
//   }

//   // Two pair
//   if (dignitiesCounts.includes(2)) {
//     const grade = 20 + dignitiesCounts.lastIndexOf(2);
//     if (
//       dignitiesCounts.lastIndexOf(2, dignitiesCounts.lastIndexOf(2) - 1) !== -1
//     ) {
//       const firstKiker =
//         dignitiesCounts.lastIndexOf(2, dignitiesCounts.lastIndexOf(2) - 1);
//       if (dignitiesCounts.lastIndexOf(2, firstKiker - 1) !== -1) {
//         dignitiesCounts[dignitiesCounts.lastIndexOf(2, firstKiker - 1)] = 1;
//       }
//       const secondKiker = dignitiesCounts.lastIndexOf(1);
//       return [
//         grade,
//         firstKiker,
//         secondKiker
//       ];
//     }
//   }

//   // One pair
//   if (dignitiesCounts.includes(2)) {
//     const grade = 8 + dignitiesCounts.lastIndexOf(2);
//     const firstKiker = dignitiesCounts.lastIndexOf(1);
//     dignitiesCounts[dignitiesCounts.lastIndexOf(1)] = 0;
//     const secondKiker = dignitiesCounts.lastIndexOf(1);
//     dignitiesCounts[dignitiesCounts.lastIndexOf(1)] = 0;
//     const thirdKiker = dignitiesCounts.lastIndexOf(1);
//     return [
//       grade,
//       firstKiker,
//       secondKiker,
//       thirdKiker
//     ];
//   }

//   // High Card
//   const grade = dignitiesCounts.lastIndexOf(1) - 5;
//   dignitiesCounts[dignitiesCounts.lastIndexOf(1)] = 0;
//   const firstKiker = dignitiesCounts.lastIndexOf(1);
//   const secondKiker = dignitiesCounts.lastIndexOf(1, firstKiker - 1);
//   const thirdKiker = dignitiesCounts.lastIndexOf(1, secondKiker - 1);
//   const fouthKiker = dignitiesCounts.lastIndexOf(1, thirdKiker - 1);
//   return [
//     grade,
//     firstKiker,
//     secondKiker,
//     thirdKiker,
//     fouthKiker
//   ];
// }

// // process.send([1, 2, 3]);
