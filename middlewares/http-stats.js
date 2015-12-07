'use strict';


module.exports = httpStats;

/**
 * [httpStats 统计http请求数，当前处理数，请求处理时间]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function httpStats(options) {

	return (ctx, next) => {
		return next();
	};
}