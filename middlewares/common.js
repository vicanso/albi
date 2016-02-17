'use strict';
const _ = require('lodash');
const httpError = localRequire('helpers/http-error');
const checker = require('koa-query-checker');
const noCacheQuery = checker('cache=false');
const uuid = require('node-uuid');


exports.noQuery = noQuery;
exports.deprecate = deprecate;
exports.noCache = noCache;
exports.noStore = noStore;

/**
 * [noQuery description]
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function noQuery() {
	return (ctx, next) => {
		if (_.isEmpty(ctx.query)) {
			return next();
		} else {
			throw httpError('query must be empty', 400);
		}
	};
}

/**
 * [deprecate description]
 * @param  {[type]} hint [description]
 * @return {[type]}      [description]
 */
function deprecate(hint, dueDay) {
	hint = hint || 'This request should not be used any more.';
	return (ctx, next) => {
		ctx.set('Warning', hint);
		if (dueDay) {
			ctx.set('X-Due-Day', dueDay);
		}
		console.warn(`deprecate - ${ctx.url} is still used.${hint}`);
		return next();
	};
}


/**
 * [noCache description]
 * @return {[type]} [description]
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


/**
 * [noStore description]
 * @return {[type]} [description]
 */
function noStore() {
	return (ctx, next) => {
		ctx.set('Cache-Control', 'no-store');
		ctx.set('ETag', uuid.v1());
		return next();
	};
}