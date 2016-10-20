const uuid = require('node-uuid');
const Joi = require('joi');
const _ = require('lodash');

const errors = localRequire('helpers/errors');
const UserService = localRequire('services/user');

const pickUserInfo = (data) => {
  const keys = 'account lastLoginedAt loginCount'.split(' ');
  return _.pick(data, keys);
};

exports.me = (ctx) => {
  const data = _.clone(ctx.session.user || {});
  data.date = new Date();
  /* eslint no-param-reassign:0 */
  ctx.body = data;
};

exports.logout = (ctx) => {
  delete ctx.session.user;
  /* eslint no-param-reassign:0 */
  ctx.body = null;
};

exports.login = (ctx) => {
  const session = ctx.session;
  if (_.get(session, 'user.account')) {
    throw errors.get('Already logged in, please sign out first', 400);
  }
  if (ctx.method === 'GET') {
    const user = {
      token: uuid.v4(),
    };
    session.user = user;
    ctx.set('Cache-Control', 'no-store');
    /* eslint no-param-reassign:0 */
    ctx.body = user;
    return null;
  }

  const token = _.get(session, 'user.token');
  if (!token) {
    throw errors.get('Login fail, token can not be null', 400);
  }
  const { account, password } = ctx.request.body;
  // 如果密码错误，是否需要刷新 token，但是 error 的时候，session 不会做保存
  return UserService.get(account, password, token).then((doc) => {
    const user = pickUserInfo(doc);
    const ip = ctx.ip;
    user.token = uuid.v4();
    /* eslint no-param-reassign:0 */
    ctx.session.user = user;
    /* eslint no-param-reassign:0 */
    ctx.body = user;
    /* eslint no-underscore-dangle:0 */
    UserService.update(doc._id, {
      lastLoginedAt: (new Date()).toISOString(),
      loginCount: doc.loginCount + 1,
      ip,
    });
    UserService.addLoginRecord({
      account: user.account,
      token: user.token,
      userAgent: ctx.get('User-Agent'),
      ip,
    });
  }, (err) => {
    const newToken = uuid.v4();
    session.user.token = newToken;
    ctx.status = err.status;
    ctx.body = {
      token: newToken,
      message: err.message,
      expected: err.expected || false,
    };
  });
};

exports.register = (ctx) => {
  const data = Joi.validateThrow(ctx.request.body, {
    account: Joi.string().min(4).required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  });
  if (_.get(ctx, 'session.user.account')) {
    throw errors.get('Already logged in, please sign out first', 400);
  }
  const ip = ctx.ip;
  data.ip = ip;
  return UserService.add(data).then((doc) => {
    const user = pickUserInfo(doc);
    user.token = uuid.v4();
    /* eslint no-param-reassign:0 */
    ctx.session.user = user;
    /* eslint no-param-reassign:0 */
    ctx.body = user;
    UserService.addLoginRecord({
      account: user.account,
      token: user.token,
      userAgent: ctx.get('User-Agent'),
      ip,
    });
  });
};

exports.like = (ctx) => {
  const {
    version,
    type,
  } = ctx.versionConfig;
  if (version < 3) {
    ctx.set('Warning', 'Version 2 is deprecated.');
  }
  /* eslint no-param-reassign:0 */
  ctx.body = {
    count: 10,
    version,
    type,
  };
};

