'use strict';
import * as _ from 'lodash';

export function get(path, defaultValue) {
  return _.get(window, path, defaultValue);
}

export function set(path, value) {
  _.set(window, path, value);
}
