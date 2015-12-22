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
		let html = markdown.toHTML(data.replace(/\t/g, '  '));
		console.dir(html);
		const reg = /<code>[\s\S]*?<\/code>/g;
		_.forEach(html.match(reg), tmp => {
			const str = tmp.replace(/&#39;/g, "'")
				.replace(/&gt;/g, '>')
				.replace(/&lt;/g, '<');
			const code = hljs.highlightAuto(str.substring(6, str.length - 7).trim()).value;
			html = html.replace(tmp, '<pre><code class="hljs">' + code + '</code></pre>');
		});
		ctx.state.viewData = {
			navigation: {
				items: view.navigation,
				selected: ctx.url
			},
			docHtml: html
		};
	});


}