# Controllers

主要是调用services获取相关数据，组装之后，设置Cache-Control之类的HTTP header，返回数据，可以认为是HTTP响应流程中的最后一步。