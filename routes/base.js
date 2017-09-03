module.exports = [
  ['GET', '/captchas', 'm.noCache & c.base.getCaptcha'],
  ['PATCH', '/captchas', 'm.captcha & c.base.validateCaptcha'],
];
