const assert = require('assert');

const errors = require('../../helpers/errors');
const configs = require('../../configs');

describe('errors', () => {
  it('get error', () => {
    const code = 1;
    const err = errors.get('common.tokenInvalid');
    assert(err.expected);
    assert.equal(err.status, 403);
    assert.equal(err.statusCode, 403);
    assert.equal(err.code, `${configs.app}-${code}`);
  });

  it('create undefined error', () => {
    const err = errors.create('Custom error');
    assert.equal(err.status, 500);
    assert.equal(err.message, 'Custom error');
  });
});
