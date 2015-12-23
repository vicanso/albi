## debug

```
function debug() {
	const renameList = {
		'DEBUG': '_debug',
		'MOCK': '_mock',
		'PATTERN': '_pattern'
	};
	let schemaObject = Joi.object().keys({
		DEBUG: Joi.boolean(),
		MOCK: Joi.object(),
		PATTERN: Joi.string()
	});
	_.forEach(renameList, function(v, k) {
		schemaObject = schemaObject.rename(v, k);
	});
	return (ctx, next) => {
		const query = ctx.query;
		const result = Joi.validateThrow(query, schemaObject, {
			stripUnknown: true
		});
		/* istanbul ignore else */
		if (!_.isEmpty(result)) {
			_.forEach(result, function(v, k) {
				delete query[renameList[k]];
			});
			ctx.debugParams = result;
			ctx.query = query;
		}
		return next();
	};
}
```

debug相关参数的获取，从query中获取相关的debug参数，设置到ctx.debugParams中，并删除query中对应的字段。主要是用于在线上环境中，发起请求时，能设置为debug模式（debug模式下会怎么处理则由各函数实现），而将相关参数从query中删除，避免影响后面的参数判断，如：noQuery的校验。