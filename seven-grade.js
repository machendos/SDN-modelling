'use strict';

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
    return [ 99 ];
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
    if (
      dignitiesCounts.lastIndexOf(2, dignitiesCounts.lastIndexOf(2) - 1) !== -1
    ) {
      const firstKiker =
        dignitiesCounts.lastIndexOf(2, dignitiesCounts.lastIndexOf(2) - 1);
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
}

module.exports = combinationBySevenCards;
