'use strict';

var http = require('component/http');

exports.run = run;


var runCbList = [];
// 表示APP的初始化是否已完成
var isReady = true;

/**
 * [run 注册run的回调事件，预留用于做一些全局的异步处理]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
function run(cb) {
	if (isReady) {
		_.defer(cb);
	} else {
		runCbList.push(cb);
	}
}

http.on('response', function(res) {

});