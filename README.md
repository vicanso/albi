# albi 

## Commit message

使用下面的规范

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

### type

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

## 中间件

- `noQuery` 如果缓存是可以请求的，且没有参数要求，应该增加该中间件，避免前端使用时间参数导致缓存浪费
- `session` 获取用户session中间件，如果使用该中间件的是GET/HEAD方法，则需要设置query: cache-control=no-cache
- `login` 包括session中间件，而且必须是登录状态
- `admin` 包括session.login中间件，而且用户必须是admih权限
- `tracker` 只要有状态更新（增删改），都应该增加该中间件，用于记录操作行为日志
- `token` `tokenValidate` 用于生成一次性使用token与校验token有效性

## 全局公共参数

- `query.lang` 客户端所使用语言，保存在`ctx.state.lang`中，默认为`en`
- `request.header.X-Request-Id` 客户端请求前生成的唯一`id`，用于调用链路的跟踪
- `response.header.X-Response-Id` 响应请求时返回的`id`，如果有`request-id`则于它一致，否则生成一个随机值
- `query.cache-control` 该请求缓存参数，暂时只支持cache-control=no-cache
- `query.count` 返回查询条件对应的count
- `query.limit` 最多返回匹配查询条件的记录数
- `query.skip` 跳过匹配查询条件的记录数之后再查询
- `query.sort` 查询的排序


## env

```
NODE_ENV=test
MONGO=mongodb://user:pwd@172.17.0.1:28017,172.17.0.1:28018,172.17.0.1:28019/albi
REDIS=redis://:pwd@172.17.0.1/
INFLUX=http://user:pwd@192.168.0.1:8086/albi
LOG=udp://172.17.0.1:7349
```
