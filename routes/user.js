module.exports = [
  '[GET] [/users/me] [m.session & c.user.me]',
  '[PUT] [/users/me] [m.session & c.user.refreshSession]',
  [
    'POST',
    '/users/like',
    [
      'level(3)',
      'version([2, 3])',
      'm.session.login',
      'tracker("user-like")',
      'c.user.like',
    ],
  ],
  '[GET] [/users/login] [m.session & c.user.loginToken]',
  '[POST] [/users/login] [m.session & tracker("login") & c.user.login]',
  '[DELETE] [/users/logout] [m.session.login & tracker("logout") & c.user.logout]',
  '[POST] [/users/register] [m.session & tracker("register") & c.user.register]',
];
