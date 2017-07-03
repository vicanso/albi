/**
 * 此模块主要用于自定义的出错信息，加载本目录的其它文件所定义的错误信息，
 * 生成一个出错的JSON定义数据，用于`helpers/errors`中生成Error
 * @module errors
 * @example
 * const errors = require('./errors');
 * // {"0": {"en": "Token is invalid", "status": 403} ... }
 * console.info(errors);
 */

const requireTree = require('require-tree');
const _ = require('lodash');

module.exports = _.extend(..._.values(requireTree('.')));
