'use strict';
import * as types from '../constants/action-types';

export function register(account, password) {
  return {
    type: types.REGISTER,
    account,
    password,
  };
}