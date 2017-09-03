/**
 * 此模块主要是用于模拟一些错误返回
 * @module controllers/mock
 */

const Joi = require('joi');

const mockService = require('../services/mock');

const validateSchema = {
  account: Joi.string().max(100),
  url: Joi.string().max(200),
  status: Joi.number().integer(),
  response: Joi.object(),
  description: Joi.string(),
  disabled: Joi.boolean(),
};

/**
 * 增加一个mock配置
 *
 * @param {Method} GET
 * @prop {Middleware} admin
 * @prop {Route} /mocks
 * @example curl -XPOST -d '{
 *  "url": "/users/me",
 *  "account": "vicanso",
 *  "status": 400,
 *  "response": {
 *    "a": 1
 *  }
 * }' 'http://127.0.0.1:5018/mocks'
 * @return {Body} 201 {
 *  "url": "/users/me",
 *  "response": {
 *    "message": "abc"
 *  },
 *  "status": 400
 * }
 */
exports.add = async function add(ctx) {
  const data = Joi.validate(ctx.request.body, validateSchema);
  data.creator = ctx.session.user.account;
  const doc = await mockService.add(data);
  ctx.status = 201;
  ctx.body = doc;
};


/**
 * 获取mock配置
 *
 * @param {Method} GET
 * @prop {Middleware} admin
 * @prop {Route} /mocks/:id
 * @example curl -XGET 'http://127.0.0.1:5018/mocks/598c16338d7c3f7b3579abcf'
 * @return {Body} {
 *  "url": "/users/me",
 *  "response": {
 *    "message": "abc"
 *  },
 *  "status": 400
 * }
 */
exports.get = async function get(ctx) {
  const id = Joi.attempt(ctx.params.id, Joi.objectId());
  const doc = await mockService.findById(id);
  ctx.setCache('5s');
  ctx.body = doc;
};

/**
 * 列出所有的mock配置
 *
 * @param {Method} GET
 * @prop {Middleware} admin
 * @prop {Middleware} noQuery
 * @prop {Route} /mocks
 * @example curl -XGET 'http://127.0.0.1:5018/mocks'
 * @return {Body} {items: []}
 */
exports.list = async function list(ctx) {
  const mocks = await mockService.find({});
  ctx.setCache('5s');
  ctx.body = {
    items: mocks,
  };
};

/**
 * 更新mock配置
 *
 * @param {Method} PATCH
 * @param {ObjectId} params.id
 * @prop {Middleware} admin
 * @prop {Route} /mocks/:id
 * @example curl -XPATCH -d '{
 *  "account": "abcd",
 * }' 'http://127.0.0.1:5018/mocks/59885ddb83d2ec0979c9e637'
 * @return {Body} 204
 */
exports.update = async function update(ctx) {
  const data = Joi.validate(ctx.request.body, validateSchema);
  const id = Joi.attempt(ctx.params.id, Joi.objectId());
  await mockService.findByIdAndUpdate(id, data);
  ctx.body = null;
};
