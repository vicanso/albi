/**
 * 此模块主要是多语言相关
 * @module controllers/base
 */
const Joi = require('joi');

const captchaServce = require('../services/captcha');
const debug = require('../helpers/debug');

/**
 * 获取验证码(暂只支持图形验证码)
 *
 * @param {Method} GET
 * @param {String} [query.type] 验证码类型，暂只支持image，后续增加audio
 * @prop {Middleware} noCache
 * @prop {Route} /captchas
 * @example curl -XGET 'http://127.0.0.1:5018/captchas?cache-control=no-cache'
 */
exports.getCaptcha = async function getCaptcha(ctx) {
  Joi.validate(ctx.query, {
    type: Joi.string().default('image').valid(['image']),
  });
  const data = await captchaServce.get();
  debug('get captcha:%j', data);
  ctx.body = data;
};

/**
 * 校验验证码
 *
 * @param {Method} PUT
 * @param {String} header.X-Captcha-Id 验证码id
 * @param {String} header.X-Captcha-Code 验证码
 * @prop {String} captcha
 * @prop {Route} /captchas
 * @example curl -XPOST -d '{}' -H 'X-Captcha-Id:rkxTcmJm_b' -H 'X-Captcha-Code:1234' 'http://127.0.0.1:5018/captchas
 */
exports.validateCaptcha = async function validateCaptcha(ctx) {
  ctx.body = null;
};
