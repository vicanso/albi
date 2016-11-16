const middlewares = localRequire('middlewares');
const {
  version,
  tracker,
} = middlewares.common;
const level = middlewares.level;
module.exports = [
  // system start
  '[GET] [/api/sys/version] [m.noQuery & c.system.version]',
  '[POST] [/api/sys/pause] [m.auth.admin & c.system.pause]',
  '[POST] [/api/sys/resume] [m.auth.admin & c.system.resume]',
  '[GET] [/api/sys/stats] [m.noQuery & c.system.stats]',
  '[POST] [/api/sys/restart] [m.auth.admin & c.system.restart]',
  '[POST] [/api/sys/level] [m.auth.admin & c.system.level]',
  '[GET] [/api/sys/level] [c.system.level]',
  // page view
  '[GET] [/,/login,/register] [v.home & c.home]',

  // user
  '[GET] [/api/users/me] [m.noCache & m.session.read & c.user.me]',
  '[DELETE] [/api/users/logout] [m.session & c.user.logout]',
  '[GET,POST] [/api/users/login] [m.session & c.user.login]',
  '[POST] [/api/users/register] [m.session & c.user.register]',
  {
    methods: ['POST'],
    urls: ['/api/users/like'],
    handlers: [
      level(5),
      tracker('user-like', ['code']),
      version([2, 3]),
      'm.session.read',
      'c.user.like',
    ],
  },

  // stats
  '[POST] [/api/stats/ajax] [c.stats.ajax]',
  '[POST] [/api/stats/exception] [c.stats.exception]',
  '[POST] [/api/stats/statistics] [c.stats.statistics]',
];
