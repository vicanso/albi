const mongoose = require('mongoose');

const {
  String,
  Mixed,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    // 数据类别（如server, http, influxdb-warner 等）
    category: {
      type: String,
      require: true,
    },
    // 该配置名称
    name: {
      type: String,
      require: true,
    },
    createdAt: {
      type: String,
      default: () => (new Date()).toISOString(),
    },
    creator: {
      type: String,
      required: true,
    },
    data: Mixed,
  },
};
