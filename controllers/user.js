'use strict';
const uuid = require('node-uuid');
exports.me = (ctx) => {
  console.dir('session:' + JSON.stringify(ctx.session));
  let userInfo = ctx.session.user || {
    uuid: uuid.v4(),
  };
  /* eslint no-param-reassign:0 */
  ctx.session.user = userInfo;
  console.dir(ctx.session);
  /* eslint no-param-reassign:0 */
  ctx.body = userInfo;
};
