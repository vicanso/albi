'use strict';
const path = require('path');
const pkg = localRequire('package');
const env = process.env.NODE_ENV || 'development';

exports.version = pkg.version;

exports.env = env;

exports.port = process.env.PORT || 5018;

exports.app = pkg.name;

exports.influx = process.env.INFLUX;

// app url prefix for all request
exports.appUrlPrefix = env === 'development' ? '' : '/albi';

// static file url prefix
exports.staticUrlPrefix = '/static';

// static file path
exports.staticPath = env === 'development' ? path.join(__dirname, 'public') :
  path.join(__dirname, 'assets');

exports.staticOptions = {
  urlPrefix: '/static',
  path: env === 'development' ? path.join(__dirname, 'public') : path.join(__dirname, 'assets'),
  maxAge: env === 'development' ? 0 : 365 * 24 * 3600,
  headers: {
    Vary: 'Accept-Encoding',
  },
};

// view root path
exports.viewPath = path.join(__dirname, 'views');
// jspm file path
exports.jspmPath = path.join(__dirname, 'jspm');
// user track cookie
exports.trackCookie = '_jt';
/* eslint max-len:0 */
exports.httpLogFormat = `:remote-addr - :cookie[${exports.trackCookie}] ":method :url HTTP/:http-version" :status :length ":referrer" ":user-agent"`;
// http connection limit options
exports.connectLimitOptions = {
  mid: 100,
  high: 500,
  interval: 5000,
};
