'use strict';
require('../../helpers/local-require');
const assert = require('assert');
const globals = localRequire('helpers/globals');

describe('globals', () => {
  it('status', () => {
    assert.equal(globals.get('status'), 'running');
    globals.set('status', 'pause');
    assert.equal(globals.get('status'), 'pause');
    globals.set('status', 'running');
  });
});