'use strict';
const _ = require('lodash');
const globals = localRequire('helpers/globals');

exports.getParam = (arr, validate, defaultValue) => {
  const v = _.find(arr, validate);
  if (!_.isUndefined(v)) {
    return v;
  }
  return defaultValue;
};

const checkToExit = exports.checkToExit = (times) => {
  if (!times) {
    console.error('exit while there are still connections');
    process.exit(1);
    return;
  }
  setTimeout(() => {
    if (!globals.get('connectingTotal')) {
      console.info('exit without any connection');
      return process.exit(0);
    }
    checkToExit(--times);
  }, 10 * 1000).unref();
};