# Config

```
module.exports = [
	// system start
	'GET /sys/version c.system.version',
	'GET /sys/stats c.system.stats',
	'POST /sys/pause m.auth.admin,c.system.pause',
	'POST /sys/resume m.auth.admin,c.system.resume',
	'POST /sys/safe-exit m.auth.admin,c.system.safeExit',
	// sysetm end
	// stats start
	'POST /stats/exception c.stats.exception',
	'POST /stats/statistics c.stats.statistics',
	'POST /stats/ajax c.stats.ajaxStats',
	// stats end
	// user start
	'GET /user/me m.noCache,c.user.me',
	// user end
	// home page
	'GET /,/page/:page v.home,c.home',
	// doc page
	'GET /doc/:category,/doc/:category/:name v.doc,c.doc'
];
```

路由的config配置，通过字符串的形式来描述路由的处理方式