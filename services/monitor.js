/**
 * 各监控配置
 */

const genService = require('./gen');

Object.assign(exports, genService('Monitor'));

const {
  add,
} = exports;

/**
 * 增加influxdb server配置
 *
 * @param {String} name
 * @param {String} host
 * @param {Number} [port=8086]
 * @param {String} [protocol='http']
 */
exports.addInfluxdbServer = async function addInfluxdbServer(name, host, port = 8086, protocol = 'http') {
  const doc = await add({
    category: 'influxdb-server',
    name,
    data: {
      host,
      port,
      protocol,
    },
  });
  return doc;
};

/**
 * 增加influxdb warner配置
 *
 * @param {String} name
 * @param {String} measurement
 * @param {String} yml
 */
exports.addInfluxdbWarner = async function addInfluxdbWarner(name, measurement, yml) {
  const doc = await add({
    category: 'influxdb-warner',
    name,
    data: {
      measurement,
      yml,
    },
  });
  return doc;
};

/**
 * 增加http checker配置
 *
 * @param {String} name
 * @param {String} url
 */
exports.addHTTPChecker = async function addHTTPChecker(name, url) {
  const doc = await add({
    category: 'http-checker',
    name,
    data: {
      url,
    },
  });
  return doc;
};
