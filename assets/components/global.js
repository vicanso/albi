webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var _ = __webpack_require__(2);
	var debug = __webpack_require__(4);
	var superExtend = __webpack_require__(8);
	__webpack_require__(17);
	sendStatistics();


	function sendStatistics() {
		var post = superExtend.parse('POST /stats/statistics');
		var data = {
			timing: window.TIMING.toJSON(),
			screen: _.pick(window.screen, 'width height availWidth availHeight'.split(' ')),
			template: CONFIG.template
		}
		var performance = window.performance;
		if (performance) {
			data.performance = performance.timing;
			if (performance.getEntries) {
				data.entries = _.filter(performance.getEntries(), function(tmp) {
					return tmp.initiatorType !== 'xmlhttprequest';
				});
			}
		}
		post(data);
	}

/***/ },

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var debug = __webpack_require__(5);

	if (CONFIG.pattern) {
		debug.names.push(new RegExp('^' + CONFIG.pattern.replace(/\*/g, '.*?') + '$'));
	}

	module.exports = debug('jt.' + CONFIG.app);

/***/ },

/***/ 17:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var superExtend = __webpack_require__(8);
	var _ = __webpack_require__(2);
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

/***/ }

});