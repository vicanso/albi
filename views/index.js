'use strict';
const viewConfigs = [
  // name tempalte
  'home home',
  'test test',
];
const template = localRequire('middlewares/template');
const _ = require('lodash');
_.forEach(viewConfigs, config => {
  const arr = config.split(' ');
  exports[arr[0]] = template.parse(arr[1]);
});
