'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const config = localRequire('config');
const requireTree = require('require-tree');

const initModels = (client, modelPath) => {
  const models = requireTree('.');
  _.forEach(models, (model, key) => {
    const name = model.name || (key.charAt(0).toUpperCase() + key.substring(1));
    const schema = new Schema(model.schema, model.options);
    if (model.indexes) {
      _.forEach(model.indexes, options => schema.index(options));
    }
    client.model(name, schema);
  });
};

const initClient = (uri, options) => {
  if (!uri) {
    return null;
  }
  const opts = _.extend({
    db: {
      native_parser: true,
    },
    server: {
      poolSize: 5,
    },
  }, options);
  const client = mongoose.createConnection(uri, opts);
  client.on('connected', () => {
    console.info(`${uri} connected`);
  });
  client.on('disconnected', () => {
    console.error(`${uri} disconnected`);
  });
  client.on('reconnected', _.debounce(function() {
    console.error(`${uri} reconnected`);
  }, 3000));
  client.on('connecting', () => {
    console.error(`${uri} connecting`);
  });
  client.on('error', err => {
    console.error(`${uri} error, %s`, err);
  });
  initModels(client, __dirname);
  return client;
};

const client = initClient(config.mongoUri);

exports.get = (name) => {
  if (!client) {
    throw new Error('the db is not init!');
  }
  return client.model(name);
};

