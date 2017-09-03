const assert = require('assert');
const shortid = require('shortid');

require('../../app');
const User = require('../supports/user');

describe('controllers/mock', () => {
  const url = shortid();
  const user = new User({
    account: 'vicanso',
  });
  let id = '';

  it('init', async () => {
    await user.login();
  });

  it('add mock', async () => {
    const res = await user.post('/mocks')
      .send({
        url,
        status: 400,
        response: {
          message: 'abc',
        },
      });
    const data = res.body;
    id = data._id; // eslint-disable-line no-underscore-dangle
    assert.equal(data.url, url);
  });

  it('list mock', async () => {
    const res = await user.get('/mocks');
    assert(res.body.items.length);
  });

  it('update mock', async () => {
    await user.patch(`/mocks/${id}`)
      .send({
        status: 500,
      });
  });

  it('get mock', async () => {
    const res = await user.get(`/mocks/${id}`);
    assert.equal(res.body.status, 500);
  });
});
