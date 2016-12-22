'use strict';
const Joi = require('joi');
require('../helpers/local-require');

describe('config', () => {
  it('check config data', done => {
    const config = localRequire('config');
    const data = Joi.validate(config, {
      version: Joi.string().required(),
      env: Joi.string().required(),
      name: Joi.string().required(),
      port: Joi.number().integer().required(),
      app: Joi.string().required(),
      influx: Joi.string(),
      appUrlPrefix: Joi.string().required(),
      viewPath: Joi.string().required(),
      trackCookie: Joi.string().required(),
      httpLogFormat: Joi.string().required(),
      jspmPath: Joi.string().required(),
      staticOptions: Joi.object().keys({
        urlPrefix: Joi.string().required(),
        path: Joi.string().required(),
        maxAge: Joi.number().integer().required(),
        headers: Joi.object(),
        host: Joi.string().optional(),
      }).required(),
      connectLimitOptions: Joi.object().keys({
        mid: Joi.number().integer().required(),
        high: Joi.number().integer().required(),
        interval: Joi.number().integer().required(),
      }).required(),
      adminToken: Joi.string().required(),
      etcd: Joi.string(),
      IP: Joi.string().ip(),
      session: Joi.object().keys({
        key: Joi.string().required(),
        ttl: Joi.number().integer().required(),
        maxAge: Joi.number().integer().required(),
      }),
      mongoUri: Joi.string(),
      redisUri: Joi.string(),
    });
    done(data.error);
  });
});
