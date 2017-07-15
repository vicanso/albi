/* eslint import/no-extraneous-dependencies:0 */
import * as request from 'superagent';
import * as _ from 'lodash';
import HTTPTiming from 'http-timing';
import shortid from 'shortid';

import * as globals from './globals';
import debug from './debug';

const STATS_AJAX = '/api/stats/ajax';
const STATS_EXCEPTION = '/api/stats/exception';

const httpTiming = new HTTPTiming({
  max: 3 * 1000,
});

const APP_NAME = globals.get('CONFIG.app');
request.Request.prototype.version = function version(v) {
  this.set('Accept', `application/vnd.${APP_NAME}.v${v}+json`);
  return this;
};
request.Request.prototype.noCache = function noCache() {
  const method = this.method;
  // if get and head set Cache-Control:no-cache header
  // the If-None-Match field will not be added
  if (method === 'GET' || method === 'HEAD') {
    this.query({
      'cache-control': 'no-cache',
    });
  } else {
    this.set('Cache-Control', 'no-cache');
  }
  return this;
};

// request timeout(ms)
let requestTimeout = 5 * 1000;

export function timeout(ms) {
  if (_.isNumber(ms)) {
    requestTimeout = ms;
  }
  return requestTimeout;
}

// plugin for superagent
const plugins = [];
export function use(fn) {
  if (_.indexOf(plugins, fn) === -1) {
    plugins.push(fn);
  }
}


function defaultHandle(req, query) {
  if (requestTimeout) {
    req.timeout(requestTimeout);
  }
  req.sortQuery();
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

export function getTimingView() {
  return httpTiming.toHTML();
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
    if (_.isEmpty(data)) {
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
  const getProcessingTime = (serverTiming) => {
    if (!serverTiming) {
      return 0;
    }
    const result = serverTiming.match(/\S+?=(\d+\.\d+);/);
    if (!result || result.length < 2) {
      return 0;
    }
    return _.round(result[1]);
  };
  return (req) => {
    if (isReject(req.url)) {
      return;
    }
    const url = req.url;
    const method = req.method;
    const key = `${method}:${url}`;
    requestCount += 1;
    const requestId = requestCount;
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
    const options = {};
    let setTiming = null;
    const finished = _.once((res) => {
      if (res) {
        const serverTiming = res.get('Server-Timing');
        const processing = getProcessingTime(serverTiming);
        const cost = Date.now() - options.startedAt;
        _.extend(options, {
          use: cost,
          processing,
          network: cost - processing,
          status: res.status,
          hit: parseInt(res.get('X-Hits') || 0, 10),
        });
        setTiming(_.extend({
          serverTiming,
        }, _.pick(options, ['status', 'use'])));
        delete options.startedAt;
        statsAjax(options);
      }
    });
    req.once('request', () => {
      options.url = req.url;
      options.method = req.method;
      options.startedAt = Date.now();
      options.status = -1;
      setTiming = httpTiming.add(_.pick(options, ['method', 'url']));
    });

    req.once('error', finished);
    req.once('response', res => finished(res));
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
    'X-Request-Id': shortid(),
    'X-Requested-At': Date.now(),
  });
  if (!req.get('Accept')) {
    req.set('Accept', `application/vnd.${APP_NAME}.v1+json`);
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
