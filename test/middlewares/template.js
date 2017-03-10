'use strict';
require('../../helpers/local-require');
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
const Timing = require('supertiming');

describe('middleware/template', () => {
  it('should compile a template successful', done => {
    const app = new Koa();
    const views = localRequire('views');
    const state = localRequire('middlewares/state');
    app.use((ctx, next) => {
      ctx.state.timing = new Timing();
      return next();
    })
    app.use(state({}));
    app.use(views.home);

    request(app.listen())
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 200);
        assert.equal(res.get('Content-Type'), 'text/html; charset=utf-8');
        done();
      });
  });
});
