'use strict';
const request = require('superagent-extend');
const _ = require('lodash');
const util = require('util');
const sdc = localRequire('helpers/sdc');
var processing = 0;
var processedTotal = 0;


exports.get = get;

request.timeout(10 * 1000);

request.on('request', function (req) {
  processing++;
  processedTotal++;
  sdc.increment('request.processing');
  req._startAt = Date.now();
});

request.on('complete', function (req, res) {
  processing--;
  let use = Date.now() - req._startAt;
  let statusCode = res.status;

  let length = _.get(res, 'headers.content-length') || _.get(res,
    'text.length') || 0;
  let str = util.format('request "%s %s" %d %d %dms %d-%d', req.method, req
    .url, statusCode, length, use, processing, processedTotal);

  sdc.decrement('request.processing');
  sdc.increment('request.status.' + statusCode);
  sdc.timing('request.use', use);
  console.info(str);

});


/**
 * [get 请求数据]
 * @param  {[type]} url     [description]
 * @param  {[type]} headers [description]
 * @return {[type]}         [description]
 */
function* get(url, headers) {
  let req = request.get(url);
  _.forEach(headers, function (v, k) {
    req.set(k, v);
  });
  let res;
  try {
    res = yield req.done();
  } catch (e) {
    err.type = 'http-request';
    err.extra = req.url;
    throw err;
  }
  return res;
}
