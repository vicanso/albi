const assert = require('assert');

const debug = localRequire('helpers/debug');

describe('debug', () => {
  it('debug function', () => {
    assert.equal(typeof debug, 'function');
  });
});
