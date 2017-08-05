const httpPerf = require('http-performance');
const _ = require('lodash');

const influx = require('./influx');

httpPerf.disable('request');
httpPerf.disable('response');

exports.start = function start() {
  httpPerf.enable('request');
  httpPerf.on('stats', (stats) => {
    const tags = _.pick(stats, [
      'category',
      'type',
      'method',
      'host',
    ]);
    const fields = _.extend(_.pick(stats, [
      'requesting',
      'url',
      'status',
      'bytes',
    ]), stats.timing);
    if (stats.dns) {
      fields.ip = stats.dns.ip;
    }
    tags.spdy = _.sortedIndex([100, 300, 1000, 3000], fields.all);
    influx.write('http', fields, tags);
  });
};
