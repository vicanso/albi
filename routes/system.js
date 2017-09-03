module.exports = [
  ['PUT', '/sys/exit', 'm.admin & c.system.exit'],
  ['PUT', '/sys/pause', 'm.admin & c.system.pause'],
  ['PUT', '/sys/resume', 'm.admin & c.system.resume'],
  ['GET', '/sys/status', 'm.noQuery & c.system.status'],
  ['GET', '/sys/stats', 'm.noQuery & m.adminToken & c.system.stats'],
  ['POST', '/sys/mock', 'c.system.mock'],
];
