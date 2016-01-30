'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');

require('../../init');


describe('middleware/common', () => {
	const commonMiddleware = localRequire('middlewares/common');
	describe('no-query', () => {
		it('should check no query success', done => {
			const app = new Koa();
			const server = app.listen();
			let total = 0;
			const finished = () => {
				total++;
				if (total === 2) {
					done();
				}
			};
			app.use(commonMiddleware.noQuery);

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
					assert.equal(res.text, 'query must be empty');
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
		it('should set a deprecate response header success', done => {
			const app = new Koa();
			const hint = 'all request will be deprecate, please use v2.0 instead';
			const dueDay = '2015-12-25';
			app.use(commonMiddleware.deprecate(hint, dueDay));
			app.use(ctx => {
				ctx.body = 'OK';
			});

			request(app.listen())
				.get('/')
				.end((err, res) => {
					assert.equal(res.get('Warning'), hint);
					assert.equal(res.get('X-Due-Day'), dueDay);
					done();
				});
		});
	});

	describe('no-cache', () => {
		it('should redirect successful', done => {
			const app = new Koa();
			const noCache = commonMiddleware.noCache;
			app.use(noCache());
			app.use(ctx => {
				ctx.body = ctx.url;
			});

			request(app.listen())
				.get('/user')
				.end((err, res) => {
					assert.equal(res.status, 302);
					assert.equal(res.text, 'Redirecting to <a href="/user?cache=false">/user?cache=false</a>.');
					done();
				});

		});


		it('should http status to be 200 when url include cache=false', done => {
			const app = new Koa();
			const noCache = commonMiddleware.noCache;
			app.use(noCache());
			app.use(ctx => {
				ctx.body = ctx.url;
			});

			request(app.listen())
				.get('/user?cache=false')
				.end((err, res) => {
					assert.equal(res.status, 200);
					done();
				});

		});


		it('should http status to be 200 when request header set Cache-Control:no-cache', done => {
			const app = new Koa();
			const noCache = commonMiddleware.noCache;
			app.use(noCache());
			app.use(ctx => {
				ctx.body = ctx.url;
			});

			request(app.listen())
				.get('/user')
				.set('Cache-Control', 'no-cache')
				.end((err, res) => {
					assert.equal(res.status, 200);
					done();
				});

		});
	});

	describe('no-store', () => {
		it('should set a no-store response header success', done => {
			const app = new Koa();
			app.use(commonMiddleware.noStore());
			app.use(ctx => {
				ctx.body = 'OK';
			});
			request(app.listen())
				.get('/')
				.end((err, res) => {
					assert.equal(res.get('Cache-Control'), 'no-store');
					assert(res.get('ETag'));
					done();
				});
		});
	});

});