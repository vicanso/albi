const _ = require('lodash');
const requireTree = require('require-tree');

module.exports = _.flatten(_.values(requireTree('.')));
