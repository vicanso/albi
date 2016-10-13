const path = require('path');

// 增加全局函数，localRequire，便于加载本项目的js文件
const localRequire = (name) => {
  const file = path.join(__dirname, '..', name);
  /* eslint import/no-dynamic-require:0 global-require:0 */
  return require(file);
};
global.localRequire = localRequire;
