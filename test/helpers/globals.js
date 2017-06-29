const assert = require('assert');

const globals = localRequire('helpers/globals');

describe('globals', () => {
  it('change the application status', () => {
    assert.equal(globals.isRunning(), false);
    globals.start();
    assert.equal(globals.isRunning(), true);
    globals.pause();
    assert.equal(globals.isRunning(), false);
  });

  it('change the system level', () => {
    assert.equal(globals.getLevel(), 100);
    globals.setLevel(200);
    assert.equal(globals.getLevel(), 200);
  });

  it('change connecting count', () => {
    assert.equal(globals.getConnectingCount(), 0);
    globals.setConnectingCount(2000);
    assert.equal(globals.getConnectingCount(), 2000);
  });

  it('get concurrency', () => {
    assert.equal(globals.getConcurrency(), 'high');
    globals.setConnectingCount(0);
    assert.equal(globals.getConcurrency(), 'low');
  });
});
