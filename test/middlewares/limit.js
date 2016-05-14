'use strict';
require('../../helpers/local-require');
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');

describe('middleware/limit', () => {
  it('should set limit middleware success', done => {
    const app = new Koa();
    const server = app.listen();
    const limit = localRequire('middlewares/limit');
    const globals = localRequire('helpers/globals');
    const info = console.info;
    console.info = function() {};
    app.use(limit({
      mid: 1,
      high: 2
    }, 30));

    app.use(ctx => {
      if (ctx.url === '/wait') {
        return new Promise(function(resolve) {
          setTimeout(function() {
            ctx.body = 'OK';
            resolve();
          }, 200);
        });
      } else {
        ctx.body = 'OK';
      }
    });


    request(server)
      .get('/wait')
      .end(function(err, res) {
        assert.equal(res.status, 200);
      });

    request(server)
      .get('/wait')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        request(server)
          .get('/wait')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(globals.get('performance.concurrency'), 'low');
            assert.equal(globals.get('status'), 'running');
            console.info = info;
            done();
          });
      });
    request(server)
      .get('/wait')
      .end(function(err, res) {
        assert.equal(globals.get('performance.concurrency'), 'high');
        assert.equal(globals.get('status'), 'pause');
        assert.equal(res.status, 429);
      });
  });
});