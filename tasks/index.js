'use strict';
const sdc = localRequire('helpers/sdc');
localRequire('tasks/performance')(30 * 1000, sdc);