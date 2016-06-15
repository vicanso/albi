# debug

为了方便开发调试，从url query中获取debug相关参数：_debug, _mock。记录在ctx.debugParams中，并从query中删除（避免影响后面的middleware，eg:noQuery）

