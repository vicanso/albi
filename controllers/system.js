'use strict';
const config = require('../config');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const globals = require('../globals');

exports.version = version;
exports.httpStats = httpStats;

/**
 * [version 返回代码版本与执行版本]
 * @return {[type]} [description]
 */
function *version() {
  /*jshint validthis:true */
  let ctx = this;
  let pm2Json = yield function(done) {
    fs.readFile(path.join(__dirname, '../pm2.json'), done);
  };
  pm2Json = JSON.parse(pm2Json);
  ctx.set({
    'Cache-Control' : 'public, max-age=60'
  });
  ctx.body = {
    code : _.get(pm2Json, 'env.APP_VERSION'),
    exec : config.version
  };
}


function *httpStats() {
  yield function(done){
    setImmediate(done);
  };
  /*jshint validthis:true */
  let ctx = this;
  let data = globals.get('http-stats');
  ctx.set({
    'Cache-Control' : 'public, max-age=5'
  });
  ctx.body = data;

}
