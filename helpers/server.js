const Koa = require('koa');
const koaLog = require('koa-log');
const _ = require('lodash');
const mount = require('koa-mounting');
const staticServe = require('koa-static-serve');
const als = require('async-local-storage');
const Timing = require('supertiming');
const shortid = require('shortid');
const methodoverride = require('koa-methodoverride');
const bodyparser = require('koa-bodyparser');
const restVersion = require('koa-rest-version');
const etag = require('koa-etag');


const configs = localRequire('configs');

function createServer(port) {
  const app = new Koa();
  // trust proxy
  app.proxy = true;
  app.keys = ['cuttle-fish', 'tree.xie'];
  localRequire('middlewares/session').init(app);

  app.use((ctx, next) => {
    const id = ctx.get('X-Request-Id') || shortid();
    als.set('timing', new Timing());
    als.set('id', id);
    return next();
  });

  // error handler
  app.use(localRequire('middlewares/error')());

  app.use(localRequire('middlewares/entry')(configs.app, configs.appUrlPrefix));

  // timeout
  app.use(localRequire('middlewares/timeout')({
    timeout: 3000,
    // 如果query中设置了disableTimeout，则跳过timeout处理
    pass: ctx => _.has(ctx.query, 'disableTimeout'),
  }));

  // health check
  app.use(localRequire('middlewares/ping')('/ping'));

  // http log
  /* istanbul ignore if */
  if (configs.env === 'development') {
    app.use(koaLog('dev'));
  } else {
    /* istanbul ignore next */
    koaLog.morgan.token('request-id', ctx => ctx.get('X-Request-Id') || 'unknown');
    app.use(koaLog(configs.httpLogFormat));
  }

  // http stats
  app.use(localRequire('middlewares/http-stats')());

  // http connection limit
  const limitOptions = configs.connectLimitOptions;
  app.use(localRequire('middlewares/limit')(_.omit(limitOptions, 'interval'),
    limitOptions.interval));

  const staticOptions = configs.staticOptions;
  const denyQuerystring = configs.env !== 'development';
  // static file
  app.use(mount(
    staticOptions.urlPrefix,
    staticServe(staticOptions.path, {
      denyQuerystring,
      maxAge: staticOptions.maxAge,
      headers: staticOptions.headers,
    })));

  app.use(methodoverride());
  app.use(bodyparser());

  app.use(restVersion());

  app.use(localRequire('middlewares/common').fresh());

  app.use(etag());

  app.use(localRequire('middlewares/state')(localRequire('versions')));

  app.use(localRequire('router').routes());

  app.on('error', _.noop);

  /* istanbul ignore if */
  if (!port) {
    return app.listen();
  }

  const server = app.listen(port, (err) => {
    /* istanbul ignore if */
    if (err) {
      console.error(`server listen on http://127.0.0.1:${port}/ fail, err:${err.message}`);
    } else {
      console.info(`server listen on http://127.0.0.1:${port}/`);
    }
  });
  return server;
}

module.exports = createServer;
