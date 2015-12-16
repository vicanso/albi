'use strict';
const _ = require('lodash');

// MOCK 
// TIMING
// screen
// CONFIG

exports.get = get;
exports.set = set;

function get(path, defaultValue) {
	return _.get(window, path, defaultValue);
}

function set(path, value) {
	_.set(window, path, value);
}