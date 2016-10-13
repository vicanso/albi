require('./helpers/local-require');

localRequire('helpers/bluebird');
localRequire('helpers/exception');
localRequire('helpers/joi');
localRequire('models');
const config = localRequire('config');
localRequire('helpers/server')(config.port);
localRequire('tasks');
