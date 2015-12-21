'use strict';
const view = localRequire('services/view');
const hljs = require('highlight.js');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const path = require('path');

module.exports = home;

function home(ctx) {
	return fs.readFileAsync(path.join(__dirname, '../app.js'), 'utf8').then(code => {
		code = code.replace(/\t/g, '  ');
		ctx.state.viewData = {
			navigation: {
				items: view.navigation
			},
			expressDemo: hljs.highlightAuto(code).value
		};
	});

}