'use strict';
const path = require('path');
const jade = require('jade');
const config = localRequire('config');
const viewConfigs = localRequire('views/config');

viewConfigs.forEach(str => {
	const arr = str.split(' ');
	exports[arr[0]] = parse(arr[1]);
});

// exports.index = parse('index', 'index');

/**
 * [render description]
 * @param  {[type]} file    [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function render(file, data, options) {
	file = path.join(config.viewPath, file);
	const extname = path.extname(file);
	if (!extname) {
		file += '.jade';
	}
	const tpl = jade.compileFile(file, options);
	return tpl(data);
}


/**
 * [parse description]
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function parse(file) {
	return (ctx, next) => {
		return next().then(() => {
			const importer = ctx.state.importer;
			ctx.state.TEMPLATE = file;
			let html = render(file, ctx.state, config.templateOptions);
			if (importer) {
				html = html.replace('<!--CSS_FILES_CONTAINER-->', importer.exportCss());
				html = html.replace('<!--JS_FILES_CONTAINER-->', importer.exportJs());
			}
			ctx.body = html;
		});
	};
}