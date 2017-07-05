module.exports = [
  ['GET', '/api/sys/level', '[m.noQuery & c.system.level]'],
  ['PUT', '/api/sys/level', '[m.auth.admin & c.system.setLevel]'],
  ['POST', '/api/sys/exit', '[m.auth.admin & c.system.exit]'],
  ['PUT', '/api/sys/pause', '[m.auth.admin & c.system.pause]'],
  ['PUT', '/api/sys/resume', '[m.auth.admin & c.system.resume]'],
  ['GET', '/api/sys/status', '[m.noQuery & c.system.status]'],
];
