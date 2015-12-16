'use strict';
const superExtend = require('superagent-extend');
const _ = require('lodash');


exports.statsException = getDebouncePost('/stats/exception');

exports.statsAjax = getDebouncePost('/stats/ajax');

exports.statistics = superExtend.parse('POST /stats/statistics');

/**
 * [getDebouncePost description]
 * @param  {[type]} url      [description]
 * @param  {[type]} interval [description]
 * @return {[type]}          [description]
 */
function getDebouncePost(url, interval) {
	interval = interval || 3000;
	const dataList = [];
	const post = superExtend.parse('POST ' + url);
	const debouncePost = _.debounce(() => {
		post(dataList.slice());
		dataList.length = 0;
	}, interval);
	return (data) => {
		if (data) {
			if (_.isArray(data)) {
				dataList.push.apply(dataList, data);
			} else {
				dataList.push(data);
			}

			debouncePost();
		}
	}
}