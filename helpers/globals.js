const _ = require('lodash');

const globals = {
  // running, pause
  status: 'running',
  // handling request count
  connectingTotal: 0,
  performance: {
    // 参考middlewares/http-stats
    http: null,
  },
};

exports.get = k => _.get(globals, k);

exports.set = (k, v) => _.set(globals, k, v);
