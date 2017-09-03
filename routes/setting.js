module.exports = [
  ['GET', '/settings/:id', 'm.admin & c.setting.get'],
  ['GET', '/settings', 'm.admin & c.setting.list'],
  ['POST', '/settings',
    [
      'm.admin',
      'm.tracker("addSetting")',
      'c.setting.add',
    ],
  ],
  [
    'PATCH', '/settings/:id',
    [
      'm.admin',
      'm.tracker("updateSetting")',
      'c.setting.update',
    ],
  ],
];
