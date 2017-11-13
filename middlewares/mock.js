/**
 * 此模块主要用于测试中自定义接口数据
 */

const _ = require('lodash');

const mockService = require('../services/mock');
const configs = require('../configs');
const cacheService = require('../services/cache');
const utils = require('../helpers/utils');

let isStartUpdate = false;
let mockDict = {};

/**
 * 更新mock数据
 *
 */
async function updateMock() {
  const docs = await mockService.find({
    disabled: {
      $ne: true,
    },
  });
  const result = {};
  _.forEach(docs, (item) => {
    const url = item.url;
    if (!result[url]) {
      result[url] = [];
    }
    result[url].push(_.pick(item, ['status', 'response', 'account']));
  });
  _.forEach(result, (items, url) => {
    result[url] = _.sortBy(items, (item) => {
      const account = item.account;
      if (!account || account === '*') {
        return null;
      }
      return account;
    });
  });
  mockDict = result;
}

module.exports = () => {
  // 如果已启动了定时更新的任务，则不需要再启动
  if (!isStartUpdate) {
    setInterval(updateMock, 30 * 1000).unref();
    updateMock();
    isStartUpdate = true;
  }
  return async function mockMiddleware(ctx, next) {
    // eslint-disable-next-line
    const urlInfo = ctx.req._parsedUrl
    const mocks = mockDict[urlInfo.pathname];
    if (!mocks) {
      return next();
    }
    let mock = null;
    const lastMock = _.last(mocks);
    // 由于已根据是否配置账号排序
    // 如果最后一个mock没有定义账号，设置为默认
    if (!lastMock.account || lastMock.account === '*') {
      mock = lastMock;
    }
    let hasMockAccount = false;
    _.forEach(mocks, (item) => {
      if (item.account) {
        hasMockAccount = true;
      }
    });
    // 如果有定义账号信息，则从session中取信息匹配
    if (hasMockAccount) {
      // 如果定义了账号信息，表示该mock是需要获取 user/session
      if (!utils.isNoCache(ctx)) {
        return next();
      }
      const key = ctx.cookies.get(configs.session.key);
      const userInfo = await cacheService.getSession(key);
      const currentAccount = _.get(userInfo, 'user.account');
      const found = _.find(mocks, item => item.account === currentAccount);
      if (found) {
        mock = found;
      }
    }
    if (!mock) {
      return next();
    }

    // 返回配置的mock信息
    ctx.status = mock.status || 500;
    ctx.body = mock.response;
    return Promise.resolve();
  };
};
