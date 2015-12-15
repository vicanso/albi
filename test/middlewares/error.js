'use strict';

const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
const Joi = require('joi');
require('../../init');

describe('middleware/error', () => {
	it('should response expected error successful', done => {
		const app = new Koa();
		const error = localRequire('middlewares/error');
		const httpError = localRequire('helpers/http-error');
		app.use(error);

		app.use(ctx => {
			throw httpError('error-message', 505);
		});

		request(app.listen())
			.get('/')
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				assert.equal(res.status, 505);
				const data = res.body;
				assert(data.expected);
				Joi.validateThrow(data, {
					code: Joi.number().required(),
					error: Joi.string().required(),
					expected: Joi.boolean().required()
				}, {
					allowUnknown: true
				});
				done();
			});
	});


	it('should response unexpected error successful', done => {
		const app = new Koa();
		const error = localRequire('middlewares/error');
		const httpError = localRequire('helpers/http-error');
		app.use(error);

		app.use(ctx => {
			i.j = 0;
		});

		request(app.listen())
			.get('/')
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				assert.equal(res.status, 500);
				const data = res.body;
				assert(!data.expected);
				Joi.validateThrow(data, {
					code: Joi.number().required(),
					error: Joi.string().required(),
					expected: Joi.boolean().required()
				}, {
					allowUnknown: true
				});
				done();
			});
	});

	it('should response html when router is templete render', done => {
		const app = new Koa();
		const error = localRequire('middlewares/error');
		const httpError = localRequire('helpers/http-error');
		app.use(error);

		app.use(ctx => {
			ctx.state.TEMPLATE = 'index';
			i.j = 0;
		});

		request(app.listen())
			.get('/')
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				assert.equal(res.status, 500);
				assert.equal(res.text.indexOf('<html><pre>'), 0);
				done();
			});

	});
});