'use strict';
const _ = require('lodash');
const sdc = localRequire('helpers/sdc');
const util = require('util');
const Joi = require('joi');

exports.statistics = statistics;
exports.ajax = ajax;
exports.exception = exception;
exports.requirejs = requirejs;

/**
 * [statistics description]
 * @return {[type]} [description]
 */
function* statistics() {
	/*jshint validthis:true */
	let ctx = this;
	let data = ctx.request.body;
	console.info(JSON.stringify(data));
	let timing = data.performance;
	if (timing) {
		let result = {
			loadEvent: timing.loadEventEnd - timing.loadEventStart,
			domContentLoadedEvent: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
			response: timing.responseEnd - timing.responseStart,
			firstByte: timing.responseStart - timing.requestStart,
			connect: timing.connectEnd - timing.connectStart,
			domainLookup: timing.domainLookupEnd - timing.domainLookupStart,
			fetch: timing.responseEnd - timing.fetchStart,
			request: timing.responseEnd - timing.requestStart,
			dom: timing.domComplete - timing.domLoading
		};
	}
	yield Promise.resolve();
	ctx.body = null;
}

/**
 * [*ajax description]
 * @yield {[type]} [description]
 */
function* ajax() {
	/*jshint validthis:true */
	let ctx = this;
	let ua = ctx.get('user-agent');
	let data = ctx.request.body;
	let ip = ctx.ips[0] || ctx.ip;
	if (data) {
		let log = 'ip:' + ip + ', ua:' + ua;
		_.forEach(data, function(tmp) {
			let statusCode = tmp.statusCode;
			let msg = util.format('ajax %s %s %d-%dms [%d], %s', tmp.method, tmp.url, statusCode, tmp.use, tmp.doing, log);
			if (statusCode >= 400) {
				console.error(msg);
			} else {
				console.info(msg);
			}

		});
	}
	yield Promise.resolve();
	ctx.body = null;
}

function* exception() {
	/*jshint validthis:true */
	let ctx = this;
	let ua = ctx.get('user-agent');
	let data = ctx.request.body;
	if (!_.isArray(data)) {
		data = [data];
	}

	data = Joi.validateThrow(data, Joi.array().items(
		Joi.object({
			type: Joi.string().valid(['runtime', 'parallelRequest'])
		})
	), {
		allowUnknown: true
	});
	_.forEach(data, function(tmp) {
		console.error('exception, ua:%s, data:%s', ua, JSON.stringify(tmp));
	});

	yield Promise.resolve();
	ctx.body = null;
}

function* requirejs() {
	/*jshint validthis:true */
	const ctx = this;
	let data = ctx.request.body;
	if (!_.isArray(data)) {
		data = [data];
	}
	_.forEach(data, function(item) {
		let type = item.type;
		delete item.type;
		sdc.increment('requirejs.' + type);
		if (item.type === 'fail') {
			console.error('requirejs fail, err:%s', JSON.stringify(item));
		} else {
			console.info('requirejs success, info:%s', JSON.stringify(item));
		}
	});
	ctx.body = null;
}