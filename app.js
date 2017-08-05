const httpPerf = require('http-performance');
const mongoose = require('mongoose');
const _ = require('lodash');

require('./init');

const configs = require('./configs');
const createServer = require('./helpers/server');
const globals = require('./helpers/globals');
const influx = require('./helpers/influx');
const performance = require('./schedules/performance');

require('./tasks');

function gracefulExit() {
  console.info('the application will be restart');
  globals.pause();
  setTimeout(() => {
    if (influx.client) {
      influx.client.syncWrite();
    }
    mongoose.disconnect();
  }, 3000).unref();
  setTimeout(() => {
    process.exit(0);
  }, 10 * 1000).unref();
}

httpPerf.disable('response');
httpPerf.on('stats', (stats) => {
  const tags = _.pick(stats, [
    'category',
    'type',
    'method',
    'host',
  ]);
  const fields = _.extend(_.pick(stats, [
    'requesting',
    'url',
    'status',
    'bytes',
  ]), stats.timing);
  if (stats.dns) {
    fields.ip = stats.dns.ip;
  }
  tags.spdy = _.sortedIndex([100, 300, 1000, 3000], fields.all);
  influx.write('http', fields, tags);
});

process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection:${err.message}, stack:${err.stack}`);
  gracefulExit();
});
process.on('uncaughtException', (err) => {
  console.error(`uncaughtException:${err.message}, stack:${err.stack}`);
  gracefulExit();
});

if (configs.env !== 'development') {
  process.on('SIGTERM', gracefulExit);
  process.on('SIGQUIT', gracefulExit);
}

createServer(configs.port);
performance(2000);
