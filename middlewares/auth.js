const crypto = require('crypto');

const errors = localRequire('helpers/errors');

// token is 'jenny'
exports.admin = adminToken => (ctx, next) => {
  const shasum = crypto.createHash('sha1');
  const token = ctx.get('Auth-Token');
  if (token && shasum.update(token).digest('hex') === adminToken) {
    return next();
  }
  throw errors.get(1);
};
