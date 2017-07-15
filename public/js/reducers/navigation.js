import * as globals from '../helpers/globals';

const initSatte = {
  location: globals.get('location.pathname'),
  history: [],
};

export default function navigation(state = initSatte, action) {
  return initSatte;
}
