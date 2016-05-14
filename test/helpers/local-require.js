'use strict';
const assert = require('assert');

describe('localRequire', () => {
  it('add local require for the application', () => {
    const obj1 = require('../../helpers/local-require');
    const obj2 = localRequire('helpers/local-require');
    assert.equal(obj1, obj2);
  });
});
