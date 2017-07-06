/**
 * 此模块提供一些公共常用的函数
 * @module helpers/utils
 */

const request = require('superagent');

const configs = localRequire('configs');

/**
 * 从参数列表中获取第一个符合条件的参数返回，如果都不符合，则使用默认值返回
 * @param  {Array} arr 参数列表
 * @param  {Function} validate 校验函数，如果符合则返回true
 * @param  {Any} defaultValue 默认值
 * @return {Any} 返回符合条件的值或者默认值
 * @example
 * const utils = require('./helpers/utils');
 * // max: 100
 * const max = utils.getParam(['name', true, 100], _.isInteger, 10);
 */
function getParam(arr, validate, defaultValue) {
  const v = arr.find(validate);
  if (v === undefined) {
    return defaultValue;
  }
  return v;
}

/**
 * 请求当前应用
 * @param {String} method http request method
 * @param {String} url http request url
 */
function selfRequest(method, url) {
  const requestUrl = `http://127.0.0.1:${configs.port}${url}`;
  return request[method](requestUrl);
}


/**
 * 延时执行(Promise)
 * @param {Integer} ms 延时的ms
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getParam = getParam;
exports.selfRequest = selfRequest;
exports.delay = delay;
