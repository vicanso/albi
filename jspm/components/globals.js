'use strict';
import * as _ from 'lodash';
// MOCK 
// TIMING
// screen
// CONFIG

export function get(path, defaultValue) {
  return _.get(window, path, defaultValue);
}

export function set(path, value) {
  _.set(window, path, value);
}