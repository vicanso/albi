'use strict';
const globals = require('../globals');
const angular = require('angular');
const _ = require('lodash');
const debug = require('../debug');
const moduleName = 'jt.dom';
globals.addAngularModule(moduleName);

const angularModule = angular.module(moduleName, []);

angularModule.factory('dom', service);


function service($rootScope, $window) {
	const scope = $rootScope.$new();

	angular.element($window).on('scroll', _.throttle(() => {
		const offset = {
			top: $window.pageYOffset,
			left: $window.pageXOffset,
			height: $window.innerHeight
		};
		scope.$emit('scroll', offset);
	}, 300));

	return {
		on: _.bind(scope.$on, scope)
	};
}

service.$inject = ['$rootScope', '$window'];