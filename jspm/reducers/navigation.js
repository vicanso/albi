'use strict';
import {
  LOCATION,
  LOCATION_BACK,
} from '../constants/action-types';
import * as urls from '../constants/urls';
const initState = {
  location: urls.HOME,
  history: [],
};

export default function navigation(state = initState, action) {
  let history;
  switch (action.type) {
    case LOCATION:
      history = state.history.slice(0);
      history.push(state.location);
      return Object.assign({}, state, {
        location: action.path,
        history,
      });
    case LOCATION_BACK: {
      history = state.history.slice(0);
      const path = history.pop();
      return Object.assign({}, state, {
        location: path,
        history,
      });
    }
    default:
      return state;
  }
}
