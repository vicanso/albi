'use strict';
requirejs(['component/app', 'component/rest', 'component/util'], function(app, rest, util) {

	TIMING.end('page');
	app.ready(function() {
		rest.user().then(function(res) {
			util.debug('user info:%j', res);
		}, function(err) {
			console.dir(err);
		});
	});

});