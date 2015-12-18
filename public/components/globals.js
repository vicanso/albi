'use strict';
const _ = require('lodash');
const angularModule = [];
// MOCK 
// TIMING
// screen
// CONFIG

exports.get = get;
exports.set = set;
exports.addAngularModule = addAngularModule;
exports.getAngularModules = getAngularModules;

function get(path, defaultValue) {
	return _.get(window, path, defaultValue);
}

function set(path, value) {
	_.set(window, path, value);
}

function addAngularModule(name) {
	angularModule.push(name);
}

function getAngularModules() {
	return angularModule;
}