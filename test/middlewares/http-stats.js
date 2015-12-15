'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
require('../../init');

describe('middleware/http-stats', () => {
	it('should set stats middleware successful', done => {
		const app = new Koa();
		const stats = localRequire('middlewares/http-stats');
		const globals = localRequire('globals');
		const server = app.listen();

		app.use(stats({
			sdc: localRequire('helpers/sdc')
		}));

		app.use(ctx => {
			if (ctx.url === '/wait') {
				return new Promise(function(resolve) {
					setTimeout(function() {
						ctx.body = 'OK';
						resolve();
					}, 200);
				});
			} else {
				ctx.body = 'OK';
			}
		});

		request(server)
			.get('/wait')
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					assert.equal(res.status, 200);
					const performance = globals.get('performance.http');
					assert.equal(performance.total, 2);
					assert.equal(performance.connecting, 0);
					done();

				}
			});

		request(server)
			.get('/')
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					assert.equal(res.status, 200);
					const performance = globals.get('performance.http');
					assert.equal(performance.total, 2);
					assert.equal(performance.connecting, 1);
				}
			});
	});

});