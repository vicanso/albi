'use strict';
const util = require('util');
const assert = require('assert');

require('../../helpers/local-require');
describe('bluebird', () => {
  it('use bluebird instead of global promise', () => {
    localRequire('helpers/bluebird');
    assert(Promise.promisify);
    assert(util.isFunction(Promise.promisify));
  });
});
