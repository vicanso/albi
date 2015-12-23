'use strict';
const viewService = localRequire('services/view');
const docService = localRequire('services/doc');

module.exports = docView;

/**
 * [docView description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function docView(ctx) {
	let name = ctx.params.category;
	if (ctx.params.name) {
		name += `/${ctx.params.name}`;
	}

	return docService.getDescription(name).then(description => {
		ctx.state.viewData = {
			navigation: {
				items: viewService.navigation,
				selected: ctx.url
			},
			description: description
		};
	});
}