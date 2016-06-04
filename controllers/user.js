'use strict';
const uuid = require('node-uuid');
exports.me = (ctx) => {
  /* eslint no-param-reassign:0 */
  ctx.body = ctx.session.user;
};
