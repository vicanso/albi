'use strict';
const angular = require('angular');
const globals = require('../globals');
const moduleName = 'jt.lazy-load';
globals.addAngularModule(moduleName);

const angularModuel = angular.module(moduleName, []);

angularModuel.directive('lazyLoadImage', lazyLoadImage);


function lazyLoadImage() {
	function link(scope, element, attr) {
		const imgSrc = attr.imageSrc;
		if (imgSrc) {
			element.append(`<img src="${imgSrc}" />`);
		}
	}

	return {
		restrict: 'A',
		link: link
	};
}