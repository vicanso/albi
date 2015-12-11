'use strict';
const _ = require('lodash');

module.exports = picker;

/**
 * [picker description]
 * @param  {[type]} field [description]
 * @return {[type]}       [description]
 */
function picker(field) {
	return (ctx, next) => {
		return next().then(() => {
			let pickValue = ctx.query[field];
			/* istanbul ignore if */
			if (!pickValue || !ctx.body) {
				return;
			}
			let pickFn = _.pick;
			if (pickValue[0] === '-') {
				pickFn = _.omit;
				pickValue = pickValue.substring(1);
			}
			const keys = pickValue.split(',');
			const fn = (item) => {
				return pickFn(item, keys);
			};
			if (_.isArray(ctx.body)) {
				ctx.body = _.map(ctx.body, fn);
			} else {
				ctx.body = fn(ctx.body);
			}
		});
	};
}