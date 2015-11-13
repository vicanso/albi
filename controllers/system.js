'use strict';
const config = localRequire('config');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const v8 = require('v8');
const bytes = require('bytes');
const moment = require('moment');
const toobusy = require('toobusy-js');
const util = require('util');
const spawn = require('child_process').spawn;
const globals = localRequire('globals');
const sdc = localRequire('helpers/sdc');
exports.version = version;
exports.stats = stats;
exports.safeExit = safeExit;
exports.pause = pause;
exports.resume = resume;

/**
 * [version 返回代码版本与执行版本]
 * @return {[type]} [description]
 */
function* version() {
	/*jshint validthis:true */
	let ctx = this;
	let data = yield getVersion();
	ctx.set('Cache-Control', 'public, max-age=5');
	ctx.body = data;
}

/**
 * [getVersion 获取代码版本与运行版本]
 * @return {[type]} [description]
 */
function getVersion() {
	return new Promise(function(resolve, reject) {
		fs.readFile(path.join(__dirname, '../package.json'), function(err,
			data) {
			if (err) {
				reject(err);
			} else {
				let json = JSON.parse(data);
				data = {
					code: json.appVersion,
					exec: config.version
				};
				resolve(data);
			}
		});
	});
}

/**
 * [safeExit 会先设置标记app状态为pause(此时如果调用/ping请求，会返回出错，因此可以让前置的varnish、nginx等认为该backend无效)，每隔5秒去检测是否还有连接处理中，若无，则退出进程（node.js不会自动重启，依赖于其它程序，如supervisor之类来做守护进程）。最长30秒强制重启]
 * @return {[type]} [description]
 */
function* safeExit() {
	/*jshint validthis:true */
	let ctx = this;
	globals.set('status', 'pause');
	yield Promise.resolve();
	let str = util.format('%s will safeExit soon.', config.app);
	console.info(str);
	ctx.body = null;
	checkToExit(6);
}

/**
 * [pause description]
 * @return {[type]} [description]
 */
function* pause() {
	/*jshint validthis:true */
	let ctx = this;
	globals.set('status', 'pause');
	let str = util.format('%s will pause.', config.app);
	console.info(str);
	yield Promise.resolve();
	ctx.body = null;
}

/**
 * [resume description]
 * @return {[type]} [description]
 */
function* resume() {
	/*jshint validthis:true */
	let ctx = this;
	globals.set('status', 'running');
	let str = util.format('%s will resume.', config.app);
	console.info(str);
	yield Promise.resolve();
	ctx.body = null;
}

/**
 * [stats 返回系统相关信息]
 * @return {[type]} [description]
 */
function* stats() {
	/*jshint validthis:true */
	let ctx = this;
	let version = yield getVersion();
	let heap = v8.getHeapStatistics();
	_.forEach(heap, function(v, k) {
		heap[k] = bytes(v);
	});

	function formatTime(seconds) {
		let str = '';
		let day = 24 * 3600;
		let hour = 3600;
		let minute = 60;
		// day hour minute seconds
		let arr = [0, 0, 0, 0];
		if (seconds > day) {
			arr[0] = Math.floor(seconds / day);
			seconds %= day;
		}
		if (seconds > hour) {
			arr[1] = Math.floor(seconds / hour);
			seconds %= hour;
		}
		if (seconds > minute) {
			arr[2] = Math.floor(seconds / minute);
			seconds %= minute;
		}
		arr[3] = seconds;
		return arr[0] + 'd' + arr[1] + 'h' + arr[2] + 'm' + arr[3] + 's';
	}

	let uptime = Math.ceil(process.uptime());
	let performance = globals.get('performance');
	if (performance.http) {
		performance.http.resSizeTotalDesc = bytes(performance.http.resSizeTotal);
	}

	let result = _.extend({
		version: version,
		uptime: formatTime(uptime),
		startedAt: new Date(Date.now() - uptime * 1000).toISOString()
	}, performance);
	ctx.set('Cache-Control', 'public, max-age=5');
	ctx.body = result;
}



/**
 * [checkToExit 判断是否还有连接，如果无则退出]
 * @param  {[type]} times [description]
 * @return {[type]}       [description]
 */
function checkToExit(times) {
	if (!times) {
		process.exit();
		return;
	}
	let timer = setTimeout(function() {
		let connectingTotal = globals.get('connectingTotal');
		if (!connectingTotal) {
			process.exit();
			return;
		}
		checkToExit(--times);
	}, 5 * 1000);
	timer.unref();
}