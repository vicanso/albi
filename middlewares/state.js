'use strict';
const config = localRequire('config');
const urlJoin = require('url-join');
const Importer = require('jtfileimporter');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');

module.exports = state;

/**
 * [state description]
 * @param  {[type]} versions [description]
 * @return {[type]}          [description]
 */
function state(versions) {
	const appUrlPrefix = config.appUrlPrefix;
	const staticUrlPrefix = urlJoin(appUrlPrefix, config.staticUrlPrefix);
	const imgUrlFn = getImgUrl(staticUrlPrefix, versions);
	const anchorUrlFn = url => {
		return urlJoin(appUrlPrefix, url);
	};
	const defaultPattern = config.env === 'development' ? '*' : '';
	return (ctx, next) => {
		const state = ctx.state;
		const importer = new Importer();
		importer.prefix = staticUrlPrefix;
		if (config.env !== 'development') {
			importer.version = versions;
			importer.versionMode = 1;
		}

		state.STATIC_URL_PREFIX = staticUrlPrefix;
		state.APP_URL_PREFIX = appUrlPrefix;
		state.APP_VERSION = config.version;
		state.APP = config.app;
		state.ENV = config.env;
		state._ = _;
		state.moment = moment;
		state.IMG_URL = imgUrlFn;
		state.URL = anchorUrlFn;
		state.importer = importer;
		state.DEBUG = _.get(ctx, 'debugParams.DEBUG', false);
		state.PATTERN = _.get(ctx, 'debugParams.PATTERN', defaultPattern);
		return next();
	};
}


/**
 * [getImgUrl description]
 * @param  {[type]} staticUrlPrefix [description]
 * @param  {[type]} versions        [description]
 * @return {[type]}                 [description]
 */
function getImgUrl(staticUrlPrefix, versions) {
	return function(file) {
		if (file.charAt(0) !== '/') {
			file = '/' + file;
		}
		/* istanbul ignore if */
		if (config.env === 'development') {
			return urlJoin(staticUrlPrefix, file, '?v=' + Date.now());
		} else {
			let version = versions[file];
			if (version) {
				let ext = path.extname(file);
				file = file.replace(ext, '.' + version + ext);
			}
			return urlJoin(staticUrlPrefix, file);
		}
	};
}