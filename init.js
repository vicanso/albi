'use strict';
// 初始化相关信息，程序启动时调用
global.localRequire = localRequire;
const path = require('path');
const config = localRequire('config');
const Joi = require('joi');
const logger = require('timtam-logger');
initLogger();

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
  let file = path.join(__dirname, name);
  return require(file);
}


/**
 * [initLogger description]
 * @return {[type]} [description]
 */
function initLogger() {
  if (config.env === 'development') {
    return;
  }
  let infos = require('url').parse(config.log);
  let type = 'udp';
  if (infos.protocol === 'tcp:') {
    type = 'tcp';
  }
  logger.init({
    app: config.app
  });
  logger.add('console');
  logger.add(type, {
    host: infos.hostname,
    port: parseInt(infos.port)
  });
}