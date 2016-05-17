'use strict';
const BlueBird = require('bluebird');
const fs = BlueBird.promisifyAll(require('fs'));
const path = require('path');
const config = localRequire('config');
const globals =localRequire('helpers/globals');
function getVersion() {
  return fs.readFileAsync(path.join(__dirname, '../package.json')).then(buf => {
    const pkg = JSON.parse(buf);
    return {
      code: pkg.version,
      exec: config.version,
    };
  });
}

exports.version = (ctx) => getVersion().then(data => {
  ctx.set('Cache-Control', 'public, max-age=600');
  /* eslint no-param-reassign:0 */
  ctx.body = data;
});


exports.pause = (ctx) => {
  globals.set('status', 'pause');
  console.info(`pause ${config.app} application`);
  ctx.body = null;
};