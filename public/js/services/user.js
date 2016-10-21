import * as http from '../helpers/http';
import * as crypto from '../helpers/crypto';
import {
  USER_ME,
  USER_LOGIN,
  USER_LIKE,
  USER_REGISTER,
  USER_LOGOUT,
} from '../constants/urls';

export function me() {
  return http.get(USER_ME)
    .set('Cache-Control', 'no-cache')
    .then(res => res.body);
}

export function add(account, password, email) {
  const code = crypto.sha256(`${account}-${password}`);
  return http.post(USER_REGISTER, {
    account,
    password: code,
    email,
  }).then(res => res.body);
}

export function login(account, password) {
  return http.get(USER_LOGIN)
    .set('Cache-Control', 'no-cache')
    .then((res) => {
      const token = res.body.token;
      const code = crypto.sha256(crypto.sha256(`${account}-${password}`) + token);
      return http.post(USER_LOGIN, {
        account,
        password: code,
      });
    }).then(res => res.body);
}

export function logout() {
  return http.del(USER_LOGOUT)
    .then(res => res.body || { account: '' });
}

export function like(data, version = 3) {
  return http.post(USER_LIKE)
    .version(version)
    .send(data)
    .then(res => res.body);
}
