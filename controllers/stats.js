/**
 * 此模块主要是处理统计相关的请求
 * @module controllers/stats
 */

const _ = require('lodash');
const stringify = require('simple-stringify');

/**
 * 用于处理前端的相关统计，暂时只输入到日志中，可以考虑是否写入influxdb
 *
 * @param {Method} POST
 * @param {Array} body 提交的统计信息，数据格式是：
 * [{method: String, url: String, use: Integer, processing: Integer,
 * network: Integer, status: Integer, hit: Integer}]
 * @prop {Route} /stats/ajax
 * @example curl -XPOST -d '[{
 *  "method": "GET",
 *  "url": "http://127.0.0.1/users/me?cache-control=no-cache"
 * }]' 'http://127.0.0.1:5018/stats/add'
 * @return {Body} nobody 204
 */
exports.add = function add(ctx) {
  _.forEach(ctx.request.body, (item) => {
    console.info(`browser-ajax ${stringify.json(item)}`);
  });
  /* eslint no-param-reassign:0 */
  ctx.status = 201;
};

/**
 * 用于记录前端收集的出错日志
 *
 * @param {Method} POST
 * @param {Array} body 提交的出错记录，数据格式为[{}]，出错记录格式没有严格要求
 * @prop {Route} /stats/exception
 * @example curl -XPOST -d '[
 *  {
 *    category: "error",
 *    message: "abcd",
 *  }
 * ]' 'http://127.0.0.1:5018/stats/exception'
 * @return {Body} nobody 204
 */
exports.exception = function exception(ctx) {
  _.forEach(ctx.request.body, (item) => {
    console.error(`browser-exception ${stringify.json(item)}`);
  });
  /* eslint no-param-reassign:0 */
  ctx.status = 201;
};

/**
 * 用于记录前端收集的统计数据
 *
 * @param {Method} POST
 * @param {Object} body.screen 前端获取的屏幕相关参数
 * @param {Object} body.timing 前端记录的页面加载js,html等的时间
 * @param {Object} [body.performance] 前端获取到的`window.performance.timing`，不是所有的浏览器都支持
 * @param {Array} [body.entries] 前端获取到的`window.performance.getEntries()`，有该页面加载资源所用的时间
 * @prop {Route} /stats/exception
 * @example curl -XPOST -d '{
 *  "screen": {
 *    "width": 1000,
 *    "height": 600
 *  },
 *  "timing": {
 *    "js": 100
 *  }
 * }' 'http://127.0.0.1:5018/stats/exception'
 * @return {Body} nobody 201
 */
exports.statistics = function statistics(ctx) {
  const data = ctx.request.body;
  console.info(`browser-screen:${stringify.json(data.screen)}`);
  console.info(`browser-timing:${stringify.json(data.timing)}`);
  /* eslint no-param-reassign:0 */
  ctx.status = 201;
};

/**
 * 用于记录前端收集的路由性能统计
 * @param {Method} POST
 * @param {Array} body 路由相关性能统计 [{from: xxx, to: xxx, use: xxx, startedAt: xxx}]
 * @prop {Route} /stats/route
 * @example curl -XPOST -d '{
 *  "from": "/a",
 *  "to": "/b",
 *  "use": 100,
 *  "startedAt": 1502113188542
 * }' 'http://127.0.0.1:5018/stats/route'
 * @return {Body} nobody 201
 */
exports.route = function route(ctx) {
  _.forEach(ctx.request.body, (item) => {
    console.info(`vue route ${stringify.json(item)}`);
  });
  /* eslint no-param-reassign:0 */
  ctx.status = 201;
};
