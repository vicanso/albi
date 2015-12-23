## state

```
const Importer = require('jtfileimporter');
function state(versions) {
	const appUrlPrefix = config.appUrlPrefix;
	const staticUrlPrefix = urlJoin(appUrlPrefix, config.staticUrlPrefix);
	const imgUrlFn = getImgUrl(staticUrlPrefix, versions);
	const anchorUrlFn = url => {
		return urlJoin(appUrlPrefix, url);
	};
	const defaultPattern = config.env === 'development' ? '*' : '';
	return (ctx, next) => {
		const state = ctx.state;
		const importer = new Importer();
		importer.prefix = staticUrlPrefix;
		state.STATIC_URL_PREFIX = staticUrlPrefix;
		state.APP_URL_PREFIX = appUrlPrefix;
		state.APP_VERSION = config.version;
		state.APP = config.name;
		state.ENV = config.env;
		state._ = _;
		state.moment = moment;
		state.IMG_URL = imgUrlFn;
		state.URL = anchorUrlFn;
		state.importer = importer;
		state.DEBUG = _.get(ctx, 'debugParams.DEBUG', false);
		state.PATTERN = _.get(ctx, 'debugParams.PATTERN', defaultPattern);
		return next();
	};
}
```

为了方便render html时方便，将一些能用的函数库、以及一些环境相关的配置引入到state中，如：版本号，是否DEBUG模式，url的生成函数（添加APP前缀或者版本号）等功能。其实使用到[jtfileimporter](https://github.com/vicanso/jtfileimporter)来实现引入静态文件的功能。