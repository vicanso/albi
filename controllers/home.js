'use strict';

module.exports = home;

function home(ctx, next) {
	ctx.state.viewData = {
		name: 'vicanso'
	};
}