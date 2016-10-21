const path = require('path');

const pkg = localRequire('package');
const env = process.env.NODE_ENV || 'development';

exports.version = pkg.version;

exports.env = env;

exports.port = process.env.PORT || 5018;

exports.app = pkg.name;

// exports.domain = 'albi.io';

// http://user:pass@127.0.0.1:8086/mydatabase
exports.influx = process.env.INFLUX;

// app url prefix for all request
exports.appUrlPrefix = env === 'development' ? '' : `/${pkg.name}`;

exports.staticOptions = {
  urlPrefix: '/static',
  path: env === 'development' ? path.join(__dirname, 'public') : path.join(__dirname, 'assets'),
  maxAge: env === 'development' ? 0 : 365 * 24 * 3600,
  headers: {
    Vary: 'Accept-Encoding',
  },
};

// view root path
exports.viewPath = path.join(__dirname, 'views');
// jspm file path
exports.jspmPath = path.join(__dirname, 'jspm');
// user track cookie
exports.trackCookie = '_jt';
/* eslint max-len:0 */
exports.httpLogFormat = ':token :request-id :method :url :status :length ":referrer"';
// http connection limit options
exports.connectLimitOptions = {
  mid: 100,
  high: 500,
  interval: 5000,
};
// cookie name
exports.session = {
  key: pkg.name,
  ttl: 48 * 3600 * 1000,
  maxAge: 24 * 3600 * 1000,
};
// admin token (jenny)
exports.adminToken = '6a3f4389a53c889b623e67f385f28ab8e84e5029';
// etcd server address http://192.168.99.100:2379/v2
exports.etcd = process.env.ETCD;
// application binding ip address
exports.IP = process.env.IP;
// mongodb uri
// mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase
exports.mongoUri = process.env.MONGO;
// redis uri
// [redis:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
exports.redisUri = process.env.REDIS;
