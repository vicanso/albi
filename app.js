require('./helpers/local-require');

localRequire('helpers/bluebird');
localRequire('helpers/joi');
localRequire('models');

const utils = localRequire('helpers/utils');
const config = localRequire('config');

localRequire('helpers/server')(config.port);
localRequire('tasks');

process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection:${err.message}, stack:${err.stack}`);
  utils.checkToExit(3);
});
process.on('uncaughtException', (err) => {
  console.error(`uncaughtException:${err.message}, stack:${err.stack}`);
  utils.checkToExit(3);
});
