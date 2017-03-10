const _ = require('lodash');
const url = require('url');
const checker = require('koa-query-checker');

const errors = localRequire('helpers/errors');
const influx = localRequire('helpers/influx');
const noCacheQuery = checker('cache-control=no-cache');

exports.noQuery = () => (ctx, next) => {
  if (_.isEmpty(ctx.query)) {
    return next();
  }
  throw errors.get(2);
};

exports.deprecate = hint => (ctx, next) => {
  ctx.set('Warning', hint);
  console.warn(`deprecate - ${ctx.url} is still used.`);
  const urlInfo = url.parse(ctx.url);
  influx.write('deprecate', {
    path: urlInfo.pathname,
  });
  return next();
};

exports.noCache = () => (ctx, next) => {
  const method = ctx.method.toUpperCase();
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  if ((method !== 'GET' && method !== 'HEAD')
    || ctx.get('Cache-Control') === 'no-cache') {
    return next();
  }
  return noCacheQuery(ctx, next);
};

exports.version = (v, _t) => {
  const versions = _.isArray(v) ? v : [v];
  const t = _t || ['json'];
  const typeList = _.isArray(t) ? t : [t];
  return (ctx, next) => {
    const version = _.get(ctx, 'versionConfig.version', 1);
    if (_.indexOf(versions, version) === -1) {
      throw errors.get(`version is invalid, it should be version:[${versions.join(',')}]`, 406);
    }
    const type = _.get(ctx, 'versionConfig.type', 'json');
    if (_.indexOf(typeList, type) === -1) {
      throw errors.get(`type is invalid, it should be type:[${typeList.join(',')}]`, 406);
    }
    return next();
  };
};

exports.cacheMaxAge = maxAge => (ctx, next) => next().then(() => {
  ctx.set('Cache-Control', `public, max-age=${maxAge}`);
});

// the function is https://github.com/koajs/koa-fresh
exports.fresh = (ctx, next) => next().then(() => {
  const {
    status,
    body,
    method,
  } = ctx;
  if (!body || status === 304) {
    return;
  }
  let cache = method === 'GET' || method === 'HEAD';
  if (cache) {
    cache = status >= 200 && status < 300;
  }
  if (cache && ctx.fresh) {
    /* eslint no-param-reassign:0 */
    ctx.status = 304;
    ctx.remove('Content-Type');
    ctx.remove('Content-Length');
  }
});


exports.routeStats = (ctx, next) => {
  const start = Date.now();
  const end = ctx.state.timing.start('route');
  const delayLog = (use) => {
    const method = ctx.method.toUpperCase();
    const layer = _.find(ctx.matched, tmp => _.indexOf(tmp.methods, method) !== -1);
    /* istanbul ignore if */
    if (!layer) {
      return;
    }
    influx.write('httpRoute', {
      use,
    }, {
      method: method.toLowerCase(),
      path: layer.path,
      spdy: _.sortedIndex([30, 100, 300, 1000, 3000], use),
    });
  };
  return next().then(() => {
    end();
    setImmediate(delayLog, Date.now() - start);
  });
};
