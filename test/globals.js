'use strict';
const globals = require('../globals');
const assert = require('assert');

describe('globals', function() {
	it('init global values', function() {
		assert.equal(globals.get('status'), 'running');
	});

	it('set global value successful', function() {
		globals.set('status', 'pause');
		assert.equal(globals.get('status'), 'pause');
	});
});