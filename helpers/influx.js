'use strict';
const Influx = require('influxdb-nodejs');
const config = localRequire('config');
const utils = localRequire('helpers/utils');
const _ = require('lodash');

const getClient = url => {
  const client = new Influx(url);
  client.createDatabaseNotExists().then(() => {
    console.info('create influxdb database success');
  }).catch(err => {
    /* istanbul ignore next */
    console.error(`create influxdb database fail, err:${err.message}`);
  });
  return client;
};
const client = config.influx ? getClient(config.influx) : null;

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
  const syncNow = utils.getParam(args, _.isBoolean);
  if (syncNow) {
    reader.then();
  } else {
    reader.queue();
  }
  return reader;
};
