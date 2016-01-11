'use strict';
import debug from 'debug';
import * as globals from './globals';

const pattern = globals.get('CONFIG.pattern');
const app = globals.get('CONFIG.app');
if (pattern) {
	debug.names.push(new RegExp('^' + pattern.replace(/\*/g, '.*?') + '$'));
}
const log = debug('jt.' + app);

export default log;