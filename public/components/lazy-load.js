'use strict';

export function load(obj) {
	const src = obj.data('src');
	obj.append('<img src="' + src + '" />');
}