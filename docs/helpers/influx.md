# influx

写入统计数据到influxdb

## write

- `measurement` 统计数据的名称, String

- `fields` 该统计记录的fields, Object

- `tags` 该统计记录的tags, Object, optional

- `syncNow` 是否立即同步数据, Boolean, optional

```js
influx.write('http', {
  use: 30,
  bytes: 1024,
  path: '/user/session',
}, {
  spdy: '0', 
  size: '1',
}, true).then(data => {
  console.info(data);
}).catch(err => {
  console.error(err);
});
```