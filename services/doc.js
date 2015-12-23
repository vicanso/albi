'use strict';
const _ = require('lodash');
const hljs = require('highlight.js');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const path = require('path');
const markdown = require('markdown').markdown;

exports.getDescription = getDescription;


function getDescription(name) {
	const file = path.join(__dirname, '../docs', name + '.md');
	return fs.readFileAsync(file, 'utf8')
		.then(data => {
			let html = markdown.toHTML(data.replace(/\t/g, '  '));
			const reg = /<code>[\s\S]*?<\/code>/g;
			_.forEach(html.match(reg), tmp => {
				const str = tmp.replace(/&#39;/g, '\'')
					.replace(/&gt;/g, '>')
					.replace(/&lt;/g, '<');
				const code = hljs.highlight('javascript', str.substring(6, str.length - 7).trim()).value;
				html = html.replace(tmp, '<pre><code class="hljs">' + code + '</code></pre>');
			});
			return html;
		});
}