webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);
	var debug = __webpack_require__(5);
	var http = __webpack_require__(10);
	var global = __webpack_require__(9);
	__webpack_require__(20);
	var dom = __webpack_require__(21);
	_.defer(function () {
		init();
		dom.lazyLoadImage('.lazyLoadImage');
	});

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	function init() {
		// post performance
		var data = {
			screen: _.pick(global.get('screen'), 'width height availWidth availHeight'.split(' ')),
			template: global.get('CONFIG.template')
		};
		var timing = global.get('TIMING');
		if (timing) {
			timing.end('page');
			data.timing = timing.toJSON();
		}

		var performance = global.get('performance');
		if (performance) {
			data.performance = performance.timing;
			if (performance.getEntries) {
				data.entries = _.filter(performance.getEntries(), function (tmp) {
					return tmp.initiatorType !== 'xmlhttprequest';
				});
			}
		}
		http.statistics(data);

		// capture global error
		global.set('onerror', function (msg, url, line, row, err) {
			var stack = '';
			if (err) {
				stack = err.stack;
			}
			var data = {
				url: url,
				line: line,
				row: row,
				msg: msg,
				stack: stack,
				type: 'uncaughtException'
			};
			if (global.get('CONFIG.env') === 'development') {
				alert(JSON.stringify(data));
			}
			http.statsException(data);
		});
	}

	function runLazyLoad() {}

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var debug = __webpack_require__(6);
	var global = __webpack_require__(9);
	var pattern = global.get('CONFIG.pattern');
	var app = global.get('CONFIG.app');
	if (pattern) {
		debug.names.push(new RegExp('^' + pattern.replace(/\*/g, '.*?') + '$'));
	}

	module.exports = debug('jt.' + app);

/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(2);

	// MOCK
	// TIMING
	// screen
	// CONFIG

	exports.get = get;
	exports.set = set;

	function get(path, defaultValue) {
		return _.get(window, path, defaultValue);
	}

	function set(path, value) {
		_.set(window, path, value);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var superExtend = __webpack_require__(11);
	var _ = __webpack_require__(2);

	exports.statsException = getDebouncePost('/stats/exception');

	exports.statsAjax = getDebouncePost('/stats/ajax');

	exports.statistics = superExtend.parse('POST /stats/statistics');

	/**
	 * [getDebouncePost description]
	 * @param  {[type]} url      [description]
	 * @param  {[type]} interval [description]
	 * @return {[type]}          [description]
	 */
	function getDebouncePost(url, interval) {
		interval = interval || 3000;
		var dataList = [];
		var post = superExtend.parse('POST ' + url);
		var debouncePost = _.debounce(function () {
			post(dataList.slice());
			dataList.length = 0;
		}, interval);
		return function (data) {
			if (data) {
				if (_.isArray(data)) {
					dataList.push.apply(dataList, data);
				} else {
					dataList.push(data);
				}

				debouncePost();
			}
		};
	}

/***/ },
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var superExtend = __webpack_require__(11);
	var _ = __webpack_require__(2);
	var util = superExtend.util;
	var debug = __webpack_require__(5);
	var http = __webpack_require__(10);
	var global = __webpack_require__(9);
	var doningRequest = {};
	var appUrlPrefix = global.get('CONFIG.appUrlPrefix', '');

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
		var url = req.url;
		var key = req.method + req.url;
		var requestId = ++uuid;
		debug('request[%d] %s', requestId, key);
		if (!doningRequest[key]) {
			doningRequest[key] = 0;
		}

		var count = ++doningRequest[key];
		if (count > 1) {
			// 相同的请求同时并发数超过1
			http.statsException({
				key: key,
				count: count,
				type: 'parallelRequest'
			});
		}
		req.once('complete', function () {
			debug('request[%d] complete %s', requestId, key);
			doningRequest[key]--;
		});
		req.once('fail', function (err) {
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

	var isReject = (function () {
		var rejectUrls = _.map(['/sys/', '/stats/'], function (item) {
			return appUrlPrefix + item;
		});
		debug('rejectUrls:%j', rejectUrls);
		return function (url) {
			return !!_.find(rejectUrls, function (item) {
				return url.indexOf(item) === 0;
			});
		};
	})();

	util.addResIntc(function responseEnd(res) {
		var req = res.req;
		var url = req.url;
		if (isReject(url)) {
			return;
		}
		var performance = res.performance;
		var data = {
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

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Emitter = __webpack_require__(22);
	var $ = __webpack_require__(23);
	var _ = __webpack_require__(2);

	Emitter(exports);

	exports.lazyLoadImage = lazyLoadImage;

	initScrollEvent();

	/**
	 * [initScrollEvent description]
	 * @return {[type]} [description]
	 */
	function initScrollEvent() {
		$(window).on('scroll', _.throttle(function (e) {
			var top = $(document).scrollTop();
			exports.emit('scroll', {
				top: top
			});
		}, 300));
	}

	function lazyLoadImage(selector) {
		_.forEach($(selector), function (dom) {
			var imgSrc = $(dom).data('src');
			$('<img src="' + imgSrc + '" />').appendTo(dom);
		});
	}

/***/ }
]);