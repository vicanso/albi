const als = require('async-local-storage');
const stringify = require('simple-stringify');

require('./helpers/joi-extend');
require('./helpers/logger');


global.Promise = require('bluebird');

// set stringify mask
stringify.isSecret = (key) => {
  const reg = /password/gi;
  return reg.test(key);
};
stringify.addFormat('_id', (v) => {
  if (!v) {
    return '';
  }
  return v.toString();
});

als.enable();
