'use strict';

exports.deprecate = deprecate;
exports.noStore = noStore;

/**
 * [deprecate description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function deprecate(ctx) {
	ctx.body = {
		msg: 'deprecate'
	};
}


/**
 * [noStore description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function noStore(ctx) {
	ctx.body = {
		msg: 'no-store'
	};
}