const Joi = require('joi');

const errors = localRequire('helpers/errors');
// 增加校验数据出错抛出异常的处理，数据校验出错的code定义为-1
Joi.validateThrow = (...args) => {
  const result = Joi.validate(...args);
  const err = result.error;
  if (err) {
    throw errors.get(err, 400, {
      code: -1,
    });
  }
  return result.value;
};
module.exports = Joi;
