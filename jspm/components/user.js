'use strict';
import * as http from './http';

export const me = () => {
  return http.get('/users/me')
    .set('Cache-Control', 'no-cache')
    .set('Accept', 'application/vnd.albi.v1+json')
    .then(res => {
      console.dir(res.body);
    }).catch(err => {

    });
};