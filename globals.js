'use strict';
let globals = {};
exports.get = get;
exports.set = set;

function get(k) {
  if (k) {
    return _.get(globals, k);
  }
}

function set(k, v) {
  if (k) {
    _.set(globals, k, v);
  }
}
