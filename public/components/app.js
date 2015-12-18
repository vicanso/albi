'use strict';
const angular = require('angular');
const _ = require('lodash');
const globals = require('./globals');

const http = require('./services/http');
require('./services/dom');
require('./directives');


const app = angular.module(globals.get('CONFIG.app'), globals.getAngularModules());


require('./controllers/nav');



app.config(['$httpProvider', function($httpProvider, CONST) {
	// 对ajax的请求添加特定header
	$httpProvider.defaults.headers.common['X-Requested-With'] =
		'XMLHttpRequest';

	_.forEach(http.interceptors, interceptor => {
		$httpProvider.interceptors.push(interceptor);
	});
}]).config(['$provide', function($provide) {
	const params = ['$log', '$injector', angularErrorHandler];
	$provide.decorator('$exceptionHandler', params);
}]);

app.run(['rest', (rest) => {
	statistics(rest);
	init();
}]);



function statistics(rest) {
	// post performance
	const data = {
		screen: _.pick(globals.get('screen'), 'width height availWidth availHeight'.split(' ')),
		template: globals.get('CONFIG.template')
	};
	const timing = globals.get('TIMING');
	if (timing) {
		timing.end('page');
		data.timing = timing.toJSON();
	}

	const performance = globals.get('performance');
	if (performance) {
		data.performance = performance.timing;
		if (performance.getEntries) {
			data.entries = _.filter(performance.getEntries(), function(tmp) {
				return tmp.initiatorType !== 'xmlhttprequest';
			});
		}
	}
	rest.statistics(data);
}


function angularErrorHandler($log, $injector) {
	return function(exception, cause) {
		if (globals.get('CONFIG.env') === 'development') {
			alert(exception.message);
			$log.error.apply($log, arguments);
		} else {
			const rest = $injector.get('rest');
			rest.statsException({
				message: exception.message,
				stack: exception.stack,
				cause: cause,
				type: 'uncaughtException'
			});
		}
	};
}


function init() {
	globals.set('onerror', (msg, url, line, row, err) => {
		var stack = '';
		if (err) {
			stack = err.stack;
		}
		const data = {
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