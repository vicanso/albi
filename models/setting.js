const mongoose = require('mongoose');

const {
  String,
  Mixed,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    // 应用配置，category用于区分不同的配置
    category: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: () => (new Date()).toISOString(),
    },
    data: Mixed,
    creator: {
      type: String,
      required: true,
    },
    // mongodb-update 的plugin会自动增加该字段
    updatedAt: String,
  },
};
