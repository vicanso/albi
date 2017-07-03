const request = require('superagent');
const stringify = require('simple-stringify');
const _ = require('lodash');

exports.timeout = 5 * 1000;

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

/**
 * Add default handle, timeout and httpStats
 *
 * @param {Request} req Superagent request
 */
function defaultHandle(req) {
  req.timeout(exports.timeout);
  httpStats(req);
}

/**
 * Superagent http get
 */
exports.get = (...args) => {
  const req = request.get(...args);
  defaultHandle(req);
  return req;
};

/**
 * Superagent http post
 */
exports.post = (...args) => {
  const req = request.post(...args);
  defaultHandle(req);
  return req;
};

/**
 * Superagent http put
 */
exports.put = (...args) => {
  const req = request.put(...args);
  defaultHandle(req);
  return req;
};

/**
 * Superagent http delete
 */
exports.delete = (...args) => {
  const req = request.delete(...args);
  defaultHandle(req);
  return req;
};

/**
 * Superagent http patch
 */
exports.patch = (...args) => {
  const req = request.patch(...args);
  defaultHandle(req);
  return req;
};
