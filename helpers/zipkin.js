'use strict';
const zipkin = require('zipkin');
console.dir(zipkin);
exports.init = init;
exports.trace = trace;
exports.childTrace = childTrace
/**
 * [init 初始化]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function init(options) {
  // options.debug = true;
  zipkin.initialize(options);
}

/**
 * [trace description]
 * @param  {[type]} service [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function trace(service, options) {
  return zipkin.trace(service, options);
}

/**
 * [childTrace description]
 * @param  {[type]} service [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function childTrace(service, options) {
  return zipkin.childTrace(service, options);
}
