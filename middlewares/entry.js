/**
 * 此模块主要用于请求入口参数初始化
 * @module middlewares/entry
 */

const _ = require('lodash');
const Timing = require('supertiming');
const ms = require('ms');

const globals = localRequire('helpers/globals');
const utils = localRequire('helpers/utils');
const als = require('async-local-storage');

/**
 * HTTP请求入口的中间件处理，包括：
 * 1. 对所有url做去前缀处理（nginx之类的反向代理基本url前缀做转发，未对url做处理）
 * 2. 设置响应头的`Via`字段（从当前请求头中取`Via`再添加应用名字）
 * 3. 全局设置响应头`Cache-Control:no-cache, max-age=0`，避免请求未设置缓存属性，可以覆盖
 * 4. connectingTotal + 1 ，在请求处理完时， connectingTotal - 1
 * 5. 添加Timing对象至`ctx.state.timing`字段
 * 6. 在请求处理完成时，根据Timing的记录生成`Server-Timing`
 * @param  {String} processName 应用名字
 * @param  {String} [appUrlPrefix = ''] 应用的前缀URL，如果设置该参数，所有请求都做删除请前缀部分
 * @return {Function} 返回中间件处理函数
 */
module.exports = (processName, appUrlPrefix) => (ctx, next) => {
  const currentPath = ctx.path;
  const timing = new Timing({
    precision: 'ns',
  });
  const id = ctx.get('X-Request-Id') || utils.randomToken(8);
  als.set('timing', timing);
  als.set('id', id);
  if (appUrlPrefix && currentPath.indexOf(appUrlPrefix) === 0) {
    /* eslint no-param-reassign:0 */
    ctx.orginalPath = currentPath;
    /* eslint no-param-reassign:0 */
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
  const processList = (ctx.get('Via') || '').split(',');
  processList.push(processName);
  ctx.set('Via', _.compact(processList).join(','));
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  globals.set('connectingTotal', globals.get('connectingTotal') + 1);
  ctx.state.timing = timing;
  timing.start(processName);
  const complete = () => {
    globals.set('connectingTotal', globals.get('connectingTotal') - 1);
    timing.end();
    ctx.set('X-Response-Id', id);
    ctx.set('Server-Timing', timing.toServerTiming(true));
  };
  return next().then(complete, (err) => {
    complete();
    throw err;
  });
};
