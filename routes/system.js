'use strict';
module.exports = [{
	// 获取代码版本与运行时的版本（若代码更新了，但是node.js没有重启则不一致）
	route: '/sys/version',
	handler: 'system.version'
}, {
	// 简单的统计信息，包括内存占用，启动时间，lag和http请求等
	route: '/sys/stats',
	handler: 'system.stats'
}, {
	// 安全退出node.js（尽可能保证请求处理完成再退出）
	route: '/sys/safe-exit',
	method: 'post',
	middleware: 'authority.admin',
	handler: 'system.safeExit'
}, {
	// 暂停该进程（只是响应/ping请求返回出错，前置的ha认为该进程不可用）
	route: '/sys/pause',
	method: 'post',
	middleware: 'authority.admin',
	handler: 'system.pause'
}, {
	// 恢复进程
	route: '/sys/resume',
	method: 'post',
	middleware: 'authority.admin',
	handler: 'system.resume'
}];