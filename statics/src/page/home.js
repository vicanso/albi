'use strict';
requirejs(['component/app', 'component/rest'], function(app, rest) {

	TIMING.end('page');
	app.ready(function() {
		rest.user().then(function(res) {
			console.dir(res);
		}, function(err) {
			console.dir(err);
		});

		rest.user().then(function(res) {
			console.dir(res);
		}, function(err) {
			console.dir(err);
		});
	});

});