const mongoose = require('mongoose');

const {
  String,
  Number,
} = mongoose.Schema.Types;

module.exports = {
  // model的schema定义
  schema: {
    // 账号
    account: {
      type: String,
      required: true,
      unique: true,
    },
    // 密码，加密串
    password: {
      type: String,
      required: true,
    },
    // email，唯一的，用于取回密码等
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // 最近登录时间
    lastLoginedAt: {
      type: String,
      required: true,
      default: () => (new Date()).toISOString(),
    },
    // 权限 su admin等
    roles: [
      String,
    ],
    // 登录次数
    loginCount: {
      type: Number,
      required: true,
    },
    // ip地址
    ip: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: () => (new Date()).toISOString(),
    },
    // mongodb-update 的plugin会自动增加该字段
    updatedAt: String,
  },
};
