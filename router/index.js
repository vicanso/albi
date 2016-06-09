'use strict';
const _ = require('lodash');
const router = require('koa-router-parser');
const debug = localRequire('helpers/debug');
const middlewares = localRequire('middlewares');
const config = localRequire('config');
const influx = localRequire('helpers/influx');
const views = localRequire('views');

function routeStats(ctx, next) {
  const start = Date.now();
  return next().then(() => {
    const use = Date.now() - start;
    const method = ctx.method.toUpperCase();
    const layer = _.find(ctx.matched, tmp => _.indexOf(tmp.methods, method) !== -1);
    if (!layer) {
      return;
    }
    influx.write('http-route', {
      use,
    }, {
      method: method.toLowerCase(),
      path: layer.path,
      spdy: _.sortedIndex([30, 100, 300, 1000, 3000], use),
    });
  });
}

function getRouter(descList) {
  return router.parse(descList);
}

function addToRouter(category, fns) {
  if (_.isFunction(fns)) {
    router.add(category, fns);
    return;
  }
  _.forEach(fns, (v, k) => {
    /* istanbul ignore else */
    if (_.isFunction(v)) {
      debug('init route:%s', `${category}.${k}`);
      router.add(`${category}.${k}`, v);
    } else if (_.isObject(v)) {
      addToRouter(`${category}.${k}`, v);
    } else {
      console.error(`${category}.${k} is invalid.`);
    }
  });
}

router.addDefault('common', routeStats);

addToRouter('c', localRequire('controllers'));
addToRouter('m.noQuery', middlewares.common.noQuery());
addToRouter('m.noCache', middlewares.common.noCache());
addToRouter('m.auth.admin', middlewares.auth.admin(config.adminToken));
addToRouter('m.session', middlewares.session.normal);
addToRouter('m.session.read', middlewares.session.readonly);
addToRouter('m.version', middlewares.common.version);
addToRouter('v', views);


module.exports = getRouter(localRequire('router/config'));
