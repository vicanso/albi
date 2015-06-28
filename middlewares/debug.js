'use strict';
const _ = require('lodash');
const debug = require('../helpers/debug');

module.exports = function (params) {
  if (_.isEmpty(params)) {
    throw new Error('params is empty');
  }
  return function *(next) {
    /*jshint validthis:true */
    let ctx = this;
    let state = ctx.state;
    let query = ctx.query;
    _.forEach(params, function (v, k) {
      if (_.has(query, v)) {
        if (query[v]) {
          state[k] = query[v];
        } else {
          state[k] = true;
        }
      }
    });
    yield next;
  }
}
