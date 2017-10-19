/**
 * 此模块主要生成各类session相关的中间件
 * @module middlewares/session
 */
const _ = require('lodash');
const als = require('async-local-storage');
const koaSession = require('koa-session');

const configs = require('../configs');
const errors = require('../helpers/errors');
const influx = require('../helpers/influx');
const {
  sessionStore,
} = require('../helpers/redis');

let sessionMiddleware = null;
exports.init = (app) => {
  if (sessionMiddleware) {
    return;
  }
  sessionMiddleware = koaSession(app, {
    store: sessionStore,
    key: configs.session.key,
    maxAge: configs.session.maxAge,
    beforeSave: (ctx, session) => {
      // session中不要添加 createdAt 与 updatedAt 字段
      if (!session.createdAt) {
        // eslint-disable-next-line
        session.createdAt = new Date().toISOString();
      }
      // eslint-disable-next-line
      session.updatedAt = new Date().toISOString();
    },
  });
};


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
  const method = ctx.method;
  if ((method === 'GET' || method === 'HEAD') && ctx.get('Cache-Control') !== 'no-cache' && ctx.query['cache-control'] !== 'no-cache') {
    throw errors.get('common.requestMustNoCache');
  }
  delete ctx.query['cache-control'];
  const startedAt = Date.now();
  const timing = ctx.state.timing;
  const end = timing.start('session');
  return sessionMiddleware(ctx, () => {
    const use = Date.now() - startedAt;
    const account = _.get(ctx, 'session.user.account', 'unknown');
    als.set('account', account);
    ctx.state.account = account;
    influx.write('session', {
      account,
      use,
    }, {
      spdy: _.sortedIndex([10, 30, 80, 200, 500], use),
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
 * 可读写session中间件，并判断用户是否已经登录
 * @return {Function} 返回中间件处理函数
 */
exports.login = () => (ctx, next) => normal(ctx, () => {
  if (!_.get(ctx, 'session.user.account')) {
    throw errors.get('user.mustLogined');
  }
  return next();
});

function roleValidate(roles) {
  return () => (ctx, next) => normal(ctx, () => {
    if (!_.get(ctx, 'session.user.account')) {
      throw errors.get('user.mustLogined');
    }
    const user = ctx.session.user;
    const rolesDesc = roles.join(' ');
    if (!_.find(user.roles, role => rolesDesc.indexOf(role) !== -1)) {
      throw errors.get('user.forbidden');
    }
    return next();
  });
}

/**
 * Admin权限校验中间件，判断用户是否已登录而且为admin
 * @return {Function} 返回中间件处理函数
 */
exports.admin = roleValidate(['admin', 'su']);

/**
 * su权限校验中间件，判断用户是否已登录而且为admin
 * @return {Function} 返回中间件处理函数
 */
exports.su = roleValidate(['su']);
