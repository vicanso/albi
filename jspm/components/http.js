'use strict';
import * as request from 'superagent';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import * as globals from './globals';

request.Request.prototype.then = function(resolve, reject) {
  const self = this;
  if (!self._fullfilledPromise) {
    self._fullfilledPromise = new Promise((innerResolve, innerReject) => {
      this.end(function(err, res){
        if (err) {
          innerReject(err);
        } else {
          innerResolve(res);
        }
      });
    });
  }
  return self._fullfilledPromise.then(resolve, reject);
};

// timeout ms
export let timeout = 0;
// plugin for superagent
const plugins = [];
export const use = (fn) => {
  if(!~_.indexOf(plugins, fn)) {
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
// request get
export const get = (url, query) => {
  const req = request.get(url);
  if (query) {
    req.query(query);
  }
  return req;
};
// request post
export const post = (url, data, query) => {
  const = request.post(url);
  if (data) {
    req.send(data);
  }
  if (query) {
    req.query(query);
  }
  return req;
};

// http request stats
const stats = () => {
  let requestCount = 0;
  const doningRequest = {};
  return (req) => {

  };
};

const init = () => {
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
      'X-UUID': uuid.v4(),
    });
    return req;
  });
  
  use(stats());
};

init();
