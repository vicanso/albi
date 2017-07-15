/* eslint import/no-extraneous-dependencies:0 */
import debug from 'debug';
import * as qs from 'query-string';

import * as globals from '../helpers/globals';

const app = globals.get('CONFIG.app');
if (globals.get('CONFIG.env') === 'development') {
  debug.enable(app);
}
const queryParams = qs.parse(globals.get('location.search'));
if (queryParams.debug) {
  debug.enable(queryParams.debug);
}

export default debug(app);
