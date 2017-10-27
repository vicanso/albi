const _ = require('lodash');
const als = require('async-local-storage');
const bodyparser = require('koa-bodyparser');
const etag = require('koa-etag');
const Koa = require('koa');
const koaLog = require('koa-log');
const methodoverride = require('koa-methodoverride');
const mount = require('koa-mounting');
const restVersion = require('koa-rest-version');
const shortid = require('shortid');
const staticServe = require('koa-static-serve');
const Timing = require('supertiming');
const path = require('path');


const configs = require('../configs');
const middlewares = require('../middlewares');
const router = require('../router');

function createServer(port) {
  const app = new Koa();
  // trust proxy
  app.proxy = true;
  app.keys = ['cuttle-fish', 'tree.xie'];
  middlewares.session.init(app);

  app.use((ctx, next) => {
    const id = ctx.get('X-Request-Id') || shortid();
    const lang = ctx.query.lang || 'en';
    const timing = new Timing();
    delete ctx.query.lang;
    ctx.state.timing = timing;
    ctx.state.lang = lang;
    ctx.set('X-Response-Id', id);
    // als设置的参数
    als.set('timing', timing);
    als.set('id', id);
    als.set('lang', lang);
    return next();
  });

  // error handler
  app.use(middlewares.error());

  app.use(middlewares['response-logger']());

  app.use(middlewares.entry(`${configs.version} ${configs.app}`, configs.appUrlPrefix));

  // timeout
  app.use(middlewares.timeout({
    timeout: 3000,
    // 如果query中设置了disableTimeout，则跳过timeout处理
    pass: ctx => _.has(ctx.query, 'disableTimeout'),
  }));

  // health check
  app.use(middlewares.ping('/ping'));

  // http log
  /* istanbul ignore if */
  if (configs.env === 'development') {
    app.use(koaLog('dev'));
  } else {
    /* istanbul ignore next */
    koaLog.morgan.token('request-id', ctx => ctx.get('X-Request-Id') || '-');
    koaLog.morgan.token('account', ctx => ctx.state.account || 'anonymous');
    app.use(koaLog(configs.httpLogFormat));
  }

  // http stats
  app.use(middlewares['http-stats']());

  // http connection limit
  const limitOptions = configs.connectLimitOptions;
  app.use(middlewares.limit.connection(_.omit(limitOptions, 'interval'),
    limitOptions.interval));


  if (configs.env !== 'production') {
    app.use(mount(
      '/docs',
      staticServe(path.resolve(__dirname, '../docs'), {
        maxAge: 300,
      })));
  }


  app.use(methodoverride());
  app.use(bodyparser());

  app.use(restVersion({
    override: true,
  }));

  app.use(middlewares.common.fresh());

  app.use(etag());
  // 测试环境才需要使用到mock
  if (configs.env !== 'production') {
    app.use(middlewares.mock());
  }


  app.use(router.routes());

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
