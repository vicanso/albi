## debug

调试日志输出模块，根据url中query的\_pattern参数来显示debug日志，debug指定了默认的pattern，development环境下，CONFIG.pattern为输出所有调试日志，因此在开发环境，会输出所有的debug日志。非development环境下，CONFIG.pattern为\_pattern的值，因此可以通过修改\_pattern参数来输出日志。



```
'use strict';
import debug from 'debug';
import * as globals from './globals';
const pattern = globals.get('CONFIG.pattern');
const app = globals.get('CONFIG.app');
if (pattern) {
	debug.names.push(new RegExp('^' + pattern.replace(/\*/g, '.*?')));
}
const log = debug('jt.' + app);
export default log;
```


注：在node.js中使用debug，基本都是一个模块一个pattern，在前端为了方便，整个网站使用一个pattern，如果有需要，可以修改debug的实现，可以配置不同的pattern。