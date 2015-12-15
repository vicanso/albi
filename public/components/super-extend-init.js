'use strict';
var superExtend = require('superagent-extend');
var _ = require('lodash');
var util = superExtend.util;
var donigCount = 0;
var doningRequest = {};


var postStatsException = (function() {
	var exceptions = [];
	var post = superExtend.parse('POST /stats/exception');
	var debouncePost = _.debounce(function() {
		post(exceptions).then((res) => {
			exceptions.length = 0;
		});
	}, 3000);
	return function(data) {
		exceptions.push(data);
		debouncePost();
	};
})();


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

util.addReqIntc(function appUrlPrefixHandler(req) {
	donigCount++;
	var url = req.url;
	var key = req.method + req.url;
	if (!doningRequest[key]) {
		doningRequest[key] = 0;
	}


	var count = ++doningRequest[key];
	if (count > 1) {
		// 相同的请求同时并发数超过1
		var data = {
			key: key,
			count: count,
			type: 'parallelRequest'
		};
		postStatsException(data);
	}


	if (CONFIG.appUrlPrefix && url.charAt(0) === '/') {
		req.url = CONFIG.appUrlPrefix + url;
	}

});

util.addResIntc(function responseEnd(res) {
	donigCount--;
});



var user = superExtend.parse('GET /user/me?cache=false');

user();
user();
user();