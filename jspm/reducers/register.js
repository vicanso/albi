'use strict';
import { REGISTER } from '../constants/action-types';

const defaultStates = {
  account: '',
  password: '',
};

export default function register(state = defaultStates, action) {
  return state;
}