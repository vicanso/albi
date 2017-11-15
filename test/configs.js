const Joi = require('joi');

require('../init');
const configs = require('../configs');

describe('configs', () => {
  it('check configs data', (done) => {
    const result = Joi.validate(configs, {
      env: Joi.string(),
      version: Joi.string(),
      app: Joi.string(),
      server: Joi.string(),
      viewPath: Joi.string(),
      httpLogFormat: Joi.string(),
      influx: Joi.string().optional(),
      logger: Joi.string().optional(),
      mongoUri: Joi.string(),
      redisUri: Joi.string(),
      port: Joi.number().integer(),
      session: Joi.object().keys({
        key: Joi.string(),
        maxAge: Joi.number().integer(),
      }),
      connectLimitOptions: Joi.object().keys({
        mid: Joi.number().integer(),
        high: Joi.number().integer(),
        interval: Joi.number().integer(),
      }),
      staticOptions: {
        urlPrefix: Joi.string(),
        path: Joi.string(),
        maxAge: Joi.number().integer(),
        headers: Joi.object(),
        host: Joi.string().empty(''),
      },
      trackCookie: Joi.string(),
      appUrlPrefix: Joi.string(),
      email: Joi.string(),
    }, {
      convert: false,
    });
    done(result.error);
  });
});
