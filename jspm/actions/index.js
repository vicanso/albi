'use strict';
import * as types from '../constants/action-types';

export function doingRegister() {
  return {
    type: types.DOING_REGISTER,
  };
}

export function register(account, password) {
  return dispatch => {
    dispatch(doingRegister());
  }
  // return {
  //   type: types.REGISTER,
  //   account,
  //   password,
  // };
}