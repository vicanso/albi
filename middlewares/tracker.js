const _ = require('lodash');
const stringify = require('simple-stringify');

const influx = localRequire('helpers/influx');

function logUserTracker(data) {
  console.info(`user tracker ${stringify.json(data)}`);
  const tags = 'category result'.split(' ');
  influx.write('userTracker', _.omit(data, tags), _.pick(data, tags));
}

module.exports = (category, params) => (ctx, next) => {
  const data = {
    category,
    token: ctx.get('X-User-Token'),
    ip: ctx.ip,
  };
  _.forEach(params, (param) => {
    _.forEach(['request.body', 'params', 'query'], (key) => {
      const v = _.get(ctx, `${key}.${param}`);
      if (_.isNil(data[param]) && !_.isNil(v)) {
        data[param] = v;
      }
    });
  });
  const start = Date.now();
  const delayLog = (use, result) => {
    data.result = result;
    data.use = use;
    logUserTracker(data);
  };
  return next().then(() => {
    setImmediate(delayLog, Date.now() - start, 'success');
  }, (err) => {
    setImmediate(delayLog, Date.now() - start, 'fail');
    throw err;
  });
};
