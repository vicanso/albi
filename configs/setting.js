const _ = require('lodash');

let applicationSetting = null;

exports.get = key => _.get(applicationSetting, key);

exports.reset = (data) => {
  applicationSetting = _.clone(data);
};
