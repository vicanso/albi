require('./helpers/local-require');

localRequire('helpers/bluebird');
localRequire('helpers/joi');
localRequire('models');

const utils = localRequire('helpers/utils');
const config = localRequire('config');

localRequire('helpers/server')(config.port);
localRequire('tasks');

function gracefulExit() {
  console.info('the application will be restart by SIGINT');
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
  process.on('SIGINT', gracefulExit);
  process.on('SIGQUIT', gracefulExit);
}
