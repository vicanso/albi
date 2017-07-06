const assert = require('assert');

localRequire('app');
const {
  selfRequest,
} = localRequire('helpers/utils');

describe('controllers/stats', () => {
  it('ajax stats', () => selfRequest('post', '/api/stats/ajax')
    .send([
      {
        name: 'test',
        use: 3,
      },
    ])
    .then((res) => {
      assert.equal(res.status, 201);
    }));

  it('exception stats', () => selfRequest('post', '/api/stats/exception')
    .send([
      {
        message: 'error',
      },
    ])
    .then((res) => {
      assert.equal(res.status, 201);
    }));

  it('statistics stats', () => selfRequest('post', '/api/stats/statistics')
    .send({
      screen: {
        width: 100,
        height: 100,
      },
      timing: {
        js: 230,
        html: 500,
      },
    })
    .then((res) => {
      assert.equal(res.status, 201);
    }));
});
