const assert = require('assert');
const Joi = require('joi');
const _ = require('lodash');

localRequire('app');
const {
  selfRequest,
} = localRequire('helpers/utils');
const setting = localRequire('configs/setting');

describe('controllers/system', () => {
  const randomLevel = _.random(5);
  it('set system level', () => selfRequest('put', '/api/sys/level')
    .send({
      level: randomLevel,
    })
    .set('Auth-Token', setting.get('adminToken')).then((res) => {
      assert.equal(res.status, 204);
    }));

  it('get system level', () => selfRequest('get', '/api/sys/level')
    .then((res) => {
      assert.equal(res.status, 200);
      assert.equal(res.body.level, randomLevel);
    }));

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

  it('resume/pause the application', () => selfRequest('put', '/api/sys/resume')
    .set('Auth-Token', setting.get('adminToken'))
    .then((res) => {
      assert.equal(res.status, 204);
      return selfRequest('get', '/api/sys/status');
    })
    .then((res) => {
      assert.equal(res.body.status, 'running');
      return selfRequest('put', '/api/sys/pause')
        .set('Auth-Token', setting.get('adminToken'));
    })
    .then(() => selfRequest('get', '/api/sys/status'))
    .then((res) => {
      assert.equal(res.body.status, 'pause');
    }));
});
