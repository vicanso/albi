const _ = require('lodash');
const Timing = require('supertiming');

const globals = localRequire('helpers/globals');

module.exports = (appUrlPrefix, processName) => (ctx, next) => {
  const currentPath = ctx.path;
  const tokenKey = 'X-User-Token';
  if (!ctx.get(tokenKey)) {
    ctx.req.headers[tokenKey.toLowerCase()] = 'unknown';
  }
  if (appUrlPrefix && currentPath.indexOf(appUrlPrefix) === 0) {
    /* eslint no-param-reassign:0 */
    ctx.orginalPath = currentPath;
    /* eslint no-param-reassign:0 */
    ctx.path = currentPath.substring(appUrlPrefix.length) || '/';
  }
  ctx.setCache = ttl => ctx.set('Cache-Control', `public, max-age=${ttl}`);
  console.dir(ctx.setCache);
  const processList = (ctx.get('Via') || '').split(',');
  processList.push(processName);
  ctx.set('Via', _.compact(processList).join(','));
  ctx.set('Cache-Control', 'no-cache, max-age=0');
  globals.set('connectingTotal', globals.get('connectingTotal') + 1);
  const timing = new Timing();
  ctx.state.timing = timing;
  timing.start(processName);
  const complete = () => {
    globals.set('connectingTotal', globals.get('connectingTotal') - 1);
    timing.end();
    ctx.set('Server-Timing', timing.toServerTiming(true));
  };
  return next().then(complete, (err) => {
    complete();
    throw err;
  });
};
