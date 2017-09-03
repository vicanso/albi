const assert = require('assert');
const Joi = require('joi');

require('../../app');
const {
  selfRequest,
} = require('../../helpers/utils');
const User = require('../supports/user');
const {
  getUrl,
} = require('../supports/utils');

describe('controllers/system', () => {
  const user = new User({
    account: 'vicanso',
  });

  it('init', async () => {
    await user.login();
  });

  it('get system status', () => selfRequest('get', '/api/sys/status')
    .then((res) => {
      const result = Joi.validate(res.body, {
        connectingTotal: Joi.number().integer(),
        status: Joi.string(),
        version: Joi.object(),
        uptime: Joi.string(),
        startedAt: Joi.string(),
      });
      assert(!result.error);
    }));

  it('resume/pause the appliction', async () => {
    let res = await user.agent.put(getUrl('/sys/resume'));
    assert.equal(res.status, 204);
    res = await user.agent.get(getUrl('/api/sys/status'));
    assert.equal(res.body.status, 'running');
    res = await user.agent.put(getUrl('/sys/pause'));
    assert.equal(res.status, 204);
    res = await user.agent.get(getUrl('/api/sys/status'));
    assert.equal(res.body.status, 'pause');
  });

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
        status: 201,
        response: {
          result: 'success',
        },
      }).then((res) => {
        assert.equal(res.status, 201);
      });
  });
});
