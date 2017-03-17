/**
 * 此模块主要生成各类session相关的中间件
 * @module middlewares/session
 */
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

/**
 * session中间件，由于用到session的接口都是基于用户的，因此都是不能在`varnish`中做缓存，
 * 因此此中间件会校验请求的Header是否有设置为`Cache-Control:no-cache`
 * 或者querystring中`cache-control=no-cache`，如果两者都没有，则返回出错。
 * 在成功获取session之后，会将请求时间等写到influxdb中做统计
 * @param  {Object}   ctx  koa context
 * @param  {Function} next koa next
 * @return {Promise}
 */
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

/**
 * 可读写session中间件
 * @return {Function} 返回中间件处理函数
 */
exports.writable = () => normal;

/**
 * 只读session中间件
 * @return {Function} 返回中间件处理函数
 */
exports.readonly = () => (ctx, next) => normal(ctx, () => {
  Object.freeze(ctx.session);
  return next();
});

/**
 * 可读写session中间件，并判断用户是否已经登录
 * @return {Function} 返回中间件处理函数
 */
exports.login = () => (ctx, next) => normal(ctx, () => {
  if (!_.get(ctx, 'session.user.account')) {
    throw errors.get(107);
  }
  return next();
});

/**
 * 只读session中间件，并判断用户是否已经登录
 * @return {Function} 返回中间件处理函数
 */
exports.loginReadonly = () => (ctx, next) => normal(ctx, () => {
  if (!_.get(ctx, 'session.user.account')) {
    throw errors.get(107);
  }
  Object.freeze(ctx.session);
  return next();
});
