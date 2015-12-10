'use strict';
const util = require('util');
const assert = require('assert');
const dgram = require('dgram');
require('../../init');

describe('helpers/statsd-client', () => {
	it('should init statsd-client successful', done => {
		const server = dgram.createSocket('udp4');
		const sdc = localRequire('helpers/sdc');

		server.on('message', function(msg) {
			assert.equal(msg.toString(), 'http:1|c');
			server.close(done);
		});

		server.on('listening', function() {
			const address = server.address();
			sdc.init({
				host: address.address,
				port: address.port
			});

			sdc.increment('http', 1);
		});
		server.bind();
	});
});