'use strict';
var debug = require('debug');

if (CONFIG.pattern) {
	debug.names.push(new RegExp('^' + CONFIG.pattern.replace(/\*/g, '.*?') + '$'));
}

module.exports = debug('jt.' + CONFIG.app);