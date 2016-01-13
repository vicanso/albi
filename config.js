'use strict';
const pkg = localRequire('package');
const path = require('path');
const env = process.env.NODE_ENV || 'development';

exports.version = pkg.appVersion;

exports.env = env;

exports.port = process.env.PORT || 3000;

exports.app = pkg.name;

exports.name = `${pkg.name}-${process.env.NAME || process.env.HOST_NAME || Date.now()}`;

// app url prefix for all request 
exports.appUrlPrefix = env === 'development' ? '' : '/albi';

// static file url prefix
exports.staticUrlPrefix = '/static';

// static file path
exports.staticPath = env === 'development' ? path.join(__dirname, 'public') :
	path.join(__dirname, 'assets');

exports.jspmPath = path.join(__dirname, 'jspm');

exports.componentPath = path.join(__dirname, 'assets/components');

// static file cache-control max-age
exports.staticMaxAge = env === 'development' ? 0 : 365 * 24 * 3600;

// log server url
exports.log = process.env.LOG || ((env === 'development' || env === 'test') ? '' : 'timtam://localhost:7001');

exports.trackCookie = '_jt';

// http log type
exports.logType = env === 'development' ? 'dev' : `:remote-addr - :cookie[${exports.trackCookie}] - :uuid ":method :url HTTP/:http-version" :status :length ":referrer" ":user-agent"`;

// http stats reset interval
exports.httpStatsResetInterval = 30 * 60 * 1000;

// http connection limit options
exports.limitOptions = {
	mid: 100,
	high: 500
};

// http request concurrency reach high, wait for `limitResetInterval` to reset app 'running'
exports.limitResetInterval = 5000;

// template options for tempate middleware
exports.templateOptions = {
	pretty: false,
	cache: env !== 'development'
};

// admin token
exports.adminToken = '7c4a8d09ca3762af61e59520943dc26494f8941b';

// view root path
exports.viewPath = path.join(__dirname, 'views');