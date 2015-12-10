'use strict';
require('../init');
const util = require('util');
const assert = require('assert');
const request = require('supertest');
const router = localRequire('router');
const Koa = require('koa');
describe('router', () => {
	it('should add controllers successful', done => {
		const app = new Koa();
		app.use(router.routes());

		request(app.listen())
			.get('/user/me')
			.set('Cache-Control', 'no-cache')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.name, 'vicanso');
				done();
			});
	});
});