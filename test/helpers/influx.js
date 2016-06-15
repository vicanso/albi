'use strict';
require('../../helpers/local-require');
const assert = require('assert');
const influx = localRequire('helpers/influx');

describe('influx', () => {
  it('write data to influxdb, sync now', done => {
    influx.write('http', {
      use: 50,
    }, {
      spdy: '0'
    }, true).then(data => {
      done();
    });
  });

  it('write data to influxdb, queue', () => {
    influx.write('http', {
      use: 50,
    }, {
      spdy: '0'
    });
    assert.equal(influx.client.writeQueueLength, 1);
  });
});