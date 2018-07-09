'use strict';

const cp = require('child_process');
const tasksPool = require(__dirname + '/pairsDB.json');

cp.fork(__dirname + '/probability-worker.js', [ '1,1', '12,3' ]); // for tests
