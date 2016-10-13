const limit = require('koa-connection-limit');

const globals = localRequire('helpers/globals');

module.exports = (options, interval) => {
  let connectionLimitTimer;
  return limit(options, (status) => {
    console.info(`connection-limit status:${status}`);
    globals.set('performance.concurrency', status);
    if (status === 'high') {
      // 如果并发处理数已到达high值，设置状态为 pause，此时ping请求返回error，反向代理(nginx, haproxy)认为此程序有问题，不再转发请求到此程序
      globals.set('status', 'pause');
      /* istanbul ignore if */
      if (connectionLimitTimer) {
        clearTimeout(connectionLimitTimer);
        connectionLimitTimer = null;
      }
    } else if (globals.get('status') !== 'running') {
      // 状态为low或者mid时，延时5秒将服务设置回running
      connectionLimitTimer = setTimeout(() => {
        globals.set('status', 'running');
        connectionLimitTimer = null;
      }, interval);
      connectionLimitTimer.unref();
    }
  });
};
