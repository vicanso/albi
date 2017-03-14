'use strict';
require('../../helpers/local-require');
const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');
const crypto = require('crypto');

describe('middleware/auth', () => {
  const authMiddleware = localRequire('middlewares/auth');
  it('admin', done => {
    const app = new Koa();
    const token = 'jenny';
    const sha1Token = crypto.createHash('sha1').update(token).digest('hex');
    app.use(require('koa-bodyparser')());
    app.use(authMiddleware.admin(sha1Token));
    app.use(ctx => {
      ctx.body = null;
    });
    const server = app.listen();

    request(server)
      .post('/')
      .set('Auth-Token', token)
      .send({
        name: 'abc',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 204);
        request(server)
          .post('/')
          .send({
            name: 'abc'
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 403);
            done();
          });
      });
  });
});