module.exports = [
  [
    'POST',
    '/mocks',
    [
      'm.admin',
      'm.tracker("addMock")',
      'c.mock.add',
    ],
  ],
  ['GET', '/mocks', 'm.noQuery & c.mock.list'],
  ['GET', '/mocks/:id', 'm.noQuery & c.mock.get'],
  [
    'PATCH',
    '/mocks/:id',
    [
      'm.admin',
      'm.tracker("updateMock")',
      'c.mock.update',
    ],
  ],
];
