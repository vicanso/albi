'use strict';
require('../../helpers/local-require');
const util = require('util');
const assert = require('assert');
const utils = localRequire('helpers/utils');
describe('utils', () => {
  it('get param', () => {
    const param = utils.getParam(['a', 1], util.isNumber);
    assert.equal(param, 1);
  });

  it('get param with default value', () => {
    const param = utils.getParam(['a', '1'], util.isNumber, 2);
    assert.equal(param, 2);
  });
});
