'use strict';
const globals = localRequire('globals');
const stats = localRequire('helpers/stats');
const _ = require('lodash');

module.exports = httpStats;

/**
 * [httpStats 统计http请求数，当前处理数，请求处理时间]
 * @return {[type]}          [description]
 */
function httpStats(options) {
	const tagKeys = 'statusDesc timeLevel sizeLevel'.split(' ');
	return require('koa-http-stats')(options, (performance, statsData) => {
		if (!performance.createdAt) {
			performance.createdAt = (new Date()).toISOString();
		}
		globals.set('performance.http', performance);
		stats.write('http', _.pick(statsData, tagKeys), _.omit(statsData, tagKeys));
	});
}