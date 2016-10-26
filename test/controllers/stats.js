'use strict';
require('../../helpers/local-require');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');

describe('controllers/stats', () => {
  it('ajax', done => {
    const app = new Koa();
    app.use(require('koa-bodyparser')());
    app.use(localRequire('controllers/stats').ajax);
    const server = app.listen();
    request(server)
      .post('/')
      .send([
        {
          use: 1,
          method: 'GET',
        }
      ])
      .expect(201, done);
  });

  it('exception', done => {
    const app = new Koa();
    app.use(require('koa-bodyparser')());
    app.use(localRequire('controllers/stats').exception);
    const server = app.listen();
    request(server)
      .post('/')
      .send([
        {
          message: 'get session faile',
          method: 'GET',
        }
      ])
      .expect(201, done);
  });

  it('statistics', done => {
    const app = new Koa();
    app.use(require('koa-bodyparser')());
    app.use(localRequire('controllers/stats').statistics);
    const server = app.listen();
    request(server)
      .post('/')
      .send({
        screen: {
          width: 1080,
          height: 900,
        },
        timing: {
          js: 100,
          html: 30,
        },
        performance: {

        },
        entries: [
          {
            path: '/',
            use: 100,
          }
        ]
      })
      .expect(201, done);
  });

});