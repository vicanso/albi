const assert = require('assert');

localRequire('app');
const {
  selfRequest,
} = localRequire('helpers/utils');

describe('common request', () => {
  it('timeout', function timeout() {
    this.timeout(10 * 1000);
    return selfRequest('post', '/api/sys/mock')
      .send({
        delay: 5000,
      }).catch((err) => {
        assert.equal(err.status, 408);
      });
  });

  it('timeout disable', function timeoutDisable() {
    this.timeout(10 * 1000);
    return selfRequest('post', '/api/sys/mock?disableTimeout')
      .send({
        delay: 5000,
      }).then((res) => {
        assert.equal(res.status, 204);
      });
  });
});
