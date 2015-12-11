'use strict';
const pkg = localRequire('package');
const path = require('path');
const env = process.env.NODE_ENV || 'development';

exports.version = pkg.appVersion;

exports.env = env;

exports.port = process.env.PORT || 3000;

exports.name = process.env.NAME || 'albi';

// app url prefix for all request 
exports.appUrlPrefix = env === 'development' ? '' : '/albi';

// static file url prefix
exports.staticUrlPrefix = '/static';

// static file path
exports.staticPath = env === 'development' ? path.join(__dirname, 'public') :
	path.join(__dirname, 'assets');

// static file cache-control max-age
exports.staticMaxAge = env === 'development' ? 0 : 365 * 24 * 3600;

// log server url
exports.log = process.env.LOG || (env === 'development' ? '' : 'udp://localhost:6000');

// http log type
exports.logType = env === 'development' ? 'dev' : ':remote-addr - :cookie[_track] ":method :url HTTP/:http-version" :status :length ":referrer" ":user-agent"';

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