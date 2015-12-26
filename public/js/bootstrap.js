'use strict';
import * as http from '../components/http';
import _ from 'lodash';
import $ from 'jquery';
import * as globals from '../components/globals';
import * as lazyLoad from '../components/lazy-load';

_.defer(() => {

	statistics();
	init();
	$('.lazyLoadImage').each(function() {
		lazyLoad.load($(this));
	});

	$('#navLink').click(function() {
		const obj = $(this);
		obj.next('.navContainer').addBack().toggleClass('active');
	});
});

function statistics() {
	// post performance
	const data = {
		screen: _.pick(globals.get('screen'), 'width height availWidth availHeight'.split(
			' ')),
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
	http.post('/stats/statistics', data);
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