module.exports = [
  ['GET', '/i18ns', 'c.i18n.list'],
  ['GET', '/i18ns/categories', 'm.noQuery & c.i18n.listCategory'],
  ['GET', '/i18ns/lang', 'c.i18n.selectByLang'],
  ['GET', '/i18ns/:id', 'm.noQuery & c.i18n.get'],
  ['POST', '/i18ns', 'm.admin & m.tracker("addI18n") & c.i18n.add'],
  [
    'PATCH',
    '/i18ns/:id',
    [
      'm.admin',
      'm.tracker("updateI18n")',
      'c.i18n.update',
    ],
  ],
  [
    'POST',
    '/i18ns/init',
    [
      'c.i18n.init',
    ],
  ],
];
