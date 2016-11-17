const url = require('url');
const _ = require('lodash');
const stringify = require('simple-stringify');

const config = localRequire('config');
const influx = localRequire('helpers/influx');

module.exports = (ctx, next) => next().then(_.noop, (err) => {
  const urlInfo = url.parse(ctx.url);
  const token = ctx.get('X-User-Token') || 'unknown';
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  const code = err.code || -1;
  const data = {
    url: ctx.url,
    code,
    token,
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
    code,
    path: urlInfo.pathname,
  }, {
    type: data.expected ? 'E' : 'U',
  });

  logList.push(stringify.json(data));

  console.error(logList.join(' '));

  /* eslint no-param-reassign:0 */
  ctx.status = err.status || 500;
  /* eslint no-param-reassign:0 */
  ctx.body = data;
});
