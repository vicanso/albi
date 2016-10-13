import {
  USER_INFO,
} from '../constants/action-types';

const defaultStates = {
};

export default function user(state = defaultStates, action) {
  switch (action.type) {
    case USER_INFO:
      return Object.assign({}, state, action.user);
    default:
      return state;
  }
}
