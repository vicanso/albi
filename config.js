'use strict';

const env = process.env.NODE_ENV || 'development';

exports.env = env;

exports.name = process.env.NAME || 'albi';

// app url prefix for all request 
exports.appUrlPrefix = env === 'development' ? '' : '/albi';

// log server url
exports.log = process.env.LOG || (env === 'development' ? '' : 'udp://localhost:6000');