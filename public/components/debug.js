'use strict';
const debug = require('debug');
const global = require('./global');
const pattern = global.get('CONFIG.pattern');
const app = global.get('CONFIG.app');
if (pattern) {
	debug.names.push(new RegExp('^' + pattern.replace(/\*/g, '.*?') + '$'));
}

module.exports = debug('jt.' + app);