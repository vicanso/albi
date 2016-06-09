'use strict';
import { createStore } from 'redux';
import rootReducer from './reducers/index';

export default function create(preloadedState) {
  return createStore(rootReducer, preloadedState);
};