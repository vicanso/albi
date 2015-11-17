'use strict';

var request = require('component/superagent');
var util = require('component/util');

util.emitterWrapper(exports);

exports.defaults = {
	common: {
		'X-Requested-With': 'XMLHttpRequest'
	},
	post: {
		'Cache-Control': 'no-cache'
	},
	put: {
		'Cache-Control': 'no-cache'
	}
};
exports.get = get;
exports.post = post;
exports.urlPrefix = '';

/**
 * [get description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function get(url, headers) {
	var originalUrl = url;
	url = exports.urlPrefix + url;
	var req = request.get(url);
	req.originalUrl = originalUrl;
	setHeaders(req, headers);
	return end(req);
}


/**
 * [post description]
 * @param  {[type]} url     [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */
function post(url, data, headers) {
	var originalUrl = url;
	url = exports.urlPrefix + url;
	var req = request.post(url).send(data);
	req.originalUrl = originalUrl;
	setHeaders(req, headers);
	return end(req);
}

/**
 * [end description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function end(req) {
	var start = Date.now();
	exports.emit('request', req);
	return new Promise(function(resolve, reject) {
		req.end(function(err, res) {
			res.use = Date.now() - start;
			exports.emit('response', res);
			if (err) {
				exports.emit('error', err);
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
}

/**
 * [setHeaders description]
 * @param {[type]} req     [description]
 * @param {[type]} headers [description]
 */
function setHeaders(req, headers) {
	var methods = ['common', req.method.toLowerCase()];
	_.forEach(methods, function(method) {
		_.forEach(exports.defaults[method], function(v, k) {
			req.set(k, v);
		});
	});
	_.forEach(headers, function(v, k) {
		req.set(k, v);
	});
}