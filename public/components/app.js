'use strict';
const _ = require('lodash');
const debug = require('./debug');
const http = require('./http');
const global = require('./global');
require('./super-extend-init');
_.defer(init);

/**
 * [init description]
 * @return {[type]} [description]
 */
function init() {
	// post performance
	const data = {
		screen: _.pick(global.get('screen'), 'width height availWidth availHeight'.split(' ')),
		template: global.get('CONFIG.template')
	};
	const timing = global.get('TIMING');
	if (timing) {
		timing.end('page');
		data.timing = timing.toJSON();
	}

	const performance = global.get('performance');
	if (performance) {
		data.performance = performance.timing;
		if (performance.getEntries) {
			data.entries = _.filter(performance.getEntries(), function(tmp) {
				return tmp.initiatorType !== 'xmlhttprequest';
			});
		}
	}
	http.statistics(data);

	// capture global error
	global.set('onerror', (msg, url, line, row, err) => {
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