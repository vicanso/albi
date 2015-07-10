albi是基于koa的web开发框架，集成了常用的middleware，添加了statsD做系统统计，使用zipkin做服务追踪，更简单的mognodb操作与session的使用，简单构建node.js项目。

## Installation

```
git clone https://github.com/vicanso/albi.git
cd albi
npm install // 如果生产环境，使用npm install --production
node app.js // 配置文件从ectd中获取，如果需要指定etcd服务器的地址：ETCD=http://etcdServer:4001 node app.js
```

## middleware

<img src="./middlewares.png" />


### error handler

捕捉异常，对异常信息处理返回，暂只支持返回json。注：如果err.expose为true，表示主动抛出异常，否则表示未处理异常，输出的log会带上"EXCEPTION"关键字，便于事后查找代码完善处理。


### set Cache-Control，X-Process

所有http的响应头中的Cache-Control都设置为：must-revalidate, max-age=0，避免有http头未设置Cache-Control导致在某些缓存服务器（varnish）使用了默认的缓存时间来缓存。

X-Process先获取request header中的X-Process（由haproxy，nginx或varnish之类的添加），再加上当前node的标识添加到response header中。


### http log

记录http请求的相关信息，包括ip、url、状态码、请求时间等。注意最后的三个数字5-1032-1037，第一个数字表示当前请求接收到的时间，该进程还有多少个请求没有结束的，第二个数字表示当前请求的序号，第三个数字表示当前请求处理完成时，记录请求数的序号是多少。（即可以用第三个数字-第二个数字表示在这个请求处理的过程中，进来了多少个请求）

::1 "GET /1/users/me?cache=false HTTP/1.1" 304 0 9ms "" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36" "_track:8241ae4d-b28e-4128-b6cb-6dc06458e487" 5-1032-1037


### connection limit

设置当如果正在处理的请求时超过多少之后，直接返回error

