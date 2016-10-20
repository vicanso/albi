const _ = require('lodash');
const router = require('koa-router-parser');

const debug = localRequire('helpers/debug');
const middlewares = localRequire('middlewares');
const config = localRequire('config');
const views = localRequire('views');


function getRouter(descList) {
  return router.parse(descList);
}

function addToRouter(category, fns) {
  if (_.isFunction(fns)) {
    router.add(category, fns);
    return;
  }
  _.forEach(fns, (v, k) => {
    if (_.isFunction(v)) {
      debug('init route:%s', `${category}.${k}`);
      router.add(`${category}.${k}`, v);
    } else if (_.isObject(v)) {
      addToRouter(`${category}.${k}`, v);
    } else {
      /* istanbul ignore next */
      console.error(`${category}.${k} is invalid.`);
    }
  });
}

router.addDefault('common', middlewares.common.routeStats);

addToRouter('c', localRequire('controllers'));
addToRouter('m.noQuery', middlewares.common.noQuery());
addToRouter('m.noCache', middlewares.common.noCache());
addToRouter('m.auth.admin', middlewares.auth.admin(config.adminToken));
addToRouter('m.session', middlewares.session.normal);
addToRouter('m.session.read', middlewares.session.readonly);
// addToRouter('m.version', middlewares.common.version);
addToRouter('m.cache-60', middlewares.common.cacheMaxAge(60));
addToRouter('m.cache-300', middlewares.common.cacheMaxAge(300));
addToRouter('m.cache-600', middlewares.common.cacheMaxAge(600));

addToRouter('v', views);


module.exports = getRouter(localRequire('router/config'));
