'use strict';
const errors = require('../errors');
const user = require('../services/user');
const _ = require('lodash');
const uuid = require('node-uuid');
exports.get = get;
exports.create = create;
exports.login = login;

/**
 * [pick description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function pick(data) {
  let keys = ['account', 'name', 'lastLoginedAt', 'loginTimes', 'anonymous'];
  return _.pick(data, keys);
}

/**
 * [get 从session中获取用户信息]
 * @return {[type]} [description]
 */
function *get(){
  /*jshint validthis:true */
  let ctx = this;
  let sess = ctx.session;
  let result = sess.user || {
    anonymous : true
  };
  yield function(done) {
    setImmediate(done);
  };
  ctx.body = pick(result);
}

/**
 * [create 创建用户]
 * @return {[type]} [description]
 */
function *create() {
  /*jshint validthis:true */
  let ctx = this;
  let result = yield user.create(ctx.request.body);
  delete result.password;
  result.anonymous = false;
  ctx.session.user = result;
  ctx.body = pick(result);
}


/**
 * [login 登录]
 * @return {[type]} [description]
 */
function *login() {
  /*jshint validthis:true */
  let ctx = this;
  let result = yield user.get(ctx.query);
  delete result.password;
  result.anonymous = false;
  ctx.session.user = result;
  ctx.body = pick(result);
}
