const _ = require('lodash');

const globals = localRequire('helpers/globals');

exports.getParam = (arr, validate, defaultValue) => {
  const v = _.find(arr, validate);
  if (!_.isUndefined(v)) {
    return v;
  }
  return defaultValue;
};

exports.checkToExit = (times, checkInterval = 10 * 1000) => {
  let count = times;
  const timer = setInterval(() => {
    /* istanbul ignore if */
    if (!count) {
      console.error('exit while there are still connections');
      clearInterval(timer);
      process.exit(1);
      return;
    }
    /* istanbul ignore if */
    if (!globals.get('connectingTotal')) {
      console.info('exit without any connection');
      clearInterval(timer);
      process.exit(0);
    } else {
      count -= 1;
    }
  }, checkInterval).unref();
  return timer;
};
