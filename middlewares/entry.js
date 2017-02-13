const _ = require('lodash');
const Timing = require('supertiming');

const config = localRequire('config');
const globals = localRequire('helpers/globals');

module.exports = (appUrlPrefix, processName) => (ctx, next) => {
  const currentPath = ctx.path;
  if (appUrlPrefix && currentPath.indexOf(appUrlPrefix) === 0) {
    /* eslint no-param-reassign:0 */
    ctx.orginalPath = currentPath;
    /* eslint no-param-reassign:0 */
    ctx.path = currentPath.substring(appUrlPrefix.length) || '/';
  }

  const processList = (ctx.get('Via') || '').split(',');
  processList.push(processName);
  ctx.set('Via', _.compact(processList).join(','));
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  globals.set('connectingTotal', globals.get('connectingTotal') + 1);
  const timing = new Timing();
  ctx.state.timing = timing;
  timing.start('Total');
  const complete = () => {
    globals.set('connectingTotal', globals.get('connectingTotal') - 1);
    timing.end('*');
    ctx.set('Server-Timing', timing.toServerTiming());
  };
  return next().then(complete, (err) => {
    complete();
    throw err;
  });
};
