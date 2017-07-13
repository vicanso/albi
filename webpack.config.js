const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const assetsPath = path.resolve(__dirname, 'assets');
const env = process.env.NODE_ENV || 'development';

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
  new CleanWebpackPlugin([assetsPath]),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vendor', 'utils'].reverse(),
  }),
  new webpack.SourceMapDevToolPlugin({
    test: /\.js$/,
    exclude: /vendor.js/,
    filename: '[name].[chunkhash].map',
  }),
];

// 开发环境中，使用非压缩的js
if (process.argv.indexOf('--watch') === -1) {
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
      getJsFile('helpers/debug.js'),
      getJsFile('helpers/request.js'),
    ],
    app: getJsFile('bootstrap.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(assetsPath, 'bundle'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins,
};
