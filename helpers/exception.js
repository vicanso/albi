'use strict';
process.on('unhandledRejection', err => {
  console.error(`unhandledRejection:${err.message}, stack:${err.stack}`);
});
process.on('uncaughtException', err => {
  // TODO should safe exit
  console.error(`uncaughtException:${err.message}, stack:${err.stack}`);
});
