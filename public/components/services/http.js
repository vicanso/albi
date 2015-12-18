'use strict';
const globals = require('../globals');
const angular = require('angular');
const debug = require('../debug');
const pathToRegexp = require('path-to-regexp');
const moduleName = 'jt.http';

const interceptors = [globalRequestHandler];



const angularModule = angular.module(moduleName, []);

angularModule.factory('rest', ['$http', service]);
globals.addAngularModule(moduleName);



exports.interceptors = interceptors;
exports.timeout = 5 * 1000;



function service($http) {
	return {
		parse: (desc) => {
			return parse($http, desc);
		},
		statistics: parse($http, 'POST /stats/statistics'),
		statsAjax: getDebouncePost($http, '/stats/ajax'),
		statsException: getDebouncePost($http, '/stats/exception')
	};
}


const isReject = (function() {
	const prefix = globals.get('CONFIG.appUrlPrefix', '');
	const rejectUrls = _.map(['/sys/', '/stats/'], item => {
		return prefix + item;
	});
	debug('rejectUrls:%j', rejectUrls);
	return (url) => {
		return !!_.find(rejectUrls, item => {
			return url.indexOf(item) === 0;
		});
	};
})();

/**
 * [globalRequestHandler description]
 */
function globalRequestHandler($q, $injector) {
	const prefix = globals.get('CONFIG.appUrlPrefix', '');
	var uuid = 0;
	const doningRequest = {};

	function begin(config) {
		const key = config.method + config.url;
		const requestId = ++uuid;
		debug('request[%d] %s', requestId, key);
		if (!doningRequest[key]) {
			doningRequest[key] = 0;
		}

		const count = ++doningRequest[key];

		if (count > 1) {
			// 相同的请求同时并发数超过1
			const rest = $injector.get('rest');
			debug('parallelRequest:%s', key);
			rest.statsException({
				key: key,
				count: count,
				type: 'parallelRequest'
			});
		}
		config._startAt = Date.now();
	}

	function end(config, res) {
		const method = config.method;
		const url = config.url;
		const key = method + url;
		doningRequest[key]--;
		if (isReject(url)) {
			return;
		};
		const data = {
			method: method,
			url: url,
			use: Date.now() - config._startAt,
			status: _.get(res, 'status', -1),
			hit: false
		};
		if (res && parseInt(res.headers('X-Hits') || 0)) {
			data.hit = true;
		}
		const rest = $injector.get('rest');
		rest.statsAjax(data);
	}

	return {
		request: (config) => {
			config.url = prefix + config.url;
			begin(config);
			return config;
		},
		requestError: (rejection) => {
			end(rejection.config);
			return $q.reject(rejection);
		},
		response: (res) => {
			end(res.config, res);
			return res;
		},
		responseError: (rejection) => {
			end(rejection.config);
			return $q.reject(rejection);
		}
	};
}
globalRequestHandler.$inject = ['$q', '$injector'];



function parse($http, desc) {
	const arr = desc.split(' ');
	if (arr.length < 2) {
		throw new Error('request description is invalid');
	}
	const method = arr[0].toUpperCase();
	const url = arr[1];
	const paramKeys = pathToRegexp(url).keys;
	return function() {
		const args = _.toArray(arguments);
		let cloneUrl = url;
		_.forEach(paramKeys, key => {
			cloneUrl = cloneUrl.replace(':' + key.name, args.shift());
		});
		const data = args[0];
		const headers = args[1];
		const options = {
			method: method,
			url: cloneUrl
		};
		if (exports.timeout) {
			options.timeout = exports.timeout;
		}
		if (method === 'GET' || method === 'DELETE' || method === 'HEAD') {
			options.params = data;
		} else {
			options.data = data;
		}
		return $http(options);

	}
}


function getDebouncePost($http, url, interval) {
	interval = interval || 3000;
	const dataList = [];
	const post = parse($http, 'POST ' + url);
	const debouncePost = _.debounce(() => {
		post(dataList.slice());
		dataList.length = 0;
	}, interval);
	return (data) => {
		if (data) {
			if (_.isArray(data)) {
				dataList.push.apply(dataList, data);
			} else {
				dataList.push(data);
			}
			debouncePost();
		}
	}
}