/**
 * 此模块主要是监控相关
 * @module controllers/monitor
 */

const Joi = require('joi');
const _ = require('lodash');

const monitorService = require('../services/monitor');

const validateSchema = {
  category: Joi.string().trim().max(16),
  name: Joi.string().trim().max(16),
  data: Joi.object(),
};

/**
 * 获取monitor配置
 *
 * @param {Method} GET
 * @param {String} [query.category] 配置类别
 * @prop {Route} /monitors
 * @example curl -XGET 'http://127.0.0.1:5018/monitors'
 * @return {Body} {
 *  items: [
 *    {
 *      name: "login",
 *      category: "influxdb-warner",
 *      data: {}
 *    }
 *  ]
 * }
 */
exports.get = async function get(ctx) {
  const {
    category,
  } = Joi.validate(ctx.query, _.pick(validateSchema, ['category']));
  const conditions = {};
  if (category) {
    conditions.category = category;
  }
  const items = await monitorService.find(conditions);
  ctx.setCache('10s');
  ctx.body = {
    items,
  };
};

/**
 * 更新monitor配置
 *
 * @param {Method} PATCH
 * @param {ObjectId} params.id 配置在数据库中的ID
 * @param {String} [body.name] 配置名称
 * @param {String} [body.category] 配置类别
 * @param {Object} [body.data] 配置数据
 * @prop {Middleware} admin
 * @prop {Route} /monitors/:id
 * @example curl -XPATCH -d '{
 *  "name": "test"
 * }' 'http://127.0.0.1:5018/monitors/599412de7fe81a9bc2ec23ab'
 * @return {Body} 204
 */
exports.update = async function update(ctx) {
  const id = Joi.attempt(ctx.params.id, Joi.objectId());
  const data = Joi.validate(ctx.request.body, validateSchema);
  await monitorService.findByIdAndUpdate(id, data);
  ctx.body = null;
};


/**
 * 增加monitor配置
 *
 * @param {Method} POST
 * @param {String} [body.name] 配置名称
 * @param {String} [body.category] 配置类别
 * @param {Object} [body.data] 配置数据
 * @prop {Middleware} admin
 * @prop {Route} /monitors
 * @example curl -XPOST -d '{"category":"http-checker",
 * "name":"captcha-server",
 * "data":{ "url": "http://127.0.0.1:3001/ping"}
 * } 'http://127.0.0.1:5018/monitors'
 * @return {Body} 201
 */
exports.add = async function add(ctx) {
  const data = Joi.validate(ctx.request.body);
  data.creator = ctx.session.user.account;
  const doc = await monitorService.add(data);
  ctx.status = 201;
  ctx.body = doc;
};
