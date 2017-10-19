const assert = require('assert');
const shortid = require('shortid');


require('../../app');
const User = require('../supports/user');

describe('controllers/setting', () => {
  const category = shortid();
  const user = new User({
    account: 'vicanso',
  });
  let id = '';

  it('init', async () => {
    await user.login();
  });

  it('add setting', async () => {
    const res = await user.post('/settings')
      .send({
        category,
        data: {
          top: 100,
        },
      });
    assert.equal(res.status, 201);
    const data = res.body;
    // eslint-disable-next-line
    id = data._id;
    assert.equal(data.data.top, 100);
  });

  it('list setting', async () => {
    const res = await user.get('/settings')
      .noCache();
    assert(res.body.items.length);
  });

  it('update setting', async () => {
    const res = await user.patch(`/settings/${id}`)
      .send({
        data: {
          top: 300,
        },
      });
    assert.equal(res.status, 204);
  });

  it('get setting', async () => {
    const res = await user.get(`/settings/${id}`)
      .noCache();
    assert.equal(res.body.data.top, 300);
  });
});

