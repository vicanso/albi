/**
 * 此模块定义influxdb的schme，在`helpers/influx`中会使用定义的schema来初始化。
 * 对于写入influxdb的数据，虽然influxdb会根据第一次写入的字段决定数据类型，
 * 不过使用的时候，最好还是把schme先定义好
 * @module influx-schemas
 * @see {@link https://github.com/vicanso/influxdb-nodejs}
 * @example
 * const schmeas = require('./influx-schemas');
 * // {"mongoose": {"fields": ...} ...}
 * console.info(schemas);
 */

const schemas = {
  performance: {
    fields: {
      heapTotalHeapSize: 'i',
      memoryUsageRss: 'i',
      memoryUsageHeapTotal: 'i',
      cpuUsageUsedPercent: 'i',
      cpuUsageUserUsedPercent: 'i',
      cpuUsageSystemUsedPercent: 'i',
      connectingCount: 'i',
      heapSpaceNewSpaceUsedSize: 'i',
      heapSpaceOldSpaceUsedSize: 'i',
      heapSpaceCodeSpaceUsedSize: 'i',
      heapSpaceMapSpaceUsedSize: 'i',
      heapSpaceLargeObjectSpaceUsedSize: 'i',
    },
    tags: {
      memory: ['low', 'mid', 'high', 'higher'],
      cpu: ['free', 'normal', 'busy'],
      connecting: ['fewer', 'few', 'medium', 'many'],
    },
    options: {
      stripUnknown: true,
    },
  },
  deprecate: {
    fields: {
      path: 's',
    },
    options: {
      stripUnknown: true,
    },
  },
  httpRoute: {
    fields: {
      use: 'i',
    },
    tags: {
      method: 'GET POST PUT DELETE',
      path: '*',
      spdy: '012345'.split(''),
    },
    options: {
      stripUnknown: true,
    },
  },
  exception: {
    fields: {
      code: 'i',
      path: 's',
      message: 's',
    },
    tags: {
      type: 'EU'.split(''),
    },
    options: {
      stripUnknown: true,
    },
  },
  http: {
    fields: {
      connecting: 'i',
      total: 'i',
      use: 'i',
      bytes: 'i',
      code: 'i',
      ip: 's',
      url: 's',
      request: 'i',
    },
    // 根据koa-http-stats配置的指定
    tags: {
      status: '12345'.split(''),
      spdy: '012345'.split(''),
      size: '012345'.split(''),
      busy: '01234'.split(''),
      method: '*',
    },
    options: {
      stripUnknown: true,
    },
  },
  session: {
    fields: {
      account: 's',
      use: 'i',
    },
    tags: {
      spdy: '012345'.split(''),
    },
    options: {
      stripUnknown: true,
    },
  },
};

module.exports = schemas;
