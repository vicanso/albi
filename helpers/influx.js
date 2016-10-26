const Influx = require('influxdb-nodejs');
const _ = require('lodash');

const config = localRequire('config');
const utils = localRequire('helpers/utils');
const debug = localRequire('helpers/debug');

const client = config.influx ? new Influx(config.influx) : null;

exports.client = client;

exports.write = (measurement, fields, ...args) => {
  /* istanbul ignore if */
  if (!client) {
    return null;
  }
  const reader = client.write(measurement)
    .field(fields);
  const tags = utils.getParam(args, _.isObject);
  /* istanbul ignore else */
  if (tags) {
    reader.tag(tags);
  }
  debug('influx measurement:%s, fields:%j, tags:%j', measurement, fields, tags);
  const syncNow = utils.getParam(args, _.isBoolean);
  if (!syncNow) {
    reader.queue();
  }
  return reader;
};
