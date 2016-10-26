const Joi = require('joi');
const _ = require('lodash');

module.exports = () => {
  const renameList = {
    DEBUG: '_debug',
    MOCK: '_mock',
    STATUS: '_status',
  };
  let schema = Joi.object().keys({
    DEBUG: Joi.boolean(),
    MOCK: Joi.object(),
    STATUS: Joi.number().integer(),
  });

  _.forEach(renameList, (v, k) => {
    schema = schema.rename(v, k);
  });

  return (ctx, next) => {
    const query = ctx.query;
    const result = Joi.validateThrow(query, schema, {
      stripUnknown: true,
    });
    if (result.MOCK) {
      if (result.STATUS) {
        ctx.status = result.STATUS;
      }
      ctx.body = result.MOCK;
      return null;
    }
    if (!_.isEmpty(result)) {
      _.forEach(result, (v, k) => {
        delete query[renameList[k]];
      });
      /* eslint no-param-reassign:0 */
      ctx.debugParams = result;
      /* eslint no-param-reassign:0 */
      ctx.query = query;
    }
    return next();
  };
};
