const mongoose = require('mongoose');

const {
  String,
  Number,
  Mixed,
  Boolean,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    account: String,
    url: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Number,
      default: 500,
    },
    response: Mixed,
    description: String,
    createdAt: {
      type: String,
      default: () => (new Date()).toISOString(),
    },
    creator: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // mongodb-update 的plugin会自动增加该字段
    updatedAt: String,
  },
  indexes: [
    {
      url: 1,
    },
  ],
};
