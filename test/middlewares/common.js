'use strict';
require('../../helpers/local-require');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');
const Timing = require('supertiming');

describe('middleware/common', () => {
  const commonMiddleware = localRequire('middlewares/common');
  describe('no-query', () => {
    it('check no query', done => {
      const app = new Koa();
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
      const server = app.listen();

      request(server)
        .get('/?name=test')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Query string must be empty');
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
      const hint = 'This rest api will be deprecate because of security(2016-10-01). Please use xxx instead.'
      app.use(commonMiddleware.deprecate(hint));
      app.use(ctx => {
        ctx.body = 'OK';
      });
      const server = app.listen();
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
      app.use(commonMiddleware.noCache());
      app.use(ctx => {
        ctx.body = 'OK';
      });
      const server = app.listen();

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
          assert.equal(res.status, 302);
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

  describe('verion', () => {
    it('valid version', done => {
      const app = new Koa();
      app.use((ctx, next) => {
        ctx.versionConfig = {
          version: 1,
          type: 'json'
        };
        return next();
      });
      app.use(commonMiddleware.version([1, 2], 'json'));
      app.use(ctx => {
        ctx.body = null;
      });
      const server = app.listen();
      request(server)
        .get('/')
        .expect(204, done);
    });

    it('invalid version', done => {
      const app = new Koa();
      app.use((ctx, next) => {
        ctx.versionConfig = {
          version: 2,
          type: 'json'
        };
        return next();
      });
      app.use(commonMiddleware.version([1, 3], 'json'));
      app.use(ctx => {
        ctx.body = null;
      });
      const server = app.listen();
      request(server)
        .get('/')
        .expect(406, done);
    });

    it('invalid type', done => {
      const app = new Koa();
      app.use((ctx, next) => {
        ctx.versionConfig = {
          version: 2,
          type: 'xml'
        };
        return next();
      });
      app.use(commonMiddleware.version([1, 2], 'json'));
      app.use(ctx => {
        ctx.body = null;
      });
      const server = app.listen();
      request(server)
        .get('/')
        .expect(406, done);
    });
  });

  describe('route stats', () => {
    it('get stats', done => {
      const app = new Koa();
      app.use((ctx, next) => {
        ctx.state.timing = new Timing();
        return next();
      });
      app.use(commonMiddleware.routeStats);
      app.use(ctx => {
        ctx.matched = [
          {
            methods: ['GET'],
            path: '/'
          }
        ];
        ctx.body = null;
      });
      const server = app.listen();

      request(server)
        .get('/')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.status, 204);
          done();
        });
    })
  });
});
