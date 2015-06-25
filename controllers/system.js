'use strict';
const config = require('../config');

exports.version = version;


function *version() {
  /*jshint validthis:true */
  let ctx = this;
  ctx.set({
    'Cache-Control' : 'public, max-age=60'
  });
  yield function(done) {
    setTimeout(done, 1);
  };
  ctx.body = config.version;
}
