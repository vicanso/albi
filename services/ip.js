'use strict';
const superExtend = require('superagent-extend');
const _ = require('lodash');

const ipLocation = superExtend.parse('GET http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json');

exports.location = location;

/**
 * [location description]
 * @param  {[type]} ip [description]
 * @return {[type]}    [description]
 */
function location(ip) {
	return ipLocation({
		ip: ip
	}).then(res => {
		return _.pick(res.body, 'country province city'.split(' '));
	});
}