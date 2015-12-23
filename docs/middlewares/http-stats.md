## http-stats

```
const stats = require('koa-http-stats');
function httpStats(options) {
	return stats(options, (performance) => {
		if (!performance.createdAt) {
			performance.createdAt = (new Date()).toISOString();
		}
		globals.set('performance.http', performance);
	});
}
```

基于*[koa-http-stats](https://github.com/vicanso/koa-http-stats)*做的HTTP请求的统计，包括http响应时间，http响应长度以及http状态码的统计。也可以将statsD接入做数据统计。






