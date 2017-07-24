const request = require('superagent');

const httpStats = require('../plugins/http-stats');

exports.timeout = 5 * 1000;


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
