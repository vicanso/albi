'use strict';
require('./init');
const Koa = require('koa');
const config = localRequire('config');
const globals = localRequire('globals');
const errors = localRequire('errors');
const middlewares = localRequire('middlewares');
const koaConvert = require('koa-convert');

/* istanbul ignore if */
if (require.main === module) {
	initServer(config.port);
}


exports.initServer = initServer;

function initServer(port) {
	const mount = require('koa-mounting');
	const app = new Koa();
	const appUrlPrefix = config.appUrlPrefix;

	app.use(middlewares.entry(appUrlPrefix, config.name));

	// ping for health check
	app.use(mount('/ping', ping));

	// http log
	app.use(require('koa-log')(config.logType));

	// http stats middleware
	app.use(middlewares['http-stats'](config.httpStatsResetInterval));

	app.use(middlewares.limit(config.limitOptions, config.limitResetInterval));

	// static file middleware, add default header: Vary
	app.use(mount(
		config.staticUrlPrefix,
		require('koa-static-serve')(
			config.staticPath, {
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


	const Router = require('koa-router');

	const sysRouter = new Router();
	sysRouter.get('/sys/versions', function(ctx) {
		ctx.body = 'OK';
	});
	app.use(sysRouter.routes());


	const testRouter = new Router();
	testRouter.post('/test/post', function(ctx) {
		ctx.body = ctx.request.body;
	});
	testRouter.get('/test/debug', function(ctx) {
		ctx.body = {
			query: ctx.query,
			debugParams: ctx.debugParams,
			url: ctx.url
		};
	});
	testRouter.get('/test/wait/:ms', function(ctx) {
		const ms = parseInt(ctx.params.ms);
		return new Promise(function(resolve) {
			setTimeout(function() {
				ctx.body = ms;
				resolve();
			}, ms);
		});
	});
	app.use(testRouter.routes());


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