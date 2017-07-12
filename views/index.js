const _ = require('lodash');

const template = localRequire('helpers/template');

const viewConfigs = [
  // name tempalte
  'home home',
];
const templateParser = {};
_.forEach(viewConfigs, (config) => {
  const arr = config.split(' ');
  templateParser[arr[0]] = template.parse(arr[1]);
});
module.exports = templateParser;
