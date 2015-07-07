'use strict';
const path = require('path');
const pkg = require('./package');

const env = process.env.NODE_ENV || 'development';

exports.env = env;

exports.version = process.env.APP_VERSION || 'unknown';

exports.etcdUrl = process.env.ETCD || 'http://localhost:4001';

// 在etcd中配置的数据节点名
exports.etcdNode = 'albi';

exports.app = pkg.name;

exports.processName = (process.env.NAME || 'unknown') +  '-pm2-' + (process.env.pm_id || 'unknown');
