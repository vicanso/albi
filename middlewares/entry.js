'use strict';
module.exports = entry;


function entry(appUrlPrefix, appName) {
	return (ctx, next) => {
		// 所有的请求都去除appUrlPrefix
		const currentPath = ctx.path;
		if (appUrlPrefix && currentPath.indexOf(appUrlPrefix) === 0) {
			ctx.path = currentPath.substring(appUrlPrefix.length) || '/';
		}
		const processList = ctx.get('X-Process') || 'unknown';
		ctx.set('X-Process', processList + ',node-' + appName);
		ctx.set('Cache-Control', 'must-revalidate, max-age=0');
		return next();
	};

}