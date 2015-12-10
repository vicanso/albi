'use strict';
const createError = require('http-errors');


module.exports = httpError;

/**
 * [httpError description]
 * @return {[type]} [description]
 */
function httpError() {
	const err = createError.apply(null, arguments);
	err.expected = true;
	return err;
}