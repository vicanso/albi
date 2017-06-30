const assert = require('assert');

const errors = localRequire('helpers/errors');
const configs = localRequire('configs');

describe('errors', () => {
  it('get error', () => {
    const code = 1;
    const error = errors.get(code);
    assert(error.expected);
    assert.equal(error.status, 403);
    assert.equal(error.statusCode, 403);
    assert.equal(error.code, `${configs.app}-${code}`);
  });
});
