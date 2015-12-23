## common

### no query
```
function noQuery(ctx, next) {
	if (_.isEmpty(ctx.query)) {
		return next();
	} else {
		throw httpError('query must be empty', 400);
	}
}
```

对query参数的校验，要求不能为任何的query。对于这个middleware的使用，主要是因为我是varnish控，基本开发的网站都用到varnish做缓存。而开发的时候很多的url是没有query的，但是前端开发并不会考虑后端是不是有使用了缓存，怎么缓存之类，而且也有喜欢使用*?v= + Date.now()*这样来避免缓存的使用，导致varnish产生了太多的缓存，因此需要使用到noQuery的校验。

注：HTTP的缓存应该都由后端接口来控制，前端不应该通过添加*时间戳*的形式来避免缓存，如果该接口不能缓存，应该由后端设置Cache-Control，如果前端请求想强制不使用缓存，应该设置Request Header, Cache-Control: no-cache。


### deprecate

```
function deprecate(hint, dueDay) {
	hint = hint || 'This request should not be used any more.';
	return (ctx, next) => {
		ctx.set('X-Deprecation', hint);
		if (dueDay) {
			ctx.set('X-Due-Day', dueDay);
		}
		console.warn(`deprecate - ${ctx.url} is still used.${hint}`);
		return next();
	};
}
```

标记HTTP请求的处理已是deprecate，不再建议使用，如果有需要，也可标记due day。


### noCache

```
const checker = require('koa-query-checker');
const noCacheQuery = checker('cache=false');
function noCache() {
	return (ctx, next) => {
		const method = ctx.method.toUpperCase();
		if ((method !== 'GET' && method !== 'HEAD') || ctx.get('Cache-Control') === 'no-cache') {
			return next();
		} else {
			return noCacheQuery(ctx, next);
		}
	};
}
```

基于[koa-query-checker](https://github.com/vicanso/koa-query-checker)实现的强制要求请求url必须有cache=false或者request header设置Cache-Control:no-cache。如果没有设置request header，也没有cache=false的query，则重定向。

注：noCache主要是为了让varnish能够更快捷的判断请求是否可以缓存，如果不使用varnish或者不在乎varnish通过response header中判断是否能够缓存，这middleware并没有什么用。