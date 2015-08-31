'use strict';
const _ = require('lodash');
const errors = localRequire('errors');
exports['no-query'] = noQuery;


function* noQuery(next) {
  /*jshint validthis:true */
  let ctx = this;
  if (_.isEmpty(ctx.query)) {
    yield * next;
  } else {
    throw errors.get('query参数必须为空');
  }
}
