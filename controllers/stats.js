const _ = require('lodash');
const stringify = require('simple-stringify');

exports.ajax = (ctx) => {
  const token = ctx.get('X-Token');
  _.forEach(ctx.request.body, (item) => {
    console.info(`browser-ajax ${token} ${stringify.json(item)}`);
  });
  /* eslint no-param-reassign:0 */
  ctx.status = 201;
};

exports.exception = (ctx) => {
  const token = ctx.get('X-Token');
  _.forEach(ctx.request.body, (item) => {
    console.error(`browser-exception ${token} ${stringify.json(item)}`);
  });
  /* eslint no-param-reassign:0 */
  ctx.status = 201;
};

exports.statistics = (ctx) => {
  const data = ctx.request.body;
  console.info(`browser-screen:${stringify.json(data.screen)}`);
  console.info(`browser-timing:${data.template} ${stringify.json(data.timing)}`);
  console.info(`browser-performance:${stringify.json(data.performance)}`);
  _.forEach(data.entries, entry => console.info(`browser-entry:${stringify.json(entry)}`));
  /* eslint no-param-reassign:0 */
  ctx.status = 201;
};
