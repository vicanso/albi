import {
  USER_INFO,
} from '../constants/action-types';
import * as user from '../services/user';

export function login(account, password) {
  return dispatch => user.login(account, password).then(data => dispatch({
    type: USER_INFO,
    user: data,
  }));
}

export function register(account, password) {
  return dispatch => user.add(account, password).then(data => dispatch({
    type: USER_INFO,
    user: data,
  }));
}
