'use strict';
require('../../helpers/local-require');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');

describe('middleware/ping', () => {
  it('request /ping success', done => {
    const ping = localRequire('middlewares/ping');
    const globals = localRequire('helpers/globals');
    const app = new Koa();
    const server = app.listen();
    app.use(ping('/ping'));

    request(server)
      .get('/ping')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 204);
        assert.equal(res.text, '');
        globals.set('status', 'pause');
        request(server)
          .get('/ping')
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 500);
            globals.set('status', 'running');
            done();
          });
      });
  });

  it('it url not equal, call next success', done => {
    const ping = localRequire('middlewares/ping');
    const globals = localRequire('helpers/globals');
    const app = new Koa();
    const server = app.listen();
    app.use(ping('/ping'));
    app.use(ctx => ctx.body = null);

    request(server)
      .get('/')
      .expect(204, done);
  });
});