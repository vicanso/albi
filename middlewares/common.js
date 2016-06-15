'use strict';
const _ = require('lodash');
const errors = localRequire('helpers/errors');
const influx = localRequire('helpers/influx');
const url = require('url');
const checker = require('koa-query-checker');
const noCacheQuery = checker('cache=false');

exports.noQuery = () => (ctx, next) => {
  if (_.isEmpty(ctx.query)) {
    return next();
  }
  throw errors.get('query string must be empty', 400);
};

exports.deprecate = (hint) => (ctx, next) => {
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

exports.cacheMaxAge = (maxAge) => (ctx, next) => next().then(() => {
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
