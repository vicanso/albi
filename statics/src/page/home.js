'use strict';
requirejs(['component/app', 'component/rest', 'component/util', 'component/comment'], function(app, rest, util, comment) {

	window.TIMING.end('page');
	app.ready(function() {
		comment.render('commentContainer');
		rest.user().then(function(res) {
			util.debug('user info:%j', res);
		}, function(err) {
			console.dir(err);
		});
	});

});