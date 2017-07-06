/**
 * 用于跟踪用户行为的中间件，主要用于一些会修改数据的操作
 * @module middlewares/tracker
 */
const _ = require('lodash');
const stringify = require('simple-stringify');

const influx = localRequire('helpers/influx');

/**
 * 记录用户的行为日志到influxdb中
 * @param  {Object} data 用户行为日志数据
 */
function logUserTracker(data) {
  console.info(`user tracker ${stringify.json(data)}`);
  const tags = 'category result'.split(' ');
  influx.write('userTracker', _.omit(data, tags), _.pick(data, tags));
}

/**
 * 生成行为日志中间件，根据设置的参数列表获取用户提交的参数，
 * 以后最后的结果，记录到influxdb中
 * @param  {String} category 该用户行为分类，如：用户注册、用户收藏
 * @return {Function} 返回中间件处理函数
 */
module.exports = category => function userTracker(ctx, next) {
  const data = {
    category,
    ip: ctx.ip,
  };
  const account = _.get(ctx, 'session.user.account');
  if (account) {
    data.account = account;
  }
  const params = _.extend({}, ctx.query, ctx.request.body, ctx.params);
  if (!_.isEmpty(params)) {
    data.params = stringify.json(params);
  }
  const start = Date.now();
  const delayLog = (use, result) => {
    data.result = result;
    data.use = use;
    logUserTracker(data);
  };
  return next().then(() => {
    setImmediate(delayLog, Date.now() - start, 'success');
  }, (err) => {
    data.message = err.message;
    setImmediate(delayLog, Date.now() - start, 'fail');
    throw err;
  });
};
