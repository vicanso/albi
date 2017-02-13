const schemas = {
  mongoose: {
    fields: {
      use: 'integer',
      id: 'string',
    },
    options: {
      stripUnknown: true,
    },
  },
  deprecate: {
    fields: {
      path: 'string',
    },
    options: {
      stripUnknown: true,
    },
  },
  httpRoute: {
    fields: {
      use: 'integer',
    },
    options: {
      stripUnknown: true,
    },
  },
  excetion: {
    fields: {
      code: 'integer',
      path: 'string',
    },
    options: {
      stripUnknown: true,
    },
  },
  http: {
    fields: {
      connecting: 'integer',
      total: 'integer',
      use: 'integer',
      bytes: 'integer',
      code: 'integer',
      ip: 'string',
    },
    options: {
      stripUnknown: true,
    },
  },
  userTracker: {
    fields: {
      use: 'integer',
    },
  },
  performance: {
    fields: {
      lag: 'integer',
      physical: 'integer',
      exec: 'integer',
      connectingTotal: 'integer',
    },
    options: {
      stripUnknown: true,
    },
  },
  session: {
    fields: {
      account: 'string',
      use: 'interger',
    },
    options: {
      stripUnknown: true,
    },
  },
};

module.exports = schemas;
