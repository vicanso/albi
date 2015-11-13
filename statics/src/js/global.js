requirejs.config({
	baseUrl: '/static'
});


requirejs.onResourceLoad = function(context, map, depArray) {
	var data = map.timeLine;
	data.end = Date.now();
	data.url = map.url;
	data.type = 'success';
	TMP.resources.push(data);
};
requirejs.onError = function(err) {
	var data = {
		message: err.toString(),
		requireModules: err.requireModules,
		requireType: err.requireType,
		type: 'fail'
	};
	TMP.resources.push(data);
};