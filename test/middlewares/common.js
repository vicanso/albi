'use strict';
require('../../helpers/local-require');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');

describe('middleware/common', () => {
  const commonMiddleware = localRequire('middlewares/common');
  describe('no-query', () => {
    it('check no query', done => {
      const app = new Koa();
      const server = app.listen();
      let total = 0;
      const finished = () => {
        total++;
        if (total === 2) {
          done();
        }
      };
      app.use(commonMiddleware.noQuery());

      app.use(ctx => {
        ctx.body = 'OK';
      });

      request(server)
        .get('/?name=test')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 400);
          assert.equal(res.text, 'query string must be empty');
          finished();
        });

      request(server)
        .get('/')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 200);
          assert.equal(res.text, 'OK');
          finished();
        });
    });
  });

  describe('deprecate', () => {
    it('add deprecate header', done => {
      const app = new Koa();
      const server = app.listen();
      const hint = 'This rest api will be deprecate because of security(2016-10-01). Please use xxx instead.'
      app.use(commonMiddleware.deprecate(hint));
      app.use(ctx => {
        ctx.body = 'OK';
      });
      request(server)
        .get('/?a=1')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.get('Warning'), hint);
          done();
        });
    });
  });

  describe('noCache', () => {
    it('not get/head will be pass', done => {
      let total = 0;
      const finished = () => {
        total++;
        if (total === 3) {
          done();
        }
      };
      const app = new Koa();
      const server = app.listen();
      app.use(commonMiddleware.noCache());
      app.use(ctx => {
        ctx.body = 'OK';
      });

      request(server)
        .post('/')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 200);
          finished();
        });

      request(server)
        .get('/?a=1')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 400);
          finished();
        });

      request(server)
        .get('/')
        .set('Cache-Control', 'no-cache')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 200);
          finished();
        });
    });
  });
});