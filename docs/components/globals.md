## globals

简单的封装从全局对应中获取值，主要为了方便在非浏览器环境下测试代码

```
'use strict';
import * as _ from 'lodash';
export function get(path, defaultValue) {
	return _.get(window, path, defaultValue);
}
export function set(path, value) {
	_.set(window, path, value);
}
```