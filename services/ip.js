'use strict';
const request = require('superagent');
const _ = require('lodash');

// const ipLocation = superExtend.parse('GET http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json');

exports.location = location;

/**
 * [location description]
 * @param  {[type]} ip [description]
 * @return {[type]}    [description]
 */
function location(ip) {
	return new Promise((resolve, reject) => {
		request.get(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=${ip}`)
			.end((err, res) => {
				if (err) {
					reject(err);
				} else {
					resolve(_.pick(res.body, 'country province city'.split(' ')));
				}
			});
	});
}