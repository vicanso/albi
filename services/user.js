'use strict';
const mongodb = require('../helpers/mongodb');
const moment = require('moment');
exports.create = create;


function *create(data) {
  if (!data || !data.account || !data.password || !data.name) {
    throw new Error('account, password and name can not be null');
  }
  data.createdAt = moment().format();
  data.lastLoginedAt = data.createdAt;
  let account = data.account;
  let User = mongodb.model('User');
  let exists = yield User.findOne({account : account});
  let result;
  try {
    result = yield new User(data).save();
  } catch (e) {
    console.dir(e.message);
    console.dir(e.code);
    console.error(e);
  } finally {

  }

  // console.dir(result.toObject());

}
