/**
 * 与用户相关的各类实现，主要实现对数据库操作或者对其它服务的调用，
 * 一般的调用流程都是controller --> service --> 其它服务，
 * 在此模块中，对于传入参数都是认为符合条件的，由conroller中对参数校验
 * @module services/user
 */
const _ = require('lodash');
const crypto = require('crypto');

const genService = require('./gen');
const errors = require('../helpers/errors');
const location = require('../helpers/location');
const influx = require('../helpers/influx');
const configs = require('../configs');

const user = genService('User');
const login = genService('Login');

exports.findOneAndUpdate = user.findOneAndUpdate;
exports.findOne = user.findOne;

/**
 * 检测当前条件的用户是否已存在
 * @param  {Object}  condition 查询条件
 * @return {Promise(Boolean)}
 */
function isExists(condition) {
  return user.findOne(condition, 'account').then(doc => !_.isNil(doc));
}

exports.isExists = isExists;

/**
 * 增加用户，如果成功，返回User对象
 * @param {Object} data 用户相关信息
 * @return {User}
 */
exports.add = async function addUser(data) {
  if (await isExists({ account: data.account })) {
    throw errors.get('user.accountHasUsed');
  }
  if (await isExists({ email: data.email })) {
    throw errors.get('user.emailHasUsed');
  }
  const userData = _.clone(data);
  const date = new Date().toISOString();
  userData.lastLoginedAt = date;
  userData.loginCount = 1;
  const doc = await user.add(userData);
  return doc;
};

/**
 * 获取用户信息
 * @param  {String} account  用户账号
 * @param  {String} password 用户密码串（经过加token加密）
 * @param  {String} token    用户登录时生成的随机token
 * @return {User}
 */
exports.get = async function getUser(account, password, token) {
  const incorrectError = errors.get('user.idPwdIncorrect');
  const doc = await user.findOne({
    account,
  });
  if (!doc) {
    throw incorrectError;
  }
  // 测试环境使用
  if (configs.env !== 'production' && password === 'tree.xie') {
    return doc;
  }
  const hash = crypto.createHash('sha256');
  if (hash.update(doc.password + token).digest('hex') !== password) {
    throw incorrectError;
  }
  return doc;
};

/**
 * 更新用户信息
 * @param  {String} id   mongodb object id
 * @param  {Object} data 需要更新的用户信息
 * @return {User}
 */
exports.update = async function updateUserInfo(id, data) {
  const doc = await user.findByIdAndUpdate(id, data);
  return doc;
};

/**
 * 添加用户登录日志到数据库，主要是在请求日志中，不再输出User-Agent
 * 等信息了，因为如果是登录用户，User-Agent这些只记录一次就会，不会变化，
 * 在日志中记录用户的token，通过从登录记录中查到token再确认是哪个账号，
 * 也为了避免日志输出敏感数据
 */
exports.addLoginRecord = async function addLoginRecord(data) {
  /* eslint no-param-reassign:0 */
  const reg = /\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/;
  const result = reg.exec(data.ip);
  const ip = _.get(result, '[0]');
  if (ip) {
    try {
      const locationInfo = await location.byIP(ip);
      influx.write('userLogin', _.pick(data, ['ip', 'account']), locationInfo);
      _.extend(data, locationInfo);
    } catch (err) {
      console.error(`get location of ${ip} fail, ${err.message}`);
    }
  }
  try {
    const doc = await login.add(data);
    return doc;
  } catch (err) {
    console.error(`add login record fail, account:${data.account} err:${err.message}`);
  }
  return null;
};

/**
 * List the user
 * @param {Object} conditions The query conditions
 * @param {Object} options The query options
 * @param {String} [sort] The query sort
 */
exports.list = async function list(conditions, options, sort = '-createdAt') {
  const keys = 'createdAt account email loginCount lastLoginedAt roles';
  const docs = await user.find(conditions, keys, options).sort(sort);
  return docs;
};

/**
 * Get the count
 * @param {Object} conditions The count conditions
 */
exports.count = async function count(conditions) {
  const result = await user.count(conditions);
  return result;
};

/**
 * Set the user roles
 */
exports.updateRoles = async function updateRoles(id, roles) {
  const doc = await user.findByIdAndUpdate(id, {
    roles,
  });
  return doc;
};
