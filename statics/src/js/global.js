requirejs.config({
	baseUrl: '/static'
});


requirejs.onResourceLoad = function(context, map, depArray) {
	var data = map.timeLine;
	data.end = Date.now();
	data.url = map.url;
	// console.dir(data);
};
requirejs.onError = function(err) {
	var data = {
		message: err.toString(),
		requireModules: err.requireModules,
		requireType: err.requireType
	};
	// console.dir(data);
};

// requirejs(['component/http'], function(http) {
	// http.on('response', function(res) {
	// 	console.dir(res);
	// });
	// http.get('/1/users/me', {
	// 	'Cache-Control': 'no-cache'
	// }).then(function(res) {
	// 	// console.dir(res);
	// }, function(err) {
	// 	console.dir(err);
	// });
// });