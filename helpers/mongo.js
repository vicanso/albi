/**
 * 此模块做mongoose model的相关初始化操作
 * @module models
 */
const _ = require('lodash');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const path = require('path');
const requireTree = require('require-tree');

const configs = require('../configs');
const savePlugin = require('../plugins/mongo-save');
const statsPlugin = require('../plugins/mongo-stats');
const updatePlugin = require('../plugins/mongo-update');

const Schema = mongoose.Schema;
mongoose.Promise = bluebird;


/**
 * 初始化models，根据配置的model path，读取所有配置的model，初始化。
 * 并增加公共的统计hook函数
 * @param  {MongooseClient} client   mongoose实例化的client
 * @param  {[type]} modelPath model定义文件目录
 */
function initModels(client, modelPath) {
  const models = requireTree(modelPath);

  _.forEach(models, (model, key) => {
    const name = model.name || (key.charAt(0).toUpperCase() + key.substring(1));
    const schema = new Schema(model.schema, model.options);
    statsPlugin(schema, name);
    updatePlugin(schema);
    savePlugin(schema);
    if (model.indexes) {
      _.forEach(model.indexes, fields => schema.index(fields));
    }
    client.model(name, schema);
  });
}

/**
 * 根据mongodb连接串初始化Mongoose Connection
 * @param  {String} uri     mongodb连接串：mongodb://user:pass@localhost:port/database
 * @param  {Object} options mongoose中createConnection的options
 * @return {Connection}  Mongoose Connection
 */
function initClient(uri, options) {
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
  const maskUri = uri.replace(/\/\/\S+:\S+@/, '//***:***@');
  client.on('connected', () => {
    console.info(`${maskUri} connected`);
  });
  client.on('disconnected', () => {
    /* istanbul ignore next */
    console.alert(`${maskUri} disconnected`);
  });
  client.on('reconnected', _.debounce(() => {
    /* istanbul ignore next */
    console.info(`${maskUri} reconnected`);
  }, 3000));
  client.on('connecting', () => {
    /* istanbul ignore next */
    console.info(`${maskUri} connecting`);
  });
  client.on('error', err => console.alert(`${maskUri} error, %s`, err));
  initModels(client, path.join(__dirname, '../models'));
  return client;
}

const client = initClient(configs.mongoUri);


/**
 * 获取mongodb model
 * @param  {String} name collection的名称
 * @return {Model} mongoose model
 */
exports.get = name => client.model(name);

/**
 * Get the mongodb client
 */
exports.client = client;
