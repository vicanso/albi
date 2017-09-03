/**
 * 获取captcha相关信息与校验
 */
const shortid = require('shortid');
const Balancer = require('superagent-load-balancer');

const request = require('../helpers/request');
const cacheService = require('./cache');
const settingService = require('./setting');

let balancerPlugin = null;

/**
 * 获取captcha的balancer
 *
 */
async function initBalancerPlugin() {
  const servers = await settingService.getCaptchaServers();
  const balancer = new Balancer(servers);
  const ping = (backend) => {
    const url = `http://${backend.host}/ping`;
    return request.get(url).timeout(300);
  };
  balancer.startHealthCheck({
    ping,
  });
  balancerPlugin = balancer.plugin();
  return balancerPlugin;
}

setImmediate(() => {
  initBalancerPlugin().catch((err) => {
    console.error(`init captcha server balancer fail, ${err.message}`);
  });
});

/**
 * 获取captcha
 *
 * @returns {Object} {
 *  id: "ryXpjpGOW",
 *  data: "base64 string"
 * }
 */
exports.get = async function get() {
  if (!balancerPlugin) {
    return null;
  }
  const {
    body,
  } = await request.get('/captchas')
    .use(balancerPlugin);
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
