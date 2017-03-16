'use strict';
require('../../helpers/local-require');
localRequire('helpers/joi');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');

describe('middleware/debug', () => {
  it('should set debug params success', done => {
    const app = new Koa();
    const debug = localRequire('middlewares/debug');
    app.use(debug());

    app.use(ctx => {
      const params = ctx.state.debugParams;
      assert(params.DEBUG);
      assert.equal(JSON.stringify(params.MOCK), '{"a":1}');
      assert.equal(ctx.url, '/');
      ctx.body = 'OK';
    });

    request(app.listen())
      .get('/?_debug=true&_mock={"a":1}')
      .expect(200, done);
  });
});
