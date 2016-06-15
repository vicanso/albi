'use strict';
const _ = require('lodash');
const Models = localRequire('models');
const errors = localRequire('helpers/errors');
const crypto = require('crypto');

const exists = (account) => {
  const User = Models.get('User');
  return User.findOne({account: account}).exec().then(doc => {
    if (!doc) {
      return false;
    }
    return true;
  });
};

exports.add = (data) => {
  const User = Models.get('User');
  return exists(data.account).then(exists => {
    if (exists) {
      throw errors.get('This ID has been used', 400);
    }
    const userData = _.clone(data);
    const date = (new Date()).toISOString();
    userData.createdAt = date;
    userData.lastLoginedAt = date;
    userData.loginCount = 1;
    return (new User(userData)).save().then(doc => {
      return doc.toJSON();
    });
  });
};

exports.get = (account, password, token) => {
  const User = Models.get('User');
  return User.findOne({
    account,
  }).then(doc => {
    const incorrectError = errors.get('ID/Password is incorrect', 400);
    if (!doc) {
      throw incorrectError;
    }
    const hash = crypto.createHash('sha256');
    if (hash.update(doc.password + token).digest('hex') !== password) {
      throw incorrectError;
    }
    doc.lastLoginedAt = (new Date()).toISOString();
    doc.loginCount++;
    const user = doc.toJSON();
    doc.save(err => {
      /* istanbul ignore if */
      if (err) {
        console.error(err);
      }
    });
    return user;
  });
};
