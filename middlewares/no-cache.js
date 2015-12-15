'use strict';
const checker = require('koa-query-checker');
const noCacheQuery = checker('cache=false');
module.exports = noCache;

/**
 * [noCache description]
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function noCache() {
	return (ctx, next) => {
		const method = ctx.method.toUpperCase();
		if ((method !== 'GET' && method !== 'HEAD') || ctx.get('Cache-Control') === 'no-cache') {
			return next();
		} else {
			return noCacheQuery(ctx, next);
		}
	};
}