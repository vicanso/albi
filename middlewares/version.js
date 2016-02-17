'use strict';
const _ = require('lodash');
module.exports = version;


/**
 * [version description]
 * @return {[type]} [description]
 */
function version() {
	return (ctx, next) => {
		const query = ctx.query;
		const currentPath = ctx.path;
		const reg = /^\/v\d+/i;
		const result = reg.exec(currentPath);
		const versionConfig = {};
		if (result) {
			const versionDesc = result[0];
			const version = parseInt(versionDesc.substring(2));
			ctx.path = ctx.path.substring(versionDesc.length);
			versionConfig.version = version;
		}
		if (query._type) {
			versionConfig.type = query._type;
			delete query._type;
			ctx.query = query;
		}
		const acceptReg = /^application\/vnd\.\S+\.v(\d)+(\+(\S+))?/i;
		const acceptResult = acceptReg.exec(ctx.get('Accept'));
		if (acceptResult) {
			versionConfig.version = parseInt(acceptResult[1]);
			if (acceptResult[3]) {
				versionConfig.type = acceptResult[3];
			}
		}
		if (versionConfig.version) {
			ctx.versionConfig = versionConfig;
		}
		return next();
	};
}

