'use strict';
const _ = require('lodash');
const httpError = localRequire('helpers/http-error');

exports.noQuery = noQuery;

function noQuery(ctx, next) {
	if (_.isEmpty(ctx.query)) {
		return next();
	} else {
		throw httpError('query must be empty', 400);
	}
}