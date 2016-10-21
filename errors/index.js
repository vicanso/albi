const requireTree = require('require-tree');
const _ = require('lodash');

const errors = {};

_.forEach(requireTree('.'), (items) => {
  _.forEach(items, (item, code) => {
    if (errors[code]) {
      console.warn(`The code ${code} has been use`);
      return;
    }
    errors[code] = item;
  });
});

module.exports = errors;
