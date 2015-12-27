'use strict';
// TODO 
// 根据滚动条的位置来判断什么时候加载
export function load(obj) {
	const src = obj.data('src');
	obj.append('<img src="' + src + '" />');
}