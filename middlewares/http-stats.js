const _ = require('lodash');
const httpStats = require('koa-http-stats');

const globals = localRequire('helpers/globals');
const influx = localRequire('helpers/influx');

module.exports = options => httpStats(options, (p, statsData, ctx) => {
  const tagKeys = 'status spdy size busy'.split(' ');
  const performance = p;
  if (!performance.createdAt) {
    performance.createdAt = (new Date()).toISOString();
  }
  globals.set('performance.http', performance);
  const fields = _.omit(statsData, tagKeys);
  fields.ip = ctx.ip;
  const requestedAt = parseInt(ctx.get('X-Requested-At') || 0, 10);
  if (requestedAt) {
    fields.request = Date.now() - requestedAt - statsData.use;
  }
  influx.write('http', fields, _.pick(statsData, tagKeys));
});
