'use strict';
module.exports = error;

/**
 * [error description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function *error(next) {
  try {
    yield next;
  } catch (err) {
    /*jshint validthis:true */
    let ctx = this;
    this.status = err.status || 500;
    this.body = {
      code : err.code || 0,
      msg : err.message
    };
    this.app.emit('error', err, this);
  }
}
