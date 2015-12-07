'use strict';
require('./init');
const Koa = require('koa');
const config = localRequire('config');
const globals = localRequire('globals');
const errors = localRequire('errors');
const middlewares = localRequire('middlewares');

const mounting = require('../koa-mounting');

exports.initServer = initServer;

function initServer(port) {
	const app = new Koa();

	const appUrlPrefix = config.appUrlPrefix;

	app.use(middlewares.entry(appUrlPrefix));

	app.use(mounting('/ping', ping));

	app.use(middlewares['http-stats']({
		time: {
			v: [300, 500, 1000, 3000],
			desc: ['puma', 'tiger', 'deer', 'rabbit', 'turtle']
		},
		size: {
			v: [10240, 51200, 102400, 307200, 1024000],
			desc: ['10KB', '50KB', '100KB', '300KB', '1MB', '>1MB'],
		},
		status: {
			v: [199, 299, 399, 499, 999],
			desc: ['10x', '20x', '30x', '40x', '50x']
		},
		interval: 30 * 60 * 1000
	}));

	return app.listen(port);
}



/**
 * [ping ping middleware]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function ping(ctx) {
	if (globals.get('status') !== 'running') {
		throw errors.get('the server is not running now!');
	} else {
		ctx.body = 'pong';
	}
}