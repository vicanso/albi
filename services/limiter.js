/**
 * 此模块用于做次数限制的功能功能
 * @module services/limiter
 */
const Limiter = require('superlimiter');

const {
  client,
} = require('../helpers/redis');


const loginFailLimiter = new Limiter(client, {
  // 间隔时间10分钟
  ttl: 10 * 60,
  max: 5,
  prefix: 'super-limiter-login-fail-',
});

/**
 * 获取登录失败数量
 *
 * @param {String} account
 * @returns {Number}
 */
exports.getLoginFailCount = async function getLoginFailCount(account) {
  const count = await loginFailLimiter.getCount(account);
  return Number.parseInt(count || 0, 10);
};

/**
 * 登录失败数量增加
 *
 * @param {String} account
 */
exports.incLoginFailCount = async function incLoginFailCount(account) {
  await loginFailLimiter.exec(account);
};

/**
 * 生成一个limiter
 *
 * @param {Object} options
 * @returns {Limiter}
 */
exports.create = function create(options) {
  return new Limiter(client, options);
};
