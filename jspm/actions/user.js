'use strict';
import * as _  from 'lodash';
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
} from '../constants/action-types';
import * as UserService from '../services/user';

const fail = (dispatch, type) => {
  return (err) => {
    dispatch({
      type: type,
      message: _.get(err, 'response.body.message', err.message),
      error: err,
    });
  };
};

export function fetch() {
  return dispatch => {
    dispatch({
      type: USER_FETCH,
    });
    return UserService.me().then(user => dispatch({
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
    return UserService.login(account, password).then(user => dispatch({
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
    return UserService.add(account, password).then(user => dispatch({
      type: USER_REGISTER_SUCC,
      user,
    })).catch(fail(dispatch, USER_LOGIN_FAIL));
  };
}

export function logout() {
  return dispatch => {
    dispatch({
      type: USER_LOGOUT,
    });
    return UserService.logout().then(user => {

    }).catch(fail(dispatch, USER_LOGIN_FAIL));
  };
}