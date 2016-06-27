'use strict';
/* eslint import/no-unresolved:0 */
import { combineReducers } from 'redux';
import user from './user';
import navigation from './navigation';

export default combineReducers({
  user,
  navigation,
});
