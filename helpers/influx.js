const Influx = require('influxdb-nodejs');
const _ = require('lodash');

const config = localRequire('config');
const utils = localRequire('helpers/utils');
const debug = localRequire('helpers/debug');
const schemas = localRequire('influx-schemas');

const client = config.influx ? new Influx(config.influx) : null;
const maxQueueLength = 100;

function flush() {
  const count = client.writeQueueLength;
  client.syncWrite()
    .then(() => console.info(`influxdb write ${count} records sucess`))
    .catch(err => console.error(`influxdb write fail, ${err.message}`));
}

const debounceFlush = _.debounce(flush, 30 * 1000);
if (client) {
  _.forEach(schemas, (schema, measurement) => {
    client.schema(measurement, schema.fields, schema.options);
  });
}

exports.client = client;

exports.write = (measurement, fields, ...args) => {
  /* istanbul ignore if */
  if (!client) {
    debug('measurement:%s, fields:%j, args:%j', measurement, fields, args);
    return null;
  }
  if (client.writeQueueLength >= maxQueueLength) {
    flush();
  } else {
    debounceFlush();
  }
  const writer = client.write(measurement)
    .field(fields);
  const tags = utils.getParam(args, _.isObject);
  /* istanbul ignore else */
  if (tags) {
    writer.tag(tags);
  }
  debug('influx measurement:%s, fields:%j, tags:%j', measurement, fields, tags);
  const syncNow = utils.getParam(args, _.isBoolean);
  if (!syncNow) {
    writer.queue();
  }
  return writer;
};
