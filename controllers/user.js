'use strict';
const errors = require('../errors');
const user = require('../services/user');
const _ = require('lodash');
module.exports = get;
/**
 * [user description]
 * @return {[type]} [description]
 */
function *get(){
  /*jshint validthis:true */
  let ctx = this;
  yield function(done) {
    setImmediate(done);
  };
  let result = yield user.get({
    account : 'vicanso'
  });
  if (result) {
    result = _.pick(result, ['name', 'account', 'lastLoginedAt', 'loginTimes']);
    result.anonymous = false;
  } else {
    result = {
      anonymous : true
    };
  }

  ctx.body = result;
}
