'use strict';
var _ = require('lodash');
var debug = require('./debug');
var superExtend = require('superagent-extend');
require('./super-extend-init');
sendStatistics();


function sendStatistics() {
	var post = superExtend.parse('POST /stats/statistics');
	var data = {
		timing: window.TIMING.toJSON(),
		screen: _.pick(window.screen, 'width height availWidth availHeight'.split(' ')),
		template: CONFIG.template
	}
	var performance = window.performance;
	if (performance) {
		data.performance = performance.timing;
		if (performance.getEntries) {
			data.entries = _.filter(performance.getEntries(), function(tmp) {
				return tmp.initiatorType !== 'xmlhttprequest';
			});
		}
	}
	post(data);
}