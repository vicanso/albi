'use strict';
module.exports = [
  {
    route : '/version',
    middleware : 'no-cache',
    handler : 'system.version'
  }
];
