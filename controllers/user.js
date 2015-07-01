'use strict';
const errors = require('../errors');
const user = require('../services/user');
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
  yield user.create({
    account : 'vicanso',
    password : '123456',
    name : 'tree.xie'
  });

  ctx.body = {
    name : 'vicanso'
  };
}
