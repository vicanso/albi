'use strict';
const path = require('path');
const pkg = require('./package');

const env = process.env.NODE_ENV || 'development';

exports.appUrlPrefix = env === 'development'? '' : '/rest';

exports.env = env;

exports.version = process.env.APP_VERSION || 'unknown';

exports.sessionKey = 'vicanso';

exports.uuidKey = 'jtuuid';

exports.keys = [exports.sessionKey, exports.uuidKey];

exports.app = pkg.name;

exports.processName = 'pm2-' + (process.env.pm_id || '');
