/**
 * 此模块主要是多语言相关
 * @module controllers/i18n
 */

const Joi = require('joi');
const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const path = require('path');

const i18nService = require('../services/i18n');
const debug = require('../helpers/debug');

const readFile = util.promisify(fs.readFile);

const validateSchema = {
  name: Joi.string().max(100),
  category: Joi.string().max(20),
  en: Joi.string().max(100),
  zh: Joi.string().max(50),
};


/**
 * 增加i18n配置
 * @param {Method} POST
 * @param {String} body.name 配置名字
 * @param {String} [body.category] 配置分类
 * @param {String} [body.en] 配置英文描述
 * @param {String} [body.zh] 配置中文描述
 * @prop {Middleware} admin
 * @prop {Route} /i18ns
 * @example curl -XPOST -d '{
 *  "name": "home",
 *  "category": "basic",
 *  "en": "home",
 *  "zh": "首页"
 * }' 'http://127.0.0.1:5018/i18ns'
 * @return {Body} 201 {
 *  "name": String,
 *  "category": String,
 *  "en": String,
 *  "zh": String,
 * }
 */
exports.add = async function add(ctx) {
  const data = Joi.validate(ctx.request.body, validateSchema);
  data.creator = ctx.session.user.account;
  const doc = await i18nService.add(data);
  ctx.status = 201;
  ctx.body = doc;
};

/**
 * 获取i18n配置列表
 *
 * @param {Method} GET
 * @param {String|Array} [query.category] 是否指定返回类型下的所有字段
 * @prop {Route} /i18ns
 * @example curl -XGET 'http://127.0.0.1:5018/i18ns'
 * @return {Body} {items: [I18n]}
 */
exports.list = async function list(ctx) {
  const {
    category,
    count,
  } = Joi.validate(ctx.query, {
    category: Joi.alternatives().try(
      validateSchema.category,
      Joi.array().items(validateSchema.category),
    ),
    count: Joi.boolean(),
  });
  let cats = category;
  const conditions = {};
  if (cats) {
    if (!_.isArray(cats)) {
      cats = [cats];
    }
    conditions.category = cats;
  }
  const items = await i18nService.find(conditions);
  const result = {
    items,
  };
  if (count) {
    result.count = await i18nService.count(conditions);
  }
  ctx.setCache('5s');
  debug('list i18n conditions:%j, result:%j', conditions, result);
  ctx.body = result;
};

/**
 * 获取i18n的分类
 * @param {Method} GET
 * @prop {Middleware} noQuery
 * @prop {Route} /i18ns/categories
 * @example curl -XGET 'http://127.0.0.1:5018/i18ns/categories'
 * @return {Body} {items: []}
 */
exports.listCategory = async function listCategory(ctx) {
  const items = await i18nService.find({}).select('category');
  const categories = [];
  _.forEach(items, (item) => {
    if (!_.includes(categories, item.category)) {
      categories.push(item.category);
    }
  });
  ctx.setCache('5m');
  ctx.body = {
    items: categories,
  };
};

/**
 * 根据选择语言返回对应的语言配置
 *
 * @param {Method} GET
 * @param {String|Array} [query.category] 指定返回类型下的所有字段
 * @prop {Route} /i18ns
 * @example curl -XGET 'http://127.0.0.1:5018/i18ns'
 * @return {Body} {}
 */
exports.selectByLang = async function selectByLang(ctx) {
  const {
    category,
  } = Joi.validate(ctx.query, {
    category: Joi.alternatives().try(
      validateSchema.category,
      Joi.array().items(validateSchema.category),
    ).required(),
  });
  let cats = category;
  const lang = ctx.state.lang;
  const conditions = {};
  if (!_.isArray(cats)) {
    cats = [cats];
  }
  conditions.category = cats;
  const items = await i18nService.find(conditions);
  const result = {};
  _.forEach(items, (item) => {
    const cat = item.category;
    if (!result[cat]) {
      result[cat] = {};
    }
    result[cat][item.name] = item[lang];
  });
  debug('select langs of %s, result:%j', category, result);
  ctx.setCache('10m', '1m');
  ctx.body = result;
};


/**
 * 更新i18n的配置
 *
 * @param {Method} PATCH
 * @param {ObjectId} params.id 配置在数据库中的ID
 * @param {String} [body.name] 配置名字
 * @param {String} [body.category] 配置分类
 * @param {String} [body.en] 配置英文描述
 * @param {String} [body.zh] 配置中文描述
 * @prop {Middleware} admin
 * @prop {Route} /i18ns/:id
 * @example curl -XPATCH -d '{
 *  "name": "home",
 *  "category": "basic",
 *  "en": "home",
 *  "zh": "首页"
 * }' 'http://127.0.0.1:5018/i18ns/59885ddb83d2ec0979c9e637'
 * @return {Body} 204
 */
exports.update = async function update(ctx) {
  const data = Joi.validate(ctx.request.body, validateSchema);
  const id = Joi.attempt(ctx.params.id, Joi.objectId());
  await i18nService.findByIdAndUpdate(id, data);
  ctx.body = null;
};


/**
 * 获取该语言配置
 *
 * @param {Method} GET
 * @param {ObjectId} params.id 配置ID
 * @prop {Route} /i18ns/:id
 * @example curl -XGET 'http://127.0.0.1:5018/i18ns/598bf0ec5608236637cc7a98'
 * @return {Body} {
 *  "name": String,
 *  "category": String,
 *  "en": String,
 *  "zh": String,
 * }
 */
exports.get = async function get(ctx) {
  const id = Joi.attempt(ctx.params.id, Joi.objectId());
  const doc = await i18nService.findById(id);
  ctx.setCache('10s');
  ctx.body = doc;
};


/**
 * 初始化多语言配置
 *
 * @param {any} ctx
 */
exports.init = async function init(ctx) {
  if (ctx.request.body.token !== 'SJhZZwZ0b') {
    throw new Error('Token is invalid');
  }
  const buf = await readFile(path.join(__dirname, '../assets/i18n.json'));
  _.forEach(JSON.parse(buf), async (item) => {
    const conditions = _.pick(item, ['category', 'name']);
    await i18nService.findOneAndUpdate(conditions, item, {
      upsert: true,
    });
  });
  ctx.status = 201;
};
