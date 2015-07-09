'use strict';
const config = require('./config');
const util = require('util');
const path = require('path');
const co = require('co');
const _ = require('lodash');
const globals = require('./globals');
const debug = require('./helpers/debug');

// initServer(10000);

// initMongodb('mongodb://localhost:27017/test');
co(function *() {
  initLogger();
  let setting = yield getSetting();
  _.forEach(setting, function (v, k) {
    globals.set(k, v);
  });
  initApp();
}).catch(function (err) {
  console.error(err);
});

/**
 * [initApp description]
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function initApp() {
  initServer();
  initMongodb();
  let statsdConfig = globals.get('statsd');
  if (statsdConfig) {
    statsdConfig.prefix = statsdConfig.prefix || config.app;
    require('./helpers/sdc').init(statsdConfig);
  }

  let redisConfig = globals.get('redis');
  if (redisConfig) {
    require('./middlewares/session').init(redisConfig, globals.get('config.session'));
  }
  require('./helpers/monitor').run(60 * 1000);

  let zipkinConfig = globals.get('zipkin');
  if (zipkinConfig) {
    require('./helpers/zipkin').init(zipkinConfig);
  }
}


/**
 * [initLogger description]
 * @return {[type]} [description]
 */
function initLogger() {
  require('./helpers/logger');
}

/**
 * [initServer description]
 * @return {[type]} [description]
 */
function initServer() {
  const koa = require('koa');
  const mount = require('koa-mount');
  let port = globals.get('config.port');
  let app = koa();

  app.keys = ['secret_secret', 'i like io.js'];

  app.proxy = true;

  app.use(require('./middlewares/error'));

  // http response默认为不缓存，并添加X-
  app.use(function *(next) {
    let ctx = this;
    let processList = ctx.headers['x-process'] || '';
    ctx.set('X-Process', processList + ', node-' + (process.env.NAME || 'unknown'));
    ctx.set('Cache-Control', 'must-revalidate, max-age=0');
    yield* next;
  });

  // healthy check
  app.use(mount('/ping', function *() {
    yield Promise.resolve();
    this.body = config.version;
  }));

  // http log for dev
  if(config.env === 'development'){
    app.use(require('koa-logger')());
  }
  app.use(require('koa-log')(config.processName));

  app.use(require('./middlewares/http-stats')({
    time : [300, 500, 1000, 3000],
    size : [1024, 10240, 51200, 102400],
    cookie : [config.trackKey]
  }));

  // 超时，单位ms
  let timeout = 30 * 1000;
  if (config.env === 'development') {
    timeout = 5 * 1000;
  }
  // TODO:如果tiemout了，但是还有调用未完成，koa不会把数据返回给浏览器，这部分需要特别处理
  // app.use(require('koa-timeout')(timeout));


  // methodOverride(由于旧的浏览器不支持delete等方法)
  app.use(require('koa-methodoverride')());


  // bodyparser的处理
  app.use(require('koa-bodyparser')());


  // 从请求中的query中获取debug的相关参数
  app.use(require('./middlewares/debug')({
    DEBUG : '_debug',
    pretty : '_pretty',
    pattern : '_pattern',
    MOCK : '_mock'
  }));


  // 限制并发请求数
  app.use(require('koa-connection-limit')({
    mid : 100,
    high : 500
  }));

  // fresh的处理
  app.use(require('koa-fresh')());
  // etag的处理
  app.use(require('koa-etag')());

  app.use(require('./middlewares/picker')('_fields'));

  let appUrlPrefix = globals.get('config.appUrlPrefix');
  if (appUrlPrefix) {
    app.use(mount(appUrlPrefix), require('./routes'));
  } else {
    app.use(require('./routes'));
  }


  app.on('error', function appOnError(err, ctx) {
    let str = util.format('code:%s, error:%s, stack:%s', err.code || '0', err.message, err.stack);
    console.error(str);
  });


  app.listen(port);
  console.info('server listen on:%s', port);
}

/**
 * [initMongodb description]
 * @return {[type]}     [description]
 */
function initMongodb() {
  let uri = globals.get('mongodb');
  if (uri) {
    let modelPath = path.join(__dirname, 'models');
    require('./helpers/mongodb').init(uri, modelPath);
  }

}


function *getSetting() {
  const etcd = require('./services/etcd');
  const parallel = require('co-parallel');
  let configs = {
    // key : etcd中对应的key
    config : config.app,
    statsd : 'statsd',
    mongodb : 'mongodb',
    redis : 'redis'
  };

  let result = {
    statsd : {
      host : '127.0.0.1',
      port : 8124
    },
    zipkin : {
      host : '10.2.124.163',
      port : 9410,
      endPoint : {
        host : '127.0.0.1',
        port : 3000,
        service : 'albi-zipkin'
      }
    },
    mongodb : 'mongodb://192.168.2.1:27017/test',
    redis : {
      host : '192.168.2.1',
      port : 6379
    },
    config : {
      token : '6a3f4389a53c889b623e67f385f28ab8e84e5029',
      port : 10000,
      session : {
        ttl : 3600 * 1000,
        key : 'vicanso',
        cookie : {
          maxAge : null
        }
      }
    }
  };

  if (config.env !== 'development') {
    let reqs = _.map(configs, etcd.get);
    let keys = _.keys(configs);
    let res = yield parallel(reqs);
    result = {};
    _.forEach(res, function (item, index) {
      result[keys[index]] = item.value;
    });
  }

  debug('app setting:%j', result);

  return result;
}
