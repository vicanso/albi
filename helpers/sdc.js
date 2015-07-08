'use strict';
const SDC = require('statsd-client');
const _ = require('lodash');
const util = require('util');
let client = null;

exports.init = init;
exports.client = client;

_.forEach('gauge gaugeDelta set counter increment decrement timing'.split(' '), function (fn) {
  // 对statsd-client的方法做封装，判断如果没有初始化的时候，只输出log
  exports[fn] = function (name, value) {
    if (client) {
      client[fn](name, value);
    } else {
      let str = util.format('statsd %s %s', fn, name);
      if (!_.isUndefined(value)) {
        str += (' ' + value);
      }
      console.info(str);
    }
  };
});

/**
 * [init description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function init(options) {
  client = new SDC(options);
}
