'use strict';
const session = require('koa-simple-session');
const RedisStore = require('koa-simple-redis');
const config = localRequire('config');
const koaConvert = require('koa-convert');
const sessionMiddleware = session({
  store: new RedisStore({
    url: config.redisUri,
    key: config.sessionKey,
  }),
});;
exports.normal = sessionMiddleware;

exports.readonly = (ctx, next) => {
  return sessionMiddleware(ctx, () => {
    Object.freeze(ctx.session);
    return next();
  });
};
