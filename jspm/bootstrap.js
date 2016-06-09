'use strict';
import * as globals from './services/globals';
import * as http from './services/http';
import * as user from './services/user';
import React from 'react';
import store from './store';
import ReactDOM from 'react-dom';
import App from './components/app';
import * as ReactRedux from 'react-redux';

const globarErrorCatch = () => globals.set('onerror', (msg, url, line, row, err) => {
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

const initRender = () => {
  const Provider = ReactRedux.Provider;
  ReactDOM.render(
    <Provider store={store()}>
      <App />
    </Provider>,
    document.getElementById('rootContainer')
  );
};

_.defer(() => {
  globarErrorCatch();
  statistics();
  initRender();
});
