'use strict';
require('../../helpers/local-require');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');

describe('middleware/http-stats', () => {
  it('should set stats middleware success', done => {
    const app = new Koa();
    const stats = localRequire('middlewares/http-stats');
    const globals = localRequire('helpers/globals');

    app.use(stats());

    app.use(ctx => {
      if (ctx.url === '/wait') {
        return new Promise(resolve => {
          setTimeout(() => {
            ctx.body = 'OK';
            resolve();
          }, 200);
        });
      } else {
        ctx.body = 'OK';
      }
    });
    const server = app.listen();

    request(server)
      .get('/wait')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 200);
        const performance = globals.get('performance.http');
        assert.equal(performance.total, 2);
        assert.equal(performance.connecting, 0);
        done();
      });

    request(server)
      .get('/')
      .set('X-Requested-At', Date.now())
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 200);
          const performance = globals.get('performance.http');
          assert.equal(performance.total, 2);
          assert.equal(performance.connecting, 1);
        }
      });
  });
});