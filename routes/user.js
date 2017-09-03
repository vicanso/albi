const limitMid = require('../middlewares/limit');
const configs = require('../configs');
const errors = require('../helpers/errors');

module.exports = [
  ['GET', '/users', 'm.admin & c.user.list'],
  [
    'PATCH',
    '/users/:id/roles',
    [
      'm.admin',
      'm.tracker("updateRoles")',
      'c.user.updateRoles',
    ],
  ],
  ['GET', '/users/me', 'm.session & c.user.me'],
  ['PATCH', '/users/me', 'm.session & c.user.refreshSession'],
  ['GET', '/users/login', 'm.session & c.user.loginToken'],
  [
    'POST',
    '/users/login',
    [
      limitMid.createLimiter({
        ttl: 60,
        max: 10,
        prefix: 'super-limit-login-',
        err: errors.get('common.exceededLimit'),
        hash: ctx => ctx.cookies.get(configs.trackCookie) || 'unknown',
      }),
      'm.session',
      'm.tracker("login")',
      'c.user.login',
    ],
  ],
  [
    'DELETE',
    '/users/logout',
    [
      'm.login',
      'm.tracker("logout")',
      'c.user.logout',
    ],
  ],
  [
    'POST',
    '/users/register',
    [
      'm.session',
      'm.tracker("register")',
      'c.user.register',
    ],
  ],
  ['GET', '/users/token', 'm.login & m.token & c.user.getToken'],
  // validate test
  ['PUT', '/users/token', 'm.login & m.tokenValidate & c.user.validateToken'],
  [
    'POST',
    '/users/gen-reset-token',
    [
      limitMid.createLimiter({
        ttl: 300,
        max: 3,
        prefix: 'super-limit-reset-password-',
        err: errors.get('common.exceededLimit'),
        hash: ctx => ctx.request.body.account || 'unknown',
      }),
      'm.tracker("genResetPasswordToken")',
      'm.captcha',
      'c.user.genResetPasswordToken',
    ],
  ],
  [
    'PATCH',
    '/users/reset-password',
    [
      'm.tracker("resetPassword")',
      'c.user.resetPassword',
    ],
  ],
];
