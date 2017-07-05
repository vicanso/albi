const setting = localRequire('configs/setting');

setInterval(() => {
  setting.update();
}, 60 * 1000);
setting.update();
