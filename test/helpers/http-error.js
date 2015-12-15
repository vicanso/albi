'use strict';
const assert = require('assert');
require('../../init');

describe('helper/http-error', () => {
	it('should get an error successful', done => {
		const httpError = localRequire('helpers/http-error');
		const err500 = httpError('my 500');
		assert.equal(err500.status, 500);
		assert(err500.expected);
		assert.equal(err500.message, 'my 500');

		const err403 = httpError('my 403', 403);
		assert.equal(err403.status, 403);
		assert(err403.expected);
		assert.equal(err403.message, 'my 403');
		done();
	});
});