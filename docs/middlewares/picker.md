## picker

```
function picker(field) {
	return (ctx, next) => {
		const query = ctx.query;
		let pickValue = query[field];
		if (pickValue) {
			// 将query参数删除，避免影响后面函数的参数判断（请求的参数判断都尽量使用强制匹配，因为参数多一个也不行）
			delete query[field];
			ctx.query = query;
		}
		return next().then(() => {
			/* istanbul ignore if */
			if (!pickValue || !ctx.body) {
				return;
			}
			let pickFn = _.pick;
			if (pickValue[0] === '-') {
				pickFn = _.omit;
				pickValue = pickValue.substring(1);
			}
			const keys = pickValue.split(',');
			const fn = (item) => {
				return pickFn(item, keys);
			};
			if (_.isArray(ctx.body)) {
				ctx.body = _.map(ctx.body, fn);
			} else {
				ctx.body = fn(ctx.body);
			}
		});
	};
}
```

从接口返回的数据中挑选需要的字段，方便同样的接口，在不同应用场合中可能用到的字段不一样，后端接口只提供一个大的汇总，在各功能中根据选择挑选对应的字段。?_fields=a,b,c表示挑出a,b,c字段（如果返回的结果是array，则从arry中各个元素中挑选）。?_fields=-a,b,c表示删除a,b,c字段，保留其它字段。