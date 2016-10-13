const _ = require('lodash');
const performance = require('performance-nodejs');

const MB = 1024 * 1024;
const influx = localRequire('helpers/influx');

module.exports = interval => performance((data) => {
  const lag = Math.max(0, data.lag);
  const heapStats = data.heap;

  const lagIndex = _.sortedIndex([-1, 10, 70], lag);
  const physical = parseInt(heapStats.total_physical_size / MB, 10);
  const memoryIndex = _.sortedIndex([0, 100, 200, 500], physical);

  influx.write('performance', {
    lag,
    exec: parseInt(heapStats.total_heap_size_executable / MB, 10),
    physical,
  }, {
    status: ['', 'free', 'normal', 'busy'][lagIndex],
    memory: ['', 'low', 'mid', 'high'][memoryIndex],
  });
}, interval);
