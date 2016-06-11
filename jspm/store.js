'use strict';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

export default function create(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware, createLogger()),
  );
};