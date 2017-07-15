/* eslint import/no-extraneous-dependencies:0 */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

export default function create(reducers, preloadedState) {
  const rootReducer = combineReducers(reducers);
  return createStore(rootReducer, preloadedState, applyMiddleware(
    thunkMiddleware,
    createLogger,
  ));
}
