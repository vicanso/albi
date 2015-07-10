'use strict';

exports.init = init;
exports.trace = trace;
exports.childTrace = childTrace
let zipkinInitialized = false
/**
 * [init 初始化]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function init(options) {
  // 如果不使用到zipkin，则不会require
  let zipkin = require('zipkin');
  zipkin.initialize(options);
  zipkinInitialized = true;
}

/**
 * [trace description]
 * @param  {[type]} service [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function trace(service, options) {
  if (zipkinInitialized) {
    // 如果不使用到zipkin，则不会require
    let zipkin = require('zipkin');
    return zipkin.trace(service, options);
  }
}

/**
 * [childTrace description]
 * @param  {[type]} service [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function childTrace(service, options) {
  if (zipkinInitialized) {
    // 如果不使用到zipkin，则不会require
    let zipkin = require('zipkin');
    return zipkin.childTrace(service, options);
  }
}
