'use strict';
const template = localRequire('middlewares/template');
const viewConfigs = localRequire('views/config');

viewConfigs.forEach(str => {
	const arr = str.split(' ');
	exports[arr[0]] = template.parse(arr[1]);
});