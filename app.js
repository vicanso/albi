
const mongoose = require('mongoose');

require('./init');

const configs = require('./configs');
const createServer = require('./helpers/server');
const globals = require('./helpers/globals');
const influx = require('./helpers/influx');
const performance = require('./schedules/performance');
const mongo = require('./helpers/mongo');
const redis = require('./helpers/redis');
const httpPref = require('./helpers/http-pref');

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

function waitForReady() {
  let count = 0;
  const ready = () => {
    count += 1;
    if (count === 2) {
      globals.start();
    }
  };
  mongo.client.once('connected', ready);
  redis.client.once('connect', ready);
}

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
httpPref.start();
waitForReady();
