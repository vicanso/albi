## error

```
function error(ctx, next) {
	return next().then(_.noop, (err) => {
		ctx.status = err.status || 500;
		ctx.set('Cache-Control', 'must-revalidate, max-age=0');
		const data = {
			code: err.code || 0,
			error: err.message,
			expected: false
		};
		_.forEach(err, (v, k) => {
			data[k] = v;
		});
		if (config.env !== 'production') {
			data.stack = err.stack;
		}
		const str = JSON.stringify(data);
		if (data.expected) {
			console.error('http-error:' + str);
		} else {
			console.error('http-unexpectd-error:' + str);
		}
		if (ctx.state.TEMPLATE) {
			const htmlArr = ['<html>'];
			/* istanbul ignore else */
			if (config.env !== 'production') {
				htmlArr.push('<pre>' + err.stack +
					'</pre>');
			} else {
				htmlArr.push('<pre>' + err.message.replace(config.viewPath, '') +
					'</pre>');
			}
			htmlArr.push('</html>');
			ctx.body = htmlArr.join('');
		} else {
			ctx.body = data;
		}
	});
}
```

error的统一处理，会捕获HTTP请求处理流程中，抛出的异常。对于error对象，会判断是不是expected（如果通过httpError主动抛出的异常，则为true），输出不同的日志，对于http-unexpectd-error，这种错误日志是由于代码不健壮导致的，应及时处理。如果该请求是有对应TEMPLATE的，证明是模板的渲染，因为返回html（只是简单的出错页面），若不是则以json形式返回。