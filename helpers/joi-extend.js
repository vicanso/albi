/**
 * 对Joi模块做扩展，增加判断函数
 */

const Joi = require('joi');
const _ = require('lodash');
const math = require('mathjs');

const configs = require('../configs');


// 扩展增强支持bignumber
const customJoi = Joi.extend(joi => ({
  base: joi.any(),
  name: 'bignumber',
  pre(value, state, options) {
    let v = value;
    if (_.isString(v)) {
      v = v.trim();
    }
    if (options.convert) {
      return math.bignumber(v);
    }
    return v;
  },
}));


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
Joi.originalValidate = Joi.validate;

function validateError(error) {
  const err = new Error(error);
  err.status = 400;
  err.code = `${configs.app}-99999`;
  return err;
}
function validateThrow(...args) {
  const result = Joi.originalValidate(...args);
  if (result.error) {
    throw validateError(result.error);
  }
  return result.value;
}
function attemptThrow(value, schema) {
  const result = validateThrow({
    value,
  }, {
    value: schema,
  });
  return result.value;
}

function objectId() {
  return Joi.string().regex(/^[a-z0-9]{24}$/);
}

Joi.validate = validateThrow;
Joi.attempt = attemptThrow;
Joi.objectId = objectId;
Joi.bignumber = () => customJoi.bignumber();
