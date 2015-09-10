'use strict';
const winston = require('winston');
const config = localRequire('config');
const _ = require('lodash');
const path = require('path');
const mkdirp = require('mkdirp');
var transports = [];
if (false && config.env === 'development') {
  transports.push(new(winston.transports.Console)({
    colorize: true
  }));
} else {
  let logPath = '/var/log/' + config.app;
  mkdirp.sync(logPath);
  transports.push(new(winston.transports.File)({
    name: 'out-file',
    filename: path.join(logPath, 'out.log'),
    timestamp: true
  }));
  transports.push(new(winston.transports.File)({
    filename: path.join(logPath, 'err.log'),
    name: 'error-file',
    timestamp: true,
    level: 'error'
  }));
}
const logger = new(winston.Logger)({
  transports: transports
});
_.forEach(_.functions(console), function(fn) {
  if (_.isFunction(logger[fn])) {
    console[fn] = function() {
      logger[fn].apply(logger, arguments);
    };
  }
});

exports.logger = logger;
