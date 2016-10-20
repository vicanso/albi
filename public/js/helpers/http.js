import * as request from 'superagent';
import * as _ from 'lodash';
import * as uuid from 'node-uuid';

import * as globals from './globals';
import {
  STATS_AJAX,
  STATS_EXCEPTION,
} from '../constants/urls';
import debug from './debug';

request.Request.prototype.version = function (v) {
  this.set('Accept', `application/vnd.app-name.v${v}+json`);
  return this;
};

// request timeout(ms)
export const timeout = 0;
// plugin for superagent
const plugins = [];
export function use(fn) {
  if (_.indexOf(plugins, fn) === -1) {
    plugins.push(fn);
  }
}

function defaultHandle(req, query) {
  if (timeout) {
    req.timeout(timeout);
  }
  if (query) {
    req.query(query);
  }
  _.forEach(plugins, plugin => req.use(plugin));
  return req;
}

export function get(url, query) {
  const req = request.get(url);
  return defaultHandle(req, query);
}

export function del(url, query) {
  const req = request.del(url);
  return defaultHandle(req, query);
}

export function post(url, data, query) {
  const req = request.post(url);
  defaultHandle(req, query);
  if (data) {
    req.send(data);
  }
  return req;
}

export function put(url, data, query) {
  const req = request.put(url);
  defaultHandle(req, query);
  if (data) {
    req.send(data);
  }
  return req;
}

export function patch(url, data, query) {
  const req = request.patch(url);
  defaultHandle(req, query);
  if (data) {
    req.send(data);
  }
  return req;
}

function createDebouncePost(url, interval = 3000) {
  const dataList = [];
  const debouncePost = _.debounce(() => {
    post(url, dataList.slice())
      .then(() => console.info(`debounce post:${url} success`))
      .catch(err => console.error(`debounce post:${url} fail, %s`, err));
    dataList.length = 0;
  }, interval);

  return (data) => {
    if (!data) {
      return;
    }
    if (_.isArray(data)) {
      dataList.push(...data);
    } else {
      dataList.push(data);
    }
    debouncePost();
  };
}

const statsAjax = createDebouncePost(STATS_AJAX);
const statsException = createDebouncePost(STATS_EXCEPTION, 1000);

function stats() {
  let requestCount = 0;
  const doingRequest = {};
  // 对于/sys/, /stats/的请求不统计性能
  const rejectUrls = ['/api/sys/', '/api/stats/'];
  debug('rejectUrls:%j', rejectUrls);
  const isReject = url => !!_.find(rejectUrls, item => url.indexOf(item) === 0);
  return (req) => {
    const url = req.url;
    const method = req.method;
    const key = `${method}:${url}`;
    requestCount += 1;
    const requestId = requestCount;
    const start = Date.now();
    debug('request [%d] %s', requestId, key);
    if (!doingRequest[key]) {
      doingRequest[key] = 0;
    }
    doingRequest[key] += 1;
    const count = doingRequest[key];
    if (count > 1) {
      debug('parallelRequest:%s', key);
      statsException({
        key,
        count,
        type: 'parallelRequest',
      });
    }
    req.once('error', () => {
      doingRequest[key] -= 1;
    });
    req.once('response', (res) => {
      doingRequest[key] -= 1;
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
}

// add http stats
use(stats());

// url for appurl
const appUrlPrefix = globals.get('CONFIG.appUrlPrefix');
if (appUrlPrefix) {
  use((req) => {
    if (req.url.charAt(0) === '/') {
      /* eslint no-param-reassign:0 */
      req.url = appUrlPrefix + req.url;
    }
    return req;
  });
}
// add default request header
use((req) => {
  req.set({
    'X-Requested-With': 'XMLHttpRequest',
    'X-Request-Id': uuid.v4(),
    'X-Requested-At': Date.now(),
  });
  if (!req.get('Accept')) {
    req.set('Accept', `application/vnd.${globals.get('CONFIG.app')}.v1+json`);
  }
  return req;
});
// development warning alert
if (globals.get('CONFIG.env') === 'development') {
  use((req) => {
    req.once('response', (res) => {
      const warning = res.get('Warning');
      if (warning) {
        /* eslint no-alert:0 no-undef:0 */
        alert(warning);
      }
    });
  });
}