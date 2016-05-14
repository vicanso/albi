'use strict';
const createError = require('http-errors');
function getError(...args) {
  const err = createError.apply(null, args);
  err.code = err.status;
  // 主动抛出的error设置expected，可以通过判断expected是否为true来识别是否为未知error
  err.expected = true;
  return err;
}

exports.get = getError;

