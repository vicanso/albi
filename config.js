'use strict';
const path = require('path');
const pkg = require('./package');

const env = process.env.NODE_ENV || 'development';

// app前缀，用于相同host下以不同前缀区分站点
exports.appUrlPrefix = env === 'development'? '' : '/rest';

exports.env = env;

exports.version = process.env.APP_VERSION || 'unknown';

exports.sessionKey = 'vicanso';

exports.token = '6a3f4389a53c889b623e67f385f28ab8e84e5029';

exports.uuidKey = 'jtuuid';

exports.keys = [exports.sessionKey, exports.uuidKey];

exports.app = pkg.name;

exports.processName = (process.env.NAME || 'unknown') +  '-pm2-' + (process.env.pm_id || 'unknown');
