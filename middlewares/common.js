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

exports.version = (v, t) => {
  const versions = _.isArray(v) ? v : [v]
  const typeList = t ? (_.isArray(t) ? t : [t]) : ['json'];
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
}