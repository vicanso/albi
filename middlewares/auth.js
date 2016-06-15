'use strict';
const crypto = require('crypto');
const errors = localRequire('helpers/errors');
const _ = require('lodash');

exports.admin = (adminToken) => (ctx, next) => {
  const shasum = crypto.createHash('sha1');
  const token = _.get(ctx, 'request.body.token');
  if (token && shasum.update(token).digest('hex') === adminToken) {
    return next();
  }
  throw errors.get('token is invalid', 403);
};
