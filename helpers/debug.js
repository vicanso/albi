/** @module helpers/debug */

const debug = require('debug');

const configs = require('../configs');

/**
 * 生成`debug`函数，设置debug标记为`package.json`中的name
 * @example
 * const debug = require('./helpers/debug');
 * debug('get my log');
 */
module.exports = debug(configs.app);
