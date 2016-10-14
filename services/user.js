const crypto = require('crypto');
const _ = require('lodash');

const Models = localRequire('models');
const errors = localRequire('helpers/errors');

const isExists = (account) => {
  const User = Models.get('User');
  return User.findOne({
    account,
  }).exec().then(doc => !_.isNil(doc));
};

exports.add = (data) => {
  const User = Models.get('User');
  return isExists(data.account).then((exists) => {
    if (exists) {
      throw errors.get('This ID has been used', 400);
    }
    const userData = _.clone(data);
    const date = (new Date()).toISOString();
    userData.createdAt = date;
    userData.lastLoginedAt = date;
    userData.loginCount = 1;
    return (new User(userData)).save().then(doc => doc.toJSON());
  });
};

exports.get = (account, password, token) => {
  const User = Models.get('User');
  return User.findOne({
    account,
  }).then((doc) => {
    const incorrectError = errors.get('ID/Password is incorrect', 400);
    if (!doc) {
      throw incorrectError;
    }
    const hash = crypto.createHash('sha256');
    if (hash.update(doc.password + token).digest('hex') !== password) {
      throw incorrectError;
    }
    return doc.toJSON();
    /* eslint no-param-reassign: 0 */
    // doc.lastLoginedAt = (new Date()).toISOString();
    // doc.loginCount += 1;
    // const user = doc.toJSON();
    // doc.save(err => console.error(err));
    // return user;
  });
};

exports.update = (id, data) => {
  const User = Models.get('User');
  return User.findByIdAndUpdate(id, data).then((doc) => {
    console.dir(doc);
    return doc.toJSON();
  });
};

