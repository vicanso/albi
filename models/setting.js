const mongoose = require('mongoose');

const {
  String,
  Mixed,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    // 应用配置名称，用于区分不同的配置
    name: {
      type: String,
      unique: true,
    },
    createdAt: {
      type: String,
      default: () => (new Date()).toISOString(),
    },
    // 该配置是否禁用状态
    disabled: {
      type: Boolean,
      default: false,
    },
    data: Mixed,
    creator: {
      type: String,
      required: true,
    },
    // mongodb-update 的plugin会自动增加该字段
    updatedAt: String,
    description: String,
  },
};
