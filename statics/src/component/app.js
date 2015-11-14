'use strict';

var http = require('component/http');
var rest = require('component/rest');
var util = require('component/util');
var store = require('component/store');


exports.ready = ready;


// http请求设置urlPrefix
http.urlPrefix = CONFIG.appUrlPrefix;


// 保存ready的回调函数，用于当初始化未完成时，先保存回调函数
var readyCbList = [];
// 表示APP的初始化是否已完成
var isReady = false;

var sendExceptionDebounce = getDebounceSendException(1000);
if (true || CONFIG.env !== 'development') {
	initErrorCapture();
	initHttpStats();
	initRequireResourceLoadStats();
}
_.defer(function() {
	isReady = true;
	sendStatistics();
	_.forEach(readyCbList, function(cb) {
		cb();
	});
});

/**
 * [ready 注册ready的回调事件，预留用于做一些全局的异步处理]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
function ready(cb) {
	if (isReady) {
		_.defer(cb);
	} else {
		readyCbList.push(cb);
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
			type: 'runtime'
		};
		if (CONFIG.env === 'development') {
			alert(JSON.stringify(data));
		}
		sendExceptionDebounce(data);
	};
}

/**
 * [initRequireResourceLoadStats description]
 * @return {[type]} [description]
 */
function initRequireResourceLoadStats() {
	var postStats = _.debounce(function() {
		if (TMP.resources.length) {
			rest.requirejsStats(TMP.resources);
			TMP.resources.length = 0
		}
	}, 1000);

	requirejs.onResourceLoad = function(context, map, depArray) {
		var data = map.timeLine;
		data.end = Date.now();
		data.url = map.url;
		data.type = 'success';
		TMP.resources.push(data);
		postStats();
	};

	requirejs.onError = function(err) {
		var data = {
			message: err.toString(),
			requireModules: err.requireModules,
			requireType: err.requireType,
			type: 'fail'
		};
		if (CONFIG.env === 'development') {
			alert(JSON.stringify(data));
		}
		TMP.resources.push(data);
		postStats();
	};
	postStats();
}

/**
 * [initHttpStats description]
 * @return {[type]} [description]
 */
function initHttpStats() {
	var doing = 0;
	var stats = {};
	var arr = [];
	var postStats = _.debounce(function() {
		if (arr.length) {
			rest.ajaxStats(arr);
			arr.length = 0
		}
	}, 1000);

	function reject(url) {
		return !url || url.indexOf('/sys/') === 0 || url.indexOf('/stats/') === 0;
	}

	http.on('response', function(res) {
		var url = _.get(res, 'req.url');
		if (!reject(url)) {
			arr.push({
				url: url,
				method: _.get(res, 'req.method'),
				use: res.use,
				statusCode: res.statusCode,
				doing: doing
			});
			postStats();
		};
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
			var data = {
				key: key,
				count: count,
				type: 'parallelRequest'
			};
			sendExceptionDebounce(data);
		}
		doing++;
	});
	if (config.env === 'development') {
		http.on('error', function(err) {
			alert(err.message);
		});
	}

}


/**
 * [sendStatistics description]
 * @return {[type]} [description]
 */
function sendStatistics() {
	var appInfo = store.get('appInfo') || {
		version: '',
		prevVersion: '',
		loadTemplates: []
	};
	var loadTemplates = appInfo.loadTemplates;
	if (appInfo.version !== CONFIG.appVersion) {
		appInfo.prevVersion = appInfo.version;
		appInfo.version = CONFIG.appVersion;
	}
	// 非第一次加载
	var loadType = 1;
	var templateTag = CONFIG.template + CONFIG.appVersion;
	// 第一次加载
	if (_.indexOf(loadTemplates, templateTag) === -1) {
		loadType = 2;
		var index = _.indexOf(loadTemplates, CONFIG.template + appInfo.prevVersion);
		loadTemplates.splice(index, 1);
		loadTemplates.push(templateTag);
	}
	var data = {
		timing: TIMING.toJSON(),
		screen: _.pick(window.screen, 'width height availWidth availHeight'.split(' ')),
		performance: window.performance.timing,
		template: CONFIG.template,
		loadType: loadType
	};
	rest.statistics(data);
	store.set('appInfo', appInfo);
}


/**
 * [getDebounceSendException description]
 * @param  {[type]} interval [description]
 * @return {[type]}          [description]
 */
function getDebounceSendException(interval) {
	var arr = TMP.errors || [];
	var sendException = _.debounce(function() {
		if (arr.length) {
			rest.exception(arr);
			arr.length = 0
		}
	}, interval);

	return function(data) {
		arr.push(data);
		sendException();
	};
}