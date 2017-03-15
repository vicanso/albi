'use strict';
require('../../helpers/local-require');
localRequire('helpers/joi');

const Koa = require('koa');
const request = require('supertest');
const assert = require('assert');
const ulid = require('ulid');
const mount = require('koa-mounting');
const config = localRequire('config');
const crypto = require('crypto');
const Timing = require('supertiming');

describe('controllers/user', () => {
  const session = localRequire('middlewares/session');
  const userCtrls = localRequire('controllers/user');
  const app = new Koa();
  const account = ulid();
  const password = ulid();
  const email = `${ulid()}@gmail.com`;
  const registerUrl = `${config.appUrlPrefix}/users/register`;
  const meUrl = `${config.appUrlPrefix}/users/me`;
  const logoutUrl = `${config.appUrlPrefix}/users/logout`;
  const loginUrl = `${config.appUrlPrefix}/users/login`;
  app.keys = ['vicanso', 'jenny'];
  app.use(require('koa-bodyparser')());

  app.use((ctx, next) => {
    ctx.state.timing = new Timing();
    if (ctx.url === registerUrl || ctx.url === logoutUrl || ctx.url === loginUrl) {
      return session.writable(ctx, next);
    }
    if (ctx.url === meUrl) {
      return session.readonly(ctx, next);
    }
    return next();
  });

  app.use((ctx, next) => {
    if (ctx.url === registerUrl) {
      return userCtrls.register(ctx);
    }
    if (ctx.url === meUrl) {
      return userCtrls.me(ctx);
    }
    if (ctx.url === logoutUrl) {
      return userCtrls.logout(ctx);
    }
    if (ctx.url === loginUrl) {
      if (ctx.method === 'GET') {
        return userCtrls.loginToken(ctx);
      }
      return userCtrls.login(ctx);
    }
    return next();
  });
  const server = app.listen();

  let cookie = '';
  it('delay', done => {
    setTimeout(done, 1000);
  });

  it('register', done => {
    request(server)
      .post(registerUrl)
      .set('Cache-Control', 'no-cache')
      .send({
        account,
        password,
        email,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 200);
        assert.equal(res.body.account, account);
        assert.equal(res.body.loginCount, 1);
        cookie = res.headers['set-cookie'].join(';');
        done();
      });
  });

  it('register exists account', done => {
    request(server)
      .post(registerUrl)
      .set('Cache-Control', 'no-cache')
      .send({
        account,
        password,
        email,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 403);
        done();
      });
  });

  it('me', done => {
    request(server)
      .get(meUrl)
      .set('Cache-Control', 'no-cache')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 200);
        assert(!res.body.account);
        request(server)
          .get(meUrl)
          .set('Cache-Control', 'no-cache')
          .set('cookie', cookie)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 200);
            assert.equal(res.body.account, account);
            assert.equal(res.body.loginCount, 1);
            done();
          });
      });
  });

  it('logout', done => {
    request(server)
      .del(logoutUrl)
      .set('Cache-Control', 'no-cache')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 204);
        done();
      });
  });


  it('login', done => {
    request(server)
      .get(loginUrl)
      .set('Cache-Control', 'no-cache')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        const token = res.body.token;
        cookie = res.headers['set-cookie'].join(';');
        assert(token);
        request(server)
          .post(loginUrl)
          .set('Cache-Control', 'no-cache')
          .set('cookie', cookie)
          .send({
            account,
            password: crypto.createHash('sha256').update(password + token).digest('hex'),
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 200);
            assert.equal(res.body.account, account);
            assert.equal(res.body.loginCount, 2);
            request(server)
              .get(loginUrl)
              .set('Cache-Control', 'no-cache')
              .set('cookie', cookie)
              .end((err, res) => {
                if (err) {
                  return done(err);
                }
                assert.equal(res.status, 400);
                done();
              });
          });
      });
  });

  it('register when is logined', done => {
    request(server)
      .post(registerUrl)
      .set('Cache-Control', 'no-cache')
      .set('cookie', cookie)
      .send({
        account,
        password,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 400);
        done();
      });
  });

  it('login without token', done => {
    request(server)
      .post(loginUrl)
      .set('Cache-Control', 'no-cache')
      .send({
        account,
        password,
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.status, 400);
        done();
      });
  });

  it('login with wrong account', done => {
    request(server)
      .get(loginUrl)
      .set('Cache-Control', 'no-cache')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        const token = res.body.token;
        cookie = res.headers['set-cookie'].join(';');
        assert(token);
        request(server)
          .post(loginUrl)
          .set('Cache-Control', 'no-cache')
          .set('cookie', cookie)
          .send({
            account: ulid(),
            password,
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 400);
            done();
          });
      });
  });

  it('login with wrong password', done => {
    request(server)
      .get(loginUrl)
      .set('Cache-Control', 'no-cache')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        const token = res.body.token;
        cookie = res.headers['set-cookie'].join(';');
        assert(token);
        request(server)
          .post(loginUrl)
          .set('Cache-Control', 'no-cache')
          .set('cookie', cookie)
          .send({
            account,
            password,
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.status, 400);
            done();
          });
      });
  });
});
