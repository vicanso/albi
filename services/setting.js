/**
 * 系统应用配置
 */

const _ = require('lodash');
const {
  URL,
} = require('url');

const genService = require('./gen');

Object.assign(exports, genService('Setting'));

const {
  find,
} = exports;

let applicationSetting = null;

/**
 * Get the value of applcation setting
 */
exports.get = key => _.get(applicationSetting, key);

/**
 * 更新应用配置信息
 *
 */
exports.updateSettings = async function updateSettings() {
  const docs = await find({
    disabled: false,
  });
  applicationSetting = {};
  _.forEach(docs, (item) => {
    applicationSetting[item.name] = item.data;
  });
};

/**
 * 获取Captcha server列表
 *
 * @returns {Array} [{
 *  "host": "127.0.0.1",
 *  "port": 3000
 * }]
 */
exports.getCaptchaServers = async function getCaptchaServers() {
  const docs = await find({
    category: 'captchaServer',
  });
  return _.compact(_.map(docs, (item) => {
    const url = _.get(item, 'data.url');
    if (!url) {
      return null;
    }
    const urlInfo = new URL(url);
    return _.pick(urlInfo, ['host', 'port']);
  }));
};
