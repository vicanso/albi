const mongoose = require('mongoose');

const {
  String,
} = mongoose.Schema.Types;

module.exports = {
  schema: {
    account: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    track: {
      type: String,
      required: true,
    },
    country: String,
    region: String,
    city: String,
    isp: String,
  },
  indexes: [
    {
      account: 1,
    },
    {
      createdAt: 1,
    },
    {
      account: 1,
      createdAt: 1,
    },
  ],
};
