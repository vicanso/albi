require('./init');

const configs = localRequire('configs');
const globals = localRequire('helpers/globals');
const mongodb = localRequire('helpers/mongodb');
const setting = localRequire('configs/setting');

function gracefulExit() {
  console.info('the application will be restart');
  globals.pause();
}

async function updateApplicationSetting() {
  const Application = mongodb.get('Application');
  const doc = await Application.findOne({
    category: 'setting',
  });
  if (doc) {
    setting.reset(doc.toJSON());
  }
}

process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection:${err.message}, stack:${err.stack}`);
  gracefulExit();
});
process.on('uncaughtException', (err) => {
  console.error(`uncaughtException:${err.message}, stack:${err.stack}`);
  gracefulExit();
});

if (configs.env !== 'development') {
  process.on('SIGTERM', gracefulExit);
  process.on('SIGQUIT', gracefulExit);
}

setInterval(() => {
  updateApplicationSetting();
}, 60 * 1000);
updateApplicationSetting();
