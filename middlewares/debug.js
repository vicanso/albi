'use strict';
const Joi = require('joi');
const _ = require('lodash');
module.exports = debug;

/**
 * [debug description]
 * @return {[type]} [description]
 */
function debug() {
	const renameList = {
		'DEBUG': '_debug',
		'MOCK': '_mock',
		'PATTERN': '_pattern'
	};
	let schemaObject = Joi.object().keys({
		DEBUG: Joi.boolean(),
		MOCK: Joi.object(),
		PATTERN: Joi.string()
	});
	_.forEach(renameList, function(v, k) {
		schemaObject = schemaObject.rename(v, k);
	});

	return (ctx, next) => {
		const query = ctx.query;
		const result = Joi.validateThrow(query, schemaObject, {
			stripUnknown: true
		});
		/* istanbul ignore else */
		if (!_.isEmpty(result)) {
			_.forEach(result, function(v, k) {
				delete query[renameList[k]];
			});
			ctx.debugParams = result;
			ctx.query = query;
		}
		return next();
	};
}