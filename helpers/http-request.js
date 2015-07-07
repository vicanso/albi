'use strict';
const request = require('superagent');
const _ = require('lodash');
const util = require('util');

exports.get = get;
exports.timeout = 10 * 1000;
let processing = 0;
let processedTotal = 0;
/**
 * [get description]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */
function *get(url, headers) {
  let req = request.get(url);
  _.forEach(headers, function (v, k) {
    req.set(k, v);
  });
  return yield handle(req);
}


function *handle(req) {
  let res = {};
  let start = Date.now();
  processing++;
  processedTotal++;
  try {
    res = yield function (done) {
      req.timeout(exports.timeout).end(done);
    };
  } catch (err) {
    throw err;
  } finally {
    processing--;
    let statusCode = res.statusCode || 0;
    let length = _.get(res, 'headers.content-length') || _.get(res, 'text.length') || 0;
    let str = util.format('request "%s %s" %d %d %dms %d-%d', req.method, req.url, statusCode, length, Date.now() - start, processing, processedTotal);
    console.info(str);
  }

  if (!_.isEmpty(res.body)) {
    return res.body;
  } else {
    return res.text;
  }
}
