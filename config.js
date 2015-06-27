'use strict';
const path = require('path');
const pkg = require('./package');

const env = process.env.NODE_ENV || 'development';

// app前缀，用于相同host下以不同前缀区分站点
exports.appUrlPrefix = env === 'development'? '' : '/rest';

exports.env = env;

exports.version = process.env.APP_VERSION || 'unknown';

exports.sessionKey = 'vicanso';

exports.uuidKey = 'jtuuid';

exports.keys = [exports.sessionKey, exports.uuidKey];

exports.app = pkg.name;

exports.processName = (process.env.NAME || 'unknown') +  '-pm2-' + (process.env.pm_id || 'unknown');
