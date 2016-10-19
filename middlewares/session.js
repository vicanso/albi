const session = require('koa-simple-session');
const RedisStore = require('koa-simple-redis');
const _ = require('lodash');

const config = localRequire('config');

const sessionMiddleware = session({
  key: config.app,
  prefix: `${config.app}-session:`,
  ttl: config.session.ttl,
  errorHandler: err => console.error(err),
  store: new RedisStore({
    url: config.redisUri,
    key: config.session.key,
  }),
  cookie: {
    maxAge: config.session.maxAge,
  },
});

const normal = exports.normal = (ctx, next) => {
  const startAt = process.hrtime();
  return sessionMiddleware(ctx, () => {
    const diff = process.hrtime(startAt);
    const time = (diff[0] * 1e3) + (diff[1] * 1e-6);
    const account = _.get(ctx, 'session.user.account', 'unknown');
    console.info(`get session user:${account} use:${time.toFixed(2)}ms`);
    return next();
  });
};

exports.readonly = (ctx, next) => normal(ctx, () => {
  Object.freeze(ctx.session);
  return next();
});
