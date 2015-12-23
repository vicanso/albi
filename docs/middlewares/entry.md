## entry

```
function entry(appUrlPrefix, appName) {
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
		const processList = ctx.get('X-Process') || 'unknown';
		ctx.set('X-Process', processList + ',node-' + appName);
		ctx.set('Cache-Control', 'must-revalidate, max-age=0');
		return next();
	};
}
```

判断是不是ajax请求，如果是设置ctx.xhr。获取Request Header中的X-Process(前面配置的返回代理各自添加，如：nginx, varnish等)，最后设置默认的Cache-Control为*must-revalidate, max-age=0*。对于缓存采用的是优先设置所有请求都不能缓存，避免缓存了不可缓存的请求，在每个请求的处理函数中，再根据是否可以缓存重新设置Cache-Control。