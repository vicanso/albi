/**
 * 此模块主要用于请求入口参数初始化
 * @module middlewares/entry
 */

const _ = require('lodash');
const ms = require('ms');

const globals = require('../helpers/globals');
const {
  initAlsSetting,
} = require('../helpers/utils');

/**
 * HTTP请求入口的中间件处理，包括：
 * 1. 对所有url做去前缀处理（nginx之类的反向代理基本url前缀做转发，未对url做处理）
 * 2. 设置响应头的`Via`字段（从当前请求头中取`Via`再添加应用名字）
 * 3. 全局设置响应头`Cache-Control:no-cache, max-age=0`，避免请求未设置缓存属性，可以覆盖
 * 4. connectingTotal + 1 ，在请求处理完时， connectingTotal - 1
 * 5. 在请求处理完成时，根据Timing的记录生成`Server-Timing`
 * @param  {String} appInfo 应用信息
 * @param  {String} [appUrlPrefix = ''] 应用的前缀URL，如果设置该参数，所有请求都做删除请前缀部分
 * @return {Function} 返回中间件处理函数
 */
module.exports = (appInfo, appUrlPrefix) => async (ctx, next) => {
  initAlsSetting(ctx);
  const timing = ctx.state.timing;
  const currentPath = ctx.path;
  if (appUrlPrefix && currentPath.indexOf(appUrlPrefix) === 0) {
    // eslint-disable-next-line
    ctx.path = currentPath.substring(appUrlPrefix.length) || '/';
  }
  ctx.setCache = (ttl, sMaxAge) => {
    let seconds = ttl;
    if (_.isString(seconds)) {
      seconds = _.ceil(ms(ttl) / 1000);
    }
    let cacheControl = `public, max-age=${seconds}`;
    if (sMaxAge) {
      let sMaxAgeSeconds = sMaxAge;
      if (_.isString(sMaxAgeSeconds)) {
        sMaxAgeSeconds = _.ceil(ms(sMaxAgeSeconds) / 1000);
      }
      cacheControl += `, s-maxage=${sMaxAgeSeconds}`;
    }
    ctx.set('Cache-Control', cacheControl);
  };
  let via = ctx.get('Via');
  if (!via) {
    via = appInfo;
  } else {
    via = `${via}, ${appInfo}`;
  }
  ctx.set('Via', via);
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  globals.setConnectingCount(globals.getConnectingCount() + 1);
  timing.start(appInfo.split(' ').pop());
  try {
    await next();
  } catch (err) {
    throw err;
  } finally {
    globals.setConnectingCount(globals.getConnectingCount() - 1);
    timing.end();
    ctx.set('Server-Timing', timing.toServerTiming(true));
  }
};
