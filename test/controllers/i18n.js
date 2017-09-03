const assert = require('assert');
const shortid = require('shortid');

require('../../app');
const User = require('../supports/user');

describe('controllers/i18n', () => {
  const name = shortid();
  const user = new User({
    account: 'vicanso',
  });
  let id = '';
  const en = 'my test';
  const zh = '我的测试';

  it('init', async () => {
    await user.login();
  });

  it('add i18n', async () => {
    const res = await user.post('/i18ns').send({
      name,
      category: 'test',
      en,
      zh,
    });
    const data = res.body;
    assert.equal(res.status, 201);
    assert.equal(data.name, name);
    id = data._id; // eslint-disable-line
  });

  it('get i18n by id', async () => {
    const res = await user.get(`/i18ns/${id}`);
    assert.equal(res.body.name, name);
  });

  it('list i18n', async () => {
    const res = await user.get('/i18ns');
    assert(res.body.items.length);
  });

  it('list i18n by category', async () => {
    const res = await user.get('/i18ns?category=test&lang=zh');
    assert(res.body.test[name], '我的测试');
  });
});
