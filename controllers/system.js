'use strict';
const BlueBird = require('bluebird');
const path = require('path');
const config = localRequire('config');
const fs = BlueBird.promisifyAll(require('fs'));
const globals = localRequire('globals');
const _ = require('lodash');
const moment = require('moment');

exports.version = version;
exports.pause = pause;
exports.resume = resume;
exports.stats = stats;
exports.safeExit = safeExit;

/**
 * [version description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function version(ctx) {
	return getVersion().then(data => {
		ctx.set('Cache-Control', 'public, max-age=600');
		ctx.body = data;
	});
}

/**
 * [pause description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function pause(ctx) {
	globals.set('status', 'pause');
	console.info(config.name + ' is pause.');
	ctx.body = null;
}

/**
 * [resume description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function resume(ctx) {
	globals.set('status', 'running');
	console.info(config.name + ' is resume.');
	ctx.body = null;
}

/**
 * [stats description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
function stats(ctx) {
	return getVersion().then(version => {
		const uptime = moment(Date.now() - Math.ceil(process.uptime()) * 1000);
		ctx.body = _.extend({
			version: version,
			uptime: uptime.fromNow(),
			startedAt: uptime.toISOString(),
			performance: globals.get('performance')
		});
	});
}

/**
 * [safeExit description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
/* istanbul ignore next */
function safeExit(ctx) {
	globals.set('status', 'pause');
	console.info(config.name + ' will safeExit soon.');
	checkToExit(3);
	ctx.body = null;
}

/**
 * [getVersion description]
 * @return {[type]} [description]
 */
function getVersion() {
	return fs.readFileAsync(path.join(__dirname, '../package.json')).then(buf => {
		const pkg = JSON.parse(buf);
		return {
			code: pkg.appVersion,
			exec: config.version
		};
	});
}

/**
 * [checkToExit description]
 * @param  {[type]} times [description]
 * @return {[type]}       [description]
 */
/* istanbul ignore next */
function checkToExit(times) {
	if (!times) {
		console.error('exit while there are still connections.');
		process.exit(1);
		return;
	}
	let timer = setTimeout(function() {
		let connectingTotal = globals.get('connectingTotal');
		if (!connectingTotal) {
			console.info('exit without any connection.');
			process.exit(0);
			return;
		}
		checkToExit(--times);
	}, 10 * 1000);
	timer.unref();
}