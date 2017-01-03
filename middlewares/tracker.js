const _ = require('lodash');
const stringify = require('simple-stringify');

const influx = localRequire('helpers/influx');

function logUserTracker(data) {
  console.info(`user tracker ${stringify.json(data)}`);
  const tags = 'category result'.split(' ');
  console.dir(_.omit(data, tags));
  influx.write('userTracker', _.omit(data, tags), _.pick(data, tags));
}

module.exports = (category, params) => (ctx, next) => {
  const data = {
    category,
    token: ctx.get('X-User-Token') || 'unknown',
    ip: ctx.ip,
  };
  _.forEach(params, (param) => {
    const v = ctx.request.body[param] || ctx.params[param] || ctx.query[param];
    if (!_.isUndefined(v)) {
      data[param] = v;
    }
  });
  const start = Date.now();
  return next().then(() => {
    data.result = 'success';
    data.use = Date.now() - start;
    logUserTracker(data);
  }, (err) => {
    data.result = 'fail';
    data.use = Date.now() - start;
    logUserTracker(data);
    throw err;
  });
};
