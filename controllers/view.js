/**
 * @module controllers/view
 */

exports.home = ctx => ctx.setCache('5m');

exports.admin = ctx => ctx.setCache('1m');
