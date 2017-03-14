/**
 * 此模块定义influxdb的schme，对于写入influxdb的数据，
 * 虽然influxdb会根据第一次写入的字段决定数据类型，
 * 不过使用的时候，最好还是把schme先定义好
 * @see {@link https://github.com/vicanso/influxdb-nodejs}
 * @module helpers/utils
 */

const schemas = {
  mongoose: {
    fields: {
      use: 'integer',
      id: 'string',
    },
    options: {
      stripUnknown: true,
    },
  },
  deprecate: {
    fields: {
      path: 'string',
    },
    options: {
      stripUnknown: true,
    },
  },
  httpRoute: {
    fields: {
      use: 'integer',
    },
    options: {
      stripUnknown: true,
    },
  },
  excetion: {
    fields: {
      code: 'integer',
      path: 'string',
      message: 'string',
    },
    options: {
      stripUnknown: true,
    },
  },
  http: {
    fields: {
      connecting: 'integer',
      total: 'integer',
      use: 'integer',
      bytes: 'integer',
      code: 'integer',
      ip: 'string',
    },
    options: {
      stripUnknown: true,
    },
  },
  userTracker: {
    fields: {
      use: 'integer',
    },
  },
  performance: {
    fields: {
      lag: 'integer',
      physical: 'integer',
      exec: 'integer',
      connectingTotal: 'integer',
    },
    options: {
      stripUnknown: true,
    },
  },
  session: {
    fields: {
      account: 'string',
      use: 'interger',
    },
    options: {
      stripUnknown: true,
    },
  },
};

module.exports = schemas;
