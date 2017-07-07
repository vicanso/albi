const assert = require('assert');
const shortid = require('shortid');
const crypto = require('crypto');

const configs = localRequire('configs');

localRequire('app');
const {
  selfRequest,
} = localRequire('helpers/utils');
const getHash = str => crypto.createHash('sha256').update(str).digest('hex');
const account = shortid();
const password = getHash(`${account}-${getHash('abcd')}-${configs.app}`);
const getCookies = (res) => {
  const setCookie = res.get('set-cookie');
  return setCookie.map((cookie) => {
    const arr = cookie.split(';');
    return arr[0];
  }).join(';');
};

describe('controllers/use', () => {
  let currentCookies = '';
  it('register', () => selfRequest('post', '/api/users/register')
    .send({
      account,
      password,
      email: `${shortid()}@gmail.com`,
    })
    .then((res) => {
      assert.equal(res.status, 201);
    }));

  it('login', () => selfRequest('get', '/api/users/login')
    .set('Cache-Control', 'no-cache')
    .then((res) => {
      assert.equal(res.status, 200);
      const token = res.body.token;
      currentCookies = getCookies(res);
      return selfRequest('post', '/api/users/login')
        .set('Cookie', currentCookies)
        .send({
          account,
          password: getHash(password + token),
        });
    })
    .then((res) => {
      assert.equal(res.status, 200);
      assert.equal(res.body.account, account);
      return selfRequest('get', '/api/users/me')
        .set('Cookie', currentCookies)
        .set('Cache-Control', 'no-cache');
    })
    .then((res) => {
      assert.equal(res.body.account, account);
    }));

  it('refresh', () => selfRequest('put', '/api/users/me')
    .set('Cookie', currentCookies)
    .then((res) => {
      assert.equal(res.status, 204);
    }));

  it('like', () => selfRequest('post', '/v3/api/users/like')
    .set('Cookie', currentCookies)
    .then((res) => {
      assert.equal(res.status, 200);
      assert(res.body.count);
    }));

  it('logout', () => selfRequest('delete', '/api/users/logout')
    .set('Cookie', currentCookies)
    .then((res) => {
      assert.equal(res.status, 204);
    }));
});
