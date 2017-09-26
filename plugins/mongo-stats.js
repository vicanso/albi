const _ = require('lodash');
const stringify = require('simple-stringify');

const influx = require('../helpers/influx');

function writeStats(data) {
  const keys = ['model', 'op'];
  const spdy = _.sortedIndex([100, 300, 1000, 3000], data.use);
  influx.write('mongo', _.omit(data, keys), _.extend({
    spdy,
  }, _.pick(data, keys)));
}

function stats(schema, model) {
  function addStartedAt(next) {
    if (!this.startedAt) {
      this.startedAt = Date.now();
    }
    next();
  }

  function addQueryStats(data) {
    const use = Date.now() - this.startedAt;
    // 该操作修改(查询)的数量
    let size = data ? 1 : 0;
    if (this.op === 'count') {
      size = data;
    } else if (_.isArray(data)) {
      size = data.length;
    }
    const result = {
      op: this.op,
      model,
      options: stringify.json(this.options),
      use,
      size,
    };
    _.forEach(['_conditions', '_fields', '_update'], (key) => {
      const value = _.get(this, key);
      if (!_.isEmpty(value)) {
        result[key.substring(1)] = stringify.json(value, 2);
      }
    });
    writeStats(result);
  }
  const fns = [
    'find',
    'findOne',
    'findOneAndUpdate',
    'findOneAndRemove',
    'count',
  ];
  _.forEach(fns, (fn) => {
    schema.pre(fn, addStartedAt);
    schema.post(fn, addQueryStats);
  });

  schema.pre('save', addStartedAt);
  schema.post('save', (doc) => {
    writeStats({
      model,
      op: 'save',
      use: Date.now() - doc.startedAt,
      size: 1,
    });
  });
}

module.exports = stats;
