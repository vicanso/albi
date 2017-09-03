const mongoose = require('mongoose');

const {
  String,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    name: {
      type: String,
      required: true,
    },
    // 该字段分类，方便可以直接把所有分类的取出
    category: {
      type: String,
      required: true,
    },
    // 英文
    en: String,
    // 中文
    zh: String,
    createdAt: {
      type: String,
      default: () => (new Date()).toISOString(),
    },
    creator: {
      type: String,
      required: true,
    },
    // mongodb-update 的plugin会自动增加该字段
    updatedAt: String,
  },
  indexes: [
    {
      category: 1,
    },
    {
      name: 1,
    },
    {
      category: 1,
      name: 1,
      unique: true,
    },
  ],
};
