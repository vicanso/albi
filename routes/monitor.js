module.exports = [
  ['GET', '/monitors', 'c.monitor.get'],
  [
    'PATCH',
    '/monitors/:id',
    [
      'm.admin',
      'm.tracker("updateMonitor")',
      'c.monitor.update',
    ],
  ],
  [
    'POST',
    '/monitors',
    [
      'm.admin',
      'm.tracker("addMonitor")',
      'c.monitor.add',
    ],
  ],
];
