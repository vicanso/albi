const _ = require('lodash');

const applicationSetting = {
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
  _.set(applicationSetting, key, value);
};

