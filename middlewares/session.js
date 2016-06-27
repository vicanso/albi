'use strict';
const session = require('koa-simple-session');
const RedisStore = require('koa-simple-redis');
const config = localRequire('config');
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

const normal = exports.normal = (ctx, next) => {
  const startAt = process.hrtime();
  return sessionMiddleware(ctx, () => {
    const diff = process.hrtime(startAt);
    const time = diff[0] * 1e3 + diff[1] * 1e-6;
    console.info(`get session use:${time.toFixed(2)}`);
    return next();
  });
};

exports.readonly = (ctx, next) => normal(ctx, () => {
  Object.freeze(ctx.session);
  return next();
});
