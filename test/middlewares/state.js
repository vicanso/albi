'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
require('../../init');
describe('middleware/state', () => {
	it('should set state params successful', (done) => {
		const app = new Koa();
		const state = localRequire('middlewares/state');

		app.use(state({
			'/a.png': '123'
		}));

		app.use(ctx => {
			const state = ctx.state;
			assert(util.isFunction(state._));
			assert(util.isFunction(state.moment));
			assert.equal(state.APP_URL_PREFIX, '/albi');
			assert.equal(state.STATIC_URL_PREFIX, '/albi/static');
			assert(state.APP_VERSION);
			assert.equal(state.IMG_URL('/a.png'), '/albi/static/a.123.png');
			assert.equal(state.IMG_URL('b.png'), '/albi/static/b.png?v=' + state.APP_VERSION);
			assert.equal(state.URL('/home'), '/albi/home');
			ctx.body = 'OK';
		});

		request(app.listen())
			.get('/')
			.expect(200, done);
	});
});