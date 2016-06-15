# entry

入口的middleware，主要实现以下功能：

- 将配置的app url prefix去除，如配置url前缀是/albi，所有请求的url，如果有带有/albi都将替换， eg: /albi/user/session --> /user/session

- 添加Response Header, Via:Process-List

- 添加Response Header, Cache-Control:no-cache, max-age=0