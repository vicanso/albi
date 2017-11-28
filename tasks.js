const settingService = require('./services/setting');

setInterval(async () => {
  try {
    await settingService.updateSettings();
  } catch (err) {
    console.error(`update settings fail, ${err.message}`);
  }
}, 60 * 1000);
