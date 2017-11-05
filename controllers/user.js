/**
 * 此模块主要是用户相关的处理
 * @module controllers/user
 */
const Joi = require('joi');
const _ = require('lodash');
const shortid = require('shortid');

const configs = require('../configs');
const errors = require('../helpers/errors');
const userService = require('../services/user');
const limiterService = require('../services/limiter');
const cacheService = require('../services/cache');
const mailService = require('../services/mail');


const defaultSchema = {
  account: Joi.string().min(4).max(32).required(),
  password: Joi.string().required(),
  email: Joi.string().email().max(64).required(),
};

/**
 * 从用户信息中选择字段返回给前端使用，避免直接返回时把不应该展示的字段也返回了
 * @param  {Object} userInfos 用户数据
 * @return {Object} 筛选的数据 {
 * account: String,
 * lastLoginedAt: ISOString,
 * loginCount: Integer,
 * token: String,
 * date: ISOString,
 * }
 */
const pickUserInfo = (userInfos) => {
  const keys = 'account lastLoginedAt loginCount token roles'.split(' ');
  let anonymous = true;
  if (userInfos.account) {
    anonymous = false;
  }
  return _.extend({
    anonymous,
    date: new Date().toISOString(),
  }, _.pick(userInfos, keys));
};

/**
 * 从session获取当前登录用户的信息
 *
 * @param {Method} GET
 * @prop {Middlware} session
 * @prop {Route} /users/me
 * @example curl -XGET 'http://127.0.0.1:5018/users/me?cache-control=no-cache'
 * @return {Body} 用户信息，如果未登录，只有date字段，如果已登录返回`pickUserInfo`的数据
 */
exports.me = function getUserInfo(ctx) {
  // eslint-disable-next-line
  ctx.body = pickUserInfo(ctx.session.user || {});
  if (!ctx.cookies.get(configs.trackCookie)) {
    ctx.cookies.set(configs.trackCookie, shortid(), {
      maxAge: 365 * 24 * 3600 * 1000,
      signed: true,
    });
  }
};

/**
 * 退出用户登录状态，并删除session信息
 *
 * @param {Method} DELETE
 * @prop {Middlware} session.login
 * @prop {Route} /users/logout
 * @example curl -XDELETE 'http://127.0.0.1:5018/users/logout'
 * @return {Body} 成功则返回null
 */
exports.logout = (ctx) => {
  delete ctx.session.user;
  // eslint-disable-next-line
  ctx.body = null;
};

/**
 * 如果是GET，则返回一个随机的token，记录入到session中，用于用户密码hash使用
 * @param {Method} GET
 * @prop {Middlware} session
 * @prop {Route} /users/login
 * @example curl -XGET 'http://127.0.0.1:5018/users/login?cache-control=no-cache'
 * @return {Body} {token: String}
 */
exports.loginToken = function getLoginToken(ctx) {
  const session = ctx.session;
  if (_.get(session, 'user.account')) {
    throw errors.get('user.hasLogined');
  }
  const user = {
    token: shortid(),
  };
  session.user = user;
  ctx.set('Cache-Control', 'no-store');
  // eslint-disable-next-line
  ctx.body = user;
};

/**
 * 用户登录，并将用户信息记录到session中
 * @param {Method} POST
 * @param {String} body.account 用户账号
 * @param {String} body.password 用户密码
 * @prop {Middlware} session
 * @prop {Route} /users/login
 * @example curl -XPOST -d '{
 *  "account": "vicanso",
 *  "password": "aeroajreoajre"
 * }' 'http://127.0.0.1:5018/users/login'
 * @return {Body} 返回`pickUserInfo`的数据
 */
exports.login = async function login(ctx) {
  const session = ctx.session;
  if (_.get(session, 'user.account')) {
    throw errors.get('user.hasLogined');
  }
  const token = _.get(session, 'user.token');
  if (!token) {
    throw errors.get('user.tokenIsNull');
  }
  const data = Joi.validate(ctx.request.body, {
    account: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { account, password } = data;
  const loginFailCount = await limiterService.getLoginFailCount(account);
  if (loginFailCount > 5) {
    throw errors.get('user.loginFailExceededLimit');
  }
  let doc = null;
  try {
    doc = await userService.get(account, password, token);
  } catch (err) {
    limiterService.incLoginFailCount(account);
    throw err;
  }
  const user = _.omit(doc, 'password');
  const ip = ctx.ip;
  user.token = shortid();
  user.loginCount += 1;
  // eslint-disable-next-line
  ctx.session.user = user;
  // eslint-disable-next-line
  ctx.body = pickUserInfo(user);
  // eslint-disable-next-line
  userService.update(doc._id, {
    lastLoginedAt: (new Date()).toISOString(),
    loginCount: user.loginCount,
    ip,
  });
  userService.addLoginRecord({
    account: user.account,
    token: user.token,
    userAgent: ctx.get('User-Agent'),
    ip,
    track: ctx.cookies.get(configs.trackCookie),
  });
};

/**
 * 刷新用户session的ttl
 * @param {Method} PATCH
 * @prop {Middleware} session
 * @prop {Route} /users/me
 * @example curl -XPATCH 'http://127.0.0.1:5018/users/me'
 * @return {Body} nobody 204
 */
exports.refreshSession = function refreshSession(ctx) {
  ctx.session.updatedAt = new Date().toISOString();
  ctx.body = null;
};

/**
 * 用户注册
 * @param {Method} POST
 * @param {String} body.account 用户账号
 * @param {String} body.password 用户密码
 * @param {String} body.email 用户邮箱
 * @prop {Middleware} session
 * @prop {Route} /users/register
 * @example curl -XPOST -d '{
 *  "account": "vicanso",
 *  "password": "fdjaojreao",
 *  "email": "vicansocanbico@gmail.com"
 * }' 'http://127.0.0.1:5018/users/register'
 * @return {Body} 从用户信息中返回pickUserInfo函数获取的值
 */
exports.register = async function register(ctx) {
  const data = Joi.validate(ctx.request.body, {
    account: Joi.string().min(4).required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  });
  if (_.get(ctx, 'session.user.account')) {
    throw errors.get('user.hasLogined');
  }
  const ip = ctx.ip;
  data.ip = ip;
  const doc = await userService.add(data);
  doc.token = shortid();
  const user = pickUserInfo(doc);
  // eslint-disable-next-line
  ctx.session.user = user;
  ctx.status = 201;
  // eslint-disable-next-line
  ctx.body = user;
  userService.addLoginRecord({
    account: user.account,
    token: user.token,
    userAgent: ctx.get('User-Agent'),
    ip,
  });
};


/**
 * 获取所有用户
 * @param {Method} GET
 * @prop {Middleware} admin
 * @prop {Route} /users
 * @example curl -XGET 'http://127.0.0.1:5018/users?cache-control=no-cache'
 * @return {Body} {
 *  "items": [
 *    "_id": "59ff04f90a809f0001126cec",
 *    "createdAt": "2017-10-29T01:23:11.247Z",
 *    "account": "vicanso",
 *    "email": "vicansocanbico@gmail.com",
 *    "loginCount": 10,
 *    "roles": [ "admin" ],
 *    "lastLoginedAt": "2017-11-05T11:58:44.412Z"
 *  ]
 * }
 */
exports.list = async function list(ctx) {
  const options = Joi.validate(ctx.query, {
    limit: Joi.number().integer().min(10).max(100)
      .default(10),
    skip: Joi.number().integer().min(0).default(0),
    count: Joi.boolean().default(false),
    sort: Joi.string(),
    keyword: Joi.string(),
  });
  const sort = options.sort;
  delete options.sort;
  const conditions = {};
  const keyword = options.keyword;
  delete options.keyword;
  if (keyword) {
    conditions.account = new RegExp(keyword, 'gi');
  }
  const result = {};
  if (options.count) {
    result.count = await userService.count(conditions);
  }
  delete options.count;
  result.items = await userService.list(conditions, _.clone(options), sort);
  ctx.body = result;
};


/**
 * 更新用户权限
 * @param {Method} PATCH
 * @prop {Middleware} admin
 * @prop {Route} /users/:id/roles
 * @example curl -XPATCH -d '{
 *  "roles": ["admin", "seller"]
 * }' 'http://127.0.0.1:5018/users/59885ffd4046790a00c14ea8/roles'
 * @return {Body} 204
 */
exports.updateRoles = async function updateRoles(ctx) {
  const data = Joi.validate(ctx.request.body, {
    roles: Joi.array().items(
      Joi.string().valid(['admin', 'buyer', 'seller']),
    ),
  });
  const userRoles = ctx.session.user.roles;
  const roles = data.roles;
  if (_.indexOf(roles, 'admin') !== -1 && _.indexOf(userRoles, 'su') === -1) {
    throw errors.get('user.forbidSetAdmin');
  }
  await userService.updateRoles(ctx.params.id, roles);
  ctx.body = null;
};

/**
 * 更新用户信息
 * @param {Method} PATCH
 * @param {String} body.email 邮箱地址
 * @param {String} body.wechat 微信ID
 * @prop {Middleware} login
 * @prop {Route} /users/me/infos
 * @example curl -XPATCH -d '{
 *  "email": "vicanso@gmail.com",
 *  "wechat": "vicanso"
 * }' 'http://127.0.0.1:5018/users/me/infos'
 */
exports.update = async function update(ctx) {
  const data = Joi.validate(ctx.request.body, {
    email: defaultSchema.email,
  });
  const account = _.get(ctx, 'session.user.account');
  await userService.findOneAndUpdate({
    account,
  }, data);
  ctx.body = null;
};

/**
 * 获取一次性使用token（时效为5分钟）
 *
 * @param {Method} GET
 * @prop {Middleware} session
 * @prop {Middleware} token
 * @prop {Route} /users/token
 * @example curl -XGET 'http://127.0.0.1:5018/users/token'
 * @return {Body} {"token": "joxjaw"}
 */
exports.getToken = async function getToken(ctx) {
  ctx.body = {
    token: ctx.state.token,
  };
};

exports.validateToken = (ctx) => {
  ctx.body = null;
};

/**
 * 获取重置密码的token
 *
 * @param {Method} POST
 * @param {String} body.account 账号
 * @prop {Route} /users/gen-reset-token
 * @example curl -XPOST -d '{"email": "text@gmail.com"}'
 *  'http:/127.0.0.1:5018/users/gen-reset-token'
 * @return {Body}
 */
exports.genResetPasswordToken = async function genResetPasswordToken(ctx) {
  const {
    account,
  } = Joi.validate(ctx.request.body, {
    account: defaultSchema.account,
  });
  const {
    lang,
  } = ctx.state;
  const user = await userService.findOne({
    account,
  }, 'email');
  if (!user) {
    ctx.status = 201;
    return;
  }
  const email = user.email;
  const id = `${shortid()}-${shortid()}`;
  await cacheService.setResetPasswordToken(id, account);
  let title = 'Reset Password';
  let content = `您选择了重置密码，随机码为:${id}，30分钟有效`;
  if (lang === 'zh') {
    title = '重置密码';
    content = `You use the password reset function, the random key is ${id}, expired after 30 minutes`;
  }
  await mailService.send(title, content, email);
  ctx.status = 201;
};


/**
 * 重置密码
 *
 * @param {Method} PATCH
 * @param {String} body.token
 * @param {String} body.password
 * @param {String} body.account
 * @example curl -XPOST
 * -d '{"token": "arejoajre", "password": "jfoejworjeo", "account": "treexie"}'
 * 'http://127.0.0.1:5018/users/reset-password'
 */
exports.resetPassword = async function resetPassword(ctx) {
  const {
    token,
    password,
    account,
  } = Joi.validate(ctx.request.body, {
    token: Joi.string().trim().required(),
    password: defaultSchema.password,
    account: defaultSchema.account,
  });
  const tokenAccount = await cacheService.getResetPasswordAccount(token);
  if (!tokenAccount || tokenAccount !== account) {
    throw errors.get('user.tokenInvalidExpired');
  }
  await userService.findOneAndUpdate({
    account,
  }, {
    password,
  });
  ctx.status = 204;
};
