'use strict';
const Joi = require('joi');
const httpError = localRequire('helpers/http-error');
const config = localRequire('config');
const uuid = require('node-uuid');
const moment = require('moment');
exports.me = me;
exports.login = login;
exports.filter = filter;

function me(ctx) {
	const track = config.trackCookie;
	const cookies = ctx.cookies;
	if (!cookies.get(track)) {
		cookies.set(track, `${uuid.v4().replace(/-/g, '')}${Date.now().toString(32)}`, {
			expires: new Date(Date.now() + 365 * 24 * 3600 * 1000)
		});
	};
	ctx.body = {
		name: 'vicanso'
	};
}


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