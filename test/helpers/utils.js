const assert = require('assert');

const utils = localRequire('helpers/utils');

describe('utils', () => {
  it('get param', () => {
    assert.equal(utils.getParam(['1', 'b'], Number.isInteger, 1), 1);
    const arr = ['a'];
    assert.equal(utils.getParam(['b', {}, arr], Array.isArray), arr);
  });
});
