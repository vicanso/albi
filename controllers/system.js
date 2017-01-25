const BlueBird = require('bluebird');
const path = require('path');
const moment = require('moment');
const _ = require('lodash');

const fs = BlueBird.promisifyAll(require('fs'));

const config = localRequire('config');
const globals = localRequire('helpers/globals');
const utils = localRequire('helpers/utils');

function getVersion() {
  return fs.readFileAsync(path.join(__dirname, '../package.json')).then((buf) => {
    const pkg = JSON.parse(buf);
    return {
      code: pkg.version,
      exec: config.version,
    };
  });
}

exports.version = ctx => getVersion().then((data) => {
  ctx.set('Cache-Control', 'public, max-age=600');
  /* eslint no-param-reassign:0 */
  ctx.body = data;
});

exports.pause = (ctx) => {
  globals.set('status', 'pause');
  console.info('pause application');
  ctx.body = null;
};

exports.resume = (ctx) => {
  globals.set('status', 'running');
  console.info('resume application');
  ctx.body = null;
};

exports.stats = ctx => getVersion().then((version) => {
  const uptime = moment(Date.now() - (Math.ceil(process.uptime()) * 1000));
  ctx.body = {
    connectingTotal: globals.get('connectingTotal'),
    status: globals.get('status'),
    version,
    uptime: uptime.fromNow(),
    startedAt: uptime.toISOString(),
  };
});

/* istanbul ignore next */
exports.restart = (ctx) => {
  utils.checkToExit(3);
  console.info('application will restart soon');
  ctx.body = null;
};

exports.level = (ctx) => {
  const method = ctx.method.toUpperCase();
  if (method === 'POST') {
    const level = _.get(ctx, 'request.body.level');
    if (level) {
      globals.set('level', level);
    }
    ctx.body = null;
    return;
  }
  ctx.body = globals.get('level');
};
