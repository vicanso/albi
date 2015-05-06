'use strict';
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('lodash');
var crypto = require('crypto');
var util = require('util');
var config = require('../config');
var debug = require('../helpers/debug');
var user = require('../services/user');
var errors = require('../errors');
module.exports = function *(){
  var method = this.method;
  switch(method){
    case 'GET':
      getUserSession(this);
    break;
    case 'POST':
      var data = this.request.body;
      if(data.type === 'register'){
        yield register(this, data);
      }else{
        yield login(this, data);
      }
    break;
    case 'DELETE':
      logout(this);
    break;
    default:
      ctx.body = {
        msg : 'not support'
      };
      var err = new Error('not support method:' + method);
      throw err;
    break;
  }
};

/**
 * [pickSession pick session相关数据]
 * @return {[type]} [description]
 */
function pickSession(data){
  data = data || {};
  var result = _.pick(data, ['account', 'name', 'code', 'lastLoginedAt', 'loginTimes']);
  if(result.account){
    result.anonymous = false;
  }else{
    result.anonymous = true;
  }
  result.code = result.code || uuid.v4();
  result.createdAt = result.createdAt || Date.now();
  result.now = Date.now();
  return result;
}


/**
 * [register 注册]
 * @return {[type]} [description]
 */
function *register(ctx, data){
  data = _.pick(data, ['account', 'password']);
  var result = yield user.create(data);
  result.ip = ctx.ips[0] || ctx.ip;
  result.ua = ctx.request.header['user-agent'];
  var userInfo = pickSession(result);
  ctx.session.data = result;
  ctx.body = userInfo;
}

/**
 * [login 登录]
 * @return {[type]} [description]
 */
function *login(ctx, data){
  var sess = ctx.session;
  var shasum = crypto.createHash('sha1');

  var doc = yield user.get({account : data.account});
  if(!doc){
    throw errors.get(203);
  }
  shasum.update(doc.password + sess.data.code);
  if(shasum.digest('hex') === data.password){
    doc.lastLoginedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
    doc.loginTimes++;

    let userData = pickSession(doc);
    sess.data = _.extend(sess.data, userData);
    sess.data.ip = ctx.ips[0] || ctx.ip;
    sess.data.ua = ctx.request.header['user-agent'];
    ctx.body = userData;
    yield user.update({account : data.account}, _.pick(doc, ['loginTimes', 'lastLoginedAt']));
  }else{
    throw errors.get(204);
  }
}

/**
 * [logout description]
 * @return {[type]} [description]
 */
function logout(ctx){
  var sess = ctx.session;
  var data = pickSession();
  sess.data = _.clone(data);
  ctx.body = data;
}

/**
 * [getUserSession 获取用户session信息]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function getUserSession(ctx){
  var cookies = ctx.cookies;
  var jtuuid = cookies.get(config.uuidKey);
  var sessionKey = cookies.get(config.sessionKey);
  debug('uuid:%s session key:%s value:%j', jtuuid, sessionKey, ctx.session.data);
  if(!jtuuid){
    cookies.set('jtuuid', uuid.v4(), {
      maxAge : 365 * 24 * 3600 * 1000
    });
    // TODO 记录为用户第一次打开（新增用户）
    console.info('user++');
  }
  if(!sessionKey){
    // TODO 记录UV
    console.info('uv++');
  }
  // 是否将用户pv的次数记录在redis
  var data;
  if(ctx.session.data){
    data = pickSession(ctx.session.data);
  }else{
    data = pickSession();
    ctx.session.data = _.clone(data);
  }
  ctx.body = data;
}

/**
 * [validate 验证用户是否合法的（主要判断与session中保存的ua和ip是否一致）]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function validate(ctx){
  var ip = ctx.ips[0] || ctx.ip;
  var ua = ctx.request.header['user-agent'];
  var userData = ctx.session.data;
  if(userData.account){
    if(userData.ip === ip && userData.ua === ua){
      return true;
    }else{
      return false;
    }
  }else{
    return true;
  }

}