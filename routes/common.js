'use strict';
module.exports = [
  {
    route : '/sys/version',
    handler : 'system.version'
  },
  {
    route : '/sys/stats',
    handler : 'system.stats'
  },
  {
    route : '/sys/restart',
    method : 'post',
    middleware : 'authority.admin',
    handler : 'system.restart'
  }
];
