'use strict';
import * as http from './http';

export const me = () => {
  return http.get('/users/me')
    .set('Cache-Control', 'no-cache')
    .then(res => {
      return res.body;
    }, err => {
      if (err.status === 403) {
        return {};
      }
      throw err;
    });
};

export const add = (data) => {
  return http.post('/users/register')
    .send(data)
    .then(res => {
      return res.body;
    });
};