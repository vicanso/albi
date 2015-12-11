'use strict';
const stats = require('koa-http-stats');
const sdc = localRequire('helpers/sdc');
const globals = localRequire('globals');
const _ = require('lodash');

module.exports = httpStats;

/**
 * [httpStats 统计http请求数，当前处理数，请求处理时间]
 * @param  {[type]} interval [description]
 * @return {[type]}          [description]
 */
function httpStats(interval) {
	interval = interval || 30 * 60 * 1000;
	const options = {
		sdc: sdc
	};
	let timer = setInterval(resetHttpPerformance, interval);
	timer.unref();
	return stats(options, (performance) => {
		globals.set('performance.http', performance);
	});

	/**
	 * [resetHttpPerformance 重围performance]
	 * @return {[type]} [description]
	 */
	function resetHttpPerformance() {
		const performance = globals.get('performance.http');
		_.forEach(performance, function(v, k) {
			if (k === 'createdAt') {
				performance[k] = (new Date()).toISOString();
			} else if (_.isNumber(v)) {
				performance[k] = 0;
			}
			// 暂时记录的属性无此两种类型，如有必要再增加
			// else if (_.isString(v)) {
			// 	performance[k] = '';
			// } else if (_.isArray(v)) {
			// 	performance[k] = [];
			// }
			else {
				performance[k] = {};
			}
		});
	}
}