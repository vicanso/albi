/**
 * 此模块定时将系统性能指标写入到influxdb中
 * @module schedules/performance
 */

const performance = require('performance-nodejs');
const _ = require('lodash');

const globals = localRequire('helpers/globals');
const influx = localRequire('helpers/influx');

/**
 * 创建定时收集应用程序相关性能指标的timer
 * @param  {Integer} interval 定时间隔，单位ms
 * @return {Timer}
 */
module.exports = (interval) => {
  performance.camelCase = true;
  performance.flatten = true;
  return performance((data) => {
    /* eslint no-param-reassign:0 */
    data.connectingCount = globals.getConnectingCount();
    const memoryList = [100, 200, 500];
    const cpuList = [20, 50];
    const connectingList = [200, 500, 1000];
    const memoryIndex = _.sortedIndex(memoryList, data.memoryUsageRss);
    const cpuIndex = _.sortedIndex(cpuList, data.cpuUsageUsedPercent);
    const connectingIndex = _.sortedIndex(connectingList, data.connectingCount);

    const tags = {
      memory: ['low', 'mid', 'high', 'higher'][memoryIndex],
      cpu: ['free', 'normal', 'busy'][cpuIndex],
      connecting: ['fewer', 'few', 'medium', 'many'][connectingIndex],
    };

    influx.write('performance', data, tags);
  }, interval, 'MB');
};
