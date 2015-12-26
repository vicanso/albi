# Router

基于[koa-router-parser](https://github.com/vicanso/koa-router-parser)将路由的配置信息转化为路由的处理，将router，middleware，controller串联起来，通过简单的配置方式，生成整个路由的处理流程。


```
'use strict';
const _ = require('lodash');
const router = require('koa-router-parser');
const controllers = localRequire('controllers');
const middlewares = localRequire('middlewares');
const globals = localRequire('globals');
const sdc = localRequire('helpers/sdc');
// add route handler stats，common is for all http method
router.addDefault('common', routeStats);
addToRouter('c', controllers);
addToRouter('m.noCache', middlewares.common.noCache());
addToRouter('m.auth.admin', middlewares.auth.admin);
addToRouter('v', middlewares.template);
module.exports = getRouter(localRequire('router/config'));
```

router的实现是将controllers中的所有controller都添加到router中，如controller->user.js->exports.me，添加到router中是c.user.me，在路由配置中就可以通过字符串来指定调用些controller。
router中并没有将所有的middleware都添加进去，如果有需要再一一添加。template的render则以v.xxx的形式添加到router中。

下面是获取user信息的route配置，route的配置格式为：*method url middleware,controller*，以空格分开

```
GET /user/me m.noCache,c.user.me
```

- 如果支持多种method，以*,*分隔，如*GET,POST*

- url的格式并没有做修改，和koa的一致，可以使用参数，如*/user/:id*的形式，也支持多种url的形式，以*,*分隔。如*/user/:id,/client/my/:id*

- middleware和controller，通过函数*addToRouter*添加到router处理中，通过名字指定调用的函数，多个函数可以以,分隔


```
function addToRouter(category, fns) {
	if (_.isFunction(fns)) {
		router.add(category, fns);
		return;
	}
	_.forEach(fns, (v, k) => {
		/* istanbul ignore else */
		if (_.isFunction(v)) {
			router.add(category + '.' + k, v);
		} else if (_.isObject(v)) {
			addToRouter(category + '.' + k, v);
		} else {
			console.error(category + '.' + k + ' is invalid.');
		}
	});
}
```

addToRouter只是把函数调用名和函数一一添加到router(koa-router-parser)中，具体的实现看[koa-router-parser](https://github.com/vicanso/koa-router-parser)



```
function routeStats(ctx, next) {
	const routePerformance = globals.get('performance.route');
	if (!routePerformance.createdAt) {
		routePerformance.createdAt = (new Date()).toISOString();
	}
	const method = ctx.method.toUpperCase();
	_.forEach(ctx.matched, (layer => {
		const key = method + layer.path;
		sdc.increment('route.' + key);
		if (!routePerformance[key]) {
			routePerformance[key] = 1;
		} else {
			routePerformance[key]++;
		}
	}));
	return next();
}
```

路由的统计，在每一次路由的调用中，记录其调用次数