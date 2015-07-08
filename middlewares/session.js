'use strict';
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const debug = require('../helpers/debug');
const _ = require('lodash');
let sessionParser = null;
exports.init = init;
exports.get = get;

/**
 * [init 初始化session redis client]
 * @param  {Boolean} redisConfig   [description]
 * @param  {[type]}  sessionConfig [description]
 * @return {[type]}                [description]
 */
function init(redisConfig, sessionConfig) {
  debug('session redisConfig:%j, sessionConfig:%j', redisConfig, sessionConfig);
  let store = redisStore(redisConfig);
  let options = _.clone(sessionConfig);
  options.store = store;
  options.errorHandler = function errorHandler(err, type) {
    console.error('session error:%s, type:%s', err.message, type);
  };
  sessionParser = session(options);
}


/**
 * [get 获取session]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function *get(next) {
  /*jshint validthis:true */
  let ctx = this;
  if (!sessionParser) {
    yield* next;
  } else {
    yield* sessionParser.call(ctx, next);
  }
}
