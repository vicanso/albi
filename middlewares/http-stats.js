'use strict';
let requestTotal = 0;
let handlingReqTotal = 0;

module.exports = httpStats;

function *httpStats(next) {
  let start = Date.now();
  handlingReqTotal++;
  requestTotal++;
  let ctx = this;
  let res = ctx.res;
  let onfinish = done.bind(null, 'finish');
  let onclose = done.bind(null, 'close');
  res.once('finish', onfinish);
  res.once('close', onclose);
  function done(event){
    handlingReqTotal--;
    res.removeListener('finish', onfinish);
    res.removeListener('close', onclose);
  }
  yield next;
}
