'use strict';
require('../../init');
const assert = require('assert');

describe('task/reset', () => {
	it('should reset performance value successful', done => {
		const globals = localRequire('globals');
		const reset = localRequire('tasks/reset');
		reset();
		const performance = globals.get('performance');
		assert(performance.http_bak);
		assert(performance.route_bak);
		assert(!performance.http.total);
		assert(performance.http_bak.total);
		done();
	});
});