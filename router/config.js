'use strict';
module.exports = [
  // system start
  'GET /sys/version m.noQuery,c.system.version',
  'POST /sys/pause m.auth.admin,c.system.pause',
  'POST /sys/resume m.auth.admin,c.system.resume',
  'GET /sys/stats m.noQuery,c.system.stats',
  'POST /sys/restart m.auth.admin,c.system.restart',

  // page view
  'GET / v.home,c.home',
];
