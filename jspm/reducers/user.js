'use strict';
import {
  USER_INFO,
} from '../constants/action-types';

const defaultStates = {
  account: '',
  password: '',
};

export default function user(state = defaultStates, action) {
  switch (action.type) {
    case USER_INFO:
      return Object.assign({}, this.state, action.user);
    default:
      return state;
  }
}
