'use strict';
const _ = require('lodash');

exports.exception = exception;
exports.statistics = statistics;

/**
 * [exception description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function exception(ctx) {
	let data = ctx.request.body;
	if (!_.isArray(data)) {
		data = [data];
	}
	const ua = ctx.get('user-agent');
	_.forEach(data, (tmp) => {
		console.error(`exception, ua:${ua}, data:${JSON.stringify(tmp)}`);
	});
	ctx.body = null;
}


/**
 * [statistics description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function statistics(ctx) {
	console.info(JSON.stringify(ctx.request.body));
	ctx.body = null;
}