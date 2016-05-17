'use strict';
module.exports = [
  // system start
  'GET /sys/version m.noQuery,c.system.version',
  'POST /sys/pause m.auth.admin,c.system.pause',
];
