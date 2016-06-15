'use strict';
require('../../helpers/local-require');

describe('helper/server', () => {
  it('should start a server success', done => {
    const server = localRequire('helpers/server');
    server(10000);
    done();
  });

});
