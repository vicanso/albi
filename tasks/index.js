'use strict';
const sdc = localRequire('helpers/sdc');
const reset = localRequire('tasks/reset');
localRequire('tasks/performance')(30 * 1000, sdc);

// 每30分钟重置performance统计
const resetTimer = setInterval(reset, 30 * 60 * 1000);
resetTimer.unref();