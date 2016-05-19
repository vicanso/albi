'use strict';
const _ = require('lodash');
const config = localRequire('config');
const influx = localRequire('helpers/influx');
const url = require('url');

module.exports = (ctx, next) => next().then(_.noop, err => {
  const urlInfo = url.parse(ctx.url);
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  const data = {
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
    code: err.code,
    path: urlInfo.pathname,
  }, {
    type: err.expected ? 'E' : 'U',
  });

  _.forEach(data, (v, k) => {
    logList.push(`${k}=${v}`);
  });

  console.error(logList.join(' '));

  /* eslint no-param-reassign:0 */
  ctx.status = err.status || 500;
  /* eslint no-param-reassign:0 */
  ctx.body = data;
});
