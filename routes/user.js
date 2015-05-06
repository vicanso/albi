'use strict';
module.exports = [
  {
    method : 'all',
    middleware : ['nocacheQuery', 'session'],
    route : '/user',
    handler : 'user'
  }
];