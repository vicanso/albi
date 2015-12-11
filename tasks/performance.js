'use strict';
const v8 = require('v8');
const bytes = require('bytes');
const toobusy = require('toobusy-js');
const _ = require('lodash');
const config = localRequire('config');
const globals = localRequire('globals');
const MB = 1024 * 1024;

module.exports = run;

/**
 * [run description]
 * @param  {[type]} interval [description]
 * @param  {[type]} sdc      [description]
 * @return {[type]}          [description]
 */
function run(interval, sdc) {
	const heapStats = v8.getHeapStatistics();
	const totalHeapSize = bytes(heapStats.total_heap_size);
	const totalHeapSizeExec = bytes(heapStats.total_heap_size_executable);
	const physicalTotal = bytes(heapStats.total_physical_size);
	const usedHeapSize = bytes(heapStats.used_heap_size);
	const lag = toobusy.lag();
	if (config.env === 'development' || heapStats.total_physical_size > 100 * 1024 * 1024 || lag > 70) {
		console.info(`system performance memory exec:${totalHeapSizeExec} use:${usedHeapSize} total:${totalHeapSize} physical:${physicalTotal} lag:${lag}`);
	}
	sdc.set('lag', lag);
	sdc.set('memory.exec', parseInt(heapStats.total_heap_size_executable / MB));
	sdc.set('memory.physical', parseInt(heapStats.total_physical_size / MB));

	globals.set('performance.lag', lag);
	globals.set('performance.memory', {
		exec: totalHeapSizeExec,
		physical: physicalTotal
	});
	const timer = setTimeout(() => {
		run(interval, sdc);
	}, interval);
	timer.unref();
}