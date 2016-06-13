'use strict';
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

const defaultStates = {
  status: '',
  account: '',
  password: '',
};

export default function user(state = defaultStates, action) {
  switch (action.type) {
    case USER_FETCH:
    case USER_LOGIN:
    case USER_REGISTER:
    case USER_LOGOUT:
      return Object.assign({}, state, {
        status: 'fetching',
      });
    case USER_REGISTER_FAIL:
    case USER_LOGIN_FAIL:
    case USER_LOGOUT_FAIL:
      return Object.assign({}, state, {
        status: 'error',
        message: action.message,
        error: action.error,
      });
    case USER_REGISTER_SUCC:
    case USER_FETCH_SUCC:
    case USER_LOGIN_SUCC:
    case USER_LOGOUT_SUCC:
      return Object.assign({}, state, {
        status: '',
      }, action.user);
    default:
      return state;
  }
}
