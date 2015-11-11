'use strict';

var request = require('component/superagent');
var Emitter = require('component/emitter');

var emitter = new Emitter();
_.forEach(_.functions(emitter), function(fn) {
	exports[fn] = emitter[fn];
});

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
exports.urlPrefix = '';

/**
 * [get description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function get(url, headers) {
	url = exports.urlPrefix + url;
	var req = request.get(url);
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
			if (err) {
				exports.emit('error', err);
				reject(err);
			} else {
				res.use = Date.now() - start;
				exports.emit('response', res);
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