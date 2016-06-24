'use strict';
/* eslint import/no-unresolved:0 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as _ from 'lodash';
import * as globals from './helpers/globals';
import * as http from './helpers/http';
import store from './store';
import App from './containers/app';

const globarErrorCatch = () => globals.set('onerror', (msg, url, line, row, err) => {
  let stack = '';
  if (err) {
    stack = err.stack;
  }
  const data = {
    url,
    line,
    row,
    msg,
    stack,
    type: 'uncaughtException',
  };
  if (globals.get('CONFIG.env') === 'development') {
    /* eslint no-alert:0 */
    alert(JSON.stringify(data));
  }
});


const statistics = () => {
  const data = {
    screen: _.pick(globals.get('screen'), 'width height availWidth availHeight'.split(
      ' ')),
    template: globals.get('CONFIG.template'),
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
      const entries = performance.getEntries();
      data.entries = _.filter(entries, tmp => tmp.initiatorType !== 'xmlhttprequest');
    }
  }
  http.post('/stats/statistics', data).then(() => {
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
