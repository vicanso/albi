# albi

Web framework base on koa 2.x.

## 模块分类

- `controllers` 主要是实现路由的相关处理函数，对于参数的校验，`services`的调用方，通过不同的`service`获取路由的响应结果

- `services` 各业务相关的实现变，该组件主要实现与数据库的相关操作，以及其它依赖服务的调用实现等。

- `helpers` 各类公共的组件，主要是与业务无关的各类功能实现

- `middlewares` 各类常用的中间件，包括`session`, `limit`, `error`等

- `models` `mongodb`的`model`相关定义

- `router` 路由的调用链定义

- `errors` 各种出错的定义

- `tasks` 各类定时执行的任务

- `views` 模板目录

- `influx-schemas` influxdb的schema定义

## 常用Middlware

- `noQuery` 要求url中无query参数，主要用于可缓存的请求，为了避免添加参数导致`varnish`缓存失效，因此如果无参数的可缓存路由处理，尽量添加此middleware

- `noCache` 为了方便`varnish`判断请求是否可以缓存，对于`GET`与`HEAD`请求，如果未设置Header `Cache-Control:no-cache`或者query string中无`cache-control=no-cache`，则以增加`cache-control=no-cache`，并以`302`的形式跳转

- `auth.admin` 验证HTTP请求所带的`Auth-Token`是否admin，主要用于一些设置系统状态等路由使用

- `level` 用于限制某此接口在系统`level`处于较低水平时，直接返回系统繁忙（http status 503）

- `version` 指定该接口version版本

- `session.read` 只读取`session`信息，不做任何的修改

- `session` 正常的`session`处理，可以写数据到`session`


## HTTP状态码

- 对于所有的请求，如果是参数校验出错，状态码为`400`

- 对于需要登录的请求，如果是未登录状态，状态码为`401`

- 对于`POST`请求，正常处理时，状态码为`201`



## License

MIT
