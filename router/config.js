/**
 * 路由定义，通过配置的方式实现各路径的流程，路由配置主要有两种方式：
 * 1.字符串形式：'[Method] [RoutePath] [function & function]
 * 2.Object形式：{
 *  methods: ['Method'],
 *  urls: ['RoutePath'],
 *  handlers: [
 *    function,
 *    function,
 *  ]
 * }
 * @module router
 */

const middlewares = localRequire('middlewares');
const tracker = middlewares.tracker;
const {
  version,
} = middlewares.common;
const level = middlewares.level;
module.exports = [
  // system start
  '[GET] [/api/sys/version] [m.noQuery & c.system.version]',
  '[POST] [/api/sys/pause] [m.auth.admin & c.system.pause]',
  '[POST] [/api/sys/resume] [m.auth.admin & c.system.resume]',
  '[GET] [/api/sys/status] [m.noQuery & c.system.status]',
  '[POST] [/api/sys/exit] [m.auth.admin & c.system.exit]',
  '[POST] [/api/sys/level] [m.auth.admin & c.system.setLevel]',
  '[GET] [/api/sys/level] [m.noCache & c.system.level]',
  // page view
  '[GET] [/,/login,/register] [v.home & c.home]',

  // user
  '[GET] [/api/users/me] [m.noCache & m.session.read & c.user.me]',
  '[DELETE] [/api/users/logout] [m.session & c.user.logout]',
  '[GET] [/api/users/login] [m.session & c.user.loginToken]',
  '[POST] [/api/users/login] [m.session & c.user.login]',
  '[POST] [/api/users/register] [m.session & c.user.register]',
  '[PUT] [/api/users/me] [m.session & c.user.refreshSession]',
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
