'use strict';
const fs = require('fs');
const _ = require('lodash');
const config = localRequire('config');
const MicroService = require('micro-service');
const urlInfo = require('url').parse(config.etcd);
const client = new MicroService({
	port: parseInt(urlInfo.port),
	host: urlInfo.hostname,
	key: 'backend'
});
const data = {
	port: config.port,
	ip: getIP(),
	name: config.app
};
if (config.appUrlPrefix) {
	data.prefix = config.appUrlPrefix;
}
if (config.domain) {
	data.host = config.domain;
}
client.set(data);
client.addTag('backend:http', `app:${config.app}`, 'ping:http');
client.ttl(600);


function getIP () {
	const hostname = process.env.HOSTNAME;
	if (!hostname) {
		return 'localhost';
	}
	const hosts = fs.readFileSync('/etc/hosts', 'utf8');
	// etc hosts中的ip都是正常的，因此正则的匹配考虑的简单一些
	const reg = new RegExp('((?:[0-9]{1,3}\.){3}[0-9]{1,3})\\s*' + hostname);
	const address = _.get(reg.exec(hosts), 1);
	return address;
}

module.exports = client;