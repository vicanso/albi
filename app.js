'use strict';
require('./init');
const Koa = require('koa');
const config = localRequire('config');
const globals = localRequire('globals');
const errors = localRequire('errors');
const middlewares = localRequire('middlewares');
const koaConvert = require('koa-convert');
const _ = require('lodash');

localRequire('services');

/* istanbul ignore if */
if (require.main === module) {
	initServer(config.port);
}


exports.initServer = initServer;

function initServer(port) {
	localRequire('tasks');
	const mount = require('koa-mounting');
	const app = new Koa();
	// app.keys = ['im a newer secret', 'i like turtle'];
	const appUrlPrefix = config.appUrlPrefix;

	// error handler
	app.use(middlewares.error);


	app.use(middlewares.entry(appUrlPrefix, config.name));

	// ping for health check
	app.use(mount('/ping', ping));

	// http log
	const koaLog = require('koa-log');

	koaLog.morgan.token('uuid', function getUUID(ctx) {
		return ctx.get('X-UUID') || 'unknown';
	});

	app.use(koaLog(config.logType));

	// http stats middleware
	app.use(middlewares['http-stats']({
		sdc: localRequire('helpers/sdc')
	}));

	// http connection limit
	app.use(middlewares.limit(config.limitOptions, config.limitResetInterval));


	if (config.env === 'development') {
		app.use(mount(
			config.staticUrlPrefix,
			require('koa-stylus-parser')(config.staticPath)
		));
	}

	const denyQuerystring = config.env !== 'development';
	// jspm
	app.use(mount(
		config.staticUrlPrefix + '/jspm',
		require('koa-static-serve')(
			config.jspmPath, {
				denyQuerystring: denyQuerystring,
				maxAge: config.staticMaxAge,
				headers: {
					'Vary': 'Accept-Encoding'
				}
			}
		)
	));

	// static file middleware, add default header: Vary
	app.use(mount(
		config.staticUrlPrefix,
		require('koa-static-serve')(
			config.staticPath, {
				denyQuerystring: denyQuerystring,
				maxAge: config.staticMaxAge,
				headers: {
					'Vary': 'Accept-Encoding'
				}
			}
		)
	));

	app.use(require('koa-methodoverride')());

	app.use(require('koa-bodyparser')());

	app.use(middlewares.debug());



	app.use(koaConvert(require('koa-fresh')()));

	app.use(koaConvert(require('koa-etag')()));


	app.use(middlewares.state(localRequire('versions')));

	app.use(middlewares.picker('_fields'));

	app.use(localRequire('router').routes());

	app.on('error', _.noop);

	return app.listen(port, function(err) {
		if (err) {
			console.error(`server listen on ${port} fail, err:${err.message}`);
		} else {
			console.info(`server listen on ${port}`);
		}
	});

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