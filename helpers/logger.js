/**
 * 初始化logger对象（自动对console做替换）
 */
const Logger = require('timtam-logger');
const als = require('async-local-storage');

const configs = require('../configs');


if (configs.logger) {
  const logger = new Logger({
    app: configs.app,
  });
  logger.before(configs.name);
  logger.before(() => als.get('account'));
  logger.before(() => als.get('id'));
  logger.wrap(console);
  logger.add(configs.logger);
  'emerg alert crit'.split(' ').forEach((event) => {
    logger.on(event, (message) => {
      console.dir(message);
      // TODO 发送email警报
    });
  });
  module.exports = logger;
} else {
  console.emerg = console.error;
  console.alert = console.error;
  console.crit = console.error;
  module.exports = console;
}
