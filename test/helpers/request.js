const assert = require('assert');

const request = localRequire('helpers/request');

describe('request', () => {
  it('get', (done) => {
    const req = request.get('https://www.baidu.com/');
    req.once('stats', (stats) => {
      assert(stats.use);
      assert(stats.host);
    });
    req.then((res) => {
      assert.equal(res.status, 200);
      done();
    }).catch(done);
  });
});
