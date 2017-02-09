const _ = require('lodash');

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
  const start = Date.now();
  const complete = () => {
    globals.set('connectingTotal', globals.get('connectingTotal') - 1);
    ctx.set('Server-Timing', `${config.app}=${(Date.now() - start) / 1000}`);
  };
  return next().then(complete, (err) => {
    complete();
    throw err;
  });
};
