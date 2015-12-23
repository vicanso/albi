## limit

```
const limit = require('koa-connection-limit');
function connectionLimit(options, interval) {
	let connectionLimitTimer;
	return limit(options, (status) => {
		console.info('connection-limit status:' + status);
		globals.set('performance.concurrency', status);
		if (status === 'high') {
			// 如果并发处理数已到达high值，设置状态为 pause，此时ping请求返回error，反向代理(nginx, haproxy)认为此程序有问题，不再转发请求到此程序
			globals.set('status', 'pause');
			/* istanbul ignore if */
			if (connectionLimitTimer) {
				clearTimeout(connectionLimitTimer);
				connectionLimitTimer = null;
			}
		} else if (globals.get('status') !== 'running') {
			// 状态为low或者mid时，延时5秒将服务设置回running
			connectionLimitTimer = setTimeout(function() {
				globals.set('status', 'running');
				connectionLimitTimer = null;
			}, interval);
			connectionLimitTimer.unref();
		}
	});
}
```

基于*[koa-connection-limit](https://github.com/vicanso/koa-connection-limit)*，在HTTP请求处理数超过最高值时，将应用程序标记status设置为pause状态。此状态会导致/ping请求返回500，用于前置的反向代理将此backend设置为不可用。当HTTP请求回落，在interval时间内，并没有再次超过最高值，则将应用程序标记status设置为running状态，前置反向代理将此backend设置为可用。