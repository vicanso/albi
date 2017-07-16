import {
  USER_INFO,
  USER_LOGIN,
} from '../constants/action-type';

const defaultStates = {
  status: 'fetching',
};

export default function user(state = defaultStates, action) {
  switch (action.type) {
    case USER_INFO: {
      let status = 'logined';
      const data = action.user;
      if (data.anonymous) {
        status = '';
      }
      return Object.assign({}, state, data, {
        status,
      });
    }
    case USER_LOGIN: {
      return Object.assign({}, state, {
        status: 'login',
      });
    }
    default:
      return state;
  }
}
