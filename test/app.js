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
					assert.equal(res.get('X-Process'), 'unknown,node-albi');
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

	it('should set http stats successful', function(done) {
		const server = albi.initServer();
		const doAgain = () => {
			request(server)
				.get('/sys/versions')
				.end(function(err, res) {
					if (err) {
						done(err);
					} else {
						const performance = globals.get('performance');
						assert.equal(performance.total, 2);
						assert.equal(performance.status['20x'], 2);
						const xTime = res.get('X-Time');
						assert(xTime);
						done();
					}
				});
		};

		request(server)
			.get('/sys/versions')
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					doAgain();
				}
			});
	});

	it('should reset http stats performance successful', function(done) {
		const resetInterval = config.httpStatsResetInterval;
		config.httpStatsResetInterval = 10;

		const check = function() {

			const performance = globals.get('performance');
			assert.equal(performance.total, 0);
			assert.equal(performance.connecting, 0);
			config.httpStatsResetInterval = resetInterval;
			done();
		};
		request(albi.initServer())
			.get('/sys/versions')
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					setTimeout(check, 100);
				}
			});
	});

	it('should set http connecting limit successful', function(done) {
		const limitOptions = config.limitOptions;
		const limitResetInterval = config.limitResetInterval;
		config.limitResetInterval = 30;
		config.limitOptions = {
			mid: 1,
			high: 2
		};
		const server = albi.initServer();
		const reset = function() {
			config.limitOptions = limitOptions;
			config.limitResetInterval = limitResetInterval;
			done();
		};

		const finishCheck = function() {
			request(server)
				.get('/test/wait/1')
				.end(function(err, res) {
					assert.equal(globals.get('concurrency'), 'low');
					done();
				});
		};

		request(server)
			.get('/test/wait/100')
			.end(function(err, res) {
				assert.equal(res.status, 200);
			});
		request(server)
			.get('/test/wait/120')
			.end(function(err, res) {
				assert.equal(res.status, 200);
				// app is resume to running
				request(server)
					.get('/ping')
					.end(function(err, res) {
						assert.equal(res.status, 200);
						finishCheck();
					});

			});
		request(server)
			.get('/test/wait/150')
			.end(function(err, res) {
				assert.equal(globals.get('concurrency'), 'mid');
				assert.equal(res.status, 429);
				// app status is pause
				request(server)
					.get('/ping')
					.end(function(err, res) {
						assert.equal(res.status, 500);
					});
			});
	});

	it('should get static file successful', function(done) {
		request(albi.initServer())
			.get('/static/css/pure.css')
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					assert.equal(res.get('Content-Length'), 31321);
					assert.equal(res.status, 200);
					'ETag Last-Modified Content-Length Content-Type Expires X-Time Date'.split(' ').forEach(function(key) {
						assert(res.get(key));
					});
					done();
				}
			});
	});

	it('should post successful', function(done) {
		request(albi.initServer())
			.post('/test/post')
			.send({
				name: 'a'
			})
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					assert.equal(res.status, 200);
					assert.equal(res.body.name, 'a');
					done();
				}
			});
	});

	it('should get debug params successful', function(done) {
		request(albi.initServer())
			.get('/test/debug?_debug=true&_pattern=*')
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					assert.equal(res.status, 200);
					assert.equal(JSON.stringify(res.body.debugParams), '{"DEBUG":true,"PATTERN":"*"}');
					assert.equal(JSON.stringify(res.body.query), '{}');
					assert.equal(res.body.url, '/test/debug');
					done();
				}
			});
	});

});