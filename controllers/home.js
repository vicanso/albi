'use strict';
const view = localRequire('services/view');

module.exports = home;

function home(ctx, next) {
	ctx.state.viewData = {
		navigation: {
			items: view.navigation,
			selected: '/get-started'
		}
	};
}