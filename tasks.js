const _ = require('lodash');

const setting = require('./configs/setting');
const settingService = require('./services/setting');

async function updateSetting() {
  const result = await settingService.getAppSetting();
  _.forEach(result, (value, key) => setting.set(key, value));
}

setInterval(() => {
  updateSetting();
}, 60 * 1000);
updateSetting();
