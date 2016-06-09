'use strict';
import * as http from './http';

export const me = () => {
  return http.get('/users/me')
    .set('Cache-Control', 'no-cache')
    .set('Accept', 'application/vnd.albi.v1+json')
    .then(res => {
      return res.body;
    }, err => {
      if (err.status === 403) {
        return {};
      }
      throw err;
    });
};