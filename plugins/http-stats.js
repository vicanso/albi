const stringify = require('simple-stringify');
const _ = require('lodash');

/**
 * HTTP Request stats
 *
 * @param {Request} req Superagent request
 */
function httpStats(req) {
  const stats = {};
  const finished = _.once(() => {
    // get the use time of request
    stats.use = Date.now() - stats.startedAt;
    delete stats.startedAt;
    if (stats.error) {
      console.error(stringify.json(stats));
    } else {
      console.info(stringify.json(stats));
    }
    req.emit('stats', stats);
  });
  req.once('request', () => {
    /* eslint no-underscore-dangle:0 */
    const sendData = req._data;
    Object.assign(stats, {
      host: req.host,
      path: req.req.path,
      method: req.method,
      startedAt: Date.now(),
    });
    const backendServer = req.backendServer;
    if (backendServer) {
      Object.assign(stats, _.pick(backendServer, ['ip', 'port']));
    }
    if (sendData && !_.isEmpty(sendData)) {
      stats.data = stringify.json(sendData);
    }
  });
  req.once('error', (err) => {
    stats.code = -1;
    stats.error = err.message;
    finished();
  });
  req.once('response', (res) => {
    stats.code = res.statusCode;
    finished();
  });
}

module.exports = httpStats;
