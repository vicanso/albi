module.exports = [
  ['GET', '/sys/level', '[m.noQuery & c.system.level]'],
  ['PUT', '/sys/level', '[m.auth.admin & c.system.setLevel]'],
  ['PUT', '/sys/exit', '[m.auth.admin & c.system.exit]'],
  ['PUT', '/sys/pause', '[m.auth.admin & c.system.pause]'],
  ['PUT', '/sys/resume', '[m.auth.admin & c.system.resume]'],
  ['GET', '/sys/status', '[m.noQuery & c.system.status]'],
  ['POST', '/sys/mock', '[c.system.mock]'],
];
