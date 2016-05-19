'use strict';
const config = localRequire('config');
const urlJoin = require('url-join');
const Importer = require('jtfileimporter');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');

/**
 * [getImgUrl description]
 * @param  {[type]} staticUrlPrefix [description]
 * @param  {[type]} versions        [description]
 * @return {[type]}                 [description]
 */
function getImgUrl(staticUrlPrefix, versions) {
  return (f) => {
    let file = f;
    if (file.charAt(0) !== '/') {
      file = `/${file}`;
    }
    /* istanbul ignore if */
    if (config.env === 'development') {
      return urlJoin(staticUrlPrefix, file, `?v=${Date.now()}`);
    }
    const version = versions[file];
    if (version) {
      const ext = path.extname(file);
      file = file.replace(ext, `.${version}${ext}`);
    }
    return urlJoin(staticUrlPrefix, file);
  };
}

/**
 * [state description]
 * @param  {[type]} versions [description]
 * @return {[type]}          [description]
 */
module.exports = (versions) => {
  const appUrlPrefix = config.appUrlPrefix;
  const staticOptions = config.staticOptions;
  const staticUrlPrefix = appUrlPrefix ? urlJoin(appUrlPrefix, staticOptions.urlPrefix) : staticOptions.urlPrefix;
  const imgUrlFn = getImgUrl(staticUrlPrefix, versions);
  const anchorUrlFn = url => appUrlPrefix ? urlJoin(appUrlPrefix, url) : url;
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
    return next();
  };
};
