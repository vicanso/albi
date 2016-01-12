'use strict';
const _ = require('lodash');

exports.exception = exception;
exports.statistics = statistics;
exports.ajaxStats = ajaxStats;

/**
 * [exception description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function exception(ctx) {
	const ua = ctx.get('user-agent');
	_.forEach(ctx.request.body, (item) => {
		console.error(`browser-exception ua:${ua}, data:${JSON.stringify(item)}`);
	});
	ctx.body = null;
}


/**
 * [statistics description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function statistics(ctx) {
	const data = ctx.request.body;
	console.info('browser-screen:' + JSON.stringify(data.screen));
	console.info('browser-timing:' + data.template + ', ' + JSON.stringify(data.timing));
	console.info('browser-performance:' + JSON.stringify(data.performance));
	_.forEach(data.entries, entry => {
		console.info('browser-entry:' + JSON.stringify(entry));
	});
	ctx.body = null;
}


/**
 * [ajaxStats description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function ajaxStats(ctx) {
	const ua = ctx.get('user-agent');
	_.forEach(ctx.request.body, (item) => {
		console.info(`browser-ajax ua:${ua}, data:${JSON.stringify(item)}`);
	});
	ctx.body = null;
}