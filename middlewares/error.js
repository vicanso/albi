'use strict';
const _ = require('lodash');
const config = localRequire('config');

module.exports = error;

function error(ctx, next) {
	return next().then(_.noop, (err) => {
		ctx.status = err.status || 500;
		ctx.set('Cache-Control', 'no-cache');
		const data = {
			code: err.code || 0,
			error: err.message,
			expected: false
		};
		_.forEach(err, (v, k) => {
			data[k] = v;
		});
		if (config.env !== 'production') {
			data.stack = err.stack;
		}
		const str = JSON.stringify(data);
		if (data.expected) {
			console.error('http-error:' + str);
		} else {
			console.error('http-unexpectd-error:' + str);
		}

		if (ctx.state.TEMPLATE) {
			const htmlArr = ['<html>'];
			/* istanbul ignore else */
			if (config.env !== 'production') {
				htmlArr.push('<pre>' + err.stack +
					'</pre>');
			} else {
				htmlArr.push('<pre>' + err.message.replace(config.viewPath, '') +
					'</pre>');
			}
			htmlArr.push('</html>');
			ctx.body = htmlArr.join('');
		} else {
			ctx.body = data;
		}

	});
}