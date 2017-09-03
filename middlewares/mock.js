/**
 * 此模块主要用于测试中自定义接口数据
 */

const _ = require('lodash');
const { URL } = require('url');

const mockService = require('../services/mock');
const configs = require('../configs');
const cacheService = require('../services/cache');

let isStartUpdate = false;
let mockDict = {};

/**
 * 更新mock数据
 *
 */
async function updateMock() {
  const docs = await mockService.find({});
  const result = {};
  _.forEach(docs, (item) => {
    result[item.url] = _.pick(item, ['status', 'response', 'account']);
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
    const urlInfo = new URL(ctx.url, 'http://127.0.0.1');
    const mock = mockDict[urlInfo.pathname];
    if (!mock) {
      return next();
    }
    // 如果有定义账号信息，则从session中取信息匹配
    if (mock.account) {
      const key = ctx.cookies.get(configs.session.key);
      const userInfo = await cacheService.getSession(key);
      if (mock.account !== _.get(userInfo, 'user.account')) {
        return next();
      }
    }
    // 返回配置的mock信息
    ctx.status = mock.status || 500;
    ctx.body = mock.response;
    return Promise.resolve();
  };
};
