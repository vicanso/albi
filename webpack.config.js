'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
	context: path.join(__dirname, 'public/components'),
	entry: {
		vendor: ['lodash', 'debug', 'angular'],
		app: ['./app.js']
	},
	output: {
		path: path.join(__dirname, 'assets/components'),
		filename: '[name].js'
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
	],
	module: {
		loaders: [{
			test: /\.js[x]?$/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react']
			}
		}]
	}
};