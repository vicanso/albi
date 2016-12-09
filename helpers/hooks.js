const ulid = require('ulid');
const _ = require('lodash');

const influx = localRequire('helpers/influx');

function writeStats(f, t) {
  const fields = f;
  const tags = t;
  const spdy = _.sortedIndex([30, 100, 300, 600, 1000], fields.use);
  tags.spdy = `${spdy}`;
  fields.use = `${fields.use}i`;
  influx.write('mongoose', fields, tags);
}

// mongoose save stats
function createSaveStats(name) {
  return {
    pre: function preSave(next) {
      if (!this.startedAt) {
        this.startedAt = Date.now();
      }
      next();
    },
    post: function postSave() {
      /* eslint no-underscore-dangle:0 */
      const id = this._id.toString();
      const use = Date.now() - this.startedAt;
      const tags = {
        collection: name,
        op: 'save',
      };
      const fields = {
        use,
        id,
      };
      writeStats(fields, tags);
    },
  };
}

// normal mongoose stats: collection, use, op
function createNormalStats(name) {
  return {
    pre: function pre(next) {
      if (!this.startedAt) {
        this.startedAt = Date.now();
      }
      next();
    },
    post: function post() {
      const use = Date.now() - this.startedAt;
      const tags = {
        collection: name,
        op: this.op,
      };
      const fields = {
        use,
      };
      writeStats(fields, tags);
    },
  };
}

function fillData(opts, data) {
  const result = data;
  _.forEach(opts, (type, key) => {
    if (data[key]) {
      return;
    }
    switch (type) {
      case 'date':
        result[key] = new Date().toISOString();
        break;
      case 'ulid':
        result[key] = ulid();
        break;
      default:
        return;
    }
  });
}

function createUpdateHook(opts) {
  return function updateHook(next) {
    /* eslint no-underscore-dangle:0 */
    const data = this._update;
    fillData(opts, data);
    if (data.$inc) {
      data.$inc.__v = 1;
    } else {
      data.$inc = {
        __v: 1,
      };
    }
    next();
  };
}

function createValidateHook(opts) {
  return function validateHook(next) {
    fillData(opts, this);
    next();
  };
}

exports.getStatisticsHooks = (name) => {
  const saveHoook = createSaveStats(name);
  const normalHook = createNormalStats(name);
  return {
    save: saveHoook,
    findOne: normalHook,
    findOneAndUpdate: normalHook,
    findOneAndRemove: normalHook,
    count: normalHook,
    find: normalHook,
  };
};

exports.createUpdateHook = createUpdateHook;
exports.createValidateHook = createValidateHook;
