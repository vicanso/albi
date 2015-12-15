'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
const globals = localRequire('globals');
const Joi = require('joi');
require('../../init');

describe('controller/system', () => {
	const systemCtrl = localRequire('controllers/system');
	it('should get versions successful', done => {
		const app = new Koa();
		app.use(systemCtrl.version);
		request(app.listen())
			.get('/')
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				assert.equal(res.status, 200);
				assert(res.body.exec);
				assert.equal(res.body.exec, res.body.code);
				done();
			});
	});


	it('should pause/resume app successful', done => {
		const app = new Koa();
		app.use(systemCtrl.pause);
		request(app.listen())
			.get('/')
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				assert.equal(res.status, 204);
				assert.equal(globals.get('status'), 'pause');
				const b = new Koa();
				b.use(systemCtrl.resume);
				request(b.listen())
					.get('/')
					.end((err, res) => {
						if (err) {
							return done(err);
						}
						assert.equal(res.status, 204);
						assert.equal(globals.get('status'), 'running');
						done();
					});
			});
	});

	it('should get stats successful', done => {
		const app = new Koa();
		app.use(systemCtrl.stats);
		request(app.listen())
			.get('/')
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				assert.equal(res.status, 200);
				Joi.validateThrow(res.body, Joi.object({
					version: Joi.object({
						code: Joi.string().required(),
						exec: Joi.string().required()
					}),
					uptime: Joi.string().required(),
					startedAt: Joi.string().required(),
					performance: Joi.object({
						http: Joi.object({
							createdAt: Joi.string().required(),
							total: Joi.number().required(),
							connecting: Joi.number().required(),
							status: Joi.object().required(),
							time: Joi.object().required(),
							size: Joi.object().required()
						}),
						lag: Joi.number().required(),
						memory: Joi.object({
							exec: Joi.string().required(),
							physical: Joi.string().required()
						}),
						route: Joi.object().required(),
						concurrency: Joi.string().required()
					})
				}));
				done();
			});
	});
});