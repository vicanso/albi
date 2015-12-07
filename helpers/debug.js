'use strict';
const config = localRequire('config');
const debug = require('debug')('jt.' + config.name);
module.exports = debug;