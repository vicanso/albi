'use strict';
const config = require('../config');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const globals = require('../globals');
const v8 = require('v8');
const bytes = require('bytes');
const moment = require('moment');
const toobusy = require('toobusy-js');
const util = require('util');
const spawn = require('child_process').spawn;

exports.version = version;
exports.stats = stats;
exports.restart = restart;

/**
 * [version 返回代码版本与执行版本]
 * @return {[type]} [description]
 */
function *version() {
  /*jshint validthis:true */
  let ctx = this;
  let data = yield getVersion();
  ctx.set({
    'Cache-Control' : 'public, max-age=60'
  });
  ctx.body = data;
}

/**
 * [getVersion 获取代码版本与运行版本]
 * @return {[type]} [description]
 */
function *getVersion() {
  let pm2Json = yield new Promise(function(resolve, reject) {
    fs.readFile(path.join(__dirname, '../pm2.json'), function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  pm2Json = JSON.parse(pm2Json);
  return {
    code : _.get(pm2Json, 'env.APP_VERSION'),
    exec : config.version
  };
}

/**
 * [restart 重启pm2]
 * @return {[type]} [description]
 */
function *restart() {
  /*jshint validthis:true */
  let ctx = this;
  setTimeout(function () {
    let pm2 = spawn('pm2', ['gracefulReload', config.app]);
    pm2.on('close', function(code) {
      if (code === 0) {
        console.info('gracefulReload ' + config.app + ' successful');
      } else {
        console.error('gracefulReload ' + config.app + ' fail');
      }
    });
  }, 1000);
  yield Promise.resolve();
  ctx.body = util.format('%s will restart soon.', config.app);
}

/**
 * [stats 返回系统相关信息]
 * @return {[type]} [description]
 */
function *stats() {
  /*jshint validthis:true */
  let ctx = this;
  let version = yield getVersion();
  ctx.set({
    'Cache-Control' : 'public, max-age=5'
  });

  let heap = v8.getHeapStatistics();
  _.forEach(heap, function(v, k) {
    heap[k] = bytes(v);
  });

  function formatTime(seconds) {
    let str = '';
    let day = 24 * 3600;
    let hour = 3600;
    let minute = 60;
    // day hour minute seconds
    let arr = [0, 0, 0, 0];
    if (seconds > day) {
      arr[0] = Math.floor(seconds / day);
      seconds %= day;
    }
    if (seconds > hour) {
      arr[1] = Math.floor(seconds / hour);
      seconds %= hour;
    }
    if (seconds > minute) {
      arr[2] = Math.floor(seconds / minute);
      seconds %= minute;
    }
    arr[3] = seconds;
    return arr[0] + 'd' + arr[1] + 'h' + arr[2] + 'm' + arr[3] + 's';
  }

  let uptime = Math.ceil(process.uptime());
  ctx.body = {
    version : version,
    heap : heap,
    uptime : formatTime(uptime),
    startedAt : moment(Date.now() - uptime * 1000).format(),
    lag : toobusy.lag()
  };
}
