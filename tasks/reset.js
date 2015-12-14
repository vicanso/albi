'use strict';
// 定时重置globals.performance.http and globals.performance.route
const globals = localRequire('globals');
const _ = require('lodash');

module.exports = reset;


/**
 * [reset description]
 * @return {[type]} [description]
 */
function reset() {
	const performance = globals.get('performance');
	_.forEach(['http', 'route'], (name) => {
		const tmp = performance[name];
		const cloneTmp = _.clone(tmp);
		performance[name + '_bak'] = cloneTmp;
		_.forEach(tmp, (v, k) => {
			if (k === 'createdAt') {
				tmp[k] = (new Date()).toISOString();
			} else if (_.isNumber(v)) {
				tmp[k] = 0;
			} else if (_.isString(v)) {
				tmp[k] = '';
			} else if (_.isArray(v)) {
				tmp[k] = [];
			} else {
				tmp[k] = {};
			}
		});
	});
}