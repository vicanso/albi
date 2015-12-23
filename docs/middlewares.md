# Middlewares

- *auth* 用户权限认证相关

- *common* 与业务无关的公共处理

- *debug* 根据url query生成debug相关参数，便于在生产环境中做调试

- *entry* 对所有HTTP请求做初始化的设置，如Cache-Control, X-Process等

- *error* 出错处理的捕获与响应

- *http-stats* HTTP请求统计，包括响应时间、状态码、数据大小等

- *limit* HTTP连接数的限制模块，在连接数达到上限时，设置应用程序状态为pause，/ping请求的检测返回Error，以达到让反向代理认为应用程序不可用

- *picker* 对返回数据挑选特定的字段或者删除特定字段

- *state* render view中使用到的一些属性与基础库

- *template* 模板的渲染与静态文件列表的替换


