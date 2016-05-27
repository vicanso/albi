'use strict';
const session = require('koa-generic-session');
const RedisStore = require('koa-redis');
const config = localRequire('config');
const koaConvert = require('koa-convert');

let sessionMiddleware = null;
exports.normal = (ctx, next) => {
  // console.dir(ctx.session);
  return next();
  // if (!sessionMiddleware) {
  //   sessionMiddleware = koaConvert(session({
  //     store: new RedisStore({
  //       url: config.redisUri,
  //       key: config.sessionKey,
  //     }),
  //   }));
  // }
  // const done = () => {
  //   const p = new Promise((resolve, reject) => {
  //     return resolve();
  //   });
  //   return p.then(next);
  // }
  // return sessionMiddleware(ctx, done);
};
