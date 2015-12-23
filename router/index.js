'use strict';
const _ = require('lodash');
const router = require('koa-router-parser');
const controllers = localRequire('controllers');
const middlewares = localRequire('middlewares');
const globals = localRequire('globals');
const sdc = localRequire('helpers/sdc');

// add route handler stats
router.addDefault('common', (ctx, next) => {
	const routePerformance = globals.get(
		'performance.route');
	if (!routePerformance.createdAt) {
		routePerformance.createdAt = (new Date()).toISOString();
	}
	const method = ctx.method.toUpperCase();
	_.forEach(ctx.matched, (layer => {
		const key = method + layer.path;
		sdc.increment('route.' + key);
		if (!routePerformance[key]) {
			routePerformance[key] = 1;
		} else {
			routePerformance[key]++;
		}
	}));
	return next();
});

addToRouter('c', controllers);
addToRouter('m.noCache', middlewares.common.noCache());
addToRouter('m.auth.admin', middlewares.auth.admin);
addToRouter('v', middlewares.template);
module.exports = getRouter(localRequire('router/config'));


/**
 * [addToRouter description]
 * @param {[type]} category [description]
 * @param {[type]} fns      [description]
 */
function addToRouter(category, fns) {
	if (_.isFunction(fns)) {
		router.add(category, fns);
		return;
	}
	_.forEach(fns, (v, k) => {
		/* istanbul ignore else */
		if (_.isFunction(v)) {
			router.add(category + '.' + k, v);
		} else if (_.isObject(v)) {
			addToRouter(category + '.' + k, v);
		} else {
			console.error(category + '.' + k + ' is invalid.');
		}
	});
}

/**
 * [getRouter description]
 * @param  {[type]} descList [description]
 * @return {[type]}          [description]
 */
function getRouter(descList) {
	return router.parse(descList);
}