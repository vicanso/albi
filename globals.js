'use strict';
const _ = require('lodash');
const globals = {
	// running, pause
	status: 'running',

	performance: {
		// 参考middlewares/http-stats
		http: {},
		// tasks/performance
		lag: 0,
		// tasks/performance
		memory: {
			exec: '0KB',
			physical: '0KB'
		},
		// router/index
		route: {},
		// middlewares/limit
		concurrency: 'low'
	}
};

exports.get = get;
exports.set = set;

/**
 * [get description]
 * @param  {[type]} k [description]
 * @return {[type]}   [description]
 */
function get(k) {
	if (k) {
		return _.get(globals, k);
	}
}

/**
 * [set description]
 * @param {[type]} k [description]
 * @param {[type]} v [description]
 */
function set(k, v) {
	if (k) {
		_.set(globals, k, v);
	}
}