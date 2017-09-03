const mongoose = require('mongoose');

const {
  String,
  Number,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    category: {
      type: String,
      required: true,
      unique: true,
    },
    value: Number,
    createdAt: {
      type: String,
      default: () => (new Date()).toISOString(),
    },
    // mongodb-update 的plugin会自动增加该字段
    updatedAt: String,
  },
  indexes: [
    {
      categoy: 1,
    },
  ],
};
