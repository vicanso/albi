'use strict';
const util = require('util');
const assert = require('assert');
const dgram = require('dgram');
require('../../init');

describe('statsd-client', () => {
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


// var dgram = require("dgram");

// var server = dgram.createSocket("udp4");

// server.on("error", function (err) {
//   console.log("server error:\n" + err.stack);
//   server.close();
// });

// server.on("message", function (msg, rinfo) {
//   console.log("server got: " + msg + " from " +
//     rinfo.address + ":" + rinfo.port);
// });

// server.on("listening", function () {
//   var address = server.address();
//   console.log("server listening " +
//       address.address + ":" + address.port);
// });

// server.bind(41234);