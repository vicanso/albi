'use strict';
const config = localRequire('config');
const reset = localRequire('tasks/reset');
localRequire('tasks/performance')(30 * 1000);
const backendRefreshInterval = 500 * 1000;
// 每30分钟重置performance统计
const resetTimer = setInterval(reset, 30 * 60 * 1000);
resetTimer.unref();
if (!config.etcd) {
	return;
}
const backend = localRequire('tasks/backend');
const refresh = () => {
	backend.refresh().then(() => {
		console.info('refresh service success');
		setTimeout(refresh, backendRefreshInterval).unref();
	}).catch(err => {
		console.error(err);
		setTimeout(refresh, 10 * 1000).unref();
	});
};

backend.register().then(data => {
	console.info(`register service success, data:${JSON.stringify(data)}`);
	setTimeout(refresh, backendRefreshInterval).unref();
}).catch(err => {
	console.error(err);
});