'use strict';
require('../../helpers/local-require');
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');

describe('middleware/entry', () => {
  it('should set entry middleware success', done => {
    let total = 0;
    const finished = () => {
      total++;
      if (total === 2) {
        done();
      }
    };

    const app = new Koa();
    const entry = localRequire('middlewares/entry');
    const server = app.listen();
    app.use(entry('/albi', 'ALBI'));

    app.use(ctx => {
      ctx.body = ctx.url;
    });

    request(server)
      .get('/albi')
      .set('Via', 'haproxy')
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 200);
          assert.equal(res.text, '/');
          assert.equal(res.get('Via'), 'haproxy,ALBI');
          assert.equal(res.get('Cache-Control'), 'no-cache, max-age=0');
          finished();
        }
      });


    request(server)
      .get('/albi/user')
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 200);
          assert.equal(res.text, '/user');
          assert.equal(res.get('Via'), 'ALBI');
          assert.equal(res.get('Cache-Control'), 'no-cache, max-age=0');
          finished();
        }
      });

  });
});