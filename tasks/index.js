'use strict';
const sdc = localRequire('helpers/sdc');
const reset = localRequire('tasks/reset');
const backend = localRequire('tasks/backend');
localRequire('tasks/performance')(30 * 1000, sdc);
const backendRefreshInterval = 500 * 1000;
// 每30分钟重置performance统计
const resetTimer = setInterval(reset, 30 * 60 * 1000);
resetTimer.unref();

const refresh = () => {
	backend.refresh().then(data => {
		setTimeout(refresh, backendRefreshInterval).unref();
	}).catch(err => {
		console.error(err);
		setTimeout(refresh, 10 * 1000).unref();
	});
};

backend.register().then(data => {
	setTimeout(refresh, backendRefreshInterval).unref();
}).catch(err => {
	console.error(err);
});