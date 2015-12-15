'use strict';
require('../../init');
const assert = require('assert');

describe('task/performance', () => {
	const performanceTask = localRequire('tasks/performance');
	const globals = localRequire('globals');
	const Joi = require('joi');
	it('should performance monitor successful', done => {
		performanceTask(1000, {
			set: () => {

			}
		});
		assert(globals.get('performance.lag') != null);
		Joi.validateThrow(globals.get('performance.memory'), Joi.object({
			exec: Joi.string().required(),
			physical: Joi.string().required()
		}));
		done();
	});
});