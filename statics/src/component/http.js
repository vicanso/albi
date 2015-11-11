'use strict';

var request = require('component/superagent');


function get(url, query) {
	return request.get(url);
}

exports.get = get;