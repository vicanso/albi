'use strict';
require('../../helpers/local-require');
const assert = require('assert');
const location = localRequire('services/location');


describe('services/location', () => {
  it('get location by ip', function(done) {
    this.timeout(10 * 1000);
    location.byIP('202.96.128.86').then(data => {
      assert.equal(data.country, '中国');
      assert.equal(data.province, '广东');
      assert.equal(data.city, '广州');
      done();
    }).catch(done);
  });

  it('get location by mobile', function(done) {
    this.timeout(10 * 1000);
    location.byMobile('13800138000').then(data => {
      assert.equal(data.province, '北京');
      assert.equal(data.city, '北京');
      done();
    }).catch(done);
  });
});