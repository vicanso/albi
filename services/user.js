'use strict';
const mongodb = require('../helpers/mongodb');
const moment = require('moment');
const errors = require('../errors');
const debug = require('../helpers/debug');
const _ = require('lodash');
exports.create = create;
exports.get = get;
/**
 * [create 创建用户]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function *create(data) {
  let keys = ['account', 'password', 'name'];
  if (!data || !data.account || !data.password || !data.name) {
    throw errors.get(11, {
      params : keys
    });
  }
  data = _.pick(data, keys);
  debug('create user:%j', data);
  data.createdAt = moment().format();
  data.lastLoginedAt = data.createdAt;
  let User = mongodb.model('User');
  let account = data.account;
  let exists = yield User.findOne({account : account});
  let result;
  try {
    result = yield new User(data).save();
  } catch (e) {
    if (e.code === 11000) {
      console.info('duplicate key, create user fail, account:%s, name:%s', data.account, data.name);
      throw errors.get(201);
    } else {
      throw e;
    }
  }
  return result.toObject();
}


/**
 * [get description]
 * @param  {[type]} conditions [description]
 * @return {[type]}            [description]
 */
function *get(conditions) {
  let keys = ['account', 'password'];
  if (!conditions || !conditions.account || !conditions.password) {
    throw errors.get(11, {
      params : keys
    });
  }
  conditions = _.get(conditions, keys);
  debug('get user by conditions:%j', conditions);
  let User = mongodb.model('User');
  let doc = yield User.findOne(conditions);
  if (doc) {
    doc = doc.toObject();
    debug('get user:%j', doc);
  }
  return doc;
}
