'use strict';
const Influx = require('simple-influx');
const config = localRequire('config');
const _ = require('lodash');
const client = getClient();

exports.write = write;


function write(series, tags, values) {
	if (!client) {
		return;
	}
	values = _.extend({count: 1}, values);
	tags.inst = config.name;

	client.write(series)
		.tag(tags)
		.value(values)
		.queue();
}


function getClient() {
	const influxUrl = config.influx;
	if (!influxUrl) {
		return;
	}
	const urlInfo = require('url').parse(influxUrl);
	const client = new Influx({
		host: urlInfo.hostname,
		port: parseInt(urlInfo.port),
		protocol: urlInfo.protocol.substring(0, urlInfo.protocol.length - 1),
		database: config.app
	});
	client.safeCreateDatabase().then(() => {
		console.info(`create database ${config.app} success`);
	}).catch(err => {
		console.error(err);
	});
	return client;
}