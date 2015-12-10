'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
require('../../init');

describe('middleware/no-cache', () => {
	it('should redirect successful', done => {
		const app = new Koa();
		const noCache = localRequire('middlewares/no-cache');
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
		const noCache = localRequire('middlewares/no-cache');
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
		const noCache = localRequire('middlewares/no-cache');
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