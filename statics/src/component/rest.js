'use strict';

var http = require('component/http');


exports.exception = exception;
exports.statistics = statistics;

/**
 * [exception 异常出错上传]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function exception(data) {
	return http.post('/sys/exception', data);
}

/**
 * [statistics 统计分析上传]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function statistics(data) {
	return http.post('/sys/statistics', data);
}