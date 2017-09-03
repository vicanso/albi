module.exports = {
  hasLogined: {
    code: 101,
    en: 'Already logged in, please sign out first',
    zh: '您已登录，请先退出登录',
    status: 400,
  },
  tokenIsNull: {
    code: 102,
    en: 'Login fail, token can not be null',
    zh: '登录失败，令牌不能为空',
    status: 400,
  },
  accountHasUsed: {
    code: 104,
    en: 'This account has been used',
    zh: '此账户已被使用',
    status: 403,
  },
  emailHasUsed: {
    code: 105,
    en: 'This email has been used',
    zh: '此邮箱已被使用',
    status: 400,
  },
  idPwdIncorrect: {
    code: 106,
    en: 'ID/Password is incorrect',
    zh: '账户或密码不正确',
    status: 400,
  },
  mustLogined: {
    code: 107,
    en: 'Should login first to use the function',
    zh: '请先登录才可以使用此功能',
    status: 401,
  },
  forbidden: {
    code: 108,
    en: 'Forbidden',
    zh: '禁止访问',
    status: 403,
  },
  forbidSetAdmin: {
    code: 109,
    en: 'Can not set admin role',
    zh: '禁止设置admin权限',
    status: 403,
  },
  tokenInvalid: {
    code: 110,
    en: 'Token is invalid',
    zh: '令牌不合法',
    status: 400,
  },
  loginFailExceededLimit: {
    code: 111,
    en: 'Login fail more than 5 times, please try again 10 minutes later',
    zh: '您登录失败的次数太多，请10分钟后再试',
    status: 406,
  },
  tokenInvalidExpired: {
    code: 112,
    en: 'Reset password fail, the token is invalid or expired',
    zh: '重置密码失败，令牌不合法或者已过期',
    status: 400,
  },
};
