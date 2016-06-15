'use strict';
const request = require('superagent');
const _ = require('lodash');

exports.byIP = (ip) => request.get(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=${ip}`).then(res => {
  return _.pick(res.body, 'country province city'.split(' '));
});

exports.byMobile = (mobile) => {
  return request.post('http://ws.webxml.com.cn/WebServices/MobileCodeWS.asmx/getMobileCodeInfo')
    .send({
      mobileCode: mobile,
      userID: '',
    })
    .type('form')
    .then(res => {
      const reg = new RegExp(mobile + '：(\\S+)\\s(\\S+)', 'gi');
      const result = reg.exec(res.text);
      /* istanbul ignore if */
      if (!result || result.length < 2) {
        return null;
      }
      return {
        province: result[1],
        city: result[2],
      };
    });
};
