'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
const Joi = require('joi');
require('../../init');

describe('middleware/picker', () => {
	it('should pick fields successful', done => {
		const app = new Koa();
		const picker = localRequire('middlewares/picker');
		const server = app.listen();
		let finishedCount = 0;
		app.use(picker('_fields'));

		app.use(ctx => {
			if (ctx.path === '/array') {
				ctx.body = [{
					name: 'a',
					address: 'a-1',
					age: 1
				}, {
					name: 'b',
					address: 'b-2',
					age: 2
				}];
			} else {
				ctx.body = {
					name: 'c',
					address: 'c-3',
					age: 3
				};
			}
		});

		request(server)
			.get('/array?_fields=name,age')
			.end((err, res) => {
				assert.equal(res.status, 200);
				Joi.validateThrow(res.body, Joi.array().items(Joi.object({
					name: Joi.string().required(),
					age: Joi.number().required()
				})));
				finishedCount++;
				if (finishedCount == 2) {
					done();
				}
			});

		request(server)
			.get('/?_fields=name,age')
			.end((err, res) => {
				assert.equal(res.status, 200);
				Joi.validateThrow(res.body, Joi.object({
					name: Joi.string().required(),
					age: Joi.number().required()
				}));
				finishedCount++;
				if (finishedCount == 2) {
					done();
				}
			});
	});


	it('should omit fields successful', done => {
		const app = new Koa();
		const picker = localRequire('middlewares/picker');
		const server = app.listen();
		app.use(picker('_fields'));

		app.use(ctx => {
			if (ctx.path === '/array') {
				ctx.body = [{
					name: 'a',
					address: 'a-1',
					age: 1
				}, {
					name: 'b',
					address: 'b-2',
					age: 2
				}];
			} else {
				ctx.body = {
					name: 'c',
					address: 'c-3',
					age: 3
				};
			}
		});

		request(server)
			.get('/array?_fields=-address')
			.end((err, res) => {
				assert.equal(res.status, 200);
				Joi.validateThrow(res.body, Joi.array().items(Joi.object({
					name: Joi.string().required(),
					age: Joi.number().required()
				})));
				done();
			});
	});
});