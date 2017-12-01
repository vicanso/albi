const mongoose = require('mongoose');
const dnsCache = require('dnscache');

require('./init');

const configs = require('./configs');
const createServer = require('./helpers/server');
const globals = require('./helpers/globals');
const influx = require('./helpers/influx');
const performance = require('./schedules/performance');
const mongo = require('./helpers/mongo');
const redis = require('./helpers/redis');
const httpPref = require('./helpers/http-pref');
const settingService = require('./services/setting');
const dnsHelper = require('./helpers/dns');

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

function mongodbReady() {
  return new Promise((resolve) => {
    mongo.client.once('connected', resolve);
  });
}

function redisReady() {
  return new Promise((resolve) => {
    redis.client.once('connect', resolve);
  });
}

// 生产环境可以根据需要决定是否放开
process.on('unhandledRejection', (err) => {
  // 如果有未捕获异常，退出APP（由守护进程重新启动）
  console.error(`unhandledRejection:${err.message}, stack:${err.stack}`);
  gracefulExit();
});
process.on('uncaughtException', (err) => {
  // 如果有未捕获异常，退出APP（由守护进程重新启动）
  console.error(`uncaughtException:${err.message}, stack:${err.stack}`);
  gracefulExit();
});

if (configs.env !== 'development') {
  process.on('SIGTERM', gracefulExit);
  process.on('SIGQUIT', gracefulExit);
}

// 设置DNS解析的缓存，减少DNS查询
dnsCache({
  enable: true,
  ttl: 300,
});
createServer(configs.port);
performance(2000);
httpPref.start();

Promise.all([
  mongodbReady(),
  redisReady(),
  settingService.updateSettings(),
]).then(() => {
  dnsHelper.start();
  globals.start();
  console.info('the server is running now');
}).catch((err) => {
  console.error(`the application isn't ready, ${err.message}`);
});
