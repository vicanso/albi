'use strict';
const view = localRequire('services/view');
const hljs = require('highlight.js');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const path = require('path');
const markdown = require('markdown').markdown;
const _ = require('lodash');

module.exports = docView;

function docView(ctx) {
	const category = ctx.params.category;
	const file = path.join(__dirname, '../docs', category + '.md');
	return fs.readFileAsync(file, 'utf8').then(data => {
		let html = markdown.toHTML(data);
		const reg = /<code>[\s\S]*?<\/code>/g;
		_.forEach(html.match(reg), tmp => {
			const code = hljs.highlightAuto(tmp.substring(6, tmp.length - 7).trim()).value;
			html = html.replace(tmp, '<pre><code class="hljs">' + code + '</code></pre>');
		});
		console.dir(html);
		ctx.state.viewData = {
			navigation: {
				items: view.navigation,
				selected: ctx.url
			},
			docHtml: html
		};
	});


}