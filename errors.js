'use strict';

exports.get = getError;

/**
 * [getError description]
 * @param  {[type]} msg [description]
 * @param  {[type]} code [description]
 * @return {[type]}     [description]
 */
function getError(msg, code) {
	let err = new Error(msg);
	err.code = code || 500;
	// 主动抛出的error设置expose，可以通过判断expose是否为true来识别是否为未知error
	err.expose = true;
	return err;
}