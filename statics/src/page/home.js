'use strict';
requirejs(['component/app', 'component/http'], function(app, http) {

	TIMING.end('page');
	app.run(function() {
		http.get('/1/users/me')
	});

});