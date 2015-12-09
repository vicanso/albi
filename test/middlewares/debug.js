'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
require('../../init');

describe('middleware-debug', () => {
	it('should set debug params successful', (done) => {
		const app = new Koa();
		const debug = localRequire('middlewares/debug');
		app.use(debug());

		app.use(ctx => {
			const params = ctx.debugParams;
			assert(params.DEBUG);
			assert.equal(JSON.stringify(params.MOCK), '{"a":1}');
			assert.equal(params.PATTERN, '*');
			assert.equal(ctx.url, '/');
			ctx.body = 'OK';
		});

		request(app.listen())
			.get('/?_debug=true&_pattern=*&_mock={"a":1}')
			.expect(200, done);
	});

});