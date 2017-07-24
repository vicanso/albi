const _ = require('lodash');

const template = require('../helpers/template');

const viewConfigs = [
  // name tempalte
  'home home',
  'admin admin',
];
const templateParser = {};
_.forEach(viewConfigs, (config) => {
  const arr = config.split(' ');
  templateParser[arr[0]] = template.parse(arr[1]);
});
module.exports = templateParser;
