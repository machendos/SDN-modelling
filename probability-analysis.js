'use strict';

const cpus = require('os').cpus().length;
const cp = require('child_process');

const probability = 0;

for (let cpu = 1; cpu <= cpus; cpu++) {
  const chPr = cp.fork(__dirname + '/worker.js', [
    process.argv[2],
    process.argv[3],
    (cpu - 1) * 3,
    cpu * 3 - cpu === 16 ? 2 : 1
  ]);
  chPr.on('message', (msg) => probability + msg);
}

console.log('probability: ', probability);
