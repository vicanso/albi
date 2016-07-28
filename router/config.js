'use strict';
module.exports = [
  // system start
  '[GET] [/api/sys/version] [m.noQuery & c.system.version]',
  '[POST] [/api/sys/pause] [m.auth.admin & c.system.pause]',
  '[POST] [/api/sys/resume] [m.auth.admin & c.system.resume]',
  '[GET] [/api/sys/stats] [m.noQuery & c.system.stats]',
  '[POST] [/api/sys/restart] [m.auth.admin & c.system.restart]',

  // page view
  '[GET] [/] [v.home & c.home]',

  // user
  '[GET] [/api/users/me] [m.noCache & m.session.read & c.user.me]',
  '[DELETE] [/api/users/logout] [m.session & c.user.logout]',
  '[GET,POST] [/api/users/login] [m.noCache & m.session & c.user.login]',
  '[POST] [/api/users/register] [m.session & c.user.register]',

  // stats
  '[POST] [/api/stats/ajax] [c.stats.ajax]',
  '[POST] [/api/stats/exception] [c.stats.exception]',
  '[POST] [/api/stats/statistics] [c.stats.statistics]',
];
