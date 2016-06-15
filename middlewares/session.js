'use strict';
const session = require('koa-simple-session');
const RedisStore = require('koa-simple-redis');
const config = localRequire('config');
const errors = localRequire('helpers/errors');
const _ = require('lodash');

const sessionMiddleware = session({
  key: config.app,
  prefix: `${config.app}-session:`,
  ttl: 48 * 3600 * 1000,
  errorHandler: err => {
    /* istanbul ignore next */
    console.error(err);
  },
  store: new RedisStore({
    url: config.redisUri,
    key: config.sessionKey,
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    path: `${config.appUrlPrefix}/`,
  },
});

exports.normal = sessionMiddleware;

exports.readonly = (ctx, next) => sessionMiddleware(ctx, () => {
  if (!_.get(ctx, 'session.user.account')) {
    throw errors.get('用户尚未登录', 403);
  }
  Object.freeze(ctx.session);
  return next();
});
