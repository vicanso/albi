'use strict';
const stats = require('koa-http-stats');
const globals = localRequire('globals');
const _ = require('lodash');

module.exports = httpStats;

/**
 * [httpStats 统计http请求数，当前处理数，请求处理时间]
 * @return {[type]}          [description]
 */
function httpStats(options) {
	const tagKeys = 'statusDesc timeLevel sizeLevel'.split(' ');
	return stats(options, (performance, statsData) => {
		if (!performance.createdAt) {
			performance.createdAt = (new Date()).toISOString();
		}
		globals.set('performance.http', performance);

		console.dir(_.pick(statsData, tagKeys));
		console.dir(_.omit(statsData, tagKeys));

	});
}