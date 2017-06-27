const Logger = require('timtam-logger');
const stringify = require('simple-stringify');
const als = require('async-local-storage');

als.enable();

require('./helpers/local-require');


const config = localRequire('config');
const utils = localRequire('helpers/utils');

function initLogger() {
  const logger = new Logger({
    app: config.app,
  });
  logger.before(config.name);
  logger.before(() => als.get('account'));
  logger.before(() => als.get('id'));
  logger.wrap(console);
  logger.add(config.logger);
}

if (config.logger) {
  initLogger();
}

localRequire('helpers/bluebird');
localRequire('helpers/joi');
localRequire('models');


localRequire('helpers/server')(config.port);
localRequire('tasks');

function gracefulExit() {
  console.info('the application will be restart');
  utils.checkToExit(3);
}
process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection:${err.message}, stack:${err.stack}`);
  gracefulExit();
});
process.on('uncaughtException', (err) => {
  console.error(`uncaughtException:${err.message}, stack:${err.stack}`);
  gracefulExit();
});

if (config.env !== 'development') {
  process.on('SIGTERM', gracefulExit);
  process.on('SIGQUIT', gracefulExit);
}

// set stringify mask
stringify.isSecret = key => key === 'password';
