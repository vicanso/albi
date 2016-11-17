const Joi = require('joi');
const _ = require('lodash');

const errors = localRequire('helpers/errors');
const UserService = localRequire('services/user');
const {
  randomToken,
} = localRequire('helpers/utils');

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
    throw errors.get(101);
  }
  if (ctx.method === 'GET') {
    const user = {
      token: randomToken(),
    };
    session.user = user;
    ctx.set('Cache-Control', 'no-store');
    /* eslint no-param-reassign:0 */
    ctx.body = user;
    return null;
  }

  const token = _.get(session, 'user.token');
  if (!token) {
    throw errors.get(102);
  }
  const { account, password } = ctx.request.body;
  return UserService.get(account, password, token).then((doc) => {
    const user = pickUserInfo(doc);
    const ip = ctx.ip;
    user.token = randomToken();
    user.loginCount += 1;
    /* eslint no-param-reassign:0 */
    ctx.session.user = user;
    /* eslint no-param-reassign:0 */
    ctx.body = user;
    /* eslint no-underscore-dangle:0 */
    UserService.update(doc._id, {
      lastLoginedAt: (new Date()).toISOString(),
      loginCount: user.loginCount,
      ip,
    });
    UserService.addLoginRecord({
      account: user.account,
      token: user.token,
      userAgent: ctx.get('User-Agent'),
      ip,
    });
  });
};

exports.register = (ctx) => {
  const data = Joi.validateThrow(ctx.request.body, {
    account: Joi.string().min(4).required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  });
  if (_.get(ctx, 'session.user.account')) {
    throw errors.get(103);
  }
  const ip = ctx.ip;
  data.ip = ip;
  return UserService.add(data).then((doc) => {
    const user = pickUserInfo(doc);
    user.token = randomToken();
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

