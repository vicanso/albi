const _ = require('lodash');
const router = require('koa-router-parser');

const debug = require('./helpers/debug');
const middlewares = require('./middlewares');
const routes = require('./routes');
const views = require('./views');
const controllers = require('./controllers');


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

router.addDefault('common', middlewares.common.routeStats());

addToRouter('c', controllers);
addToRouter('m.noQuery', middlewares.common.noQuery());
addToRouter('m.noCache', middlewares.common.noCache());
addToRouter('m.auth.admin', middlewares.auth.admin());
addToRouter('m.session', middlewares.session.writable());
addToRouter('m.session.login', middlewares.session.login());

addToRouter('v', views);

addToRouter('level', middlewares.level);
addToRouter('version', middlewares.common.version);
addToRouter('tracker', middlewares.tracker);

module.exports = getRouter(routes);
