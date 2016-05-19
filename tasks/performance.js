'use strict';
const v8 = require('v8');
const bytes = require('bytes');
const _ = require('lodash');
const MB = 1024 * 1024;
const influx = localRequire('helpers/influx');
const performance = require('performance-nodejs');

module.exports = (interval) => performance(data => {
  const lag = Math.max(0, data.lag);
  const heapStats = data.heap;

  const lagIndex = _.sortedIndex([-1, 10, 70], lag);
  const physical = parseInt(heapStats.total_physical_size / MB);
  const memoryIndex = _.sortedIndex([0, 100, 200, 500], physical);

  influx.write('performance', {
    lag,
    exec: parseInt(heapStats.total_heap_size_executable / MB),
    physical,
  }, {
    status : ['', 'free', 'normal', 'busy'][lagIndex],
    memory: ['', 'low', 'mid', 'high'][memoryIndex],
  });
}, interval);
