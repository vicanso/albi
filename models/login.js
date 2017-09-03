const mongoose = require('mongoose');

const {
  String,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    // 账号
    account: {
      type: String,
      required: true,
    },
    // token，每次登录唯一
    token: {
      type: String,
      required: true,
    },
    // 记录用户当时的user-agent
    userAgent: {
      type: String,
      required: true,
    },
    // ip地址
    ip: {
      type: String,
      required: true,
    },
    // track，跟踪用户的浏览器
    track: String,
    // 根据ip获取到的国家
    country: String,
    // 根据ip获取到的省份
    region: String,
    // 根据ip获取到的城市
    city: String,
    // 网络运营商
    isp: String,
    createdAt: {
      type: String,
      default: () => (new Date()).toISOString(),
    },
    // mongodb-update 的plugin会自动增加该字段
    updatedAt: String,
  },
  indexes: [
    {
      account: 1,
    },
    {
      createdAt: 1,
    },
    {
      account: 1,
      createdAt: 1,
    },
  ],
};
