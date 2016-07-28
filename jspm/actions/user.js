'use strict';
import * as http from '../helpers/http';
import * as crypto from '../helpers/crypto';
import {
  USER_INFO,
} from '../constants/action-types';

function getToken() {
  return http.get('/api/users/login')
    .set('Cache-Control', 'no-cache')
    .then(res => res.body.token);
}

function getUser() {
  return http.get('/api/users/me')
    .set('Cache-Control', 'no-cache')
    .then(res => res.body);
}

function addUser(account, password) {
  const code = crypto.sha256(`${account}-${password}`);
  return http.post('/api/users/register')
    .send({
      account,
      password: code,
    })
    .then(res => res.body);
}

function userLogin(account, password) {
  return getToken().then(token => {
    const code = crypto.sha256(crypto.sha256(`${account}-${password}`) + token);
    return http.post('/api/users/login', {
      account,
      password: code,
    }).then(res => res.body);
  });
}

function userLogout() {
  return http.del('/api/users/logout')
  .then(res => res.body || { account: '' });
}

export function fetch() {
  return dispatch => getUser().then(user => dispatch({
    type: USER_INFO,
    user,
  }));
}

export function login(account, password) {
  return dispatch => userLogin(account, password).then(user => dispatch({
    type: USER_INFO,
    user,
  }));
}

export function register(account, password) {
  return dispatch => addUser(account, password).then(user => dispatch({
    type: USER_INFO,
    user,
  }));
}

export function logout() {
  return dispatch => userLogout().then(user => dispatch({
    type: USER_INFO,
    user,
  }));
}
