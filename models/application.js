const mongoose = require('mongoose');

const {
  String,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    category: {
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
  },
  options: {
    strict: false,
  },
};
