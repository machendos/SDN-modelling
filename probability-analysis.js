'use strict';

const cp = require('child_process');
const tasksPool = require(__dirname + '/pairsDB.json');

const d = cp.fork(__dirname + '/probability-worker.js', [ '9,4', '12,3' ]); // for tests

d.on('message', ms => console.log(ms));
