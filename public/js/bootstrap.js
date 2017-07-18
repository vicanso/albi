/* eslint import/no-extraneous-dependencies:0 */
import * as _ from 'lodash';
import injectTapEventPlugin from 'react-tap-event-plugin';

import * as globals from './helpers/globals';
import * as statsService from './services/stats';


function globarErrorCatch() {
  globals.set('onerror', (msg, url, line, row, err) => {
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
      /* eslint no-alert:0 no-undef:0 */
      alert(JSON.stringify(data));
    }
  });
}

function statistics() {
  const data = {
    screen: _.pick(globals.get('screen'), 'width height availWidth availHeight'.split(
      ' ')),
    template: globals.get('CONFIG.template'),
  };
  const timing = globals.get('TIMING');
  timing.end('page');
  data.timing = timing.toJSON();

  statsService.statistics(data)
    .then(() => console.info('post statistics success'))
    .catch(err => console.error('post statistics fail, %s', err));
}

export default function start() {
  injectTapEventPlugin();
  globarErrorCatch();
  statistics();
}
