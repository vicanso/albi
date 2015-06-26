'use strict';
const requireTree = require('require-tree');
const _ = require('lodash');
const debug = require('../helpers/debug');
const koaRouter = require('koa-router');

module.exports = getRoutes();

function getRoutes() {
  let routerConfigs = getRouterConfigs();
  let router = koaRouter();
  _.forEach(routerConfigs, function(routerConfig) {
    let middlewareArr = routerConfig.middleware || [];
    let routes = routerConfig.route;
    if (!routes) {
      console.error('route is undefined, ' + JSON.stringify(routerConfig));
      return;
    }
    if (!_.isArray(routes)) {
      routes = [routes];
    }
    let methods = routerConfig.method || 'get';
    if (!_.isArray(methods)) {
      methods = [methods];
    }
    let handler = routerConfig.handler;
    if (!handler) {
      console.error('handler is undefined, ' + JSON.stringify(routerConfig));
      return;
    }
    _.forEach(routes, function(route) {
      _.forEach(methods, function(method) {
        method = method.toLowerCase();
        let params = [route].concat(middlewareArr);
        params.push(handler);
        router[method].apply(router, params);
      });
    });
  });
  return router.routes();
}

function getRouterConfigs() {
  let routesInfos = requireTree('./');
  let controllers = requireTree('../controllers');
  let middlewares = requireTree('../middlewares');
  let routes = _.flatten(_.values(routesInfos));
  debug('routes:%j', routes);
  let arr = [];
  _.forEach(routes, function(route) {
    let result = _.pick(route, ['method', 'route']);
    result.handler = _.get(controllers, route.handler);
    let middleware = route.middleware;
    if (middleware) {
      if (!_.isArray(middleware)) {
        middleware = [middleware];
      }
      result.middleware = _.map(middleware, function(name) {
        return _.get(middlewares, name);
      });
    }
    arr.push(result);
  });
  return arr;
}
