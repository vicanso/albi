'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
require('../../init');


describe('middleware/template', () => {
	it('should compile a template successful', done => {
		const app = new Koa();
		const state = localRequire('middlewares/state');
		const template = localRequire('middlewares/template');
		app.use(state({}));
		app.use(template.home);
		app.use(ctx => {
			ctx.state.viewData = {
				name: 'vicanso'
			};
		});

		request(app.listen())
			.get('/')
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				assert.equal(res.status, 200);
				assert.equal(res.get('Content-Type'), 'text/html; charset=utf-8');
				done();
			});
	});
});