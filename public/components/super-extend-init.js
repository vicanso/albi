'use strict';
const superExtend = require('superagent-extend');
const _ = require('lodash');
const util = superExtend.util;
const debug = require('./debug');
const http = require('./http');
const global = require('./global');
const doningRequest = {};
const appUrlPrefix = global.get('CONFIG.appUrlPrefix', '');


util.addHeader('common', {
	'X-Requested-With': 'XMLHttpRequest'
});
util.addHeader('post', {
	'Cache-Control': 'no-cache'
});
util.addHeader('put', {
	'Cache-Control': 'no-cache'
});
util.addHeader('delete', {
	'Cache-Control': 'no-cache'
});

util.timeout = 5 * 1000;
var uuid = 0;
util.addReqIntc(function appUrlPrefixHandler(req) {
	let url = req.url;
	const key = req.method + req.url;
	const requestId = ++uuid;
	debug('request[%d] %s', requestId, key);
	if (!doningRequest[key]) {
		doningRequest[key] = 0;
	}

	const count = ++doningRequest[key];
	if (count > 1) {
		// 相同的请求同时并发数超过1
		http.statsException({
			key: key,
			count: count,
			type: 'parallelRequest'
		});
	}
	req.once('complete', () => {
		debug('request[%d] complete %s', requestId, key);
		doningRequest[key]--;
	});
	req.once('fail', (err) => {
		debug('request[%d] fail %s', requestId, key);
		http.statsException({
			key: key,
			type: 'requestFail',
			message: err.message
		});
	});

	if (appUrlPrefix && url.charAt(0) === '/') {
		req.url = appUrlPrefix + url;
	}

});



const isReject = (function() {
	const rejectUrls = _.map(['/sys/', '/stats/'], item => {
		return appUrlPrefix + item;
	});
	debug('rejectUrls:%j', rejectUrls);
	return (url) => {
		return !!_.find(rejectUrls, item => {
			return url.indexOf(item) === 0;
		});
	};
})();

util.addResIntc(function responseEnd(res) {
	const req = res.req;
	const url = req.url;
	if (isReject(url)) {
		return;
	}
	const performance = res.performance;
	const data = {
		method: req.method,
		url: url,
		use: performance.fetchEnd - performance.fetchStart,
		// hit cache
		hit: false
	};
	if (parseInt(res.get('X-Hits') || 0)) {
		data.hit = true;
	}
	http.statsAjax(data);
});