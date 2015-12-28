## http

GET POST的简单实现

```
export function get(url, headers) {
	const req = request.get(url);
	if (headers) {
		req.set(headers);
	}
	return req.done();
}
export function post(url, data, headers) {
	const req = request.post(url);
	if (data) {
		req.send(data);
	}
	if (headers) {
		req.set(headers);
	}
	return req.done();
}
```

建议使用parse来生成HTTP请求的函数调用，如以下代码：

```
// get user session
const getUser = http.parse('GET /user/me');
const query = {
	cache: false
};
const headers = {
	'X-Albi-ID': 123
};
getUser(query, headers).then(res => {
	console.info(res.body);
});
```

```
// user login
const login = http.parse('POST /user/login');
const data = {
	account: 'vicanso',
	password: '123123'
};
login(data).then(res => {
	console.info(res.body)
});
```

```
//get user by category
const userFilter = http.parse('GET /users/category/:category');
userFilter('vip').then(res => {
	// GET /users/category/vip
	console.info(res);
});
```



http模块中添加了相关性能的统计，包括请求时长，是否从varnish缓存中获取。以及并发同时请求相同的url的记录等。