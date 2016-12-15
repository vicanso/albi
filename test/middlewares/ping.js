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
    app.use(ping('/ping'));
    const server = app.listen();

    request(server)
      .get('/ping')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 200);
        assert.equal(res.text, 'pong');
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
    app.use(ping('/ping'));
    app.use(ctx => ctx.body = null);
    const server = app.listen();

    request(server)
      .get('/')
      .expect(204, done);
  });
});