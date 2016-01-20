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
			name: 'picker'
		}, {
			name: 'state'
		}, {
			name: 'template'
		}]
	}, {
		name: 'Controllers'
	}, {
		name: 'Helpers'
	}, {
		name: 'Router',
		children: [{
			name: 'config'
		}]
	}, {
		name: 'Views',
		children: [{
			name: 'config'
		}]
	}, {
		name: 'Components',
		children: [{
			name: 'debug'
		}, {
			name: 'globals'
		}, {
			name: 'http'
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