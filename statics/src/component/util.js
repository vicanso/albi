'use strict';

var Emitter = require('component/emitter');

exports.emitterWrapper = emitterWrapper;


/**
 * [emitterWrapper 添加emiiter相关函数]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function emitterWrapper(obj) {
	var emitter = new Emitter();
	_.forEach(_.functions(emitter), function(fn) {
		obj[fn] = emitter[fn];
	});
}