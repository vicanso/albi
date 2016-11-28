const _ = require('lodash');
const performance = require('performance-nodejs');

const MB = 1024 * 1024;
const influx = localRequire('helpers/influx');
const globals = localRequire('helpers/globals');

const performanceData = {};

function reset() {
  const keys = 'total_physical_size total_heap_size_executable lag connectingTotal'.split(' ');
  _.forEach(keys, (key) => {
    performanceData[key] = -1;
  });
}

reset();
performance((data) => {
  const heap = data.heap;
  if (heap.total_physical_size > performanceData.total_physical_size) {
    performanceData.total_physical_size = heap.total_physical_size;
  }
  if (heap.total_heap_size_executable > performanceData.total_heap_size_executable) {
    performanceData.total_heap_size_executable = heap.total_heap_size_executable;
  }
  if (data.lag > performanceData.lag) {
    performanceData.lag = data.lag;
  }
  const connectingTotal = globals.get('connectingTotal');
  if (connectingTotal > performanceData.connectingTotal) {
    performanceData.connectingTotal = connectingTotal;
  }
}, 500);

module.exports = interval => setInterval(() => {
  const {
    lag,
    total_physical_size,
    connectingTotal,
    total_heap_size_executable,
  } = performanceData;
  const lagIndex = _.sortedIndex([10, 70], lag);
  const physical = parseInt(total_physical_size / MB, 10);
  const memoryIndex = _.sortedIndex([100, 200, 500], physical);
  const connectingIndex = _.sortedIndex([200, 500, 1000], connectingTotal);
  influx.write('performance', {
    lag,
    physical,
    exec: parseInt(total_heap_size_executable / MB, 10),
    connectingTotal,
  }, {
    status: ['free', 'normal', 'busy'][lagIndex],
    memory: ['low', 'mid', 'high', 'higher'][memoryIndex],
    connecting: ['fewer', 'few', 'medium', 'many'][connectingIndex],
  });
  reset();
}, interval).unref();
