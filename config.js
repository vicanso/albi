const path = require('path');

const pkg = require('./package');

// the env of the applcation
const env = process.env.NODE_ENV || 'development';

exports.env = env;

// the application version
exports.version = pkg.version;

exports.app = pkg.name;

exports.viewPath = path.join(__dirname, 'views');

// http log format type
exports.httpLogFormat = ':request-id :method :url :status :length :response-time ms ":referrer"';
