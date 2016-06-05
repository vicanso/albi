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

exports.defaultVersion = (version) => (ctx, next) => {
  ctx.versionConfig = _.extend({
    version: 1,
    type: 'json',
  }, version, ctx.versionConfig);
  return next();
};