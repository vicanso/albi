'use strict';

var http = require('component/http');


exports.exception = exception;
exports.statistics = statistics;
exports.requirejsStats = requirejsStats;
exports.user = user;
exports.ajaxStats = ajaxStats;


/**
 * [exception 异常出错统计]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function exception(data) {
	return post('/stats/exception', data);
}

/**
 * [statistics 统计分析上传]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function statistics(data) {
	return post('/stats/statistics', data);
}


/**
 * [requirejsStats requirejs的加载统计]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function requirejsStats(data) {
	return post('/stats/requirejs', data);
}

/**
 * [ajaxStats ajax请求状态统计]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function ajaxStats(data) {
	return post('/stats/ajax', data);
}

/**
 * [user description]
 * @return {[type]} [description]
 */
function user() {
	return get('/1/users/me', {
		'Cache-Control': 'no-cache'
	});
}


/**
 * [get description]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */
function get(url, headers) {
	return new Promise(function(resolve, reject) {
		http.get(url, headers).then(function(res) {
			if (res.type === 'application/json') {
				resolve(res.body);
			} else {
				resolve(res.text);
			}
		}, reject);
	});
}

/**
 * [post description]
 * @param  {[type]} url     [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */
function post(url, data, headers) {
	return new Promise(function(resolve, reject) {
		http.post(url, data, headers).then(function(res) {
			if (res.type === 'application/json') {
				resolve(res.body);
			} else {
				resolve(res.text);
			}
		}, reject);
	});
}