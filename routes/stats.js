'use strict';
module.exports = [{
	route: '/stats/statistics',
	method: 'post',
	handler: 'stats.statistics'
}, {
	route: '/stats/ajax',
	method: 'post',
	handler: 'stats.ajax'
}, {
	route: '/stats/exception',
	method: 'post',
	handler: 'stats.exception'
}, {
	route: '/stats/requirejs',
	method: 'post',
	handler: 'stats.requirejs'
}];