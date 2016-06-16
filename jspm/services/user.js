'use strict';
import * as http from './http';
import * as crypto from './crypto';
const getToken = () => http.get('/users/login')
  .set('Cache-Control', 'no-cache')
  .then(res => res.body.token);

export function me() {
  return http.get('/users/me')
    .set('Cache-Control', 'no-cache')
    .then(res => res.body);
}

export function add(account, password) {
  const code = crypto.sha256(`${account}-${password}`);
  return http.post('/users/register')
    .send({
      account,
      password: code,
    })
    .then(res => res.body);
}

export function login(account, password) {
  return getToken().then(token => {
    const code = crypto.sha256(crypto.sha256(`${account}-${password}`) + token);
    return http.post('/users/login', {
      account,
      password: code,
    }).then(res => res.body);
  });
}

export function logout() {
  return http.del('/users/logout')
  .then(res => res.body || { account: '' });
}
