'use strict';
const _ = require('lodash');
const router = require('koa-router-parser');
const controllers = localRequire('controllers');
const middlewares = localRequire('middlewares');


addToRouter('c', controllers);
addToRouter('m.noCache', middlewares['no-cache']());
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