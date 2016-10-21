const _ = require('lodash');
const url = require('url');
const checker = require('koa-query-checker');
const stringify = require('simple-stringify');

const errors = localRequire('helpers/errors');
const influx = localRequire('helpers/influx');
const noCacheQuery = checker('cache=false');

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


exports.routeStats = (ctx, next) => {
  const start = Date.now();
  return next().then(() => {
    const use = Date.now() - start;
    const method = ctx.method.toUpperCase();
    const layer = _.find(ctx.matched, tmp => _.indexOf(tmp.methods, method) !== -1);
    /* istanbul ignore if */
    if (!layer) {
      return;
    }
    influx.write('http-route', {
      use,
    }, {
      method: method.toLowerCase(),
      path: layer.path,
      spdy: _.sortedIndex([30, 100, 300, 1000, 3000], use),
    });
  });
};


exports.tracker = (category, params) => (ctx, next) => {
  const data = {
    category,
    token: ctx.get('X-Token') || 'unknow',
  };
  _.forEach(params, (param) => {
    const v = ctx.request.body[param] || ctx.params[param] || ctx.query[param];
    if (!_.isUndefined(v)) {
      data[param] = v;
    }
  });
  return next().then(() => {
    data.result = 'success';
    console.info(`user tracker ${stringify.json(data)}`);
  }, (err) => {
    data.result = 'fail';
    console.info(`user tracker ${stringify.json(data)}`);
    throw err;
  });
};
