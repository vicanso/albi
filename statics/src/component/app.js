'use strict';

var http = require('component/http');
var rest = require('component/rest')

exports.run = run;

// 保存run的回调函数，用于当初始化未完成时，先保存回调函数
var runCbList = [];
// 表示APP的初始化是否已完成
var isReady = true;

var sendStatisticsOnce = _.once(sendStatistics);
if (true || CONFIG.env !== 'development') {
	initErrorCapture();
	initHttpStats();
}

/**
 * [run 注册run的回调事件，预留用于做一些全局的异步处理]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
function run(cb) {
	if (isReady) {
		_.defer(cb);
		sendStatisticsOnce();
	} else {
		runCbList.push(cb);
	}
}

/**
 * [initErrorCapture description]
 * @return {[type]} [description]
 */
function initErrorCapture() {
	window.onerror = function(msg, url, line, row, err) {
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
			type: 'exception'
		};
		rest.exception(data);
		// http.post('/sys/exception', data);
		// send error to rest
	};
	if (TMP.resourceLoadErrors.length) {
		rest.exception(TMP.resourceLoadErrors);
		TMP.resourceLoadErrors.length = 0
	}
}


/**
 * [initHttpStats description]
 * @return {[type]} [description]
 */
function initHttpStats() {
	var doing = 0;
	var stats = {};
	http.on('response', function(res) {
		doing--;
	});
	http.on('request', function(req) {
		var key = req.method + req.url;
		if (!stats[key]) {
			stats[key] = 0;
		}
		var count = ++stats[key];
		if (count > 1) {
			// 相同的请求同时并发数超过1
		}
		doing++;
	});
	http.on('error', function(err) {
		console.dir(err);
	});
}


/**
 * [sendStatistics description]
 * @return {[type]} [description]
 */
function sendStatistics() {
	var data = {
		timing: TIMING.toJSON(),
		screen: _.pick(window.screen, 'width height availWidth availHeight'.split(' ')),
		performance: window.performance.timing
	};
	rest.statistics(data);
}


// var result = angular.extend({
//   timeline: TIMING.getLogs(),
//   screen: {
//     width: $window.screen.width,
//     height: $window.screen.height,
//     innerHeight: $window.innerHeight,
//     innerWidth: $window.innerWidth
//   },
//   // 在deploy之后，非第一次加载
//   load: 2,
// }, $window.performance);