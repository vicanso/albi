'use strict';
const angular = require('angular');
const globals = require('../globals');

ctrl.$inject = ['$scope'];

angular.module(globals.get('CONFIG.app'))
	.controller('NavController', ctrl);

function ctrl($scope) {
	const self = this;

	self.selected = (url, e) => {
		console.dir(url);
		e.preventDefault();
	};

	return self;
}