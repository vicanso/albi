'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
require('../../init');

describe('middleware-entry', () => {
	it('should set entry middleware successful', done => {
		const app = new Koa();
		const entry = localRequire('middlewares/entry');
		const server = app.listen();
		app.use(entry('/albi', 'ALBI'));


		app.use(ctx => {
			ctx.body = ctx.url;
		});

		request(server)
			.get('/albi/')
			.end((err, res) => {
				if (err) {
					done(err);
				} else {
					assert.equal(res.status, 200);
					assert.equal(res.text, '/');
					assert.equal(res.get('X-Process'), 'unknown,node-ALBI');
					assert.equal(res.get('Cache-Control'), 'must-revalidate, max-age=0');
					done();
				}
			});
	});
});