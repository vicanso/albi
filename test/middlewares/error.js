'use strict';
require('../../helpers/local-require');
localRequire('helpers/joi');
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
const Joi = require('joi');

describe('middleware/error', () => {
  it('should response expected error success', done => {
    const app = new Koa();
    const error = localRequire('middlewares/error');
    const errors = localRequire('helpers/errors');
    app.use(error);

    app.use(ctx => {
      throw errors.get('error-message', 505);
    });

    request(app.listen())
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 505);
        const data = res.body;
        assert(data.expected);
        Joi.validateThrow(data, {
          code: Joi.number().required(),
          error: Joi.string().required(),
          stack: Joi.string().required(),
          expected: Joi.boolean().required()
        }, {
          allowUnknown: true
        });
        done();
      });
  });


  it('should response unexpected error success', done => {
    const app = new Koa();
    const error = localRequire('middlewares/error');
    app.use(error);

    app.use(ctx => {
      i.j = 0;
    });

    request(app.listen())
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 500);
        const data = res.body;
        assert(!data.expected);
        Joi.validateThrow(data, {
          code: Joi.number().required(),
          error: Joi.string().required(),
          expected: Joi.boolean().required()
        }, {
          allowUnknown: true
        });
        done();
      });
  });
});
