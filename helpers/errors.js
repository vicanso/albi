const createError = require('http-errors');
const _ = require('lodash');

const errors = localRequire('errors');

function getErrorByCode(code, lang = 'en') {
  const item = errors[code] || {
    code,
  };
  const err = new Error(item[lang] || 'Unknown error');
  return createError(err, item.status || 500, {
    code,
    expected: true,
  });
}

function getError(...args) {
  const arg = args[0];
  if (_.isNumber(arg)) {
    return getErrorByCode(...args);
  }
  const err = createError(...args);
  // 主动抛出的error设置expected，可以通过判断expected是否为true来识别是否为未知error
  err.expected = true;
  return err;
}

exports.get = getError;
