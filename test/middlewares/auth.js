'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
require('../../init');

describe('middleware/auth', () => {
	it('should auth admin successful', done => {
		const app = new Koa();
		const auth = localRequire('middlewares/auth');
		const server = app.listen();
		app.use(require('koa-bodyparser')());
		app.use(auth.admin);

		app.use(ctx => {
			ctx.body = ctx.request.body;
		});
		request(server)
			.post('/')
			.send({
				'jtToken': '123456'
			})
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					assert.equal(res.status, 200);
					assert.equal(res.body.jtToken, '123456');
					done();
				}
			});
	});

	it('should throw 403 when token is invalid', done => {
		const app = new Koa();
		const auth = localRequire('middlewares/auth');
		const server = app.listen();
		app.use(require('koa-bodyparser')());
		app.use(auth.admin);

		app.use(ctx => {
			ctx.body = ctx.request.body;
		});
		request(server)
			.post('/')
			.send({
				'jtToken': '345678'
			})
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					assert.equal(res.status, 403);
					done();
				}
			});
	});
});