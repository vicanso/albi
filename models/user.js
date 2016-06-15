'use strict';
module.exports = {
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
    createdAt: {
      type: String,
      required: true,
    },
    lastLoginedAt: {
      type: String,
      required: true,
    },
    loginCount: {
      type: Number,
      required: true,
    },
  },
  indexes: [
    {
      account: 1,
    },
  ],
};
