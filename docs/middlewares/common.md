# common

通用的一些middleware

## noQuery

校验url中的query参数是否为空，主要用于可缓存的请求（varnish缓存等），避免同样的请求，生成了不同的缓存，导致缓存数据增大


## deprecate

- `hint` 标注该请求什么时候会废弃等信息

用于指定请求将于何时废弃，并且如果该接口有被调用，记录日志并添加统计


### noCache

用于指定请求(GET/HEAD)不可缓存，设置response header中的Cache-Control: no-cache, max-age=0，并判断reques header中的Cache-Control是不断为no-cache。

开发环境为了方便测试增加，判断url中query参数是否有cache=false，否则redirect，并在query string中添加cache=false。