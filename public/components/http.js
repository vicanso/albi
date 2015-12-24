'use strict';
import * as superagentExtend from 'superagent-extend';
import * as globals from './globals';
import debug from './debug';
import _ from 'lodash';
const request = superagentExtend.request;
const util = superagentExtend.util;
const appUrlPrefix = globals.get('CONFIG.appUrlPrefix');

const statsAjax = getDebouncePost('/stats/ajax');
export const statsException = getDebouncePost('/stats/exception');


initAjaxStats();
initAjaxHeaders();


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
	return superagentExtend.parse(desc);
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
	let uuid = 0;
	const doningRequest = {};
	// 添加HTTP请求的全局处理
	util.addReqIntc(req => {
		const url = req.url;
		const method = req.method;
		const key = method + url;
		const requestId = ++uuid;
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
		// 所有的请求添加appUrlPrefix
		req.url = appUrlPrefix + req.url;
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
			const performance = res.performance;
			const data = {
				method: method,
				url: url,
				use: performance.fetchEnd - performance.fetchStart,
				status: res.status,
				hit: false
			};
			if (res && parseInt(res.get('X-Hits') || 0)) {
				data.hit = true;
			}
			statsAjax(data);
		});
	});
}

function initAjaxHeaders() {
	util.addHeader('comon', {
		'X-Requested-With': 'XMLHttpRequest'
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