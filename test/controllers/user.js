const assert = require('assert');
const shortid = require('shortid');

require('../../app');
const User = require('../supports/user');

describe('controllers/user', () => {
  const account = shortid();
  const user = new User({
    account,
    password: shortid(),
    email: `${shortid()}@gmail.com`,
  });
  it('register', async () => {
    const userInfo = await user.register();
    assert.equal(userInfo.account, account);
  });

  it('logout', async () => {
    const userInfo = await user.logout();
    assert(!userInfo.account);
  });

  it('login', async () => {
    const userInfo = await user.login();
    assert.equal(userInfo.account, account);
  });

  it('refresh', async () => {
    await user.refresh();
  });

  it('me', async () => {
    const userInfo = await user.me();
    assert.equal(userInfo.account, account);
  });
});
