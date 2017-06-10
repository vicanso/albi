import {
  USER_INFO,
} from '../constants/action-types';

const defaultStates = {};

export default function user(state = defaultStates, action) {
  switch (action.type) {
    case USER_INFO: {
      const data = action.user;
      return Object.assign({}, state, data);
    }
    default:
      return state;
  }
}
