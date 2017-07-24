const als = require('async-local-storage');
const Joi = require('joi');
const Logger = require('timtam-logger');
const stringify = require('simple-stringify');

const configs = require('./configs');

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

global.Promise = require('bluebird');

// set stringify mask
stringify.isSecret = (key) => {
  const reg = /password/gi;
  return reg.test(key);
};

als.enable();


if (configs.logger) {
  const logger = new Logger({
    app: configs.app,
  });
  logger.before(configs.name);
  logger.before(() => als.get('account'));
  logger.before(() => als.get('id'));
  logger.wrap(console);
  logger.add(configs.logger);
}
