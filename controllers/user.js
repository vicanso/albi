'use strict';
const Joi = require('joi');
const httpError = localRequire('helpers/http-error');
const config = localRequire('config');
const uuid = require('node-uuid');
const _ = require('lodash');
const js2xmlparser = require('js2xmlparser');
exports.me = me;
exports.login = login;
exports.filter = filter;


/**
 * [me description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function me(ctx) {
	const version = _.get(ctx, 'versionConfig.version');
	const dataType = _.get(ctx, 'versionConfig.type');
	const track = config.trackCookie;

	if (!version) {
		// 接口说明
		return ctx.body = apiDesc();
	}
	const cookies = ctx.cookies;
	if (!cookies.get(track)) {
		cookies.set(track, `${uuid.v4().replace(/-/g, '')}${Date.now().toString(32)}`, {
			expires: new Date(Date.now() + 365 * 24 * 3600 * 1000)
		});
	}
	const data = {
		name: 'vicanso'
	};
	if (version !== 1) {
		data.uuid = uuid.v4();
	}

	if (dataType === 'xml') {
		ctx.body = js2xmlparser('person', data);
	} else {
		ctx.body = data;
	}


	function apiDesc() {
		return {
			path: _.map(ctx.matched, item => item.path),
			'data-type': ['xml', 'json'],
			'Cache-Control': 'no-cache',
			versions: [1, 2],
			query: {
				cache: false
			},
			response : {
				name: {
					type: 'String',
					version: '>=1'
				},
				uuid: {
					type: 'String',
					version: '>=2'
				}
			},
			desc: `返回用户的信息，若用户是首次访问时，设置cookie(${track})`
		};
	}
}


/**
 * [login description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function login(ctx) {
	const data = Joi.validateThrow(ctx.request.body, {
		// 账号长度限制
		account: Joi.string().trim().min(4).max(16).required(),
		password: Joi.string().trim().min(6).max(32).required()
	});
	if (data.password === '123123') {
		ctx.body = {
			name: 'vicanso'
		};
	} else {
		throw httpError('账号或密码不正确', 400);
	}
}


/**
 * [filter description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function filter(ctx) {
	const params = Joi.validateThrow(ctx.params, {
		category: Joi.string().valid('vip', 'vvip').required()
	});
	console.info(params);
	ctx.body = [{
		account: 'vicanso',
		createdAt: '2015-12-25'
	}, {
		account: 'jenny',
		createdAt: '2015-12-25'
	}];
}