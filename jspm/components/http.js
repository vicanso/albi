'use strict';
import * as request from 'superagent';
import * as globals from './globals';
import debug from './debug';
import _ from 'lodash';
import uuid from 'node-uuid';
const appUrlPrefix = globals.get('CONFIG.appUrlPrefix');
const statsAjax = getDebouncePost('/stats/ajax');
const middlewares = [];
export const statsException = getDebouncePost('/stats/exception');


initAjaxStats();
initAjaxHeaders();

// 超时设置
var timeout = 0;
export function timeout(ms) {
	timeout = ms;
}

export function addMiddleware(fn) {
	if (_.indexOf(middlewares, fn) === -1) {
		middlewares.push(fn);
	}
}

export function get(url, headers) {
	const req = request.get(url);
	if (headers) {
		req.set(headers);
	}
	return req.done();
}

export function post(url, data, headers) {
	const req = request.post(url);
	if (data) {
		req.send(data);
	}
	if (headers) {
		req.set(headers);
	}
	return req.done();
}


export function parse(desc) {
	const arr = desc.split(' ');
	if (arr.length < 2) {
		throw new Error('request description is invalid');
	}
	let method = arr[0].toLowerCase();
	/* istanbul ignore if */
	if (method === 'delete') {
		method = 'del';
	}
	const url = arr[1];
	return function() {
		const args = _.toArray(arguments);
		const req = request[method](url);
		if (args[0]) {
			if (method === 'get' || method === 'del') {
				req.query(args[0])
			} else {
				req.send(args[0]);
			}
		}
		if (args[1]) {
			req.set(args[1]);
		}
		return req.done();
	};
}

// 对于/sys/, /stats/的请求不统计性能
const isReject = (function() {
	const rejectUrls = ['/sys/', '/stats/'];
	debug('rejectUrls:%j', rejectUrls);
	return (url) => {
		return !!_.find(rejectUrls, item => {
			return url.indexOf(item) === 0;
		});
	};
})();

/**
 * [initAjaxStats 初始化ajax相关统计功能]
 * @return {[type]} [description]
 */
function initAjaxStats() {
	let requestCount = 0;
	const doningRequest = {};
	middlewares.push((req) => {
		const url = req.url;
		const method = req.method;
		const key = method + url;
		const requestId = ++requestCount;
		debug('request[%d] %s', requestId, key);
		if (!doningRequest[key]) {
			doningRequest[key] = 0;
		}
		const count = ++doningRequest[key];
		if (count > 1) {
			debug('parallelRequest:%s', key);
			statsException({
				key: key,
				count: count,
				type: 'parallelRequest'
			});
		}
		req.once('complete', () => {
			--doningRequest[key];
		});
		req.once('fail', err => {
			statsException({
				key: key,
				message: err.message,
				type: 'requestFail'
			});
		});
		req.once('success', res => {
			if (isReject(url)) {
				return;
			}
			const data = {
				method: method,
				url: url,
				use: res.use,
				status: res.status,
				hit: false
			};
			if (res && parseInt(res.get('X-Hits') || 0)) {
				data.hit = true;
			}
			statsAjax(data);
		});
		return req;
	});
}

function initAjaxHeaders() {
	middlewares.push((req) => {
		req.set({
			'X-Requested-With': 'XMLHttpRequest',
			'X-UUID': uuid.v4().replace(/-/g, '')
		});
		return req;
	});
}

function getDebouncePost(url, interval) {
	interval = interval || 3000;
	const dataList = [];
	const post = parse('POST ' + url);
	const debouncePost = _.debounce(() => {
		post(dataList.slice());
		dataList.length = 0;
	}, interval);
	return (data) => {
		if (data) {
			if (_.isArray(data)) {
				dataList.push.apply(dataList, data);
			} else {
				dataList.push(data);
			}
			debouncePost();
		}
	}
}


request.Request.prototype.done = function done() {
	if (timeout) {
		this.timeout(timeout);
	}
	_.forEach(middlewares, fn => {
		this.use(fn);
	});
	return new Promise((resolve, reject) => {
		const start = Date.now();
		this.end((err, res) => {
			this.emit('complete');
			if (err) {
				this.emit('fail', err);
				return reject(err);
			}
			res.use = Date.now() - start;
			this.emit('success', res);
			resolve(res);
		});
	});
}