const _ = require('lodash');

const globals = localRequire('helpers/globals');
const {
  client,
} = localRequire('helpers/influx');

// do something before exit
function beforeExit() {
  if (!client) {
    return Promise.resolve();
  }
  return client.syncWrite();
}

exports.getParam = (arr, validate, defaultValue) => {
  const v = _.find(arr, validate);
  if (!_.isUndefined(v)) {
    return v;
  }
  return defaultValue;
};

exports.checkToExit = (times, checkInterval = 10 * 1000) => {
  let count = times;
  globals.set('status', 'pause');
  const timer = setInterval(() => {
    /* istanbul ignore if */
    if (!count) {
      console.error('exit while there are still connections');
      clearInterval(timer);
      beforeExit().then(() => {
        process.exit(1);
      }, () => {
        process.exit(1);
      });
      return;
    }
    /* istanbul ignore if */
    if (!globals.get('connectingTotal')) {
      console.info('exit without any connection');
      clearInterval(timer);
      beforeExit().then(() => {
        process.exit(0);
      }, () => {
        process.exit(0);
      });
    } else {
      count -= 1;
    }
  }, checkInterval).unref();
  return timer;
};

exports.randomToken = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  const charsCount = chars.length;
  const arr = [];
  for (let i = 0; i < length; i += 1) {
    arr.push(chars[_.random(0, charsCount)]);
  }
  return arr.join('');
};
