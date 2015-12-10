'use strict';
const path = require('path');
const jade = require('jade');
const config = localRequire('config');
exports.viewPath = path.join(__dirname, '../views');

exports.index = parse('index', 'index');

function render(file, data, options) {
	file = path.join(exports.viewPath, file);
	const extname = path.extname(file);
	if (!extname) {
		file += '.jade';
	}
	const tpl = jade.compileFile(file, options);
	return tpl(data);
}

function parse(name, file) {
	return (ctx, next) => {
		const html = render(file, ctx.state, config.templateOptions);
		ctx.body = html;
		return next();
	};
}