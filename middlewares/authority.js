'use strict';
const crypto = require('crypto');


function *admin(next) {
  /*jshint validthis:true */
  let ctx = this;
  let data = ctx.request.body;
  let shasum = crypto.createHash('sha1');

//   var shasum = crypto.createHash('sha1');
//
// var s = fs.ReadStream(filename);
// s.on('data', function(d) {
//   shasum.update(d);
// });
//
// s.on('end', function() {
//   var d = shasum.digest('hex');
}
