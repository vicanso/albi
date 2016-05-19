'use strict';
import * as globals from './components/globals';
// import * as http from './components/http';

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
  if (global.get('CONFIG.env') === 'development') {
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

  console.dir(data);
};

_.defer(() => {
  init();
  statistics();
});
