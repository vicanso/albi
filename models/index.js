const mongoose = require('mongoose');
const _ = require('lodash');
const requireTree = require('require-tree');

const config = localRequire('config');
const hooks = localRequire('helpers/hooks');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const initModels = (client, modelPath) => {
  const models = requireTree(modelPath);
  _.forEach(models, (model, key) => {
    const name = model.name || (key.charAt(0).toUpperCase() + key.substring(1));
    const schema = new Schema(model.schema, model.options);
    if (model.indexes) {
      _.forEach(model.indexes, options => schema.index(options));
    }
    _.forEach(model.static, (fn, k) => schema.static(k, fn));
    _.forEach(['pre', 'post'], (type) => {
      _.forEach(model[type], (fns, k) => {
        _.forEach(fns, fn => schema[type](k, fn));
      });
    });

    // add static hook functions
    const statisticsHooks = hooks.getStatisticsHooks(name);
    _.forEach(statisticsHooks, (hooksInfos, hookName) => {
      const {
        pre,
        post,
      } = hooksInfos;
      if (_.isFunction(pre)) {
        // pre hook
        schema.pre(hookName, pre);
      }
      if (_.isFunction(post)) {
        // post hook
        schema.post(hookName, post);
      }
    });

    client.model(name, schema);
  });
};

const initClient = (uri, options) => {
  /* istanbul ignore if */
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
    /* istanbul ignore next */
    console.error(`${uri} disconnected`);
  });
  client.on('reconnected', _.debounce(() => {
    /* istanbul ignore next */
    console.error(`${uri} reconnected`);
  }, 3000));
  client.on('connecting', () => {
    /* istanbul ignore next */
    console.error(`${uri} connecting`);
  });
  client.on('error', err => console.error(`${uri} error, %s`, err));
  initModels(client, __dirname);
  return client;
};

const client = initClient(config.mongoUri);

exports.get = (name) => {
  /* istanbul ignore if */
  if (!client) {
    throw new Error('the db is not init!');
  }
  return client.model(name);
};

