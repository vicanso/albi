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
  },
  options: {
    strict: false,
  },
};
