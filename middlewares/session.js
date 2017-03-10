const session = require('koa-simple-session');
const RedisStore = require('koa-simple-redis');
const _ = require('lodash');

const errors = localRequire('helpers/errors');
const config = localRequire('config');
const influx = localRequire('helpers/influx');

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

const normal = (ctx, next) => {
  if (ctx.session) {
    return next();
  }
  if (ctx.get('Cache-Control') !== 'no-cache' && ctx.query['cache-control'] !== 'no-cache') {
    throw errors.get(4);
  }
  const startedAt = Date.now();
  const timing = ctx.state.timing;
  const end = timing.start('session');
  return sessionMiddleware(ctx, () => {
    const use = Date.now() - startedAt;
    const account = _.get(ctx, 'session.user.account', 'unknown');
    influx.write('session', {
      account,
      use,
    }, {
      spdy: _.sortedIndex([10, 30, 80, 200], use),
    });
    end();
    return next();
  });
};

exports.writable = normal;

exports.readonly = (ctx, next) => normal(ctx, () => {
  Object.freeze(ctx.session);
  return next();
});
