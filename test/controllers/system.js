'use strict';
require('../../helpers/local-require');
const util = require('util');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');
const pkg = localRequire('package');
const globals = localRequire('helpers/globals');

describe('controllers/system', () => {
  const systemCtrls = localRequire('controllers/system');
  it('version', done => {
    const app = new Koa();
    app.use(systemCtrls.version);
    const server = app.listen();
    request(server)
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.code, pkg.version);
        assert.equal(res.body.exec, pkg.version);
        done();
      });
  });

  it('pause', done => {
    const app = new Koa();
    app.use(systemCtrls.pause);
    const server = app.listen();
    request(server)
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 204);
        assert.equal(globals.get('status'), 'pause');
        done();
      });
  });

  it('resume', done => {
    const app = new Koa();
    app.use(systemCtrls.resume);
    const server = app.listen();
    request(server)
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 204);
        assert.equal(globals.get('status'), 'running');
        done();
      });
  });

  it('stats', done => {
    const app = new Koa();
    app.use(systemCtrls.stats);
    const server = app.listen();
    request(server)
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.connectingTotal, 0);
        assert.equal(res.body.status, 'running');
        assert(res.body.version);
        assert(res.body.uptime);
        assert(res.body.startedAt);
        done();
      });
  });

});