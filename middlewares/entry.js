'use strict';
const config = localRequire('config');
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
		const processList = (ctx.get('X-Process') || '').split(',');
		processList.push(config.name);
		ctx.set('X-Process', processList.join(','));
		ctx.set('Cache-Control', 'no-cache, must-revalidate, max-age=0');
		return next();
	};
}