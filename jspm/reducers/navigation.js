'use strict';
import {
  LOCATION,
} from '../constants/action-types';
import * as urls from '../constants/urls';
const initState = {
  location: urls.HOME,
};

export default function navigation(state = initState, action) {
  switch (action.type)  {
    case LOCATION:
      return {
        ...state,
        location: action.path,
      };
    default:
      return state;
  }
}
