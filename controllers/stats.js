'use strict';
const _ = require('lodash');

exports.ajax = (ctx) => {
  const ua = ctx.get('user-agent');
  _.forEach(ctx.request.body, (item) => {
    console.info(`browser-ajax ua:${ua}, data:${JSON.stringify(item)}`);
  });
  /* eslint no-param-reassign:0 */
  ctx.body = null;
};

exports.exception = (ctx) => {
  const ua = ctx.get('user-agent');
  _.forEach(ctx.request.body, (item) => {
    console.error(`browser-exception ua:${ua}, data:${JSON.stringify(item)}`);
  });
  /* eslint no-param-reassign:0 */
  ctx.body = null;
};

exports.statistics = (ctx) => {
  const data = ctx.request.body;
  console.info(`browser-screen:${JSON.stringify(data.screen)}`);
  console.info(`browser-timing:${data.template}, ${JSON.stringify(data.timing)}`);
  console.info(`browser-performance:${JSON.stringify(data.performance)}`);
  _.forEach(data.entries, entry => {
    console.info(`browser-entry:${JSON.stringify(entry)}`);
  });
  /* eslint no-param-reassign:0 */
  ctx.body = null;
};
