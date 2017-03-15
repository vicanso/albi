'use strict';
const assert = require('assert');
const util = require('util');
require('../../helpers/local-require');

describe('errors', () => {
  it('get custom error', () => {
    const errors = localRequire('helpers/errors');
    const error = new Error('MY ERROR');
    error.status = 401;
    const err = errors.get(error);
    assert.equal(err.status, 401);
    assert.equal(err.message, 'MY ERROR');
    assert(err.expected);
  });

  it('get custom error with extra', () => {
    const errors = localRequire('helpers/errors');
    const err = errors.get('ERROR', {
      account: 'vicanso'
    });
    assert.equal(err.status, 500);
    assert.equal(err.message, 'ERROR');
    assert(err.expected);
    assert.equal(err.account, 'vicanso');
  });
});
