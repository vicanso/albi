# albi

Web framework base on koa 2.x.

## 常用Middlware

- `noQuery` 要求url中无query参数，主要用于可缓存的请求，为了避免添加参数导致`varnish`缓存失效，因此如果无参数的可缓存路由处理，尽量添加此middleware

- `noCache` 为了方便`varnish`判断请求是否可以缓存，对于`GET`与`HEAD`请求，如果未设置Header `Cache-Control:no-cache`或者query string中无`cache-control=no-cache`，则以增加`cache-control=no-cache`，并以`302`的形式跳转

- `auth.admin` 验证HTTP请求所带的`Auth-Token`是否admin，主要用于一些设置系统状态等路由使用

- `level` 用于限制某此接口在系统`level`处于较低水平时，直接返回系统繁忙（http status 503）

- `session.read` 只读取`session`信息，不做任何的修改

## HTTP状态码

- 对于所有的请求，如果是参数校验出错，状态码为`400`

- 对于需要登录的请求，如果是未登录状态，状态码为`403`

- 对于`POST`请求，正常处理时，状态码为`201`



## License

MIT
