'use strict';
const Emitter = require('component-emitter');
const $ = require('jquery');
const _ = require('lodash');

Emitter(exports);

exports.lazyLoadImage = lazyLoadImage;

initScrollEvent();


/**
 * [initScrollEvent description]
 * @return {[type]} [description]
 */
function initScrollEvent() {
	$(window).on('scroll', _.throttle(e => {
		const top = $(document).scrollTop();
		exports.emit('scroll', {
			top: top
		});
	}, 300));
}


function lazyLoadImage(selector) {
	_.forEach($(selector), dom => {
		const imgSrc = $(dom).data('src');
		$(`<img src="${imgSrc}" />`).appendTo(dom);
	});
}