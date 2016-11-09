const globals = localRequire('helpers/globals');
const errors = localRequire('helpers/errors');

// If the system level is below the set level, the request will return error
module.exports = level => (ctx, next) => {
  const systemLevel = globals.get('level');
  if (systemLevel < level) {
    const err = errors.get(3);
    err.message = err.message
      .replace('#{systemLevel}', systemLevel)
      .replace('#{level}', level);
    throw err;
  }
  console.dir(systemLevel);
  console.dir(level);
  return next();
};
