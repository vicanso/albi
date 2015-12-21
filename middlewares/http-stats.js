'use strict';
const stats = require('koa-http-stats');
const globals = localRequire('globals');

module.exports = httpStats;

/**
 * [httpStats 统计http请求数，当前处理数，请求处理时间]
 * @return {[type]}          [description]
 */
function httpStats(options) {
	return stats(options, (performance) => {
		if (!performance.createdAt) {
			performance.createdAt = (new Date()).toISOString();
		}
		globals.set('performance.http', performance);
	});
}