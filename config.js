'use strict';
const path = require('path');
const pkg = require('./package');

const env = process.env.NODE_ENV || 'development';

exports.env = env;

exports.version = process.env.APP_VERSION || 'unknown';

exports.etcdUrl = process.env.ETCD || 'http://localhost:4001';

exports.app = pkg.name;

exports.trackKey = '_track';

exports.processName = (process.env.NAME || 'unknown') +  '-pm2-' + (process.env.pm_id || 'unknown');
