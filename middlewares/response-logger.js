/**
 * 用于对返回数据输出至日志中
 * 此中间件能方便查询接口的响应数据，但也会有可能输出了客户的敏感数据，需要慎用
 */

const _ = require('lodash');
const stringify = require('simple-stringify');

module.exports = (level = 3) => async (ctx, next) => {
  await next();
  if (!ctx.state.ignoreResponseLogger && ctx.body && _.isObject(ctx.body)) {
    console.info(`response: ${stringify.json(ctx.body, level)}`);
  }
};
