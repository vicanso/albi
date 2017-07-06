const _ = require('lodash');

const mongodb = localRequire('helpers/mongodb');

const applicationSetting = {
  adminToken: 'my-token',
  level: 5,
};

/**
 * Get the value of applcation setting
 */
exports.get = key => _.get(applicationSetting, key);

exports.set = async function set(key, value) {
  const Application = mongodb.get('Application');
  await Application.findOneAndUpdate({
    category: 'setting',
  }, {
    $set: {
      [key]: value,
    },
  }, {
    upsert: true,
  });
  _.set(applicationSetting, key, value);
};

/**
 * Update the application setting
 */
exports.update = async function update() {
  const Application = mongodb.get('Application');
  const doc = await Application.findOne({
    category: 'setting',
  });
  if (doc) {
    _.extend(applicationSetting, doc.toJSON());
  }
};
