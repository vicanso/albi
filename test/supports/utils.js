const configs = require('../../configs');

function getUrl(url) {
  return `http://127.0.0.1:${configs.port}${url}`;
}

exports.getUrl = getUrl;
