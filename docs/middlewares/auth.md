## auth

### admin
```
function admin(ctx, next) {
	const shasum = crypto.createHash('sha1');
	const token = _.get(ctx, 'request.body.jtToken');
	if (token && shasum.update(token).digest('hex') === config.adminToken) {
		return next();
	} else {
		throw httpError('token is invalid', 403, {
			type: 'admin-check'
		});
	}
}
```

此admin的校验主要是为了给pause、resume和safeExit功能使用，校验的流程非常简单，直接从post的data中获取jtToken，sha1之后和配置文件的比较，是否一致，如果一致则表示有admin权限，调用next()，把请求交给后面的处理函数。如果不一致，则返回403。对于用户的权限校验，后面会添加基于session的方式。

注：上面使用httpError来产生一个Error对象主要是为了和非主动抛出的异常区分，方便查看日志或者统计出未处理异常导致的Error。