/**
 * @module controllers/home
 */

/**
 * 根据template，生成html，主要是网页是单页应用但是需要刷新时能加载到html
 * @param {String} method `GET`
 * @param session `no session`
 * @param {String} routes `/`, `/login`, `/register`
 * @param {String} template `home`
 * @return {String} 返回render的html
 * @example
 * curl 'http://host/login'
 */
module.exports = ctx => ctx.set('Cache-Control', 'public, max-age=600');
