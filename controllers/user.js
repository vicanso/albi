'use strict';
const uuid = require('node-uuid');
exports.me = (ctx) => {
  console.dir(ctx.versionConfig);
  /* eslint no-param-reassign:0 */
  ctx.body = ctx.session.user;
};
