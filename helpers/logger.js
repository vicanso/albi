'use strict';
const config = localRequire('config');
const jtlogger = require('jtlogger');
const path = require('path');
const url = require('url');
const util = require('util');
let transports = [];
if (config.env === 'production') {
  transports.push({
    type: 'file',
    timestamp: true,
    filename: path.join('/var/log', config.app, 'out.log')
  });
  if (config.udpLog) {
    let urlInfo = url.parse(config.udpLog);
    transports.push({
      type: 'udp',
      host: urlInfo.hostname,
      port: urlInfo.port,
      tag: config.app,
      timestamp: true
    });
  }
  jtlogger.init(transports);
} else {
  let originalError = console.error;
  console.error = function () {
    let args = Array.from(arguments);
    args = args.map(function (argument) {
      if (util.isError(argument)) {
        return 'Error:' + argument.message + ', stack:' +
          argument.stack;
      } else {
        return argument;
      }
    });
    let str = util.format.apply(util, args);
    originalError.call(console, str);
  };
}
