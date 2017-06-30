# albi

- [configs](./setting.md) 程序相关的应用配置信息

- [helpers](./helpers.md) 一些基础的工具库

## localRrequire

自定义的全局函数，便于引入当前应用的代码，指定路径为程序根目录，其代码实现如下：

```js
function localRequire(name) {
  const ch = name[0];
  if (!ch || ch === '.' || ch === '/') {
    throw new Error(`the ${name} is invalid`);
  }
  const file = path.join(__dirname, name);
  /* eslint import/no-dynamic-require:0 global-require:0 */
  return require(file);
}
```
