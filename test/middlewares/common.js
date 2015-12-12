'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');

require('../../init');


describe('middleware/common', () => {
	const commonMiddleware = localRequire('middlewares/common');
	it('should check no query successful', done => {
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