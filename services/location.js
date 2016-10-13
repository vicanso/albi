const request = require('superagent');
const _ = require('lodash');

exports.byIP = (ip) => {
  const url = `http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=${ip}`;
  const keys = 'country province city'.split(' ');
  return request.get(url).then(res => _.pick(res.body), keys);
};

exports.byMobile = (mobile) => {
  const complete = (res) => {
    const reg = new RegExp(`${mobile}：(\\S+)\\s(\\S+)`, 'gi');
    const result = reg.exec(res.text);
    /* istanbul ignore if */
    if (!result || result.length < 2) {
      return null;
    }
    return {
      province: result[1],
      city: result[2],
    };
  };
  return request.post('http://ws.webxml.com.cn/WebServices/MobileCodeWS.asmx/getMobileCodeInfo')
    .send({
      mobileCode: mobile,
      userID: '',
    })
    .type('form')
    .then(complete);
};
