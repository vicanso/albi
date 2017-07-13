import * as request from './helpers/request';

request.get('/api/users/me')
  .noCache()
  .then((res) => {
    console.dir(res.body);
  });
