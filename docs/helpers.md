# Helpers

主要是一些工具类的实现，如：debug日志，http error的生成，statsd-client等。


## debug

基于debug模块，主要是为了方便开发时输出debug日志，如果不了解的，请查看[debug](https://github.com/visionmedia/debug)。

## http-error

基于[http-errors](https://github.com/jshttp/http-errors)，主要用户代码中主动抛出的异常，并设置expected为true，用于区分非主动抛出异常。

## sdc

基于[statsd-client](https://github.com/msiebuhr/node-statsd-client)，在调用统计时，判断是否有初始化statsd，如果未初始化，则只是一个空函数调用，并不影响流程。