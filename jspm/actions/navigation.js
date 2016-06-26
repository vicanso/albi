'use strict';
import {
  LOCATION,
} from '../constants/action-types';

import * as urls from '../constants/urls';

export function to(path) {
  return dispatch => {
    dispatch({
      type: LOCATION,
      path,
    })
  };
}

export function register() {
  return to(urls.REGISTER);
}

export function home() {
  return to(urls.HOME);
}
