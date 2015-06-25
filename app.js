'use strict';
const config = require('./config');
const util = require('util');
const debug = require('./helpers/debug');

initServer(10000);

function initServer(port) {
  const koa = require('koa');
  const mount = require('koa-mount');

  let app = koa();

  app.keys = config.keys;

  // http response默认为不缓存
  app.use(function *(next) {
    this.set('Cache-Control', 'must-revalidate, max-age=0');
    yield next;
  });


  // 超时，单位ms
  let timeout = 30 * 1000;
  if (config.env === 'development') {
    timeout = 5 * 1000;
  }
  app.use(require('koa-timeout')(timeout));

  // methodOverride(由于旧的浏览器不支持delete等方法)
  app.use(require('koa-methodoverride')());

  // 限制并发请求数
  app.use(require('koa-connection-limit')({
    mid : 100,
    high : 500
  }));

  // http log for dev
  if(config.env === 'development'){
    app.use(require('koa-logger')());
  }

  app.use(require('koa-log')(config.processName));

  // fresh的处理
  app.use(require('koa-fresh')());

  // etag的处理
  app.use(require('koa-etag')());

  if (config.appUrlPrefix) {
    app.use(mount(config.appUrlPrefix), require('./routes'));
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
