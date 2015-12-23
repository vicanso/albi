## template

```
function render(file, data, options) {
	file = path.join(config.viewPath, file);
	const extname = path.extname(file);
	if (!extname) {
		file += '.jade';
	}
	const tpl = jade.compileFile(file, options);
	return tpl(data);
}
function parse(file) {
	return (ctx, next) => {
		return next().then(() => {
			const importer = ctx.state.importer;
			ctx.state.TEMPLATE = file;
			let html = render(file, ctx.state, config.templateOptions);
			if (importer) {
				// 替换css,js文件列表
				html = html.replace('<!--CSS_FILES_CONTAINER-->', importer.exportCss());
				html = html.replace('<!--JS_FILES_CONTAINER-->', importer.exportJs());
			}
			ctx.body = html;
		});
	};
}
```

主要是将模板文件render之后，将css和js的占位符替换成css和js文件列表，输出html。