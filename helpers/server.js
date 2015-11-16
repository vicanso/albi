'use strict';
const config = localRequire('config');
const path = require('path');
const url = require('url');

exports.initMongodb = initMongodb;
exports.initStatsd = initStatsd;
exports.initRedisSession = initRedisSession;

/**
 * [initMongodb description]
 * @return {[type]} [description]
 */
function* initMongodb() {
	yield Promise.resolve();
	let mongodbUri = 'mongodb://mongodb:27017/test';
	if (mongodbUri) {
		let modelPath = path.join(__dirname, '../models');
		localRequire('helpers/mongodb').init(mongodbUri, modelPath);
	}
}

/**
 * [statsd description]
 * @return {[type]} [description]
 */
function* initStatsd() {
	let urlInfo = url.parse(config.statsd);
	yield Promise.resolve();
	let options = {
		host: urlInfo.hostname,
		port: parseInt(urlInfo.port),
		tcp: urlInfo.protocol === 'tcp:',
		prefix: config.app
	};
	localRequire('helpers/sdc').init(options);
}


/**
 * [initRedisSession description]
 * @return {Boolean} [description]
 */
function* initRedisSession() {
	yield Promise.resolve();
	let redisConfig = {
		host: 'redis',
		port: 6379
	};
	localRequire('middlewares/session').init(redisConfig, config.appSetting.session);
}


/**
 * [initZipkin description]
 * @return {[type]} [description]
 */
function* initZipkin() {
	yield Promise.resolve();
}