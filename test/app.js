'use strict';
const request = require('supertest');
const assert = require('assert');
const albi = require('../app');
const config = require('../config');
const globals = require('../globals');

describe('albi', function() {

	it('should global middleware successful', function(done) {
		config.appUrlPrefix = '/albi';
		request(albi.initServer())
			.get('/albi/ping')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					assert.equal(res.get('X-Process'), 'unknown, node-albi');
					assert.equal(res.get('Cache-Control'), 'must-revalidate, max-age=0');
					done();
				}
			});
		config.appUrlPrefix = '';
	});

	it('should ping server successful', function(done) {
		request(albi.initServer())
			.get('/ping')
			.expect(200, 'pong', done);
	});

	it('should ping server fail', function(done) {
		globals.set('status', 'pause');
		request(albi.initServer())
			.get('/ping')
			.expect(500, 'the server is not running now!')
			.end(function(err, res) {
				if (err) {
					done(err);
					return;
				}
				globals.set('status', 'running');
				done();
			});
	});
});