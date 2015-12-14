'use strict';
const services = localRequire('services');
exports.me = me;

function me(ctx) {
	ctx.body = {
		name: 'vicanso'
	};
}