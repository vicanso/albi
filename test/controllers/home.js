'use strict';
require('../../helpers/local-require');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');

describe('controllers/home', () => {
  it('home controller', done => {
    const app = new Koa();
    app.use(localRequire('controllers/home'));
    const server = app.listen();
    request(server)
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 404);
        assert.equal(res.get('Cache-Control'), 'public, max-age=600');
        done();
      });
  });
});