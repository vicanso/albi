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
    name: ['vendor', 'utils', 'base-css'].reverse(),
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.js$/,
    exclude: /vendor.js/,
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
    vendor: [
      'debug',
      'http-timing',
      'lodash',
      'shortid',
      'superagent',
    ],
    utils: [
      getJsFile('helpers/crypto.js'),
      getJsFile('helpers/debug.js'),
      getJsFile('helpers/globals.js'),
      getJsFile('helpers/request.js'),
    ],
    'base-css': [
      getJsFile('base-css.js'),
    ],
    app: getJsFile('bootstrap.js'),
  },
  output: {
    filename: `[name]${filehash}.js`,
    path: path.resolve(assetsPath, 'bundle'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
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
