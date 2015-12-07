'use strict';
require('../init');
const assert = require('assert');
const Joi = require('joi');

describe('joi', function() {
	it('joi validate successful', function() {
		let result = Joi.validateThrow({
			a: '1',
			b: 'abc'
		}, {
			a: Joi.number().integer().required(),
			b: Joi.string().required()
		});
		assert.equal(result.a, 1);
		assert.equal(result.b, 'abc');
	});

	it('throw error when joi validate fail', function() {
		try {
			let result = Joi.validateThrow({
				a: 'def',
				b: 'abc'
			}, {
				a: Joi.number().integer().required(),
				b: Joi.string().required()
			});
		} catch (err) {
			assert.equal(err.status, 400);
			assert(err.expose);
			assert.equal(err.name, 'ValidationError');
		}

	});
});