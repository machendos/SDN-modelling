'use strict';

const flop = require(__dirname + '/flop.js');
const turn = require(__dirname + '/turn.js');
const river = require(__dirname + '/river.js');
const probabilities = require(__dirname + '/probability-BD.json');

function calculator(
  cards
) {
  if (cards.length === 5) {
    return flop(cards);
  } else if (cards.length === 6) {
    return turn(cards);
  } else if (cards.length === 7) {
    return river(cards);
  } else if (cards.length === 2) {
    const userFirstCard = [
      cards[0] % 13,
      Math.floor(cards[0] / 13) + 1
    ];
    const userSecondCard = [
      cards[1] % 13,
      Math.floor(cards[1] / 13) + 1
    ];
    const maxDignity = Math.max(userFirstCard[0], userSecondCard[0]);
    const minDignity = Math.min(userFirstCard[0], userSecondCard[0]);
    return probabilities[maxDignity + ''][userFirstCard[1] === userSecondCard[1] ? 20 + minDignity + '' : minDignity + ''];
  } else {
    return new Error('Incorrect number of arguments');
  }
}

module.exports = calculator;
// console.log(calculator([25, 18]));