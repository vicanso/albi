function save(schema) {
  schema.add({
    createdAt: {
      type: String,
      required: true,
    },
  });
  schema.pre('validate', function preValidate(next) {
    this.createdAt = (new Date()).toISOString();
    next();
  });
}

module.exports = save;
