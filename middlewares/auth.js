const crypto = require('crypto');
const _ = require('lodash');

const errors = localRequire('helpers/errors');

// token is 'jenny'
exports.admin = adminToken => (ctx, next) => {
  const shasum = crypto.createHash('sha1');
  const token = _.get(ctx, 'request.body.token');
  if (token && shasum.update(token).digest('hex') === adminToken) {
    return next();
  }
  throw errors.get(1);
};
