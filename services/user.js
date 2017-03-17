/**
 * 与用户相关的各类实现，主要实现对数据库操作或者对其它服务的调用，
 * 一般的调用流程都是controller --> service --> 其它服务，
 * 在此模块中，对于传入参数都是认为符合条件的，由conroller中对参数校验
 * @module services/user
 */
const crypto = require('crypto');
const _ = require('lodash');

const Models = localRequire('models');
const errors = localRequire('helpers/errors');

/**
 * 检测当前条件的用户是否已存在
 * @param  {Object}  condition 查询条件
 * @return {Promise(Boolean)}
 */
const isExists = (condition) => {
  const User = Models.get('User');
  return User.findOne(condition).exec().then(doc => !_.isNil(doc));
};

/**
 * 增加用户，如果成功，返回Promise对象
 * @param {Object} data 用户相关信息
 * @return {Promise(User)}
 */
exports.add = (data) => {
  const User = Models.get('User');
  return isExists({
    account: data.account,
  }).then((exists) => {
    if (exists) {
      throw errors.get(104);
    }
    return isExists({
      email: data.email,
    });
  }).then((exists) => {
    if (exists) {
      throw errors.get(105);
    }
    const userData = _.clone(data);
    const date = new Date().toISOString();
    userData.lastLoginedAt = date;
    userData.loginCount = 1;
    return (new User(userData)).save().then(doc => doc.toJSON());
  });
};

/**
 * 获取用户信息
 * @param  {String} account  用户账号
 * @param  {String} password 用户密码串（经过加token加密）
 * @param  {String} token    用户登录时生成的随机token
 * @return {Promise(User)}
 */
exports.get = (account, password, token) => {
  const User = Models.get('User');
  return User.findOne({
    account,
  }).then((doc) => {
    const incorrectError = errors.get(106);
    if (!doc) {
      throw incorrectError;
    }
    const hash = crypto.createHash('sha256');
    if (hash.update(doc.password + token).digest('hex') !== password) {
      throw incorrectError;
    }
    return doc.toJSON();
  });
};

/**
 * 更新用户信息
 * @param  {String} id   mongodb object id
 * @param  {Object} data 需要更新的用户信息
 * @return {Promise(User)}
 */
exports.update = (id, data) => {
  const User = Models.get('User');
  return User.findOneAndUpdate({ _id: id }, data).then(doc => doc.toJSON());
};

/**
 * 添加用户登录日志到数据库，主要是在请求日志中，不再输出User-Agent
 * 等信息了，因为如果是登录用户，User-Agent这些只记录一次就会，不会变化，
 * 在日志中记录用户的token，通过从登录记录中查到token再确认是哪个账号，
 * 也为了避免日志输出敏感数据
 */
exports.addLoginRecord = (data) => {
  const Login = Models.get('Login');
  /* eslint no-param-reassign:0 */
  data.createdAt = (new Date()).toISOString();
  return (new Login(data)).save().catch((err) => {
    console.error(`add login record fail, account:${data.account} err:${err.message}`);
  });
};
