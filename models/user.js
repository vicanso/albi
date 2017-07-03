const mongoose = require('mongoose');

const {
  String,
  Number,
} = mongoose.Schema.Types;

module.exports = {
  // model的schema定义
  schema: {
    account: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
      default: () => (new Date()).toISOString(),
    },
    updatedAt: {
      type: String,
      required: true,
      default: () => (new Date()).toISOString(),
    },
    lastLoginedAt: {
      type: String,
      required: true,
      default: () => (new Date()).toISOString(),
    },
    loginCount: {
      type: Number,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
  },
  // model的index配置
  indexes: [
    {
      account: 1,
    },
  ],
};
