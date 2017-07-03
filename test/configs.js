const Joi = require('joi');

require('../init');

describe('configs', () => {
  it('check configs data', (done) => {
    const configs = localRequire('configs');
    const result = Joi.validate(configs, {
      env: Joi.string(),
      version: Joi.string(),
      app: Joi.string(),
      viewPath: Joi.string(),
      httpLogFormat: Joi.string(),
      influx: Joi.string().optional(),
      logger: Joi.string().optional(),
      mongodbUri: Joi.string(),
      redisUri: Joi.string(),
    }, {
      convert: false,
    });
    done(result.error);
  });
});
