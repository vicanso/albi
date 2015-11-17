(function(global) {
	var CONFIG = window.CONFIG;
	requirejs.config({
		baseUrl: window.CONFIG.staticUrlPrefix,
		paths: window.requirejsComponents
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
		if (CONFIG.env === 'development') {
			alert(JSON.stringify(data));
		}
	};
})(this);