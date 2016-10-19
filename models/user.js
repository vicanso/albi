function beforeValidate(next) {
  console.info(`${this.account} before validate`);
  next();
}

function afterValidate(doc) {
  console.info(`${doc.account} after validate`);
}

function get(conditions) {
  return this.find(conditions);
}

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
    email: {
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
    ip: {
      type: String,
      required: true,
    },
  },
  indexes: [
    {
      account: 1,
    },
  ],
  pre: {
    validate: [
      beforeValidate,
    ],
  },
  post: {
    validate: [
      afterValidate,
    ],
  },
  static: {
    get,
  },
};
