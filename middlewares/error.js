const url = require('url');
const _ = require('lodash');

const config = localRequire('config');
const influx = localRequire('helpers/influx');

module.exports = (ctx, next) => next().then(_.noop, (err) => {
  const urlInfo = url.parse(ctx.url);
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  const data = {
    url: ctx.url,
    code: err.code || 0,
    message: err.message,
    expected: false,
  };
  _.forEach(err, (v, k) => {
    data[k] = v;
  });
  /* istanbul ignore else */
  if (config.env !== 'production') {
    data.stack = err.stack;
  }
  const logList = [];
  if (data.expected) {
    logList.push('[H-E]');
  } else {
    logList.push('[H-U]');
  }
  influx.write('excetion', {
    code: data.code,
    path: urlInfo.pathname,
  }, {
    type: data.expected ? 'E' : 'U',
  });
  _.forEach(data, (v, k) => {
    if (_.isObject(v)) {
      return;
    }
    logList.push(`${k}=${v}`);
  });

  console.error(logList.join(' '));

  /* eslint no-param-reassign:0 */
  ctx.status = err.status || 500;
  /* eslint no-param-reassign:0 */
  ctx.body = data;
});
