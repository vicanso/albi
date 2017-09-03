/**
 * 此模块主要是系统相关配置
 */

const Joi = require('joi');

const settingService = require('../services/setting');


/**
 * 增加一个系统配置
 *
 * @param {Method} POST
 * @param {String} body.category 该配置的类别（由于此数据可以保存不同的通用数据，因此其它字段不校验）
 * @prop {Middleware} admin
 * @prop {Route} /settings
 * @example curl -XPOST -d '{
 *  "category": "app",
 *  "data": {
 *    "level": 100
 *  }
 * }' 'http://127.0.0.1:5018/settings'
 * @return {Body} {
 *  "category": String,
 *  "level": Number,
 *  "_id": ObjectId,
 * }
 */
exports.add = async function add(ctx) {
  const data = Joi.validate(ctx.request.body, {
    category: Joi.string().max(30).required(),
    data: Joi.object(),
  });
  data.creator = ctx.session.user.account;
  const doc = await settingService.add(data);
  ctx.status = 201;
  ctx.body = doc;
};

/**
 * 列出所有配置
 *
 * @param {Method} GET
 * @prop {Middleware} admin
 * @prop {Route} /settings
 * @example curl -XGET 'http://127.0.0.1:5018/settings'
 * @return {Body} {items: [Setting]}
 */
exports.list = async function list(ctx) {
  const items = await settingService.find({});
  ctx.body = {
    items,
  };
};


/**
 * 获取配置
 *
 * @param {Method} GET
 * @param {ObjectId} params.id
 * @prop {Middleware} admin
 * @prop {Route} /settings/:id
 * @example curl -XGET 'http://127.0.0.1:5018/settings/598b04313bde090748f7a01e'
 * @return {Body} {
 *  "category": String,
 *  "level": Number,
 *  "_id": ObjectId,
 * }
 */
exports.get = async function get(ctx) {
  const id = Joi.attempt(ctx.params.id, Joi.objectId());
  const doc = await settingService.findById(id);
  ctx.body = doc;
};


/**
 * 更新配置信息
 *
 * @param {Method} PATCH
 * @param {Object} params.id
 * @prop {Middleware} admin
 * @prop {Route} /settings/:id
 * @example curl -XPATCH -d '{
 *  "data": {
 *    "category": "test"
 *  }
 * }' 'http://127.0.0.1:5018/settings/'
 * @return {Body} 204
 */
exports.update = async function update(ctx) {
  const id = Joi.attempt(ctx.params.id, Joi.objectId());
  await settingService.findByIdAndUpdate(id, ctx.request.body);
  ctx.body = null;
};
