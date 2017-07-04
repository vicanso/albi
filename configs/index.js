const path = require('path');

const pkg = localRequire('package');

exports.port = process.env.PORT || 5018;

// the env of the applcation
const env = process.env.NODE_ENV || 'development';

exports.env = env;

// the application version
exports.version = pkg.version;

exports.app = pkg.name;

exports.viewPath = path.join(__dirname, 'views');

// http log format type
exports.httpLogFormat = ':request-id :method :url :status :length :response-time ms ":referrer"';

// http://user:pass@127.0.0.1:8086/mydatabase
exports.influx = process.env.INFLUX || '';

// logger setting "console", "udp://127.0.0.1:5001"
exports.logger = process.env.LOG || '';

// mongodb connection uri
exports.mongoUri = process.env.MONGO || 'mongodb://127.0.0.1/albi';

// redis connection uri
exports.redisUri = process.env.REDIS || 'redis://127.0.0.1/';

// cookie name
exports.session = {
  key: pkg.name,
  maxAge: 7 * 24 * 3600 * 1000,
};

// http connection limit options
exports.connectLimitOptions = {
  mid: 100,
  high: 500,
  interval: 5000,
};

exports.staticOptions = {
  urlPrefix: '/static',
  path: env === 'development' ? path.join(__dirname, 'public') : path.join(__dirname, 'assets'),
  maxAge: env === 'development' ? 0 : 365 * 24 * 3600,
  headers: {
    Vary: 'Accept-Encoding',
  },
  host: process.env.STATIC_HOST || '',
};
