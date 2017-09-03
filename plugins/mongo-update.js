const _ = require('lodash');

function update(schema) {
  schema.add({
    updatedAt: {
      type: String,
    },
  });
  schema.pre('findOneAndUpdate', function preUpdate(next) {
    /* eslint no-underscore-dangle:0 */
    const data = this._update;
    data.updatedAt = (new Date()).toISOString();
    if (_.get(data, '$inc.__v')) {
      next();
      return;
    }
    if (_.has(data, '$setOnInsert.__v')) {
      delete data.$setOnInsert.__v;
    }
    if (_.isEmpty(data.$setOnInsert)) {
      delete data.$setOnInsert;
    }
    if (data.$inc) {
      data.$inc.__v = 1;
    } else {
      data.$inc = {
        __v: 1,
      };
    }
    next();
  });
}

module.exports = update;
