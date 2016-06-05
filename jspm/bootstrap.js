'use strict';
import * as globals from './components/globals';
import * as http from './components/http';
import * as user from './components/user';

const init = () => globals.set('onerror', (msg, url, line, row, err) => {
  var stack = '';
  if (err) {
    stack = err.stack;
  }
  const data = {
    url: url,
    line: line,
    row: row,
    msg: msg,
    stack: stack,
    type: 'uncaughtException',
  };
  if (globals.get('CONFIG.env') === 'development') {
    alert(JSON.stringify(data));
  }
});

const statistics = () => {
  const data = {
    screen: _.pick(globals.get('screen'), 'width height availWidth availHeight'.split(
      ' ')),
    template: globals.get('CONFIG.template')
  };
  const timing = globals.get('TIMING');
  if (timing) {
    timing.end('page');
    data.timing = timing.toJSON();
  }

  const performance = globals.get('performance');
  if (performance) {
    data.performance = performance.timing;
    if (performance.getEntries) {
      data.entries = _.filter(performance.getEntries(), tmp => tmp.initiatorType !== 'xmlhttprequest');
    }
  }
  http.post('/stats/statistics', data).then(res => {
    console.info('post statistics success');
  }).catch(err => {
    console.error('post statistics fail, %s', err);
  });
};

_.defer(() => {
  init();
  statistics();
  user.me().then(data => {
    console.dir(data);
  });
  // http.get('/users/me')
  //   .set('Cache-Control', 'no-cache')
  //   .set('Accept', 'application/vnd.albi.v2+json)')
  //   .then(res => {
  //     console.dir(res.body);
  //   }).catch(err => {
  //     console.error(err);
  //   });
});
