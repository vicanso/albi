/**
 * 此模块主要实现ping功能，用于反向代理检测应用是否可用
 * @module middlewares/ping
 */

const errors = require('../helpers/errors');
const globals = require('../helpers/globals');

/**
 * 根据应用状态对设置的ping请求做出响应，如果应用不是处于`running`状态，
 * 则对ping请求返回出错，可以达到让反向代理不再转发新的请求过来，但又不影响现有处理的目的
 * @param  {String} url ping的url，一般使用/ping
 * @return {Function} 返回中间件处理函数
 */
module.exports = url => (ctx, next) => {
  if (ctx.url !== url) {
    return next();
  }
  if (!globals.isRunning()) {
    throw errors.get('common.serverNotRunning');
  }
  // eslint-disable-next-line
  ctx.body = 'pong';
  return Promise.resolve();
};
