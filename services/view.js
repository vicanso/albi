'use strict';
const _ = require('lodash');

exports.navigation = getNavigation();



/**
 * [getNavigation description]
 * @return {[type]} [description]
 */
function getNavigation() {
	const nav = [{
		name: 'Get Started'
	}, {
		name: 'Controllers',
		children: [{
			name: 'home'
		}, {
			name: 'stats'
		}, {
			name: 'system'
		}, {
			name: 'user'
		}]
	}, {
		name: 'Helpers',
		children: [{
			name: 'debug'
		}, {
			name: 'http error'
		}, {
			name: 'sdc'
		}]
	}, {
		name: 'Middlewares',
		children: [{
			name: 'auth'
		}, {
			name: 'common'
		}, {
			name: 'debug'
		}, {
			name: 'entry'
		}, {
			name: 'error'
		}, {
			name: 'http stats'
		}, {
			name: 'limit'
		}, {
			name: 'no cache'
		}, {
			name: 'picker'
		}, {
			name: 'state'
		}, {
			name: 'template'
		}]
	}, {
		name: 'Router',
		children: [{
			name: 'config'
		}]
	}, {
		name: 'Components',
		children: [{
			name: 'debug'
		}, {
			name: 'global'
		}, {
			name: 'http'
		}, {
			name: 'super-extend-init'
		}]
	}];
	const convert = (item) => {
		return {
			name: item.name,
			url: '/' + item.name.toLowerCase().replace(/\s/, '-')
		};
	};

	return _.map(nav, item => {
		const tmp = convert(item);
		if (item.children) {
			tmp.children = _.map(item.children, convert);
		}
		return tmp;
	});
}