import {
  USER_INFO,
} from '../constants/action-types';
import * as http from '../helpers/http';

let userToken = '';
// add user token for http request
http.use((req) => {
  if (userToken) {
    req.set('X-Token', userToken);
  }
});

const defaultStates = {
};

export default function user(state = defaultStates, action) {
  switch (action.type) {
    case USER_INFO:
      const user = action.user;
      if (userToken !== user.token) {
        userToken = user.token;
      }
      return Object.assign({}, state, user);
    default:
      return state;
  }
}
