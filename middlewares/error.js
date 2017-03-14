const url = require('url');
const _ = require('lodash');
const stringify = require('simple-stringify');

const config = localRequire('config');
const influx = localRequire('helpers/influx');

module.exports = (ctx, next) => next().catch((err) => {
  const urlInfo = url.parse(ctx.url);
  const token = ctx.get('X-User-Token') || 'unknown';
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  const error = _.isError(err) ? err : new Error(err);
  const message = error.message;
  const code = error.code || -1;
  const data = {
    url: ctx.url,
    code,
    token,
    message,
    expected: false,
  };
  _.forEach(error, (v, k) => {
    data[k] = v;
  });
  /* istanbul ignore else */
  if (config.env !== 'production') {
    data.stack = error.stack;
  }
  const logList = [];
  if (data.expected) {
    logList.push('[H-E]');
  } else {
    logList.push('[H-U]');
  }
  influx.write('excetion', {
    code,
    path: urlInfo.pathname,
    message,
  }, {
    type: data.expected ? 'E' : 'U',
  });

  logList.push(stringify.json(data));

  console.error(logList.join(' '));

  /* eslint no-param-reassign:0 */
  ctx.status = error.status || err.statusCode || 500;
  /* eslint no-param-reassign:0 */
  ctx.body = data;
});
