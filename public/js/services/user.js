import * as globals from '../helpers/globals';
import * as request from '../helpers/request';
import * as crypto from '../helpers/crypto';

const app = globals.get('CONFIG.app', 'unknown');

/**
 * Get the user info
 * @export
 * @returns 
 */
export function me() {
  return request.get('/api/users/me')
    .noCache()
    .then(res => res.body);
}

/**
 * Register account
 * @export
 * @param {String} account
 * @param {String} password 
 * @param {String} email 
 * @returns 
 */
export function register(account, password, email) {
  const pwd = crypto.sha256(password);
  const code = crypto.sha256(`${account}-${pwd}-${app}`);
  return request.post('/api/users/register', {
    account,
    password: code,
    email,
  })
  .then(res => res.body);
}

export function login(account, password) {
  const loginUrl = '/api/users/login';
  return request.get(loginUrl)
    .noCache()
    .then((res) => {
      const token = res.body.token;
      const pwd = crypto.sha256(password);
      const code = crypto.sha256(crypto.sha256(`${account}-${pwd}-${app}`) + token);
      return request.post(loginUrl, {
        account,
        password: code,
      });
    }).then(res => res.body);
}

export function logout() {
  return request.del('/api/users/logout')
    .then(res => res.body || { account: '' });
}
