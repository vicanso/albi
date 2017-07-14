import * as request from '../helpers/request';

export function statistics(data) {
  return request.post('/api/stats/statistics', data);
}

export function exception(data) {
  return request.post('/api/stats/exception', data);
}
