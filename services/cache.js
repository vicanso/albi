/**
 * 与缓存相关的功能
 */

const {
  client,
} = require('../helpers/redis');


/**
 * 获取session信息
 *
 * @param {String} key session key
 */
exports.getSession = async function getSession(key) {
  const data = await client.get(key);
  return JSON.parse(data);
};

/**
 * 设置captcha的缓存
 *
 * @param {String} key
 * @param {String} code
 */
exports.setCaptcha = async function setCaptcha(key, code) {
  await client.setex(`captcha-${key}`, 300, code);
};

/**
 * 校验captcha
 *
 * @param {String} key 图形验证码保存的key
 * @param {String} code 图形验证码
 * @param {Boolean} once 是否仅使用一次
 */
exports.validateCaptcha = async function validateCaptcha(key, code, once) {
  const id = `captcha-${key}`;
  const result = await client.get(id);
  if (!result) {
    return false;
  }
  if (once) {
    await client.del(id);
  }
  if (result !== code) {
    return false;
  }
  return true;
};


/**
 * 缓存重置密码的token与account
 *
 * @param {String} key
 * @param {String} account
 */
exports.setResetPasswordToken = async function setResetPasswordToken(key, account) {
  await client.setex(`reset-password-${key}`, 30 * 60, account);
};

/**
 * 校验重置密码的token是否合法，合法则返回account
 *
 * @param {String} key
 * @return {String} account
 */
exports.getResetPasswordAccount = async function getResetPasswordAccount(key) {
  const id = `reset-password-${key}`;
  const account = await client.get(id);
  if (!account) {
    return null;
  }
  await client.del(id);
  return account;
};
