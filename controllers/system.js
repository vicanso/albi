/**
 * 此模块主要是一些公共与业务无关的处理
 * @module controllers/system
 */


const BlueBird = require('bluebird');
const path = require('path');
const moment = require('moment');
const _ = require('lodash');

const fs = BlueBird.promisifyAll(require('fs'));

const configs = localRequire('configs');
const globals = localRequire('helpers/globals');
const setting = localRequire('configs/setting');
const {
  delay,
} = localRequire('helpers/utils');

/**
 * 获取系统当前运行的版本package.json与读取文件package.json的版本号，
 * 正常情况下两者一致，但是如果更新了版本，但是没有重启就会不一致
 * @return {Object} 返回版本号信息 {code: 读取文件的版本号, exec: 内部中加载的版本号}
 */
async function getVersion() {
  const buf = await fs.readFileAsync(path.join(__dirname, '../package.json'));
  const pkg = JSON.parse(buf);
  return {
    code: pkg.version,
    exec: configs.version,
  };
}

/**
 * 设置系统状态为`pause`，此时系统对于`/ping`的响应会返回出错，
 * 主要用于可以让前置的反向代理不再往当前系统转发请求，用于graceful shutdown之类
 * @param {Method} PUT
 * @param {Header} Auth-Token 认证TOEKN
 * @prop {Middleware} auth.admin 验证token是否admin
 * @prop {Route} /api/sys/pause
 * @return {Object} 如果成功，返回null
 */
exports.pause = function pause(ctx) {
  globals.pause();
  console.info('pause application');
  ctx.body = null;
};

/**
 * 重置系统状态为`running`，此时系统对于`/ping`的响应会正常返回
 * @param {Method} PUT
 * @param {Header} Auth-Token 认证TOEKN
 * @prop {Middleware} auth.admin 验证token是否admin
 * @prop {Route} /api/sys/resume
 * @return {Object} 如果成功，返回null
 */
exports.resume = function resume(ctx) {
  globals.start();
  console.info('resume application');
  ctx.body = null;
};

/**
 * 获取当前系统的状态，包括当前连接数，系统状态，版本，运行时长等
 * @param {Method} GET
 * @prop {Middleware} noQuery
 * @prop {Route} /api/sys/status
 * @return {Object} {
 * connectingTotal: Integer,
 * status: String,
 * version: Object,
 * uptime: String,
 * startedAt: ISOString,
 * }
 */
exports.status = async function status(ctx) {
  const version = await getVersion();
  const uptime = moment(Date.now() - (Math.ceil(process.uptime()) * 1000));
  ctx.setCache('10s');
  ctx.body = {
    connectingTotal: globals.getConnectingCount(),
    status: globals.isRunning() ? 'running' : 'pause',
    version,
    uptime: uptime.fromNow(),
    startedAt: uptime.toISOString(),
  };
};

/**
 * 此函数只是退出当前应用，如果有守护进程之类可用于graceful reload`
 * @param {Method} PUT
 * @param {Header} Auth-Token 认证TOEKN
 * @prop {Middleware} auth.admin
 * @prop {Route} /api/sys/exit
 * @return {Object} 如果成功，返回null
 */
exports.exit = function exit(ctx) {
  console.info('application will exit soon');
  globals.pause();
  setTimeout(() => {
    process.exit(0);
  }, 10 * 1000).unref();
  ctx.body = null;
};

/**
 * 设置当前系统的`level`级别，部分路由的处理会设置低于某个`level`时，直接返回出错
 * @param {Method} PUT
 * @param {Header} Auth-Token 认证TOEKN
 * @prop {Middleware} auth.admin
 * @prop {Route} /api/sys/level
 * @return {Object} 如果成功，返回null
 */
exports.setLevel = async function setLevel(ctx) {
  const level = _.get(ctx, 'request.body.level');
  if (level) {
    await setting.set('level', level);
  }
  ctx.body = null;
};

/**
 * 获取当前系统的`level`级别
 * @param {Method} GET
 * @prop {Route} /api/sys/level
 * @return {Object} {level: Integer}
 */
exports.level = function getLevel(ctx) {
  ctx.setCache('10s');
  ctx.body = {
    level: setting.get('level'),
  };
};

/**
 * MOCK 请求，用于测试使用
 * @param {Method} POST
 * @prop {Route} /api/sys/mock
 * @return {Object} {...}
 */
exports.mock = async function mock(ctx) {
  const data = ctx.request.body;
  if (data.delay) {
    await delay(data.delay);
  }
  if (data.status) {
    ctx.status = data.status;
  }
  ctx.body = data.response;
};
