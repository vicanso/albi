const _ = require('lodash');

const errors = require('../helpers/errors');
const request = require('../helpers/request');

exports.byIP = function getLocationByIP(ip) {
  const url = 'http://ip.taobao.com/service/getIpInfo.php';
  return request.get(url)
    .set('Accept', 'application/json')
    .query({
      ip,
    })
    .then((res) => {
      try {
        const info = JSON.parse(res.text);
        if (info.code !== 0) {
          throw errors.get('common.ipLocationFail');
        }
        const result = {};
        _.forEach(['country', 'region', 'city', 'isp'], (key) => {
          result[key] = info.data[key] || '-';
        });
        return result;
      } catch (err) {
        console.error(`parse ip info fail, ${err.message}`);
        throw errors.get('common.ipLocationFail');
      }
    });
};
