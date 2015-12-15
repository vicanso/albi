'use strict';
const request = require('supertest');
const Koa = require('koa');
const util = require('util');
const assert = require('assert');
require('../../init');


describe('service/ip', () => {
	it('should get ip location successful', done => {
		const ip = localRequire('services/ip');
		ip.location('8.8.8.8').then(data => {
			assert.equal(data.country, '美国');
			done();
		}, done)
	});
});