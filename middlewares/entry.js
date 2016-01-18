'use strict';
const _ = require('lodash');
module.exports = entry;


function entry(appUrlPrefix, processName) {
	return (ctx, next) => {
		// 所有的请求都去除appUrlPrefix
		const currentPath = ctx.path;
		if (appUrlPrefix && currentPath.indexOf(appUrlPrefix) === 0) {
			ctx.path = currentPath.substring(appUrlPrefix.length) || '/';
		}
		const val = ctx.get('X-Requested-With') || '';

		if (val.toLowerCase() === 'xmlhttprequest') {
			ctx.xhr = true;
		} else {
			ctx.xhr = false;
		}
		const processList = (ctx.get('Via') || '').split(',');
		processList.push(processName);
		ctx.set('Via', _.compact(processList).join(','));
		ctx.set('Cache-Control', 'no-cache');
		return next();
	};
}