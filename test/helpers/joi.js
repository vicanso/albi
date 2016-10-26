'use strict';
const assert = require('assert');
const util = require('util');
require('../../helpers/local-require');
localRequire('helpers/joi');
const Joi = require('joi');

describe('joi', () => {
  it('add validateThrow function', () => {
    assert(util.isFunction(Joi.validateThrow));
  });
  it('validate success', () => {
    const data = Joi.validateThrow({name: '1'}, {name: Joi.number()});
    assert(data.name === 1);
  });

  it('will throw an error', done => {
    Promise.resolve().then(() => {
      Joi.validateThrow({}, {
        name: Joi.string().required()
      });
    }).catch(err => {
      assert.equal(err.status, 400);
      assert.equal(err.code, 99999);
      assert.equal(err.expected, true);
      done();
    });
  });
});
