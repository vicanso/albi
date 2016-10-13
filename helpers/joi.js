const Joi = require('joi');

const errors = localRequire('helpers/errors');
// 增加校验数据出错抛出异常的处理
Joi.validateThrow = (...args) => {
  const result = Joi.validate(...args);
  const err = result.error;
  if (err) {
    throw errors.get(err, 400, {
      type: 'validate',
    });
  }
  return result.value;
};
module.exports = Joi;
