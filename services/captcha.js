/**
 * 获取captcha相关信息与校验
 */
const shortid = require('shortid');
const request = require('../helpers/request');
const cacheService = require('./cache');
const configs = require('../configs');
/**
 * 获取captcha
 *
 * @returns {Object} {
 *  id: "ryXpjpGOW",
 *  data: "base64 string"
 * }
 */
exports.get = async function get() {
  const url = `${configs.gateWay}/captchas`;
  const {
    body,
  } = await request.get(url)
    .set('X-Service', 'Captcha')
    .set('Token', '6VR3NrdFPp');
  const id = shortid();
  await cacheService.setCaptcha(id, body.code);
  return {
    id,
    data: body.data,
  };
};
/**
 * 校验captcha
 *
 * @param {String} id 图形验证码ID
 * @param {String} code 图形验证码
 * @param {Boolean} [once=true] 是否仅使用一次
 */
exports.validate = async function validate(id, code, once = true) {
  const result = await cacheService.validateCaptcha(id, code, once);
  return result;
};
