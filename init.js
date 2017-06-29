const path = require('path');
const Joi = require('joi');

/**
 * 用于引入项目中的模块，使用相对于项目根目录的相对路径
 *
 * @example
 * const influx = localRequire('helpers/influx');
 * @param  {String} name 该模块在项目中的相对路径
 * @return {Object} 返回该模块的引用
 */
function localRequire(name) {
  const ch = name[0];
  if (!ch || ch === '.' || ch === '/') {
    throw new Error(`the ${name} is invalid`);
  }
  const file = path.join(__dirname, name);
  /* eslint import/no-dynamic-require:0 global-require:0 */
  return require(file);
}

/**
 * 增加校验数据出错抛出异常的处理，参数参考Joi.validate，如果校验出错，使用errors生成自定义出错，code为albi-99999。
 * @param  {Object} value 要做校验的数据
 * @param  {Object} schema 数据的schema定义
 * @param  {Object} [options = null] 校验的配置信息
 * @return {Object} 经过Joi.validate之后的数据（根据options，有可能做了类型转换）
 * @example
 * const Joi = require('joi');
 * // it will throw an error
 * const data = Joi.validateThrow({
 *   key: 'boks',
 * }, {
 *   key: Joi.string().valid('tree.xie'),
 * });
 */
function validateThrow(...args) {
  const result = Joi.validate(...args);
  if (result.error) {
    const err = new Error(result.error);
    err.status = 400;
    err.code = 'albi-99999';
    throw err;
  }
  return result.value;
}

Joi.validateThrow = validateThrow;

global.localRequire = localRequire;

global.Promise = require('bluebird');
