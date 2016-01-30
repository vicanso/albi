'use strict';
// 初始化相关信息，程序启动时调用
global.localRequire = localRequire;

const logger = require('timtam-logger');
const path = require('path');
const config = localRequire('config');
const Joi = require('joi');
initLogger();

/* istanbul ignore next */
process.on('unhandledRejection', function(err) {
	console.error(`unhandledRejection:${err.message}, stack:${err.stack}`);
});
/* istanbul ignore next */
if (config.env === 'production') {
	process.on('uncaughtException', function(err) {
		// TODO should safe exit
		console.error(`uncaughtException:${err.message}, stack:${err.stack}`);
	});
}


/**
 * [validateThrow 如果校验失败，throw error，如果成功，返回转换后的数据]
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
Joi.validateThrow = function() {
	let result = Joi.validate.apply(Joi, arguments);
	let err = result.error;
	if (err) {
		err.status = 400;
		err.expose = true;
		err.expected = true;
		throw err;
	} else {
		return result.value;
	}
};

/**
 * [localRequire 加载本地文件（从app目录相对获取文件）]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function localRequire(name) {
	const file = path.join(__dirname, name);
	return require(file);
}



/**
 * [initLogger description]
 * @return {[type]} [description]
 */
/* istanbul ignore next */
function initLogger() {
	if (!config.log) {
		return;
	}
	const infos = require('url').parse(config.log);
	logger.set('app', config.app);
	logger.set('extra', {
		process: config.name
	});
	logger.wrap(console);
	logger.add('udp', {
		host: infos.hostname,
		port: parseInt(infos.port)
	});
}