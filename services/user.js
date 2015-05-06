'use strict';
var _ = require('lodash');
var moment = require('moment');
var errors = require('../errors');
var mongodb = require('../helpers/mongodb');
var User = mongodb.model('User');
var debug = require('../helpers/debug');
exports.create = create;
exports.get = get;
exports.update = update;

/**
 * [create 创建用户]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function *create(data){
  debug('create user:%j', data);
  var date = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
  var account = data.account;
  data.createdAt = date;
  data.lastLoginedAt = date;
  data.name = account;
  var exists = yield User.findOne({account : account}).exec();
  if(exists){
    throw errors.get(201);
  }
  var result;
  try{
    result = yield function(done){
      debug('save data:%j', data);
      new User(data).save(done);
    };
  }catch(err){
    console.error(err);
    throw errors.get(202);
  }
  console.info('user:%s register success!', account);
  var doc = result[0];
  doc = doc.toJSON();
  delete doc._id;
  return doc;
}

/**
 * [get 获取用户]
 * @param  {[type]} conditions [description]
 * @return {[type]}            [description]
 */
function *get(conditions){
  var doc = yield function(done){
    User.findOne(conditions, done);
  };
  if(doc){
    debug('get user:%j', doc);
    doc = doc.toJSON();
    delete doc._id;
  }
  return doc;
}

/**
 * [update 更新信息]
 * @param  {[type]} conditions [description]
 * @param  {[type]} update     [description]
 * @return {[type]}            [description]
 */
function *update(conditions, update){
  var doc = yield User.findOneAndUpdate(conditions, update).exec();
  if(doc){
    doc = doc.toJSON();
    debug('update user data:%j', doc);
    delete doc._id;
  }
  return doc;
}