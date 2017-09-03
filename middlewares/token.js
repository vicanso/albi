const _ = require('lodash');
const shortid = require('shortid');

const {
  client,
} = require('../helpers/redis');
const errors = require('../helpers/errors');

/**
 * 生成token中间件，用于生成一次性token，用于避免重复提交的操作
 *
 * @param {Integer} ttl
 * @param {string} [key='session-token']
 * @returns {Function}
 */
exports.create = function tokenMiddleware(ttl, key = 'session-token') {
  return async function createToken(ctx, next) {
    const user = _.get(ctx, 'session.user');
    const token = shortid();
    await client.setex(`${key}-${user.account}-${user.token}`, ttl, token);
    ctx.state.token = token;
    return next();
  };
};

/**
 * 校验token是否可用(token主要用于避免多次提交的操作)
 * 在做提交操作时，将之前获取到token设置到HTTP Header中的X-Token
 *
 * @param {string} [key='session-token']
 * @returns {Function}
 */
exports.validate = function tokenValidateMiddleware(key = 'session-token') {
  return async function validateToken(ctx, next) {
    const token = ctx.get('X-Token');
    const user = _.get(ctx, 'session.user');
    const id = `${key}-${user.account}-${user.token}`;
    const result = await client.get(id);
    client.del(id);
    if (token !== result) {
      throw errors.get('user.tokenInvalid');
    }
    return next();
  };
};
