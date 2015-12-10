'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const config = localRequire('config');

exports.admin = admin;

/**
 * [admin description]
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function admin(ctx, next) {
	const shasum = crypto.createHash('sha1');
	const token = shasum.update(_.get(ctx, 'request.body.jtToken')).digest('hex');
	if (token === config.adminToken) {
		return next();
	} else {
		ctx.throw(403);
	}
}