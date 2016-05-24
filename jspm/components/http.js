'use strict';
import * as request from 'superagent';
import * as _ from 'lodash';
/* eslint import/no-unresolved:0 */
import * as uuid from 'uuid';
import * as globals from './globals';
import debug from './debug';

// timeout ms
export const timeout = 0;
// plugin for superagent
const plugins = [];
export const use = (fn) => {
  if (!~_.indexOf(plugins, fn)) {
    plugins.push(fn);
  }
};

// default handle for http request
const defaultHandle = (req) => {
  if (timeout) {
    req.timeout(timeout);
  }
  _.forEach(plugins, plugin => req.use(plugin));
  return req;
};

function requestThen(resolve, reject) {
  defaultHandle(this);
  /* eslint no-underscore-dangle:0 */
  if (!this._fullfilledPromise) {
    /* eslint no-underscore-dangle:0 */
    this._fullfilledPromise = new Promise((innerResolve, innerReject) => {
      this.end((err, res) => {
        if (err) {
          innerReject(err);
        } else {
          innerResolve(res);
        }
      });
    });
  }
  /* eslint no-underscore-dangle:0 */
  return this._fullfilledPromise.then(resolve, reject);
};

const done = (req, query) => {
  if (query) {
    req.query(query);
  }
  /* eslint no-param-reassign: 0*/
  req.then = requestThen.bind(req);
  return req;
};
// request get
export const get = (url, query) => {
  const req = request.get(url);
  return done(req, query);
};
// request delete
export const del = (url, query) => {
  const req = request.del(url);
  return done(req, query);
};
// request post
export const post = (url, data, query) => {
  const req = request.post(url);
  if (data) {
    req.send(data);
  }
  return done(req, query);
};
// request put
export const put = (url, data, query) => {
  const req = request.put(url);
  if (data) {
    req.send(data);
  }
  return done(req, query);
};
// request patch
export const patch = (url, data, query) => {
  const req = request.patch(url);
  if (data) {
    req.send(data);
  }
  return done(req, query);
};

const getDebouncePost = (url, ms) => {
  const interval = ms || 3000;
  const dataList = [];
  const debouncePost = _.debounce(() => {
    post(url, dataList.slice())
      .then(() => {
        console.info(`debounce post:${url} success`);
      })
      .catch(err => {
        console.error(`debounce post:${url} fail, %s`, err);
      });
    dataList.length = 0;
  }, interval);
  return (data) => {
    if (!data) {
      return;
    }
    if (_.isArray(data)) {
      dataList.push.apply(dataList, data);
    } else {
      dataList.push(data);
    }
    debouncePost();
  };
};

const statsAjax = getDebouncePost('/stats/ajax');
const statsException = getDebouncePost('/stats/exception', 1000);

// http request stats
const stats = () => {
  let requestCount = 0;
  const doingRequest = {};
  // 对于/sys/, /stats/的请求不统计性能
  const rejectUrls = ['/sys/', '/stats/'];
  debug('rejectUrls:%j', rejectUrls);
  const isReject = url => !!_.find(rejectUrls, item => url.indexOf(item) === 0);
  return (req) => {
    const url = req.url;
    const method = req.method;
    const key = `${method}:${url}`;
    const requestId = ++requestCount;
    const start = Date.now();
    debug('request [%d] %s', requestId, key);
    if (!doingRequest[key]) {
      doingRequest[key] = 0;
    }
    const count = ++doingRequest[key];
    if (count > 1) {
      debug('parallelRequest:%s', key);
      statsException({
        key,
        count,
        type: 'parallelRequest',
      });
    }
    req.once('error', () => {
      --doingRequest[key];
    });
    req.once('response', res => {
      --doingRequest[key];
      if (isReject(url)) {
        return;
      }
      const data = {
        method,
        url,
        use: Date.now() - start,
        status: res.status,
        hit: parseInt(res.get('X-Hits') || 0, 10),
      };
      statsAjax(data);
    });
  };
};

const init = () => {
  use(stats());
  // url for appurl
  const appUrlPrefix = globals.get('CONFIG.appUrlPrefix');
  if (appUrlPrefix) {
    use(req => {
      if (req.url.charAt(0) === '/') {
        req.url = appUrlPrefix + req.url;
      }
      return req;
    });
  }
  // add default request header
  use(req => {
    req.set({
      'X-Requested-With': 'XMLHttpRequest',
      'X-Request-Id': uuid.v4(),
      'X-Requested-At': Date.now(),
    });
    return req;
  });
  // development warning alert
  if (globals.get('CONFIG.env') === 'development') {
    use(req => {
      req.once('response', res => {
        const warning = res.get('Warning');
        if (warning) {
          /* eslint no-alert:0 */
          alert(warning);
        }
      });
    });
  }
};

init();
