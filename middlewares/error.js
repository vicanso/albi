/**
 * 此模块主要做出错的响应处理
 * @module middlewares/error
 */
const _ = require('lodash');
const stringify = require('simple-stringify');
const url = require('url');

const configs = require('../configs');
const influx = require('../helpers/influx');
const {
  initAlsSetting,
} = require('../helpers/utils');

/**
 * HTTP请求出错中间件处理，根据出错的Error对象，记录出错的url,code,userToken,
 * 出错信息以及是否主动抛出的异常，将相关数据输出到日志并记录到influxdb中。
 * 最后根据Error生成相应的数据返回给前端
 * @return {Function} 返回中间件处理函数
 */
module.exports = () => (ctx, next) => next().catch((err) => {
  initAlsSetting(ctx);
  const urlInfo = url.parse(ctx.url);
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  const error = _.isError(err) ? err : new Error(err);
  if (!err.code) {
    error.code = 'unknown';
  }
  if (!_.isString(err.code)) {
    err.code = err.code.toString();
  }
  const {
    code,
    message,
   } = error;
  const data = {
    url: ctx.url,
    code,
    message,
    expected: false,
  };
  _.forEach(error, (v, k) => {
    if (!_.isObject(v)) {
      data[k] = v;
    }
  });
  /* istanbul ignore else */
  if (configs.env !== 'production') {
    data.stack = error.stack.replace(/\n/g, '');
  }
  const logList = [];
  if (data.expected) {
    logList.push('[H-E]');
  } else {
    logList.push('[H-U]');
  }
  // expected 主动抛出的异常如果需要记录到influxdb，则删除此判断
  if (!data.expected) {
    influx.write('exception', {
      code,
      path: urlInfo.pathname,
      message,
    }, {
      type: data.expected ? 'E' : 'U',
    });
  }

  logList.push(stringify.json(data));

  console.error(logList.join(' '));

  const status = parseInt(error.status || err.statusCode, 10);
  /* eslint no-param-reassign:0 */
  if (_.isNaN(status)) {
    ctx.status = 500;
  } else {
    ctx.status = status;
  }
  /* eslint no-param-reassign:0 */
  ctx.body = data;
});
