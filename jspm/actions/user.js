'use strict';
import * as _ from 'lodash';
import * as http from '../helpers/http';
import * as crypto from '../helpers/crypto';
import {
  USER_FETCH,
  USER_FETCH_SUCC,
  USER_LOGIN,
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCC,
  USER_REGISTER,
  USER_REGISTER_FAIL,
  USER_REGISTER_SUCC,
  USER_LOGOUT,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_SUCC,
} from '../constants/action-types';

function getToken() {
  return http.get('/users/login')
    .set('Cache-Control', 'no-cache')
    .then(res => res.body.token);
}


function getUser() {
  return http.get('/users/me')
    .set('Cache-Control', 'no-cache')
    .then(res => res.body);
}

function addUser(account, password) {
  const code = crypto.sha256(`${account}-${password}`);
  return http.post('/users/register')
    .send({
      account,
      password: code,
    })
    .then(res => res.body);
}

function userLogin(account, password) {
  return getToken().then(token => {
    const code = crypto.sha256(crypto.sha256(`${account}-${password}`) + token);
    return http.post('/users/login', {
      account,
      password: code,
    }).then(res => res.body);
  });
}

function userLogout() {
  return http.del('/users/logout')
  .then(res => res.body || { account: '' });
}

const fail = (dispatch, type) => (error) => {
  dispatch({
    type,
    message: _.get(error, 'response.body.message', error.message),
    error,
  });
};

export function fetch() {
  return dispatch => {
    dispatch({
      type: USER_FETCH,
    });
    return getUser().then(user => dispatch({
      type: USER_FETCH_SUCC,
      user,
    }));
  };
}

export function login(account, password) {
  return dispatch => {
    dispatch({
      type: USER_LOGIN,
    });
    return userLogin(account, password).then(user => dispatch({
      type: USER_LOGIN_SUCC,
      user,
    })).catch(fail(dispatch, USER_LOGIN_FAIL));
  };
}

export function register(account, password) {
  return dispatch => {
    dispatch({
      type: USER_REGISTER,
    });
    return addUser(account, password).then(user => dispatch({
      type: USER_REGISTER_SUCC,
      user,
    })).catch(fail(dispatch, USER_REGISTER_FAIL));
  };
}

export function logout() {
  return dispatch => {
    dispatch({
      type: USER_LOGOUT,
    });
    return userLogout().then(user => dispatch({
      type: USER_LOGOUT_SUCC,
      user,
    })).catch(fail(dispatch, USER_LOGOUT_FAIL));
  };
}
