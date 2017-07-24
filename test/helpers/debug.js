const assert = require('assert');

const debug = require('../../helpers/debug');

describe('debug', () => {
  it('debug function', () => {
    assert.equal(typeof debug, 'function');
  });
});
