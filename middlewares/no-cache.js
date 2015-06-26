'use strict';
const checker = require('../../koa-query-checker');
const noCacheQuery = checker('cache=false');
module.exports = noCache;

function *noCache(next) {
  let ctx = this;
  let headers = ctx.headers;
  if (headers['cache-control'] === 'no-cache') {
    yield next;
  } else {
    yield noCacheQuery.call(this, next);
  }
}
