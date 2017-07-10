const _ = require('lodash');

const mongo = localRequire('helpers/mongo');

const applicationSetting = {
  adminToken: 'my-token',
  level: 5,
};

/**
 * Get the value of applcation setting
 */
exports.get = key => _.get(applicationSetting, key);

/**
 * Set the value for the application setting
 */
exports.set = async function setValue(key, value) {
  const Application = mongo.get('Application');
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
  const Application = mongo.get('Application');
  const doc = await Application.findOne({
    category: 'setting',
  });
  if (doc) {
    _.extend(applicationSetting, doc.toJSON());
  }
};
