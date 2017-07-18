const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const cssNext = require('postcss-cssnext');

const assetsPath = path.resolve(__dirname, 'assets');
const env = process.env.NODE_ENV || 'development';
const isWatchMode = process.argv.indexOf('--watch') !== -1;

const filehash = isWatchMode ? '' : '.[chunkhash]';


const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
  new CleanWebpackPlugin([assetsPath]),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vendor', 'react-base', 'material', 'utils'].reverse(),
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.js$/,
    exclude: /(vendor|react-base).js/,
    filename: `[name]${filehash}.map`,
  }),
];


// 开发环境中，使用非压缩的js
if (!isWatchMode) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
  }));
}


function getJsFile(file) {
  return path.resolve(__dirname, 'public/js', file);
}

module.exports = {
  entry: {
    // 基础工具类
    vendor: [
      'debug',
      'http-timing',
      'lodash',
      'query-string',
      'shortid',
      'superagent',
    ],
    // react 相关的一些模块
    'react-base': [
      'react',
      'prop-types',
      'react-dom',
      'redux-logger',
      'react-redux',
      'redux-thunk',
      'react-tap-event-plugin',
      'react-router-dom',
    ],
    material: [
      'material-ui',
      'material-ui-icons',
    ],
    // 自己扩展的一些工具类库
    utils: [
      getJsFile('helpers/crypto.js'),
      getJsFile('helpers/debug.js'),
      getJsFile('helpers/globals.js'),
      getJsFile('helpers/request.js'),
      getJsFile('helpers/utils.js'),
    ],
    // 基础css类库
    'base-css': [
      getJsFile('base-css.js'),
    ],
    app: getJsFile('views/app.js'),
    admin: getJsFile('views/admin.jsx'),
  },
  output: {
    filename: `[name]${filehash}.js`,
    path: path.resolve(assetsPath, 'bundle'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js[x]$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.sss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              parser: 'sugarss',
              plugins: () => [
                cssNext(),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins,
};
