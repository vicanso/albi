'use strict';
const _ = require('lodash');
const config = localRequire('config');
const debug = localRequire('helpers/debug');
const Joi = require('joi');

module.exports = function() {
	let schemaObject = Joi.object().keys({
			DEBUG: Joi.boolean().optional(),
			pretty: Joi.boolean().optional(),
			MOCK: Joi.string().optional()
		})
		.rename('_debug', 'DEBUG')
		.rename('_pretty', 'pretty')
		.rename('_mock', 'MOCK');
	return function*(next) {
		/*jshint validthis:true */
		let ctx = this;
		let state = ctx.state;
		let query = ctx.query;
		let result = Joi.validateThrow(query, schemaObject, {
			stripUnknown: true
		});
		_.forEach(['_debug', '_pretty', '_mock'], function(key) {
			delete query[key];
		});
		_.extend(state, result);
		yield * next;
	};
};