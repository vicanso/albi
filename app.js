'use strict';
require('./helpers/local-require');
localRequire('helpers/bluebird');
localRequire('helpers/exception');
localRequire('helpers/joi');
const config = localRequire('config');
localRequire('helpers/server')(config.port);
localRequire('tasks');
