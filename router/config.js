'use strict';

module.exports = [
	// system start
	'GET /sys/version c.system.version',
	'GET /sys/stats c.system.stats',
	'POST /sys/pause m.auth.admin,c.system.pause',
	'POST /sys/resume m.auth.admin,c.system.resume',
	'POST /sys/safe-exit m.auth.admin,c.system.safeExit',
	// sysetm end

	// user start
	'GET /user/me m.noCache,c.user.me',
	// user end

	// home page
	'GET / v.home,c.home'
];