'use strict';
const globals = localRequire('helpers/globals');
const errors = localRequire('helpers/errors');
module.exports = (url) => (ctx, next) => {
  if (ctx.url !== url) {
    next();
  } else if (globals.get('status') !== 'running') {
    throw errors.get('the server is not running now!');
  } else {
    /* eslint no-param-reassign:0 */
    ctx.body = 'pong';
  }
};
